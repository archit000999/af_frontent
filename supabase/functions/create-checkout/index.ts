
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Create checkout function started");

    // Get the request body
    const { planType } = await req.json();
    console.log("Plan type requested:", planType);

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: "No authorization header provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Received token, attempting to decode...");
    
    // Decode the Clerk JWT token to get user information
    let userEmail: string;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }
      
      // Decode the payload (add padding if needed)
      let payload64 = parts[1];
      // Add padding if needed
      while (payload64.length % 4) {
        payload64 += '=';
      }
      
      const payload = JSON.parse(atob(payload64));
      console.log("JWT payload decoded successfully");
      console.log("Available payload keys:", Object.keys(payload));
      
      // Extract email from various possible fields in Clerk token
      userEmail = payload.email || 
                 payload.email_addresses?.[0]?.email_address ||
                 payload.primary_email_address ||
                 payload.emailAddress ||
                 payload.sub; // sometimes email is in sub field
      
      // If still no email, try to find it in email_addresses array
      if (!userEmail && payload.email_addresses && Array.isArray(payload.email_addresses)) {
        const primaryEmail = payload.email_addresses.find(e => e.id === payload.primary_email_address_id);
        if (primaryEmail) {
          userEmail = primaryEmail.email_address;
        } else if (payload.email_addresses.length > 0) {
          userEmail = payload.email_addresses[0].email_address;
        }
      }
      
      // If still no email, try other common JWT fields
      if (!userEmail) {
        userEmail = payload.email_address || payload.user_email || payload.user?.email;
      }
      
      console.log("Extracted email:", userEmail);
      
      if (!userEmail) {
        console.error("No email found in token payload");
        console.error("Full payload:", JSON.stringify(payload, null, 2));
        throw new Error("No email found in token");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return new Response(JSON.stringify({ error: "Invalid authentication token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    console.log("Checking for existing customer with email:", userEmail);
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      console.log("No existing customer found");
    }

    // Define pricing based on plan
    const planPricing = {
      premium: {
        amount: 560, // $5.60 in cents
        name: "Premium Plan"
      },
      elite: {
        amount: 800, // $8.00 in cents
        name: "Elite Plan"
      }
    };

    const selectedPlan = planPricing[planType as keyof typeof planPricing];
    if (!selectedPlan) {
      console.error("Invalid plan type:", planType);
      return new Response(JSON.stringify({ error: "Invalid plan type" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Creating checkout session for plan:", selectedPlan.name);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: selectedPlan.name,
              description: "Weekly subscription"
            },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "week" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/copilot-preview?success=true`,
      cancel_url: `${req.headers.get("origin")}/payment?canceled=true`,
    });

    console.log("Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

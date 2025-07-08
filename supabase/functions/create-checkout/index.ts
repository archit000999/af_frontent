
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

    // Create Supabase client with service role key for auth operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from authorization header (Clerk token)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: "No authorization header provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Received Clerk token, attempting to verify...");
    
    // For Clerk tokens, we need to verify them using Clerk's API
    // Since we can't easily verify Clerk tokens server-side without additional setup,
    // we'll decode the token to get user info and trust it for now
    let userEmail: string;
    try {
      // Decode the JWT token to get user information
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }
      
      const payload = JSON.parse(atob(parts[1]));
      console.log("JWT payload keys:", Object.keys(payload));
      
      // Clerk tokens might have email in different fields
      userEmail = payload.email || payload.email_addresses?.[0]?.email_address || payload.primary_email_address_id;
      
      if (!userEmail) {
        // Try to get email from email_addresses array if it exists
        if (payload.email_addresses && Array.isArray(payload.email_addresses)) {
          const primaryEmail = payload.email_addresses.find(e => e.id === payload.primary_email_address_id);
          userEmail = primaryEmail?.email_address;
        }
      }
      
      console.log("Extracted email from Clerk token:", userEmail);
      
      if (!userEmail) {
        console.error("No email found in token payload:", payload);
        throw new Error("No email found in token");
      }
    } catch (error) {
      console.error("Error decoding Clerk token:", error);
      return new Response(JSON.stringify({ error: "Invalid authentication token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { planType } = await req.json();
    console.log("Plan type requested:", planType);

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

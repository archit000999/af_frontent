
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== CREATE CHECKOUT FUNCTION STARTED ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request (CORS preflight)");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing POST request...");

    // Get the request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed successfully:", requestBody);
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { planType, userEmail } = requestBody;
    console.log("Plan type requested:", planType);
    console.log("User email:", userEmail);

    if (!userEmail) {
      console.error("❌ No user email provided");
      return new Response(JSON.stringify({ error: "User email is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get Stripe secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("❌ STRIPE_SECRET_KEY not configured");
      return new Response(JSON.stringify({ error: "Payment system not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log("✅ Stripe key configured");

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Define plan configurations
    const planConfigs = {
      premium: {
        name: "Premium",
        price: 560, // $5.60 in cents
        description: "Perfect for job seekers who want automated applications"
      },
      elite: {
        name: "Elite", 
        price: 800, // $8.00 in cents
        description: "Advanced features for serious job hunters"
      }
    };

    const selectedPlan = planConfigs[planType as keyof typeof planConfigs];
    if (!selectedPlan) {
      console.error("❌ Invalid plan type:", planType);
      return new Response(JSON.stringify({ error: "Invalid plan type" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("✅ Plan selected:", selectedPlan);

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("✅ Existing customer found:", customerId);
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_email: userEmail
        }
      });
      customerId = customer.id;
      console.log("✅ New customer created:", customerId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `JobCopilot ${selectedPlan.name}`,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: "week",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment`,
      metadata: {
        user_email: userEmail,
        plan_type: planType,
        plan_name: selectedPlan.name,
      },
    });

    console.log("✅ Checkout session created:", session.id);

    // Notify Make.com webhook
    try {
      const webhookData = {
        event_type: "checkout_session_created",
        session_id: session.id,
        customer_id: customerId,
        user_email: userEmail,
        plan_type: planType,
        plan_name: selectedPlan.name,
        amount: selectedPlan.price,
        currency: "usd",
        checkout_url: session.url,
        timestamp: new Date().toISOString()
      };

      console.log("📞 Calling Make.com webhook with data:", webhookData);

      const webhookResponse = await fetch("https://hook.us2.make.com/yavjzsk5k7vjlss1lsffv1rei212y0fw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      });

      if (webhookResponse.ok) {
        console.log("✅ Make.com webhook called successfully");
      } else {
        console.error("⚠️ Make.com webhook call failed:", webhookResponse.status);
      }
    } catch (webhookError) {
      console.error("⚠️ Error calling Make.com webhook:", webhookError);
      // Don't fail the main flow if webhook fails
    }

    return new Response(JSON.stringify({ 
      url: session.url,
      session_id: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Unhandled error in create-checkout:", error);
    console.error("Error stack:", error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

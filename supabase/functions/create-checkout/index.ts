
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

    const { planType } = requestBody;
    console.log("Plan type requested:", planType);

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    console.log("=== AUTHORIZATION CHECK ===");
    console.log("Authorization header present:", !!authHeader);
    
    if (!authHeader) {
      console.error("❌ No authorization header provided");
      return new Response(JSON.stringify({ error: "No authorization header provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    console.log("Authorization header format:", authHeader.startsWith("Bearer ") ? "✅ Correct Bearer format" : "❌ Invalid format");

    // Get Stripe secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("❌ STRIPE_SECRET_KEY not configured");
      return new Response(JSON.stringify({ error: "Payment system not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from auth token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      console.error("❌ User authentication failed:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;
    console.log("✅ User authenticated:", user.email);

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
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("✅ Existing customer found:", customerId);
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id
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
        user_id: user.id,
        user_email: user.email,
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
        user_id: user.id,
        user_email: user.email,
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


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

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request (CORS preflight)");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planType, userEmail } = await req.json();
    console.log("Creating checkout for:", { planType, userEmail });

    if (!planType || !userEmail) {
      console.error("❌ Missing required fields");
      return new Response(JSON.stringify({ error: "Plan type and user email are required" }), {
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

    // Initialize Stripe and Supabase
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("✅ Found existing customer:", customerId);
    }

    // Define plan details
    const planDetails = {
      premium: {
        name: "Premium Plan",
        amount: 560, // $5.60 in cents
        currency: "usd"
      },
      elite: {
        name: "Elite Plan", 
        amount: 800, // $8.00 in cents
        currency: "usd"
      }
    };

    const selectedPlan = planDetails[planType as keyof typeof planDetails];
    if (!selectedPlan) {
      console.error("❌ Invalid plan type:", planType);
      return new Response(JSON.stringify({ error: "Invalid plan type" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: selectedPlan.currency,
            product_data: { name: selectedPlan.name },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "week" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment`,
    });

    console.log("✅ Checkout session created:", session.id);

    // Store payment record in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_email: userEmail,
        stripe_customer_id: customerId,
        stripe_session_id: session.id,
        plan_type: planType,
        plan_name: selectedPlan.name,
        amount: selectedPlan.amount,
        currency: selectedPlan.currency,
        status: 'pending'
      });

    if (paymentError) {
      console.error("❌ Error storing payment record:", paymentError);
      // Don't fail the checkout creation, just log the error
    } else {
      console.log("✅ Payment record stored in database");
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Error in create-checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

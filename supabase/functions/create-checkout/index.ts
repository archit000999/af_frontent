
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
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request (CORS preflight)");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Attempting to parse request body...");
    const requestBody = await req.text();
    console.log("Raw request body:", requestBody);
    
    if (!requestBody) {
      console.error("❌ Empty request body");
      return new Response(JSON.stringify({ error: "Empty request body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { planType, userEmail } = JSON.parse(requestBody);
    console.log("Parsed - Creating checkout for plan:", planType);
    console.log("Parsed - User email:", userEmail);

    if (!planType || !userEmail) {
      console.error("❌ Plan type or user email not provided");
      console.error("Plan type:", planType);
      console.error("User email:", userEmail);
      return new Response(JSON.stringify({ error: "Plan type and user email are required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get Stripe secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("Stripe key exists:", !!stripeKey);
    console.log("Stripe key prefix:", stripeKey ? stripeKey.substring(0, 8) + "..." : "none");
    console.log("Stripe key type:", stripeKey ? (stripeKey.startsWith('sk_live_') ? 'LIVE' : stripeKey.startsWith('sk_test_') ? 'TEST' : 'UNKNOWN') : 'NONE');
    
    if (!stripeKey) {
      console.error("❌ STRIPE_SECRET_KEY not configured");
      return new Response(JSON.stringify({ error: "Payment system not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Validate Stripe key format
    if (!stripeKey.startsWith('sk_')) {
      console.error("❌ Invalid Stripe key format - must start with 'sk_'");
      return new Response(JSON.stringify({ error: "Invalid payment configuration" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Initialize Supabase with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("✅ Using user email from request:", userEmail);

    // Initialize Stripe
    console.log("🔄 Initializing Stripe...");
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Test Stripe connection with detailed error handling
    try {
      console.log("🔄 Testing Stripe connection...");
      const testResult = await stripe.customers.list({ limit: 1 });
      console.log("✅ Stripe connection successful");
      console.log("✅ Stripe account info - has_more:", testResult.has_more);
    } catch (stripeError) {
      console.error("❌ Stripe connection failed:", stripeError);
      console.error("❌ Stripe error type:", stripeError.type);
      console.error("❌ Stripe error code:", stripeError.code);
      console.error("❌ Stripe error message:", stripeError.message);
      console.error("❌ Stripe error param:", stripeError.param);
      
      let errorMessage = "Payment system connection failed";
      if (stripeError.code === 'account_invalid') {
        errorMessage = "Stripe account not activated for live payments. Please complete your account setup in Stripe Dashboard.";
      } else if (stripeError.code === 'api_key_expired') {
        errorMessage = "Stripe API key has expired. Please generate a new one.";
      } else if (stripeError.code === 'testmode_charges_only') {
        errorMessage = "This Stripe account can only accept test payments. Please activate live payments.";
      } else if (stripeError.code === 'account_restricted') {
        errorMessage = "Stripe account is restricted. Please check your account status in Stripe Dashboard.";
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: stripeError.message,
        stripeErrorCode: stripeError.code,
        stripeErrorType: stripeError.type
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Check if customer exists
    console.log("🔄 Checking for existing customer...");
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId = null;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("✅ Found existing customer:", customerId);
    } else {
      console.log("ℹ️ No existing customer found, will create one during checkout");
    }

    // Define plan details
    const planDetails = {
      premium: {
        name: "Premium Plan",
        amount: 2900, // $29 in cents
      },
      elite: {
        name: "Elite Plan", 
        amount: 4900, // $49 in cents
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

    console.log("💰 Creating checkout session for:", selectedPlan);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPlan.name,
            },
            unit_amount: selectedPlan.amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment`,
    });

    console.log("✅ Stripe checkout session created:", session.id);

    // Create payment record in database
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_email: userEmail,
        stripe_customer_id: customerId,
        stripe_session_id: session.id,
        plan_type: planType,
        plan_name: selectedPlan.name,
        amount: selectedPlan.amount,
        currency: 'usd',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error("❌ Error creating payment record:", paymentError);
      return new Response(JSON.stringify({ error: "Failed to create payment record" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log("✅ Payment record created:", paymentData);

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Error in create-checkout:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      errorType: error.name,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

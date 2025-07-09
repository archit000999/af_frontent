
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== HANDLE PAYMENT SUCCESS FUNCTION STARTED ===");
  console.log("Request method:", req.method);

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request (CORS preflight)");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    console.log("Processing payment success for session:", sessionId);

    if (!sessionId) {
      console.error("❌ No session ID provided");
      return new Response(JSON.stringify({ error: "Session ID is required" }), {
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

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });
    console.log("✅ Retrieved session:", session.id);
    console.log("Session payment status:", session.payment_status);
    console.log("Session customer email:", session.customer_details?.email);

    // Check if the payment record exists
    const { data: existingPayment, error: checkError } = await supabase
      .from('payments')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    console.log("🔍 Existing payment record:", existingPayment);
    console.log("🔍 Check error:", checkError);

    if (!existingPayment) {
      console.error("❌ No payment record found for session:", sessionId);
      return new Response(JSON.stringify({ error: "Payment record not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    if (session.payment_status === 'paid') {
      // Get subscription details if it's a subscription
      let stripeSubscriptionId = null;
      if (session.subscription && typeof session.subscription === 'object') {
        stripeSubscriptionId = session.subscription.id;
        console.log("✅ Subscription ID from object:", stripeSubscriptionId);
      } else if (typeof session.subscription === 'string') {
        stripeSubscriptionId = session.subscription;
        console.log("✅ Subscription ID from string:", stripeSubscriptionId);
      }

      // Update payment status in database
      const { data: updateData, error } = await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          stripe_subscription_id: stripeSubscriptionId,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', sessionId)
        .select();

      console.log("📝 Update result data:", updateData);
      console.log("📝 Update result error:", error);

      if (error) {
        console.error("❌ Error updating payment status:", error);
        return new Response(JSON.stringify({ error: "Failed to update payment status" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      console.log("✅ Payment status updated to completed for session:", sessionId);
      
      // Verify the update worked by querying again
      const { data: verifyData, error: verifyError } = await supabase
        .from('payments')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .maybeSingle();

      console.log("🔍 Payment record after update:", verifyData);
      console.log("🔍 Verify error:", verifyError);
    } else {
      console.log("⚠️ Payment status is not 'paid', current status:", session.payment_status);
    }

    return new Response(JSON.stringify({ 
      success: true,
      payment_status: session.payment_status,
      subscription_id: session.subscription
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Error in handle-payment-success:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

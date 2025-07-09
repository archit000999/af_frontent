
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

    if (session.payment_status === 'paid') {
      // Get subscription details if it's a subscription
      let stripeSubscriptionId = null;
      if (session.subscription && typeof session.subscription === 'object') {
        stripeSubscriptionId = session.subscription.id;
      } else if (typeof session.subscription === 'string') {
        stripeSubscriptionId = session.subscription;
      }

      // Update payment status in database
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          stripe_subscription_id: stripeSubscriptionId,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', sessionId);

      if (error) {
        console.error("❌ Error updating payment status:", error);
        return new Response(JSON.stringify({ error: "Failed to update payment status" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      console.log("✅ Payment status updated to completed");
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

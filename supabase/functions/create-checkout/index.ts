

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

    // Log all headers for debugging
    console.log("=== REQUEST HEADERS ===");
    for (const [key, value] of req.headers.entries()) {
      // Don't log the full authorization header for security, just its presence
      if (key.toLowerCase() === 'authorization') {
        console.log(`${key}: Bearer ${value ? '[TOKEN_PRESENT]' : '[NO_TOKEN]'}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Check for environment variables
    console.log("=== ENVIRONMENT CHECK ===");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("STRIPE_SECRET_KEY present:", !!stripeKey);
    if (stripeKey) {
      console.log("STRIPE_SECRET_KEY starts with:", stripeKey.substring(0, 7) + "...");
    }

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

    const token = authHeader.replace("Bearer ", "");
    console.log("Token extracted, length:", token.length);
    console.log("Token preview:", token.substring(0, 20) + "...");
    
    // Decode the Clerk JWT token to get user information
    let userEmail: string;
    console.log("=== JWT DECODING ===");
    try {
      console.log("Attempting to decode JWT token...");
      const parts = token.split('.');
      console.log("JWT parts count:", parts.length);
      
      if (parts.length !== 3) {
        console.error("❌ Invalid JWT format - expected 3 parts, got:", parts.length);
        throw new Error("Invalid JWT format");
      }
      
      console.log("JWT header length:", parts[0].length);
      console.log("JWT payload length:", parts[1].length);
      console.log("JWT signature length:", parts[2].length);
      
      // Decode the payload (add padding if needed)
      let payload64 = parts[1];
      console.log("Original payload length:", payload64.length);
      
      // Add padding if needed
      const paddingNeeded = 4 - (payload64.length % 4);
      if (paddingNeeded !== 4) {
        payload64 += '='.repeat(paddingNeeded);
        console.log("Added padding, new length:", payload64.length);
      }
      
      console.log("Attempting to decode base64 payload...");
      let decodedPayload;
      try {
        decodedPayload = atob(payload64);
        console.log("✅ Base64 decode successful, length:", decodedPayload.length);
      } catch (error) {
        console.error("❌ Base64 decode failed:", error);
        throw new Error("Failed to decode JWT payload");
      }
      
      console.log("Attempting to parse JSON payload...");
      let payload;
      try {
        payload = JSON.parse(decodedPayload);
        console.log("✅ JSON parse successful");
        console.log("Payload keys:", Object.keys(payload));
      } catch (error) {
        console.error("❌ JSON parse failed:", error);
        throw new Error("Failed to parse JWT payload JSON");
      }
      
      // Log relevant payload fields for debugging (without sensitive data)
      console.log("=== PAYLOAD ANALYSIS ===");
      console.log("Has 'email' field:", 'email' in payload);
      console.log("Has 'email_addresses' field:", 'email_addresses' in payload);
      console.log("Has 'primary_email_address_id' field:", 'primary_email_address_id' in payload);
      console.log("Has 'sub' field:", 'sub' in payload);
      
      // Extract email from various possible fields in Clerk token
      console.log("=== EMAIL EXTRACTION ===");
      userEmail = payload.email || 
                 payload.email_addresses?.[0]?.email_address ||
                 payload.primary_email_address ||
                 payload.emailAddress ||
                 payload.sub; // sometimes email is in sub field
      
      console.log("Initial email extraction result:", userEmail ? "✅ Found" : "❌ Not found");
      
      // If still no email, try to find it in email_addresses array
      if (!userEmail && payload.email_addresses && Array.isArray(payload.email_addresses)) {
        console.log("Searching in email_addresses array...");
        console.log("Email addresses count:", payload.email_addresses.length);
        
        const primaryEmail = payload.email_addresses.find(e => e.id === payload.primary_email_address_id);
        if (primaryEmail) {
          userEmail = primaryEmail.email_address;
          console.log("✅ Found primary email in array");
        } else if (payload.email_addresses.length > 0) {
          userEmail = payload.email_addresses[0].email_address;
          console.log("✅ Using first email from array");
        }
      }
      
      // If still no email, try other common JWT fields
      if (!userEmail) {
        console.log("Trying alternative email fields...");
        userEmail = payload.email_address || payload.user_email || payload.user?.email;
        console.log("Alternative fields result:", userEmail ? "✅ Found" : "❌ Not found");
      }
      
      console.log("Final email extraction:", userEmail ? "✅ Success" : "❌ Failed");
      
      if (!userEmail) {
        console.error("❌ No email found in token payload");
        console.error("Full payload structure:", JSON.stringify(payload, null, 2));
        throw new Error("No email found in token");
      }

      console.log("✅ Email successfully extracted");
      
    } catch (error) {
      console.error("❌ Error decoding token:", error);
      console.error("Error details:", error.message);
      return new Response(JSON.stringify({ error: "Invalid authentication token", details: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    console.log("=== STRIPE INITIALIZATION ===");
    if (!stripeKey) {
      console.error("❌ STRIPE_SECRET_KEY not found in environment");
      return new Response(JSON.stringify({ error: "Stripe configuration missing" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });
    console.log("✅ Stripe client initialized");

    // Check if customer exists
    console.log("=== CUSTOMER LOOKUP ===");
    console.log("Looking up customer with email...");
    let customers;
    try {
      customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      console.log("✅ Customer lookup successful");
      console.log("Customers found:", customers.data.length);
    } catch (error) {
      console.error("❌ Customer lookup failed:", error);
      return new Response(JSON.stringify({ error: "Failed to lookup customer", details: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("✅ Found existing customer:", customerId);
    } else {
      console.log("ℹ️ No existing customer found");
    }

    // Define pricing based on plan
    console.log("=== PLAN CONFIGURATION ===");
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
      console.error("❌ Invalid plan type:", planType);
      console.error("Available plans:", Object.keys(planPricing));
      return new Response(JSON.stringify({ error: "Invalid plan type" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("✅ Plan selected:", selectedPlan.name, "Amount:", selectedPlan.amount);

    console.log("=== CHECKOUT SESSION CREATION ===");
    const origin = req.headers.get("origin");
    console.log("Request origin:", origin);

    try {
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
        success_url: `${origin}/copilot-preview?success=true`,
        cancel_url: `${origin}/payment?canceled=true`,
      });

      console.log("✅ Checkout session created successfully");
      console.log("Session ID:", session.id);
      console.log("Session URL present:", !!session.url);

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("❌ Checkout session creation failed:", error);
      console.error("Error details:", error.message);
      return new Response(JSON.stringify({ error: "Failed to create checkout session", details: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

  } catch (error) {
    console.error("❌ Unhandled error in create-checkout:", error);
    console.error("Error stack:", error.stack);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});


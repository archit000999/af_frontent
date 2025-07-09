
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    // Placeholder response for now
    console.log("Payment integration temporarily disabled");
    
    return new Response(JSON.stringify({ 
      message: "Payment integration coming soon",
      planType: planType 
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

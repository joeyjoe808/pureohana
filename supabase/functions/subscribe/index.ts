// Follow Supabase Edge Function format
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
}

// Simple rate limiting implementation
const rateLimits = new Map<string, { count: number, resetTime: number }>();

function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now();
  
  // Clean up expired entries
  for (const [key, data] of rateLimits.entries()) {
    if (data.resetTime < now) {
      rateLimits.delete(key);
    }
  }
  
  // Get or create rate limit info for this IP
  const rateLimit = rateLimits.get(ip) || { count: 0, resetTime: now + windowMs };
  
  // Increment count
  rateLimit.count++;
  
  // Store updated rate limit info
  rateLimits.set(ip, rateLimit);
  
  // Check if limit is exceeded
  return rateLimit.count <= maxAttempts;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { headers: corsHeaders, status: 405 }
    )
  }
  
  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for") || "unknown";
  
  // Check rate limit - max 5 requests per minute
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ 
        error: "Too many requests", 
        code: "rate_limit_exceeded",
        message: "Please try again later." 
      }),
      { headers: corsHeaders, status: 429 }
    )
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    )

    // Get request data
    const requestData = await req.json()
    let { email, source = "website" } = requestData
    
    // Trim the email to remove any whitespace
    email = email.trim()

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid email address", 
          code: "invalid_email",
          message: "Please provide a valid email address." 
        }),
        { headers: corsHeaders, status: 400 }
      )
    }
    
    // Additional basic input validation
    if (email.length > 255) {
      return new Response(
        JSON.stringify({ 
          error: "Email too long", 
          code: "invalid_input",
          message: "Email address exceeds maximum length." 
        }),
        { headers: corsHeaders, status: 400 }
      )
    }
    
    if (source && source.length > 50) {
      return new Response(
        JSON.stringify({ 
          error: "Source too long", 
          code: "invalid_input",
          message: "Source parameter exceeds maximum length." 
        }),
        { headers: corsHeaders, status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingSubscriber, error: lookupError } = await supabaseClient
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (lookupError) {
      throw lookupError
    }

    // If subscriber exists but is inactive, return info for client to handle reactivation
    if (existingSubscriber) {
      return new Response(
        JSON.stringify({ 
          message: "Email already exists", 
          code: "already_exists",
          active: existingSubscriber.active 
        }),
        { headers: corsHeaders, status: 409 }
      )
    }

    // Insert new subscriber
    const { error: insertError } = await supabaseClient
      .from("newsletter_subscribers")
      .insert([{ 
        email, 
        source, 
        active: true,
        subscribed_at: new Date().toISOString()
      }])

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ 
        message: "Successfully subscribed to newsletter",
        success: true 
      }),
      { headers: corsHeaders, status: 201 }
    )

  } catch (error) {
    console.error("Error:", error)
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message || "An unexpected error occurred" 
      }),
      { headers: corsHeaders, status: 500 }
    )
  }
})
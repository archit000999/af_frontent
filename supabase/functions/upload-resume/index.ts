
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Upload resume function called');

    // Get the authorization header from Clerk
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clerkToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Received Clerk token (first 10 chars):', clerkToken.substring(0, 10));

    // Validate Clerk token by calling Clerk's user endpoint
    let clerkUser;
    try {
      const clerkResponse = await fetch('https://clerk.applyfirst.trysaki.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${clerkToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Clerk response status:', clerkResponse.status);
      
      if (!clerkResponse.ok) {
        const errorText = await clerkResponse.text();
        console.log('Clerk API error response:', errorText);
        return new Response(
          JSON.stringify({ error: 'Invalid authentication token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      clerkUser = await clerkResponse.json();
      console.log('Validated user ID from Clerk:', clerkUser.id);
    } catch (error) {
      console.error('Error validating Clerk token:', error);
      return new Response(
        JSON.stringify({ error: 'Authentication validation failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = clerkUser.id;

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file provided in request');
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Create Supabase client with service role key for server-side operations
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    console.log('Generated file path:', fileName);

    // Upload file to Supabase Storage
    const fileArrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
      .from('resumes')
      .upload(fileName, fileArrayBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Supabase storage error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File uploaded successfully:', uploadData);

    // Get the public URL (note: bucket is private, so this URL won't work directly)
    const { data: { publicUrl } } = supabaseServiceRole.storage
      .from('resumes')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);

    // Return success response
    const response = {
      fileName: file.name,
      filePath: fileName,
      fileUrl: publicUrl,
      userId: userId
    };

    console.log('Upload successful, returning response:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in upload-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { verify } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';
import { decode } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLERK_JWKS_URL = 'https://clerk.applyfirst.trysaki.com/.well-known/jwks.json';

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

    // Validate Clerk JWT token using JWKS
    let userId;
    try {
      // Fetch JWKS from Clerk
      const jwksResponse = await fetch(CLERK_JWKS_URL);
      if (!jwksResponse.ok) {
        throw new Error('Failed to fetch JWKS');
      }
      const jwks = await jwksResponse.json();
      
      // Decode the token to get the header
      const [header] = decode(clerkToken);
      if (!header || !header.kid) {
        throw new Error('Invalid token header');
      }
      
      // Find the matching key from JWKS
      const key = jwks.keys.find((k: any) => k.kid === header.kid);
      if (!key) {
        throw new Error('No matching key found in JWKS');
      }
      
      // Import the key for verification
      const cryptoKey = await crypto.subtle.importKey(
        'jwk',
        key,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
      );
      
      // Verify the token
      const payload = await verify(clerkToken, cryptoKey);
      console.log('JWT verified successfully, user ID:', payload.sub);
      
      userId = payload.sub as string;
    } catch (error) {
      console.error('Error validating Clerk JWT token:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only PDF and Word documents are allowed.' }),
        { status: 415, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key for server-side operations
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${userId}_${timestamp}_${sanitizedFileName}`;
    const filePath = `resumes/${fileName}`;
    
    console.log('Generated file path:', filePath);

    try {
      // Upload file to Supabase Storage
      const fileArrayBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
        .from('resumes')
        .upload(filePath, fileArrayBuffer, {
          cacheControl: '3600',
          upsert: false,
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

      // Since bucket is private, generate signed URL for access
      const { data: signedUrlData, error: signedUrlError } = await supabaseServiceRole.storage
        .from('resumes')
        .createSignedUrl(filePath, 3600 * 24 * 365); // 1 year expiry

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError);
        // Cleanup uploaded file on error
        await supabaseServiceRole.storage.from('resumes').remove([filePath]);
        return new Response(
          JSON.stringify({ error: 'Failed to generate file URL' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const fileUrl = signedUrlData.signedUrl;
      console.log('Generated signed URL:', fileUrl);

      // Update/create copilot configuration with resume info
      const { data: existingConfigs, error: fetchError } = await supabaseServiceRole
        .from('copilot_configurations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching existing config:', fetchError);
        // Continue with upload success even if DB update fails
      } else {
        const configData = {
          user_id: userId,
          resume_file_name: fileName,
          resume_file_url: fileUrl,
          updated_at: new Date().toISOString()
        };

        if (existingConfigs && existingConfigs.length > 0) {
          // Update existing config
          const { error: updateError } = await supabaseServiceRole
            .from('copilot_configurations')
            .update(configData)
            .eq('id', existingConfigs[0].id);

          if (updateError) {
            console.error('Error updating config with resume info:', updateError);
          } else {
            console.log('Successfully updated config with resume info');
          }
        } else {
          // Create new config with resume info
          const { error: insertError } = await supabaseServiceRole
            .from('copilot_configurations')
            .insert([{
              ...configData,
              step_completed: 3,
              screening_data: {},
              filters_data: {},
              final_config_data: {},
              job_titles: [],
              job_types: [],
              work_location_types: [],
              remote_locations: [],
              onsite_locations: []
            }]);

          if (insertError) {
            console.error('Error creating config with resume info:', insertError);
          } else {
            console.log('Successfully created new config with resume info');
          }
        }
      }

      // Return success response
      const response = {
        fileName: fileName,
        filePath: filePath,
        fileUrl: fileUrl
      };

      console.log('Upload and database update completed successfully:', response);

      return new Response(
        JSON.stringify(response),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (uploadError) {
      console.error('Error during upload process:', uploadError);
      return new Response(
        JSON.stringify({ 
          error: 'Upload failed', 
          details: uploadError instanceof Error ? uploadError.message : 'Unknown error' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

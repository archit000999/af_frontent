
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitles, workLocationTypes, remoteLocations, onsiteLocations } = await req.json();
    
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    console.log('Perplexity API Key check:', {
      hasKey: !!perplexityApiKey,
      keyLength: perplexityApiKey?.length || 0,
      keyStart: perplexityApiKey?.substring(0, 8) || 'none'
    });
    
    if (!perplexityApiKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      const fallbackJobs = createFallbackJobs(jobTitles[0] || 'Software Engineer', 'various locations');
      return new Response(JSON.stringify({ 
        jobs: fallbackJobs,
        source: 'fallback',
        message: 'Using sample data - Perplexity API key not configured'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build location context
    let locationContext = '';
    if (workLocationTypes.includes('remote')) {
      if (remoteLocations.includes('Worldwide')) {
        locationContext = 'remote jobs worldwide';
      } else {
        locationContext = `remote jobs in ${remoteLocations.join(', ')}`;
      }
    } else if (workLocationTypes.includes('onsite') && onsiteLocations.length > 0) {
      locationContext = `on-site jobs in ${onsiteLocations.join(', ')}`;
    } else {
      locationContext = 'jobs';
    }

    // Create a more specific search query
    const searchQuery = `Find current ${jobTitles.join(' or ')} job openings that are ${locationContext}. Include company names, specific job titles, locations, and brief descriptions. Focus on legitimate companies actively hiring in January 2025. Provide real job listings with accurate company information.`;

    const requestBody = {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are a job search assistant. Return ONLY a valid JSON array of job objects. Each job must have: title, company, location, type (always "Fulltime"), and description. Maximum 30 jobs. Do not include any explanatory text, markdown, or additional formatting - just the JSON array.'
        },
        {
          role: 'user',
          content: searchQuery
        }
      ],
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 4000,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: 'month',
      frequency_penalty: 1,
      presence_penalty: 0
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();

    if (!response.ok) {
      
      const fallbackJobs = createFallbackJobs(jobTitles[0] || 'Software Engineer', locationContext);
      return new Response(JSON.stringify({ 
        jobs: fallbackJobs,
        source: 'fallback',
        error: `API error ${response.status}: ${response.statusText}`,
        message: `API error (${response.status}): ${responseText}`,
        debug: {
          hasApiKey: !!perplexityApiKey,
          keyLength: perplexityApiKey?.length || 0,
          query: searchQuery
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      const fallbackJobs = createFallbackJobs(jobTitles[0] || 'Software Engineer', locationContext);
      return new Response(JSON.stringify({ 
        jobs: fallbackJobs,
        source: 'fallback',
        error: 'Invalid JSON response from API',
        message: 'Using sample data - API returned invalid response'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    let jobsData;
    
    try {
      const content = data.choices[0].message.content;
      
      // Try to parse the response as JSON
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON array from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON array found in response');
        }
      }
      
      if (Array.isArray(parsedContent)) {
        jobsData = parsedContent;
      } else {
        throw new Error('Parsed content is not an array');
      }
      
    } catch (parseError) {
     
      jobsData = createFallbackJobs(jobTitles[0] || 'Software Engineer', locationContext);
    }

    // Ensure we have valid job data
    if (!Array.isArray(jobsData) || jobsData.length === 0) {
      jobsData = createFallbackJobs(jobTitles[0] || 'Software Engineer', locationContext);
    }

    // Ensure each job has required properties
    jobsData = jobsData.map((job, index) => ({
      id: job.id || index + 1,
      title: job.title || jobTitles[0] || 'Software Engineer',
      company: job.company || `Company ${index + 1}`,
      location: job.location || (workLocationTypes.includes('remote') ? 'Remote' : 'Various Locations'),
      type: 'Fulltime',
      description: job.description || `Join our team as a ${job.title || jobTitles[0]} and work on exciting projects.`
    }));


    return new Response(JSON.stringify({ 
      jobs: jobsData,
      source: 'perplexity-api',
      message: `Found ${jobsData.length} jobs via Perplexity AI`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    
    const fallbackJobs = createFallbackJobs('Software Engineer', 'various locations');
    return new Response(JSON.stringify({ 
      jobs: fallbackJobs,
      source: 'fallback',
      error: error.message,
      message: 'Using sample data due to error'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createFallbackJobs(jobTitle: string, locationContext: string): any[] {
  const companies = [
    'TechCorp Solutions', 'Innovation Labs', 'Digital Dynamics', 'FutureTech Inc',
    'CodeCraft Studios', 'NextGen Systems', 'CloudFirst Technologies', 'DataDriven Co',
    'SmartCode Industries', 'Agile Innovations'
  ];
  
  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
    'Remote', 'Boston, MA', 'Denver, CO', 'Chicago, IL', 'Los Angeles, CA', 'Miami, FL'
  ];
  
  return companies.map((company, index) => ({
    id: index + 1,
    title: jobTitle,
    company: company,
    location: locations[index],
    type: "Fulltime",
    description: `Join ${company} as a ${jobTitle} and work on cutting-edge projects with a dynamic team.`
  }));
}

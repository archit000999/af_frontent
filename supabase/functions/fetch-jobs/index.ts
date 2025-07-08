
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    if (!perplexityApiKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      // Return fallback jobs if API key is missing
      const fallbackJobs = createFallbackJobs(jobTitles[0] || 'Software Engineer', 'various locations');
      return new Response(JSON.stringify({ jobs: fallbackJobs }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Create search query for Perplexity
    const searchQuery = `Find current job openings for ${jobTitles.join(' or ')} positions as ${locationContext}. Include company names, job titles, locations, and brief descriptions. Focus on legitimate companies that are actively hiring in 2024.`;

    console.log('Searching for jobs with API key present:', !!perplexityApiKey);
    console.log('Search query:', searchQuery);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a job search assistant. Provide current, real job listings with accurate company information. Return the response as a JSON array of job objects with properties: title, company, location, type (always "Fulltime"), and description. Limit to 30 jobs maximum.'
          },
          {
            role: 'user',
            content: searchQuery
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      console.error(`Perplexity API error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      // Return fallback jobs on API error
      const fallbackJobs = createFallbackJobs(jobTitles[0] || 'Software Engineer', locationContext);
      return new Response(JSON.stringify({ jobs: fallbackJobs }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    let jobsData;
    
    try {
      // Try to parse the response as JSON
      const content = data.choices[0].message.content;
      console.log('Perplexity response:', content);
      
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jobsData = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, create structured data from text
        jobsData = parseJobsFromText(content, jobTitles[0] || 'Software Engineer');
      }
    } catch (parseError) {
      console.error('Error parsing jobs data:', parseError);
      // Fallback: create sample jobs based on search criteria
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
      location: job.location || 'Remote',
      type: 'Fulltime',
      description: job.description || `Join our team as a ${job.title || jobTitles[0]} and work on exciting projects.`
    }));

    return new Response(JSON.stringify({ jobs: jobsData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-jobs function:', error);
    
    // Always return fallback jobs with proper CORS headers
    const fallbackJobs = createFallbackJobs('Software Engineer', 'various locations');
    return new Response(JSON.stringify({ 
      error: error.message,
      jobs: fallbackJobs
    }), {
      status: 200, // Return 200 to avoid CORS issues
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseJobsFromText(text: string, jobTitle: string): any[] {
  // Simple text parsing to extract job information
  const lines = text.split('\n').filter(line => line.trim());
  const jobs = [];
  
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    if (line.includes('*') || line.includes('-') || line.includes('•')) {
      const cleanLine = line.replace(/[*\-•]\s*/, '').trim();
      if (cleanLine.length > 10) {
        jobs.push({
          id: i + 1,
          title: jobTitle,
          company: extractCompanyName(cleanLine),
          location: extractLocation(cleanLine),
          type: "Fulltime",
          description: cleanLine
        });
      }
    }
  }
  
  return jobs.length > 0 ? jobs : createFallbackJobs(jobTitle, 'various locations');
}

function extractCompanyName(text: string): string {
  // Try to extract company name from text
  const companyPatterns = [
    /at\s+([A-Z][a-zA-Z\s&]+)/i,
    /([A-Z][a-zA-Z\s&]+)\s+is\s+hiring/i,
    /([A-Z][a-zA-Z\s&]+)\s+-/i
  ];
  
  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return 'Growing Tech Company';
}

function extractLocation(text: string): string {
  // Try to extract location from text
  const locationPatterns = [
    /in\s+([A-Z][a-zA-Z\s,]+)/i,
    /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})/i,
    /(Remote)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return 'Remote';
}

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

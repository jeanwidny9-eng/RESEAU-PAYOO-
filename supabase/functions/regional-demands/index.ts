// Supabase Edge Function: regional-demands
// URL: https://<your-project-id>.supabase.co/functions/v1/regional-demands
// Serve regional company search & active demands

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'get_all';
    const region = url.searchParams.get('region') || 'Paris, France';
    const niche = url.searchParams.get('niche') || 'All';

    // 1. GET REGIONAL PROSPECTS & DEMANDS
    if (action === 'get_all' || action === 'search') {
      let prospectQuery = supabase.from('regional_prospects').select('*').eq('region', region);
      if (niche !== 'All') {
        prospectQuery = prospectQuery.eq('niche', niche);
      }
      const { data: prospects, error: prospectErr } = await prospectQuery;

      const { data: requests, error: requestErr } = await supabase
        .from('company_requests')
        .select('*')
        .eq('region', region)
        .order('created_at', { ascending: false });

      if (prospectErr || requestErr) {
        throw prospectErr || requestErr;
      }

      return new Response(
        JSON.stringify({
          success: true,
          region,
          niche,
          totalCompaniesInRegion: prospects?.length || 0,
          prospects: prospects || [],
          demands: requests || []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 2. CREATE A NEW REGIONAL DEMAND
    if (req.method === 'POST') {
      const body = await req.json();
      const { category, title, requester_name, company_name, phone, email, region: reqRegion, description, urgency } = body;

      const { data: inserted, error: insertErr } = await supabase
        .from('company_requests')
        .insert([
          {
            category: category || 'Demande de Devis',
            title,
            requester_name: requester_name || 'Inconnu',
            company_name,
            phone,
            email,
            region: reqRegion || region,
            description,
            urgency: urgency || 'Normale',
            status: 'Ouverte'
          }
        ])
        .select();

      if (insertErr) throw insertErr;

      return new Response(
        JSON.stringify({ success: true, demand: inserted?.[0] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    return new Response(JSON.stringify({ error: 'Action non supportée' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

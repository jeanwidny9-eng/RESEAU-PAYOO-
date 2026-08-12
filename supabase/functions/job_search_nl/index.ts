import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt || !prompt.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Prompt manquant" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    let parsedCriteria = {
      profession: "Comptable",
      skills: ["Comptabilité générale", "Excel", "Analyse financière"],
      minSalary: 1000,
      location: "Remote",
      remoteAvailable: true,
      availability: "Immédiate",
      summaryExplanation: "Recherche d'emploi de comptable en travail à distance avec minimum 1 000 $ / mois."
    };

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const aiPrompt = `
You are an AI Job Search Assistant. Parse the following query into JSON criteria:
Query: "${prompt}"

Return JSON:
{
  "profession": string,
  "skills": string[],
  "minSalary": number,
  "location": string,
  "remoteAvailable": boolean,
  "availability": string,
  "summaryExplanation": string
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: aiPrompt,
          config: { responseMimeType: "application/json" }
        });
        parsedCriteria = JSON.parse(response.text || "{}");
      } catch (err) {
        console.error("Gemini Edge Function Parsing Error:", err);
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: jobs } = await supabase
      .from("job_posts")
      .select("*")
      .eq("is_active", true);

    return new Response(
      JSON.stringify({
        success: true,
        parsedCriteria,
        matchedJobsCount: jobs?.length || 0,
        jobs: jobs || []
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

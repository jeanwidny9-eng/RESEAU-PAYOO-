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
      targetTitle: "Développeur Mobile",
      requiredSkills: ["React Native", "TypeScript", "Mobile"],
      minExperienceYears: 2,
      maxSalary: 5000,
      location: "Worldwide",
      remoteOnly: true,
      summaryExplanation: "Recherche de développeur mobile expert React Native en télétravail."
    };

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const aiPrompt = `
You are an expert AI Recruiter. Parse this query into candidate search criteria in JSON format:
Query: "${prompt}"

Return JSON:
{
  "targetTitle": string,
  "requiredSkills": string[],
  "minExperienceYears": number,
  "maxSalary": number,
  "location": string,
  "remoteOnly": boolean,
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
        console.error("Gemini Candidate Parsing Error:", err);
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: talents } = await supabase
      .from("profiles")
      .select("*");

    return new Response(
      JSON.stringify({
        success: true,
        parsedCriteria,
        matchedTalentsCount: talents?.length || 0,
        talents: talents || []
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

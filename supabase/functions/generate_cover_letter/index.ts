import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { candidateName, jobTitle, companyName, keySkills, tone = "professionnel" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    let letter = `Madame, Monsieur,\n\nC'est avec un vif intérêt que je vous présente ma candidature au poste de ${jobTitle || 'Professionnel'} au sein de ${companyName || 'votre entreprise'}.\n\nFort de mes compétences en ${keySkills ? keySkills.join(', ') : 'développement et gestion'}, je suis convaincu de pouvoir contribuer activement à vos objectifs.\n\nRestant à votre disposition pour un entretien visio.\n\nCordialement,\n${candidateName || 'Le Candidat'}`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
Write a personalized French cover letter for job application:
Candidate: ${candidateName}
Job: ${jobTitle} at ${companyName}
Skills: ${keySkills?.join(', ')}
Tone: ${tone}
`;
        const res = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt
        });
        if (res.text) letter = res.text;
      } catch (err) {
        console.error("Cover Letter Error:", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, coverLetter: letter }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

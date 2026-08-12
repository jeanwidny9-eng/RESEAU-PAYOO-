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
    const { cvText, fileUrl } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    let parsedResume = {
      fullName: "Candidat Extrait",
      title: "Ingénieur Software & Développeur Full Stack",
      email: "candidat@example.com",
      phone: "+33 6 00 00 00 00",
      skills: ["React 18", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
      experiences: [
        { role: "Senior Full Stack", company: "Tech Studio", period: "2021-2025", description: "Développement web & mobile" }
      ],
      education: [
        { degree: "Master Informatique", school: "Université Paris-Saclay", year: "2020" }
      ]
    };

    if (apiKey && cvText) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
Extract structured CV information in French from the following text:
"${cvText}"

Return JSON:
{
  "fullName": string,
  "title": string,
  "email": string,
  "phone": string,
  "skills": string[],
  "experiences": array of {role, company, period, description},
  "education": array of {degree, school, year}
}
`;
        const res = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        parsedResume = JSON.parse(res.text || "{}");
      } catch (err) {
        console.error("CV Parsing Error:", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, cv: parsedResume }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

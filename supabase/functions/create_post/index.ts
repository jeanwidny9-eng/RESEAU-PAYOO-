import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const {
      author_id,
      author_type = "user",
      post_type = "text",
      content,
      media_url,
      document_url,
      document_name,
      job_title,
      salary_text,
      service_price
    } = body;

    if (!content || !content.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Le contenu est obligatoire" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: newPost, error } = await supabase
      .from("posts")
      .insert([
        {
          author_id,
          author_type,
          post_type,
          content,
          media_url,
          document_url,
          document_name,
          job_title,
          salary_text,
          service_price,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          is_boosted: false
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, post: newPost }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

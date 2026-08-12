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
    const { postId, userId, boostType = "standard", targeting = {} } = await req.json();
    const price = boostType === "double" ? 20 : 5;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Mettre à jour la publication
    await supabase
      .from("posts")
      .update({ is_boosted: true, boost_type: boostType })
      .eq("id", postId);

    // Enregistrer la campagne
    const { data: campaign } = await supabase
      .from("boost_campaigns")
      .insert([
        {
          post_id: postId,
          user_id: userId,
          boost_type: boostType,
          amount: price,
          target_country: targeting.country,
          target_sector: targeting.sector,
          target_profession: targeting.profession
        }
      ])
      .select()
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Boost ${boostType.toUpperCase()} ($${price} USD) activé !`,
        campaign
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

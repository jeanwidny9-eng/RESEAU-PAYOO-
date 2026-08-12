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

    // 1. Désactiver les campagnes de boost expirées
    const { data: expiredCampaigns } = await supabase
      .from("boost_campaigns")
      .select("id, post_id")
      .lt("expires_at", new Date().toISOString())
      .eq("status", "active");

    if (expiredCampaigns && expiredCampaigns.length > 0) {
      for (const campaign of expiredCampaigns) {
        await supabase
          .from("boost_campaigns")
          .update({ status: "expired" })
          .eq("id", campaign.id);

        await supabase
          .from("posts")
          .update({ is_boosted: false, boost_type: null })
          .eq("id", campaign.post_id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tâches planifiées exécutées avec succès",
        processedExpiredBoosts: expiredCampaigns?.length || 0
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

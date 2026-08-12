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
    const { hostId, guestEmail, guestName } = await req.json();

    const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;
    const visioLink = `https://nichelead.io/visio/${roomId}`;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from("video_interviews").insert([
      {
        room_id: roomId,
        host_id: hostId,
        guest_email: guestEmail,
        guest_name: guestName,
        status: "scheduled"
      }
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        roomId,
        visioLink,
        message: "Salon vidéo WebRTC généré avec succès"
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

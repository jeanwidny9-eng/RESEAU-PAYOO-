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
    const payload = await req.json();
    const { campaign_id, user_id, amount, payment_method, transaction_ref, status } = payload;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: paymentRecord, error } = await supabase
      .from("boost_payments")
      .insert([
        {
          campaign_id,
          user_id,
          amount,
          currency: "USD",
          payment_method: payment_method || "card",
          transaction_ref: transaction_ref || `TX-${Date.now()}`,
          status: status || "completed"
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, paymentRecord }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

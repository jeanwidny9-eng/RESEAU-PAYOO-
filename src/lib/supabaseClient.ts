import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const invokeSupabaseFunction = async (functionName: string, payload: any) => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn(`Fallback local trigger for ${functionName}:`, err);
    // Direct Express API proxy fallback
    const res = await fetch(`/api/ai/${functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }
};

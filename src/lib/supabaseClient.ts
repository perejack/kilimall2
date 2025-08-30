// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ocnhtxruadvsmywxymqk.supabase.co'; // Corrected .co extension
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jbmh0eHJ1YWR2c215d3h5bXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTc2MDEsImV4cCI6MjA2NDYzMzYwMX0.UWxDXePwBM6SdKBNhAu-rNisc2i6a6tMrgEctSAieOE';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftloewdaezjcsypvlqpv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bG9ld2RhZXpqY3N5cHZscXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDUzNDAsImV4cCI6MjA3OTM4MTM0MH0.p3eBcA9MW0MoKUjX5YQXH1KRzJnZ7XQu0EBm3QFGTKA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://catsvzfqvxasaseydfbl.supabase.co';

const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhdHN2emZxdnhhc2FzZXlkZmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjQ4MzcsImV4cCI6MjA3NDgwMDgzN30.Q5XTDxGOsWHsP4pMuIl2VyQuVaXbf8DMD6Mbjv8AOEg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

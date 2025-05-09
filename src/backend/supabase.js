import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dddxycfvzbydbuoprbwf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZHh5Y2Z2emJ5ZGJ1b3ByYndmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzE1MzEsImV4cCI6MjA2MjM0NzUzMX0.PMdr2G_QouuNRFZDRnEdeHZXk_1c0F_hQyHRI2Z2WqQ'
export const supabase = createClient(supabaseUrl, supabaseKey)

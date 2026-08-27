import { createClient } from '@supabase/supabase-js'

// Substitua pelas suas credenciais reais que você pegou lá no Supabase (Project Settings > API)
const supabaseUrl = https://uccbzvpnephwmpopttkn.supabase.co
const supabaseAnonKey = sb_publishable_fJZ9r4VLytP8xtkAQZpNrA_Kh4r9-7X

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
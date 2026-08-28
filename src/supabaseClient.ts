import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uccbzvpnephwmpopttkn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjY2J6dnBuZXBod21wb3B0dGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MDYwMDEsImV4cCI6MjEwMzM4MjAwMX0.6xJ4W7vKwpdgxSgeGlnj1iZ264c0kIsXiiGUp8uVQOI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// LÓGICA DAS BARBEARIAS DINÂMICAS (MULTITENANT)
// ==========================================

export async function carregarDadosBarbearia() {
  const urlParams = new URLSearchParams(window.location.search);
  const barbershopSlug = urlParams.get('barbearia') || 'fernanda'; // Padrão será 'fernanda' se não passar nada na URL

  const { data, error } = await supabase
    .from('barbershops')
    .select('*')
    .eq('slug', barbershopSlug)
    .single();

  if (error) {
    console.error('Erro ao carregar a barbearia:', error);
    return null;
  }

  // Salva o ID e os dados da barbearia atual para o resto do site usar
  window.currentBarbershop = data;
  
  // Atualiza o nome na tela se o elemento existir
  const elementoNome = document.getElementById('nome-barbearia');
  if (elementoNome) {
    elementoNome.innerText = data.name;
  }

  return data;
}
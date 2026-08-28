import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingWizard } from '../components/booking/BookingWizard';
import { SHOP } from '../config/shop';
import { CrownIcon, LockIcon, ScissorsIcon, SparkIcon } from '../components/ui/Icons';
import { carregarDadosBarbearia } from '../supabaseClient';

export function Home() {
  const [barbearia, setBarbearia] = useState({
    name: SHOP.name,
    tagline: 'Tradição, navalha e acabamento impecável. Agende em menos de um minuto, direto do celular.',
    since: 'DESDE 1998'
  });

  useEffect(() => {
    async function init() {
      const dados = await carregarDadosBarbearia();
      if (dados && dados.name) {
        setBarbearia(prev => ({
          ...prev,
          name: dados.name,
          tagline: dados.tagline || prev.tagline,
          since: dados.since || prev.since,
        }));
      }
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col items-center px-4 py-10 selection:bg-amber-500/30 justify-between">
      
      {/* Container Central com Largura Fixa de App Mobile */}
      <main className="w-full max-w-[440px] flex flex-col items-center">
        
        {/* 1. Ícone da Coroa Dourada com Glow */}
        <div className="w-16 h-16 rounded-2xl bg-[#12151d] border border-amber-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.15)] mb-6">
          <CrownIcon className="w-8 h-8 text-amber-500" />
        </div>

        {/* 2. Badge Superior Dourado */}
        <span className="text-[11px] font-bold tracking-[0.3em] text-amber-500/90 uppercase mb-2">
          {barbearia.since}
        </span>

        {/* 3. Título Principal da Barbearia (Dinâmico) */}
        <h1 className="text-4xl sm:text-[42px] font-serif font-normal text-[#f4e8c1] tracking-wide text-center mb-3">
          {barbearia.name}
        </h1>

        {/* 4. Descrição / Subtítulo */}
        <p className="text-[14px] text-gray-400 text-center max-w-[340px] mb-6 leading-relaxed font-light">
          {barbearia.tagline}
        </p>

        {/* 5. Pílulas / Badges de Destaque */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#12151d] border border-gray-800/80 text-xs text-gray-300">
            <ScissorsIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Barbeiros premiados</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#12151d] border border-gray-800/80 text-xs text-gray-300">
            <SparkIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Sem fila de espera</span>
          </div>
        </div>

        {/* 6. Wizard de Agendamento */}
        <div className="w-full">
          <BookingWizard />
        </div>

      </main>

      {/* Rodapé com Acesso do Proprietário */}
      <footer className="w-full max-w-[440px] mt-16 pt-6 pb-4 border-t border-gray-900 flex flex-col items-center gap-3">
        <Link 
          to="/admin" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-amber-400 hover:bg-[#12151d] rounded-lg transition"
        >
          <LockIcon className="w-3.5 h-3.5" />
          <span>Área do Proprietário</span>
        </Link>

        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} {barbearia.name}. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}
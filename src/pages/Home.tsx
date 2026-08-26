import { Link } from 'react-router-dom';
import { BookingWizard } from '../components/booking/BookingWizard';
import { SHOP } from '../config/shop';
import { CrownIcon, LockIcon, ScissorsIcon, SparkIcon } from '../components/ui/Icons';

export function Home() {
  return (
    <main className="min-h-screen">
      <header className="relative overflow-hidden px-5 pt-12 pb-10 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.22),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-lg">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/40 bg-gold/10">
            <CrownIcon className="h-8 w-8 text-gold" />
          </span>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
            Desde 1998
          </p>
          <h1 className="font-display text-4xl leading-tight font-bold text-balance sm:text-5xl">
            <span className="text-gradient-gold">Barbearia Imperial</span>
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-mist">
            {SHOP.tagline} Agende em menos de um minuto, direto do celular.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { icon: <ScissorsIcon className="h-4 w-4" />, label: 'Barbeiros premiados' },
              { icon: <SparkIcon className="h-4 w-4" />, label: 'Sem fila de espera' },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-[12px] text-mist"
              >
                <span className="text-gold">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <BookingWizard />

      <footer className="border-t border-line px-5 py-8 pb-32 text-center">
        <p className="font-display text-lg text-white">{SHOP.name}</p>
        <p className="mt-1 text-[13px] text-mist">{SHOP.address}</p>
        <p className="mt-1 text-[13px] text-mist">
          Seg a Sex 09h-20h &middot; Sabado 09h-18h &middot; Domingo fechado
        </p>
        <Link
          to="/admin"
          className="mt-5 inline-flex items-center gap-1.5 text-[12px] text-mist/60 transition-colors hover:text-gold"
        >
          <LockIcon className="h-3.5 w-3.5" />
          Area do proprietario
        </Link>
      </footer>
    </main>
  );
}

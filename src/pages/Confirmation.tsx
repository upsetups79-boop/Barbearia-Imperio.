import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SummaryCard } from '../components/booking/SummaryCard';
import { Button } from '../components/ui/Button';
import { CalendarIcon, CheckIcon, WhatsAppIcon } from '../components/ui/Icons';
import { SHOP } from '../config/shop';
import { bookingRepository } from '../data/localStorageAdapter';
import { downloadIcs } from '../lib/ics';
import { formatLongDate } from '../lib/datetime';
import { protocolOf, whatsappLink } from '../lib/format';
import type { Booking } from '../types';

export function Confirmation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    bookingRepository
      .getById(id)
      .then(setBooking)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <p className="text-mist">Carregando...</p>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="grid min-h-screen place-items-center px-5 text-center">
        <div className="space-y-4">
          <p className="font-display text-2xl text-white">Agendamento nao encontrado</p>
          <Button onClick={() => navigate('/')}>Voltar ao inicio</Button>
        </div>
      </main>
    );
  }

  const message = `Ola! Sou ${booking.customerName}. Confirmei ${booking.serviceName} com ${booking.professionalName} em ${formatLongDate(booking.date)} as ${booking.startTime}. Protocolo ${protocolOf(booking.id)}.`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-5 py-12">
      <div className="animate-pop text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold glow-gold">
          <CheckIcon className="h-10 w-10 text-ink" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-white">Agendamento confirmado</h1>
        <p className="mt-2 text-[15px] text-mist">
          Te esperamos na {SHOP.name}. Chegue com 5 minutos de antecedencia.
        </p>
        <p className="mt-4 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[12px] font-semibold tracking-[0.2em] text-gold uppercase">
          Protocolo {protocolOf(booking.id)}
        </p>
      </div>

      <div className="mt-8">
        <SummaryCard
          data={{
            serviceName: booking.serviceName,
            professionalName: booking.professionalName,
            dateKey: booking.date,
            startTime: booking.startTime,
            durationMin: booking.durationMin,
            price: booking.price,
          }}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white/[0.03] p-4 text-sm">
        <p className="text-mist">
          Em nome de <span className="font-medium text-white">{booking.customerName}</span>
        </p>
        <p className="text-mist">
          WhatsApp <span className="font-medium text-white">{booking.customerPhone}</span>
        </p>
        {booking.notes && <p className="mt-2 text-mist">Observacao: {booking.notes}</p>}
      </div>

      <div className="mt-6 space-y-3">
        <Button full variant="outline" onClick={() => downloadIcs(booking)}>
          <CalendarIcon className="h-5 w-5" />
          Salvar na minha agenda
        </Button>
        <a
          href={whatsappLink(SHOP.whatsapp, message)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 text-[15px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Falar com a barbearia
        </a>
        <Link
          to="/"
          className="block py-2 text-center text-[14px] text-mist transition-colors hover:text-gold"
        >
          Fazer outro agendamento
        </Link>
      </div>
    </main>
  );
}

import { addMinutesToTime } from '../../lib/datetime';
import { brl, whatsappLink } from '../../lib/format';
import type { Booking } from '../../types';
import { WhatsAppIcon } from '../ui/Icons';

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
}

const statusStyles: Record<Booking['status'], string> = {
  confirmado: 'border-gold/40 bg-gold/10 text-gold',
  concluido: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  cancelado: 'border-line bg-white/[0.03] text-mist',
};

const statusLabels: Record<Booking['status'], string> = {
  confirmado: 'Confirmado',
  concluido: 'Concluido',
  cancelado: 'Cancelado',
};

export function BookingCard({ booking, onCancel, onComplete }: BookingCardProps) {
  const canceled = booking.status === 'cancelado';
  const endTime = addMinutesToTime(booking.startTime, booking.durationMin);

  return (
    <article
      className={`surface rounded-2xl p-4 transition-opacity ${canceled ? 'opacity-55' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-[62px] shrink-0 text-center">
          <p className="font-display text-xl leading-none font-semibold text-gold">
            {booking.startTime}
          </p>
          <p className="mt-1 text-[11px] text-mist/70">ate {endTime}</p>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold text-white ${canceled ? 'line-through decoration-mist' : ''}`}
            >
              {booking.customerName}
            </h3>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${statusStyles[booking.status]}`}
            >
              {statusLabels[booking.status]}
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-mist">
            {booking.serviceName} &middot; {booking.professionalName}
          </p>
          <p className="text-[13px] text-mist/80">{booking.customerPhone}</p>
          {booking.notes && (
            <p className="mt-1 text-[12px] text-mist/70 italic">Obs.: {booking.notes}</p>
          )}
        </div>

        <p className="shrink-0 text-[15px] font-semibold text-white">{brl(booking.price)}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <a
          href={whatsappLink(booking.customerPhone)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-[13px] font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>

        {booking.status === 'confirmado' && (
          <>
            <button
              type="button"
              onClick={() => onComplete(booking.id)}
              className="min-h-[36px] rounded-lg border border-line px-3 text-[13px] font-medium text-white transition-colors hover:border-gold/60 hover:text-gold"
            >
              Concluir
            </button>
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              className="min-h-[36px] rounded-lg border border-red-500/30 px-3 text-[13px] font-medium text-red-300 transition-colors hover:bg-red-500/10"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </article>
  );
}

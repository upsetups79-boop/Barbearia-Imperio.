import { brl } from '../../lib/format';
import type { Booking } from '../../types';

interface StatsBarProps {
  bookings: Booking[];
  /** Quando informado, destaca o proximo horario do dia. */
  showNext?: boolean;
  now?: Date;
}

export function StatsBar({ bookings, showNext = false, now = new Date() }: StatsBarProps) {
  const active = bookings.filter((booking) => booking.status !== 'cancelado');
  const revenue = active.reduce((total, booking) => total + booking.price, 0);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const next = active
    .filter((booking) => booking.status === 'confirmado')
    .find((booking) => {
      const [hours, minutes] = booking.startTime.split(':').map(Number);
      return hours * 60 + minutes >= currentMinutes;
    });

  const items = [
    { label: 'Agendamentos', value: String(active.length) },
    { label: 'Faturamento previsto', value: brl(revenue) },
    ...(showNext ? [{ label: 'Proximo horario', value: next ? next.startTime : '--:--' }] : []),
  ];

  return (
    <div className={`grid gap-2 ${showNext ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {items.map((item) => (
        <div key={item.label} className="surface rounded-xl px-3 py-3 text-center">
          <p className="font-display text-lg leading-tight font-semibold text-gradient-gold">
            {item.value}
          </p>
          <p className="mt-0.5 text-[10px] leading-tight tracking-wide text-mist/70 uppercase">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

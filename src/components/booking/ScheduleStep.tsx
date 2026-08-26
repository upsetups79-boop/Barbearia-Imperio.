import { useEffect, useMemo, useState } from 'react';
import { SHOP } from '../../config/shop';
import { bookingRepository } from '../../data/localStorageAdapter';
import { getAvailableSlots, isShopOpen } from '../../lib/availability';
import {
  formatDayNumber,
  formatMonthShort,
  formatWeekdayShort,
  getUpcomingDays,
  timeToMinutes,
  toDateKey,
} from '../../lib/datetime';
import type { Booking, Service } from '../../types';

interface ScheduleStepProps {
  service: Service;
  professionalId: string;
  dateKey: string | null;
  time: string | null;
  onSelectDate: (dateKey: string) => void;
  onSelectTime: (time: string) => void;
}

const PERIODS = [
  { label: 'Manha', from: 0, to: 12 * 60 },
  { label: 'Tarde', from: 12 * 60, to: 18 * 60 },
  { label: 'Noite', from: 18 * 60, to: 24 * 60 },
];

export function ScheduleStep({
  service,
  professionalId,
  dateKey,
  time,
  onSelectDate,
  onSelectTime,
}: ScheduleStepProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => getUpcomingDays(SHOP.bookingWindowDays), []);

  useEffect(() => {
    if (!dateKey) return;
    let active = true;
    setLoading(true);
    bookingRepository
      .listByProfessionalOnDate(professionalId, dateKey)
      .then((result) => {
        if (active) setBookings(result);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [professionalId, dateKey]);

  const slots = useMemo(() => {
    if (!dateKey) return [];
    return getAvailableSlots({ dateKey, durationMin: service.durationMin, bookings });
  }, [dateKey, service.durationMin, bookings]);

  const grouped = PERIODS.map((period) => ({
    label: period.label,
    items: slots.filter((slot) => {
      const minutes = timeToMinutes(slot);
      return minutes >= period.from && minutes < period.to;
    }),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="animate-rise space-y-6">
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-mist/70 uppercase">
          Escolha o dia
        </p>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {days.map((day) => {
            const key = toDateKey(day);
            const open = isShopOpen(key);
            const selected = key === dateKey;
            return (
              <button
                key={key}
                type="button"
                data-testid="day-option"
                disabled={!open}
                onClick={() => onSelectDate(key)}
                aria-pressed={selected}
                className={`flex min-h-[76px] w-[62px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border transition-all duration-200 ${
                  selected
                    ? 'border-gold bg-gradient-gold text-ink'
                    : open
                      ? 'border-line bg-white/[0.03] text-white hover:border-gold/40'
                      : 'cursor-not-allowed border-line/50 bg-white/[0.01] text-mist/30'
                }`}
              >
                <span className="text-[11px] font-medium uppercase">{formatWeekdayShort(day)}</span>
                <span className="font-display text-xl leading-none font-semibold">
                  {formatDayNumber(day)}
                </span>
                <span className="text-[10px] uppercase opacity-70">{formatMonthShort(day)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-mist/70 uppercase">
          Horarios disponiveis
        </p>

        {!dateKey && <EmptyHint text="Selecione um dia para ver os horarios." />}

        {dateKey && loading && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
            ))}
          </div>
        )}

        {dateKey && !loading && slots.length === 0 && (
          <EmptyHint text="Nenhum horario livre nesse dia. Tente outra data ou outro profissional." />
        )}

        {dateKey && !loading && grouped.length > 0 && (
          <div className="space-y-4">
            {grouped.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-[11px] font-medium text-mist/60">{group.label}</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {group.items.map((slot) => {
                    const selected = slot === time;
                    return (
                      <button
                        key={slot}
                        type="button"
                        data-testid="slot-option"
                        onClick={() => onSelectTime(slot)}
                        aria-pressed={selected}
                        className={`min-h-[48px] rounded-xl border text-[15px] font-semibold transition-all duration-200 active:scale-[0.97] ${
                          selected
                            ? 'border-gold bg-gradient-gold text-ink'
                            : 'border-line bg-white/[0.03] text-white hover:border-gold/50 hover:text-gold'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-mist">
      {text}
    </p>
  );
}

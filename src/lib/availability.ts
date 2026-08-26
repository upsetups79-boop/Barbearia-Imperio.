import { OPENING_HOURS, SHOP } from '../config/shop';
import type { Booking, OpeningHours } from '../types';
import { parseDateKey, timeToMinutes, toDateKey } from './datetime';

export interface Interval {
  start: number;
  end: number;
}

/** Horario de funcionamento do dia, ou null quando fechado. */
export function getOpeningHours(dateKey: string): OpeningHours | null {
  const weekday = parseDateKey(dateKey).getDay();
  return OPENING_HOURS[weekday] ?? null;
}

export function isShopOpen(dateKey: string): boolean {
  return getOpeningHours(dateKey) !== null;
}

export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/** Intervalos ocupados no dia, ignorando agendamentos cancelados. */
export function getBusyIntervals(bookings: Booking[], dateKey: string): Interval[] {
  return bookings
    .filter((booking) => booking.date === dateKey && booking.status !== 'cancelado')
    .map((booking) => {
      const start = timeToMinutes(booking.startTime);
      return { start, end: start + booking.durationMin };
    });
}

export interface SlotQuery {
  dateKey: string;
  durationMin: number;
  /** Agendamentos do profissional escolhido (podem incluir outras datas). */
  bookings: Booking[];
  now?: Date;
}

/**
 * Gera os horarios livres do dia para um servico.
 * Um horario so aparece quando o atendimento inteiro cabe antes do fechamento
 * e nao colide com outro agendamento ativo do mesmo profissional.
 */
export function getAvailableSlots({
  dateKey,
  durationMin,
  bookings,
  now = new Date(),
}: SlotQuery): string[] {
  const hours = getOpeningHours(dateKey);
  if (!hours) return [];

  const openAt = timeToMinutes(hours.open);
  const closeAt = timeToMinutes(hours.close);
  const busy = getBusyIntervals(bookings, dateKey);

  const isToday = dateKey === toDateKey(now);
  const earliest = isToday
    ? now.getHours() * 60 + now.getMinutes() + SHOP.minNoticeMin
    : Number.NEGATIVE_INFINITY;

  const slots: string[] = [];
  for (let start = openAt; start + durationMin <= closeAt; start += SHOP.slotStepMin) {
    if (start < earliest) continue;
    const candidate: Interval = { start, end: start + durationMin };
    if (busy.some((interval) => overlaps(candidate, interval))) continue;
    slots.push(
      `${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`,
    );
  }
  return slots;
}

/** Revalidacao usada antes de gravar, para evitar reserva dupla. */
export function isSlotAvailable(
  query: SlotQuery & { startTime: string },
): boolean {
  return getAvailableSlots(query).includes(query.startTime);
}

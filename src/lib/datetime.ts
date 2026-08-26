import { addDays, format, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/** Converte um Date para a chave local 'yyyy-MM-dd'. */
export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** Interpreta 'yyyy-MM-dd' como data local (evita o deslocamento de fuso do Date ISO). */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayKey(now: Date = new Date()): string {
  return toDateKey(now);
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

/** Ex.: 'sexta-feira, 12 de setembro'. */
export function formatLongDate(dateKey: string): string {
  return format(parseDateKey(dateKey), "EEEE, d 'de' MMMM", { locale: ptBR });
}

/** Ex.: 'sex, 12 set'. */
export function formatMediumDate(dateKey: string): string {
  return format(parseDateKey(dateKey), "EEE, d 'de' MMM", { locale: ptBR });
}

/** Ex.: 'sex'. */
export function formatWeekdayShort(date: Date): string {
  return format(date, 'EEEEEE', { locale: ptBR }).replace('.', '');
}

export function formatDayNumber(date: Date): string {
  return format(date, 'dd');
}

export function formatMonthShort(date: Date): string {
  return format(date, 'MMM', { locale: ptBR }).replace('.', '');
}

/** Lista os proximos `count` dias a partir de hoje (inclusive). */
export function getUpcomingDays(count: number, from: Date = new Date()): Date[] {
  return Array.from({ length: count }, (_, index) => addDays(from, index));
}

export interface WeekRange {
  startKey: string;
  endKey: string;
  days: Date[];
}

/** Semana corrente de segunda a domingo. */
export function getWeekRange(reference: Date = new Date()): WeekRange {
  const start = startOfWeek(reference, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  return {
    startKey: toDateKey(days[0]),
    endKey: toDateKey(days[6]),
    days,
  };
}

export function formatWeekRangeLabel(range: WeekRange): string {
  const first = format(parseDateKey(range.startKey), "d 'de' MMM", { locale: ptBR });
  const last = format(parseDateKey(range.endKey), "d 'de' MMM", { locale: ptBR });
  return `${first} - ${last}`;
}

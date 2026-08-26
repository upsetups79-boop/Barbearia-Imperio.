import { getBusyIntervals, overlaps } from '../lib/availability';
import { timeToMinutes, toDateKey } from '../lib/datetime';
import type { Booking, BookingStatus, NewBooking } from '../types';
import {
  BookingConflictError,
  BookingNotFoundError,
  type BookingRepository,
} from './bookingRepository';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = 'barbearia-imperial:bookings:v1';

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
  };
}

function resolveStorage(): StorageLike {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return createMemoryStorage();
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `bk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export interface LocalRepositoryOptions {
  storage?: StorageLike;
  /** Popula dados de demonstracao no primeiro acesso. */
  seed?: boolean;
}

export function createLocalBookingRepository(
  options: LocalRepositoryOptions = {},
): BookingRepository {
  const storage = options.storage ?? resolveStorage();
  const shouldSeed = options.seed ?? true;

  function readAll(): Booking[] {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      const initial = shouldSeed ? buildSeed() : [];
      storage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      const parsed = JSON.parse(raw) as Booking[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeAll(bookings: Booking[]): void {
    storage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function sortBookings(bookings: Booking[]): Booking[] {
    return [...bookings].sort((a, b) =>
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date),
    );
  }

  return {
    async list() {
      return sortBookings(readAll());
    },

    async listByDateRange(startKey, endKey) {
      return sortBookings(
        readAll().filter((booking) => booking.date >= startKey && booking.date <= endKey),
      );
    },

    async listByProfessionalOnDate(professionalId, dateKey) {
      return sortBookings(
        readAll().filter(
          (booking) => booking.professionalId === professionalId && booking.date === dateKey,
        ),
      );
    },

    async getById(id) {
      return readAll().find((booking) => booking.id === id) ?? null;
    },

    async create(input: NewBooking) {
      const all = readAll();
      const sameProfessional = all.filter(
        (booking) => booking.professionalId === input.professionalId,
      );
      const start = timeToMinutes(input.startTime);
      const candidate = { start, end: start + input.durationMin };
      const busy = getBusyIntervals(sameProfessional, input.date);
      if (busy.some((interval) => overlaps(candidate, interval))) {
        throw new BookingConflictError();
      }

      const booking: Booking = {
        ...input,
        id: newId(),
        status: 'confirmado',
        createdAt: new Date().toISOString(),
      };
      writeAll([...all, booking]);
      return booking;
    },

    async updateStatus(id: string, status: BookingStatus) {
      const all = readAll();
      const index = all.findIndex((booking) => booking.id === id);
      if (index === -1) throw new BookingNotFoundError();
      const updated: Booking = { ...all[index], status };
      all[index] = updated;
      writeAll(all);
      return updated;
    },
  };
}

/** Agendamentos de demonstracao para o painel nao nascer vazio. */
function buildSeed(): Booking[] {
  const today = toDateKey(new Date());
  const tomorrow = toDateKey(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const base = {
    status: 'confirmado' as BookingStatus,
    createdAt: new Date().toISOString(),
  };

  return [
    {
      ...base,
      id: 'seed-1',
      serviceId: 'corte-barba',
      serviceName: 'Corte + Barba',
      professionalId: 'carlos',
      professionalName: 'Carlos Imperial',
      date: today,
      startTime: '10:00',
      durationMin: 60,
      price: 70,
      customerName: 'Marcos Vinicius',
      customerPhone: '(11) 98812-4477',
    },
    {
      ...base,
      id: 'seed-2',
      serviceId: 'corte',
      serviceName: 'Corte',
      professionalId: 'rafael',
      professionalName: 'Rafael Navalha',
      date: today,
      startTime: '11:30',
      durationMin: 30,
      price: 45,
      customerName: 'Anderson Reis',
      customerPhone: '(11) 99120-8834',
    },
    {
      ...base,
      id: 'seed-3',
      serviceId: 'barba',
      serviceName: 'Barba',
      professionalId: 'diego',
      professionalName: 'Diego Lamina',
      date: today,
      startTime: '16:00',
      durationMin: 30,
      price: 35,
      customerName: 'Paulo Henrique',
      customerPhone: '(11) 97744-2210',
    },
    {
      ...base,
      id: 'seed-4',
      serviceId: 'corte',
      serviceName: 'Corte',
      professionalId: 'carlos',
      professionalName: 'Carlos Imperial',
      date: tomorrow,
      startTime: '09:30',
      durationMin: 30,
      price: 45,
      customerName: 'Rodrigo Alves',
      customerPhone: '(11) 98431-1190',
    },
  ];
}

/** Instancia usada pela aplicacao. */
export const bookingRepository: BookingRepository = createLocalBookingRepository();

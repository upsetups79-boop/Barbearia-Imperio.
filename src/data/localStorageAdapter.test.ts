import { beforeEach, describe, expect, it } from 'vitest';
import { BookingConflictError, type BookingRepository } from './bookingRepository';
import { createLocalBookingRepository, type StorageLike } from './localStorageAdapter';
import { getAvailableSlots } from '../lib/availability';
import type { NewBooking } from '../types';

const MONDAY = '2025-01-06';
const TUESDAY = '2025-01-07';

function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
  };
}

function input(overrides: Partial<NewBooking> = {}): NewBooking {
  return {
    serviceId: 'corte',
    serviceName: 'Corte',
    professionalId: 'carlos',
    professionalName: 'Carlos Imperial',
    date: MONDAY,
    startTime: '10:00',
    durationMin: 30,
    price: 45,
    customerName: 'Cliente Teste',
    customerPhone: '(11) 91234-5678',
    ...overrides,
  };
}

let repo: BookingRepository;

beforeEach(() => {
  repo = createLocalBookingRepository({ storage: memoryStorage(), seed: false });
});

describe('repositorio de agendamentos', () => {
  it('cria e recupera um agendamento', async () => {
    const created = await repo.create(input());
    expect(created.id).toBeTruthy();
    expect(created.status).toBe('confirmado');
    expect(await repo.getById(created.id)).toMatchObject({ customerName: 'Cliente Teste' });
  });

  it('filtra por profissional e data', async () => {
    await repo.create(input());
    await repo.create(input({ professionalId: 'rafael', startTime: '11:00' }));
    await repo.create(input({ date: TUESDAY, startTime: '10:00' }));

    const carlosOnMonday = await repo.listByProfessionalOnDate('carlos', MONDAY);
    expect(carlosOnMonday).toHaveLength(1);
    expect(carlosOnMonday[0].startTime).toBe('10:00');
  });

  it('filtra por intervalo de datas e ordena por dia e horario', async () => {
    await repo.create(input({ date: TUESDAY, startTime: '09:00' }));
    await repo.create(input({ startTime: '15:00' }));
    await repo.create(input({ startTime: '09:30' }));

    const range = await repo.listByDateRange(MONDAY, TUESDAY);
    expect(range.map((item) => `${item.date} ${item.startTime}`)).toEqual([
      `${MONDAY} 09:30`,
      `${MONDAY} 15:00`,
      `${TUESDAY} 09:00`,
    ]);

    const onlyMonday = await repo.listByDateRange(MONDAY, MONDAY);
    expect(onlyMonday).toHaveLength(2);
  });

  it('rejeita reserva dupla no mesmo profissional e horario', async () => {
    await repo.create(input());
    await expect(repo.create(input({ customerName: 'Outro' }))).rejects.toBeInstanceOf(
      BookingConflictError,
    );
  });

  it('rejeita sobreposicao parcial do combo de 60 minutos', async () => {
    await repo.create(input({ startTime: '10:00', durationMin: 30 }));
    await expect(
      repo.create(input({ startTime: '09:30', durationMin: 60, serviceId: 'corte-barba' })),
    ).rejects.toBeInstanceOf(BookingConflictError);
  });

  it('permite o mesmo horario para profissionais diferentes', async () => {
    await repo.create(input());
    const other = await repo.create(input({ professionalId: 'rafael' }));
    expect(other.professionalId).toBe('rafael');
  });

  it('persiste a mudanca de status e libera o horario apos cancelar', async () => {
    const created = await repo.create(input({ startTime: '14:00' }));

    const beforeCancel = await repo.listByProfessionalOnDate('carlos', MONDAY);
    expect(
      getAvailableSlots({ dateKey: MONDAY, durationMin: 30, bookings: beforeCancel }),
    ).not.toContain('14:00');

    await repo.updateStatus(created.id, 'cancelado');
    expect(await repo.getById(created.id)).toMatchObject({ status: 'cancelado' });

    const afterCancel = await repo.listByProfessionalOnDate('carlos', MONDAY);
    expect(
      getAvailableSlots({ dateKey: MONDAY, durationMin: 30, bookings: afterCancel }),
    ).toContain('14:00');

    await repo.create(input({ startTime: '14:00', customerName: 'Novo Cliente' }));
  });

  it('marca como concluido', async () => {
    const created = await repo.create(input());
    const updated = await repo.updateStatus(created.id, 'concluido');
    expect(updated.status).toBe('concluido');
  });
});

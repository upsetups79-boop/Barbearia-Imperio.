import { describe, expect, it } from 'vitest';
import { getAvailableSlots, getOpeningHours, isShopOpen, isSlotAvailable } from './availability';
import type { Booking } from '../types';

// 2025-01-06 = segunda | 2025-01-11 = sabado | 2025-01-12 = domingo
const MONDAY = '2025-01-06';
const SATURDAY = '2025-01-11';
const SUNDAY = '2025-01-12';

function booking(overrides: Partial<Booking>): Booking {
  return {
    id: 'b1',
    serviceId: 'corte',
    serviceName: 'Corte',
    professionalId: 'carlos',
    professionalName: 'Carlos Imperial',
    date: MONDAY,
    startTime: '10:00',
    durationMin: 30,
    price: 45,
    customerName: 'Cliente',
    customerPhone: '(11) 91234-5678',
    status: 'confirmado',
    createdAt: '2025-01-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('horario de funcionamento', () => {
  it('abre de segunda a sabado e fecha no domingo', () => {
    expect(isShopOpen(MONDAY)).toBe(true);
    expect(isShopOpen(SATURDAY)).toBe(true);
    expect(isShopOpen(SUNDAY)).toBe(false);
    expect(getOpeningHours(SATURDAY)).toEqual({ open: '09:00', close: '18:00' });
  });
});

describe('geracao de horarios', () => {
  it('gera a grade completa de um dia util para corte de 30 min', () => {
    const slots = getAvailableSlots({ dateKey: MONDAY, durationMin: 30, bookings: [] });
    expect(slots[0]).toBe('09:00');
    expect(slots.at(-1)).toBe('19:30');
    expect(slots).toHaveLength(22);
  });

  it('nao oferece horario em dia fechado', () => {
    expect(getAvailableSlots({ dateKey: SUNDAY, durationMin: 30, bookings: [] })).toEqual([]);
  });

  it('nao oferece combo de 60 min quando so resta meia hora antes do fechamento', () => {
    const slots = getAvailableSlots({ dateKey: SATURDAY, durationMin: 60, bookings: [] });
    expect(slots.at(-1)).toBe('17:00');
    expect(slots).not.toContain('17:30');
  });

  it('remove o horario ocupado por outro agendamento', () => {
    const slots = getAvailableSlots({
      dateKey: MONDAY,
      durationMin: 30,
      bookings: [booking({ startTime: '10:00', durationMin: 30 })],
    });
    expect(slots).not.toContain('10:00');
    expect(slots).toContain('10:30');
  });

  it('bloqueia horarios que se sobrepoem parcialmente ao atendimento', () => {
    const slots = getAvailableSlots({
      dateKey: MONDAY,
      durationMin: 60,
      bookings: [booking({ startTime: '10:00', durationMin: 30 })],
    });
    expect(slots).not.toContain('09:30');
    expect(slots).not.toContain('10:00');
    expect(slots).toContain('09:00');
    expect(slots).toContain('10:30');
  });

  it('libera o horario quando o agendamento foi cancelado', () => {
    const slots = getAvailableSlots({
      dateKey: MONDAY,
      durationMin: 30,
      bookings: [booking({ startTime: '10:00', status: 'cancelado' })],
    });
    expect(slots).toContain('10:00');
  });

  it('ignora agendamentos de outra data', () => {
    const slots = getAvailableSlots({
      dateKey: MONDAY,
      durationMin: 30,
      bookings: [booking({ date: SATURDAY, startTime: '10:00' })],
    });
    expect(slots).toContain('10:00');
  });

  it('esconde horarios passados quando o dia escolhido e hoje', () => {
    const now = new Date('2025-01-06T14:00:00');
    const slots = getAvailableSlots({ dateKey: MONDAY, durationMin: 30, bookings: [], now });
    expect(slots).not.toContain('13:30');
    expect(slots[0]).toBe('14:30');
  });
});

describe('revalidacao antes de gravar', () => {
  it('reprova um horario que ficou ocupado', () => {
    const bookings = [booking({ startTime: '11:00', durationMin: 30 })];
    expect(
      isSlotAvailable({ dateKey: MONDAY, durationMin: 30, bookings, startTime: '11:00' }),
    ).toBe(false);
    expect(
      isSlotAvailable({ dateKey: MONDAY, durationMin: 30, bookings, startTime: '11:30' }),
    ).toBe(true);
  });
});

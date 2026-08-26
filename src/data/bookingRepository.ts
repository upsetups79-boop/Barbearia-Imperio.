import type { Booking, BookingStatus, NewBooking } from '../types';

/**
 * Contrato de persistencia dos agendamentos.
 * A UI conversa apenas com esta interface, entao trocar localStorage por
 * Supabase (ou qualquer API) nao exige alterar nenhuma tela.
 */
export interface BookingRepository {
  list(): Promise<Booking[]>;
  listByDateRange(startKey: string, endKey: string): Promise<Booking[]>;
  listByProfessionalOnDate(professionalId: string, dateKey: string): Promise<Booking[]>;
  getById(id: string): Promise<Booking | null>;
  create(input: NewBooking): Promise<Booking>;
  updateStatus(id: string, status: BookingStatus): Promise<Booking>;
}

export class BookingConflictError extends Error {
  constructor(message = 'Esse horario acabou de ser reservado. Escolha outro.') {
    super(message);
    this.name = 'BookingConflictError';
  }
}

export class BookingNotFoundError extends Error {
  constructor(message = 'Agendamento nao encontrado.') {
    super(message);
    this.name = 'BookingNotFoundError';
  }
}

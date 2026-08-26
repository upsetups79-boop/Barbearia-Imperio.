export type ServiceId = 'corte' | 'barba' | 'corte-barba';

export type BookingStatus = 'confirmado' | 'concluido' | 'cancelado';

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  /** Preco em reais. */
  price: number;
  /** Duracao total do atendimento em minutos. */
  durationMin: number;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  initials: string;
  specialties: string[];
}

export interface Booking {
  id: string;
  serviceId: ServiceId;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  /** Formato 'yyyy-MM-dd'. */
  date: string;
  /** Formato 'HH:mm'. */
  startTime: string;
  durationMin: number;
  price: number;
  customerName: string;
  customerPhone: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export type NewBooking = Omit<Booking, 'id' | 'createdAt' | 'status'>;

/** Intervalo de funcionamento de um dia da semana. */
export interface OpeningHours {
  open: string;
  close: string;
}

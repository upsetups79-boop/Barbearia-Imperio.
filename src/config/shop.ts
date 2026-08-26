import type { OpeningHours, Professional, Service } from '../types';

/**
 * Arquivo unico de personalizacao.
 * Para revender o sistema para outra barbearia, altere apenas este arquivo.
 */
export const SHOP = {
  name: 'Barbearia Imperial',
  tagline: 'Tradicao, navalha e acabamento impecavel.',
  /** Telefone da barbearia no formato internacional (somente digitos). */
  whatsapp: '5511999990000',
  address: 'Rua das Palmeiras, 128 - Centro',
  /** Intervalo entre horarios oferecidos, em minutos. */
  slotStepMin: 30,
  /** Quantos dias para frente o cliente pode agendar. */
  bookingWindowDays: 14,
  /** Antecedencia minima para agendar no proprio dia, em minutos. */
  minNoticeMin: 30,
} as const;

/**
 * Horario de funcionamento por dia da semana (0 = domingo ... 6 = sabado).
 * `null` significa fechado.
 */
export const OPENING_HOURS: Record<number, OpeningHours | null> = {
  0: null,
  1: { open: '09:00', close: '20:00' },
  2: { open: '09:00', close: '20:00' },
  3: { open: '09:00', close: '20:00' },
  4: { open: '09:00', close: '20:00' },
  5: { open: '09:00', close: '20:00' },
  6: { open: '09:00', close: '18:00' },
};

export const SERVICES: Service[] = [
  {
    id: 'corte',
    name: 'Corte',
    description: 'Corte na maquina ou tesoura, com finalizacao e toalha quente.',
    price: 45,
    durationMin: 30,
  },
  {
    id: 'barba',
    name: 'Barba',
    description: 'Barboterapia completa com navalha, toalha quente e balm.',
    price: 35,
    durationMin: 30,
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    description: 'O combo Imperial: corte completo e barba desenhada na navalha.',
    price: 70,
    durationMin: 60,
  },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 'carlos',
    name: 'Carlos Imperial',
    role: 'Barbeiro-chefe',
    initials: 'CI',
    specialties: ['Degrade', 'Navalha'],
  },
  {
    id: 'rafael',
    name: 'Rafael Navalha',
    role: 'Barbeiro',
    initials: 'RN',
    specialties: ['Social', 'Barboterapia'],
  },
  {
    id: 'diego',
    name: 'Diego Lamina',
    role: 'Barbeiro',
    initials: 'DL',
    specialties: ['Freestyle', 'Platinado'],
  },
];

export function getService(id: string): Service | undefined {
  return SERVICES.find((service) => service.id === id);
}

export function getProfessional(id: string): Professional | undefined {
  return PROFESSIONALS.find((professional) => professional.id === id);
}

/** Senha do painel administrativo. Configuravel via variavel de ambiente. */
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'imperial2024';

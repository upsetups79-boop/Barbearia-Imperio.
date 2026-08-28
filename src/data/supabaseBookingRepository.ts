import { supabase } from '../supabaseClient';
import type { Booking } from '../types';

export class BookingConflictError extends Error {
  constructor(message = 'Horário indisponível.') {
    super(message);
    this.name = 'BookingConflictError';
  }
}

export const bookingRepository = {
  async create(bookingData: {
    serviceId: string;
    serviceName: string;
    professionalId: string;
    professionalName: string;
    date: string;
    startTime: string;
    durationMin: number;
    price: number;
    customerName: string;
    customerPhone: string;
    notes?: string;
  }): Promise<Booking> {
    const params = new URLSearchParams(window.location.search);
    const barbershopSlug = params.get('barbearia') || 'alfa';

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          barbershop_slug: barbershopSlug,
          service_name: bookingData.serviceName,
          professional_name: bookingData.professionalName,
          date: bookingData.date,
          start_time: bookingData.startTime,
          duration_min: bookingData.durationMin,
          price: bookingData.price,
          customer_name: bookingData.customerName,
          customer_phone: bookingData.customerPhone,
          notes: bookingData.notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar agendamento:', error);
      throw error;
    }

    return {
      id: data.id,
      serviceName: data.service_name,
      professionalName: data.professional_name,
      date: data.date,
      startTime: data.start_time,
      durationMin: data.duration_min,
      price: data.price,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      notes: data.notes,
    };
  },
};
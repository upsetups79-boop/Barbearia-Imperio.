import { supabase } from '../supabaseClient';
import type { Booking, BookingStatus, NewBooking } from '../types';
import { BookingNotFoundError, type BookingRepository } from './bookingRepository';

export function createSupabaseBookingRepository(): BookingRepository {
  return {
    async list(): Promise<Booking[]> {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao listar agendamentos do Supabase:', error);
        return [];
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        serviceId: item.service_id,
        serviceName: item.service_name,
        professionalId: item.professional_id,
        professionalName: item.professional_name,
        date: item.date,
        startTime: item.start_time,
        durationMin: Number(item.duration_min),
        price: Number(item.price),
        customerName: item.client_name,
        customerPhone: item.client_phone,
        notes: item.notes,
        status: item.status as BookingStatus,
        createdAt: item.created_at,
      }));
    },

    async listByDateRange(startKey: string, endKey: string): Promise<Booking[]> {
      const all = await this.list();
      return all.filter((b) => b.date >= startKey && b.date <= endKey);
    },

    async listByProfessionalOnDate(professionalId: string, dateKey: string): Promise<Booking[]> {
      const all = await this.list();
      return all.filter((b) => b.professionalId === professionalId && b.date === dateKey);
    },

    async getById(id: string): Promise<Booking | null> {
      const all = await this.list();
      return all.find((b) => b.id === id) ?? null;
    },

    async create(input: NewBooking): Promise<Booking> {
      const dbPayload = {
        service_id: input.serviceId,
        service_name: input.serviceName,
        professional_id: input.professionalId,
        professional_name: input.professionalName,
        date: input.date,
        start_time: input.startTime,
        duration_min: input.durationMin,
        price: input.price,
        client_name: input.customerName,
        client_phone: input.customerPhone,
        notes: input.notes || '',
        status: 'confirmado',
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([dbPayload])
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        throw new Error('Falha ao salvar agendamento no banco de dados.');
      }

      return {
        id: data.id,
        serviceId: data.service_id,
        serviceName: data.service_name,
        professionalId: data.professional_id,
        professionalName: data.professional_name,
        date: data.date,
        startTime: data.start_time,
        durationMin: Number(data.duration_min),
        price: Number(data.price),
        customerName: data.client_name,
        customerPhone: data.client_phone,
        notes: data.notes,
        status: data.status as BookingStatus,
        createdAt: data.created_at,
      };
    },

    async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw new BookingNotFoundError();
      }

      return {
        id: data.id,
        serviceId: data.service_id,
        serviceName: data.service_name,
        professionalId: data.professional_id,
        professionalName: data.professional_name,
        date: data.date,
        startTime: data.start_time,
        durationMin: Number(data.duration_min),
        price: Number(data.price),
        customerName: data.client_name,
        customerPhone: data.client_phone,
        notes: data.notes,
        status: data.status as BookingStatus,
        createdAt: data.created_at,
      };
    },
  };
}

export const bookingRepository: BookingRepository = createSupabaseBookingRepository();
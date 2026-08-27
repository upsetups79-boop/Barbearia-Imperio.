// Mapeia os dados do formulário para os nomes exatos das colunas da tabela bookings do Supabase
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
  .insert([dbPayload]);

if (error) {
  console.error('Erro detalhado do Supabase:', error);
} else {
  console.log('Salvo com sucesso no Supabase!', data);
}

// Função auxiliar para mapear o formato do Supabase para o tipo Booking do app
// (Caso precise ajustar nomes de colunas do banco para o padrão do TypeScript)
// deno-lint-ignore no-explicit-any
function mapRowToBooking(row: any): Booking {
  return {
    id: row.id,
    serviceId: row.service_id ?? row.serviceId,
    serviceName: row.service_name ?? row.serviceName,
    professionalId: row.professional_id ?? row.professionalId,
    professionalName: row.professional_name ?? row.professionalName,
    date: row.date,
    startTime: row.start_time ?? row.startTime,
    durationMin: row.duration_min ?? row.durationMin,
    price: Number(row.price),
    customerName: row.client_name ?? row.customerName,
    customerPhone: row.client_phone ?? row.customerPhone,
    notes: row.notes,
    status: row.status as BookingStatus,
    createdAt: row.created_at ?? row.createdAt,
  };
}

export function createSupabaseBookingRepository(): BookingRepository {
  return {
    async list() {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Erro ao listar agendamentos:', error.message);
        return [];
      }

      return (data || []).map(mapRowToBooking);
    },

    async listByDateRange(startKey, endKey) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('date', startKey)
        .lte('date', endKey)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Erro ao listar por faixa de data:', error.message);
        return [];
      }

      return (data || []).map(mapRowToBooking);
    },

    async listByProfessionalOnDate(professionalId, dateKey) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('date', dateKey)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Erro ao listar por profissional:', error.message);
        return [];
      }

      return (data || []).map(mapRowToBooking);
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return mapRowToBooking(data);
    },

    async create(input: NewBooking) {
      // Opcional: Validar conflito direto no banco ou confiar na regra de negócio
      // Inserindo no Supabase com os nomes de colunas correspondentes à tabela SQL que criamos
      const payload = {
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
        notes: input.notes || null,
        status: 'confirmado',
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar agendamento no Supabase:', error.message);
        throw new BookingConflictError();
      }

      return mapRowToBooking(data);
    },

    async updateStatus(id: string, status: BookingStatus) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw new BookingNotFoundError();
      }

      return mapRowToBooking(data);
    },
  };
}
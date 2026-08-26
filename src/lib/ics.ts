import { SHOP } from '../config/shop';
import type { Booking } from '../types';
import { addMinutesToTime } from './datetime';

function toIcsStamp(dateKey: string, time: string): string {
  return `${dateKey.replace(/-/g, '')}T${time.replace(':', '')}00`;
}

/** Gera um arquivo .ics para o cliente salvar o horario na agenda do celular. */
export function buildIcs(booking: Booking): string {
  const end = addMinutesToTime(booking.startTime, booking.durationMin);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Barbearia Imperial//Agendamento//PT-BR',
    'BEGIN:VEVENT',
    `UID:${booking.id}@barbeariaimperial`,
    `DTSTART:${toIcsStamp(booking.date, booking.startTime)}`,
    `DTEND:${toIcsStamp(booking.date, end)}`,
    `SUMMARY:${booking.serviceName} - ${SHOP.name}`,
    `DESCRIPTION:Profissional: ${booking.professionalName}`,
    `LOCATION:${SHOP.address}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(booking: Booking): void {
  const blob = new Blob([buildIcs(booking)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `agendamento-${booking.date}-${booking.startTime.replace(':', 'h')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

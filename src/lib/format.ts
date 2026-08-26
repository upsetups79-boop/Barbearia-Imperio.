/** Formata valores em reais. */
export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Aplica a mascara (11) 91234-5678 durante a digitacao. */
export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';

  // Celulares no Brasil comecam com 9 apos o DDD; fixos, nunca.
  const isMobile = digits.length === 11 || (digits.length > 6 && digits[2] === '9');
  const splitAt = isMobile ? 7 : 6;

  if (digits.length <= splitAt) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, splitAt)}-${digits.slice(splitAt)}`;
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

/** Monta o link do WhatsApp com DDI do Brasil quando necessario. */
export function whatsappLink(phone: string, message?: string): string {
  let digits = onlyDigits(phone);
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h${String(rest).padStart(2, '0')}` : `${hours}h`;
}

/** Protocolo curto e legivel exibido para o cliente. */
export function protocolOf(id: string): string {
  return id.slice(-6).toUpperCase();
}

import { describe, expect, it } from 'vitest';
import { brl, formatDuration, isValidPhone, maskPhone, protocolOf, whatsappLink } from './format';

describe('formatacao', () => {
  it('formata valores em reais', () => {
    expect(brl(45).replace(/\u00a0/g, ' ')).toBe('R$ 45,00');
    expect(brl(70).replace(/\u00a0/g, ' ')).toBe('R$ 70,00');
  });

  it('aplica a mascara de telefone progressivamente', () => {
    expect(maskPhone('11')).toBe('(11');
    expect(maskPhone('1198')).toBe('(11) 98');
    expect(maskPhone('1198812')).toBe('(11) 98812');
    expect(maskPhone('11988124477')).toBe('(11) 98812-4477');
    expect(maskPhone('1138124477')).toBe('(11) 3812-4477');
  });

  it('valida telefones com 10 ou 11 digitos', () => {
    expect(isValidPhone('(11) 98812-4477')).toBe(true);
    expect(isValidPhone('(11) 3812-4477')).toBe(true);
    expect(isValidPhone('98812-4477')).toBe(false);
  });

  it('monta o link do whatsapp com DDI do Brasil', () => {
    expect(whatsappLink('(11) 98812-4477')).toBe('https://wa.me/5511988124477');
    expect(whatsappLink('5511988124477')).toBe('https://wa.me/5511988124477');
    expect(whatsappLink('(11) 98812-4477', 'Ola')).toBe('https://wa.me/5511988124477?text=Ola');
  });

  it('formata duracoes', () => {
    expect(formatDuration(30)).toBe('30 min');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(90)).toBe('1h30');
  });

  it('gera protocolo curto em maiusculas', () => {
    expect(protocolOf('abc123def456')).toBe('DEF456');
  });
});

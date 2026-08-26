// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

function resetApp(hash = '#/') {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.location.hash = hash;
}

afterEach(cleanup);

describe('fluxo publico de agendamento', () => {
  beforeEach(() => resetApp('#/'));

  it('leva o cliente do servico ate a confirmacao na tela', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Barbearia Imperial' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /^Corte\s*R\$/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Carlos Imperial/ }));

    const days = await screen.findAllByTestId('day-option');
    const firstOpenDay = days.find((day) => !(day as HTMLButtonElement).disabled)!;
    fireEvent.click(firstOpenDay);

    const slots = await screen.findAllByTestId('slot-option');
    expect(slots.length).toBeGreaterThan(0);
    const chosenTime = slots[0].textContent ?? '';
    fireEvent.click(slots[0]);

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    fireEvent.change(screen.getByLabelText('Seu nome'), {
      target: { value: 'Joao da Silva' },
    });
    fireEvent.change(screen.getByLabelText('WhatsApp'), {
      target: { value: '11988124477' },
    });
    expect((screen.getByLabelText('WhatsApp') as HTMLInputElement).value).toBe('(11) 98812-4477');

    fireEvent.click(screen.getByRole('button', { name: /Confirmar agendamento/ }));

    expect(await screen.findByText('Agendamento confirmado')).toBeTruthy();
    expect(screen.getByText('Joao da Silva')).toBeTruthy();
    expect(screen.getByText(new RegExp(chosenTime))).toBeTruthy();
    expect(screen.getByText(/Protocolo/)).toBeTruthy();
  });

  it('bloqueia o avanco enquanto os dados obrigatorios nao sao preenchidos', async () => {
    render(<App />);

    const continuar = screen.getByRole('button', { name: 'Continuar' });
    expect((continuar as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /^Barba\s*R\$/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Rafael Navalha/ }));

    const days = await screen.findAllByTestId('day-option');
    fireEvent.click(days.find((day) => !(day as HTMLButtonElement).disabled)!);
    const slots = await screen.findAllByTestId('slot-option');
    fireEvent.click(slots[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    fireEvent.click(screen.getByRole('button', { name: /Confirmar agendamento/ }));

    expect(await screen.findByText('Informe seu nome completo.')).toBeTruthy();
    expect(screen.getByText('Informe um WhatsApp valido com DDD.')).toBeTruthy();
  });
});

describe('painel administrativo', () => {
  beforeEach(() => resetApp('#/admin'));

  it('exige a senha correta e mostra os agendamentos do dia', async () => {
    render(<App />);

    const input = await screen.findByLabelText('Senha de acesso');

    fireEvent.change(input, { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Senha incorreta. Tente novamente.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Semana' })).toBeNull();

    fireEvent.change(screen.getByLabelText('Senha de acesso'), {
      target: { value: 'imperial2024' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    // Dados de demonstracao do dia.
    expect(await screen.findByText('Marcos Vinicius')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Semana' })).toBeTruthy();
    expect(window.sessionStorage.getItem('barbearia-imperial:admin-session')).toBe('unlocked');
  });

  it('cancela um agendamento e reflete o novo status', async () => {
    window.sessionStorage.setItem('barbearia-imperial:admin-session', 'unlocked');
    render(<App />);

    const card = (await screen.findByText('Marcos Vinicius')).closest('article')!;
    fireEvent.click(within(card).getByRole('button', { name: 'Cancelar' }));

    await waitFor(() => {
      const updated = screen.getByText('Marcos Vinicius').closest('article')!;
      expect(within(updated).getByText('Cancelado')).toBeTruthy();
    });
  });
});

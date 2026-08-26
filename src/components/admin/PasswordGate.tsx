import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_PASSWORD, SHOP } from '../../config/shop';
import { Button } from '../ui/Button';
import { LockIcon } from '../ui/Icons';

export const ADMIN_SESSION_KEY = 'barbearia-imperial:admin-session';

interface PasswordGateProps {
  onUnlock: () => void;
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'unlocked');
      onUnlock();
      return;
    }
    setError('Senha incorreta. Tente novamente.');
    setPassword('');
  }

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={handleSubmit} className="surface w-full max-w-sm rounded-2xl p-7 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/40 bg-gold/10">
          <LockIcon className="h-7 w-7 text-gold" />
        </span>
        <h1 className="font-display text-2xl font-semibold text-white">Painel do proprietario</h1>
        <p className="mt-1.5 text-sm text-mist">{SHOP.name}</p>

        <label htmlFor="admin-password" className="sr-only">
          Senha de acesso
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          autoComplete="current-password"
          placeholder="Senha de acesso"
          onChange={(event) => {
            setPassword(event.target.value);
            setError(null);
          }}
          className={`mt-6 min-h-[48px] w-full rounded-xl border bg-white/[0.03] px-4 text-center text-[15px] tracking-widest text-white placeholder:tracking-normal placeholder:text-mist/50 focus:outline-none ${
            error ? 'border-red-500/70' : 'border-line focus:border-gold'
          }`}
        />
        {error && <p className="mt-2 text-[13px] text-red-400">{error}</p>}

        <Button full className="mt-4" type="submit">
          Entrar
        </Button>

        <Link
          to="/"
          className="mt-5 inline-block text-[13px] text-mist/70 transition-colors hover:text-gold"
        >
          Voltar para a pagina de agendamento
        </Link>
      </form>
    </main>
  );
}

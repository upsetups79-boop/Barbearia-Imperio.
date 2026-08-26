import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingCard } from '../components/admin/BookingCard';
import { ADMIN_SESSION_KEY, PasswordGate } from '../components/admin/PasswordGate';
import { StatsBar } from '../components/admin/StatsBar';
import { PROFESSIONALS, SHOP } from '../config/shop';
import { bookingRepository } from '../data/localStorageAdapter';
import {
  formatLongDate,
  formatWeekRangeLabel,
  getWeekRange,
  todayKey,
  toDateKey,
} from '../lib/datetime';
import type { Booking, BookingStatus } from '../types';

type Tab = 'hoje' | 'semana';

export function Admin() {
  const [unlocked, setUnlocked] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(ADMIN_SESSION_KEY) === 'unlocked',
  );
  const [tab, setTab] = useState<Tab>('hoje');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalFilter, setProfessionalFilter] = useState<string>('todos');

  const week = useMemo(() => getWeekRange(), []);
  const today = todayKey();

  const load = useCallback(async () => {
    setLoading(true);
    const result = await bookingRepository.listByDateRange(week.startKey, week.endKey);
    setBookings(result);
    setLoading(false);
  }, [week.startKey, week.endKey]);

  useEffect(() => {
    if (unlocked) void load();
  }, [unlocked, load]);

  async function changeStatus(id: string, status: BookingStatus) {
    await bookingRepository.updateStatus(id, status);
    await load();
  }

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const filtered =
    professionalFilter === 'todos'
      ? bookings
      : bookings.filter((booking) => booking.professionalId === professionalFilter);

  const todayBookings = filtered.filter((booking) => booking.date === today);

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-5 pt-8 pb-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">Painel</p>
          <h1 className="font-display text-2xl font-semibold text-white">{SHOP.name}</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            setUnlocked(false);
          }}
          className="min-h-[36px] rounded-lg border border-line px-3 text-[13px] text-mist transition-colors hover:border-gold/60 hover:text-gold"
        >
          Sair
        </button>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-white/[0.03] p-1">
        {(
          [
            { id: 'hoje' as Tab, label: 'Hoje' },
            { id: 'semana' as Tab, label: 'Semana' },
          ]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            aria-pressed={tab === item.id}
            className={`min-h-[42px] rounded-lg text-[14px] font-semibold transition-all ${
              tab === item.id ? 'bg-gradient-gold text-ink' : 'text-mist hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
        {[{ id: 'todos', name: 'Todos' }, ...PROFESSIONALS].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setProfessionalFilter(item.id)}
            className={`min-h-[34px] shrink-0 rounded-full border px-3 text-[13px] transition-colors ${
              professionalFilter === item.id
                ? 'border-gold text-gold'
                : 'border-line text-mist hover:text-white'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-center text-sm text-mist">Carregando agendamentos...</p>
      ) : tab === 'hoje' ? (
        <section className="mt-5 space-y-4">
          <p className="text-[13px] text-mist first-letter:uppercase">{formatLongDate(today)}</p>
          <StatsBar bookings={todayBookings} showNext />
          {todayBookings.length === 0 ? (
            <EmptyState text="Nenhum agendamento para hoje." />
          ) : (
            <div className="space-y-3">
              {todayBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={(id) => void changeStatus(id, 'cancelado')}
                  onComplete={(id) => void changeStatus(id, 'concluido')}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="mt-5 space-y-4">
          <p className="text-[13px] text-mist">Semana de {formatWeekRangeLabel(week)}</p>
          <StatsBar bookings={filtered} />
          {filtered.length === 0 ? (
            <EmptyState text="Nenhum agendamento nesta semana." />
          ) : (
            <div className="space-y-6">
              {week.days.map((day) => {
                const key = toDateKey(day);
                const dayBookings = filtered.filter((booking) => booking.date === key);
                if (dayBookings.length === 0) return null;
                return (
                  <div key={key}>
                    <h2 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white first-letter:uppercase">
                      {formatLongDate(key)}
                      {key === today && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] tracking-wide text-gold uppercase">
                          Hoje
                        </span>
                      )}
                    </h2>
                    <div className="space-y-3">
                      {dayBookings.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          onCancel={(id) => void changeStatus(id, 'cancelado')}
                          onComplete={(id) => void changeStatus(id, 'concluido')}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <Link
        to="/"
        className="mt-10 block text-center text-[13px] text-mist/70 transition-colors hover:text-gold"
      >
        Ver pagina publica
      </Link>
    </main>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-sm text-mist">
      {text}
    </p>
  );
}

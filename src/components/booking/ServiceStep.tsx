import { SERVICES } from '../../config/shop';
import { brl, formatDuration } from '../../lib/format';
import type { ServiceId } from '../../types';
import { CrownIcon, RazorIcon, ScissorsIcon } from '../ui/Icons';

const icons: Record<ServiceId, typeof ScissorsIcon> = {
  corte: ScissorsIcon,
  barba: RazorIcon,
  'corte-barba': CrownIcon,
};

interface ServiceStepProps {
  selectedId: ServiceId | null;
  onSelect: (id: ServiceId) => void;
}

export function ServiceStep({ selectedId, onSelect }: ServiceStepProps) {
  return (
    <div className="animate-rise space-y-3">
      {SERVICES.map((service) => {
        const Icon = icons[service.id];
        const selected = selectedId === service.id;
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            aria-pressed={selected}
            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
              selected
                ? 'border-gold bg-gold/10 glow-gold'
                : 'border-line bg-white/[0.03] hover:border-gold/40'
            }`}
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                selected ? 'bg-gradient-gold text-ink' : 'bg-graphite text-gold'
              }`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg font-semibold text-white">{service.name}</span>
                <span className="shrink-0 font-semibold text-gold">{brl(service.price)}</span>
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-mist">
                {service.description}
              </span>
              <span className="mt-1 block text-[11px] font-medium tracking-wide text-mist/70 uppercase">
                {formatDuration(service.durationMin)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

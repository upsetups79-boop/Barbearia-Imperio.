import { PROFESSIONALS } from '../../config/shop';
import { CheckIcon } from '../ui/Icons';

interface ProfessionalStepProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProfessionalStep({ selectedId, onSelect }: ProfessionalStepProps) {
  return (
    <div className="animate-rise space-y-3">
      {PROFESSIONALS.map((professional) => {
        const selected = selectedId === professional.id;
        return (
          <button
            key={professional.id}
            type="button"
            onClick={() => onSelect(professional.id)}
            aria-pressed={selected}
            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
              selected
                ? 'border-gold bg-gold/10 glow-gold'
                : 'border-line bg-white/[0.03] hover:border-gold/40'
            }`}
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold ${
                selected ? 'bg-gradient-gold text-ink' : 'bg-graphite text-gold'
              }`}
            >
              {professional.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">{professional.name}</span>
              <span className="block text-[13px] text-mist">{professional.role}</span>
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                {professional.specialties.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-2 py-0.5 text-[11px] text-mist/80"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </span>
            {selected && <CheckIcon className="h-5 w-5 shrink-0 text-gold" />}
          </button>
        );
      })}
    </div>
  );
}

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Etapa ${current + 1} de ${steps.length}`}>
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <div key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={`h-1 rounded-full transition-all duration-300 ${
                done || active ? 'bg-gradient-gold' : 'bg-line'
              }`}
            />
            <span
              className={`text-[10px] font-semibold tracking-wide uppercase transition-colors ${
                active ? 'text-gold' : 'text-mist/60'
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

import { maskPhone } from '../../lib/format';
import { SummaryCard, type SummaryData } from './SummaryCard';

interface DetailsStepProps {
  summary: SummaryData;
  name: string;
  phone: string;
  notes: string;
  errors: { name?: string; phone?: string };
  onChange: (field: 'name' | 'phone' | 'notes', value: string) => void;
}

export function DetailsStep({ summary, name, phone, notes, errors, onChange }: DetailsStepProps) {
  return (
    <div className="animate-rise space-y-5">
      <SummaryCard data={summary} />

      <div className="space-y-4">
        <Field
          id="customer-name"
          label="Seu nome"
          placeholder="Como devemos te chamar?"
          value={name}
          error={errors.name}
          autoComplete="name"
          onChange={(value) => onChange('name', value)}
        />
        <Field
          id="customer-phone"
          label="WhatsApp"
          placeholder="(11) 91234-5678"
          value={phone}
          error={errors.phone}
          inputMode="tel"
          autoComplete="tel"
          onChange={(value) => onChange('phone', maskPhone(value))}
        />
        <div>
          <label
            htmlFor="customer-notes"
            className="mb-1.5 block text-[11px] font-semibold tracking-wider text-mist/70 uppercase"
          >
            Observacao <span className="normal-case opacity-60">(opcional)</span>
          </label>
          <textarea
            id="customer-notes"
            rows={2}
            value={notes}
            onChange={(event) => onChange('notes', event.target.value)}
            placeholder="Ex.: maquina 2 nas laterais"
            className="w-full resize-none rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[15px] text-white placeholder:text-mist/50 focus:border-gold focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  inputMode?: 'text' | 'tel';
  autoComplete?: string;
  onChange: (value: string) => void;
}

function Field({
  id,
  label,
  placeholder,
  value,
  error,
  inputMode = 'text',
  autoComplete,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-semibold tracking-wider text-mist/70 uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-[48px] w-full rounded-xl border bg-white/[0.03] px-4 text-[15px] text-white placeholder:text-mist/50 focus:outline-none ${
          error ? 'border-red-500/70' : 'border-line focus:border-gold'
        }`}
      />
      {error && <p className="mt-1.5 text-[13px] text-red-400">{error}</p>}
    </div>
  );
}

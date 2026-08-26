import { brl, formatDuration } from '../../lib/format';
import { formatLongDate } from '../../lib/datetime';
import { CalendarIcon, ClockIcon, ScissorsIcon, UserIcon } from '../ui/Icons';

export interface SummaryData {
  serviceName: string;
  professionalName: string;
  dateKey: string;
  startTime: string;
  durationMin: number;
  price: number;
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gold">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] tracking-wide text-mist/70 uppercase">{label}</span>
        <span className="block text-[15px] font-medium text-white first-letter:uppercase">
          {value}
        </span>
      </span>
    </div>
  );
}

export function SummaryCard({ data }: { data: SummaryData }) {
  return (
    <div className="surface rounded-2xl p-5">
      <div className="space-y-4">
        <Row icon={<ScissorsIcon className="h-5 w-5" />} label="Servico" value={data.serviceName} />
        <Row icon={<UserIcon className="h-5 w-5" />} label="Profissional" value={data.professionalName} />
        <Row icon={<CalendarIcon className="h-5 w-5" />} label="Data" value={formatLongDate(data.dateKey)} />
        <Row
          icon={<ClockIcon className="h-5 w-5" />}
          label="Horario"
          value={`${data.startTime} (${formatDuration(data.durationMin)})`}
        />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm text-mist">Total</span>
        <span className="font-display text-2xl font-semibold text-gradient-gold">
          {brl(data.price)}
        </span>
      </div>
    </div>
  );
}

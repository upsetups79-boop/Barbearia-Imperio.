interface IconProps {
  className?: string;
}

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
};

export function ScissorsIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
    </svg>
  );
}

export function RazorIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <path d="M3 7h13a4 4 0 0 1 0 8H8" />
      <path d="M8 15v4M5 19h6" />
    </svg>
  );
}

export function CrownIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <path d="m3 18 1.6-11L9 12l3-7 3 7 4.4-5L21 18z" />
      <path d="M3 21h18" />
    </svg>
  );
}

export function CalendarIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

export function ClockIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function UserIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function CheckIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function LockIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

export function WhatsAppIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.88 9.88 0 0 0 12.04 2Zm0 18.16a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.09.81.82-3.01-.2-.31a8.16 8.16 0 0 1 12.6-10.2 8.1 8.1 0 0 1 2.4 5.79c0 4.57-3.72 8.25-8.04 8.25Zm4.52-6.18c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.04-.39-1.98-1.23-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.58.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function SparkIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...common} className={className} aria-hidden="true">
      <path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
    </svg>
  );
}

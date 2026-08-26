import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'outline' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
}

const base =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-gold text-ink glow-gold hover:brightness-110',
  ghost: 'text-mist hover:text-white',
  outline: 'border border-line bg-white/[0.03] text-white hover:border-gold/60 hover:text-gold',
  danger: 'border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20',
};

export function Button({ variant = 'primary', full, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    />
  );
}

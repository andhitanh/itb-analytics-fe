import { cn } from '@/lib/utils';

interface StatCardProps {
  label:          string;
  value:          string;
  sub:            string;
  icon?:          React.ReactNode;
  valueClassName?: string;
}

export function StatCard({ label, value, sub, icon, valueClassName }: StatCardProps) {
  return (
    <div className="flex-1 bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3.5">
      {icon && (
        <div className="w-[42px] h-[42px] rounded-[10px] bg-active flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div>
        <p className="text-[11px] font-semibold text-neutral uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className={cn('text-[22px] font-extrabold text-text-dark leading-none mb-0.5', valueClassName)}>
          {value}
        </p>
        <p className="text-[11px] text-neutral">{sub}</p>
      </div>
    </div>
  );
}
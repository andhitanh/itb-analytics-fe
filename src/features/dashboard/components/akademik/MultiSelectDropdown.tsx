// src/features/dashboard/components/akademik/MultiSelectDropdown.tsx
import { useState } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  label:        string;
  options:      MultiSelectOption[];
  selected:     string[];
  onChange:     (next: string[]) => void;
  disabled?:    boolean;
  className?:   string;
}

/**
 * Dropdown multi-select: collapsed header (chevron + "Semua {label}" atau
 * badge "N dipilih") yang membuka popover checkbox list saat diklik.
 * Klik di luar popover otomatis menutup (ditangani oleh Radix Popover).
 */
export function MultiSelectDropdown({
  label, options, selected, onChange, disabled, className,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const count = selected.length;

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex items-center justify-between gap-2 h-8 px-2.5 rounded-md border bg-surface',
            'text-[12px] transition-colors duration-150 min-w-[150px]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            open || count > 0 ? 'border-primary' : 'border-border-mid hover:bg-active',
            className,
          )}
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-semibold text-neutral uppercase tracking-wide shrink-0">
              {label}
            </span>
            {count > 0 ? (
              <span className="inline-flex items-center rounded-full bg-primary text-white text-[11px] font-semibold px-2 py-0.5 leading-none whitespace-nowrap">
                {count} dipilih
              </span>
            ) : (
              <span className="text-text-mid font-normal truncate">
                Semua {label}
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 shrink-0 text-neutral transition-transform duration-150',
              open && 'rotate-180',
            )}
          />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className={cn(
            'z-50 w-[220px] rounded-lg border border-border bg-surface shadow-md',
            'p-1.5 data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          {options.length === 0 ? (
            <div className="px-2.5 py-3 text-[12px] text-neutral text-center">
              Tidak ada opsi
            </div>
          ) : (
            <div className="max-h-[240px] overflow-y-auto flex flex-col gap-0.5">
              {options.map(o => {
                const checked = selected.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className={cn(
                      'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer select-none',
                      'text-[12.5px] text-text-dark hover:bg-active transition-colors duration-100',
                    )}
                  >
                    <span
                      className={cn(
                        'flex items-center justify-center h-4 w-4 shrink-0 rounded border transition-colors duration-100',
                        checked
                          ? 'bg-primary border-primary'
                          : 'bg-surface border-border-mid',
                      )}
                    >
                      {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleValue(o.value)}
                    />
                    <span className="truncate">{o.label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {count > 0 && (
            <>
              <div className="h-px bg-border my-1" />
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full text-left px-2 py-1.5 rounded-md text-[12px] text-danger hover:bg-[#FEF2F2] transition-colors duration-100"
              >
                Hapus pilihan
              </button>
            </>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
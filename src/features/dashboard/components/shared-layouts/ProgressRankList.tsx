import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressRankItem {
  /** Label utama — bisa nama Q, nama fakultas, nama aspek, dll */
  label:          string;
  /** Nilai numerik yang ditampilkan dan dijadikan dasar progress bar */
  value:          number;
  /** Elemen opsional di kanan nilai — TrendBadge, SentimentBadge, dll */
  badge?:         React.ReactNode;
  /** Label sekunder di bawah label utama, misal nama domain aspek */
  sublabel?:      string;
  /** Warna CSS untuk sublabel */
  sublabelColor?: string;
  /**
   * Teks lengkap untuk tooltip saat hover (mis. pertanyaan kuesioner utuh,
   * tanpa dipotong). Kalau tidak diisi, tooltip memakai `label` apa adanya.
   */
  fullLabel?:     string;
}

interface ProgressRankListProps {
  items:  ProgressRankItem[];
  /** Warna bar dan teks nilai — ambil dari chartColors */
  color:  string;
  /**
   * Domain untuk kalkulasi lebar bar: [min, max]
   * Contoh: skor kuesioner → [2.5, 4.0] | rata-rata fakultas → [3.0, 4.0]
   */
  domain: [number, number];
  /**
   * Menentukan warna lingkaran nomor urut
   * top = hijau (default) | bottom = merah
   */
  mode?:  'top' | 'bottom';
  showRank?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProgressRankList({
  items,
  color,
  domain,
  mode = 'top',
  showRank = true,
}: ProgressRankListProps) {
  const [domainMin, domainMax] = domain;

  const circleClass = mode === 'top' ? 'bg-score-high-bg' : 'bg-score-low-bg';
  const rankClass   = mode === 'top' ? 'text-score-high-text' : 'text-score-low-text';

  return (
    <TooltipProvider delayDuration={200}>
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const barPct = Math.min(
          100,
          Math.max(
            0,
            ((item.value - domainMin) / (domainMax - domainMin)) * 100,
          ),
        );

        const rowContent = (
          <div className="flex items-center gap-2.5 cursor-default">

            {/* Nomor urut — disembunyikan kalau cuma 1 entitas (tidak ada yang diperingkat) */}
            {showRank && (
              <div className={cn(
                'w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0',
                circleClass,
              )}>
                <span className={cn('text-[11px] font-bold', rankClass)}>
                  {i + 1}
                </span>
              </div>
            )}

            {/* Label + progress bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">

                {/* Label area */}
                <div className="flex flex-col min-w-0 mr-2">
                  <span className="text-[11.5px] font-medium text-text-dark truncate leading-snug">
                    {item.label}
                  </span>
                  {item.sublabel && (
                    <span
                      className="text-[10.5px] font-semibold leading-none mt-0.5"
                      style={{ color: item.sublabelColor ?? '#9BAAC4' }}
                    >
                      {item.sublabel}
                    </span>
                  )}
                </div>

                {/* Nilai + badge */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-[13px] font-bold"
                    style={{ color }}
                  >
                    {item.value.toFixed(2)}
                  </span>
                  {item.badge}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-[5px] bg-border rounded-full">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${barPct}%`, backgroundColor: color }}
                />
              </div>
            </div>

          </div>
        );

        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              {rowContent}
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px] whitespace-normal text-left">
              <span>
                {item.fullLabel ?? item.label}
                {' — '}
                <span className="font-semibold">Skor : {item.value.toFixed(2)}</span>
              </span>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
    </TooltipProvider>
  );
}
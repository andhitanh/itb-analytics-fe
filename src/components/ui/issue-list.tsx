import { cn } from '@/lib/utils';
import { SentimentBadge } from '@/components/ui/domain-badges';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Issue {
  label:     string;
  count:     number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface IssueListProps {
  issues:   Issue[];
  barColor: string;        // warna dari chartColors — tetap pakai hex karena Recharts prop
  selected: number | null;
  onSelect: (i: number | null) => void;
}

// ─── IssueList ────────────────────────────────────────────────────────────────

export function IssueList({ issues, barColor, selected, onSelect }: IssueListProps) {
  const max = issues[0].count;

  return (
    <div className="flex flex-col gap-1.5">
      {issues.map((iss, i) => {
        const isSelected = selected === i;
        return (
          <button
            key={i}
            onClick={() => onSelect(isSelected ? null : i)}
            className={cn(
              'flex items-center gap-2 px-2.5 py-2 rounded-lg text-left w-full transition-colors duration-150',
              isSelected
                ? 'bg-active border border-[--tw-border-color]'
                : 'border border-transparent hover:bg-subtle'
            )}
            style={isSelected ? { borderColor: barColor } : undefined}
          >
            {/* Nomor urut */}
            <span className="w-[18px] text-[11px] text-neutral font-bold shrink-0">
              {i + 1}
            </span>

            {/* Konten */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-text-dark truncate">
                  {iss.label}
                </span>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <SentimentBadge sentiment={iss.sentiment} />
                  <span
                    className="text-[11.5px] font-bold"
                    style={{ color: barColor }}
                  >
                    {iss.count.toLocaleString('id')}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-border rounded-full">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(iss.count / max) * 100}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── RawComments ──────────────────────────────────────────────────────────────

interface RawCommentsProps {
  comments:    string[];
  selected:    number | null;
  issueLabel?: string;
}

export function RawComments({ comments, selected, issueLabel }: RawCommentsProps) {
  return (
    <div>
      <p className="text-[12px] text-neutral mb-2.5">
        {selected !== null && issueLabel
          ? `Filter: ${issueLabel}`
          : 'Semua isu (klik isu di kiri untuk filter)'}
      </p>

      <div className="flex flex-col gap-2.5">
        {comments.map((c, i) => (
          <div
            key={i}
            className="px-3.5 py-2.5 rounded-lg bg-[#F9FAFB] border border-border text-[12.5px] text-[#374151] leading-relaxed"
          >
            <div className="flex items-start gap-2">
              <span className="text-base text-[#D1D5DB] shrink-0 leading-none mt-0.5">
                "
              </span>
              <span>{c}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { cva } from 'class-variance-authority';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ─── Trend Badge ──────────────────────────────────────────────────────────────

export function TrendBadge({ trend }: { trend: number }) {
  const up = trend >= 0;
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[11px] font-semibold px-1.5 py-0.5 border-0',
        up
          ? 'bg-score-high-bg text-score-high-text'
          : 'bg-score-low-bg  text-score-low-text'
      )}
    >
      {up ? '▲' : '▼'} {Math.abs(parseFloat(trend.toFixed(2)))}
    </Badge>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────

const scoreTextVariants = cva('font-extrabold leading-none', {
  variants: {
    size:  { sm: 'text-base', md: 'text-[22px]', lg: 'text-[28px]' },
    level: { high: 'text-success', mid: 'text-mid', low: 'text-danger' },
  },
});

function getScoreLevel(v: number): 'high' | 'mid' | 'low' {
  if (v >= 3.5) return 'high';
  if (v >= 3.0) return 'mid';
  return 'low';
}

export function ScoreBadge({
  label, value, size = 'md',
}: {
  label: string;
  value: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[11px] font-semibold text-neutral uppercase tracking-wide">
        {label}
      </p>
      <span className={scoreTextVariants({ size, level: getScoreLevel(value) })}>
        {value.toFixed(2)}
      </span>
      <span className="text-[11px] text-neutral">dari 4.00</span>
    </div>
  );
}

// ─── Sentiment Badge ──────────────────────────────────────────────────────────

const sentimentVariants = cva('', {
  variants: {
    sentiment: {
      positive: 'bg-pos-bg text-pos-text',
      neutral:  'bg-neu-bg text-neu-text',
      negative: 'bg-neg-bg text-neg-text',
    },
  },
});

const SENTIMENT_LABEL = {
  positive: 'Positif',
  neutral:  'Netral',
  negative: 'Negatif',
} as const;

export function SentimentBadge({
  sentiment,
}: {
  sentiment: 'positive' | 'neutral' | 'negative';
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[10px] font-bold px-1.5 py-px border-0 rounded',
        sentimentVariants({ sentiment })
      )}
    >
      {SENTIMENT_LABEL[sentiment]}
    </Badge>
  );
}
import { QUESTIONS_SHORT, QUESTIONS_FULL } from '@/features/dashboard/mocks/mockData';
import { HEATMAP_Q_FIELDS } from '@/features/dashboard/utils/skorHeatmap';
import type { HeatmapRow, SkorHeatmapResponse } from '@/features/dashboard/api/akademik';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreToColor(score: number): { bg: string; text: string } {
  if (score >= 3.70) return { bg: '#003366', text: '#FFF' };
  if (score >= 3.55) return { bg: '#1A6AB5', text: '#FFF' };
  if (score >= 3.40) return { bg: '#4CA3DD', text: '#FFF' };
  if (score >= 3.20) return { bg: '#D6EAFF', text: '#003366' };
  if (score >= 3.00) return { bg: '#FEF9C3', text: '#854D0E' };
  return { bg: '#FEE2E2', text: '#9B1C1C' };
}

const EMPTY_CELL = { bg: '#F3F4F6', text: '#9CA3AF' };

/** Index Q dengan skor 3 terendah pada satu baris — null di-skip (bukan "terendah", tapi "tidak ada data"). */
function bottom3Indices(scores: (number | null)[]): Set<number> {
  const ranked = scores
    .map((v, i) => ({ i, v }))
    .filter((r): r is { i: number; v: number } => r.v !== null)
    .sort((a, b) => a.v - b.v);
  return new Set(ranked.slice(0, 3).map(r => r.i));
}

const LEGEND_ITEMS = [
  { bg: '#003366', text: '#FFF',    label: '≥3.70'     },
  { bg: '#1A6AB5', text: '#FFF',    label: '3.55–3.70' },
  { bg: '#4CA3DD', text: '#FFF',    label: '3.40–3.55' },
  { bg: '#D6EAFF', text: '#003366', label: '3.20–3.40' },
  { bg: '#FEF9C3', text: '#854D0E', label: '3.00–3.20' },
  { bg: '#FEE2E2', text: '#9B1C1C', label: '<3.00'     },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScoreHeatmapProps {
  data:      SkorHeatmapResponse | null;
  isLoading: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ScoreHeatmap({ data, isLoading }: ScoreHeatmapProps) {
  const items = data?.items ?? [];
  const rowLabel = (row: HeatmapRow) => row.kode;

  if (isLoading) {
    return (
      <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">
        Memuat data heatmap…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">
        Tidak ada data untuk filter ini.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] w-full min-w-[720px]">
        <thead>
          <tr>
            <th className="w-[60px] px-2 py-1 text-left text-neutral font-semibold">
              {data?.granularity === 'fakultas' ? 'Fakultas' : 'Prodi'}
            </th>
            {QUESTIONS_SHORT.map(q => (
              <th key={q} className="px-1 py-1 text-center text-neutral font-semibold w-[52px]">
                {q}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(row => {
            const scores = HEATMAP_Q_FIELDS.map(field => row[field]);
            const bottom3 = bottom3Indices(scores);
            return (
              <tr key={row.kode}>
                <td className="py-0.5 pr-2 font-semibold text-text-dark whitespace-nowrap text-[11.5px]">
                  {rowLabel(row)}
                </td>
                {scores.map((score, qi) => {
                  const { bg, text } = score !== null ? scoreToColor(score) : EMPTY_CELL;
                  const isBottom = bottom3.has(qi);
                  return (
                    <td
                      key={qi}
                      title={
                        score !== null
                          ? `${rowLabel(row)} — ${QUESTIONS_FULL[qi]}\nSkor: ${score.toFixed(2)}`
                          : `${rowLabel(row)} — ${QUESTIONS_FULL[qi]}\nTidak ada data`
                      }
                      className="px-0.5 py-1 text-center cursor-default"
                    >
                      <div
                        className="rounded px-0 py-1 text-[10.5px]"
                        style={{
                          backgroundColor: bg,
                          color: text,
                          fontWeight: isBottom ? 700 : 500,
                          outline: isBottom ? '2px solid #E74C3C' : 'none',
                          outlineOffset: -1,
                        }}
                      >
                        {score !== null ? score.toFixed(2) : '—'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {LEGEND_ITEMS.map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div
              className="w-5 h-3.5 rounded-[3px]"
              style={{ backgroundColor: l.bg }}
            />
            <span className="text-[11px] text-neutral">{l.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-3.5 rounded-[3px] border-2 border-danger bg-[#D6EAFF]" />
          <span className="text-[11px] text-neutral">Bottom 3 per baris</span>
        </div>
      </div>
    </div>
  );
}
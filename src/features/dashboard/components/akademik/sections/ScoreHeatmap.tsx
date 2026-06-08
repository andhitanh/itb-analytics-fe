import {
  FACULTIES, QUESTIONS_SHORT, QUESTIONS_FULL, LATEST_SCORES,
} from '@/features/dashboard/mocks/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreToColor(score: number): { bg: string; text: string } {
  if (score >= 3.70) return { bg: '#003366', text: '#FFF' };
  if (score >= 3.55) return { bg: '#1A6AB5', text: '#FFF' };
  if (score >= 3.40) return { bg: '#4CA3DD', text: '#FFF' };
  if (score >= 3.20) return { bg: '#D6EAFF', text: '#003366' };
  if (score >= 3.00) return { bg: '#FEF9C3', text: '#854D0E' };
  return { bg: '#FEE2E2', text: '#9B1C1C' };
}

const LEGEND_ITEMS = [
  { bg: '#003366', text: '#FFF',    label: '≥3.70'     },
  { bg: '#1A6AB5', text: '#FFF',    label: '3.55–3.70' },
  { bg: '#4CA3DD', text: '#FFF',    label: '3.40–3.55' },
  { bg: '#D6EAFF', text: '#003366', label: '3.20–3.40' },
  { bg: '#FEF9C3', text: '#854D0E', label: '3.00–3.20' },
  { bg: '#FEE2E2', text: '#9B1C1C', label: '<3.00'     },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ScoreHeatmap() {
  // Hitung bottom 3 pertanyaan per fakultas
  const bottom3: Record<string, Set<number>> = {};
  FACULTIES.forEach(f => {
    const scores = LATEST_SCORES[f];
    const ranked = scores.map((v, i) => ({ i, v })).sort((a, b) => a.v - b.v);
    bottom3[f] = new Set(ranked.slice(0, 3).map(r => r.i));
  });

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] w-full min-w-[720px]">
        <thead>
          <tr>
            <th className="w-[60px] px-2 py-1 text-left text-neutral font-semibold">
              Fakultas
            </th>
            {QUESTIONS_SHORT.map(q => (
              <th key={q} className="px-1 py-1 text-center text-neutral font-semibold w-[52px]">
                {q}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FACULTIES.map(f => (
            <tr key={f}>
              <td className="py-0.5 pr-2 font-semibold text-text-dark whitespace-nowrap text-[11.5px]">
                {f}
              </td>
              {LATEST_SCORES[f].map((score, qi) => {
                const { bg, text } = scoreToColor(score);
                const isBottom = bottom3[f].has(qi);
                return (
                  <td
                    key={qi}
                    title={`${f} — ${QUESTIONS_FULL[qi]}\nSkor: ${score.toFixed(2)}`}
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
                      {score.toFixed(2)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
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
          <span className="text-[11px] text-neutral">Bottom 3 per fakultas</span>
        </div>
      </div>
    </div>
  );
}
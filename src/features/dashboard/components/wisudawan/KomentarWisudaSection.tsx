import { useState }  from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { KOMENTAR_WISUDA } from '@/features/dashboard/mocks/mockDataWisudawan';

type EmosiFiilter = 'lucu' | 'inspiratif' | 'popular';

const EMOSI_LABELS: Record<EmosiFiilter, string> = {
  lucu:        '😄 Paling Lucu',
  inspiratif:  '✨ Paling Inspiratif',
  popular:     '🔥 Paling Populer',
};

const PILL_CLASS =
  'h-7 px-2.5 text-[12px] rounded-md border border-border-mid ' +
  'data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:border-primary ' +
  'data-[state=on]:font-semibold hover:bg-active transition-colors duration-150';

export function KomentarWisudaSection() {
  const [emosi, setEmosi] = useState<EmosiFiilter>('lucu');
  const comments = KOMENTAR_WISUDA[emosi];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Komentar Wisudawan untuk Acara Wisuda</CardTitle>
        <CardDescription>
          Top 3 komentar terpilih — khusus kebutuhan pembacaan di upacara wisuda
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter pills */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-semibold text-neutral uppercase tracking-wide shrink-0">
            Kategori
          </span>
          <ToggleGroup
            type="single"
            value={emosi}
            onValueChange={v => v && setEmosi(v as EmosiFiilter)}
            className="gap-1"
          >
            {(Object.entries(EMOSI_LABELS) as [EmosiFiilter, string][]).map(([key, label]) => (
              <ToggleGroupItem key={key} value={key} className={PILL_CLASS}>
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Quote cards */}
        <div className="flex flex-col gap-3">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-3.5 p-3.5 rounded-xl bg-[#F9FAFB] border border-border">
              <div className="w-7 h-7 rounded-full bg-active flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[12px] font-bold text-primary">{i + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-[#374151] leading-relaxed italic mb-2">
                  "{c.text}"
                </p>
                <div className="flex gap-2">
                  <span className="text-[11px] text-neutral bg-border px-2 py-px rounded font-medium">
                    {c.strata}
                  </span>
                  <span className="text-[11px] text-primary bg-active px-2 py-px rounded font-semibold">
                    {c.faculty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
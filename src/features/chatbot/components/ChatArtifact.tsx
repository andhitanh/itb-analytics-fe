// src/features/chatbot/components/ChatArtifact.tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chartColors, AXIS_STYLE } from '@/styles/chart-token';
import type { ChatArtifact as ChatArtifactType } from '@/features/chatbot/types';

interface ChatArtifactProps {
  artifact: ChatArtifactType;
}

/**
 * Render 1 artifact dari respons agent -- tabel atau chart. Dipisah dari
 * MessageBubble supaya logic rendering per jenis artifact tidak menumpuk
 * di komponen pesan, dan gampang ditambah jenis baru nanti tanpa menyentuh
 * MessageBubble sama sekali.
 */
export function ChatArtifact({ artifact }: ChatArtifactProps) {
  if (artifact.artifact_type === 'table') {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle>{artifact.title}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {artifact.columns.map((col) => (
                  <th key={col.name} className="whitespace-nowrap px-2 py-1.5 font-medium text-muted-foreground">
                    {col.display_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artifact.rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {artifact.columns.map((col) => (
                    <td key={col.name} className="whitespace-nowrap px-2 py-1.5 text-foreground">
                      {String(row[col.name] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {artifact.is_truncated && (
            <p className="mt-2 text-xs text-muted-foreground">
              Menampilkan {artifact.rows.length} dari {artifact.row_count} baris.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // artifact_type === 'chart'
  const spec = artifact.chart_spec as {
    data?: { values?: Record<string, unknown>[] };
    encoding?: { x?: { field?: string }; y?: { field?: string } };
  };
  const values = spec.data?.values ?? [];
  const xField = spec.encoding?.x?.field;
  const yField = spec.encoding?.y?.field;

  if (!values.length || !xField || !yField) {
    return null; // spesifikasi chart tak terduga -- diam-diam skip, narrative tetap tampil
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{artifact.title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {artifact.chart_type === 'line' ? (
            <LineChart data={values} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.pale} vertical={false} />
              <XAxis dataKey={xField} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey={yField} stroke={chartColors.primary} strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={values} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.pale} vertical={false} />
              <XAxis dataKey={xField} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey={yField} fill={chartColors.mid} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
      {artifact.insight && (
        <CardContent className="pt-0 text-xs text-muted-foreground">{artifact.insight}</CardContent>
      )}
    </Card>
  );
}
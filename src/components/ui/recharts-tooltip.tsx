export function RechartsTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border-mid rounded-lg px-3 py-2 shadow-md text-[12px]">
      <p className="font-bold text-text-dark mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.name}</span>
          <b className="text-text-dark">
            {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
          </b>
        </div>
      ))}
    </div>
  );
}
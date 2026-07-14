interface BreadcrumbProps {
  root:    string;
  current: string;
  onBack:  () => void;
}

/**
 * Breadcrumb generik untuk navigasi drill-down (mis. Semua Fakultas > STEI).
 * Tidak spesifik ke domain akademik — bisa dipakai konteks drill-down apa
 * pun di dashboard.
 */
export function Breadcrumb({ root, current, onBack }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-1.5 text-[12.5px] text-text-mid mb-3">
      <button
        onClick={onBack}
        className="text-primary hover:underline"
      >
        {root}
      </button>
      <span className="text-neutral">/</span>
      <span className="font-semibold text-text-dark">{current}</span>
    </div>
  );
}
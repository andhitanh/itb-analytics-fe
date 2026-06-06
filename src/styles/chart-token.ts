// Khusus untuk props Recharts dan kebutuhan non-CSS lainnya.
// Seluruh styling UI menggunakan Tailwind class, bukan file ini.
export const chartColors = {
  primary:  '#003366',
  mid:      '#1A6AB5',
  light:    '#4CA3DD',
  pale:     '#A8D4F5',
  purple:   '#9B59B6',
  danger:   '#E74C3C',
  warning:  '#F5A623',
  success:  '#27AE60',
  neutral:  '#9BAAC4',
} as const;

export const AXIS_STYLE = {
  fontSize: 11,
  fill: chartColors.neutral,
} as const;
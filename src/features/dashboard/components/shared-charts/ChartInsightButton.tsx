// src/features/dashboard/components/shared-charts/ChartInsightButton.tsx
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CHART_INSIGHT_QUERY,
  type ChartContext,
  type ChartInsightNavigationState,
} from '@/features/chatbot/types';

interface ChartInsightButtonProps {
  chartContext: ChartContext;
}

/**
 * Tombol "Tanya insight" -- dipasang di pojok kartu dashboard mana pun yang
 * datanya bisa dijelaskan chatbot (lihat 00-README.md untuk daftar chart_type
 * yang didukung). Navigasi ke /chatbot membawa chart_context lewat router
 * state (bukan query string -- payload-nya terlalu besar/kompleks untuk URL).
 *
 * Sengaja tidak menerima children/label custom -- label & ikon harus selalu
 * identik di semua kartu, supaya user cukup belajar sekali apa fungsi tombol
 * ini dan langsung mengenalinya di kartu mana pun.
 */
export function ChartInsightButton({ chartContext }: ChartInsightButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const state: ChartInsightNavigationState = {
      chartContext,
      autoQuery: CHART_INSIGHT_QUERY,
    };
    navigate('/chatbot', { state });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="h-7 gap-1.5 px-2 text-primary hover:bg-subtle hover:text-primary"
    >
      <MessageCircle className="size-3.5" />
      <span className="text-[12.5px] font-medium">Tanya insight</span>
    </Button>
  );
}
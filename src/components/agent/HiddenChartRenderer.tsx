import type { EvidenceChart } from '../../types';
import InsightEvidenceChart from './InsightEvidenceChart';

interface HiddenChartRendererProps {
  charts: EvidenceChart[];
}

/**
 * HiddenChartRenderer - Renders charts invisibly for PDF capture
 * Places charts in the DOM but makes them invisible to the user
 * This allows html2canvas to capture the charts even when the Evidence Modal is closed
 */
export default function HiddenChartRenderer({ charts }: HiddenChartRendererProps) {
  if (charts.length === 0) return null;

  return (
    <div
      id="hidden-chart-container"
      style={{
        position: 'fixed',
        top: '-10000px',
        left: '-10000px',
        width: '1200px',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -9999,
      }}
      aria-hidden="true"
    >
      {charts.map((chart) => (
        <div key={chart.id} style={{ marginBottom: '20px' }}>
          <InsightEvidenceChart chart={chart} />
        </div>
      ))}
    </div>
  );
}

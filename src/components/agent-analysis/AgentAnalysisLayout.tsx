import type { ReactNode } from 'react';

interface AgentAnalysisLayoutProps {
  header: ReactNode;
  overview: ReactNode;
  recommendations: ReactNode;
  evidence: ReactNode;
}

/**
 * AgentAnalysisLayout - Full-width layout for agent analysis page
 * Organizes sections in a responsive grid layout
 */
export default function AgentAnalysisLayout({
  header,
  overview,
  recommendations,
  evidence,
}: AgentAnalysisLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        {header}

        {/* Main Content - Vertical Stack */}
        <div className="space-y-6">
          {/* Overview Section */}
          {overview}

          {/* Recommendations Section */}
          {recommendations}

          {/* Evidence Section */}
          {evidence}
        </div>
      </div>
    </div>
  );
}

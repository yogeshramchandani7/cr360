import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getClimateRiskDetails } from '../../lib/mockData';
import EmissionsSummaryCard from '../../components/climate-risk/EmissionsSummaryCard';
import ClimateExposureSummaryCard from '../../components/climate-risk/ClimateExposureSummaryCard';
import ClimateRiskScoreCard from '../../components/climate-risk/ClimateRiskScoreCard';
import ClimateRiskReportCard from '../../components/climate-risk/ClimateRiskReportCard';
import PeerComparisonDimensionsTable from '../../components/climate-risk/PeerComparisonDimensionsTable';
import PeerComparisonBubbleChart from '../../components/climate-risk/PeerComparisonBubbleChart';
import PeerComparisonTable from '../../components/climate-risk/PeerComparisonTable';

export default function ClimateRiskPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const climateDetails = companyId ? getClimateRiskDetails(companyId) : null;

  if (!climateDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h2>
          <p className="text-gray-600">The requested company could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.close()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Close
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Climate Risk Summary for {climateDetails.companyName}
          </h1>
          <p className="text-sm text-gray-600">Environmental, Social & Governance Assessment</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1: Emissions Summary */}
          <EmissionsSummaryCard emissions={climateDetails.emissionsSummary} />

          {/* Section 2: Exposure Summary */}
          <ClimateExposureSummaryCard exposure={climateDetails.exposureSummary} />

          {/* Section 3: Climate Risk Score */}
          <ClimateRiskScoreCard score={climateDetails.climateRiskScore} />

          {/* Section 4: Climate Risk Report */}
          <ClimateRiskReportCard report={climateDetails.climateRiskReport} />

          {/* Section 5: Peer Comparison Dimensions */}
          <PeerComparisonDimensionsTable dimensions={climateDetails.peerComparisonDimensions} />

          {/* Section 6: Peer Comparison Bubble Chart */}
          <PeerComparisonBubbleChart peers={climateDetails.peerComparison} />

          {/* Section 7: Peer Comparison Table */}
          <PeerComparisonTable peers={climateDetails.peerComparison} />
        </div>
      </div>
    </div>
  );
}

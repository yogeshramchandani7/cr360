import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getRiskDetails } from '../../lib/mockData';
import RiskClassificationCard from '../../components/risk-details/RiskClassificationCard';
import RiskMetricsCard from '../../components/risk-details/RiskMetricsCard';
import CreditRatingHistoryTable from '../../components/risk-details/CreditRatingHistoryTable';
import CreditScoringHistoryTable from '../../components/risk-details/CreditScoringHistoryTable';
import CRISILReportCard from '../../components/risk-details/CRISILReportCard';
import CreditRiskRepoCard from '../../components/risk-details/CreditRiskRepoCard';

export default function RiskDetailsPage() {
  const { companyId } = useParams<{ companyId: string }>();

  const riskDetails = companyId ? getRiskDetails(companyId) : null;

  if (!riskDetails) {
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.close()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Close
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Summary for Reliance Industries</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Customer - Member of</span>
            <span className="font-medium text-gray-900">{riskDetails.companyName}</span>
            <span>Reliance Group</span>
            <span>Member - Group of Connected Counterparties</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-6">
          {/* Section 1: Borrower Risk Classification & Status */}
          <RiskClassificationCard classification={riskDetails.borrowerRiskClassification} />

          {/* Section 2: Risk Metrics */}
          <RiskMetricsCard metrics={riskDetails.riskMetrics} />

          {/* Section 3: Credit Rating History */}
          <CreditRatingHistoryTable history={riskDetails.creditRatingHistory} />

          {/* Section 4: Credit Scoring History */}
          <CreditScoringHistoryTable history={riskDetails.creditScoringHistory} />

          {/* Section 5: Credit Rating & Scoring Reports */}
          <CRISILReportCard reports={riskDetails.ratingReports} />

          {/* Section 6: Credit Risk Repo */}
          <CreditRiskRepoCard riskRepo={riskDetails.creditRiskRepo} />
        </div>
      </div>
    </div>
  );
}

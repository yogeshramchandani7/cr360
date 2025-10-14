import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getKYCComplianceDetails } from '../../lib/mockData';
import AdverseMediaScansCard from '../../components/kyc-compliance/AdverseMediaScansCard';
import RiskSummaryPanel from '../../components/kyc-compliance/RiskSummaryPanel';
import RiskScoreHistoryTable from '../../components/kyc-compliance/RiskScoreHistoryTable';
import WatchListScansTable from '../../components/kyc-compliance/WatchListScansTable';
import ComplianceSummaryCards from '../../components/kyc-compliance/ComplianceSummaryCards';

export default function ApprovalsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const kycDetails = companyId ? getKYCComplianceDetails(companyId) : null;

  if (!kycDetails) {
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
      <div className="max-w-[1600px] mx-auto">
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
            Risk Summary for {kycDetails.companyName}
          </h1>
          <p className="text-sm text-gray-600">KYC & ALM Risk & Compliance</p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Section 1: Adverse Media Scans */}
            <AdverseMediaScansCard scans={kycDetails.adverseMediaScans} />

            {/* Section 3: Risk Score History */}
            <RiskScoreHistoryTable history={kycDetails.riskScoreHistory} />

            {/* Section 4: Watch List Scans */}
            <WatchListScansTable scans={kycDetails.watchListScans} />

            {/* Section 5: Compliance Summary */}
            <ComplianceSummaryCards summary={kycDetails.complianceSummary} />
          </div>

          {/* Right Column - Risk Summary Panel */}
          <div className="col-span-4">
            <div className="sticky top-8">
              <RiskSummaryPanel summary={kycDetails.riskSummary} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

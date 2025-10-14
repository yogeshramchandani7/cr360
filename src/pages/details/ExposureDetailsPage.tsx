import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getExposureDetails } from '../../lib/mockData';
import ExposureSummaryCard from '../../components/exposure-details/ExposureSummaryCard';
import ExposureTrendsChart from '../../components/exposure-details/ExposureTrendsChart';
import HierarchicalExposureTable from '../../components/exposure-details/HierarchicalExposureTable';
import ContractSummaryCard from '../../components/exposure-details/ContractSummaryCard';
import AccountDetailsTable from '../../components/exposure-details/AccountDetailsTable';

export default function ExposureDetailsPage() {
  const { companyId } = useParams<{ companyId: string }>();

  const exposureDetails = companyId ? getExposureDetails(companyId) : null;

  if (!exposureDetails) {
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
            Exposure Summary for {exposureDetails.companyName}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Customer - Member of</span>
            <span className="font-medium text-gray-900">{exposureDetails.companyName}</span>
            <span>Member - Group of Connected Counterparties</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1: Exposure Summary */}
          <ExposureSummaryCard summary={exposureDetails.exposureSummary} />

          {/* Section 2: Exposure Trends Chart */}
          <ExposureTrendsChart trends={exposureDetails.exposureTrends} />

          {/* Section 3: Hierarchical Exposure Breakdown */}
          <HierarchicalExposureTable hierarchy={exposureDetails.hierarchicalExposure} />

          {/* Section 4: Contract Level Summary */}
          <ContractSummaryCard summary={exposureDetails.contractSummary} />

          {/* Section 5: Account Level Details Table */}
          <AccountDetailsTable accounts={exposureDetails.accounts} />
        </div>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getProfitabilityDetails } from '../../lib/mockData';
import BankingProfileCard from '../../components/profitability/BankingProfileCard';
import ProfitabilityMetricsCard from '../../components/profitability/ProfitabilityMetricsCard';
import IncomeStatementTable from '../../components/profitability/IncomeStatementTable';

export default function ProfitabilityPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const profitabilityDetails = companyId ? getProfitabilityDetails(companyId) : null;

  if (!profitabilityDetails) {
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
            Profitability Summary for {profitabilityDetails.companyName}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Customer Code:</span>
            <span className="text-sm font-medium text-gray-900">
              {profitabilityDetails.customerCode}
            </span>
            {profitabilityDetails.hasGroupProfitability && (
              <button className="text-sm text-blue-600 hover:text-blue-800 underline font-medium">
                View Group Profitability
              </button>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Section 1: Customer Banking Profile */}
          <BankingProfileCard profile={profitabilityDetails.bankingProfile} />

          {/* Section 2: Customer Profitability Metrics */}
          <ProfitabilityMetricsCard metrics={profitabilityDetails.profitabilityMetrics} />

          {/* Section 3: Customer Income Statement */}
          <IncomeStatementTable
            incomeStatement={profitabilityDetails.incomeStatement}
            customerCode={profitabilityDetails.customerCode}
          />
        </div>
      </div>
    </div>
  );
}

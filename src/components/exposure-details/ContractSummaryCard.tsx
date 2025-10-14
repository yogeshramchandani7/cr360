import type { ExposureDetails } from '../../types';

interface ContractSummaryCardProps {
  summary: ExposureDetails['contractSummary'];
}

export default function ContractSummaryCard({ summary }: ContractSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Contract Level Summary</h3>
        <button className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
          Netting Set Level Summary
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Total Number of Accounts</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalAccounts}</p>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">No. of Accounts Open</p>
          <p className="text-2xl font-bold text-blue-600">{summary.accountsOpen}</p>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">No of Accounts with outstanding dues</p>
          <p className="text-2xl font-bold text-orange-600">{summary.accountsWithOutstandingDues}</p>
        </div>

        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">No of Accounts with overdues</p>
          <p className="text-2xl font-bold text-red-600">{summary.accountsWithOverdues}</p>
        </div>

        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">No of Accounts with asset class as delinquent</p>
          <p className="text-2xl font-bold text-yellow-700">{summary.accountsDelinquent}</p>
        </div>

        <div className="text-center p-4 bg-red-100 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">No of Accounts with asset class as Default</p>
          <p className="text-2xl font-bold text-red-700">{summary.accountsDefault}</p>
        </div>
      </div>
    </div>
  );
}

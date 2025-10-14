import type { ProfitabilityDetails } from '../../types';

interface BankingProfileCardProps {
  profile: ProfitabilityDetails['bankingProfile'];
}

export default function BankingProfileCard({ profile }: BankingProfileCardProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)} Cr`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Banking Profile</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Assets Total EOP Balance</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(profile.assetsTotalEOPBalance)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Average Tenor of Assets</p>
            <p className="text-lg font-semibold text-gray-900">{profile.averageTenorOfAssets}</p>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="space-y-3">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Liabilities Total EOP Balance</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(profile.liabilitiesTotalEOPBalance)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Average Tenor of Liabilities</p>
            <p className="text-lg font-semibold text-gray-900">
              {profile.averageTenorOfLiabilities}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

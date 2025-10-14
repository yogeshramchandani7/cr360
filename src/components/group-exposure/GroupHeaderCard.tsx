import type { GroupExposureDetails } from '../../types';

interface GroupHeaderCardProps {
  groupInfo: GroupExposureDetails['groupInfo'];
}

export default function GroupHeaderCard({ groupInfo }: GroupHeaderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        {/* Group Name */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{groupInfo.groupName}</h2>
          <p className="text-sm text-gray-600 mt-1">Group of Connected Counterparties</p>
        </div>

        {/* Parent Entity and Rating */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Parent Entity</p>
            <p className="text-lg font-semibold text-gray-900">{groupInfo.parentEntity}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Group Rating</p>
            <p className="text-lg font-semibold text-blue-600">{groupInfo.groupRating}</p>
          </div>
        </div>

        {/* Count Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-3xl font-bold text-blue-600">{groupInfo.numberOfFundedCompanies}</p>
            <p className="text-sm text-gray-600 mt-1">Funded Companies</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-3xl font-bold text-red-600">{groupInfo.numberOfCompaniesWithOverdues}</p>
            <p className="text-sm text-gray-600 mt-1">Companies with Overdues</p>
          </div>
        </div>
      </div>
    </div>
  );
}

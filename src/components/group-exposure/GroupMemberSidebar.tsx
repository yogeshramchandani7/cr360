import { useState } from 'react';
import { Search } from 'lucide-react';
import type { GroupExposureDetails } from '../../types';

interface GroupMemberSidebarProps {
  memberCompanies: GroupExposureDetails['memberCompanies'];
  selectedCompanyId: string;
  onCompanySelect: (companyId: string) => void;
}

export default function GroupMemberSidebar({
  memberCompanies,
  selectedCompanyId,
  onCompanySelect,
}: GroupMemberSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = memberCompanies.filter((company) =>
    company.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.entityId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>

      {/* Search Box */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Company List */}
      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {filteredCompanies.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No entities found</p>
        ) : (
          filteredCompanies.map((company) => (
            <button
              key={company.companyId}
              onClick={() => onCompanySelect(company.companyId)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCompanyId === company.companyId
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{company.entityName}</span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{company.entityId}</span>
                  {company.overdues > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                      Overdue
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-oracle-border">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Total Members:</span>
            <span className="font-medium text-gray-900">{memberCompanies.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Showing:</span>
            <span className="font-medium text-gray-900">{filteredCompanies.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

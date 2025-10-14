import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getGroupExposureDetails } from '../../lib/mockData';
import GroupHeaderCard from '../../components/group-exposure/GroupHeaderCard';
import ExposureSummaryCard from '../../components/exposure-details/ExposureSummaryCard';
import ExposureTrendsChart from '../../components/exposure-details/ExposureTrendsChart';
import GroupMemberCompaniesTable from '../../components/group-exposure/GroupMemberCompaniesTable';
import GroupMemberSidebar from '../../components/group-exposure/GroupMemberSidebar';

export default function GroupExposuresPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyId || '');

  const groupDetails = selectedCompanyId ? getGroupExposureDetails(selectedCompanyId) : null;

  if (!groupDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h2>
          <p className="text-gray-600">The requested group could not be found or this company is not part of a group.</p>
        </div>
      </div>
    );
  }

  const handleCompanySelect = (newCompanyId: string) => {
    setSelectedCompanyId(newCompanyId);
  };

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
            Group Exposure Summary for {groupDetails.groupInfo.groupName}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Customer - Member of</span>
            <span className="font-medium text-gray-900">{groupDetails.companyName}</span>
            <span>Member - Group of Connected Counterparties</span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - 3 columns */}
          <div className="col-span-3">
            <GroupMemberSidebar
              memberCompanies={groupDetails.memberCompanies}
              selectedCompanyId={selectedCompanyId}
              onCompanySelect={handleCompanySelect}
            />
          </div>

          {/* Main Content - 9 columns */}
          <div className="col-span-9 space-y-6">
            {/* Section 1: Group Header Info */}
            <GroupHeaderCard groupInfo={groupDetails.groupInfo} />

            {/* Section 2: Group Exposure Summary */}
            <ExposureSummaryCard summary={groupDetails.groupExposureSummary} />

            {/* Section 3: Group Exposure Trends */}
            <ExposureTrendsChart trends={groupDetails.groupExposureTrends} />

            {/* Section 4: Member Companies Table */}
            <GroupMemberCompaniesTable
              memberCompanies={groupDetails.memberCompanies}
              onCompanyClick={handleCompanySelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

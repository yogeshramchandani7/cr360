/**
 * CompanyTreeNode Component
 * Individual node card for company hierarchy tree visualization
 * Displays detailed company information in a compact card format
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { PortfolioCompany } from '../lib/mockData';

interface CompanyTreeNodeProps {
  data: PortfolioCompany;
}

function CompanyTreeNode({ data }: CompanyTreeNodeProps) {
  // Determine status color based on credit status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delinquent':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'Watchlist':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      default:
        return 'bg-green-100 border-green-500 text-green-900';
    }
  };

  // Format currency in Cr (Crores)
  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(2)} Cr`;
  };

  return (
    <div className="bg-white border-2 border-oracle-border rounded-lg shadow-md p-4 w-[300px] min-h-[320px]">
      {/* Input handle for parent connections */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-oracle-navy" />

      {/* Company Name */}
      <div className="mb-3 pb-2 border-b border-oracle-border">
        <h3 className="text-sm font-bold text-gray-900 truncate" title={data.customerName}>
          {data.customerName}
        </h3>
      </div>

      {/* Ratings Section */}
      <div className="space-y-1 mb-3 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">External Rating:</span>
          <span className="text-gray-900 font-semibold">{data.borrowerExternalRating}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Internal Rating:</span>
          <span className="text-gray-900 font-semibold">{data.borrowerInternalRating}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Basel Rating:</span>
          <span className="text-gray-900 font-semibold">{data.assetClass}</span>
        </div>
      </div>

      {/* Credit Score */}
      <div className="flex justify-between items-center mb-3 text-xs">
        <span className="text-gray-600 font-medium">Credit Score:</span>
        <span className="text-gray-900 font-bold text-sm">{data.borrowerCreditScore}</span>
      </div>

      {/* Risk Weight */}
      <div className="flex justify-between items-center mb-3 text-xs">
        <span className="text-gray-600 font-medium">Risk Weight:</span>
        <span className="text-gray-900 font-semibold">
          {data.riskGrade === 'Standard' ? '100%' : '150%'}
        </span>
      </div>

      {/* Industry */}
      <div className="flex justify-between items-center mb-3 text-xs">
        <span className="text-gray-600 font-medium">Industry:</span>
        <span className="text-gray-900 font-semibold truncate max-w-[150px]" title={data.industry}>
          {data.industry}
        </span>
      </div>

      {/* Credit Exposure */}
      <div className="flex justify-between items-center mb-3 text-xs">
        <span className="text-gray-600 font-medium">Credit Exposure:</span>
        <span className="text-oracle-navy font-bold">{formatCurrency(data.creditExposure)}</span>
      </div>

      {/* Credit Status Badge */}
      <div className="flex justify-between items-center mb-2 text-xs">
        <span className="text-gray-600 font-medium">Credit Status:</span>
        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(data.creditStatus)}`}>
          {data.creditStatus}
        </span>
      </div>

      {/* Org Structure */}
      <div className="pt-2 border-t border-oracle-border">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Org Structure:</span>
          <span className="text-gray-700 font-medium truncate max-w-[150px]" title={data.orgStructure}>
            {data.orgStructure}
          </span>
        </div>
      </div>

      {/* Output handle for child connections */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-oracle-navy" />
    </div>
  );
}

// Memo to prevent unnecessary re-renders
export default memo(CompanyTreeNode);

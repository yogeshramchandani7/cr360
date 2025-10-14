import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { GroupExposureDetails } from '../../types';

interface GroupMemberCompaniesTableProps {
  memberCompanies: GroupExposureDetails['memberCompanies'];
  onCompanyClick?: (companyId: string) => void;
}

type SortField = keyof GroupExposureDetails['memberCompanies'][0];
type SortDirection = 'asc' | 'desc';

export default function GroupMemberCompaniesTable({ memberCompanies, onCompanyClick }: GroupMemberCompaniesTableProps) {
  const [sortField, setSortField] = useState<SortField>('entityName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCompanies = [...memberCompanies].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  // Calculate totals
  const totals = memberCompanies.reduce(
    (acc, company) => ({
      creditLimit: acc.creditLimit + company.creditLimit,
      drawingCredit: acc.drawingCredit + company.drawingCredit,
      exposure: acc.exposure + company.exposure,
      undrawnExposure: acc.undrawnExposure + company.undrawnExposure,
      grossCreditExposure: acc.grossCreditExposure + company.grossCreditExposure,
      overdues: acc.overdues + company.overdues,
      ecl: acc.ecl + company.ecl,
      securityValue: acc.securityValue + company.securityValue,
      rwa: acc.rwa + company.rwa,
    }),
    {
      creditLimit: 0,
      drawingCredit: 0,
      exposure: 0,
      undrawnExposure: 0,
      grossCreditExposure: 0,
      overdues: 0,
      ecl: 0,
      securityValue: 0,
      rwa: 0,
    }
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Companies Details</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('entityName')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 sticky left-0 bg-gray-50 z-10"
                >
                  <div className="flex items-center gap-1">
                    Entity Name
                    <SortIcon field="entityName" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('entityId')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Entity ID
                    <SortIcon field="entityId" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('industry')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Industry
                    <SortIcon field="industry" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('internalRating')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Internal Rating
                    <SortIcon field="internalRating" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('externalRating')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    External Rating
                    <SortIcon field="externalRating" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('baselRating')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Basel Rating
                    <SortIcon field="baselRating" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('creditLimit')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Credit Limit
                    <SortIcon field="creditLimit" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('drawingCredit')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Drawing Credit
                    <SortIcon field="drawingCredit" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('exposure')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Exposure
                    <SortIcon field="exposure" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('undrawnExposure')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Undrawn Exposure
                    <SortIcon field="undrawnExposure" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('grossCreditExposure')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Gross Credit Exposure
                    <SortIcon field="grossCreditExposure" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('overdues')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Overdues
                    <SortIcon field="overdues" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dpd')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    DPD
                    <SortIcon field="dpd" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('creditStatus')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Credit Status
                    <SortIcon field="creditStatus" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('assetClassification')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Asset Classification
                    <SortIcon field="assetClassification" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('ecl')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    ECL
                    <SortIcon field="ecl" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('securityValue')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Security Value
                    <SortIcon field="securityValue" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('riskWeight')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Risk Weight
                    <SortIcon field="riskWeight" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('rwa')}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    RWA
                    <SortIcon field="rwa" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCompanies.map((company, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td
                    className="px-3 py-3 text-sm text-blue-600 font-medium sticky left-0 bg-white cursor-pointer hover:underline"
                    onClick={() => onCompanyClick?.(company.companyId)}
                  >
                    {company.entityName}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">{company.entityId}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{company.industry}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {company.internalRating}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {company.externalRating}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {company.baselRating}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(company.creditLimit)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(company.drawingCredit)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 font-medium">{formatCurrency(company.exposure)}</td>
                  <td className="px-3 py-3 text-sm text-green-600">{formatCurrency(company.undrawnExposure)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(company.grossCreditExposure)}</td>
                  <td className={`px-3 py-3 text-sm font-medium ${company.overdues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(company.overdues)}
                  </td>
                  <td className={`px-3 py-3 text-sm font-medium ${
                    company.dpd > 90 ? 'text-red-600' :
                    company.dpd > 30 ? 'text-orange-600' :
                    company.dpd > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {company.dpd}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      company.creditStatus === 'Standard'
                        ? 'bg-green-100 text-green-800'
                        : company.creditStatus === 'Watchlist'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {company.creditStatus}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      company.assetClassification === 'Standard'
                        ? 'bg-green-100 text-green-800'
                        : company.assetClassification === 'Special Mention'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {company.assetClassification}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(company.ecl)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    {company.securityValue > 0 ? formatCurrency(company.securityValue) : 'N/A'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">{formatPercentage(company.riskWeight)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(company.rwa)}</td>
                </tr>
              ))}

              {/* Totals Row */}
              <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                <td className="px-3 py-3 text-sm text-gray-900 sticky left-0 bg-blue-50">TOTAL</td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(totals.creditLimit)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(totals.drawingCredit)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(totals.exposure)}</td>
                <td className="px-3 py-3 text-sm text-green-600">{formatCurrency(totals.undrawnExposure)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(totals.grossCreditExposure)}</td>
                <td className={`px-3 py-3 text-sm ${totals.overdues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(totals.overdues)}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(totals.ecl)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(totals.securityValue)}</td>
                <td className="px-3 py-3 text-sm text-gray-500">-</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(totals.rwa)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

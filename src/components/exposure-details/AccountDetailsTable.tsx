import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { ExposureDetails } from '../../types';

interface AccountDetailsTableProps {
  accounts: ExposureDetails['accounts'];
}

type SortField = keyof ExposureDetails['accounts'][0];
type SortDirection = 'asc' | 'desc';

export default function AccountDetailsTable({ accounts }: AccountDetailsTableProps) {
  const [sortField, setSortField] = useState<SortField>('accountId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Level Details</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-oracle-bgAlt">
            <tr>
              <th
                onClick={() => handleSort('accountId')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 sticky left-0 bg-gray-50 z-10"
              >
                <div className="flex items-center gap-1">
                  Account ID
                  <SortIcon field="accountId" />
                </div>
              </th>
              <th
                onClick={() => handleSort('product')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Product
                  <SortIcon field="product" />
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
                onClick={() => handleSort('drawingLimit')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Drawing Limit
                  <SortIcon field="drawingLimit" />
                </div>
              </th>
              <th
                onClick={() => handleSort('outstandingBalance')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Outstanding Balance
                  <SortIcon field="outstandingBalance" />
                </div>
              </th>
              <th
                onClick={() => handleSort('availableLimit')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Available Limit
                  <SortIcon field="availableLimit" />
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
                onClick={() => handleSort('openedDate')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Opened Date
                  <SortIcon field="openedDate" />
                </div>
              </th>
              <th
                onClick={() => handleSort('tenor')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Tenor
                  <SortIcon field="tenor" />
                </div>
              </th>
              <th
                onClick={() => handleSort('maturityDate')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Maturity Date
                  <SortIcon field="maturityDate" />
                </div>
              </th>
              <th
                onClick={() => handleSort('paymentFrequency')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Payment Frequency
                  <SortIcon field="paymentFrequency" />
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
                onClick={() => handleSort('emi')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  EMI
                  <SortIcon field="emi" />
                </div>
              </th>
              <th
                onClick={() => handleSort('roi')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  ROI
                  <SortIcon field="roi" />
                </div>
              </th>
              <th
                onClick={() => handleSort('lastPaymentDueDate')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Last Payment Due Date
                  <SortIcon field="lastPaymentDueDate" />
                </div>
              </th>
              <th
                onClick={() => handleSort('daysPastDue')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Days Past Due
                  <SortIcon field="daysPastDue" />
                </div>
              </th>
              <th
                onClick={() => handleSort('accountStatus')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Account Status
                  <SortIcon field="accountStatus" />
                </div>
              </th>
              <th
                onClick={() => handleSort('classification')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Classification
                  <SortIcon field="classification" />
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
                onClick={() => handleSort('ltv')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  LTV
                  <SortIcon field="ltv" />
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
                onClick={() => handleSort('instrumentRating')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Instrument Rating
                  <SortIcon field="instrumentRating" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAccounts.map((account, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-3 py-3 text-sm text-gray-900 font-medium sticky left-0 bg-white">
                  {account.accountId}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{account.product}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(account.creditLimit)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(account.drawingLimit)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(account.outstandingBalance)}</td>
                <td className="px-3 py-3 text-sm text-green-600 font-medium">{formatCurrency(account.availableLimit)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(account.grossCreditExposure)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">
                  {new Date(account.openedDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{account.tenor}</td>
                <td className="px-3 py-3 text-sm text-gray-900">
                  {new Date(account.maturityDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{account.paymentFrequency}</td>
                <td className={`px-3 py-3 text-sm font-medium ${account.overdues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(account.overdues)}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(account.emi)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatPercentage(account.roi)}</td>
                <td className="px-3 py-3 text-sm text-gray-900">
                  {new Date(account.lastPaymentDueDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className={`px-3 py-3 text-sm font-medium ${
                  account.daysPastDue > 90 ? 'text-red-600' :
                  account.daysPastDue > 30 ? 'text-orange-600' :
                  account.daysPastDue > 0 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {account.daysPastDue}
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    account.accountStatus === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : account.accountStatus === 'Suspended'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.accountStatus}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    account.classification === 'Standard'
                      ? 'bg-green-100 text-green-800'
                      : account.classification === 'Watch list'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {account.classification}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">
                  {account.securityValue > 0 ? formatCurrency(account.securityValue) : 'N/A'}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">
                  {account.ltv > 0 ? formatPercentage(account.ltv) : 'N/A'}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">{formatCurrency(account.ecl)}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {account.instrumentRating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

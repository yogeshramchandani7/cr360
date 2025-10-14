import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { mockPortfolioCompanies, type PortfolioCompany } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';
import { useFilterStore } from '../stores/filterStore';
import { applyGlobalFilters } from '../lib/filterUtils';

type SortField = keyof PortfolioCompany;
type SortDirection = 'asc' | 'desc';

interface FilterChip {
  id: string;
  label: string;
  field: keyof PortfolioCompany;
  value: string;
}

export default function PortfolioView() {
  const navigate = useNavigate();
  const drillDownFilter = useFilterStore((state) => state.drillDownFilter);
  const clearDrillDownFilter = useFilterStore((state) => state.clearDrillDownFilter);

  // Read global filters from store - use individual selectors to prevent infinite loop
  const lob = useFilterStore((state) => state.lob);
  const partyType = useFilterStore((state) => state.partyType);
  const rating = useFilterStore((state) => state.rating);
  const assetClassification = useFilterStore((state) => state.assetClassification);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterChips, setFilterChips] = useState<FilterChip[]>([]);
  const [sortField, setSortField] = useState<SortField>('customerName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter and sort data - chain filters: global → drill-down → search → chips → sort
  const filteredData = useMemo(() => {
    // STEP 1: Apply global filters FIRST (broadest filter)
    const globalFilters = { lob, partyType, rating, assetClassification };
    let data = applyGlobalFilters(mockPortfolioCompanies, globalFilters);

    // STEP 2: Apply drill-down filter
    if (drillDownFilter) {
      data = data.filter((company) => {
        const value = company[drillDownFilter.field as keyof PortfolioCompany];
        return value?.toString().toLowerCase() === drillDownFilter.value.toLowerCase();
      });
    }

    // STEP 3: Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter((company) =>
        company.customerName.toLowerCase().includes(query) ||
        company.custId.toString().includes(query) ||
        company.group.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query)
      );
    }

    // STEP 4: Apply filter chips
    filterChips.forEach((chip) => {
      data = data.filter((company) => {
        const value = company[chip.field];
        return value?.toString().toLowerCase() === chip.value.toLowerCase();
      });
    });

    // STEP 5: Apply sorting (visual only)
    data.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return data;
  }, [lob, partyType, rating, assetClassification, drillDownFilter, searchQuery, filterChips, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // const addFilterChip = (field: keyof PortfolioCompany, value: string, label: string) => {
  //   const chipId = `${field}-${value}`;
  //   if (!filterChips.find((chip) => chip.id === chipId)) {
  //     setFilterChips([...filterChips, { id: chipId, label, field, value }]);
  //   }
  // };

  const removeFilterChip = (chipId: string) => {
    setFilterChips(filterChips.filter((chip) => chip.id !== chipId));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="inline w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Portfolio View</h2>
        <p className="text-sm text-gray-600 mt-1">
          Complete view of all portfolio companies
        </p>
      </div>

      {/* Drill-Down Filter Banner */}
      {drillDownFilter && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Drill-Down Filter Active
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Showing companies for: <span className="font-medium">{drillDownFilter.label}</span>
                {drillDownFilter.source && (
                  <span className="text-xs text-blue-600 ml-2">
                    (from {drillDownFilter.source})
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={clearDrillDownFilter}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by typing here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Chips */}
        {filterChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filterChips.map((chip) => (
              <div
                key={chip.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
              >
                <span>{chip.label}</span>
                <button
                  onClick={() => removeFilterChip(chip.id)}
                  className="hover:bg-blue-100 rounded-full p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> of{' '}
        <span className="font-semibold text-gray-900">{mockPortfolioCompanies.length}</span> companies
        {(hasActiveFilters() || drillDownFilter || searchQuery || filterChips.length > 0) && (
          <span className="text-blue-600 ml-2">(filtered)</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customerName')}
                >
                  Customer Name <SortIcon field="customerName" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('custId')}
                >
                  Cust ID <SortIcon field="custId" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('partyType')}
                >
                  Party Type <SortIcon field="partyType" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('group')}
                >
                  Group <SortIcon field="group" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('orgStructure')}
                >
                  Org Structure <SortIcon field="orgStructure" />
                </th>
                <th
                  className="text-center p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lineOfBusiness')}
                >
                  Line of Business <SortIcon field="lineOfBusiness" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('industry')}
                >
                  Industry <SortIcon field="industry" />
                </th>
                <th
                  className="text-right p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('creditLimit')}
                >
                  Credit Limit <SortIcon field="creditLimit" />
                </th>
                <th
                  className="text-right p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('grossCreditExposure')}
                >
                  Gross Credit Exposure <SortIcon field="grossCreditExposure" />
                </th>
                <th
                  className="text-right p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('creditExposure')}
                >
                  Credit Exposure <SortIcon field="creditExposure" />
                </th>
                <th
                  className="text-right p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('undrawnExposure')}
                >
                  Undrawn Exposure <SortIcon field="undrawnExposure" />
                </th>
                <th
                  className="text-center p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('overdues')}
                >
                  Overdues <SortIcon field="overdues" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('creditStatus')}
                >
                  Credit Status <SortIcon field="creditStatus" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('assetClass')}
                >
                  Asset Class <SortIcon field="assetClass" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('borrowerExternalRating')}
                >
                  Borrower External Rating <SortIcon field="borrowerExternalRating" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('borrowerInternalRating')}
                >
                  Borrower Internal Rating <SortIcon field="borrowerInternalRating" />
                </th>
                <th
                  className="text-right p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('borrowerCreditScore')}
                >
                  Borrower Credit Score <SortIcon field="borrowerCreditScore" />
                </th>
                <th
                  className="text-center p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('stageClassification')}
                >
                  Stage Classification <SortIcon field="stageClassification" />
                </th>
                <th
                  className="text-left p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('securityStatus')}
                >
                  Security Status <SortIcon field="securityStatus" />
                </th>
                <th
                  className="text-right p-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('securityValue')}
                >
                  Security Value <SortIcon field="securityValue" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                      onClick={() => navigate(`/company/${company.id}`)}
                    >
                      {company.customerName}
                    </button>
                  </td>
                  <td className="p-3 text-gray-900">{company.custId}</td>
                  <td className="p-3 text-gray-900">{company.partyType}</td>
                  <td className="p-3 text-gray-900">{company.group}</td>
                  <td className="p-3 text-gray-900">{company.orgStructure}</td>
                  <td className="p-3 text-center text-gray-900">{company.lineOfBusiness}</td>
                  <td className="p-3 text-gray-900">{company.industry}</td>
                  <td className="p-3 text-right text-gray-900">
                    {formatCurrency(company.creditLimit * 1000000)}
                  </td>
                  <td className="p-3 text-right text-gray-900">
                    {formatCurrency(company.grossCreditExposure * 1000000)}
                  </td>
                  <td className="p-3 text-right text-gray-900">
                    {formatCurrency(company.creditExposure * 1000000)}
                  </td>
                  <td className="p-3 text-right text-gray-900">
                    {formatCurrency(company.undrawnExposure * 1000000)}
                  </td>
                  <td className="p-3 text-center text-gray-900">{company.overdues}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        company.creditStatus === 'Delinquent'
                          ? 'bg-red-100 text-red-800'
                          : company.creditStatus === 'Watchlist'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {company.creditStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        company.assetClass === 'Delinquent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {company.assetClass}
                    </span>
                  </td>
                  <td className="p-3 text-gray-900">{company.borrowerExternalRating}</td>
                  <td className="p-3 text-gray-900">{company.borrowerInternalRating}</td>
                  <td className="p-3 text-right text-gray-900">
                    {company.borrowerCreditScore}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        company.stageClassification === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {company.stageClassification}
                    </span>
                  </td>
                  <td className="p-3 text-gray-900">{company.securityStatus}</td>
                  <td className="p-3 text-right text-gray-900">
                    {formatCurrency(company.securityValue * 1000000)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

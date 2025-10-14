import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ExposureDetails } from '../../types';

interface HierarchicalExposureTableProps {
  hierarchy: ExposureDetails['hierarchicalExposure'];
}

export default function HierarchicalExposureTable({ hierarchy }: HierarchicalExposureTableProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['banking-book']));

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const formatCurrency = (value: number) => `₹${value.toFixed(2)} Cr`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exposure Detailed Summary</h3>

      <div className="space-y-2">
        {/* Banking Book */}
        <div>
          <button
            onClick={() => toggleSection('banking-book')}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            {expandedSections.has('banking-book') ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
            <span className="font-semibold text-gray-900">TOTAL Banking Book</span>
          </button>

          {expandedSections.has('banking-book') && (
            <div className="ml-6 mt-2 space-y-2">
              {/* Loan Exposure */}
              <button
                onClick={() => toggleSection('loan-exposure')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors text-left"
              >
                {expandedSections.has('loan-exposure') ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
                <span className="font-medium text-gray-800">Loan Exposure</span>
              </button>

              {expandedSections.has('loan-exposure') && (
                <div className="ml-6 space-y-1">
                  {/* Fund Based */}
                  <div className="px-4 py-2 bg-white border border-oracle-border rounded">
                    <div className="font-medium text-sm text-gray-700 mb-2">FB (Fund Based)</div>
                    <div className="ml-4 space-y-1">
                      {hierarchy.bankingBook.loanExposure.fundBased.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm py-1">
                          <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                            {item.product}
                          </span>
                          <span className="text-gray-900 font-medium">{formatCurrency(item.exposure)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Non Fund Based */}
                  <div className="px-4 py-2 bg-white border border-oracle-border rounded">
                    <div className="font-medium text-sm text-gray-700 mb-2">NFB (Non Fund Based)</div>
                    <div className="ml-4 space-y-1">
                      {hierarchy.bankingBook.loanExposure.nonFundBased.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-700">{item.product}</span>
                          <span className="text-gray-900 font-medium">{formatCurrency(item.exposure)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Investment Exposure */}
              <button
                onClick={() => toggleSection('investment-exposure')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors text-left"
              >
                {expandedSections.has('investment-exposure') ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
                <span className="font-medium text-gray-800">Investment Exposure</span>
              </button>

              {expandedSections.has('investment-exposure') && (
                <div className="ml-6 space-y-1">
                  <div className="px-4 py-2 bg-white border border-oracle-border rounded flex justify-between">
                    <span className="text-sm text-gray-700">FB</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(hierarchy.bankingBook.investmentExposure.fundBased)}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-white border border-oracle-border rounded flex justify-between">
                    <span className="text-sm text-gray-700">NFB</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(hierarchy.bankingBook.investmentExposure.nonFundBased)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trading Book */}
        <div>
          <button
            onClick={() => toggleSection('trading-book')}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            {expandedSections.has('trading-book') ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
            <span className="font-semibold text-gray-900">Trading Book</span>
          </button>

          {expandedSections.has('trading-book') && (
            <div className="ml-6 mt-2 space-y-2">
              <button
                onClick={() => toggleSection('trading-investment')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors text-left"
              >
                {expandedSections.has('trading-investment') ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
                <span className="font-medium text-gray-800">Investment Exposure</span>
              </button>

              {expandedSections.has('trading-investment') && (
                <div className="ml-6 space-y-1">
                  <div className="px-4 py-2 bg-white border border-oracle-border rounded flex justify-between">
                    <span className="text-sm text-gray-700">FB</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(hierarchy.tradingBook.investmentExposure.fundBased)}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-white border border-oracle-border rounded flex justify-between">
                    <span className="text-sm text-gray-700">NFB</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(hierarchy.tradingBook.investmentExposure.nonFundBased)}
                    </span>
                  </div>
                </div>
              )}

              <div className="px-4 py-2 bg-white border border-oracle-border rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-gray-800">Derivatives Exposure</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(hierarchy.tradingBook.derivativesExposure.value)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 pt-4 border-t border-oracle-border">
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
            Product Filters
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Book Classification
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Exposure Classification
          </button>
        </div>
      </div>
    </div>
  );
}

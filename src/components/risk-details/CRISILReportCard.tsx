import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { RiskDetails } from '../../types';

interface CRISILReportCardProps {
  reports: RiskDetails['ratingReports'];
}

export default function CRISILReportCard({ reports }: CRISILReportCardProps) {
  const [expandedReports, setExpandedReports] = useState<Set<number>>(new Set([0]));

  const toggleReport = (index: number) => {
    setExpandedReports((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Credit Rating & Scoring Reports
      </h3>

      <div className="space-y-4">
        {reports.map((report, index) => (
          <div key={index} className="border border-oracle-border rounded-lg overflow-hidden">
            {/* Report Header */}
            <button
              onClick={() => toggleReport(index)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{report.provider}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(report.reportDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {report.rating}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.outlook === 'Positive'
                      ? 'bg-green-100 text-green-800'
                      : report.outlook === 'Negative'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {report.outlook}
                </span>
              </div>
              {expandedReports.has(index) ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Expandable Content */}
            {expandedReports.has(index) && (
              <div className="px-4 py-4 space-y-4">
                {/* Rationale */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Rationale</h4>
                  <p className="text-sm text-gray-600">{report.rationale}</p>
                </div>

                {/* Key Drivers */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Drivers</h4>
                  <ul className="space-y-1">
                    {report.keyDrivers.map((driver, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Commentary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Detailed Commentary
                  </h4>
                  <p className="text-sm text-gray-600">{report.detailedCommentary}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

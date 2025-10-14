import type { KYCComplianceDetails } from '../../types';

interface AdverseMediaScansCardProps {
  scans: KYCComplianceDetails['adverseMediaScans'];
}

export default function AdverseMediaScansCard({ scans }: AdverseMediaScansCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Adverse Media Scans</h3>

      <div className="space-y-4">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Common Name</p>
            <p className="font-medium text-gray-900">{scans.commonName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Search Date</p>
            <p className="font-medium text-gray-900">
              {new Date(scans.searchDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Risk Factors */}
        {scans.detected && scans.riskFactors.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">RISK FACTORS</p>
            <div className="space-y-2">
              {scans.riskFactors.map((risk, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      risk.confidence === 'Strong'
                        ? 'bg-pink-100 text-pink-800'
                        : risk.confidence === 'Moderate'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {risk.factor}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      risk.confidence === 'Strong'
                        ? 'text-pink-700'
                        : risk.confidence === 'Moderate'
                        ? 'text-orange-700'
                        : 'text-yellow-700'
                    }`}
                  >
                    {risk.confidence}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Sources */}
        {scans.dataSources.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              DATA SOURCES (ANY CONFIDENCE LEVEL)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {scans.dataSources.map((source, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">{source.source}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Confidence: {source.confidenceLevel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Risk Found */}
        {!scans.detected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium">No Adverse Media Detected</p>
            <p className="text-sm text-green-600 mt-1">
              No risk factors found in available data sources
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import type { ProfitabilityDetails } from '../../types';

interface IncomeStatementTableProps {
  incomeStatement: ProfitabilityDetails['incomeStatement'];
  customerCode: string;
}

export default function IncomeStatementTable({
  incomeStatement,
  customerCode,
}: IncomeStatementTableProps) {
  const formatCurrency = (value: number) => `₹${Math.abs(value).toFixed(2)}`;

  // Calculate indentation based on level
  const getIndentation = (level: number) => {
    return `${level * 1.5}rem`; // 1.5rem = 24px per level
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Income Statement</h3>

      <div className="mb-4 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">As of Date</p>
            <p className="font-medium text-gray-900">
              {new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Customer Code</p>
            <p className="font-medium text-gray-900">{customerCode}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Line Item Identifier
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Line Item Leaf Name
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incomeStatement.map((item, idx) => (
              <tr
                key={idx}
                className={`hover:bg-gray-50 ${
                  item.level === 0
                    ? 'bg-blue-50 font-bold'
                    : item.level === 1
                    ? 'bg-gray-50 font-semibold'
                    : ''
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{item.lineItemIdentifier}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    style={{ paddingLeft: getIndentation(item.level) }}
                    className={`inline-block ${
                      item.level === 0
                        ? 'font-bold text-gray-900'
                        : item.level === 1
                        ? 'font-semibold text-gray-800'
                        : item.level === 2
                        ? 'font-medium text-gray-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.lineItemLeafName}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-sm text-right ${
                    item.level === 0
                      ? 'font-bold text-gray-900'
                      : item.level === 1
                      ? 'font-semibold text-gray-900'
                      : 'text-gray-900'
                  }`}
                >
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

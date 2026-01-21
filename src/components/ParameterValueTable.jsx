import React from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Clean, elegant component for displaying parameter-value pairs
 * Perfect for configuration summaries, details, and simple data displays
 */
export function ParameterValueTable({ tableContent, onCellClick }) {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  if (!tableContent || !tableContent.headers || !tableContent.body) {
    return null;
  }

  const headers = tableContent.headers;
  const rows = tableContent.body;

  // Check if this is a simple parameter-value table (2 columns)
  const isParameterValueTable = headers.length === 2 && 
    (headers[0]?.toLowerCase().includes('parameter') || 
     headers[0]?.toLowerCase().includes('key') ||
     headers[0]?.toLowerCase().includes('field'));

  const handleCopy = (value, index) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Render as elegant parameter-value cards
  if (isParameterValueTable) {
    return (
      <div className="space-y-3">
        {rows.map((row, rowIndex) => {
          const parameter = row[0] || '';
          const value = row[1] || '';
          const isIdValue = parameter.toLowerCase().includes('id') || 
                           parameter.toLowerCase().includes('scenario') ||
                           parameter.toLowerCase().includes('panel');
          const isClickable = isIdValue && onCellClick && value;

          return (
            <div
              key={rowIndex}
              className="group relative flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            >
              {/* Parameter Label */}
              <div className="flex-shrink-0 w-40">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  {parameter.replace(/\*\*/g, '')}
                </div>
              </div>

              {/* Value */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium text-slate-900 break-words ${
                    isClickable
                      ? 'cursor-pointer text-blue-600 hover:text-blue-700 hover:underline'
                      : ''
                  }`}
                  onClick={() => {
                    if (isClickable) {
                      onCellClick(value, parameter);
                    }
                  }}
                >
                  {value.replace(/\*\*/g, '')}
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(value, rowIndex)}
                className="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Copy value"
              >
                {copiedIndex === rowIndex ? (
                  <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback to standard table for complex tables
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-200">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide bg-slate-50"
              >
                {header.replace(/\*\*/g, '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              {row.map((cell, cellIndex) => {
                const headerText = headers[cellIndex];
                const isIdColumn = cellIndex === 0 || 
                                 (headerText && headerText.toLowerCase().includes('id'));
                const isClickable = isIdColumn && onCellClick && cell;

                return (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 text-sm text-slate-700 ${
                      isClickable
                        ? 'cursor-pointer text-blue-600 hover:text-blue-700 hover:underline font-medium'
                        : ''
                    }`}
                    onClick={() => {
                      if (isClickable) {
                        onCellClick(cell, headerText);
                      }
                    }}
                  >
                    {cell.replace(/\*\*/g, '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

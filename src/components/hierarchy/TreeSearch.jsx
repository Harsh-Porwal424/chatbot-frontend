import React from 'react';
import { Search, X, Filter, Maximize2 } from 'lucide-react';

/**
 * TreeSearch Component
 * Enterprise-level search input with mode toggle and result counter
 */
export const TreeSearch = ({
  searchTerm,
  onSearchChange,
  searchMode,
  onToggleMode,
  matchCount,
  onClear,
  placeholder = "Search..."
}) => {
  const isSearchActive = searchTerm && searchTerm.trim().length > 0;

  return (
    <div className="space-y-2">
      {/* Search Input Row */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          {isSearchActive && (
            <button
              onClick={onClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded transition-colors"
              title="Clear search"
            >
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Mode Toggle Button */}
        <button
          onClick={onToggleMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            searchMode === 'filter'
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
          title={searchMode === 'filter' ? 'Filter mode: Show only matches' : 'Expand mode: Show all, expand to matches'}
        >
          {searchMode === 'filter' ? (
            <>
              <Filter size={14} />
              <span>Filter</span>
            </>
          ) : (
            <>
              <Maximize2 size={14} />
              <span>Expand</span>
            </>
          )}
        </button>
      </div>

      {/* Result Counter */}
      {isSearchActive && (
        <div className="flex items-center justify-between px-1">
          <div className="text-xs text-gray-500">
            {matchCount > 0 ? (
              <span>
                <span className="font-semibold text-gray-700">{matchCount}</span> {matchCount === 1 ? 'match' : 'matches'} found
              </span>
            ) : (
              <span className="text-amber-600 font-medium">No matches found</span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {searchMode === 'filter' ? 'Showing matches only' : 'Expanded to matches'}
          </div>
        </div>
      )}

      {/* Mode Description (when not searching) */}
      {!isSearchActive && (
        <div className="text-xs text-gray-400 px-1">
          {searchMode === 'filter'
            ? 'Filter mode: Will show only matching nodes'
            : 'Expand mode: Will expand tree to reveal matches'}
        </div>
      )}
    </div>
  );
};

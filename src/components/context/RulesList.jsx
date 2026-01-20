import React, { useState, useRef } from "react";
import {
  Search,
  Plus,
  ChevronRight,
  FileCheck,
  Check,
  ChevronUp,
} from "lucide-react";

export const RulesList = ({
  selectedPanel,
  selectedRules,
  onToggleRule,
  onCreateNew,
  allRules,
  totalRules,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollContainerRef = useRef(null);

  // Client-side filtering since API doesn't support search yet
  const filtered = allRules.filter(
    (r) =>
      r.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      r.ruleType
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Convert Set to single selection (get first item or null)
  const selectedRule = selectedRules.size > 0 ? Array.from(selectedRules)[0] : null;

  // Find selected rule data
  const selectedRuleData = filtered.find(r => r.id === selectedRule);

  // Filter out selected rule from the list and sort by rank
  const unselectedRules = filtered
    .filter(r => r.id !== selectedRule)
    .sort((a, b) => a.rank - b.rank);

  const handleScroll = (e) => {
    setShowBackToTop(e.target.scrollTop > 100);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getRuleTypeStyle = (type) => {
    switch (type) {
      case "Price":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-200",
        };
      case "CPI":
        return {
          bg: "bg-purple-50",
          text: "text-purple-600",
          border: "border-purple-200",
        };
      case "Parity":
        return {
          bg: "bg-green-50",
          text: "text-green-600",
          border: "border-green-200",
        };
      case "Margin":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          border: "border-amber-200",
        };
      case "Markup":
        return {
          bg: "bg-orange-50",
          text: "text-orange-600",
          border: "border-orange-200",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
        };
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto"
      >
        {/* Selected Rule - Sticky at top */}
        {selectedRuleData && (
          <div className="sticky top-0 bg-white z-10">
            <div className="px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                Selected Rule
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRule(selectedRule);
                }}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold"
              >
                Clear
              </button>
            </div>
            <div className="mx-4 mb-3 rounded-lg border-2 border-indigo-400 bg-indigo-50/30 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
                    <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-indigo-600 text-white rounded font-bold">
                      #{selectedRuleData.rank}
                    </span>
                    {(() => {
                      const typeStyle = getRuleTypeStyle(selectedRuleData.ruleType);
                      return (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                          {selectedRuleData.ruleType}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {selectedRuleData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create New Option */}
        <div className="mx-4 mb-3">
          <div
            onClick={onCreateNew}
            className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Plus
                size={18}
                className="text-indigo-500 group-hover:text-indigo-600"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Create New Rule
              </p>
              <p className="text-xs text-gray-500">
                Describe your rule in chat
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-gray-300 group-hover:text-indigo-400 transition-colors"
            />
          </div>
        </div>

        {/* Available Rules List */}
        {unselectedRules.length === 0 && allRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <FileCheck
              size={32}
              className="text-gray-300 mb-2"
            />
            <p className="text-sm text-gray-500">
              No rules found
            </p>
            <p className="text-xs text-gray-400">
              Create a new rule to get started
            </p>
          </div>
        ) : unselectedRules.length === 0 && !selectedRuleData ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Search size={32} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              No matching rules
            </p>
            <p className="text-xs text-gray-400">
              Try a different search term
            </p>
          </div>
        ) : (
          <>
            {unselectedRules.length > 0 && (
              <div className="px-4 py-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Available Rules
                </p>
              </div>
            )}
            {unselectedRules.map((rule) => {
              const typeStyle = getRuleTypeStyle(rule.ruleType);
              return (
                <div
                  key={rule.id}
                  onClick={() => onToggleRule(rule.id)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-400 transition-colors">
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-bold">
                        #{rule.rank}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                        {rule.ruleType}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {rule.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer with count */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {searchTerm ? `${filtered.length} rule${filtered.length !== 1 ? "s" : ""}` : `${totalRules} rule${totalRules !== 1 ? "s" : ""}`}
          {selectedRule && (
            <span className="text-indigo-600 ml-1">
              • 1 selected
            </span>
          )}
        </span>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-12 right-3 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all z-20"
          title="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  );
};

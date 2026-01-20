import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Search,
  ChevronUp,
  Plus,
  ChevronRight,
  Loader2,
  PlayCircle,
} from "lucide-react";

export const ScenariosList = ({
  selectedScenario,
  onSelect,
  onCreateNew,
  allScenarios,
  totalScenarios,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  // Use allScenarios when no search, otherwise fetch search results
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults(allScenarios);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/pricing-rules/scenario?search=${encodeURIComponent(searchTerm)}`);
        const transformedScenarios = response.data.items.map(item => ({
          id: item.scenario_id,
          name: item.name,
          description: item.description || 'No description available'
        }));
        setSearchResults(transformedScenarios);
      } catch (error) {
        console.error('Error searching scenarios:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, allScenarios]);

  // Find selected scenario
  const selectedScenarioData = searchResults.find(s => s.id === selectedScenario);

  // Filter out selected scenario from the list and sort alphabetically
  const unselectedScenarios = searchResults
    .filter(s => s.id !== selectedScenario)
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleScroll = (e) => {
    setShowBackToTop(e.target.scrollTop > 100);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto"
      >
        {/* Selected Scenario - Sticky at top */}
        {selectedScenarioData && (
          <div className="sticky top-0 bg-white z-10">
            <div className="px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                Selected Scenario
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                }}
                className="text-xs text-orange-500 hover:text-orange-700 font-semibold"
              >
                Clear
              </button>
            </div>
            <div className="mx-4 mb-3 rounded-lg border-2 border-orange-400 bg-orange-50/30 overflow-hidden">
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
                    <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {selectedScenarioData.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {selectedScenarioData.description}
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
            className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Plus
                size={18}
                className="text-orange-500 group-hover:text-orange-600"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                Create New Scenario
              </p>
              <p className="text-xs text-gray-500">
                Describe your scenario in chat
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-gray-300 group-hover:text-orange-400 transition-colors"
            />
          </div>
        </div>

        {/* Available Scenarios List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Loader2 size={32} className="text-gray-400 mb-2 animate-spin" />
            <p className="text-sm text-gray-500">Loading scenarios...</p>
          </div>
        ) : unselectedScenarios.length === 0 && !selectedScenarioData ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <PlayCircle
              size={32}
              className="text-gray-300 mb-2"
            />
            <p className="text-sm text-gray-500">
              No scenarios found
            </p>
            <p className="text-xs text-gray-400">
              Try a different search term
            </p>
          </div>
        ) : (
          <>
            {unselectedScenarios.length > 0 && (
              <div className="px-4 py-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Available Scenarios
                </p>
              </div>
            )}
            {unselectedScenarios.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => onSelect(scenario.id)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-orange-400 transition-colors">
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                    {scenario.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {scenario.description}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer with count */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {totalScenarios} scenario
          {totalScenarios !== 1 ? "s" : ""}
          {selectedScenario && (
            <span className="text-orange-600 ml-1">
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

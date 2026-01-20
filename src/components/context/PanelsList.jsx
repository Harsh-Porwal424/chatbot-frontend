import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  ChevronRight,
  ChevronUp,
  LayoutGrid,
} from "lucide-react";

// Panels List Component
export const PanelsList = ({
  selectedScenario,
  selectedPanel,
  onSelect,
  onCreateNew,
  allPanels,
  totalPanels,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  // Use allPanels (pre-fetched) or searchResults (when searching)
  const displayPanels = searchTerm ? searchResults : allPanels;

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    if (!selectedScenario) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/pricing-rules/panel?search=${searchTerm}&size=50&scenario_id=${selectedScenario}`);
        const transformedPanels = response.data.items.map(item => ({
          id: item.panel_id,
          name: item.panel_name,
          description: item.comment || 'No description available',
          priority: item.priority,
          location_node_id: item.location_node_id,
          location_group_id: item.location_group_id,
          product_group_id: item.product_group_id,
          product_node_id: item.product_node_id,
          scenarioId: item.scenario_id
        }));
        setSearchResults(transformedPanels);
      } catch (error) {
        console.error('Error searching panels:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedScenario]);

  // Find selected panel
  const selectedPanelData = displayPanels.find(p => p.id === selectedPanel);

  // Filter out selected panel from the list and sort by priority (descending)
  const unselectedPanels = displayPanels
    .filter(p => p.id !== selectedPanel)
    .sort((a, b) => b.priority - a.priority);

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
            placeholder="Search panels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto"
      >
        {/* Selected Panel - Sticky at top */}
        {selectedPanelData && (
          <div className="sticky top-0 bg-white z-10">
            <div className="px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                Selected Panel
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                }}
                className="text-xs text-purple-500 hover:text-purple-700 font-semibold"
              >
                Clear
              </button>
            </div>
            <div className="mx-4 mb-3 rounded-lg border-2 border-purple-400 bg-purple-50/30 overflow-hidden">
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
                    <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {selectedPanelData.name}
                    </p>
                    <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded flex-shrink-0 font-medium">
                      P: {selectedPanelData.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {selectedPanelData.description}
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
            className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Plus
                size={18}
                className="text-purple-500 group-hover:text-purple-600"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                Create New Panel
              </p>
              <p className="text-xs text-gray-500">
                Describe your panel in chat
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-gray-300 group-hover:text-purple-400 transition-colors"
            />
          </div>
        </div>

        {/* Available Panels List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : unselectedPanels.length === 0 && !selectedPanelData ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <LayoutGrid
              size={32}
              className="text-gray-300 mb-2"
            />
            <p className="text-sm text-gray-500">
              No panels found
            </p>
            <p className="text-xs text-gray-400">
              Create a new panel to get started
            </p>
          </div>
        ) : (
          <>
            {unselectedPanels.length > 0 && (
              <div className="px-4 py-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Available Panels
                </p>
              </div>
            )}
            {unselectedPanels.map((panel) => (
              <div
                key={panel.id}
                onClick={() => onSelect(panel.id)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-purple-400 transition-colors">
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                      {panel.name}
                    </p>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded flex-shrink-0">
                      P: {panel.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {panel.description}
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
          {searchTerm ? `${sortedPanels.length} panel${sortedPanels.length !== 1 ? "s" : ""}` : `${totalPanels} panel${totalPanels !== 1 ? "s" : ""}`}
          {selectedPanel && (
            <span className="text-purple-600 ml-1">
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

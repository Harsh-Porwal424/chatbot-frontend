import React, { useState, useEffect } from "react";
import {
  X,
  PlayCircle,
  LayoutGrid,
  FileCheck,
  Target,
  Package,
  MapPin,
  Lock,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { ScenariosList } from "./ScenariosList";
import { PanelsList } from "./PanelsList";
import { RulesList } from "./RulesList";
import { TreeNode } from "../hierarchy/TreeNode";
import { GroupsTable } from "../hierarchy/GroupsTable";
import { TreeSearch } from "../hierarchy/TreeSearch";
import { useTreeSearch } from "../../hooks/useTreeSearch";

export const ContextPanel = ({
  isOpen,
  onClose,
  productSelection,
  setProductSelection,
  locationSelection,
  setLocationSelection,
  selectedScenario,
  setSelectedScenario,
  selectedPanel,
  setSelectedPanel,
  selectedRules,
  setSelectedRules,
  onCreateNewScenario,
  onCreateNewPanel,
  onCreateNewRule,
  allScenarios,
  totalScenariosCount,
  allPanels,
  totalPanelsCount,
  allRules,
  totalRulesCount,
  productHierarchy,
  locationHierarchy,
  productGroups,
  locationGroups,
  activeTab: externalActiveTab,
  onActiveTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState("scenarios");
  
  // Use external activeTab if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = (tab) => {
    if (onActiveTabChange) {
      onActiveTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };
  const [scopeTab, setScopeTab] = useState("products");
  const [scopeView, setScopeView] = useState("tree");
  const [expandedProducts, setExpandedProducts] = useState(
    new Set(["enterprise"]),
  );
  const [expandedLocations, setExpandedLocations] = useState(
    new Set(["enterprise"]),
  );

  // Initialize search hooks for products and locations
  const productSearch = useTreeSearch(
    productHierarchy,
    expandedProducts,
    setExpandedProducts
  );

  const locationSearch = useTreeSearch(
    locationHierarchy,
    expandedLocations,
    setExpandedLocations
  );

  // Helper function to find path to a node in hierarchy
  const findPathToNode = (
    nodes,
    targetId,
    currentPath = [],
  ) => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return currentPath;
      }
      if (node.children) {
        const path = findPathToNode(node.children, targetId, [
          ...currentPath,
          node.id,
        ]);
        if (path) return path;
      }
    }
    return null;
  };

  // Auto-expand path to selected nodes when selections change
  useEffect(() => {
    if (productSelection.size > 0) {
      const newExpanded = new Set(expandedProducts);
      productSelection.forEach((nodeId) => {
        const path = findPathToNode(productHierarchy, nodeId);
        if (path) {
          path.forEach((id) => newExpanded.add(id));
        }
      });
      if (newExpanded.size !== expandedProducts.size) {
        setExpandedProducts(newExpanded);
      }
    }
  }, [productSelection, productHierarchy, expandedProducts]);

  useEffect(() => {
    if (locationSelection.size > 0) {
      const newExpanded = new Set(expandedLocations);
      locationSelection.forEach((nodeId) => {
        const path = findPathToNode(locationHierarchy, nodeId);
        if (path) {
          path.forEach((id) => newExpanded.add(id));
        }
      });
      if (newExpanded.size !== expandedLocations.size) {
        setExpandedLocations(newExpanded);
      }
    }
  }, [locationSelection, locationHierarchy, expandedLocations]);

  // Auto-expand root node when filtered product hierarchy is loaded (panel selected)
  useEffect(() => {
    if (selectedPanel && productHierarchy.length > 0) {
      const rootNodeId = productHierarchy[0].id;
      setExpandedProducts((prev) => {
        if (!prev.has(rootNodeId)) {
          const next = new Set(prev);
          next.add(rootNodeId);
          return next;
        }
        return prev;
      });
    }
  }, [selectedPanel, productHierarchy]);

  // Auto-expand root node when filtered location hierarchy is loaded (panel selected)
  useEffect(() => {
    if (selectedPanel && locationHierarchy.length > 0) {
      const rootNodeId = locationHierarchy[0].id;
      setExpandedLocations((prev) => {
        if (!prev.has(rootNodeId)) {
          const next = new Set(prev);
          next.add(rootNodeId);
          return next;
        }
        return prev;
      });
    }
  }, [selectedPanel, locationHierarchy]);

  const toggleExpand = (id, type) => {
    const setExpanded =
      type === "product"
        ? setExpandedProducts
        : setExpandedLocations;
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelection = (id, type) => {
    if (selectedPanel) return; // Read-only when panel selected
    const setSelection =
      type === "product"
        ? setProductSelection
        : setLocationSelection;

    // Check if it's a group selection (groups are single-select)
    const isGroupSelection = id.startsWith("group_");

    if (isGroupSelection) {
      // Single-select for groups - replace selection
      setSelection(new Set([id]));
    } else {
      // Multi-select for hierarchy nodes
      setSelection((prev) => {
        const next = new Set(prev);
        // Remove any group selections when selecting hierarchy
        Array.from(next).forEach((existingId) => {
          if (existingId.startsWith("group_"))
            next.delete(existingId);
        });
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  };

  const toggleRule = (ruleId) => {
    setSelectedRules((prev) => {
      // Single-select behavior: if clicking the same rule, deselect it; otherwise select the new one
      if (prev.has(ruleId)) {
        return new Set(); // Deselect
      } else {
        return new Set([ruleId]); // Select only this rule (replace any previous selection)
      }
    });
  };

  const selectedScenarioData = allScenarios.find(
    (s) => s.id === selectedScenario,
  );
  const selectedPanelData = allPanels.find(
    (p) => p.id === selectedPanel,
  );

  const isPanelDisabled = !selectedScenario;
  const isRulesDisabled = !selectedPanel;
  const isReadOnly = !!selectedPanel;

  // Helper function to get SKU count from a node ID
  const getSkuCount = (nodeId) => {
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          return node.count !== undefined ? node.count : 1;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found !== null) return found;
        }
      }
      return null;
    };
    if (nodeId.startsWith("group_")) {
      const group = productGroups.find(
        (g) => `group_${g.id}` === nodeId,
      );
      return group?.items || 0;
    }
    return findNode(productHierarchy) || 0;
  };

  // Helper function to get store count from a node ID
  const getStoreCount = (nodeId) => {
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          return node.count !== undefined ? node.count : 1;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found !== null) return found;
        }
      }
      return null;
    };
    if (nodeId.startsWith("group_")) {
      const group = locationGroups.find(
        (g) => `group_${g.id}` === nodeId,
      );
      return group?.items || 0;
    }
    return findNode(locationHierarchy) || 0;
  };

  const totalSkuCount = Array.from(productSelection).reduce(
    (sum, nodeId) => sum + getSkuCount(nodeId),
    0,
  );
  const totalStoreCount = Array.from(locationSelection).reduce(
    (sum, nodeId) => sum + getStoreCount(nodeId),
    0,
  );

  if (!isOpen) return null;

  const tabs = [
    {
      id: "scenarios",
      label: "Scenarios",
      icon: PlayCircle,
      disabled: false,
      hasSelection: !!selectedScenario,
      count: null,
      color: "orange",
    },
    {
      id: "panels",
      label: "Panels",
      icon: LayoutGrid,
      disabled: isPanelDisabled,
      hasSelection: !!selectedPanel,
      count: null,
      color: "purple",
    },
    {
      id: "rules",
      label: "Rules",
      icon: FileCheck,
      disabled: isRulesDisabled,
      hasSelection: false,
      count: selectedRules.size,
      color: "indigo",
    },
    {
      id: "scope",
      label: "Scope",
      icon: Target,
      disabled: false,
      hasSelection:
        productSelection.size > 0 || locationSelection.size > 0,
      count: null,
      color: "teal",
    },
  ];

  const getDotColor = (color) => {
    switch (color) {
      case "orange":
        return "bg-orange-500";
      case "purple":
        return "bg-purple-500";
      case "indigo":
        return "bg-indigo-500";
      case "teal":
        return "bg-teal-500";
      case "blue":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-800">
          Rule Context
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-4 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              onClick={() =>
                !isDisabled && setActiveTab(tab.id)
              }
              disabled={isDisabled}
              title={
                isDisabled
                  ? tab.id === "panels"
                    ? "Select a scenario first"
                    : "Select a panel first"
                  : ""
              }
              className={`relative flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isDisabled
                  ? "text-gray-300 cursor-not-allowed"
                  : isActive
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Icon size={18} />
                {/* Dot indicator for single-select tabs (Scenarios, Panels, Scope) */}
                {tab.hasSelection && !isDisabled && (
                  <span
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${getDotColor(tab.color)}`}
                  />
                )}
                {/* Count badge for multi-select tabs (Rules) */}
                {tab.count !== null &&
                  tab.count > 0 &&
                  !isDisabled && (
                    <span
                      className={`absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full text-white ${getDotColor(tab.color)}`}
                    >
                      {tab.count}
                    </span>
                  )}
              </div>
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "scenarios" && (
          <ScenariosList
            selectedScenario={selectedScenario}
            onSelect={setSelectedScenario}
            onCreateNew={onCreateNewScenario}
            allScenarios={allScenarios}
            totalScenarios={totalScenariosCount}
          />
        )}

        {activeTab === "panels" && (
          <PanelsList
            selectedScenario={selectedScenario}
            selectedPanel={selectedPanel}
            onSelect={setSelectedPanel}
            onCreateNew={onCreateNewPanel}
            allPanels={allPanels}
            totalPanels={totalPanelsCount}
          />
        )}

        {activeTab === "scope" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scope Header */}
            <div className="px-3 py-3 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setScopeTab("products")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      scopeTab === "products"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Package
                      size={15}
                      className={
                        scopeTab === "products"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                    <span>Products</span>
                  </button>
                  <button
                    onClick={() => setScopeTab("locations")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      scopeTab === "locations"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MapPin
                      size={15}
                      className={
                        scopeTab === "locations"
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    />
                    <span>Locations</span>
                  </button>
                </div>

                {isReadOnly && (
                  <div
                    className="flex items-center gap-1 text-amber-600"
                    title="Panel selection locked"
                  >
                    <Lock size={14} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {scopeTab === "locations"
                    ? "Select a location node"
                    : "Select a product node"}
                </span>
                {/* Commented out Tree/Groups toggle - showing only tree view for now */}
                {/* <div className="flex bg-gray-100 rounded p-0.5">
                  <button
                    onClick={() => setScopeView("tree")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      scopeView === "tree"
                        ? "bg-white text-gray-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Tree
                  </button>
                  <button
                    onClick={() => setScopeView("groups")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      scopeView === "groups"
                        ? "bg-white text-gray-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Groups
                  </button>
                </div> */}
              </div>
            </div>

            {/* Tree Search (only visible in tree view) */}
            {scopeView === "tree" && (
              <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                {scopeTab === "products" ? (
                  <TreeSearch
                    searchTerm={productSearch.searchTerm}
                    onSearchChange={productSearch.setSearchTerm}
                    searchMode={productSearch.searchMode}
                    onToggleMode={productSearch.toggleSearchMode}
                    matchCount={productSearch.matchCount}
                    onClear={productSearch.clearSearch}
                    placeholder="Search products..."
                  />
                ) : (
                  <TreeSearch
                    searchTerm={locationSearch.searchTerm}
                    onSearchChange={locationSearch.setSearchTerm}
                    searchMode={locationSearch.searchMode}
                    onToggleMode={locationSearch.toggleSearchMode}
                    matchCount={locationSearch.matchCount}
                    onClear={locationSearch.clearSearch}
                    placeholder="Search locations..."
                  />
                )}
              </div>
            )}

            <div
              className={`flex-1 overflow-auto ${isReadOnly ? "pointer-events-none opacity-60" : ""}`}
            >
              {scopeTab === "products" ? (
                scopeView === "tree" ? (
                  <div className="p-3">
                    {productSearch.filteredTree.length > 0 ? (
                      productSearch.filteredTree.map((node) => (
                        <TreeNode
                          key={node.id}
                          node={node}
                          selectedIds={productSelection}
                          onToggle={(id) =>
                            toggleSelection(id, "product")
                          }
                          expandedIds={expandedProducts}
                          onExpand={(id) =>
                            toggleExpand(id, "product")
                          }
                          readOnly={isReadOnly}
                          searchTerm={productSearch.searchTerm}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No matching products found</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <GroupsTable
                    groups={productGroups}
                    selectedIds={productSelection}
                    onToggle={(id) =>
                      toggleSelection(id, "product")
                    }
                    readOnly={isReadOnly}
                  />
                )
              ) : scopeView === "tree" ? (
                <div className="p-3">
                  {locationSearch.filteredTree.length > 0 ? (
                    locationSearch.filteredTree.map((node) => (
                      <TreeNode
                        key={node.id}
                        node={node}
                        selectedIds={locationSelection}
                        onToggle={(id) =>
                          toggleSelection(id, "location")
                        }
                        expandedIds={expandedLocations}
                        onExpand={(id) =>
                          toggleExpand(id, "location")
                        }
                        readOnly={isReadOnly}
                        searchTerm={locationSearch.searchTerm}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No matching locations found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              ) : (
                <GroupsTable
                  groups={locationGroups}
                  selectedIds={locationSelection}
                  onToggle={(id) =>
                    toggleSelection(id, "location")
                  }
                  readOnly={isReadOnly}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "rules" && (
          <RulesList
            selectedPanel={selectedPanel}
            selectedRules={selectedRules}
            onToggleRule={toggleRule}
            onCreateNew={onCreateNewRule}
            allRules={allRules}
            totalRules={totalRulesCount}
          />
        )}
      </div>

      {/* Footer Summary - Two Row Layout */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        {/* Row 1: Scenario > Panel breadcrumb */}
        {(selectedScenarioData || selectedPanelData) && (
          <div className="flex items-center gap-1.5 text-sm mb-2 min-w-0">
            {selectedScenarioData && (
              <span
                className="flex items-center gap-1 text-orange-600 flex-shrink-0"
                title={selectedScenarioData.name}
              >
                <PlayCircle
                  size={14}
                  className="flex-shrink-0"
                />
                <span className="font-medium truncate max-w-[80px]">
                  {selectedScenarioData.name}
                </span>
              </span>
            )}
            {selectedScenarioData && selectedPanelData && (
              <ChevronRight
                size={14}
                className="text-gray-400 flex-shrink-0"
              />
            )}
            {selectedPanelData && (
              <span
                className="flex items-center gap-1 text-purple-600 min-w-0"
                title={selectedPanelData.name}
              >
                <LayoutGrid
                  size={14}
                  className="flex-shrink-0"
                />
                <span className="font-medium truncate max-w-[120px]">
                  {selectedPanelData.name}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Row 2: Scope & Rules counts + Clear */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {productSelection.size > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <Package size={14} />
                <span className="font-medium">
                  {totalSkuCount.toLocaleString()}
                </span>
              </span>
            )}
            {locationSelection.size > 0 && (
              <span className="flex items-center gap-1 text-green-600">
                <MapPin size={14} />
                <span className="font-medium">
                  {totalStoreCount.toLocaleString()}
                </span>
              </span>
            )}
            {selectedRules.size > 0 && (
              <span className="flex items-center gap-1 text-indigo-600">
                <FileCheck size={14} />
                <span className="font-medium">
                  {selectedRules.size}
                </span>
              </span>
            )}
            {!selectedScenarioData &&
              !selectedPanelData &&
              productSelection.size === 0 &&
              locationSelection.size === 0 &&
              selectedRules.size === 0 && (
                <span className="text-gray-400 text-sm">
                  No selection
                </span>
              )}
          </div>

          {(selectedScenario ||
            selectedPanel ||
            productSelection.size > 0 ||
            locationSelection.size > 0 ||
            selectedRules.size > 0) && (
            <button
              onClick={() => {
                setSelectedScenario(null);
                setSelectedPanel(null);
                setProductSelection(new Set());
                setLocationSelection(new Set());
                setSelectedRules(new Set());
              }}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Package, MapPin, Lock } from "lucide-react";
import { TreeNode } from "../hierarchy/TreeNode";
import { GroupsTable } from "../hierarchy/GroupsTable";

export const ScopeTab = ({
  productHierarchy,
  locationHierarchy,
  productGroups,
  locationGroups,
  productSelection,
  locationSelection,
  expandedProducts,
  expandedLocations,
  onToggleSelection,
  onToggleExpand,
  isReadOnly,
}) => {
  const [scopeTab, setScopeTab] = useState("products");
  const [scopeView, setScopeView] = useState("tree");

  return (
    <div className="flex flex-col h-full">
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
                  scopeTab === "products" ? "text-blue-600" : "text-gray-400"
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
                  scopeTab === "locations" ? "text-green-600" : "text-gray-400"
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
          <div className="flex bg-gray-100 rounded p-0.5">
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
          </div>
        </div>
      </div>

      <div
        className={`flex-1 overflow-auto ${isReadOnly ? "pointer-events-none opacity-60" : ""}`}
      >
        {scopeTab === "products" ? (
          scopeView === "tree" ? (
            <div className="p-3">
              {productHierarchy.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  selectedIds={productSelection}
                  onToggle={(id) => onToggleSelection(id, "product")}
                  expandedIds={expandedProducts}
                  onExpand={(id) => onToggleExpand(id, "product")}
                  readOnly={isReadOnly}
                />
              ))}
            </div>
          ) : (
            <GroupsTable
              groups={productGroups}
              selectedIds={productSelection}
              onToggle={(id) => onToggleSelection(id, "product")}
              readOnly={isReadOnly}
            />
          )
        ) : scopeView === "tree" ? (
          <div className="p-3">
            {locationHierarchy.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                selectedIds={locationSelection}
                onToggle={(id) => onToggleSelection(id, "location")}
                expandedIds={expandedLocations}
                onExpand={(id) => onToggleExpand(id, "location")}
                readOnly={isReadOnly}
              />
            ))}
          </div>
        ) : (
          <GroupsTable
            groups={locationGroups}
            selectedIds={locationSelection}
            onToggle={(id) => onToggleSelection(id, "location")}
            readOnly={isReadOnly}
          />
        )}
      </div>
    </div>
  );
};

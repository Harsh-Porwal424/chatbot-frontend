import React from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { highlightText } from "../../utils/treeSearch";

export const TreeNode = ({
  node,
  level = 0,
  selectedIds,
  onToggle,
  expandedIds,
  onExpand,
  readOnly = false,
  inheritedSelection = false,
  searchTerm = "",
}) => {
  const hasChildren = node.children?.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isDirectlySelected = selectedIds.has(node.id);
  const isInherited =
    !readOnly && inheritedSelection && !isDirectlySelected;
  const hasCount = node.count !== undefined;

  // Children inherit selection only when NOT in read-only mode
  const childInheritedSelection =
    !readOnly && (isDirectlySelected || inheritedSelection);

  // Can toggle if not read-only and not inherited
  const canToggle = !readOnly && !isInherited;

  // Generate highlighted text segments
  const nameSegments = highlightText(node.name, searchTerm);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors ${
          canToggle
            ? "cursor-pointer hover:bg-gray-50"
            : "cursor-default"
        } ${
          isDirectlySelected
            ? "bg-blue-50"
            : isInherited
              ? "bg-gray-50"
              : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand(node.id);
            }}
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <div
          onClick={() => canToggle && onToggle(node.id)}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            isDirectlySelected
              ? "bg-blue-600 border-blue-600"
              : isInherited
                ? "bg-gray-400 border-gray-400"
                : "border-gray-300"
          } ${canToggle ? "hover:border-blue-400" : ""}`}
        >
          {(isDirectlySelected || isInherited) && (
            <Check
              size={10}
              className="text-white"
              strokeWidth={3}
            />
          )}
        </div>

        <span
          className={`text-sm flex-1 ${
            isDirectlySelected
              ? "text-blue-700 font-medium"
              : isInherited
                ? "text-gray-500"
                : "text-gray-700"
          }`}
          onClick={() => canToggle && onToggle(node.id)}
        >
          {nameSegments.map((segment, idx) => (
            segment.highlight ? (
              <mark key={idx} className="bg-yellow-200 text-gray-900 font-medium px-0.5 rounded">
                {segment.text}
              </mark>
            ) : (
              <span key={idx}>{segment.text}</span>
            )
          ))}
          {hasCount && (
            <span className="text-gray-400 ml-1">
              ({node.count})
            </span>
          )}
        </span>
      </div>

      {hasChildren &&
        isExpanded &&
        node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            level={level + 1}
            selectedIds={selectedIds}
            onToggle={onToggle}
            expandedIds={expandedIds}
            onExpand={onExpand}
            readOnly={readOnly}
            inheritedSelection={childInheritedSelection}
            searchTerm={searchTerm}
          />
        ))}
    </div>
  );
};

import React, { useState } from "react";
import { Search, Check } from "lucide-react";

export const GroupsTable = ({
  groups,
  selectedIds,
  onToggle,
  readOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`flex flex-col h-full ${readOnly ? "opacity-75" : ""}`}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-2 px-3 w-8"></th>
              <th className="py-2 px-3 font-medium">Name</th>
              <th className="py-2 px-3 font-medium w-16">
                Type
              </th>
              <th className="py-2 px-3 font-medium w-20">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((group) => {
              const isSelected = selectedIds.has(
                `group_${group.id}`,
              );
              return (
                <tr
                  key={group.id}
                  className={`border-b border-gray-50 transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"} ${isSelected ? "bg-blue-50" : readOnly ? "" : "hover:bg-gray-50"}`}
                  onClick={() =>
                    !readOnly && onToggle(`group_${group.id}`)
                  }
                >
                  <td className="py-2 px-3">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : readOnly ? "border-gray-200" : "border-gray-300"}`}
                    >
                      {isSelected && (
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                  </td>
                  <td
                    className={`py-2 px-3 ${isSelected ? "text-blue-700 font-medium" : "text-gray-700"}`}
                  >
                    {group.name}
                    <span className="text-gray-400 text-xs ml-1">
                      ({group.items})
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${group.type === "Rule" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {group.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500 text-xs">
                    {group.updatedAt}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Agents data - this should match the data structure from App.js
const agents = [
  {
    id: "chat",
    name: "Pricing Assistant",
    description:
      "Ask questions about pricing strategies & insights",
    icon: null, // Will be set dynamically
    color: "#1565C0",
    bgColor: "#E3F2FD",
  },
  {
    id: "rules",
    name: "Rule Builder",
    description: "Create and manage pricing rules",
    icon: null, // Will be set dynamically
    color: "#7B1FA2",
    bgColor: "#F3E5F5",
  },
];

export const AgentDropdown = ({
  currentAgent,
  onSelect,
  isOpen,
  setIsOpen,
  agentsData = agents,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [setIsOpen]);

  const agent = agentsData.find((a) => a.id === currentAgent);
  if (!agent) return null;

  const AgentIcon = agent.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: agent.bgColor }}
        >
          <AgentIcon size={16} style={{ color: agent.color }} />
        </div>
        <span className="font-semibold text-gray-800 text-sm">
          {agent.name}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-1">
            <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Switch Agent
            </p>
            {agentsData.map((a) => {
              const Icon = a.icon;
              const isActive = a.id === currentAgent;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    onSelect(a.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-md transition-colors ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: a.bgColor }}
                  >
                    <Icon
                      size={18}
                      style={{ color: a.color }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-800 text-sm">
                      {a.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

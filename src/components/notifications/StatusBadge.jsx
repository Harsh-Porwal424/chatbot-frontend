import React from "react";

// Status Badge Component
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      label: "Completed",
    },
    in_progress: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      label: "In Progress",
    },
    started: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      label: "Started",
    },
    failed: {
      bg: "bg-red-50",
      text: "text-red-700",
      label: "Failed",
    },
  };
  const config = statusConfig[status] || statusConfig.started;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

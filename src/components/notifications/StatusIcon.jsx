import React from "react";
import { CheckCircle2, Loader2, Clock, XCircle } from "lucide-react";

// Status Icon Component
export const StatusIcon = ({ status }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 size={16} className="text-emerald-500" />;
    case "in_progress":
      return <Loader2 size={16} className="text-blue-500 animate-spin" />;
    case "started":
      return <Clock size={16} className="text-amber-500" />;
    case "failed":
      return <XCircle size={16} className="text-red-500" />;
    default:
      return <Clock size={16} className="text-gray-400" />;
  }
};

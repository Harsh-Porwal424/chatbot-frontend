import React from "react";
import { ChevronRight } from "lucide-react";

// Quick Action Card Component
export const QuickActionCard = ({ icon: Icon, text, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left group w-full"
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0"
      style={{ backgroundColor: `${color}12` }}
    >
      <Icon size={20} style={{ color }} />
    </div>
    <span className="font-medium text-gray-700 text-sm flex-1 leading-snug">
      {text}
    </span>
    <ChevronRight
      size={16}
      className="text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0"
    />
  </button>
);

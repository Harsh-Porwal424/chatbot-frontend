import React from "react";

// ClearDemand Logo Component
export const ClearDemandLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M 50 10 A 40 40 0 1 0 50 90"
      stroke="#4CAF50"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
    <text
      x="50"
      y="68"
      textAnchor="middle"
      fontSize="52"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
      fill="#1565C0"
    >
      D
    </text>
  </svg>
);

// ClearDemand Logo Mini Component
export const ClearDemandLogoMini = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M 50 10 A 40 40 0 1 0 50 90"
      stroke="#4CAF50"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
    <text
      x="50"
      y="68"
      textAnchor="middle"
      fontSize="52"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
      fill="#1565C0"
    >
      D
    </text>
  </svg>
);

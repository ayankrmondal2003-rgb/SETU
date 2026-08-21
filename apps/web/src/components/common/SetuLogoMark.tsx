import React from 'react';

interface SetuLogoMarkProps {
  className?: string;
}

export const SetuLogoMark: React.FC<SetuLogoMarkProps> = ({ className = 'w-7 h-7' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Crown Kalasha Dot / Stupa Finial */}
      <circle cx="12" cy="2.5" r="0.85" fill="currentColor" stroke="none" />

      {/* Central Shikhara Spire / Lotus Bud Silhouette */}
      <path d="M12 4C9.5 7.5 7.5 11 7.5 15.5" />
      <path d="M12 4C14.5 7.5 16.5 11 16.5 15.5" />
      <path d="M12 4V15.5" />

      {/* Sweeping Setu Bridge Arch */}
      <path d="M2.5 18.5C5.5 13.5 18.5 13.5 21.5 18.5" />

      {/* Horizontal Water / Deck Foundation Line */}
      <path d="M1.5 19.5H22.5" />

      {/* Vertical Support Pillars */}
      <path d="M7.5 15.5V19.5" />
      <path d="M16.5 15.5V19.5" />
    </svg>
  );
};

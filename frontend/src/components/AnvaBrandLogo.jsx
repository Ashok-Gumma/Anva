import React from "react";

/**
 * Reusable Anva Brand Text Logo Component
 * Displays clean Anva typography (An + Quincy-style va) without icon badge.
 * Used across Navbar, Auth Pages, Headers, etc.
 */
const AnvaBrandLogo = ({ textSize = "text-xl", className = "" }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <span className={`text-base-content font-bold tracking-tight ${textSize}`}>
        An<span className="font-curly font-bold ml-0.5">va</span>
      </span>
    </div>
  );
};

export default AnvaBrandLogo;

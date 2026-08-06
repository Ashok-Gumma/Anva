import React from "react";

/**
 * Reusable Anva Brand Logo Component
 * Displays the transparent circular badge icon alongside signature Anva typography (An + cursive va)
 * Used in Navbar, Login Page, Sign-Up Page.
 */
const AnvaBrandLogo = ({ badgeSize = "size-8", textSize = "text-xl", showText = true, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 group select-none ${className}`}>
      <img
        src="/anva-brand-icon.png"
        alt="Anva Logo"
        className={`object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform ${badgeSize}`}
      />
      {showText && (
        <span className={`text-base-content font-bold tracking-tight font-minimal ${textSize}`}>
          An<span className="font-curly font-bold italic text-primary ml-0.5">va</span>
        </span>
      )}
    </div>
  );
};

export default AnvaBrandLogo;

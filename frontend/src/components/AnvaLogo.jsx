import React from 'react';

/**
 * Anva Brand Logo
 * Displays the retro vintage badge logo image (/anva-logo.png) consistently across all pages.
 */
const AnvaLogo = ({ className = "size-8", ...props }) => {
  return (
    <img
      src="/anva-logo.png"
      alt="Anva Retro Logo"
      className={`object-contain rounded-full shadow-sm select-none ${className}`}
      {...props}
    />
  );
};

export default AnvaLogo;

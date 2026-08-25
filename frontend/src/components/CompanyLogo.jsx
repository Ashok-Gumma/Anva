import React from "react";

// Self-contained inline vector brand logos (0 HTTP requests, 0 CORS issues, 100% reliable)
const InlineLogos = {
  google: () => (
    <svg viewBox="0 0 48 48" className="w-full h-full object-contain">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  ),
  microsoft: () => (
    <svg viewBox="0 0 48 48" className="w-full h-full object-contain">
      <rect x="2" y="2" width="20" height="20" fill="#F25022" rx="2" />
      <rect x="26" y="2" width="20" height="20" fill="#7FBA00" rx="2" />
      <rect x="2" y="26" width="20" height="20" fill="#00A4EF" rx="2" />
      <rect x="26" y="26" width="20" height="20" fill="#FFB900" rx="2" />
    </svg>
  ),
  amazon: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
      <path fill="#146EB4" d="M53.7 65.5c-7.3 0-13.6-4.2-13.6-12.7 0-10.7 8.9-15.6 20.3-15.6v-.9c0-3.3-2.1-5.6-7.2-5.6-4.5 0-8.9 1.4-12.5 3.7l-2.4-4.8c4.6-2.9 10.2-4.5 16.1-4.5 9.7 0 13.9 5.3 13.9 13.7v17.4c0 3.1.8 5.6 1.7 7.7H63.1c-.6-1.5-1.1-3.6-1.3-5.2-2.4 4.5-6.3 6.8-11.1 6.8zm4.3-6.1c4.5 0 8.3-2.8 10-7.2v-7.8c-7.7.3-13.2 2.9-13.2 9.5 0 3.7 2.4 5.5 6.2 5.5z" />
      <path fill="#FF9900" d="M18.5 75.8c23.2 16.4 51.5 13.5 69.4.2 1.3-1 2.9.8 1.6 2-19.4 17.5-51 19.3-73.4-.2-1.8-1.5-.2-3.1 2.4-2z" />
      <path fill="#FF9900" d="M91.3 73.1c-.8-.9-4.7-.5-7.3-.2-.8.1-.9-.6-.2-1.1 4.5-3.3 11.9-2.4 12.8-1.3.9 1.1-.3 8.5-4.5 12.2-.7.6-1.3.3-1-.4 1.2-2.6 1-8.3.2-9.2z" />
    </svg>
  ),
  meta: () => (
    <svg viewBox="0 0 48 48" className="w-full h-full object-contain">
      <path fill="#0668E1" d="M24 16.4c-4.4 0-7.8 3.5-9.8 6.8-2.6 4.3-4.5 8.8-7.9 8.8-3.4 0-5.3-2.5-5.3-6.8 0-6.1 4.6-12.2 11.2-12.2 5.1 0 8.9 3.2 11.8 7.3 2.9-4.1 6.7-7.3 11.8-7.3 6.6 0 11.2 6.1 11.2 12.2 0 4.3-1.9 6.8-5.3 6.8-3.4 0-5.3-4.5-7.9-8.8-2-3.3-5.4-6.8-9.8-6.8zm0 7.8c2.9 3.9 5.3 7.8 8.1 7.8 1.8 0 2.9-1.2 2.9-3.8 0-4.1-3-8.8-7.7-8.8-3.3 0-5.9 2.5-7.8 5.7zm-9.3-4.8c-4.7 0-7.7 4.7-7.7 8.8 0 2.6 1.1 3.8 2.9 3.8 2.8 0 5.2-3.9 8.1-7.8-1.9-3.2-4.5-5.7-7.8-5.7z" />
    </svg>
  ),
  apple: () => (
    <svg viewBox="0 0 170 170" className="w-full h-full object-contain">
      <path fill="currentColor" d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.58-7.7-11.66-13.98-7.61-11.9-13.23-25.04-16.86-39.42-3.63-14.38-5.45-27.46-5.45-39.24 0-16.14 4.23-29.35 12.69-39.63 8.46-10.28 18.73-15.54 30.82-15.79 4.35 0 9.28 1.16 14.79 3.49 5.51 2.33 9.4 3.55 11.66 3.66 1.8 0 5.86-1.28 12.18-3.83 6.32-2.55 11.75-3.64 16.29-3.27 12.69.89 22.86 5.66 30.52 14.32-11.08 6.75-16.53 16.03-16.35 27.84.18 9.38 3.75 17.26 10.72 23.63 6.97 6.37 15.25 10.02 24.84 10.96-2.18 6.53-4.74 13.06-7.69 19.58zm-31.54-106.63c0-6.75 2.47-13.17 7.41-19.26 4.94-6.09 11.04-9.98 18.3-11.68.22 1.34.33 2.57.33 3.69 0 6.64-2.57 13.17-7.72 19.59-5.15 6.42-11.45 10.37-18.9 11.86-.44-1.34-.66-2.74-.66-4.2z" />
    </svg>
  ),
  tcs: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <defs>
        <linearGradient id="tcsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0076CE" />
          <stop offset="100%" stopColor="#001B44" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#tcsGrad)" />
      <text x="60" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="34" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1.5">TCS</text>
      <text x="60" y="86" textAnchor="middle" fill="#58C6FF" fontSize="13" fontWeight="800" fontFamily="sans-serif" letterSpacing="4">TATA</text>
    </svg>
  ),
  infosys: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#007CC3" />
      <text x="60" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="23" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5">Infosys</text>
    </svg>
  ),
  wipro: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
      <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <circle cx="50" cy="20" r="6" fill="#F37023" />
      <circle cx="71" cy="29" r="6" fill="#FDB813" />
      <circle cx="80" cy="50" r="6" fill="#8DC63F" />
      <circle cx="71" cy="71" r="6" fill="#00AEEF" />
      <circle cx="50" cy="80" r="6" fill="#2E3192" />
      <circle cx="29" cy="71" r="6" fill="#92278F" />
      <circle cx="20" cy="50" r="6" fill="#EC008C" />
      <circle cx="29" cy="29" r="6" fill="#ED1C24" />
      <text x="50" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1C1C1C" fontFamily="sans-serif">wipro</text>
    </svg>
  ),
  accenture: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <text x="54" y="66" textAnchor="middle" fill="#000000" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5">accenture</text>
      <path d="M96 50 L107 58 L96 66" fill="none" stroke="#A100FF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  deloitte: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#000000" />
      <text x="54" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="19" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5">Deloitte</text>
      <circle cx="96" cy="63" r="4.5" fill="#86BC25" />
    </svg>
  ),
  cognizant: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <defs>
        <linearGradient id="cogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0033A0" />
          <stop offset="100%" stopColor="#001858" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#cogGrad)" />
      <circle cx="60" cy="40" r="14" fill="none" stroke="#00C0F3" strokeWidth="5" strokeDasharray="60 30" />
      <text x="60" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="800" fontFamily="sans-serif" letterSpacing="-0.3">Cognizant</text>
    </svg>
  ),
  capgemini: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#0070AD" />
      <path d="M60 32 C50 32 45 42 45 48 C45 57 56 65 60 70 C64 65 75 57 75 48 C75 42 70 32 60 32 Z" fill="#FFFFFF" />
      <path d="M57 65 L52 75 L68 75 L63 65 Z" fill="#FFFFFF" />
      <text x="60" y="94" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" fontFamily="sans-serif" letterSpacing="-0.3">Capgemini</text>
    </svg>
  ),
  ibm: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#054ADA" />
      {/* 8-bar classic IBM stripes */}
      <g fill="#FFFFFF">
        <rect x="22" y="32" width="22" height="4" />
        <rect x="22" y="40" width="22" height="4" />
        <rect x="28" y="48" width="10" height="4" />
        <rect x="28" y="56" width="10" height="4" />
        <rect x="28" y="64" width="10" height="4" />
        <rect x="28" y="72" width="10" height="4" />
        <rect x="22" y="80" width="22" height="4" />
        <rect x="22" y="88" width="22" height="4" />

        <rect x="49" y="32" width="22" height="4" />
        <rect x="49" y="40" width="22" height="4" />
        <rect x="49" y="48" width="22" height="4" />
        <rect x="49" y="56" width="22" height="4" />
        <rect x="49" y="64" width="22" height="4" />
        <rect x="49" y="72" width="22" height="4" />
        <rect x="49" y="80" width="22" height="4" />
        <rect x="49" y="88" width="22" height="4" />

        <rect x="76" y="32" width="22" height="4" />
        <rect x="76" y="40" width="22" height="4" />
        <rect x="76" y="48" width="22" height="4" />
        <rect x="76" y="56" width="22" height="4" />
        <rect x="76" y="64" width="22" height="4" />
        <rect x="76" y="72" width="22" height="4" />
        <rect x="76" y="80" width="22" height="4" />
        <rect x="76" y="88" width="22" height="4" />
      </g>
    </svg>
  ),
  oracle: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#F80000" />
      <g fill="#FFFFFF">
        <rect x="26" y="42" width="68" height="36" rx="18" fill="none" stroke="#FFFFFF" strokeWidth="8" />
        <text x="60" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">ORACLE</text>
      </g>
    </svg>
  ),
  adobe: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
      <rect width="100" height="100" rx="20" fill="#EB1000" />
      <polygon points="62.4,18 100,18 100,82" fill="#FFFFFF" />
      <polygon points="37.6,18 0,18 0,82" fill="#FFFFFF" />
      <polygon points="50,46.7 65.6,82 52.4,82 46.8,68 34.6,68" fill="#FFFFFF" />
    </svg>
  ),
  netflix: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#000000" />
      <path fill="#E50914" d="M38 24h15v72H38z" />
      <path fill="#E50914" d="M67 24h15v72H67z" />
      <path fill="#B81D24" d="M38 24h15l29 72H67z" />
    </svg>
  ),
  "goldman-sachs": () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#7399C6" />
      <text x="60" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="serif" letterSpacing="0.5">Goldman</text>
      <text x="60" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="serif" letterSpacing="0.5">Sachs</text>
    </svg>
  ),
  jpmorgan: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#002D62" />
      <text x="60" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900" fontFamily="serif" letterSpacing="-0.5">J.P. Morgan</text>
      <text x="60" y="76" textAnchor="middle" fill="#C59B27" fontSize="11" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">CHASE & CO.</text>
    </svg>
  ),
  cisco: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#005073" />
      <g fill="#00BCEB">
        <rect x="25" y="52" width="6" height="22" rx="3" />
        <rect x="37" y="38" width="6" height="36" rx="3" />
        <rect x="49" y="46" width="6" height="28" rx="3" />
        <rect x="61" y="32" width="6" height="42" rx="3" />
        <rect x="73" y="46" width="6" height="28" rx="3" />
        <rect x="85" y="38" width="6" height="36" rx="3" />
        <rect x="97" y="52" width="6" height="22" rx="3" />
      </g>
      <text x="64" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">CISCO</text>
    </svg>
  ),
  uber: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#000000" />
      <text x="60" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1">Uber</text>
    </svg>
  ),
  salesforce: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#00A1E0" />
      <path fill="#FFFFFF" d="M50 35c4-6 11-10 19-10 11 0 20 7 23 17 4 1 8 4 10 9 3 5 2 12-2 16-3 4-8 5-13 5H36c-6 0-11-2-15-7-4-4-5-10-3-15 2-5 7-9 13-10 3-7 10-12 19-12v7z" opacity="0.9" />
      <text x="60" y="94" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.2">salesforce</text>
    </svg>
  ),
  qualcomm: () => (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <rect width="120" height="120" rx="26" fill="#1C355E" />
      <text x="60" y="68" textAnchor="middle" fill="#3253DC" fontSize="17" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5">
        <tspan fill="#3253DC">Qual</tspan><tspan fill="#FFFFFF">comm</tspan>
      </text>
    </svg>
  ),
};

const CompanyLogo = ({ slug, name, size = "md", className = "" }) => {
  const normalizedSlug = (slug || name || "").toLowerCase().trim();
  const LogoComponent = InlineLogos[normalizedSlug];

  const sizeClasses = {
    xs: "size-6 p-0.5",
    sm: "size-8 p-1",
    md: "size-10 sm:size-12 p-1",
    lg: "size-14 sm:size-16 p-1.5",
    xl: "size-16 sm:size-20 p-2",
  };

  return (
    <div
      className={`rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-xs hover:shadow-md transition-all ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {LogoComponent ? (
        <LogoComponent />
      ) : (
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black uppercase text-white text-xs shadow-xs">
          {name ? name.slice(0, 2) : normalizedSlug.slice(0, 2)}
        </div>
      )}
    </div>
  );
};

export default CompanyLogo;

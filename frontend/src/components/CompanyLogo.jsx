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
      <path fill="currentColor" d="M53.7 65.5c-7.3 0-13.6-4.2-13.6-12.7 0-10.7 8.9-15.6 20.3-15.6v-.9c0-3.3-2.1-5.6-7.2-5.6-4.5 0-8.9 1.4-12.5 3.7l-2.4-4.8c4.6-2.9 10.2-4.5 16.1-4.5 9.7 0 13.9 5.3 13.9 13.7v17.4c0 3.1.8 5.6 1.7 7.7H63.1c-.6-1.5-1.1-3.6-1.3-5.2-2.4 4.5-6.3 6.8-11.1 6.8zm4.3-6.1c4.5 0 8.3-2.8 10-7.2v-7.8c-7.7.3-13.2 2.9-13.2 9.5 0 3.7 2.4 5.5 6.2 5.5z" />
      <path fill="#FF9900" d="M18.5 75.8c23.2 16.4 51.5 13.5 69.4.2 1.3-1 2.9.8 1.6 2-19.4 17.5-51 19.3-73.4-.2-1.8-1.5-.2-3.1 2.4-2z" />
      <path fill="#FF9900" d="M91.3 73.1c-.8-.9-4.7-.5-7.3-.2-.8.1-.9-.6-.2-1.1 4.5-3.3 11.9-2.4 12.8-1.3.9 1.1-.3 8.5-4.5 12.2-.7.6-1.3.3-1-.4 1.2-2.6 1-8.3.2-9.2z" />
    </svg>
  ),
  meta: () => (
    <svg viewBox="0 0 48 48" className="w-full h-full object-contain">
      <path fill="#0668E1" d="M24 16.4c-4.4 0-7.8 3.5-9.8 6.8-2.6 4.3-4.5 8.8-7.9 8.8-3.4 0-5.3-2.5-5.3-6.8 0-6.1 4.6-12.2 11.2-12.2 5.1 0 8.9 3.2 11.8 7.3 2.9-4.1 6.7-7.3 11.8-7.3 6.6 0 11.2 6.1 11.2 12.2 0 4.3-1.9 6.8-5.3 6.8-3.4 0-5.3-4.5-7.9-8.8-2-3.3-5.4-6.8-9.8-6.8zm0 7.8c2.9 3.9 5.3 7.8 8.1 7.8 1.8 0 2.9-1.2 2.9-3.8 0-4.1-3-8.8-7.7-8.8-3.3 0-5.9 2.5-7.8 5.7zm-9.3-4.8c-4.7 0-7.7 4.7-7.7 8.8 0 2.6 1.1 3.8 2.9 3.8 2.8 0 5.2-3.9 8.1-7.8-1.9-3.2-4.5-5.7-7.8-5.7z" />
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
  tcs: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 rounded-xl p-1 text-white shadow-xs select-none">
      <span className="font-black tracking-tighter text-base sm:text-lg leading-none">TCS</span>
      <span className="text-[7px] tracking-widest font-extrabold uppercase opacity-80 mt-0.5">TATA</span>
    </div>
  ),
  infosys: () => (
    <div className="w-full h-full flex items-center justify-center bg-sky-600 rounded-xl p-1 text-white shadow-xs select-none">
      <span className="font-black tracking-tight text-xs sm:text-sm font-sans">Infosys</span>
    </div>
  ),
  wipro: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
      <circle cx="50" cy="50" r="46" fill="#F8F9FA" />
      <circle cx="50" cy="20" r="6" fill="#F37023" />
      <circle cx="71" cy="29" r="6" fill="#FDB813" />
      <circle cx="80" cy="50" r="6" fill="#8DC63F" />
      <circle cx="71" cy="71" r="6" fill="#00AEEF" />
      <circle cx="50" cy="80" r="6" fill="#2E3192" />
      <circle cx="29" cy="71" r="6" fill="#92278F" />
      <circle cx="20" cy="50" r="6" fill="#EC008C" />
      <circle cx="29" cy="29" r="6" fill="#ED1C24" />
      <text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1C1C1C" fontFamily="sans-serif">wipro</text>
    </svg>
  ),
  accenture: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-base-100 rounded-xl border border-base-content/10 p-1 select-none">
      <span className="font-black text-[13px] text-base-content tracking-tight leading-none">accenture</span>
      <span className="text-primary font-black text-xs leading-none -mt-0.5">&gt;</span>
    </div>
  ),
  deloitte: () => (
    <div className="w-full h-full flex items-center justify-center bg-base-100 rounded-xl border border-base-content/10 p-1.5 select-none">
      <span className="font-black text-xs sm:text-sm text-base-content tracking-tight">
        Deloitte<span className="text-emerald-500 font-black">.</span>
      </span>
    </div>
  ),
  cognizant: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-xl p-1 text-white shadow-xs select-none">
      <span className="font-black text-[11px] sm:text-xs tracking-tight">Cognizant</span>
    </div>
  ),
  capgemini: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-sky-700 rounded-xl p-1 text-white shadow-xs select-none">
      <span className="font-black text-[10px] sm:text-xs tracking-tight">Capgemini</span>
      <span className="text-[7px] opacity-80 font-bold">♠</span>
    </div>
  ),
};

const CompanyLogo = ({ slug, name, size = "md", className = "" }) => {
  const normalizedSlug = (slug || name || "").toLowerCase().trim();
  const LogoComponent = InlineLogos[normalizedSlug];

  const sizeClasses = {
    sm: "size-8 p-1",
    md: "size-12 sm:size-14 p-1.5",
    lg: "size-16 sm:size-20 p-2",
  };

  return (
    <div
      className={`rounded-2xl bg-base-200/80 border border-base-content/10 flex items-center justify-center shrink-0 overflow-hidden shadow-xs group-hover:scale-105 transition-transform ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {LogoComponent ? (
        <LogoComponent />
      ) : (
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black uppercase text-primary-content text-sm shadow-xs">
          {name ? name.slice(0, 2) : normalizedSlug.slice(0, 2)}
        </div>
      )}
    </div>
  );
};

export default CompanyLogo;

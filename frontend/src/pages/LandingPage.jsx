import AnvaLogo from "../components/AnvaLogo";
import { Link } from "react-router";
import ParticleBackground from "../components/ParticleBackground";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans" data-theme="light">
      
      {/* 3D Rotating Particles */}
      <ParticleBackground />

      {/* Navbar Minimal matching the image */}
      <nav className="relative z-10 w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <AnvaLogo className="h-9 w-9 object-cover rounded-lg drop-shadow-sm group-hover:scale-105 transition-transform text-primary" />
            <span className="text-slate-900 font-bold text-xl tracking-tight hidden sm:block">Anva</span>
          </Link>
        </div>

        {/* Right download / actions */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:inline-block text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-2">
            Log In
          </Link>
          <Link to="/signup" className="bg-slate-900 text-white hover:bg-slate-800 transition-colors px-5 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2">
            Sign Up Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 text-center px-4 max-w-5xl mx-auto h-[calc(100vh-80px)] pointer-events-none">
        
        <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50/80 backdrop-blur-sm border border-slate-200 text-slate-600 text-sm shadow-sm font-medium pointer-events-auto cursor-pointer hover:bg-slate-100 transition-colors group">
          <div className="text-blue-500 flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <span className="text-slate-800 tracking-tight">Anva Language Exchange</span>
        </div>
        
        <h1 className="text-6xl sm:text-7xl md:text-[5.5rem] font-medium tracking-tight text-slate-900 mb-10 max-w-[60rem] leading-[1.05] drop-shadow-sm">
          Experience liftoff with the next-generation platform
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 pointer-events-auto">
          <Link 
            to="/signup" 
            className="flex items-center justify-center bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all px-6 py-3 rounded-full font-medium shadow-md w-full sm:w-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Start Learning for Free
          </Link>
          
          <Link 
            to="/login" 
            className="flex items-center justify-center bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all px-6 py-3 rounded-full font-medium shadow-sm w-full sm:w-auto"
          >
            Explore features
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;


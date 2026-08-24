import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import AnvaLogo from "../components/AnvaLogo";

const TermsPage = () => {
  return (
    <div data-theme="light" className="min-h-screen bg-white text-black font-sans selection:bg-blue-100 selection:text-blue-900 p-6 sm:p-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="mb-12 flex items-center gap-4">
          <div className="bg-black p-2 rounded-xl">
            <AnvaLogo className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic">Terms of Service</h1>
        </div>

        <div className="space-y-10 text-slate-600 font-medium leading-relaxed">
          <section>
            <h2 className="text-black font-black uppercase tracking-widest text-sm mb-4">1. Community Standards</h2>
            <p>Anva is a community for growth and learning. We maintain a zero-tolerance policy for harassment, discrimination, or hate speech. Users who violate these standards will be permanently banned to keep our community safe.</p>
          </section>

          <section>
            <h2 className="text-black font-black uppercase tracking-widest text-sm mb-4">2. Account Responsibility</h2>
            <p>You are responsible for maintaining the security of your account. We use Clerk for state-of-the-art authentication to ensure your login remains yours. Please do not share your account details with anyone.</p>
          </section>

          <section>
            <h2 className="text-black font-black uppercase tracking-widest text-sm mb-4">3. Usage Eligibility</h2>
            <p>By using Anva, you represent that you are at least 13 years old. Our platform is intended for mature language learning and global exchange.</p>
          </section>

          <section>
            <h2 className="text-black font-black uppercase tracking-widest text-sm mb-4">4. Intellectual Property</h2>
            <p>The Anva brand, software, and logo are our exclusive property. The code you write in our built-in compiler belongs to you, but we provide the tools to help you soar.</p>
          </section>

          <footer className="pt-12 border-t border-slate-100 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
            Agreement Effective as of: March 25, 2026
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

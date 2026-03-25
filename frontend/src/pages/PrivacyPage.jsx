import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import AnvaLogo from "../components/AnvaLogo";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-100 selection:text-blue-900 p-6 sm:p-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="mb-12 flex items-center gap-4">
          <div className="bg-black p-2 rounded-xl">
             <AnvaLogo className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic">Privacy Policy</h1>
        </div>

        <div className="space-y-10 text-slate-600 font-medium leading-relaxed">
          <section>
            <h2 className="text-black font-black uppercase tracking-widest text-sm mb-4">1. Data Collection</h2>
            <p>At Anva, we believe in radical transparency. We collect only the essential information needed to connect you with language partners: your name, email address, profile picture, and the languages you're learning. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-black font-black uppercase tracking-widest text-sm mb-4">2. Interaction Safety</h2>
            <p>Your privacy is paramount during calls and chats. Our video calls and messaging services are designed with industry-standard encryption to ensure your conversations remain private. We do not monitor your private voice or video calls.</p>
          </section>

          <section>
            <h2 className="text-black font-black uppercase tracking-widest text-sm mb-4">3. AI & Personalization</h2>
            <p>Our AI-powered tools may analyze your chat history (with your consent) to provide better grammar corrections and personalized feedback. This data is handled with extreme care and is never used for advertising.</p>
          </section>

          <section>
            <h2 className="text-black font-black uppercase tracking-widest text-sm mb-4">4. Your Rights</h2>
            <p>You have the full right to access, export, or delete your data at any time through your profile settings. We believe in "no loose hands" when it comes to your personal sovereignty.</p>
          </section>

          <footer className="pt-12 border-t border-slate-100 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
            Last Updated: March 25, 2026
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;

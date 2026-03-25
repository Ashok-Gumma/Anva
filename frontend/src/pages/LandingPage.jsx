import { Link } from "react-router";
import { motion } from "framer-motion";
import AnvaLogo from "../components/AnvaLogo";
import ParticleBackground from "../components/ParticleBackground";
import {
  Users, Sparkles, BookOpen, Video, Code, Clock,
  ArrowRight, MessageSquare, Globe, Zap,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────── */
const stats = [
  { value: "1k+", label: "Learners" },
  { value: "20+",  label: "Languages" },
  { value: "98%",  label: "Satisfaction" },
  { value: "24/7", label: "AI Support" },
];

const features = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Language Exchange",
    desc: "Connect with native speakers from 50+ countries for real, immersive practice.",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Language Tutor",
    desc: "24/7 grammar correction, vocabulary coaching, and conversation practice powered by AI.",
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Voice & Video Calls",
    desc: "High-quality video calls for face-to-face language practice with your partners.",
    gradient: "from-orange-500 to-rose-500",
    bg: "bg-orange-50",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Smart Flashcards",
    desc: "Spaced-repetition flashcard system that adapts to your learning speed and level.",
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Real-time Messaging",
    desc: "Instant chat with your language partners — share text, reactions, and media.",
    gradient: "from-green-500 to-teal-500",
    bg: "bg-green-50",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Built-in Code Compiler",
    desc: "Multilingual code editor for developers learning tech vocabulary in a new language.",
    gradient: "from-slate-600 to-slate-800",
    bg: "bg-slate-100",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Matching",
    desc: "Smart partner matching based on your native language, learning goal, and interests.",
    gradient: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Learn Anywhere, Anytime",
    desc: "All your progress, friends, and lessons synced across every device, always.",
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community & Friends",
    desc: "Build your language squad, track friends' progress, and grow together.",
    gradient: "from-teal-500 to-green-500",
    bg: "bg-teal-50",
  },
];

const steps = [
  { num: "01", title: "Create your profile", desc: "Sign up with Clerk in seconds. Add your native language and what you want to learn." },
  { num: "02", title: "Find your match",     desc: "Browse native speakers who want to learn your language — mutual exchange." },
  { num: "03", title: "Start practicing",   desc: "Chat, video call, use AI flashcards, and improve every day." },
];

/* ─── Animation helpers ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const stagger = { 
  hidden: {}, 
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } 
};

/* ─── Component ─────────────────────────────────────────────────── */
const LandingPage = () => (
  <div className="min-h-screen bg-white text-black overflow-x-hidden font-sans selection:bg-blue-100 selection:text-blue-900" data-theme="light">
    <ParticleBackground />

    {/* ── Navbar ── */}
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass-panel mx-4 my-4 rounded-3xl transition-all duration-300">
      <Link to="/" className="flex items-center gap-3 group shrink-0">
        <div className="bg-black p-1.5 rounded-xl group-hover:rotate-6 transition-transform">
          <AnvaLogo className="h-7 w-7 text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-slate-600">Anva</span>
      </Link>

      <div className="hidden sm:flex items-center gap-8">
        <a href="#features" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors">Features</a>
        <a href="#how"      className="text-sm font-semibold text-slate-500 hover:text-black transition-colors">How it works</a>
        <Link to="/login"   className="text-sm font-semibold text-slate-500 hover:text-black transition-colors border-l border-slate-200 pl-8">Log in</Link>
      </div>

      <Link
        to="/sign-up"
        className="flex items-center gap-2 bg-black text-white hover:bg-blue-600 transition-all px-6 py-2.5 rounded-2xl text-sm font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:scale-[1.03] active:scale-[0.97]"
      >
        Get Started <ArrowRight className="w-4 h-4" />
      </Link>
    </nav>

    {/* ── Hero ── */}
    <section className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-32 sm:pt-48 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50/50 border border-blue-100 text-blue-600 text-sm shadow-sm font-bold animate-float"
      >
        <Sparkles className="w-4 h-4" />
        The modern language exchange platform
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
        className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-black mb-6 leading-tight max-w-[50rem] mx-auto italic"
      >
        Master Languages with{" "}
        <span className="relative inline-block not-italic">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
            Real People
          </span>
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full opacity-20 blur-sm" />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-10 font-bold uppercase tracking-wide leading-relaxed"
      >
        Connect with native speakers worldwide. AI-powered tools, real-time feedback, and immersive conversations.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.35 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link to="/sign-up" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white hover:bg-blue-600 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.05] active:scale-[0.98] transition-all px-8 py-4 rounded-2xl font-black shadow-2xl text-base group uppercase tracking-widest">
          Join Anva <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black border border-slate-100 hover:border-slate-200 hover:scale-[1.03] active:scale-[0.98] transition-all px-8 py-4 rounded-2xl font-black shadow-xl text-base backdrop-blur-sm uppercase tracking-widest">
          Explore
        </a>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}
            className="flex flex-col items-center p-5 rounded-3xl bg-white border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <span className="text-2xl font-black text-black group-hover:scale-110 transition-transform">{s.value}</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* ── Features Grid ── */}
    <section id="features" className="relative z-10 bg-slate-50/30 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 text-black text-[10px] font-black shadow-sm mb-4 uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Toolkit
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tighter mb-4 uppercase italic">
            Fluency is here.
          </h2>
          <p className="text-slate-400 font-bold max-w-lg mx-auto text-sm leading-relaxed uppercase tracking-wide">
            We've combined global community with cutting-edge AI for a natural balance.
          </p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className="card-premium p-6 group cursor-default bg-white flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:rotate-[10deg] transition-all duration-500 shadow-sm`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-br ${f.gradient}`}>
                  {f.icon}
                </span>
              </div>
              <h3 className="font-black text-black text-sm mb-2 tracking-widest uppercase">{f.title}</h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-tight leading-relaxed max-w-[200px]">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── How it works ── */}
    <section id="how" className="relative z-10 bg-white py-20 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-black text-[10px] font-black shadow-sm mb-4 uppercase tracking-[0.2em]">
            <Clock className="w-3 h-3 text-blue-500" /> Steps
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tighter mb-4 uppercase italic">Simple. Fast.</h2>
          <p className="text-slate-400 font-bold max-w-xl mx-auto text-sm uppercase tracking-wide">Start your global journey in minutes.</p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {steps.map((step, i) => (
            <motion.div key={step.num} variants={fadeUp}
              className="relative bg-slate-50 group border border-slate-50 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col items-center text-center"
            >
              <div className="absolute -right-1 -top-1 text-5xl font-black text-slate-200/20 select-none group-hover:text-blue-500/5 transition-colors">
                {step.num}
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] block mb-4">{step.num}</span>
              <h3 className="font-black text-black text-base mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{step.title}</h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-tight leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Final CTA ── */}
    <section className="relative z-10 bg-slate-950 text-white py-32 px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl sm:text-7xl font-black mb-8 tracking-tighter leading-none">Ready to soar?</h2>
        <p className="text-slate-400 font-bold mb-12 text-lg max-w-xl mx-auto leading-relaxed uppercase tracking-wide">
          Join 12,000+ learners already using Anva to build bridges, not just learn words.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/sign-up"
            className="group flex items-center gap-2.5 bg-white text-slate-900 hover:bg-blue-50 transition-all px-10 py-5 rounded-2xl font-black shadow-2xl hover:scale-[1.05] active:scale-[0.97] text-lg"
          >
            Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/login"
            className="flex items-center gap-2.5 border-2 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white transition-all px-10 py-5 rounded-2xl font-bold text-lg"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </section>

    {/* ── Footer ── */}
    <footer className="relative z-10 bg-slate-950 py-20 px-4 text-center border-t border-slate-900">
      <div className="flex items-center justify-center gap-3 mb-6 group cursor-pointer">
        <div className="bg-slate-900 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
          <AnvaLogo className="h-6 w-6 text-slate-400" />
        </div>
        <span className="text-white font-black text-xl tracking-tighter">Anva</span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 text-slate-500 font-bold uppercase text-xs tracking-widest">
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        <Link to="/terms"   className="hover:text-white transition-colors">Terms</Link>
        <a href="mailto:ashokgumma20@gmail.com" className="hover:text-white transition-colors">Contact</a>
        <a href="https://github.com/Ashok-Gumma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
      </div>
      <p className="text-slate-700 text-xs font-black uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Anva. Reach for the skies.
      </p>
    </footer>
  </div>
);

export default LandingPage;

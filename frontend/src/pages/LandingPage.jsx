import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnvaLogo from "../components/AnvaLogo";
import ParticleBackground from "../components/ParticleBackground";
import {
  Users, Flame, BookOpen, Video, Code, Clock,
  ArrowRight, MessageSquare, Globe, Zap, Menu, X
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────── */
const stats = [
  { value: "1k+", label: "Active Learners" },
  { value: "20+", label: "Languages Covered" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "AI Tutor Support" },
];

const features = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Peer Exchange",
    desc: "Match and converse with native speakers from over 50 countries for authentic cultural exchange.",
    gradient: "from-blue-600 to-cyan-500",
    bg: "bg-blue-50/80 border-blue-100",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "24/7 AI Language Tutor",
    desc: "Instant grammar correction, interactive doubt sessions, and smart vocabulary feedback powered by AI.",
    gradient: "from-purple-600 to-pink-500",
    bg: "bg-purple-50/80 border-purple-100",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Live Video & Voice Calls",
    desc: "Crystal-clear 1-on-1 video calls integrated into chat channels for face-to-face fluency practice.",
    gradient: "from-orange-500 to-rose-500",
    bg: "bg-orange-50/80 border-orange-100",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Adaptive Study Decks",
    desc: "Spaced-repetition flashcards that track your progress and reinforce weak vocabulary automatically.",
    gradient: "from-pink-600 to-rose-500",
    bg: "bg-pink-50/80 border-pink-100",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Seamless Messaging",
    desc: "Stream-powered real-time chat with custom emoji reactions, media sharing, and instant pings.",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50/80 border-emerald-100",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Multilingual Code Studio",
    desc: "Built-in polyglot compiler supporting JavaScript, Python, C++, Java, and Go for developer learners.",
    gradient: "from-slate-700 to-slate-900",
    bg: "bg-slate-100/80 border-slate-200",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Smart Partner Matching",
    desc: "Instant recommendation engine that matches learners based on native language and learning goals.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50/80 border-amber-100",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Cross-Platform Sync",
    desc: "Your progress, active chats, AI sessions, and study decks stay synchronized across all devices.",
    gradient: "from-indigo-600 to-blue-600",
    bg: "bg-indigo-50/80 border-indigo-100",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Squads & Friends Network",
    desc: "Track online friends, manage friend requests, block unwanted users, and build your squad.",
    gradient: "from-teal-600 to-emerald-600",
    bg: "bg-teal-50/80 border-teal-100",
  },
];

const steps = [
  { 
    num: "01", 
    title: "Set Your Goals", 
    desc: "Sign up in seconds and choose your native language along with the target languages you want to master." 
  },
  { 
    num: "02", 
    title: "Connect & Match", 
    desc: "Browse online language partners ready for mutual peer practice and exchange." 
  },
  { 
    num: "03", 
    title: "Practice & Excel", 
    desc: "Chat in real-time, launch video calls, study with AI flashcards, and track your daily streaks." 
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = { 
  hidden: {}, 
  show: { transition: { staggerChildren: 0.1 } } 
};

/* ─── Component ─────────────────────────────────────────────────── */
const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
  <div className="landing-page-container min-h-screen bg-[#fafaf9] text-slate-900 overflow-x-hidden font-sans selection:bg-blue-100 selection:text-blue-900 relative z-10">
    <ParticleBackground />

    {/* ── Navbar Header ── */}
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-3.5 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-2xs transition-all duration-300">
      <Link to="/" className="flex items-center shrink-0">
        <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900">
          An<span className="font-curly font-bold ml-0.5">va</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden sm:flex items-center gap-8">
        <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
        <a href="#how" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">How it works</a>
        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors border-l border-slate-200 pl-8">Log in</Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/sign-up"
          className="hidden sm:flex items-center gap-2 bg-slate-900 text-white hover:bg-blue-600 transition-all px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:scale-[1.03] active:scale-[0.97]"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Mobile: Get Started CTA (compact) + Hamburger */}
        <Link
          to="/sign-up"
          className="sm:hidden flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
        >
          Get Started
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>

    {/* ── Mobile Navigation Drawer ── */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm sm:hidden"
          />
          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-[100] w-72 bg-white border-l border-slate-200 shadow-2xl flex flex-col sm:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center">
                <span className="font-bold text-xl text-slate-900">
                  An<span className="font-curly font-bold ml-0.5">va</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-5 space-y-2">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Features
              </a>
              <a
                href="#how"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                How It Works
              </a>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Log In
              </Link>
            </nav>

            <div className="p-5 border-t border-slate-200 space-y-3">
              <Link
                to="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-blue-600 transition-all px-6 py-3 rounded-full font-bold shadow-md text-sm"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all px-6 py-3 rounded-full font-bold text-sm"
              >
                Sign In
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>

    {/* ── Hero Section ── */}
    <section className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-32 sm:pt-40 pb-20 font-apple">
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-700 text-xs font-semibold shadow-2xs"
      >
        <Zap className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
        <span>Language & Tech Exchange</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 leading-snug max-w-xl mx-auto"
      >
        Master languages through{" "}
        <span className="font-curly text-3xl sm:text-4xl md:text-5xl text-blue-600 font-normal italic px-1">
          real conversations
        </span>
      </motion.h1>

      {/* Simple Quotation Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-white/90 border border-slate-200/70 shadow-2xs backdrop-blur-sm"
      >
        <p className="font-curly text-base sm:text-lg italic text-slate-700 leading-relaxed">
          “Language is the roadmap of a culture. It tells you where its people come from and where they are going.”
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link to="/sign-up" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-blue-600 transition-all px-6 py-3 rounded-full font-bold shadow-md text-sm group">
          Join Anva Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-all px-6 py-3 rounded-full font-bold shadow-2xs text-sm">
          Explore Features
        </a>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}
            className="flex flex-col items-center p-6 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 group"
          >
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform">{s.value}</span>
            <span className="text-xs text-slate-500 font-medium mt-1">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* ── Features Grid ── */}
    <section id="features" className="relative z-10 bg-slate-50/70 py-24 px-4 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Complete Feature Suite
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Everything You Need for Fluency
          </h2>
          <p className="text-slate-600 font-normal max-w-xl mx-auto text-base leading-relaxed">
            Combining authentic human connection with powerful AI tools for balanced, continuous growth.
          </p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}
              whileHover={{ y: -4 }}
              className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-start text-left"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} border flex items-center justify-center mb-5 shadow-2xs`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-br ${f.gradient}`}>
                  {f.icon}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── How it works ── */}
    <section id="how" className="relative z-10 bg-white py-24 px-4 border-t border-slate-200/60">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Quick Setup
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Start in 3 Easy Steps</h2>
          <p className="text-slate-600 font-normal max-w-lg mx-auto text-base">Get matched and start your first conversation in minutes.</p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((step) => (
            <motion.div key={step.num} variants={fadeUp}
              className="relative bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 shadow-xs hover:shadow-md hover:bg-white hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left"
            >
              <span className="text-xs font-bold text-blue-600 tracking-widest block mb-4 uppercase">{step.num}</span>
              <h3 className="font-bold text-slate-900 text-xl mb-3 tracking-tight">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Final Call to Action ── */}
    <section className="relative z-10 bg-slate-950 text-white py-28 px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight">Ready to Master Languages?</h2>
        <p className="text-slate-400 font-normal mb-10 text-lg max-w-lg mx-auto leading-relaxed">
          Join learners worldwide on Anva and build real connections while expanding your vocabulary.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/sign-up"
            className="group flex items-center gap-2.5 bg-white text-slate-900 hover:bg-blue-50 transition-all px-8 py-4 rounded-full font-bold shadow-xl hover:scale-[1.03] active:scale-[0.98] text-base"
          >
            Get Started Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login"
            className="flex items-center gap-2.5 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-all px-8 py-4 rounded-full font-bold text-base"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </section>

    {/* ── Footer ── */}
    <footer className="relative z-10 bg-slate-950 py-16 px-4 text-center border-t border-slate-900">
      <div className="flex items-center justify-center mb-6">
        <span className="text-white font-extrabold text-2xl tracking-tight">
          An<span className="font-curly font-bold ml-0.5">va</span>
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8 text-slate-400 font-medium text-xs">
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <a href="mailto:ashokgumma20@gmail.com" className="hover:text-white transition-colors">Contact</a>
        <a href="https://github.com/Ashok-Gumma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
      </div>
      <p className="text-slate-600 text-xs font-normal">
        © {new Date().getFullYear()} Anva. All rights reserved.
      </p>
    </footer>
  </div>
  );
};

export default LandingPage;


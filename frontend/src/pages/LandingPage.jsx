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
  { value: "12K+", label: "Learners" },
  { value: "50+",  label: "Languages" },
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
const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ─── Component ─────────────────────────────────────────────────── */
const LandingPage = () => (
  <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans" data-theme="light">
    <ParticleBackground />

    {/* ── Navbar ── */}
    <nav className="relative z-20 w-full px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group shrink-0">
        <AnvaLogo className="h-9 w-9 rounded-lg drop-shadow-sm group-hover:scale-105 transition-transform text-primary" />
        <span className="font-bold text-xl tracking-tight">Anva</span>
      </Link>

      <div className="hidden sm:flex items-center gap-6">
        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
        <a href="#how"      className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
        <Link to="/login"   className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Log in</Link>
      </div>

      <Link
        to="/sign-up"
        className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-700 transition-colors px-5 py-2 rounded-full text-sm font-semibold shadow-sm hover:scale-[1.03] active:scale-[0.97]"
      >
        Get Started Free <ArrowRight className="w-4 h-4" />
      </Link>
    </nav>

    {/* ── Hero ── */}
    <section className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16 sm:pt-24 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-slate-600 text-sm shadow-sm font-medium"
      >
        <Sparkles className="w-4 h-4 text-blue-500" />
        The modern language exchange platform
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl sm:text-7xl md:text-[5.5rem] font-semibold tracking-tight text-slate-900 mb-6 leading-[1.05] max-w-[60rem] mx-auto"
      >
        Learn Languages with{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          Real People
        </span>
        , Powered by AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
      >
        Chat, video call, and practice with native speakers. AI flashcards, grammar correction, and more — all in one place. Free forever.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link to="/sign-up" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-3.5 rounded-full font-semibold shadow-lg text-base">
          Start for Free <ArrowRight className="w-4 h-4" />
        </Link>
        <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-3.5 rounded-full font-semibold shadow-sm text-base">
          See all features
        </a>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fade}
            className="flex flex-col items-center p-5 rounded-2xl bg-white/80 backdrop-blur border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl font-bold text-slate-900">{s.value}</span>
            <span className="text-sm text-slate-500 font-medium mt-0.5">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* ── Features Grid ── */}
    <section id="features" className="relative z-10 bg-slate-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium shadow-sm mb-4">
            <Zap className="w-4 h-4 text-yellow-500" /> Everything you need in one place
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Everything you need for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 italic">liftoff</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg">
            Anva combines community, AI, and specialized tools to create the most effective language learning experience.
          </p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fade}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-br ${f.gradient}`}>
                  {f.icon}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── How it works ── */}
    <section id="how" className="relative z-10 bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium shadow-sm mb-4">
            <Clock className="w-4 h-4 text-blue-500" /> Up and running in minutes
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">Simple. Fast. Effective.</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">Three steps to start speaking fluently with real native speakers.</p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div key={step.num} variants={fade}
              className="relative bg-slate-50 border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 z-10" />
              )}
              <span className="text-5xl font-black text-slate-100 select-none leading-none block mb-4">{step.num}</span>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Final CTA ── */}
    <section className="relative z-10 bg-slate-900 text-white py-24 px-4 overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight">Ready to reach new heights?</h2>
        <p className="text-slate-400 font-medium mb-10 text-lg max-w-lg mx-auto">
          Join 12,000+ learners already using Anva to connect, practice, and grow — all for free.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/sign-up"
            className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 transition-all px-8 py-3.5 rounded-full font-bold shadow-lg hover:scale-[1.03] active:scale-[0.97] text-base"
          >
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login"
            className="flex items-center gap-2 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all px-8 py-3.5 rounded-full font-semibold text-base"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </section>

    {/* ── Footer ── */}
    <footer className="relative z-10 bg-slate-950 py-10 px-4 text-center border-t border-slate-800">
      <div className="flex items-center justify-center gap-2 mb-3">
        <AnvaLogo className="h-7 w-7 rounded-lg text-primary opacity-80" />
        <span className="text-slate-400 font-bold text-base">Anva</span>
      </div>
      <p className="text-slate-600 text-sm font-medium">
        © {new Date().getFullYear()} Anva. Fly high with every word.
      </p>
    </footer>
  </div>
);

export default LandingPage;

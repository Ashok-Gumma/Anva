import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ParticleBackground from "../components/ParticleBackground";
import AnvaBrandLogo from "../components/AnvaBrandLogo";
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  Database,
  Lock,
  BrainCircuit,
  UserCheck,
  Eye,
  Sparkles,
  Menu,
  X,
  CheckCircle2,
  Mail,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    num: "01",
    title: "Information We Collect",
    icon: Database,
    desc: "We collect only essential data needed to connect you with language peers and power your study workspace.",
    points: [
      "Profile details: name, email address, profile avatar, and target learning languages.",
      "Learning data: saved coding snippets, community posts, and flashcard practice decks.",
      "We never sell or commercialize your personal contact data to third parties.",
    ],
  },
  {
    num: "02",
    title: "Live Calls & Messaging Privacy",
    icon: Lock,
    desc: "Your 1-on-1 audio and video calls are established securely via peer-to-peer WebRTC encryption.",
    points: [
      "We do not record, tap, or eavesdrop on your private 1-on-1 voice or video sessions.",
      "Direct chat messages are encrypted and securely stored for multi-device sync.",
      "Screen sharing streams directly between call participants without recording.",
    ],
  },
  {
    num: "03",
    title: "AI Language Partner Data Usage",
    icon: BrainCircuit,
    desc: "Interactions with Anva AI assistant are processed strictly to provide real-time corrections and study guidance.",
    points: [
      "Conversations provide instant grammar feedback and conversational practice.",
      "Your private chats are never used to train public, open AI models.",
      "Math and algorithmic logic reasoning is processed ephemerally.",
    ],
  },
  {
    num: "04",
    title: "Data Protection & Infrastructure Security",
    icon: ShieldCheck,
    desc: "Enterprise-grade encryption and secure authentication protocols protect your account at all times.",
    points: [
      "TLS 1.3 encryption in transit and AES-256 encryption at rest for stored data.",
      "Clerk authentication integration with multi-factor support and secure tokens.",
      "Continuous vulnerability scanning and automated threat mitigation.",
    ],
  },
  {
    num: "05",
    title: "Your Rights & Full Data Portability",
    icon: UserCheck,
    desc: "You have complete sovereignty over your data with the right to access, export, or erase your account.",
    points: [
      "Export your saved notes, flashcards, and coding solutions at any time.",
      "One-click account deletion permanently purges personal data within 30 days.",
      "Full compliance with international GDPR and CCPA privacy standards.",
    ],
  },
  {
    num: "06",
    title: "Cookies & Minimal Tracking",
    icon: Eye,
    desc: "We use essential cookies strictly to keep your session active and remember your preferences.",
    points: [
      "Zero third-party advertising tracking or tracking pixels.",
      "Authentication cookies are HTTP-only and strictly scoped to Anva domains.",
      "You can manage cookie settings in your browser at any time without loss of core tools.",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const PrivacyPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      data-theme="light"
      className="landing-page-container min-h-screen bg-[#fafaf9] text-base-content font-sans antialiased relative z-10 selection:bg-primary selection:text-primary-content overflow-x-hidden"
    >
      {/* Interactive Constellation Particle Canvas Background */}
      <ParticleBackground />

      {/* Ambient Mesh Aura Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[450px] bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-violet-400/5 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -left-[15%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/10 via-blue-400/10 to-transparent blur-[110px] rounded-full" />
        <div className="absolute top-[60%] -right-[15%] w-[550px] h-[550px] bg-gradient-to-bl from-purple-400/10 via-pink-400/10 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* ── 1. TOP NAVIGATION (MATCHING LANDING PAGE) ── */}
      <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-xl border-b border-base-content/10 h-16 flex items-center shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <AnvaBrandLogo textSize="text-2xl" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-base-content/70">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/privacy" className="text-primary font-black">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="btn btn-ghost btn-sm text-xs font-black uppercase tracking-widest text-base-content/80 hover:bg-base-200"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary btn-sm text-xs font-black uppercase tracking-widest px-5 shadow-sm hover:scale-105 transition-transform"
            >
              Get Started <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-base-content/70 hover:bg-base-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-16 left-0 w-full border-b border-base-content/10 bg-base-100 px-6 py-5 space-y-3 shadow-xl"
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-base-content/80"
              >
                Home
              </Link>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-base-content/80"
              >
                Features
              </Link>
              <Link
                to="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-primary"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-base-content/80"
              >
                Terms of Service
              </Link>
              <div className="pt-3 border-t border-base-content/10 flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm text-xs font-bold w-1/2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm text-xs font-bold w-1/2"
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── 2. HERO SECTION ── */}
      <section className="relative z-10 pt-12 sm:pt-16 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-base-200/80 border border-base-content/10 text-xs font-bold text-base-content/80 shadow-2xs">
            <ShieldCheck className="size-3 text-primary animate-pulse" />
            <span>Data Transparency</span>
            <span className="opacity-40">•</span>
            <span className="text-primary">Updated March 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-base-content leading-tight">
            Privacy{" "}
            <span className="font-curly font-bold italic text-primary">
              Policy
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-base-content/70 max-w-xl mx-auto leading-relaxed">
            At Anva, we believe in radical transparency. Learn how we collect, protect, and handle your data across video calls, code sandboxes, and AI chats.
          </p>
        </motion.div>
      </section>

      {/* ── 3. PRIVACY SECTIONS (MATCHING LANDING PAGE PILLARS/CARDS) ── */}
      <section className="relative z-10 py-6 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-base-100/80 backdrop-blur-md rounded-3xl border border-base-content/10 p-6 sm:p-8 shadow-xs hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        Policy {section.num}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-base-content">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-base-content/70 mb-4 leading-relaxed">
                  {section.desc}
                </p>

                <div className="space-y-2 pt-3 border-t border-base-content/5">
                  {section.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-base-content/80">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Support Callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-base-100 rounded-3xl border border-base-content/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-base-content">
                Need to exercise your data rights?
              </h3>
              <p className="text-xs text-base-content/60">
                Contact our data protection team directly at{" "}
                <a href="mailto:ashokgumma20@gmail.com" className="text-primary font-bold hover:underline">
                  ashokgumma20@gmail.com
                </a>
              </p>
            </div>
          </div>
          <Link
            to="/terms"
            className="btn btn-ghost btn-sm text-xs font-black uppercase tracking-wider text-primary hover:bg-primary/10 shrink-0"
          >
            View Terms of Service <ChevronRight className="size-3.5" />
          </Link>
        </motion.div>
      </section>

      {/* ── 4. BOTTOM CTA BANNER (MATCHING LANDING PAGE) ── */}
      <section className="relative z-10 py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-neutral to-neutral-focus text-neutral-content rounded-[2.5rem] p-8 sm:p-12 shadow-2xl overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 size-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 size-48 bg-secondary/20 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Ready to start learning on{" "}
              <span className="font-curly font-bold italic text-primary">
                Anva?
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-content/80 leading-relaxed max-w-md mx-auto">
              Join thousands of students and developers mastering skills with live peers and AI.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="btn btn-primary btn-md px-8 rounded-full font-black uppercase tracking-wider text-xs shadow-lg hover:scale-105 transition-transform"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="btn btn-ghost btn-md px-8 rounded-full font-black uppercase tracking-wider text-xs text-white border border-white/20 hover:bg-white/10"
              >
                Sign In to Workspace
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 5. MINIMAL CLEAN FOOTER (MATCHING LANDING PAGE) ── */}
      <footer className="relative z-10 border-t border-base-content/10 py-10 px-4 sm:px-6 bg-base-100 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-base-content">
              An<span className="font-curly font-bold ml-0.5 text-primary">va</span>
            </span>
            <span>— Master Languages, Ace Placements, and Build Together.</span>
          </div>

          <div className="flex items-center gap-6 font-bold text-xs uppercase tracking-wider">
            <Link to="/privacy" className="text-primary font-black">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <a href="mailto:ashokgumma20@gmail.com" className="hover:text-primary transition-colors">
              Contact
            </a>
            <a
              href="https://github.com/Ashok-Gumma"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="text-[10px] text-base-content/40 mt-4">
          © {new Date().getFullYear()} Anva. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPage;

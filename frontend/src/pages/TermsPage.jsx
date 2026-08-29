import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ParticleBackground from "../components/ParticleBackground";
import AnvaBrandLogo from "../components/AnvaBrandLogo";
import {
  ArrowRight,
  Shield,
  FileText,
  Users,
  Lock,
  Star,
  BookOpen,
  Gavel,
  Zap,
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
    title: "Community Standards & Acceptable Use",
    icon: Users,
    desc: "Anva is built on mutual respect, learning, and collaboration. We maintain a zero-tolerance policy for harassment, hate speech, bullying, or abusive conduct.",
    points: [
      "No harassment, hate speech, discrimination, or abusive behavior toward any member.",
      "Zero tolerance for distributing malicious software, spam, or phishing attempts.",
      "Immediate account suspension or permanent ban for violating community guidelines.",
    ],
  },
  {
    num: "02",
    title: "Account Security & Credentials",
    icon: Lock,
    desc: "You are responsible for keeping your login credentials confidential and secure across all your devices.",
    points: [
      "Provide accurate email and profile information upon registration.",
      "Maintain the security of your password or connected OAuth accounts.",
      "Notify our team immediately if you suspect unauthorized account access.",
    ],
  },
  {
    num: "03",
    title: "Eligibility & Age Requirements",
    icon: Star,
    desc: "By creating an account, you confirm that you meet the minimum age requirements to use our collaborative tools.",
    points: [
      "Must be at least 13 years of age (or the minimum legal age in your jurisdiction).",
      "Users between 13 and 18 represent parental or guardian consent.",
      "Possess full legal capacity to enter into this binding agreement.",
    ],
  },
  {
    num: "04",
    title: "Intellectual Property & User Content",
    icon: BookOpen,
    desc: "You own the code and study notes you create on Anva, while Anva retains ownership of the platform software and brand.",
    points: [
      "Anva branding, UI designs, compiler engine, and logos remain our exclusive property.",
      "Code snippets, study notes, and flashcards you write belong entirely to you.",
      "Public feed posts grant Anva a license to display content to community peers.",
    ],
  },
  {
    num: "05",
    title: "Platform Availability & Cloud Sandboxes",
    icon: Zap,
    desc: "We strive for 99.9% uptime for calls, chats, and Monaco compiler sandboxes, provided on an 'as is' basis.",
    points: [
      "Cloud compiler and live calls are continuously monitored for optimal latency.",
      "Scheduled maintenance exceeding 30 minutes will be announced in advance.",
      "We reserve the right to modify or deprecate beta features with notice.",
    ],
  },
  {
    num: "06",
    title: "Account Termination & Fair Use",
    icon: Gavel,
    desc: "You may close your account at any time, and Anva reserves the right to terminate accounts that breach terms.",
    points: [
      "Voluntary account deletion is available in Settings at any time.",
      "Violations of terms, automated scraping, or malicious abuse result in immediate termination.",
      "Post-termination, data is handled strictly per our Privacy Policy.",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TermsPage = () => {
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
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-primary font-black">
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
                className="block text-xs font-black uppercase tracking-widest text-base-content/80"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-primary"
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
            <Sparkles className="size-3 text-primary animate-pulse" />
            <span>Legal Documentation</span>
            <span className="opacity-40">•</span>
            <span className="text-primary">Effective March 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-base-content leading-tight">
            Terms of{" "}
            <span className="font-curly font-bold italic text-primary">
              Service
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-base-content/70 max-w-xl mx-auto leading-relaxed">
            Welcome to Anva. Please review our platform terms and guidelines governing your access to our language peer network, live compiler, and AI features.
          </p>
        </motion.div>
      </section>

      {/* ── 3. TERMS SECTIONS (MATCHING LANDING PAGE PILLARS/CARDS) ── */}
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
                        Section {section.num}
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
                Have questions about our terms?
              </h3>
              <p className="text-xs text-base-content/60">
                Reach out to our compliance and legal team at{" "}
                <a href="mailto:ashokgumma20@gmail.com" className="text-primary font-bold hover:underline">
                  ashokgumma20@gmail.com
                </a>
              </p>
            </div>
          </div>
          <Link
            to="/privacy"
            className="btn btn-ghost btn-sm text-xs font-black uppercase tracking-wider text-primary hover:bg-primary/10 shrink-0"
          >
            View Privacy Policy <ChevronRight className="size-3.5" />
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
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-primary font-black">
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

export default TermsPage;

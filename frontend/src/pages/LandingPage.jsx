import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ParticleBackground from "../components/ParticleBackground";
import CompanyLogo from "../components/CompanyLogo";
import AnvaBrandLogo from "../components/AnvaBrandLogo";
import {
  Users,
  Video,
  Code,
  ArrowRight,
  MessageSquare,
  Globe,
  Menu,
  X,
  Target,
  Terminal,
  BookOpen,
  Timer,
  Check,
  ShieldCheck,
  Building2,
  Bot,
  ChevronDown,
  Sparkles,
  Play,
  CheckCircle2,
  Star,
  Flame,
  Zap,
  Layers,
  Laptop,
} from "lucide-react";

/* ─── Top Placement Companies ─────────────────────────────────────────────── */
const topCompanies = [
  { name: "Google", slug: "google", track: "Software & Cloud" },
  { name: "Microsoft", slug: "microsoft", track: "Systems & Cloud" },
  { name: "Amazon", slug: "amazon", track: "AWS & Backend" },
  { name: "Meta", slug: "meta", track: "AI & Fullstack" },
  { name: "TCS", slug: "tcs", track: "Tata Consultancy" },
  { name: "Infosys", slug: "infosys", track: "Digital & Tech" },
  { name: "Wipro", slug: "wipro", track: "IT & Services" },
  { name: "Accenture", slug: "accenture", track: "Strategy & Tech" },
  { name: "Cognizant", slug: "cognizant", track: "Digital Services" },
  { name: "Capgemini", slug: "capgemini", track: "Cloud & Consulting" },
  { name: "Deloitte", slug: "deloitte", track: "Tech Advisory" },
  { name: "IBM", slug: "ibm", track: "Enterprise Systems" },
  { name: "Oracle", slug: "oracle", track: "Database & Cloud" },
  { name: "Adobe", slug: "adobe", track: "Product Engineering" },
];

/* ─── Interactive Showcase Tabs ──────────────────────────────────────────── */
const showcaseTabs = [
  {
    id: "placement",
    label: "Placement Arena",
    icon: Target,
    badge: "Career Ready",
    title: "Company Placement & Coding Suite",
    desc: "Solve aptitude MCQs, practice live data structures in the Monaco editor, and simulate real company recruitment tests with instant scoring.",
    points: [
      "Company question banks: TCS, Infosys, Wipro, Google, Amazon, Microsoft",
      "Quantitative Aptitude, Logical Reasoning & Verbal practice with solutions",
      "Interactive live coding arena with automated testcase execution",
      "HR, Technical & Behavioral interview masterclass questions",
    ],
  },
  {
    id: "ai",
    label: "24/7 AI Tutor",
    icon: Bot,
    badge: "Intelligent Assistant",
    title: "Anva AI Grammar & Study Partner",
    desc: "Ask complex doubts anytime, get instant sentence grammar checks before sending messages, and understand math algorithms formatted with LaTeX.",
    points: [
      "Instant contextual problem solver with step-by-step reasoning",
      "Real-time AI grammar feedback and fluency suggestions",
      "Voice & audio responses for accent and pronunciation coaching",
      "LaTeX math rendering & algorithmic complexity breakdown",
    ],
  },
  {
    id: "compiler",
    label: "Code Studio",
    icon: Terminal,
    badge: "In-Browser IDE",
    title: "Multi-Language Cloud Compiler",
    desc: "Run JavaScript, Python, C++, Java, and Go instantly from your browser with custom STDIN input handling and real-time execution benchmarks.",
    points: [
      "Zero local installation — code on mobile, tablet, or desktop",
      "Monaco editor with syntax highlighting and auto-formatting",
      "Custom standard input & execution performance benchmarking",
      "Integrated Pomodoro study timer for uninterrupted deep work",
    ],
  },
  {
    id: "peers",
    label: "Peers & Video",
    icon: Users,
    badge: "Global Community",
    title: "1-on-1 Video Calls & EduFeed",
    desc: "Discover language partners globally, jump on 1-on-1 HD video calls, and share study notes, diagrams, and PDF guides directly into chat.",
    points: [
      "1-on-1 HD WebRTC audio and video calling with peer screen sharing",
      "Direct chat with Instagram-style embedded post sharing",
      "EduFeed: Community notes, study diagrams, and downloadable PDFs",
      "Real-time notifications, typing status, and friend requests",
    ],
  },
];

/* ─── Platform Pillars Grid ───────────────────────────────────────────────── */
const pillars = [
  {
    num: "01",
    title: "Company Placement Tracks",
    desc: "Curated modules matching actual recruitment patterns of TCS, Google, Amazon, Infosys, and Microsoft.",
    icon: Target,
    tag: "Placement",
  },
  {
    num: "02",
    title: "24/7 Anva AI Tutor",
    desc: "Instant grammar correction, conversational practice, and step-by-step mathematical reasoning.",
    icon: Bot,
    tag: "AI Assistant",
  },
  {
    num: "03",
    title: "In-Browser Code Studio",
    desc: "Compile JavaScript, Python, C++, Java, and Go with custom inputs and execution diagnostics.",
    icon: Terminal,
    tag: "Compiler",
  },
  {
    num: "04",
    title: "1-on-1 HD Video Calls",
    desc: "Face-to-face language fluency, pair programming, and mock interview practice powered by WebRTC.",
    icon: Video,
    tag: "Live Video",
  },
  {
    num: "05",
    title: "EduFeed & PDF Guides",
    desc: "Publish and access community study notes, high-res diagrams, and downloadable study manuals.",
    icon: BookOpen,
    tag: "Community",
  },
  {
    num: "06",
    title: "Instagram-Style Chat Sharing",
    desc: "Share educational posts directly into private chat channels as interactive, clickable post preview cards.",
    icon: MessageSquare,
    tag: "Real-Time Chat",
  },
];

/* ─── FAQ Items ──────────────────────────────────────────────────────────── */
const faqs = [
  {
    q: "What makes Anva different from traditional study platforms?",
    a: "Anva unifies three essential pillars into one seamless ecosystem: global peer-to-peer language exchange, 24/7 AI tutoring, and comprehensive campus placement preparation with live coding compilers.",
  },
  {
    q: "How does the Placement Hub prepare me for campus placements?",
    a: "It provides company-specific question sets (TCS, Infosys, Wipro, Google, Microsoft, Amazon), Quantitative Aptitude with step-by-step math explanations, a live coding arena with test cases, and HR & Technical interview preparation.",
  },
  {
    q: "Can I connect and practice speaking with real people?",
    a: "Yes! You can match with peers based on your target learning language, chat in real time with Instagram-style post sharing, and start 1-on-1 HD video calls right inside your browser.",
  },
  {
    q: "Is Anva free to use?",
    a: "Yes! Creating an account gives you full access to peer matching, AI assistant conversations, company placement question banks, the live compiler, and community study notes.",
  },
];

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("placement");
  const [openFaq, setOpenFaq] = useState(null);

  const currentTab = showcaseTabs.find((t) => t.id === activeTab) || showcaseTabs[0];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-base-content font-sans antialiased relative z-10 selection:bg-primary selection:text-primary-content overflow-x-hidden">
      {/* Interactive Particle Physics Canvas Background */}
      <ParticleBackground />

      {/* ── 1. CLEAN TOP NAVIGATION ── */}
      <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-xl border-b border-base-content/10 h-16 flex items-center shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <AnvaBrandLogo textSize="text-2xl" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-base-content/70">
            <a href="#showcase" className="hover:text-primary transition-colors">
              Platform
            </a>
            <a href="#companies" className="hover:text-primary transition-colors">
              Companies
            </a>
            <a href="#pillars" className="hover:text-primary transition-colors">
              Pillars
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </a>
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
              to="/sign-up"
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
              <a
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-base-content/80"
              >
                Platform
              </a>
              <a
                href="#companies"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-base-content/80"
              >
                Companies
              </a>
              <a
                href="#pillars"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-base-content/80"
              >
                Pillars
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-black uppercase tracking-widest text-base-content/80"
              >
                FAQ
              </a>
              <div className="pt-3 border-t border-base-content/10 flex flex-col gap-2">
                <Link
                  to="/sign-up"
                  className="btn btn-primary btn-sm text-xs font-black uppercase tracking-widest w-full"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm text-xs font-black uppercase tracking-widest w-full border border-base-content/15"
                >
                  Log In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── 2. HERO SECTION ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 text-center">
        {/* Hero Title (Decreased Size) */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-4xl md:text-4.5xl font-extrabold tracking-tight text-base-content leading-[1.18] mb-3 max-w-2xl mx-auto"
        >
          Where Global Fluency Meets{" "}
          <span className="font-curly font-bold italic text-primary">
            Technical Mastery.
          </span>
        </motion.h1>

        {/* Hero Subtitle (Decreased Size) */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xs sm:text-sm text-base-content/65 max-w-lg mx-auto leading-relaxed mb-6 font-medium"
        >
          Anva unites native language exchange, 24/7 AI tutoring, company placement prep, and in-browser coding into one unified playground for ambitious learners worldwide.
        </motion.p>

        {/* Hero CTAs (Decreased Size) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
        >
          <Link
            to="/sign-up"
            className="w-full sm:w-auto btn btn-primary btn-sm px-6 rounded-full font-black uppercase tracking-wider text-[11px] shadow-sm hover:scale-105 transition-transform"
          >
            Start Your Journey Free <ArrowRight className="size-3.5 ml-1" />
          </Link>
          <a
            href="#showcase"
            className="w-full sm:w-auto btn btn-ghost btn-sm px-6 rounded-full font-bold text-[11px] uppercase tracking-wider border border-base-content/15 bg-base-100 hover:bg-base-200"
          >
            <Target className="size-3.5 text-primary mr-1" /> Explore Platform
          </a>
        </motion.div>

        {/* Live Social Proof Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-base-content/50"
        >
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            1,200+ Learners Online
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-500 font-black">
            {"★".repeat(5)} 4.9/5 Rating
          </span>
          <span>•</span>
          <span>20+ Placement Tracks</span>
        </motion.div>
      </section>

      {/* ── 3. INTERACTIVE LIVE PRODUCT SHOWCASE DECK ── */}
      <section id="showcase" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-[2.5rem] bg-base-100 border border-base-content/10 shadow-2xl overflow-hidden text-left"
        >
          {/* Mockup macOS Window Top Bar */}
          <div className="px-6 py-4 bg-base-200/50 border-b border-base-content/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-rose-400" />
              <div className="size-3 rounded-full bg-amber-400" />
              <div className="size-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-[11px] font-mono font-bold text-base-content/40 hidden sm:inline">
                https://anva.app/workspace
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1 bg-base-100 p-1 rounded-full border border-base-content/10">
              {showcaseTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-content shadow-xs"
                        : "text-base-content/60 hover:text-base-content hover:bg-base-200/50"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Interactive Tab Content Preview */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
                <Sparkles className="size-3" /> {currentTab.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                {currentTab.title}
              </h3>

              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed font-medium">
                {currentTab.desc}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentTab.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-base-content/85">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  to="/sign-up"
                  className="btn btn-primary btn-sm px-5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm"
                >
                  Try This Feature <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Visual Feature Card Preview Box */}
            <div className="lg:col-span-6 rounded-2xl bg-base-200/40 p-5 sm:p-6 border border-base-content/10 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-base-content/10 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-base-content/50">
                  Live Preview Engine
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Active Ready
                </span>
              </div>

              {activeTab === "placement" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-base-100 rounded-xl border border-base-content/10 shadow-xs">
                    <p className="font-bold text-base-content">TCS National Qualifier Track (Aptitude &amp; Logic)</p>
                    <p className="text-base-content/60 text-[11px] mt-0.5">MCQ 12: Probability &amp; Time Complexity Analysis</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-primary">
                      <span>Option B: 94% Solved Correctly</span>
                      <span className="text-emerald-600">Verified Solution</span>
                    </div>
                  </div>
                  <div className="p-3 bg-base-100 rounded-xl border border-base-content/10 flex items-center justify-between">
                    <span className="font-bold">Live Coding Sandbox: Two Sum (Optimal)</span>
                    <span className="badge badge-primary badge-sm font-black">Passed (3/3)</span>
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-base-100 rounded-xl border border-base-content/10">
                    <p className="text-base-content/50 text-[10px] font-bold uppercase">Learner Query</p>
                    <p className="font-medium text-base-content">"Can you explain QuickSort recursion with LaTeX and check my grammar?"</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 space-y-1">
                    <p className="text-primary text-[10px] font-black uppercase flex items-center gap-1">
                      <Bot className="size-3" /> Anva AI Response
                    </p>
                    <p className="text-base-content/85 text-[11px]">
                      "Grammar is 100% clear. In QuickSort, time complexity is $O(n \log n)$ on average using divide-and-conquer partition."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "compiler" && (
                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-slate-400 text-[10px]"># Python 3.12 Live Execution</p>
                    <p>def solve(arr): return sorted([x**2 for x in arr])</p>
                    <p className="text-white">print(solve([-4, -1, 0, 3, 10]))</p>
                  </div>
                  <div className="p-2.5 bg-base-100 rounded-xl border border-base-content/10 flex items-center justify-between text-xs font-sans">
                    <span className="text-base-content/60 font-bold text-[10px]">OUTPUT: [0, 1, 9, 16, 100]</span>
                    <span className="text-emerald-600 font-bold text-[10px]">Runtime: 14ms</span>
                  </div>
                </div>
              )}

              {activeTab === "peers" && (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-base-100 rounded-xl border border-base-content/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                        S
                      </div>
                      <div>
                        <p className="font-bold leading-none">Sarah Jenkins (Tokyo)</p>
                        <p className="text-[10px] text-base-content/50 mt-0.5">Speaking English • Learning Japanese</p>
                      </div>
                    </div>
                    <span className="badge badge-success badge-sm font-black text-[9px]">1-on-1 HD</span>
                  </div>
                  <div className="p-2.5 bg-base-100 rounded-xl border border-base-content/10 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 font-bold text-primary">
                      <MessageSquare className="size-3" /> Shared Study Guide: Dynamic Programming.pdf
                    </span>
                    <span className="text-base-content/40 text-[9px] font-black">INSTAGRAM CARD</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 4. TARGET RECRUITERS & COMPANIES (CLEAN MODERN GRID) ── */}
      <section id="companies" className="relative z-10 border-y border-base-content/10 bg-base-200/40 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-base-100 text-base-content text-xs font-bold mb-3 uppercase tracking-wider border border-base-content/10 shadow-2xs">
            <Building2 className="size-3.5 text-primary" /> Target Top Employers
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight mb-2">
            Company-Specific Placement Modules
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 max-w-xl mx-auto mb-10 font-medium">
            Practice actual recruitment rounds, coding challenges, and interview patterns for leading tech innovators.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {topCompanies.map((comp) => (
              <motion.div
                key={comp.name}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-3.5 rounded-2xl bg-base-100 border border-base-content/10 hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center shadow-xs cursor-default"
              >
                <div className="size-9 mb-2 flex items-center justify-center">
                  <CompanyLogo slug={comp.slug} name={comp.name} size="xs" />
                </div>
                <p className="text-xs font-bold text-base-content leading-tight">
                  {comp.name}
                </p>
                <p className="text-[9px] text-base-content/50 font-medium mt-0.5 truncate max-w-full">
                  {comp.track}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CORE PILLARS GRID ── */}
      <section id="pillars" className="relative z-10 py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 uppercase tracking-wider border border-primary/20">
            <Layers className="size-3.5" /> Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
            Six Foundational Pillars of{" "}
            <span className="font-curly font-bold italic text-primary">
              Anva
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.num}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-7 rounded-[2rem] bg-base-100 border border-base-content/10 hover:border-primary/30 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="size-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-xs">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-xs font-mono font-black text-base-content/30">
                      {p.num}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-base-content mb-2 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs text-base-content/70 leading-relaxed font-medium">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-base-content/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {p.tag}
                  </span>
                  <Link to="/sign-up" className="text-xs font-bold text-base-content/80 hover:text-primary transition-colors flex items-center gap-1">
                    Explore <ArrowRight className="size-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 6. INSPIRATIONAL MOTIVATIONAL QUOTATION BANNER ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-base-100 to-base-200/80 border border-base-content/10 shadow-xl text-center space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
            <Sparkles className="size-4" /> The Anva Philosophy
          </div>
          <p className="font-curly text-lg sm:text-2xl italic text-base-content font-medium leading-relaxed max-w-2xl mx-auto">
            “The limits of your language are the limits of your world — and the code you write builds its future.”
          </p>
          <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest pt-2">
            Master Languages • Crack Tech Placements • Build Together
          </p>
        </motion.div>
      </section>

      {/* ── 7. FREQUENTLY ASKED QUESTIONS ── */}
      <section id="faq" className="relative z-10 py-16 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-1">
            Common Inquiries
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="p-5 rounded-2xl border border-base-content/10 bg-base-100 hover:border-base-content/20 transition-all cursor-pointer select-none shadow-xs"
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-xs sm:text-sm font-bold text-base-content">
                    {faq.q}
                  </h4>
                  <ChevronDown
                    className={`size-4 text-base-content/40 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-xs sm:text-sm text-base-content/70 leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 8. FINAL HIGH-CONVERTING CALL TO ACTION ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-neutral to-neutral-focus text-neutral-content rounded-[2.5rem] p-8 sm:p-14 shadow-2xl overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 size-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 size-48 bg-secondary/20 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to Master Languages &amp;{" "}
              <span className="font-curly font-bold italic text-primary">
                Ace Your Career?
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-content/80 leading-relaxed max-w-md mx-auto">
              Join thousands of students and job seekers on Anva. Practice placements, connect with peers, and study with 24/7 AI.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/sign-up"
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

      {/* ── 9. MINIMAL CLEAN FOOTER ── */}
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

export default LandingPage;

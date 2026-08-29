import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import {
  Target,
  Search,
  Sparkles,
  Building2,
  CheckCircle2,
  TrendingUp,
  Award,
  BookOpen,
  Code2,
  Brain,
  MessageSquare,
  Flame,
  ArrowRight,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cpu,
  Clock,
  BarChart3,
} from "lucide-react";
import { getPlacementCompanies, getPlacementUserProgress } from "../../lib/placementApi";
import { motion } from "framer-motion";
import CompanyLogo from "../../components/CompanyLogo";

const TIERS = [
  { id: "all", label: "All Companies" },
  { id: "popular", label: "🔥 Popular" },
  { id: "FAANG / Top Product", label: "FAANG / Top Product" },
  { id: "Product Giant", label: "Product Giants" },
  { id: "Fintech & Startups", label: "Fintech & Banking" },
  { id: "IT & Consulting Leader", label: "IT & Consulting" },
];

const MASTER_LIBRARIES = [
  {
    id: "aptitude",
    title: "Master Aptitude & Quant",
    subtitle: "300+ Authentic Quantitative & Logical Reasoning Questions",
    description: "Time & Work, Probability, Number Series, Cryptarithmetic, Syllogisms & Puzzles.",
    icon: Brain,
    path: "/placement/all/aptitude",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
    badgeColor: "bg-amber-500/10 text-amber-500",
    iconColor: "text-amber-500",
    count: "300+ Qs",
  },
  {
    id: "coding",
    title: "Master Coding Practice",
    subtitle: "200+ LeetCode-Style Multi-Language Algorithmic Problems",
    description: "Arrays, Two Pointers, Sliding Window, Monotonic Deque, Dynamic Programming, Graphs & Trees.",
    icon: Code2,
    path: "/placement/all/coding",
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    badgeColor: "bg-blue-500/10 text-blue-500",
    iconColor: "text-blue-500",
    count: "200+ Problems",
  },
  {
    id: "technical",
    title: "Master Core CS Technical",
    subtitle: "250+ Operating Systems, DBMS, Networks & OOP MCQs",
    description: "B+ Tree Indexing, MESI Protocol, Virtual Memory, ACID, TCP/IP & Concurrency.",
    icon: Cpu,
    path: "/placement/all/technical",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    badgeColor: "bg-emerald-500/10 text-emerald-500",
    iconColor: "text-emerald-500",
    count: "250+ Qs",
  },
  {
    id: "english",
    title: "Master Verbal & English",
    subtitle: "200+ Reading Comprehension, Grammar & Para Jumbles",
    description: "Sentence Correction, Critical Reasoning, Idioms, Contextual Vocabulary & Cloze Tests.",
    icon: BookOpen,
    path: "/placement/all/english",
    color: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/30",
    badgeColor: "bg-purple-500/10 text-purple-500",
    iconColor: "text-purple-500",
    count: "200+ Qs",
  },
  {
    id: "interview",
    title: "Master Interview Prep",
    subtitle: "150+ Technical & STAR Behavioral Masterclasses",
    description: "System Design, Resume Defense, Amazon Leadership Principles & HR Scenarios.",
    icon: MessageSquare,
    path: "/placement/all/interview",
    color: "from-rose-500/20 to-red-500/10",
    border: "border-rose-500/30",
    badgeColor: "bg-rose-500/10 text-rose-500",
    iconColor: "text-rose-500",
    count: "150+ Frameworks",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const PlacementLandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");

  const { data: companiesData, isLoading: loadingCompanies } = useQuery({
    queryKey: ["placementCompanies"],
    queryFn: getPlacementCompanies,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const { data: progressData } = useQuery({
    queryKey: ["placementUserProgress"],
    queryFn: getPlacementUserProgress,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const companies = companiesData?.companies || [];

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.tier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier =
        selectedTier === "all" ||
        (selectedTier === "popular" && company.popular) ||
        company.tier === selectedTier;

      return matchesSearch && matchesTier;
    });
  }, [companies, searchQuery, selectedTier]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-3 sm:p-6 lg:p-8 font-sans text-base-content">
      <motion.div
        className="container mx-auto max-w-[1400px] space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ── 1. HERO BANNER ── */}
        <motion.div
          variants={itemVariants}
          className="relative bg-base-100 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-base-content/10 overflow-hidden shadow-xl"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-secondary/10 blur-[70px] pointer-events-none" />

          <div className="relative z-10 space-y-5 max-w-3xl">
            {/* Title & Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-black uppercase tracking-widest text-primary">
                <Target className="size-4 animate-pulse" />
                Anva Placement Hub
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Master Campus &amp; Off-Campus <br />
                <span className="font-curly italic text-primary">Placements With Precision.</span>
              </h1>
              <p className="text-sm sm:text-base text-base-content/70 font-medium leading-relaxed">
                The complete quality preparation hub for ambitious students: Practice universal master question banks, tackle authentic company-specific hiring rounds, run code in our sandboxed LeetCode IDE, and ace STAR behavioral interviews.
              </p>
            </div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: "5 Master Libraries", icon: Layers },
                { label: "22+ Company Tracks", icon: Building2 },
                { label: "Multi-Language IDE (C++, Java, Python, JS)", icon: Code2 },
                { label: "Real Timed Mock Tests", icon: ShieldCheck },
                { label: "STAR Interview Frameworks", icon: MessageSquare },
              ].map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-base-200/80 border border-base-content/5 rounded-xl text-xs font-bold text-base-content/80 shadow-xs"
                >
                  <item.icon className="size-3.5 text-primary" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 2. DEDICATED MASTER PRACTICE LIBRARIES ── */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Layers className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-base-content flex items-center gap-2">
                  Universal Master Practice Libraries
                  <span className="badge badge-accent badge-sm font-black text-[10px] uppercase">
                    Practice By Category
                  </span>
                </h2>
                <p className="text-xs text-base-content/60 font-medium">
                  Comprehensive topic-wise practice modules with 1,100+ vetted questions across all domains
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {MASTER_LIBRARIES.map((lib) => {
              const Icon = lib.icon;
              return (
                <Link
                  key={lib.id}
                  to={lib.path}
                  className={`bg-base-100 p-5 rounded-3xl border ${lib.border} hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-2xl bg-base-200/80 ${lib.iconColor}`}>
                        <Icon className="size-5" />
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider ${lib.badgeColor}`}>
                        {lib.count}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-sm text-base-content group-hover:text-primary transition-colors">
                        {lib.title}
                      </h3>
                      <p className="text-[11px] text-base-content/60 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {lib.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-base-content/5 flex items-center justify-between text-xs font-black text-primary">
                    <span>Open Library</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ── 3. SEARCH & FILTER CONTROLS ── */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search company (Google, Amazon, TCS, Cisco, Oracle...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-base-100 border border-base-content/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 shadow-sm transition-all placeholder:text-base-content/40"
              />
            </div>

            {/* Tier Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 custom-scrollbar">
              {TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                    selectedTier === tier.id
                      ? "bg-primary text-primary-content border-primary shadow-md scale-102"
                      : "bg-base-100 text-base-content/70 hover:bg-base-200 border-base-content/10"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 4. COMPANY CARDS GRID ── */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              Company-Wise Preparation Tracks
              <span className="badge badge-sm font-extrabold bg-base-300 text-base-content/70">
                {filteredCompanies.length} Tracks
              </span>
            </h2>
          </div>

          {loadingCompanies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-base-100 rounded-3xl p-6 border border-base-content/10 animate-pulse space-y-4 h-64">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-base-300" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-base-300 rounded w-1/2" />
                      <div className="h-3 bg-base-300 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-10 bg-base-300 rounded-xl" />
                  <div className="h-10 bg-base-300 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-content/10 space-y-3">
              <Building2 className="size-12 mx-auto text-base-content/30" />
              <h3 className="font-extrabold text-base">No companies found</h3>
              <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                No matching company track found for "{searchQuery}". Try a different keyword or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTier("all");
                }}
                className="btn btn-primary btn-sm rounded-xl font-bold mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredCompanies.map((company) => {
                return (
                  <div
                    key={company._id || company.slug}
                    className="bg-base-100 rounded-3xl border border-base-content/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top gradient glow on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-4">
                      {/* Company Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Logo */}
                          <CompanyLogo
                            slug={company.slug}
                            name={company.name}
                            logoUrl={company.logo}
                            size="md"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-lg text-base-content truncate group-hover:text-primary transition-colors">
                                {company.name}
                              </h3>
                              {company.popular && (
                                <span className="badge badge-xs bg-amber-500/10 text-amber-600 border-amber-500/20 font-black uppercase text-[8px]">
                                  Hot
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-base-content/50 block truncate">
                              {company.tier}
                            </span>
                          </div>
                        </div>

                        {/* Package / Level badge */}
                        <span className="text-[10px] font-black px-2.5 py-1 bg-base-200 rounded-lg text-base-content/70 border border-base-content/5 shrink-0">
                          {company.stats?.avgPackage || "12-25 LPA"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                        {company.description}
                      </p>

                      {/* Category Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {["Aptitude", "English", "Technical", "Coding", "Interview"].map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-base-200/70 text-base-content/70 border border-base-content/5"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Company Stats Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-base-content/5 text-xs text-base-content/60 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="badge badge-sm font-bold bg-base-200 text-[10px] text-base-content/70">
                            {company.stats?.difficulty || "Medium"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold">
                          <span>{company.stats?.totalQuestions || 50}+ Questions</span>
                          <span className="text-base-content/30">•</span>
                          <span className="text-primary font-black">{company.stats?.totalCoding || 15} Coding</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 mt-2">
                      <Link
                        to={`/placement/${company.slug}`}
                        className="btn btn-primary w-full rounded-2xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg"
                      >
                        <span>Start Preparation</span>
                        <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlacementLandingPage;

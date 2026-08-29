import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import {
  Brain,
  Code2,
  Cpu,
  BookOpen,
  MessageSquare,
  Play,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Target,
  Zap,
} from "lucide-react";
import { getCompanyPlacementDetails } from "../../lib/placementApi";
import { motion } from "framer-motion";
import CompanyLogo from "../../components/CompanyLogo";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// Map each category key to its UI styling and route
const CATEGORY_META = {
  aptitude: {
    title: "Quantitative & Logical Aptitude",
    desc: "Numerical ability, logical puzzles, probability, time & work, and cognitive deduction.",
    icon: Brain,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20 hover:border-amber-500/40",
    tag: "Aptitude",
    tagClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  coding: {
    title: "Hands-On Algorithmic Coding",
    desc: "LeetCode-style multi-language IDE with sandboxed execution in C++, Java, Python & JavaScript.",
    icon: Code2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20 hover:border-blue-500/40",
    tag: "Coding",
    tagClass: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  technical: {
    title: "Core CS Technical MCQs",
    desc: "Operating Systems, DBMS & SQL, Computer Networks, OOP concepts & pseudocode questions.",
    icon: Cpu,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    tag: "Core CS",
    tagClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  english: {
    title: "Verbal & Communication Assessment",
    desc: "Reading comprehension, sentence correction, critical reasoning, and Versant spoken English.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20 hover:border-purple-500/40",
    tag: "Verbal",
    tagClass: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  interview: {
    title: "Technical & HR Interview Masterclass",
    desc: "Resume walkthroughs, system design, STAR behavioral frameworks & situational questions.",
    icon: MessageSquare,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20 hover:border-rose-500/40",
    tag: "Interview",
    tagClass: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
};

const CompanyDashboardPage = () => {
  const { companyId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["companyPlacementDetails", companyId],
    queryFn: () => getCompanyPlacementDetails(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-base-content/60">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">
            Loading Company Track...
          </span>
        </div>
      </div>
    );
  }

  if (isError || !data?.company) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="bg-base-100 rounded-3xl p-8 max-w-md border border-base-content/10 text-center space-y-4 shadow-xl">
          <Target className="size-12 mx-auto text-rose-500" />
          <h2 className="text-lg font-black">Company Track Not Found</h2>
          <p className="text-xs text-base-content/60">
            We could not find the placement track for "{companyId}".
          </p>
          <Link
            to="/placement"
            className="btn btn-primary btn-sm rounded-xl font-bold uppercase text-xs"
          >
            Browse All Companies
          </Link>
        </div>
      </div>
    );
  }

  const { company, readiness } = data;
  const categories = readiness?.categories || {
    aptitude: { percent: 0, solved: 0, total: 0 },
    english: { percent: 0, solved: 0, total: 0 },
    technical: { percent: 0, solved: 0, total: 0 },
    coding: { percent: 0, solved: 0, total: 0 },
    interview: { percent: 0, solved: 0, total: 0 },
  };

  // Build the 5 core preparation modules for this company
  const coreModules = [
    {
      id: "aptitude",
      title: `${company.name} Aptitude & Quant`,
      desc: `Authentic quantitative, numerical ability and logical reasoning test patterns for ${company.name}.`,
      icon: Brain,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20 hover:border-amber-500/40",
      link: `/placement/${company.slug}/aptitude`,
      stats: categories.aptitude,
    },
    {
      id: "coding",
      title: `${company.name} Coding & DSA IDE`,
      desc: `Solve actual OA coding problems in our sandboxed LeetCode IDE with test case validation.`,
      icon: Code2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20 hover:border-blue-500/40",
      link: `/placement/${company.slug}/coding`,
      stats: categories.coding,
    },
    {
      id: "technical",
      title: `${company.name} Core CS Technical`,
      desc: `Operating Systems, DBMS & SQL, Networks, and OOP MCQs tailored to ${company.name}'s test syllabus.`,
      icon: Cpu,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      link: `/placement/${company.slug}/technical`,
      stats: categories.technical,
    },
    {
      id: "english",
      title: `${company.name} Verbal & Communication`,
      desc: `Grammar, reading comprehension, critical reasoning & AI Versant spoken English prep.`,
      icon: BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20 hover:border-purple-500/40",
      link: `/placement/${company.slug}/english`,
      stats: categories.english,
    },
    {
      id: "interview",
      title: `${company.name} Interview Masterclass`,
      desc: `Authentic interview questions, system architecture blueprints, and STAR behavioral frameworks.`,
      icon: MessageSquare,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20 hover:border-rose-500/40",
      link: `/placement/${company.slug}/interview`,
      stats: categories.interview,
    },
  ];

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-3 sm:p-6 lg:p-8 font-sans text-base-content">
      <motion.div
        className="container mx-auto max-w-[1400px] space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ── BREADCRUMB & BACK LINK ── */}
        <div className="flex items-center justify-between">
          <Link
            to="/placement"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-base-content/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>All Companies</span>
          </Link>
          <span className="badge badge-primary font-black text-[10px] tracking-wider uppercase">
            {company.tier}
          </span>
        </div>

        {/* ── 1. COMPANY HEADER & OVERVIEW ── */}
        <motion.div
          variants={itemVariants}
          className="relative bg-base-100 p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-base-content/10 overflow-hidden shadow-xl"
        >
          {/* Ambient Blur */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Company Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-4">
                <CompanyLogo
                  slug={company.slug}
                  name={company.name}
                  logoUrl={company.logo}
                  size="lg"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{company.name}</h1>
                    <span className="badge badge-primary font-extrabold text-[10px] uppercase">Track</span>
                  </div>
                  <p className="text-xs sm:text-sm text-base-content/60 font-medium mt-1">
                    Placement &amp; OA Preparation Hub • Avg CTC: <span className="font-bold text-primary">{company.stats?.avgPackage || "12-25 LPA"}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed font-medium max-w-2xl">
                {company.description}
              </p>

              {/* Roles */}
              {company.hiringRoles?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-black uppercase text-base-content/40 mr-1">
                    Roles:
                  </span>
                  {company.hiringRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-base-200 border border-base-content/5 text-base-content/70"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action / Mock OA Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 p-6 rounded-2xl sm:rounded-3xl border border-primary/20 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="size-3" />
                  Full Simulation
                </div>
                <h3 className="font-black text-base sm:text-lg text-base-content">
                  {company.name} Mock OA Test
                </h3>
                <p className="text-[11px] text-base-content/60 font-medium">
                  Timed assessment with Aptitude, English, Technical MCQs &amp; 2 Coding Problems.
                </p>
              </div>

              <Link
                to={`/placement/${company.slug}/mock-test`}
                className="btn btn-primary w-full rounded-2xl font-black uppercase text-xs tracking-wider gap-2 shadow-md hover:scale-102 transition-transform"
              >
                <Play className="size-3.5 fill-current" />
                Start Mock Test
              </Link>
            </div>
          </div>

          {/* Hiring Assessment Journey (Authentic Rounds with Correct Category Routing) */}
          {company.rounds?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-base-content/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                  Hiring Assessment Journey
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {company.rounds.length} Stages
                </span>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(company.rounds.length, 5)} gap-3`}>
                {company.rounds.map((round, idx) => {
                  const catKey = round.category || "technical";
                  const meta = CATEGORY_META[catKey] || CATEGORY_META.technical;
                  const practiceLink = `/placement/${company.slug}/${catKey}`;

                  return (
                    <Link
                      key={idx}
                      to={practiceLink}
                      className="p-3.5 bg-base-200/60 hover:bg-base-200 rounded-2xl border border-base-content/10 hover:border-primary/40 space-y-1.5 relative transition-all duration-200 group flex flex-col justify-between shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-black text-primary group-hover:underline">Stage {idx + 1}</span>
                          <span className="text-base-content/50 font-semibold">{round.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-extrabold text-xs text-base-content leading-snug group-hover:text-primary transition-colors">
                            {round.name}
                          </p>
                        </div>
                        <p className="text-[10px] text-base-content/70 line-clamp-2 leading-tight">
                          {round.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-base-content/5 mt-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${meta.tagClass}`}>
                          {meta.tag}
                        </span>
                        <span className="text-[10px] font-bold text-primary flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Practice →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── 2. PREPARATION MODULES (5 Dedicated Pillars) ── */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {company?.name} Preparation Tracks &amp; Modules
              </h2>
              <p className="text-xs text-base-content/60 font-medium">
                Practice topic-wise questions specifically asked in {company?.name}'s recruitment rounds
              </p>
            </div>
            <span className="text-xs text-base-content/60 font-semibold">5 Core Modules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {coreModules.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className={`bg-base-100 rounded-3xl border ${card.border} hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between space-y-3 group relative overflow-hidden`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`size-10 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}>
                        <Icon className="size-5" />
                      </div>
                      <span className="badge badge-sm font-extrabold bg-base-200 text-[10px] text-base-content/70">
                        {card.stats?.solved || 0}/{card.stats?.total || 0} Solved
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-sm text-base-content group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-base-content/60 line-clamp-2 leading-relaxed mt-1">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-base-content/5">
                    <Link
                      to={card.link}
                      className="btn btn-primary btn-sm w-full rounded-xl font-bold uppercase text-[11px] tracking-wider flex items-center justify-between group/btn shadow-xs"
                    >
                      <span>Practice Now</span>
                      <ChevronRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompanyDashboardPage;

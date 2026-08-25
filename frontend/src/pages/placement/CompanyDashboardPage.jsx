import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Brain,
  BookOpen,
  Code2,
  Layers,
  MessageSquare,
  Target,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
  Play,
  Flame,
  Lightbulb,
  ChevronRight,
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

const CompanyDashboardPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["companyPlacementDetails", companyId],
    queryFn: () => getCompanyPlacementDetails(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-base-content/60">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">Loading Company Track...</span>
        </div>
      </div>
    );
  }

  if (isError || !data?.company) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="bg-base-100 p-8 rounded-3xl border border-base-content/10 text-center space-y-4 max-w-md">
          <AlertCircle className="size-12 text-error mx-auto" />
          <h2 className="text-lg font-black">Company Not Found</h2>
          <p className="text-xs text-base-content/60">
            We couldn't locate the preparation track for "{companyId}".
          </p>
          <Link to="/placement" className="btn btn-primary btn-sm rounded-xl font-bold">
            Back to Placement Hub
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

  const categoryCards = [
    {
      id: "aptitude",
      title: "Quantitative & Logic",
      desc: "Practice percentages, profit & loss, speed & distance, time & work, probability, and analytical reasoning.",
      icon: Brain,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/30",
      link: `/placement/${company.slug}/aptitude`,
      stats: categories.aptitude,
    },
    {
      id: "english",
      title: "Verbal & English",
      desc: "Master grammar rules, sentence correction, reading comprehension, vocabulary, and para jumbles.",
      icon: BookOpen,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/30",
      link: `/placement/${company.slug}/english`,
      stats: categories.english,
    },
    {
      id: "technical",
      title: "Core CS Fundamentals",
      desc: "Operating Systems, DBMS, SQL, Computer Networks, and Object-Oriented Programming MCQs.",
      icon: Layers,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/30",
      link: `/placement/${company.slug}/technical`,
      stats: categories.technical,
    },
    {
      id: "coding",
      title: "LeetCode-Style Coding",
      desc: "Top company-tagged algorithmic problems with Monaco editor, test case runner, hints & multi-language solutions.",
      icon: Code2,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/30",
      link: `/placement/${company.slug}/coding`,
      stats: categories.coding,
    },
    {
      id: "interview",
      title: "Interview Masterclass",
      desc: "Technical interview deep-dives, STAR-method HR questions, and project defense guidance with sample answers.",
      icon: MessageSquare,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/30",
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
                    Placement & OA Preparation Hub
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
                  Timed assessment with Aptitude, English, Technical MCQs & 2 Coding Problems.
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

          {/* Hiring Rounds Roadmap */}
          {company.rounds?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-base-content/10 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                Hiring Assessment Process
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {company.rounds.map((round, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-base-200/50 rounded-2xl border border-base-content/5 space-y-1 relative"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-black text-primary">Round {idx + 1}</span>
                      <span className="text-base-content/40 font-semibold">{round.duration}</span>
                    </div>
                    <p className="font-bold text-xs text-base-content leading-snug">{round.name}</p>
                    <p className="text-[10px] text-base-content/60 line-clamp-2 leading-tight">
                      {round.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── 2. PREPARATION CATEGORY CARDS ── */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight">Select Preparation Category</h2>
            <span className="text-xs text-base-content/60 font-semibold">5 Modules Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryCards.map((card) => (
              <div
                key={card.id}
                className={`bg-base-100 rounded-3xl border border-base-content/10 ${card.border} hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-4 group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`size-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}>
                      <card.icon className="size-6" />
                    </div>
                    <span className="badge badge-sm font-bold bg-base-200 text-[10px] text-base-content/70">
                      High Impact
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-base-content group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-base-content/60 line-clamp-3 leading-relaxed mt-1">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={card.link}
                    className="btn btn-base-200 hover:btn-primary w-full rounded-2xl font-bold uppercase text-xs tracking-wider flex items-center justify-between group/btn"
                  >
                    <span>Practice Now</span>
                    <ChevronRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompanyDashboardPage;

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
  Bug,
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
      <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-base-content/60">
            Loading Company Intelligence Hub...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data?.company) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-base-200">
        <AlertCircle className="size-16 text-error opacity-80" />
        <h2 className="text-2xl font-black text-base-content">Company Track Not Found</h2>
        <p className="text-xs text-base-content/60 max-w-md">
          Unable to locate hiring intelligence for this company. Please explore our other curated tracks.
        </p>
        <Link to="/placement" className="btn btn-primary rounded-2xl font-black uppercase text-xs tracking-wider">
          Explore All Companies
        </Link>
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

  const getCompanyCategoryCards = (slug, categories) => {
    // 1. Capgemini Track
    if (slug === "capgemini") {
      return [
        {
          id: "foundation",
          stageTag: "Round 1",
          title: "Foundation & AI Assessment",
          desc: "Combined Versant English Communication, AI Literacy & Generative AI fundamentals, and Cognitive Game tests (Motion, Grid, Logic).",
          icon: Brain,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "hover:border-blue-500/30",
          link: `/placement/${slug}/aptitude`,
          stats: categories.aptitude,
        },
        {
          id: "debugging",
          stageTag: "Round 2",
          title: "Hands-On Code Debugging (Compiler)",
          desc: "Interactive compiler round: identify, debug and fix preloaded logic bugs in Java, Python, C++, and JS across test cases.",
          icon: Bug,
          color: "text-rose-500",
          bg: "bg-rose-500/10",
          border: "hover:border-rose-500/30",
          link: `/placement/${slug}/coding`,
          stats: categories.coding,
        },
        {
          id: "coding",
          stageTag: "Round 3",
          title: "AI-Assisted Coding Studio",
          desc: "Solve algorithmic problem statements with AI Copilot prompt strategies, edge-case validation, and Monaco test runner.",
          icon: Code2,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "hover:border-amber-500/30",
          link: `/placement/${slug}/coding`,
          stats: categories.coding,
        },
        {
          id: "interview",
          stageTag: "Round 4",
          title: "Technical & HR Interview Masterclass",
          desc: "Resume walkthrough, projects defense, core CS fundamentals, and STAR-method behavioral alignment.",
          icon: MessageSquare,
          color: "text-primary",
          bg: "bg-primary/10",
          border: "hover:border-primary/30",
          link: `/placement/${slug}/interview`,
          stats: categories.interview,
        },
      ];
    }

    // 2. TCS Track (Ninja / Digital / Prime)
    if (slug === "tcs") {
      return [
        {
          id: "foundation",
          stageTag: "Round 1",
          title: "TCS NQT Foundation (Ninja Qualifier)",
          desc: "Numerical Ability, Reasoning Ability & Verbal Ability required for initial qualifier cutoff.",
          icon: Brain,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "hover:border-blue-500/30",
          link: `/placement/${slug}/aptitude`,
          stats: categories.aptitude,
        },
        {
          id: "advanced-nqt",
          stageTag: "Round 2",
          title: "TCS NQT Advanced Cognitive & IT",
          desc: "Advanced Quantitative, Advanced Reasoning, Core CS fundamentals & Pseudocode for Digital (7.5L) & Prime (9-11L).",
          icon: Layers,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          border: "hover:border-purple-500/30",
          link: `/placement/${slug}/technical`,
          stats: categories.technical,
        },
        {
          id: "coding",
          stageTag: "Round 3",
          title: "TCS NQT Hands-on Coding Assessment",
          desc: "2 Algorithmic Coding Questions (1 Easy-Medium, 1 Hard) evaluated on hidden test cases.",
          icon: Code2,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "hover:border-amber-500/30",
          link: `/placement/${slug}/coding`,
          stats: categories.coding,
        },
        {
          id: "interview",
          stageTag: "Round 4",
          title: "Technical & Managerial Interview",
          desc: "C/Java/Python, SQL joins, OOPs, Final Year Projects & Managerial workplace scenarios.",
          icon: MessageSquare,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          border: "hover:border-emerald-500/30",
          link: `/placement/${slug}/interview`,
          stats: categories.interview,
        },
      ];
    }

    // 3. Accenture Track (ASE / AASE)
    if (slug === "accenture") {
      return [
        {
          id: "cognitive",
          stageTag: "Round 1",
          title: "Cognitive & Technical Assessment",
          desc: "Critical Thinking, Abstract Reasoning, English Ability, Common Applications, MS Office, Pseudocode & Network Security.",
          icon: Brain,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "hover:border-blue-500/30",
          link: `/placement/${slug}/aptitude`,
          stats: categories.aptitude,
        },
        {
          id: "coding",
          stageTag: "Round 2",
          title: "Hands-on Coding Assessment",
          desc: "2 Mandatory Coding Questions (Binary String, Bitwise, Arrays) for AASE upgrade.",
          icon: Code2,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "hover:border-amber-500/30",
          link: `/placement/${slug}/coding`,
          stats: categories.coding,
        },
        {
          id: "communication",
          stageTag: "Round 3",
          title: "AI Communication & Spoken English",
          desc: "AI-proctored English speaking, pronunciation accuracy, sentence fluency, and listening comprehension.",
          icon: BookOpen,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          border: "hover:border-purple-500/30",
          link: `/placement/${slug}/english`,
          stats: categories.english,
        },
        {
          id: "interview",
          stageTag: "Round 4",
          title: "Technical & HR Interview Masterclass",
          desc: "Project deep-dive, technical fundamentals, and STAR-method behavioral questions.",
          icon: MessageSquare,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          border: "hover:border-emerald-500/30",
          link: `/placement/${slug}/interview`,
          stats: categories.interview,
        },
      ];
    }

    // 4. Infosys Track (SE / DSE / SP)
    if (slug === "infosys") {
      return [
        {
          id: "qualifier",
          stageTag: "Round 1",
          title: "Infosys Qualifier Assessment",
          desc: "Reasoning Ability, Mathematical Ability, Verbal English, Pseudocode & Puzzle Solving.",
          icon: Brain,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "hover:border-blue-500/30",
          link: `/placement/${slug}/aptitude`,
          stats: categories.aptitude,
        },
        {
          id: "coding",
          stageTag: "Round 2",
          title: "Hands-on Coding (SP / DSE)",
          desc: "3 Advanced Algorithmic problems on Dynamic Programming, Graph Traversal & Greedy strategies.",
          icon: Code2,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "hover:border-amber-500/30",
          link: `/placement/${slug}/coding`,
          stats: categories.coding,
        },
        {
          id: "interview",
          stageTag: "Round 3",
          title: "Technical & HR Interview",
          desc: "Data Structures, Database Management Systems, SQL queries, OOPs & Project defense.",
          icon: MessageSquare,
          color: "text-primary",
          bg: "bg-primary/10",
          border: "hover:border-primary/30",
          link: `/placement/${slug}/interview`,
          stats: categories.interview,
        },
      ];
    }

    // 5. Wipro Track (Elite / Turbo)
    if (slug === "wipro") {
      return [
        {
          id: "qualifier",
          stageTag: "Round 1",
          title: "National Qualifier (Aptitude & Debug)",
          desc: "Numerical, Logical Reasoning, Verbal English, and Automata Fix / Code Debugging.",
          icon: Brain,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "hover:border-blue-500/30",
          link: `/placement/${slug}/aptitude`,
          stats: categories.aptitude,
        },
        {
          id: "coding",
          stageTag: "Round 2",
          title: "Hands-on Coding Assessment",
          desc: "Algorithmic coding challenges tested across edge-cases in C++, Java, or Python.",
          icon: Code2,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "hover:border-amber-500/30",
          link: `/placement/${slug}/coding`,
          stats: categories.coding,
        },
        {
          id: "interview",
          stageTag: "Round 3",
          title: "Combined Tech + HR Interview",
          desc: "Core CS, programming fundamentals, code walkthrough, and behavioral alignment.",
          icon: MessageSquare,
          color: "text-primary",
          bg: "bg-primary/10",
          border: "hover:border-primary/30",
          link: `/placement/${slug}/interview`,
          stats: categories.interview,
        },
      ];
    }

    // 6. Cognizant Track (GenC / GenC Elevate / GenC Next)
    if (slug === "cognizant") {
      return [
        {
          id: "communication",
          stageTag: "Round 1",
          title: "AI Communication Assessment",
          desc: "Automated AI listening, spoken English fluency, sentence reading, and comprehension test.",
          icon: BookOpen,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          border: "hover:border-purple-500/30",
          link: `/placement/${slug}/english`,
          stats: categories.english,
        },
        {
          id: "technical-coding",
          stageTag: "Round 2",
          title: "Skill & Coding Assessment",
          desc: "Quantitative, Analytical, Core CS MCQs (OS, DBMS, SQL) & 2 Hands-on Coding Problems.",
          icon: Code2,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "hover:border-amber-500/30",
          link: `/placement/${slug}/coding`,
          stats: categories.coding,
        },
        {
          id: "interview",
          stageTag: "Round 3",
          title: "Technical & HR Interview",
          desc: "Java/Python fundamentals, DBMS, SQL joins, DSA and project architecture defense.",
          icon: MessageSquare,
          color: "text-primary",
          bg: "bg-primary/10",
          border: "hover:border-primary/30",
          link: `/placement/${slug}/interview`,
          stats: categories.interview,
        },
      ];
    }

    // 7. Product & FAANG Tier (Google, Microsoft, Amazon, Meta, Apple, Netflix, Adobe, Goldman Sachs, Uber, etc.)
    const isProductTier = [
      "google",
      "microsoft",
      "amazon",
      "meta",
      "apple",
      "netflix",
      "adobe",
      "goldman-sachs",
      "jpmorgan",
      "uber",
      "oracle",
      "salesforce",
      "cisco",
      "ibm",
      "qualcomm",
    ].includes(slug);

    if (isProductTier) {
      return [
        {
          id: "coding",
          stageTag: "Round 1",
          title: "Algorithmic Online Assessment (OA)",
          desc: "High-complexity algorithmic problems on Graphs, Trees, Dynamic Programming, and Monotonic Stacks.",
          icon: Code2,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "hover:border-amber-500/30",
          link: `/placement/${slug}/coding`,
          stats: categories.coding,
        },
        {
          id: "technical",
          stageTag: "Round 2",
          title: "Core CS & Systems Fundamentals",
          desc: "Operating Systems, Concurrency & Threads, DBMS Indexing, Networks, and Low-Level System Design.",
          icon: Layers,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          border: "hover:border-purple-500/30",
          link: `/placement/${slug}/technical`,
          stats: categories.technical,
        },
        {
          id: "aptitude",
          stageTag: "Round 3",
          title: "Analytical & Quantitative Aptitude",
          desc: "Probability, Combinatorics, Logic Puzzles, and fast mathematical analysis.",
          icon: Brain,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "hover:border-blue-500/30",
          link: `/placement/${slug}/aptitude`,
          stats: categories.aptitude,
        },
        {
          id: "interview",
          stageTag: "Round 4",
          title: "Technical & Leadership Masterclass",
          desc: "Live problem solving, System Design architecture, and STAR-method leadership principles.",
          icon: MessageSquare,
          color: "text-primary",
          bg: "bg-primary/10",
          border: "hover:border-primary/30",
          link: `/placement/${slug}/interview`,
          stats: categories.interview,
        },
      ];
    }

    // Default 4-Stage Track for any other company
    return [
      {
        id: "aptitude",
        stageTag: "Round 1",
        title: "Quantitative & Analytical Aptitude",
        desc: "Percentages, profit & loss, speed & distance, time & work, probability, and reasoning.",
        icon: Brain,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "hover:border-blue-500/30",
        link: `/placement/${slug}/aptitude`,
        stats: categories.aptitude,
      },
      {
        id: "technical",
        stageTag: "Round 2",
        title: "Core CS & Technical Fundamentals",
        desc: "Operating Systems, DBMS, SQL, Computer Networks, OOP, and Pseudocode.",
        icon: Layers,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "hover:border-purple-500/30",
        link: `/placement/${slug}/technical`,
        stats: categories.technical,
      },
      {
        id: "coding",
        stageTag: "Round 3",
        title: "Hands-on Coding Studio",
        desc: "Algorithmic problem solving, test case verification, Monaco IDE, and multi-language compiler.",
        icon: Code2,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "hover:border-amber-500/30",
        link: `/placement/${slug}/coding`,
        stats: categories.coding,
      },
      {
        id: "interview",
        stageTag: "Round 4",
        title: "Interview Masterclass",
        desc: "Technical interview deep-dives, STAR-method HR questions, and project defense guidance.",
        icon: MessageSquare,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "hover:border-rose-500/30",
        link: `/placement/${slug}/interview`,
        stats: categories.interview,
      },
    ];
  };

  const categoryCards = getCompanyCategoryCards(company.slug, categories);

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
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                  Hiring Assessment Journey
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {company.rounds.length} Stages
                </span>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${company.rounds.length === 6 ? "xl:grid-cols-6" : "lg:grid-cols-5"} gap-3`}>
                {company.rounds.map((round, idx) => {
                  const lowerName = (round.name + " " + round.description).toLowerCase();
                  let practiceLink = `/placement/${company.slug}/technical`;
                  let tag = "Technical";
                  let tagClass = "bg-primary/10 text-primary border-primary/20";

                  if (lowerName.includes("english") || lowerName.includes("communication") || lowerName.includes("speaking")) {
                    practiceLink = `/placement/${company.slug}/english`;
                    tag = "English Comm";
                    tagClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
                  } else if (lowerName.includes("debugging") || lowerName.includes("automata fix")) {
                    practiceLink = `/placement/${company.slug}/technical`;
                    tag = "🐞 Debugging";
                    tagClass = "bg-rose-500/10 text-rose-600 border-rose-500/20";
                  } else if (lowerName.includes("ai-assisted") || lowerName.includes("ai assisted") || (lowerName.includes("coding") && !lowerName.includes("interview"))) {
                    practiceLink = `/placement/${company.slug}/coding`;
                    tag = lowerName.includes("ai") ? "🤖 AI Coding" : "💻 Coding";
                    tagClass = "bg-amber-500/10 text-amber-600 border-amber-500/20";
                  } else if (lowerName.includes("ai literacy") || lowerName.includes("generative ai")) {
                    practiceLink = `/placement/${company.slug}/technical`;
                    tag = "🤖 AI Literacy";
                    tagClass = "bg-purple-500/10 text-purple-600 border-purple-500/20";
                  } else if (lowerName.includes("cognitive") || lowerName.includes("motion") || lowerName.includes("grid") || lowerName.includes("aptitude") || lowerName.includes("numerical")) {
                    practiceLink = `/placement/${company.slug}/aptitude`;
                    tag = "🎮 Cognitive";
                    tagClass = "bg-blue-500/10 text-blue-600 border-blue-500/20";
                  } else if (lowerName.includes("interview") || lowerName.includes("hr") || lowerName.includes("managerial")) {
                    practiceLink = `/placement/${company.slug}/interview`;
                    tag = "🤝 Interview";
                    tagClass = "bg-rose-500/10 text-rose-600 border-rose-500/20";
                  }

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
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${tagClass}`}>
                          {tag}
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

        {/* ── 2. PREPARATION CATEGORY CARDS ── */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight">
              {company?.name} Preparation Tracks &amp; Modules
            </h2>
            <span className="text-xs text-base-content/60 font-semibold">{categoryCards.length} Modules Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryCards.map((card) => (
              <div
                key={card.id + (card.stageTag || "")}
                className={`bg-base-100 rounded-3xl border border-base-content/10 ${card.border} hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-4 group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`size-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}>
                      <card.icon className="size-6" />
                    </div>
                    <span className="badge badge-sm font-extrabold bg-base-200 text-[10px] text-base-content/80 uppercase">
                      {card.stageTag || "High Impact"}
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

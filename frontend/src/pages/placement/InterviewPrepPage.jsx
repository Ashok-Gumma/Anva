import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  ArrowLeft,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
  Layers,
} from "lucide-react";
import { getPlacementQuestions } from "../../lib/placementApi";
import toast from "react-hot-toast";

const INTERVIEW_TABS = [
  { id: "all", label: "All Questions" },
  { id: "Technical", label: "Technical Interview" },
  { id: "HR", label: "HR / Behavioral" },
  { id: "Project", label: "Project Defense" },
];

const InterviewPrepPage = () => {
  const { companyId } = useParams();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["placementQuestions", companyId, "interview", activeTab, searchQuery],
    queryFn: () =>
      getPlacementQuestions({
        company: companyId,
        category: "interview",
        search: searchQuery,
        limit: 50,
      }),
  });

  const rawQuestions = data?.questions || [];
  const questions = rawQuestions.filter(
    (q) => activeTab === "all" || q.interviewCategory === activeTab
  );

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-3 sm:p-6 lg:p-8 font-sans text-base-content">
      <div className="container mx-auto max-w-[1200px] space-y-6">
        {/* ── 1. HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-4 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              to={`/placement/${companyId}`}
              className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wider text-rose-500">
                  {companyId?.toUpperCase()}
                </span>
                <span className="text-base-content/40">•</span>
                <h1 className="font-black text-base sm:text-lg text-base-content">Interview Masterclass</h1>
              </div>
              <p className="text-xs text-base-content/60 font-medium">
                High-impact technical deep-dives, STAR-method HR questions &amp; project defense blueprints
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. SEARCH & TABS ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search interview topics (OOP, STAR, DBMS...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {INTERVIEW_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-rose-500 text-white shadow-xs"
                    : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. QUESTIONS LIST ── */}
        {isLoading ? (
          <div className="bg-base-100 rounded-3xl p-12 border border-base-content/10 flex flex-col items-center justify-center gap-3">
            <span className="loading loading-spinner loading-md text-rose-500" />
            <span className="text-xs font-bold text-base-content/60">Loading interview guidance...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-base-100 rounded-3xl p-12 border border-base-content/10 text-center space-y-3">
            <MessageSquare className="size-12 mx-auto text-base-content/30" />
            <h3 className="font-extrabold text-base">No interview questions found</h3>
            <p className="text-xs text-base-content/60">Try clearing filters or search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((item, idx) => {
              const isExpanded = expandedIds[item._id];

              return (
                <div
                  key={item._id}
                  className="bg-base-100 rounded-3xl border border-base-content/10 shadow-sm overflow-hidden transition-all duration-300"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(item._id)}
                    className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-base-200/40 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge badge-sm font-black bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] uppercase">
                          {item.interviewCategory || "Interview"}
                        </span>
                        {item.difficulty && (
                          <span className="badge badge-sm font-bold bg-base-200 text-base-content/70 text-[10px] uppercase">
                            {item.difficulty}
                          </span>
                        )}
                        {item.frequency && (
                          <span className="badge badge-xs bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase">
                            🔥 {item.frequency} Frequency
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base sm:text-lg text-base-content leading-snug">
                        {item.question || item.title}
                      </h3>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.topics?.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-base-200 text-base-content/60"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="p-2 rounded-xl bg-base-200 text-base-content">
                        {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 pt-0 border-t border-base-content/5 space-y-5 bg-base-200/20 text-xs">
                      {/* What Interviewer Expects */}
                      {item.whatInterviewerExpects?.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                            <Sparkles className="size-3.5" />
                            What the Interviewer Expects
                          </span>
                          <ul className="space-y-1 pl-4 list-disc text-base-content/80 font-medium">
                            {item.whatInterviewerExpects.map((exp, eIdx) => (
                              <li key={eIdx}>{exp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Important Points */}
                      {item.importantPoints?.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5" />
                            Key Points to Cover
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.importantPoints.map((pt, pIdx) => (
                              <div key={pIdx} className="p-2.5 bg-base-100 rounded-xl border border-base-content/5 font-medium text-base-content/90">
                                {pt}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sample Answer Guidance */}
                      {item.sampleAnswer && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1.5">
                            <Award className="size-3.5" />
                            Sample Answer Guidance
                          </span>
                          <div className="p-4 bg-base-100 rounded-2xl border border-base-content/10 whitespace-pre-line text-base-content/90 font-medium leading-relaxed shadow-inner">
                            {item.sampleAnswer}
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      {item.tips?.length > 0 && (
                        <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-1.5 text-amber-800 dark:text-amber-300">
                          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Lightbulb className="size-3.5" />
                            Pro Tips &amp; Common Pitfalls
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] font-medium">
                            {item.tips.map((tip, tIdx) => (
                              <li key={tIdx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrepPage;

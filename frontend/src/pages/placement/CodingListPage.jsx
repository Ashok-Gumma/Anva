import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Code2,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Search,
  Filter,
  Flame,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import { getPlacementQuestions } from "../../lib/placementApi";
import { motion } from "framer-motion";

const DIFFICULTY_FILTERS = [
  { id: "all", label: "All Difficulties" },
  { id: "Easy", label: "Easy", color: "text-emerald-500" },
  { id: "Medium", label: "Medium", color: "text-amber-500" },
  { id: "Hard", label: "Hard", color: "text-rose-500" },
];

const CodingListPage = () => {
  const { companyId } = useParams();
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["placementQuestions", companyId, "coding", selectedDifficulty, selectedTopic, searchQuery],
    queryFn: () =>
      getPlacementQuestions({
        company: companyId,
        category: "coding",
        difficulty: selectedDifficulty,
        topic: selectedTopic,
        search: searchQuery,
        limit: 50,
      }),
  });

  const questions = data?.questions || [];
  const topics = data?.availableTopics || [];

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-3 sm:p-6 lg:p-8 font-sans text-base-content">
      <div className="container mx-auto max-w-[1300px] space-y-6">
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
                <span className="font-extrabold text-sm uppercase tracking-wider text-amber-500">
                  {companyId?.toUpperCase()}
                </span>
                <span className="text-base-content/40">•</span>
                <h1 className="font-black text-base sm:text-lg text-base-content">Coding Challenges</h1>
              </div>
              <p className="text-xs text-base-content/60 font-medium">
                High-frequency algorithmic problems reported in {companyId?.toUpperCase()} OAs &amp; technical interviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-primary font-black text-xs uppercase px-3 py-1">
              {questions.filter((q) => q.isSolved).length} / {questions.length} Solved
            </span>
          </div>
        </div>

        {/* ── 2. SEARCH & FILTERS ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search problem (Two Sum, Subarray...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-base-100 border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 custom-scrollbar">
            {DIFFICULTY_FILTERS.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDifficulty === d.id
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. PROBLEMS TABLE / LIST ── */}
        {isLoading ? (
          <div className="bg-base-100 rounded-3xl p-12 border border-base-content/10 flex flex-col items-center justify-center gap-3">
            <span className="loading loading-spinner loading-md text-amber-500" />
            <span className="text-xs font-bold text-base-content/60">Loading coding challenges...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-base-100 rounded-3xl p-12 border border-base-content/10 text-center space-y-3">
            <Code2 className="size-12 mx-auto text-base-content/30" />
            <h3 className="font-extrabold text-base">No problems found</h3>
            <p className="text-xs text-base-content/60">Try clearing filters or search query.</p>
          </div>
        ) : (
          <div className="bg-base-100 rounded-3xl border border-base-content/10 overflow-hidden shadow-sm">
            <div className="divide-y divide-base-content/5">
              {questions.map((prob, idx) => {
                const diffColor =
                  prob.difficulty === "Easy"
                    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                    : prob.difficulty === "Medium"
                    ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                    : "text-rose-500 bg-rose-500/10 border-rose-500/20";

                return (
                  <div
                    key={prob._id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-base-200/50 transition-colors group"
                  >
                    {/* Left info */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      {prob.isSolved ? (
                        <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                      ) : (
                        <Circle className="size-5 text-base-content/20 shrink-0 mt-0.5 sm:mt-0" />
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/placement/${companyId}/coding/${prob._id}`}
                            className="font-bold text-sm text-base-content group-hover:text-primary transition-colors truncate"
                          >
                            {idx + 1}. {prob.title}
                          </Link>
                          {prob.frequency && (
                            <span className="badge badge-xs bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase">
                              🔥 {prob.frequency}
                            </span>
                          )}
                        </div>

                        {/* Topics */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {prob.topics?.map((tp, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-base-200 text-base-content/60"
                            >
                              {tp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right action & badges */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${diffColor}`}>
                        {prob.difficulty}
                      </span>

                      <Link
                        to={`/placement/${companyId}/coding/${prob._id}`}
                        className="btn btn-primary btn-sm rounded-xl font-bold uppercase text-[11px] tracking-wider px-4 gap-1.5 shadow-xs"
                      >
                        <span>{prob.isSolved ? "Solve Again" : "Solve"}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingListPage;

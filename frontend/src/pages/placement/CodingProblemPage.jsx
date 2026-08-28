import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import {
  Code2,
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  Copy,
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  ChevronRight,
  Terminal,
  Unlock,
  Layers,
  Sparkles,
  Check,
  Cpu,
  Clock,
  HardDrive,
  FileCode2,
  HelpCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  getPlacementQuestionById,
  runPlacementCode,
  submitPlacementCode,
} from "../../lib/placementApi";
import PomodoroTimer from "../../components/PomodoroTimer";

const CODE_TEMPLATES = {
  java: `public class Solution {
    public void solve() {
        // Write your solution here
    }
}`,
  javascript: `function solve() {
    // Write your solution here
}`,
  python: `class Solution:
    def solve(self):
        # Write your solution here
        pass`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    void solve() {
        // Write your solution here
    }
};`,
};

const CodingProblemPage = () => {
  const { companyId, problemId } = useParams();
  const queryClient = useQueryClient();

  // Navigation & Panel States
  const [activeLeftTab, setActiveLeftTab] = useState("description"); // "description" | "hints" | "approach" | "solution"
  const [activeConsoleTab, setActiveConsoleTab] = useState("cases"); // "cases" | "output" | "custom"
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("java");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [revealedHints, setRevealedHints] = useState({});
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["placementQuestion", problemId],
    queryFn: () => getPlacementQuestionById(problemId),
    enabled: !!problemId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const question = data?.question || null;
  const lastLoadedKeyRef = useRef("");

  // Initialize code only when opening a new problem or switching language (with localStorage draft support)
  useEffect(() => {
    if (question?._id) {
      const loadKey = `${question._id}_${selectedLanguage}`;
      if (lastLoadedKeyRef.current !== loadKey) {
        lastLoadedKeyRef.current = loadKey;

        try {
          const draftCode = localStorage.getItem(`anva_draft_code_${question._id}_${selectedLanguage}`);
          if (draftCode) {
            setCode(draftCode);
            return;
          }
        } catch (e) {}

        // If user already had a saved code for this language, load it; otherwise starter code
        if (question.userAttempt?.code && question.userAttempt?.language === selectedLanguage) {
          setCode(question.userAttempt.code);
        } else {
          const starter =
            question.starterCode?.[selectedLanguage] ||
            CODE_TEMPLATES[selectedLanguage] ||
            "";
          setCode(starter);
        }
      }
    }
  }, [question?._id, selectedLanguage, question?.userAttempt?.code, question?.userAttempt?.language]);

  // Run code against sample test cases or custom input (Quiet inline feedback, no toast spam)
  const { mutate: runCodeMutation } = useMutation({
    mutationFn: runPlacementCode,
    onMutate: () => {
      setIsRunning(true);
      setSubmissionResult(null);
      setActiveConsoleTab("output");
    },
    onSuccess: (res) => {
      setIsRunning(false);
      setRunResults(res);
    },
    onError: (err) => {
      setIsRunning(false);
      setRunResults({
        allPassed: false,
        error: err.response?.data?.message || err.message || "Execution failed.",
      });
    },
  });

  const handleRunCode = () => {
    if (!code.trim() || !question) return;
    runCodeMutation({
      questionId: question._id,
      code,
      language: selectedLanguage,
      customInput: activeConsoleTab === "custom" ? customInput : "",
    });
  };

  // Submit code against all test cases (Quiet inline feedback, no toast spam)
  const { mutate: submitCodeMutation } = useMutation({
    mutationFn: submitPlacementCode,
    onMutate: () => {
      setIsSubmitting(true);
      setRunResults(null);
      setActiveConsoleTab("output");
    },
    onSuccess: (res) => {
      setIsSubmitting(false);
      setSubmissionResult(res);
      queryClient.invalidateQueries({ queryKey: ["companyPlacementDetails", companyId], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["placementUserProgress"], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["placementQuestion", problemId], refetchType: "none" });
    },
    onError: (err) => {
      setIsSubmitting(false);
      setSubmissionResult({
        isAccepted: false,
        status: "Submission Failed",
        error: err.response?.data?.message || err.message || "Submission failed.",
      });
    },
  });

  const handleSubmitCode = () => {
    if (!code.trim() || !question) return;
    submitCodeMutation({
      questionId: question._id,
      code,
      language: selectedLanguage,
    });
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (isLoading || !question) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-base-content/60">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">
            Initializing Zen Studio...
          </span>
        </div>
      </div>
    );
  }

  const diffBadgeStyle =
    question.difficulty === "Easy"
      ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/30 dark:text-emerald-400"
      : question.difficulty === "Medium"
      ? "text-amber-700 bg-amber-500/10 border-amber-500/30 dark:text-amber-400"
      : "text-rose-700 bg-rose-500/10 border-rose-500/30 dark:text-rose-400";

  const sampleCases = (question.testCases || []).filter((tc) => !tc.isHidden);

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200/60 p-2 sm:p-4 font-sans text-base-content flex flex-col gap-3">
      {/* ── TOP ZEN HEADER BAR ── */}
      <header className="flex items-center justify-between bg-base-100 px-4 py-2.5 rounded-2xl border border-base-content/10 shadow-xs shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/placement/${companyId}/coding`}
            className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content transition-colors shrink-0"
            title="Back to Problem List"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20 shrink-0">
              {companyId?.toUpperCase()}
            </span>
            <span className="text-base-content/20 shrink-0">•</span>
            <h1 className="font-black text-sm text-base-content truncate">
              {question.title}
            </h1>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${diffBadgeStyle}`}>
              {question.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Pomodoro Quick Trigger */}
          <button
            onClick={() => setShowPomodoro((prev) => !prev)}
            className="btn btn-ghost btn-xs rounded-xl border border-base-content/10 gap-1.5 text-xs font-bold hover:bg-base-200 px-2.5"
            title="Pomodoro Focus Timer"
          >
            <span>🍅</span>
            <span className="hidden sm:inline text-base-content/80">Focus</span>
          </button>

          {question.isSolved && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl dark:text-emerald-400">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Solved</span>
            </span>
          )}
        </div>
      </header>

      {/* ── SPLIT MAIN WORKSPACE ── */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* ── LEFT PANE: PROBLEM CODEX & BRIEFING (5.5 cols on lg) ── */}
        <section className="lg:col-span-5 xl:col-span-5 bg-base-100 rounded-2xl border border-base-content/10 shadow-xs flex flex-col overflow-hidden min-h-[500px]">
          {/* Codex Segmented Navigation Tabs */}
          <nav className="flex items-center gap-1 border-b border-base-content/10 px-3 py-2 bg-base-200/40 shrink-0 overflow-x-auto custom-scrollbar">
            {[
              { id: "description", label: "Brief", icon: Code2 },
              { id: "hints", label: `Hints (${question.hints?.length || 0})`, icon: Lightbulb },
              { id: "approach", label: "Approach", icon: Layers },
              { id: "ai-assistant", label: "AI Copilot & Debugging", icon: Sparkles },
              { id: "solution", label: "Solution", icon: Unlock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeLeftTab === tab.id
                    ? "bg-base-100 text-primary shadow-xs font-black border border-base-content/10"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-200/50"
                }`}
              >
                <tab.icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Codex Body Content */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-5 text-sm leading-relaxed">
            {activeLeftTab === "description" && (
              <article className="space-y-5">
                {/* Header & Meta Pills */}
                <div className="space-y-2.5 pb-2 border-b border-base-content/5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-base-content tracking-tight">
                      {question.title}
                    </h2>
                    {question.frequency && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Flame className="size-3" /> {question.frequency} Frequency
                      </span>
                    )}
                  </div>

                  {/* Topics & Company Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {question.topics?.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-base-200 text-base-content/80 font-bold border border-base-content/5"
                      >
                        #{topic}
                      </span>
                    ))}
                    {question.companies?.map((comp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-primary/5 text-primary font-extrabold uppercase text-[10px] border border-primary/10"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Problem Statement */}
                <div className="text-base-content/90 font-medium whitespace-pre-line leading-relaxed text-sm">
                  {question.problemDescription}
                </div>

                {/* Structured Example Cards */}
                {question.examples?.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-black uppercase tracking-wider text-base-content/50 block">
                      Examples
                    </span>
                    {question.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-base-200/50 rounded-2xl border border-base-content/5 space-y-2 text-xs"
                      >
                        <div className="font-black text-primary text-[11px] uppercase tracking-wider">
                          Example {idx + 1}
                        </div>
                        <div className="font-mono bg-base-100 p-2.5 rounded-xl border border-base-content/5 space-y-1">
                          <div>
                            <span className="text-base-content/50 font-bold">Input: </span>
                            <span className="text-base-content font-bold">{ex.input}</span>
                          </div>
                          <div>
                            <span className="text-base-content/50 font-bold">Output: </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ex.output}</span>
                          </div>
                        </div>
                        {ex.explanation && (
                          <p className="text-base-content/70 text-xs font-medium pt-0.5">
                            <span className="font-bold text-base-content">Explanation: </span>
                            {ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {question.constraints?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-black uppercase tracking-wider text-base-content/50 block">
                      Constraints
                    </span>
                    <ul className="space-y-1.5 font-mono text-xs text-base-content/80 bg-base-200/40 p-3.5 rounded-2xl border border-base-content/5">
                      {question.constraints.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            )}

            {/* Hints Tab */}
            {activeLeftTab === "hints" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-base-content/70">
                  <Lightbulb className="size-4 text-amber-500" />
                  <span>Stuck? Reveal progressive hints one by one.</span>
                </div>
                {question.hints?.length > 0 ? (
                  question.hints.map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-base-200/50 rounded-2xl border border-base-content/5 space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-base-content/70">
                          Hint {idx + 1}
                        </span>
                        {!revealedHints[idx] ? (
                          <button
                            onClick={() => setRevealedHints((prev) => ({ ...prev, [idx]: true }))}
                            className="btn btn-xs btn-primary rounded-xl text-[11px] font-bold"
                          >
                            Reveal Hint
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                            <Check className="size-3" /> Revealed
                          </span>
                        )}
                      </div>
                      {revealedHints[idx] && (
                        <p className="text-xs text-base-content/90 font-medium pt-1 animate-in fade-in">
                          {hint}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-base-content/50 italic">No hints available for this problem.</p>
                )}
              </div>
            )}

            {/* Approach Tab */}
            {activeLeftTab === "approach" && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="p-4 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-2">
                  <span className="font-bold text-primary text-xs uppercase tracking-wider block">
                    Recommended Approach
                  </span>
                  <p className="text-base-content/90 font-medium whitespace-pre-line">
                    {question.approach || "Analyze test cases and employ optimal two-pointer or dynamic logic."}
                  </p>
                </div>
                {(question.timeComplexity || question.spaceComplexity) && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {question.timeComplexity && (
                      <div className="p-3 bg-base-200/50 rounded-xl border border-base-content/5">
                        <div className="text-[10px] font-bold text-base-content/50 uppercase">Time Complexity</div>
                        <div className="font-mono font-black text-sm text-primary pt-0.5">{question.timeComplexity}</div>
                      </div>
                    )}
                    {question.spaceComplexity && (
                      <div className="p-3 bg-base-200/50 rounded-xl border border-base-content/5">
                        <div className="text-[10px] font-bold text-base-content/50 uppercase">Space Complexity</div>
                        <div className="font-mono font-black text-sm text-primary pt-0.5">{question.spaceComplexity}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* AI Assistant & Copilot (2026 Process) */}
            {activeLeftTab === "ai-assistant" && (
              <div className="space-y-4 text-xs leading-relaxed animate-in fade-in">
                {/* Banner */}
                <div className="p-4 bg-gradient-to-br from-primary/15 via-base-200 to-secondary/15 rounded-2xl border border-primary/20 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                    <Sparkles className="size-4" />
                    <span>AI-Assisted Coding Copilot</span>
                  </div>
                  <p className="text-[11px] text-base-content/80 font-medium">
                    Use AI for problem intuition, conceptual clues, and edge-case validation. Focus on understanding the logic before writing code.
                  </p>
                </div>

                {/* Problem Brief & Intuition Clues */}
                <div className="p-4 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-2">
                  <span className="font-extrabold text-xs text-primary uppercase tracking-wider block flex items-center gap-1.5">
                    <Lightbulb className="size-3.5 text-amber-500" />
                    Problem Brief &amp; Intuition Clues
                  </span>
                  <p className="text-base-content/90 font-medium text-xs leading-relaxed">
                    {question.approach || "Break the problem down into input constraints, optimal data structures (e.g. Hash Map, Two Pointers, Sliding Window), and target time complexity."}
                  </p>
                  {question.hints && question.hints.length > 0 && (
                    <div className="pt-2 border-t border-base-content/5 space-y-1">
                      <span className="font-bold text-[10px] uppercase text-base-content/60">Strategy Clues:</span>
                      <ul className="list-disc list-inside text-[11px] text-base-content/80 space-y-1">
                        {question.hints.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Optimal AI Prompt Strategy */}
                <div className="p-4 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-base-content uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="size-3.5 text-primary" />
                      Suggested AI Prompt Strategy
                    </span>
                    <button
                      onClick={() => {
                        const promptText = `Explain the optimal algorithmic approach for: "${question.title}".\nRequirements:\n1. Provide the high-level intuition and time/space complexity.\n2. Do NOT write full code; provide pseudocode and step-by-step logic.\n3. List key edge cases to handle.`;
                        navigator.clipboard.writeText(promptText);
                        toast.success("AI Prompt template copied! 📋");
                      }}
                      className="btn btn-xs btn-primary rounded-xl font-bold gap-1 text-[11px]"
                    >
                      <Copy className="size-3" />
                      Copy Prompt
                    </button>
                  </div>
                  <div className="p-3 bg-base-100 rounded-xl border border-base-content/10 font-mono text-[11px] text-base-content/80 whitespace-pre-line leading-snug">
                    {`"Explain the intuition for '${question.title}'. Target Time: ${question.timeComplexity || "O(n)"}, Space: ${question.spaceComplexity || "O(1)"}. Give step-by-step logic and edge cases without full code."`}
                  </div>
                </div>

                {/* Common AI Traps & Bugs Checklist */}
                <div className="p-4 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-2.5">
                  <span className="font-extrabold text-xs text-base-content uppercase tracking-wider block">
                    🐞 Top Edge Cases to Watch Out For
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-base-content/80 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-warning font-bold shrink-0">⚠️</span>
                      <span><strong>Boundary Conditions:</strong> Empty input ($N=0$), single element ($N=1$), or maximum constraints.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warning font-bold shrink-0">⚠️</span>
                      <span><strong>Duplicates &amp; In-place Mutations:</strong> Ensure elements are not prematurely overwritten or returned early.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warning font-bold shrink-0">⚠️</span>
                      <span><strong>Type &amp; Overflow Limits:</strong> Account for negative values and integer range bounds.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Solution Tab */}
            {activeLeftTab === "solution" && (
              <div className="space-y-4">
                {!showSolution ? (
                  <div className="text-center py-8 px-4 bg-base-200/40 rounded-2xl border border-base-content/5 space-y-3">
                    <Unlock className="size-8 text-primary mx-auto opacity-80" />
                    <h3 className="font-black text-sm text-base-content">Unlock Reference Solution?</h3>
                    <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                      Try solving the problem independently first to maximize learning retention.
                    </p>
                    <button
                      onClick={() => setShowSolution(true)}
                      className="btn btn-sm btn-primary rounded-xl font-bold text-xs mt-2"
                    >
                      View Solution Code
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Reference Solution ({selectedLanguage})
                      </span>
                      <button
                        onClick={() => setShowSolution(false)}
                        className="btn btn-ghost btn-xs text-[11px] font-bold text-base-content/60"
                      >
                        Hide Solution
                      </button>
                    </div>
                    <pre className="p-4 bg-base-200 rounded-2xl font-mono text-xs overflow-x-auto custom-scrollbar border border-base-content/5 text-base-content">
                      {question.solutionCode?.[selectedLanguage] || "// Solution template unavailable"}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── RIGHT PANE: CODE CANVAS & INTERACTIVE TEST STUDIO (7 cols on lg) ── */}
        <section className="lg:col-span-7 xl:col-span-7 flex flex-col gap-3 min-h-[500px]">
          {/* Code Editor Box */}
          <div className="bg-base-100 rounded-2xl border border-base-content/10 shadow-xs flex flex-col overflow-hidden flex-1 min-h-[320px]">
            {/* Editor Action Header */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-base-content/10 bg-base-200/40 shrink-0">
              <div className="flex items-center gap-2.5">
                <FileCode2 className="size-4 text-primary" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="select select-bordered select-xs font-mono font-bold text-xs bg-base-100 rounded-xl"
                >
                  <option value="java">Java (OpenJDK)</option>
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ (GCC)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setEditorTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"))
                  }
                  className="btn btn-ghost btn-xs rounded-lg text-[11px] font-bold text-base-content/70 hover:text-base-content"
                  title="Toggle Editor Light/Dark Theme"
                >
                  {editorTheme === "vs-dark" ? "🌙 Dark" : "☀️ Light"}
                </button>

                <button
                  onClick={() => {
                    const starter =
                      question.starterCode?.[selectedLanguage] || CODE_TEMPLATES[selectedLanguage];
                    setCode(starter);
                    if (question?._id) {
                      try {
                        localStorage.removeItem(`anva_draft_code_${question._id}_${selectedLanguage}`);
                      } catch (e) {}
                    }
                    toast.success("Code reset to template.");
                  }}
                  className="btn btn-ghost btn-xs rounded-lg text-[11px] font-bold gap-1 text-base-content/70 hover:text-base-content"
                  title="Reset to starter template"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="btn btn-ghost btn-xs rounded-lg text-[11px] font-bold gap-1 text-base-content/70 hover:text-base-content"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 overflow-hidden relative min-h-[220px]">
              <Editor
                height="100%"
                language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage}
                value={code}
                onChange={(val) => {
                  const newCode = val || "";
                  setCode(newCode);
                  if (question?._id) {
                    try {
                      localStorage.setItem(`anva_draft_code_${question._id}_${selectedLanguage}`, newCode);
                    } catch (e) {}
                  }
                }}
                theme={editorTheme}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  lineHeight: 24,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 14, bottom: 14 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, 'Courier New', monospace",
                  fontLigatures: true,
                }}
              />
            </div>
          </div>

          {/* Interactive Test Matrix & Output Studio */}
          <div className="bg-base-100 rounded-2xl border border-base-content/10 shadow-xs flex flex-col overflow-hidden min-h-[240px]">
            {/* Test Matrix Header */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-base-content/10 bg-base-200/40 shrink-0 flex-wrap gap-2">
              {/* Tabs: Cases, Output, Custom */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveConsoleTab("cases")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeConsoleTab === "cases"
                      ? "bg-base-100 text-primary font-black shadow-xs border border-base-content/10"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  Sample Cases
                </button>
                <button
                  onClick={() => setActiveConsoleTab("output")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                    activeConsoleTab === "output"
                      ? "bg-base-100 text-primary font-black shadow-xs border border-base-content/10"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  <Terminal className="size-3" />
                  <span>Output Studio</span>
                  {(runResults || submissionResult) && (
                    <span className="size-2 rounded-full bg-primary animate-pulse ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => setActiveConsoleTab("custom")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeConsoleTab === "custom"
                      ? "bg-base-100 text-primary font-black shadow-xs border border-base-content/10"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  Custom Stdin
                </button>
              </div>

              {/* Action Buttons (Run Tests & Submit Solution) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="btn btn-ghost btn-sm rounded-xl font-bold text-xs gap-1.5 border border-base-content/15 hover:bg-base-200 cursor-pointer"
                >
                  {isRunning ? (
                    <span className="loading loading-spinner size-3" />
                  ) : (
                    <Play className="size-3.5 text-emerald-600 dark:text-emerald-400 fill-current" />
                  )}
                  <span>Run Tests</span>
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting || isRunning}
                  className="btn btn-primary btn-sm rounded-xl font-black text-xs gap-1.5 shadow-sm px-4 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner size-3" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                  <span>Submit Solution</span>
                </button>
              </div>
            </div>

            {/* Test Matrix Body */}
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar font-mono text-xs">
              {/* Tab 1: Sample Test Cases Selector */}
              {activeConsoleTab === "cases" && (
                <div className="space-y-3">
                  {/* Case Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {sampleCases.map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedTestCaseIndex === idx
                            ? "bg-primary text-primary-content font-black shadow-xs"
                            : "bg-base-200 text-base-content/70 hover:bg-base-300"
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Selected Case Inspection */}
                  {sampleCases[selectedTestCaseIndex] && (
                    <div className="p-3.5 bg-base-200/60 rounded-2xl space-y-2 border border-base-content/5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-base-content/50 uppercase block">Input</span>
                        <div className="p-2.5 bg-base-100 rounded-xl font-mono text-xs text-base-content border border-base-content/5 whitespace-pre-wrap">
                          {sampleCases[selectedTestCaseIndex].input}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-base-content/50 uppercase block">Expected Output</span>
                        <div className="p-2.5 bg-base-100 rounded-xl font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold border border-base-content/5">
                          {sampleCases[selectedTestCaseIndex].expectedOutput}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Output Studio (Execution Results & Submission Verdicts) */}
              {activeConsoleTab === "output" && (
                <div className="space-y-3">
                  {isRunning || isSubmitting ? (
                    <div className="flex items-center justify-center py-8 gap-2.5 text-base-content/60">
                      <span className="loading loading-spinner size-4 text-primary" />
                      <span className="font-mono text-xs">
                        {isRunning ? "Executing code against test cases..." : "Evaluating full test suite..."}
                      </span>
                    </div>
                  ) : submissionResult ? (
                    /* Submission Verdict Card */
                    <div className="space-y-3">
                      <div
                        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between shadow-xs ${
                          submissionResult.isAccepted
                            ? "bg-emerald-500/15 border-emerald-500/50 text-base-content"
                            : "bg-rose-500/15 border-rose-500/50 text-base-content"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {submissionResult.isAccepted ? (
                            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="size-5 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                          <div>
                            <div className="font-black text-sm text-base-content">
                              {submissionResult.isAccepted ? "Accepted 🎉" : submissionResult.status || "Wrong Answer"}
                            </div>
                            <div className="text-[11px] text-base-content/70 font-semibold">
                              {submissionResult.passedCases} / {submissionResult.totalCases} test cases passed
                            </div>
                          </div>
                        </div>

                        {submissionResult.runtimeMs !== undefined && (
                          <div className="flex items-center gap-2 text-[11px] font-mono text-base-content/80">
                            <span className="flex items-center gap-1 bg-base-100/80 px-2 py-0.5 rounded-lg border border-base-content/10">
                              <Clock className="size-3 text-primary" /> {submissionResult.runtimeMs}ms
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Top-level Compiler / Runtime Diagnostic if present */}
                      {(submissionResult.stderr || (submissionResult.hasError && submissionResult.error)) && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400">
                            <Terminal className="size-3.5" />
                            <span>Compiler / Runtime Diagnostic:</span>
                          </div>
                          <pre className="p-3.5 bg-neutral-950 text-rose-300 rounded-2xl text-xs overflow-x-auto font-mono whitespace-pre-wrap border border-rose-500/30 leading-relaxed shadow-sm">
                            {submissionResult.stderr || submissionResult.error}
                          </pre>
                        </div>
                      )}

                      {/* Case Breakdowns */}
                      {submissionResult.testResults?.length > 0 && (
                        <div className="space-y-2">
                          {submissionResult.testResults.map((r, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-2xl border-2 text-xs transition-all ${
                                r.passed
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-base-content"
                                  : "bg-rose-500/10 border-rose-500/30 text-base-content"
                              }`}
                            >
                              <div className="font-black flex items-center justify-between pb-1">
                                <div className="flex items-center gap-2">
                                  <span className={r.passed ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}>
                                    Case {r.testCaseIndex}: {r.passed ? "Passed ✓" : "Failed ✗"}
                                  </span>
                                  {r.isHidden && (
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-base-200 text-base-content/60 border border-base-content/10">
                                      Hidden Suite Case
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {!r.passed && (
                                    <button
                                      onClick={() => {
                                        setCustomInput(r.input);
                                        setActiveConsoleTab("custom");
                                      }}
                                      className="btn btn-ghost btn-xs text-[10px] font-bold text-primary hover:bg-base-200"
                                      title="Load this input into Custom Stdin"
                                    >
                                      Debug in Custom Stdin →
                                    </button>
                                  )}
                                  {r.executionTime && <span className="text-base-content/60 font-mono text-[11px]">{r.executionTime}ms</span>}
                                </div>
                              </div>
                              {!r.passed && (
                                <div className="mt-1 pt-2 border-t border-base-content/10 font-mono text-xs space-y-1.5 bg-base-100/60 p-3 rounded-xl">
                                  <div>
                                    <span className="text-base-content/50 font-bold">Input: </span>
                                    <span className="text-base-content font-bold whitespace-pre-wrap">{r.input}</span>
                                  </div>
                                  <div>
                                    <span className="text-base-content/50 font-bold">Expected: </span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{r.expectedOutput}</span>
                                  </div>
                                  <div>
                                    <span className="text-base-content/50 font-bold">Actual: </span>
                                    <span className="text-rose-600 dark:text-rose-400 font-bold">{r.actualOutput || "(empty)"}</span>
                                  </div>
                                  {r.stderr && (
                                    <div className="mt-2 pt-2 border-t border-base-content/10">
                                      <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 block mb-1">
                                        Diagnostic:
                                      </span>
                                      <pre className="p-2.5 bg-neutral-950 text-rose-300 rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap border border-rose-500/20">
                                        {r.stderr}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : runResults ? (
                    /* Sample Run Results Card */
                    <div className="space-y-3">
                      {(() => {
                        const hasCompileError = Boolean(
                          runResults.hasError ||
                          runResults.stderr ||
                          runResults.results?.some((r) => r.isError || r.stderr)
                        );
                        const compilerDiagnostic =
                          runResults.stderr ||
                          runResults.results?.find((r) => r.stderr)?.stderr ||
                          runResults.error ||
                          "";

                        return (
                          <>
                            <div
                              className={`p-3 rounded-2xl border-2 flex items-center justify-between shadow-xs ${
                                runResults.allPassed
                                  ? "bg-emerald-500/15 border-emerald-500/50 text-base-content"
                                  : hasCompileError
                                  ? "bg-rose-500/15 border-rose-500/50 text-base-content"
                                  : "bg-amber-500/15 border-amber-500/50 text-base-content"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {runResults.allPassed ? (
                                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                ) : hasCompileError ? (
                                  <XCircle className="size-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                ) : (
                                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                )}
                                <span className="font-black text-xs text-base-content">
                                  {runResults.customRun
                                    ? "Custom Input Executed"
                                    : runResults.allPassed
                                    ? "All Sample Cases Passed ✓"
                                    : hasCompileError
                                    ? "Compilation / Runtime Error ✗"
                                    : "Sample Cases Did Not Match ✗"}
                                </span>
                              </div>
                            </div>

                            {/* Prominent Compiler Diagnostic Box */}
                            {hasCompileError && compilerDiagnostic && (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400">
                                  <Terminal className="size-3.5" />
                                  <span>Compiler / Runtime Diagnostic:</span>
                                </div>
                                <pre className="p-3.5 bg-neutral-950 text-rose-300 rounded-2xl text-xs overflow-x-auto font-mono whitespace-pre-wrap border border-rose-500/30 leading-relaxed shadow-sm">
                                  {compilerDiagnostic}
                                </pre>
                              </div>
                            )}

                            {/* Standard Output or Test Breakdown */}
                            {runResults.results?.map((res, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-2xl border-2 text-xs transition-all ${
                                  res.passed
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-base-content"
                                    : "bg-rose-500/10 border-rose-500/30 text-base-content"
                                }`}
                              >
                                <div className="font-black flex items-center justify-between pb-1">
                                  <span className={res.passed ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}>
                                    Case {res.testCaseIndex}: {res.passed ? "Passed ✓" : "Failed ✗"}
                                  </span>
                                </div>
                                <div className="mt-1 space-y-1 text-xs font-mono bg-base-100/60 p-2.5 rounded-xl border border-base-content/5">
                                  <div>
                                    <span className="text-base-content/50 font-bold">Input: </span>
                                    <span className="text-base-content font-bold">{res.input}</span>
                                  </div>
                                  <div>
                                    <span className="text-base-content/50 font-bold">Expected: </span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{res.expectedOutput}</span>
                                  </div>
                                  <div>
                                    <span className="text-base-content/50 font-bold">Actual: </span>
                                    <span className={res.passed ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-rose-600 dark:text-rose-400 font-bold"}>
                                      {res.actualOutput || "(empty)"}
                                    </span>
                                  </div>
                                  {res.stderr && (
                                    <div className="mt-2 pt-2 border-t border-base-content/10">
                                      <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 block mb-1">
                                        Diagnostic:
                                      </span>
                                      <pre className="p-2.5 bg-neutral-950 text-rose-300 rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap border border-rose-500/20">
                                        {res.stderr}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}

                            {runResults.stdout && (
                              <div className="space-y-1 pt-1">
                                <span className="text-[10px] font-black text-base-content/60 uppercase">Stdout</span>
                                <pre className="p-3 bg-base-200 rounded-2xl text-xs overflow-x-auto custom-scrollbar font-mono text-base-content border border-base-content/10">
                                  {runResults.stdout}
                                </pre>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-base-content/50 space-y-1">
                      <Terminal className="size-6 mx-auto opacity-50 mb-1" />
                      <p className="font-sans font-medium text-xs">Click "Run Tests" or "Submit Solution" to inspect execution results here.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Custom Stdin Input */}
              {activeConsoleTab === "custom" && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-base-content/50 uppercase block">
                    Custom Stdin Arguments
                  </span>
                  <textarea
                    rows={3}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom inputs (e.g. [3,2,0,-4] on line 1, 1 on line 2)..."
                    className="textarea textarea-bordered w-full font-mono text-xs bg-base-200/50 rounded-xl focus:outline-primary"
                  />
                  <span className="text-[11px] text-base-content/50 block">
                    When provided, "Run Tests" will execute your code against this custom input.
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Pomodoro Focus Timer */}
      <PomodoroTimer isOpen={showPomodoro} onClose={() => setShowPomodoro(false)} />
    </div>
  );
};

export default CodingProblemPage;

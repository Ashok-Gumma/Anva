import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Editor from "@monaco-editor/react";
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
  HelpCircle,
  Unlock,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  getPlacementQuestionById,
  runPlacementCode,
  submitPlacementCode,
} from "../../lib/placementApi";
import toast from "react-hot-toast";
import PomodoroTimer from "../../components/PomodoroTimer";

const CODE_TEMPLATES = {
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
  java: `public class Solution {
    public void solve() {
        // Write your solution here
    }
}`,
};

const CodingProblemPage = () => {
  const { companyId, problemId } = useParams();
  const queryClient = useQueryClient();

  const [activeLeftTab, setActiveLeftTab] = useState("description"); // "description" | "hints" | "approach" | "solution"
  const [activeConsoleTab, setActiveConsoleTab] = useState("testcases"); // "testcases" | "result"
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [revealedHints, setRevealedHints] = useState({});
  const [showPomodoro, setShowPomodoro] = useState(false);

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["placementQuestion", problemId],
    queryFn: () => getPlacementQuestionById(problemId),
    enabled: !!problemId,
  });

  const question = data?.question || null;

  // Initialize code when question or language changes
  useEffect(() => {
    if (question) {
      const starter =
        question.starterCode?.[selectedLanguage] ||
        CODE_TEMPLATES[selectedLanguage] ||
        "";
      setCode(starter);
    }
  }, [question, selectedLanguage]);

  // Run code against sample test cases or custom input
  const { mutate: runCodeMutation } = useMutation({
    mutationFn: runPlacementCode,
    onMutate: () => {
      setIsRunning(true);
      setActiveConsoleTab("result");
    },
    onSuccess: (res) => {
      setIsRunning(false);
      setRunResults(res);
      if (res.customRun) {
        toast.success("Custom input executed successfully!");
      } else if (res.allPassed) {
        toast.success("All sample test cases passed! ✨");
      } else {
        toast.error("Some sample test cases failed.");
      }
    },
    onError: (err) => {
      setIsRunning(false);
      toast.error(err.response?.data?.message || "Execution failed.");
    },
  });

  const handleRunCode = () => {
    if (!code.trim() || !question) return;
    runCodeMutation({
      questionId: question._id,
      code,
      language: selectedLanguage,
      customInput,
    });
  };

  // Submit code against all test cases
  const { mutate: submitCodeMutation } = useMutation({
    mutationFn: submitPlacementCode,
    onMutate: () => {
      setIsSubmitting(true);
      setActiveConsoleTab("result");
    },
    onSuccess: (res) => {
      setIsSubmitting(false);
      setSubmissionResult(res);
      queryClient.invalidateQueries({ queryKey: ["companyPlacementDetails", companyId] });
      queryClient.invalidateQueries({ queryKey: ["placementUserProgress"] });
      queryClient.invalidateQueries({ queryKey: ["placementQuestion", problemId] });

      if (res.isAccepted) {
        toast.success("Accepted! All test cases passed 🎉", { duration: 5000 });
      } else {
        toast.error(`Verdict: ${res.status}`);
      }
    },
    onError: (err) => {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || "Submission failed.");
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

  if (isLoading || !question) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-base-content/60">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">Loading Coding Environment...</span>
        </div>
      </div>
    );
  }

  const diffColor =
    question.difficulty === "Easy"
      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
      : question.difficulty === "Medium"
      ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
      : "text-rose-500 bg-rose-500/10 border-rose-500/20";

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-2 sm:p-4 font-sans text-base-content flex flex-col">
      {/* ── TOP NAV BAR ── */}
      <div className="flex items-center justify-between bg-base-100 px-4 py-2.5 rounded-2xl border border-base-content/10 shadow-xs mb-3">
        <div className="flex items-center gap-3">
          <Link
            to={`/placement/${companyId}/coding`}
            className="p-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs uppercase tracking-wider text-primary">
              {companyId?.toUpperCase()}
            </span>
            <span className="text-base-content/30">•</span>
            <h1 className="font-black text-sm text-base-content truncate max-w-[200px] sm:max-w-md">
              {question.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pomodoro Focus Button */}
          <button
            onClick={() => setShowPomodoro((prev) => !prev)}
            className="btn btn-ghost btn-xs rounded-xl border border-base-content/10 gap-1 text-[11px] font-bold hover:bg-base-200"
            title="Open Pomodoro Focus Timer"
          >
            <span>🍅</span>
            <span className="hidden sm:inline">Pomodoro</span>
          </button>

          {question.isSolved && (
            <span className="badge badge-success gap-1 text-[10px] font-black uppercase text-white py-1">
              <CheckCircle2 className="size-3" /> Solved
            </span>
          )}
        </div>
      </div>

      {/* ── SPLIT MAIN WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
        {/* ── LEFT PANE: PROBLEM DESCRIPTION & TABS (6 cols on lg) ── */}
        <div className="lg:col-span-6 bg-base-100 rounded-2xl border border-base-content/10 shadow-sm flex flex-col overflow-hidden min-h-[500px]">
          {/* Tab Header */}
          <div className="flex items-center gap-1 border-b border-base-content/10 px-3 bg-base-200/40 shrink-0">
            {[
              { id: "description", label: "Description", icon: Code2 },
              { id: "hints", label: `Hints (${question.hints?.length || 0})`, icon: Lightbulb },
              { id: "approach", label: "Approach", icon: Layers },
              { id: "solution", label: "Solution", icon: Unlock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id)}
                className={`px-3.5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeLeftTab === tab.id
                    ? "border-primary text-primary bg-base-100"
                    : "border-transparent text-base-content/60 hover:text-base-content"
                }`}
              >
                <tab.icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-5 text-sm leading-relaxed">
            {activeLeftTab === "description" && (
              <div className="space-y-4">
                {/* Title & Badges */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black text-base-content">{question.title}</h2>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${diffColor}`}>
                      {question.difficulty}
                    </span>
                    {question.frequency && (
                      <span className="badge badge-xs bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase">
                        🔥 {question.frequency} Frequency
                      </span>
                    )}
                  </div>

                  {/* Company Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase text-base-content/40 mr-1">
                      Companies:
                    </span>
                    {question.companies?.map((comp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-base-200 text-base-content/70 uppercase"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Problem Description */}
                <div className="prose prose-sm max-w-none text-base-content/90 font-medium whitespace-pre-line leading-relaxed">
                  {question.problemDescription}
                </div>

                {/* Examples */}
                {question.examples?.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-black uppercase tracking-wider text-base-content/60 block">
                      Examples
                    </span>
                    {question.examples.map((ex, idx) => (
                      <div key={idx} className="p-4 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1.5 font-mono text-xs">
                        <div className="font-bold text-base-content">
                          <span className="text-primary font-black">Example {idx + 1}:</span>
                        </div>
                        <div>
                          <span className="text-base-content/60 font-bold">Input: </span>
                          <span className="text-base-content">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-base-content/60 font-bold">Output: </span>
                          <span className="text-emerald-500 font-bold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="font-sans text-base-content/70 text-xs pt-1">
                            <span className="font-bold">Explanation: </span>
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {question.constraints?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-black uppercase tracking-wider text-base-content/60 block">
                      Constraints
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs font-mono text-base-content/80">
                      {question.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Topics */}
                {question.topics?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-base-content/10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-base-content/50 block">
                      Relevant Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {question.topics.map((t, idx) => (
                        <span key={idx} className="badge badge-sm font-bold bg-base-200 text-base-content/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* HINTS TAB */}
            {activeLeftTab === "hints" && (
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-base-content/60 block">
                  Problem Hints
                </span>
                {question.hints?.length > 0 ? (
                  question.hints.map((hint, idx) => {
                    const isRevealed = revealedHints[idx];
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-amber-500 flex items-center gap-1.5">
                            <Lightbulb className="size-4" />
                            Hint {idx + 1}
                          </span>
                          {!isRevealed && (
                            <button
                              onClick={() => setRevealedHints((prev) => ({ ...prev, [idx]: true }))}
                              className="btn btn-ghost btn-xs font-bold text-[10px] text-primary"
                            >
                              Reveal Hint
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <p className="text-xs text-base-content/90 font-medium leading-relaxed">
                            {hint}
                          </p>
                        ) : (
                          <p className="text-xs text-base-content/40 italic">
                            Click reveal to view guidance without spoiling the solution.
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-base-content/50">No hints available for this question.</p>
                )}
              </div>
            )}

            {/* APPROACH TAB */}
            {activeLeftTab === "approach" && (
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-base-content/60 block">
                  Optimal Algorithmic Approach
                </span>
                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-content/5 space-y-2 whitespace-pre-line text-xs leading-relaxed text-base-content/90 font-medium">
                  {question.approach || "Approach details being compiled."}
                </div>
              </div>
            )}

            {/* SOLUTION TAB */}
            {activeLeftTab === "solution" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-base-content/60">
                    Official Reference Solution
                  </span>
                  {!showSolution && (
                    <button
                      onClick={() => setShowSolution(true)}
                      className="btn btn-warning btn-xs rounded-xl font-bold uppercase text-[10px] tracking-wider gap-1"
                    >
                      <Unlock className="size-3" />
                      Unlock Solution
                    </button>
                  )}
                </div>

                {showSolution ? (
                  <div className="space-y-4">
                    {/* Complexity analysis */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-base-200 rounded-xl border border-base-content/5">
                        <span className="text-[10px] font-black uppercase text-base-content/40 block">Time Complexity</span>
                        <span className="text-xs font-mono font-bold text-primary">{question.timeComplexity || "O(n)"}</span>
                      </div>
                      <div className="p-3 bg-base-200 rounded-xl border border-base-content/5">
                        <span className="text-[10px] font-black uppercase text-base-content/40 block">Space Complexity</span>
                        <span className="text-xs font-mono font-bold text-secondary">{question.spaceComplexity || "O(1)"}</span>
                      </div>
                    </div>

                    {/* Solution Code */}
                    <div className="p-4 bg-[#0d1117] rounded-2xl text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed border border-base-content/10 shadow-inner">
                      {question.solutionCode?.[selectedLanguage] || question.solutionCode?.javascript || "// Solution code"}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-base-200/50 rounded-2xl border border-base-content/10 text-center space-y-3">
                    <Unlock className="size-8 mx-auto text-amber-500/60" />
                    <h4 className="font-black text-sm">Solution is Hidden</h4>
                    <p className="text-xs text-base-content/60 max-w-xs mx-auto">
                      Try solving the problem yourself first using the hints and test cases.
                    </p>
                    <button
                      onClick={() => setShowSolution(true)}
                      className="btn btn-primary btn-sm rounded-xl font-bold"
                    >
                      View Solution Anyway
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANE: MONACO CODE EDITOR & CONSOLE (6 cols on lg) ── */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {/* Editor Container */}
          <div className="bg-base-100 rounded-2xl border border-base-content/10 shadow-sm flex flex-col overflow-hidden h-[420px] sm:h-[480px]">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-base-content/10 bg-base-200/50 shrink-0">
              <div className="flex items-center gap-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="select select-bordered select-xs font-mono font-bold text-xs bg-base-100 rounded-xl"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ (GCC)</option>
                  <option value="java">Java (OpenJDK)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const starter = question.starterCode?.[selectedLanguage] || CODE_TEMPLATES[selectedLanguage];
                    setCode(starter);
                    toast.success("Code reset to template.");
                  }}
                  className="btn btn-ghost btn-xs text-[11px] font-bold gap-1"
                >
                  <RotateCcw className="size-3" />
                  Reset
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    toast.success("Code copied!");
                  }}
                  className="btn btn-ghost btn-xs text-[11px] font-bold gap-1"
                >
                  <Copy className="size-3" />
                  Copy
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden relative">
              <Editor
                height="100%"
                language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>

          {/* Bottom Console Panel */}
          <div className="bg-base-100 rounded-2xl border border-base-content/10 shadow-sm flex flex-col overflow-hidden min-h-[220px]">
            {/* Console Header Tabs & Action Buttons */}
            <div className="flex items-center justify-between px-3 border-b border-base-content/10 bg-base-200/40 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveConsoleTab("testcases")}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeConsoleTab === "testcases"
                      ? "border-primary text-primary bg-base-100"
                      : "border-transparent text-base-content/60 hover:text-base-content"
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveConsoleTab("result")}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeConsoleTab === "result"
                      ? "border-primary text-primary bg-base-100"
                      : "border-transparent text-base-content/60 hover:text-base-content"
                  }`}
                >
                  Console Output
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 py-1.5">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="btn btn-ghost btn-sm rounded-xl font-bold uppercase text-xs tracking-wider gap-1.5 border border-base-content/10"
                >
                  {isRunning ? <span className="loading loading-spinner size-3" /> : <Play className="size-3.5 text-emerald-500 fill-current" />}
                  Run Code
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting || isRunning}
                  className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider gap-1.5 shadow-md px-4"
                >
                  {isSubmitting ? <span className="loading loading-spinner size-3" /> : <Send className="size-3.5" />}
                  Submit
                </button>
              </div>
            </div>

            {/* Console Content */}
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar font-mono text-xs">
              {activeConsoleTab === "testcases" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-base-content/60">
                    <span>Sample Test Inputs</span>
                  </div>
                  <div className="space-y-2">
                    {(question.testCases || []).filter((tc) => !tc.isHidden).map((tc, idx) => (
                      <div key={idx} className="p-2.5 bg-base-200/70 rounded-xl space-y-1">
                        <div className="text-[10px] font-bold text-primary">Case {idx + 1}:</div>
                        <div className="text-base-content">{tc.input}</div>
                        <div className="text-base-content/50 text-[10px]">Expected: {tc.expectedOutput}</div>
                      </div>
                    ))}
                  </div>

                  {/* Custom input */}
                  <div className="pt-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-base-content/50 block mb-1">
                      Custom Stdin Input (Optional)
                    </span>
                    <input
                      type="text"
                      placeholder="Enter custom input string..."
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="input input-bordered input-sm w-full font-mono text-xs rounded-xl"
                    />
                  </div>
                </div>
              ) : (
                /* Execution Results View */
                <div className="space-y-3">
                  {submissionResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-black uppercase tracking-wider ${
                            submissionResult.isAccepted ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {submissionResult.status}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-base-content/60">
                          <span>Runtime: {submissionResult.runtimeMs}ms</span>
                          <span>•</span>
                          <span>Memory: {Math.round(submissionResult.memoryKb / 1024)}MB</span>
                        </div>
                      </div>

                      {/* Test Case breakdown */}
                      <div className="space-y-2">
                        {submissionResult.testResults?.map((res, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border ${
                              res.passed
                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>Test Case {res.testCaseIndex}: {res.passed ? "Passed ✓" : "Failed ✗"}</span>
                              {res.isHidden && <span className="badge badge-xs text-[9px]">Hidden Case</span>}
                            </div>
                            {!res.isHidden && (
                              <div className="text-[11px] font-normal pt-1 space-y-0.5">
                                <div>Input: {res.input}</div>
                                <div>Expected: {res.expectedOutput}</div>
                                <div>Output: {res.actualOutput}</div>
                              </div>
                            )}
                            {res.error && (
                              <div className="text-rose-500 text-[10px] pt-1 font-mono whitespace-pre-wrap">
                                {res.error}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : runResults ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-black text-xs uppercase ${
                            runResults.allPassed ? "text-emerald-500" : "text-amber-500"
                          }`}
                        >
                          {runResults.allPassed ? "Sample Tests Passed" : "Execution Finished"}
                        </span>
                      </div>
                      {runResults.results?.map((res, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border ${
                            res.passed
                              ? "bg-emerald-500/5 border-emerald-500/20"
                              : "bg-rose-500/5 border-rose-500/20"
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span className={res.passed ? "text-emerald-500" : "text-rose-500"}>
                              Case {res.testCaseIndex}: {res.passed ? "Passed ✓" : "Failed ✗"}
                            </span>
                            {res.executionTime && <span className="text-[10px] text-base-content/40">{res.executionTime}ms</span>}
                          </div>
                          <div className="text-[11px] pt-1 text-base-content/70 space-y-0.5 font-mono">
                            <div>Input: {res.input}</div>
                            <div>Expected: {res.expectedOutput}</div>
                            <div>Actual: {res.actualOutput}</div>
                          </div>
                          {res.error && (
                            <div className="text-rose-500 text-[10px] pt-1 font-mono whitespace-pre-wrap border-t border-rose-500/20 mt-1">
                              {res.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-base-content/40">
                      Click "Run Code" or "Submit" to view execution output.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Focus Timer */}
      <PomodoroTimer isOpen={showPomodoro} onClose={() => setShowPomodoro(false)} />
    </div>
  );
};

export default CodingProblemPage;

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Editor from "@monaco-editor/react";
import {
  ShieldAlert,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Play,
  Flame,
  Brain,
  BookOpen,
  Layers,
  Code2,
  TrendingUp,
  RotateCcw,
  Copy,
  Terminal,
  Sparkles,
  Send,
} from "lucide-react";
import {
  startPlacementMockTest,
  submitPlacementMockTest,
  runPlacementCode,
} from "../../lib/placementApi";
import toast from "react-hot-toast";

const CODE_TEMPLATES = {
  javascript: `function solve(input) {
    // Write your solution here
    console.log(input);
}`,
  python: `class Solution:
    def solve(self, input_data):
        # Write your solution here
        print(input_data)`,
  cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Write your solution here
    string s;
    if (cin >> s) cout << s << endl;
    return 0;
}`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            System.out.println(sc.next());
        }
    }
}`,
};

const MockTestPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> option index or coding object
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testReport, setTestReport] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(90 * 60);

  // Coding question compiler state
  const [selectedLanguage, setSelectedLanguage] = useState("java");
  const [codeMap, setCodeMap] = useState({}); // questionId -> code string
  const [customInput, setCustomInput] = useState("");
  const [activeCodingTab, setActiveCodingTab] = useState("editor"); // "editor" | "output"
  const [runResult, setRunResult] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["placementMockTestStart", companyId],
    queryFn: () => startPlacementMockTest(companyId),
    staleTime: Infinity,
  });

  const sections = data?.sections || [];
  const currentSection = sections[activeSectionIndex] || null;
  const currentQuestions = currentSection?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex] || null;

  // Initialize code when switching to a coding question
  useEffect(() => {
    if (currentQuestion && currentQuestion.category === "coding") {
      const qId = currentQuestion._id;
      if (!codeMap[qId]) {
        const starter =
          currentQuestion.starterCode?.[selectedLanguage] ||
          CODE_TEMPLATES[selectedLanguage] ||
          "// Write your code here";
        setCodeMap((prev) => ({ ...prev, [qId]: starter }));
      }
      if (currentQuestion.testCases?.[0]?.input) {
        setCustomInput(currentQuestion.testCases[0].input);
      }
    }
  }, [currentQuestion, selectedLanguage]);

  // Countdown timer
  useEffect(() => {
    if (!isTestSubmitted && secondsRemaining > 0) {
      const timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTestSubmitted, secondsRemaining]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const { mutate: submitMockMutation, isPending: isSubmitting } = useMutation({
    mutationFn: submitPlacementMockTest,
    onSuccess: (res) => {
      setIsTestSubmitted(true);
      setTestReport(res.result);
      queryClient.invalidateQueries({ queryKey: ["placementUserProgress"] });
      queryClient.invalidateQueries({ queryKey: ["companyPlacementDetails", companyId] });
      toast.success("Mock OA submitted successfully! 🎯");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit assessment.");
    },
  });

  const { mutate: executeCode, isPending: isExecutingCode } = useMutation({
    mutationFn: runPlacementCode,
    onSuccess: (res) => {
      setRunResult(res);
      setActiveCodingTab("output");
      if (res.customRun) {
        if (res.error) {
          toast.error("Execution finished with errors / stderr.");
        } else {
          toast.success("Code executed successfully! ✨");
        }
      } else if (res.allPassed) {
        toast.success("All sample test cases passed! 🎯");
      } else {
        toast.error("Some sample test cases failed.");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Execution engine encountered an error.");
    },
  });

  const handleRunCode = () => {
    if (!currentQuestion) return;
    const currentCode =
      codeMap[currentQuestion._id] ||
      currentQuestion.starterCode?.[selectedLanguage] ||
      CODE_TEMPLATES[selectedLanguage];

    executeCode({
      questionId: currentQuestion._id,
      language: selectedLanguage,
      code: currentCode,
      customInput: customInput,
    });
  };

  const handleSaveCodingAnswer = () => {
    if (!currentQuestion) return;
    const currentCode =
      codeMap[currentQuestion._id] ||
      currentQuestion.starterCode?.[selectedLanguage] ||
      CODE_TEMPLATES[selectedLanguage];

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        isAccepted: true,
        language: selectedLanguage,
        code: currentCode,
      },
    }));
    toast.success("Code solution saved to assessment! 💻");
  };

  const handleAutoSubmit = () => {
    toast.error("Time is up! Submitting your assessment...");
    submitMockMutation({
      companySlug: companyId,
      answers,
      timeTakenSeconds: 90 * 60 - secondsRemaining,
    });
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to finish and submit this Mock OA Assessment?")) {
      submitMockMutation({
        companySlug: companyId,
        answers,
        timeTakenSeconds: 90 * 60 - secondsRemaining,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-base-content/60">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">Assembling Mock OA Test...</span>
        </div>
      </div>
    );
  }

  if (isTestSubmitted && testReport) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-4 sm:p-8 font-sans text-base-content">
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="bg-base-100 rounded-3xl p-6 sm:p-10 border border-base-content/10 text-center space-y-6 shadow-xl">
            <Award className="size-16 mx-auto text-primary animate-bounce" />
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                {companyId?.toUpperCase()} Mock OA Performance Report
              </h1>
              <p className="text-xs sm:text-sm text-base-content/60">
                Completed on {new Date(testReport.completedAt).toLocaleString()}
              </p>
            </div>

            {/* Score Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <span className="text-[10px] font-black uppercase text-primary block">Score</span>
                <span className="text-2xl font-black text-primary">{testReport.score} / {testReport.totalMarks}</span>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <span className="text-[10px] font-black uppercase text-emerald-600 block">Percentage</span>
                <span className="text-2xl font-black text-emerald-600">{testReport.percentage}%</span>
              </div>
              <div className="p-4 bg-base-200 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-base-content/50 block">Time Taken</span>
                <span className="text-2xl font-black text-base-content">{formatTimer(testReport.timeTakenSeconds)}</span>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <span className="text-[10px] font-black uppercase text-amber-600 block">Status</span>
                <span className="text-2xl font-black text-amber-600">
                  {testReport.percentage >= 70 ? "OA Clear" : "Needs Review"}
                </span>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="space-y-3 pt-2 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-base-content/60 block">
                Section-Wise Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(testReport.categoryBreakdown || {}).map(([cat, val]) => (
                  <div key={cat} className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="capitalize">{cat}</span>
                      <span className="text-primary font-black">{val.score} / {val.total} marks</span>
                    </div>
                    <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${val.total > 0 ? (val.score / val.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {testReport.recommendations?.length > 0 && (
              <div className="space-y-2 text-left pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-base-content/60 block">
                  Next Steps to Improve
                </span>
                <div className="space-y-2">
                  {testReport.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-xs font-bold text-base-content/90">
                      → {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3 pt-4">
              <Link to={`/placement/${companyId}`} className="btn btn-primary rounded-2xl font-black text-xs uppercase tracking-wider px-6">
                Back to Company Track
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCodingQuestion = currentQuestion?.category === "coding";
  const currentCode = currentQuestion
    ? codeMap[currentQuestion._id] ||
      currentQuestion.starterCode?.[selectedLanguage] ||
      CODE_TEMPLATES[selectedLanguage] ||
      ""
    : "";

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-3 sm:p-6 font-sans text-base-content">
      <div className="container mx-auto max-w-[1400px] space-y-6">
        {/* ── 1. TEST HEADER WITH TIMER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-4 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              to={`/placement/${companyId}`}
              className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wider text-primary">
                  {companyId?.toUpperCase()}
                </span>
                <span className="text-base-content/40">•</span>
                <h1 className="font-black text-base sm:text-lg text-base-content">Online Assessment (OA) Simulation</h1>
              </div>
              <p className="text-xs text-base-content/60 font-medium">
                Standard {companyId?.toUpperCase()} Placement Pattern
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-error/10 border border-error/20 rounded-2xl text-error font-mono font-black text-sm">
              <Clock className="size-4 animate-pulse" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="btn btn-error btn-sm rounded-xl font-black uppercase text-xs tracking-wider shadow-md px-5"
            >
              {isSubmitting ? <span className="loading loading-spinner size-3" /> : "Submit Test"}
            </button>
          </div>
        </div>

        {/* ── 2. SECTION TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSectionIndex(idx);
                setCurrentQuestionIndex(0);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeSectionIndex === idx
                  ? "bg-primary text-primary-content shadow-md"
                  : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
              }`}
            >
              <span>{sec.sectionName}</span>
              <span className="ml-2 opacity-70 text-[10px]">({sec.questions?.length})</span>
            </button>
          ))}
        </div>

        {/* ── 3. QUESTION WORKSPACE ── */}
        {currentQuestion ? (
          !isCodingQuestion ? (
            /* ── MCQ QUESTION LAYOUT ── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-content/10 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b border-base-content/5 pb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">
                    Question {currentQuestionIndex + 1} of {currentQuestions.length}
                  </span>
                  <span className="badge badge-sm font-bold bg-base-200 uppercase text-[10px]">
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-base-content leading-relaxed whitespace-pre-line">
                  {currentQuestion.description || currentQuestion.title}
                </h3>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {(currentQuestion.options || []).map((option, idx) => {
                    const isSelected = answers[currentQuestion._id] === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [currentQuestion._id]: idx,
                          }))
                        }
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                          isSelected
                            ? "bg-primary/10 border-primary/40 text-primary shadow-xs"
                            : "border-base-content/10 hover:bg-base-200/50"
                        }`}
                      >
                        <div
                          className={`size-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isSelected ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/70"
                          }`}
                        >
                          {["A", "B", "C", "D"][idx]}
                        </div>
                        <span className="text-sm font-semibold flex-1 leading-snug">{option}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-base-content/5">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="btn btn-ghost btn-sm rounded-xl font-bold gap-1 text-xs"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.min(currentQuestions.length - 1, prev + 1))
                    }
                    disabled={currentQuestionIndex === currentQuestions.length - 1}
                    className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Right: Question Palette */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-base-100 rounded-3xl p-5 border border-base-content/10 shadow-sm space-y-4 relative z-10">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Layers className="size-4" />
                      </div>
                      <span className="font-bold text-sm text-base-content">Section Questions</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      {Object.keys(answers).length} / {currentQuestions.length} Answered
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar p-0.5">
                    {currentQuestions.map((q, idx) => {
                      const isAnswered = answers[q._id] !== undefined;
                      const isCurrent = currentQuestionIndex === idx;

                      let tileClass = "bg-base-200/70 hover:bg-base-200 text-base-content/80 border border-base-content/10 hover:border-base-content/25";

                      if (isAnswered) {
                        tileClass = "bg-primary text-primary-content font-bold shadow-xs border-transparent";
                      }

                      if (isCurrent) {
                        tileClass += " ring-2 ring-primary ring-offset-2 ring-offset-base-100 font-bold scale-[1.03]";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`h-10 rounded-2xl flex items-center justify-center text-xs font-semibold transition-all duration-150 cursor-pointer ${tileClass}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── FULL CODING PROBLEM & LIVE MONACO COMPILER LAYOUT ── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Pane: Problem Details (5 Cols) */}
              <div className="lg:col-span-5 bg-base-100 rounded-3xl p-6 border border-base-content/10 shadow-md space-y-5 flex flex-col justify-between max-h-[780px] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-base-content/5 pb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                      Coding Challenge {currentQuestionIndex + 1} of {currentQuestions.length}
                    </span>
                    <span className="badge badge-sm font-bold bg-base-200 uppercase text-[10px]">
                      {currentQuestion.difficulty || "Medium"}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-base-content">{currentQuestion.title}</h2>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(currentQuestion.tags || ["Coding Assessment", "Algorithms"]).map((t, idx) => (
                        <span key={idx} className="badge badge-xs font-bold bg-base-200 text-base-content/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-base-content/80 leading-relaxed whitespace-pre-line">
                    <p>{currentQuestion.problemDescription || currentQuestion.description}</p>
                  </div>

                  {/* Examples */}
                  {currentQuestion.testCases && currentQuestion.testCases.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-base-content/50 block">
                        Example Test Cases
                      </span>
                      {currentQuestion.testCases.slice(0, 2).map((tc, idx) => (
                        <div key={idx} className="p-3 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1.5 text-xs font-mono">
                          <div>
                            <span className="font-bold text-base-content/50">Input: </span>
                            <span className="text-base-content font-semibold">{tc.input}</span>
                          </div>
                          <div>
                            <span className="font-bold text-base-content/50">Expected: </span>
                            <span className="text-emerald-500 font-bold">{tc.output}</span>
                          </div>
                          {tc.explanation && (
                            <p className="text-[11px] font-sans text-base-content/60 pt-1">{tc.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Constraints */}
                  {currentQuestion.constraints && (
                    <div className="p-3 bg-base-200/40 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-[11px] uppercase text-base-content/50 block">Constraints:</span>
                      <ul className="list-disc list-inside text-base-content/70 text-[11px] space-y-0.5">
                        {Array.isArray(currentQuestion.constraints) ? (
                          currentQuestion.constraints.map((c, idx) => <li key={idx}>{c}</li>)
                        ) : (
                          <li>{currentQuestion.constraints}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Section Question Switcher */}
                <div className="pt-4 border-t border-base-content/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {currentQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`size-8 rounded-xl text-xs font-black transition-all ${
                          currentQuestionIndex === idx
                            ? "bg-primary text-primary-content font-bold shadow-xs"
                            : "bg-base-200 text-base-content/70 hover:bg-base-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveCodingAnswer}
                    className={`btn btn-sm rounded-xl font-bold gap-1.5 ${
                      answers[currentQuestion._id]?.isAccepted
                        ? "btn-success text-white"
                        : "btn-primary"
                    }`}
                  >
                    <Send className="size-3.5" />
                    <span>{answers[currentQuestion._id]?.isAccepted ? "Code Saved ✓" : "Save Solution"}</span>
                  </button>
                </div>
              </div>

              {/* Right Pane: Live Monaco Code Editor & Compiler Terminal (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                {/* Editor Container */}
                <div className="bg-base-100 rounded-3xl border border-base-content/10 shadow-md flex flex-col overflow-hidden h-[480px]">
                  {/* Editor Header Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-base-content/10 bg-base-200/60 shrink-0">
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => {
                          const lang = e.target.value;
                          setSelectedLanguage(lang);
                          const starter =
                            currentQuestion.starterCode?.[lang] ||
                            CODE_TEMPLATES[lang] ||
                            "// Code";
                          setCodeMap((prev) => ({ ...prev, [currentQuestion._id]: starter }));
                        }}
                        className="select select-bordered select-xs font-mono font-bold text-xs bg-base-100 rounded-xl"
                      >
                        <option value="java">Java (OpenJDK)</option>
                        <option value="javascript">JavaScript (Node.js)</option>
                        <option value="python">Python 3</option>
                        <option value="cpp">C++ (GCC)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const starter =
                            currentQuestion.starterCode?.[selectedLanguage] ||
                            CODE_TEMPLATES[selectedLanguage];
                          setCodeMap((prev) => ({ ...prev, [currentQuestion._id]: starter }));
                          toast.success("Code reset to template.");
                        }}
                        className="btn btn-ghost btn-xs text-[11px] font-bold gap-1"
                        title="Reset code"
                      >
                        <RotateCcw className="size-3" />
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(currentCode);
                          toast.success("Code copied!");
                        }}
                        className="btn btn-ghost btn-xs text-[11px] font-bold gap-1"
                        title="Copy code"
                      >
                        <Copy className="size-3" />
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Monaco Editor */}
                  <div className="flex-1 min-h-0">
                    <Editor
                      height="100%"
                      language={
                        selectedLanguage === "cpp"
                          ? "cpp"
                          : selectedLanguage === "python"
                          ? "python"
                          : selectedLanguage === "java"
                          ? "java"
                          : "javascript"
                      }
                      value={currentCode}
                      onChange={(value) => {
                        setCodeMap((prev) => ({
                          ...prev,
                          [currentQuestion._id]: value || "",
                        }));
                      }}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 15,
                        lineHeight: 24,
                        fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, 'Courier New', monospace",
                        fontLigatures: true,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: "on",
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Console / Terminal Pane */}
                <div className="bg-base-100 rounded-3xl border border-base-content/10 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCodingTab("editor")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          activeCodingTab === "editor" ? "bg-base-200 text-base-content" : "text-base-content/50"
                        }`}
                      >
                        Test Case Input
                      </button>
                      <button
                        onClick={() => setActiveCodingTab("output")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          activeCodingTab === "output" ? "bg-base-200 text-base-content" : "text-base-content/50"
                        }`}
                      >
                        <Terminal className="size-3.5" />
                        Terminal Output
                      </button>
                    </div>

                    <button
                      onClick={handleRunCode}
                      disabled={isExecutingCode}
                      className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider gap-1.5 shadow-md px-5"
                    >
                      {isExecutingCode ? (
                        <span className="loading loading-spinner size-3.5" />
                      ) : (
                        <Play className="size-3.5 fill-current" />
                      )}
                      <span>Run Code</span>
                    </button>
                  </div>

                  {activeCodingTab === "editor" ? (
                    <div>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter standard input (stdin)..."
                        className="textarea textarea-bordered w-full h-20 font-mono text-xs bg-base-200/50 rounded-2xl resize-none"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-[#0d1117] rounded-2xl font-mono text-xs space-y-2 border border-base-content/10 max-h-48 overflow-y-auto custom-scrollbar">
                      {runResult ? (
                        runResult.customRun ? (
                          <>
                            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/10">
                              <span
                                className={`font-bold ${
                                  !runResult.error ? "text-emerald-400" : "text-rose-400"
                                }`}
                              >
                                Status: {!runResult.error ? "Success ✓" : "Runtime/Compile Error"}
                              </span>
                              {runResult.executionTime && (
                                <span className="text-white/40">{runResult.executionTime}ms</span>
                              )}
                            </div>
                            {runResult.output && (
                              <div>
                                <span className="text-white/40 block text-[10px]">STDOUT:</span>
                                <pre className="text-emerald-300 whitespace-pre-wrap">{runResult.output}</pre>
                              </div>
                            )}
                            {runResult.error && (
                              <div>
                                <span className="text-rose-400/60 block text-[10px]">STDERR:</span>
                                <pre className="text-rose-300 whitespace-pre-wrap">{runResult.error}</pre>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/10">
                              <span className={runResult.allPassed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                {runResult.allPassed ? "All Test Cases Passed ✓" : "Some Test Cases Failed ✗"}
                              </span>
                            </div>
                            {runResult.results?.map((res, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-xl border text-[11px] ${
                                  res.passed
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                                }`}
                              >
                                <div className="font-bold flex items-center justify-between">
                                  <span>Case {res.testCaseIndex}: {res.passed ? "Passed ✓" : "Failed ✗"}</span>
                                  {res.executionTime && <span>{res.executionTime}ms</span>}
                                </div>
                                <div className="pt-1 space-y-0.5 font-mono text-[10px] text-white/80">
                                  <div>Input: {res.input}</div>
                                  <div>Expected: {res.expectedOutput}</div>
                                  <div>Actual: {res.actualOutput}</div>
                                </div>
                                {res.error && (
                                  <div className="text-rose-400 text-[10px] pt-1 whitespace-pre-wrap">{res.error}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <span className="text-white/40 text-xs">
                          Click 'Run Code' to execute your solution against test cases.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="p-12 text-center bg-base-100 rounded-3xl">No questions in this section.</div>
        )}
      </div>
    </div>
  );
};

export default MockTestPage;

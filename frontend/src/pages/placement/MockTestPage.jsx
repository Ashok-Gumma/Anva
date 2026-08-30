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
  Lightbulb,
  Bug,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import {
  startPlacementMockTest,
  submitPlacementMockTest,
  runPlacementCode,
  askPlacementAiCopilot,
} from "../../lib/placementApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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
    return 0;
}`,
  java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
};

const MockTestPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const storageKey = `anva_mock_test_${companyId}`;

  // Helper to load persistent state on page load / refresh
  const loadSavedTestState = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load saved mock test state:", e);
    }
    return null;
  };

  const initialSaved = loadSavedTestState();

  const [testSessionSeed] = useState(() => initialSaved?.testSessionSeed || Date.now());
  const [activeSectionIndex, setActiveSectionIndex] = useState(() => initialSaved?.activeSectionIndex ?? 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => initialSaved?.currentQuestionIndex ?? 0);
  const [answers, setAnswers] = useState(() => initialSaved?.answers || {}); // questionId -> choice or coding object
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testReport, setTestReport] = useState(null);

  // Coding question compiler state
  const [selectedLanguage, setSelectedLanguage] = useState(() => initialSaved?.selectedLanguage || "java");
  const [codingLeftTab, setCodingLeftTab] = useState(() => initialSaved?.codingLeftTab || "description");
  const [codeMap, setCodeMap] = useState(() => initialSaved?.codeMap || {}); // questionId -> code string
  const [customInput, setCustomInput] = useState("");
  const [activeCodingTab, setActiveCodingTab] = useState("editor"); // "editor" | "output"
  const [runResultMap, setRunResultMap] = useState(() => initialSaved?.runResultMap || {});

  // Live Interactive AI Copilot Chat state (per question)
  const [aiChatMap, setAiChatMap] = useState(() => initialSaved?.aiChatMap || {});
  const [aiInputText, setAiInputText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Compute countdown timer from saved target end time to prevent reset on refresh
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    if (initialSaved?.endTime) {
      const remaining = Math.max(0, Math.floor((initialSaved.endTime - Date.now()) / 1000));
      return remaining;
    }
    return (initialSaved?.durationMinutes || 90) * 60;
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["placementMockTestStart", companyId],
    queryFn: () => startPlacementMockTest(companyId),
    initialData: initialSaved?.testData || undefined,
    enabled: !initialSaved?.testData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const testData = data || initialSaved?.testData || null;
  const sections = testData?.sections || [];
  const currentSection = sections[activeSectionIndex] || null;
  const currentQuestions = currentSection?.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex] || null;

  // Active run result for the currently selected question
  const runResult = currentQuestion ? runResultMap[currentQuestion._id] || null : null;

  // Check if current coding question is in the Debugging Round (Round 2)
  const isDebuggingQuestion =
    (currentQuestion?.topics || []).some((t) => ["Debugging Assessment", "Code Correction"].includes(t)) ||
    (currentQuestion?.tags || []).includes("Debugging") ||
    (currentQuestion?.title || "").includes("Debugging") ||
    (currentSection?.sectionName || "").toLowerCase().includes("debugging");

  // Initialize and persist mock test session target end time on first data load
  useEffect(() => {
    if (testData && !initialSaved?.endTime) {
      const dur = testData.durationMinutes || 90;
      const targetEndTime = Date.now() + dur * 60 * 1000;
      setSecondsRemaining(dur * 60);
      try {
        const initialPayload = {
          testSessionSeed,
          activeSectionIndex,
          currentQuestionIndex,
          answers,
          codeMap,
          selectedLanguage,
          codingLeftTab,
          runResultMap,
          aiChatMap,
          durationMinutes: dur,
          endTime: targetEndTime,
          testData,
        };
        localStorage.setItem(storageKey, JSON.stringify(initialPayload));
      } catch (err) {
        console.warn("Failed to set initial test state in localStorage:", err);
      }
    }
  }, [testData]);

  // Persist all state changes (current round, question index, answers, code drafts, AI chat) to localStorage
  useEffect(() => {
    if (!isTestSubmitted && testData) {
      try {
        const saved = loadSavedTestState();
        const stateToSave = {
          testSessionSeed,
          activeSectionIndex,
          currentQuestionIndex,
          answers,
          codeMap,
          selectedLanguage,
          codingLeftTab,
          runResultMap,
          aiChatMap,
          durationMinutes: testData.durationMinutes || 90,
          endTime: saved?.endTime || Date.now() + (secondsRemaining || 5400) * 1000,
          testData: saved?.testData || testData,
        };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      } catch (err) {
        console.warn("Failed to persist mock test state:", err);
      }
    }
  }, [
    activeSectionIndex,
    currentQuestionIndex,
    answers,
    codeMap,
    selectedLanguage,
    codingLeftTab,
    runResultMap,
    aiChatMap,
    isTestSubmitted,
    testData,
  ]);

  // Handle asking AI Copilot for clues (Strictly clues, never answers)
  const handleAskAiCopilot = async (overridePrompt) => {
    const promptToSend = typeof overridePrompt === "string" ? overridePrompt : aiInputText;
    if (!promptToSend.trim() || !currentQuestion || isAiLoading) return;

    const qId = currentQuestion._id;
    const defaultGreeting = [
      {
        role: "assistant",
        text: "👋 I'm your AI Coding Copilot for Round 3. Ask me for intuition clues, edge cases, time/space complexity analysis, or why your logic might be failing. (Note: I will guide your thinking, but will never write the complete code for you!)",
      },
    ];
    const previousMessages = aiChatMap[qId] || defaultGreeting;
    const updatedWithUser = [...previousMessages, { role: "user", text: promptToSend }];

    setAiChatMap((prev) => ({ ...prev, [qId]: updatedWithUser }));
    setAiInputText("");
    setIsAiLoading(true);

    try {
      const res = await askPlacementAiCopilot({
        questionTitle: currentQuestion.title,
        questionDescription: currentQuestion.problemDescription || currentQuestion.description,
        currentCode: codeMap[qId] || "",
        language: selectedLanguage,
        userMessage: promptToSend,
        chatHistory: previousMessages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.text,
        })),
      });

      if (res?.success && res.reply) {
        setAiChatMap((prev) => ({
          ...prev,
          [qId]: [...updatedWithUser, { role: "assistant", text: res.reply }],
        }));
      } else {
        setAiChatMap((prev) => ({
          ...prev,
          [qId]: [
            ...updatedWithUser,
            {
              role: "assistant",
              text: res?.reply || "💡 Here is an algorithmic clue: check your boundary constraints ($N=0$ and array length) and test your logic with simple trace inputs.",
            },
          ],
        }));
      }
    } catch (err) {
      toast.error("AI Copilot request failed. Showing heuristic clue.");
      setAiChatMap((prev) => ({
        ...prev,
        [qId]: [
          ...updatedWithUser,
          {
            role: "assistant",
            text: `💡 **Algorithmic Hint:** ${currentQuestion.hints?.[0] || currentQuestion.approach || "Break the problem down by identifying optimal data structures (e.g. Hash Map, Two Pointers, Monotonic Stack)."}`,
          },
        ],
      }));
    } finally {
      setIsAiLoading(false);
    }
  };

  // Initialize code and tab when switching questions
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
      setCustomInput(currentQuestion.testCases?.[0]?.input || "");
      if (!runResultMap[qId]) {
        setActiveCodingTab("editor");
      }
    }
  }, [currentQuestion?._id, selectedLanguage]);

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
    const safeSecs = Math.max(0, Math.round(Number(totalSeconds) || 0));
    const mins = Math.floor(safeSecs / 60);
    const secs = safeSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const { mutate: submitMockMutation, isPending: isSubmitting } = useMutation({
    mutationFn: submitPlacementMockTest,
    onSuccess: (res) => {
      setIsTestSubmitted(true);
      setTestReport(res.result);
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {}
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
      if (currentQuestion) {
        const qId = currentQuestion._id;
        setRunResultMap((prev) => ({ ...prev, [qId]: res }));
        setActiveCodingTab("output");
        const hasPassed = res.allPassed === true;
        setAnswers((prev) => ({
          ...prev,
          [qId]: {
            isAccepted: hasPassed,
            passedCount: hasPassed ? (res.passedTests || 2) : 0,
            totalTests: res.totalTests || 2,
            language: selectedLanguage,
            code: codeMap[qId] || "",
          },
        }));
      }
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

  const handleRunCode = (runOnlyCustom = false) => {
    if (!currentQuestion) return;
    const isCustom = typeof runOnlyCustom === "boolean" ? runOnlyCustom : false;
    const currentCode =
      codeMap[currentQuestion._id] ||
      currentQuestion.starterCode?.[selectedLanguage] ||
      CODE_TEMPLATES[selectedLanguage];

    executeCode({
      questionId: currentQuestion._id,
      language: selectedLanguage,
      code: currentCode,
      customInput: isCustom ? customInput : "",
      runOnlyCustom: isCustom,
    });
  };

  const handleSaveCodingAnswer = () => {
    if (!currentQuestion) return;
    const currentCode =
      codeMap[currentQuestion._id] ||
      currentQuestion.starterCode?.[selectedLanguage] ||
      CODE_TEMPLATES[selectedLanguage];

    const hasPassed =
      runResult?.allPassed === true ||
      (runResult?.passedTests > 0 && runResult?.passedTests >= (runResult?.totalTests || 1));

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        isAccepted: hasPassed,
        passedCount: hasPassed ? (runResult?.passedTests || 2) : 0,
        totalTests: runResult?.totalTests || 2,
        language: selectedLanguage,
        code: currentCode,
      },
    }));
    if (hasPassed) {
      toast.success("Accepted code solution saved to assessment! 💻✓");
    } else {
      toast.success("Code draft saved to assessment. (Run code to test correctness) 💻");
    }
  };

  const getSubmittableAnswers = () => {
    const finalAnswers = { ...answers };
    if (sections) {
      for (const sec of sections) {
        if (sec.category === "coding") {
          for (const q of sec.questions || []) {
            const qId = q._id;
            const code = codeMap[qId] || q.starterCode?.[selectedLanguage] || "";
            const result = runResultMap[qId];
            const hasPassed =
              result?.allPassed === true ||
              (result?.passedTests > 0 && result?.passedTests >= (result?.totalTests || 1));
            finalAnswers[qId] = {
              ...(finalAnswers[qId] || {}),
              isAccepted: hasPassed,
              passedCount: hasPassed ? (result?.passedTests || 2) : (finalAnswers[qId]?.passedCount || 0),
              totalTests: result?.totalTests || 2,
              language: selectedLanguage,
              code: code,
            };
          }
        }
      }
    }
    return finalAnswers;
  };

  const handleAutoSubmit = () => {
    toast.error("Time is up! Submitting your assessment...");
    const finalAnswers = getSubmittableAnswers();
    const totalDurationSeconds = (testData?.durationMinutes || 90) * 60;
    const timeTaken = Math.max(0, totalDurationSeconds - secondsRemaining);
    submitMockMutation({
      companySlug: companyId,
      answers: finalAnswers,
      allQuestionIds: testData?.allQuestionIds || [],
      timeTakenSeconds: timeTaken,
    });
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to finish and submit this Mock OA Assessment?")) {
      const finalAnswers = getSubmittableAnswers();
      const totalDurationSeconds = (testData?.durationMinutes || 90) * 60;
      const timeTaken = Math.max(0, totalDurationSeconds - secondsRemaining);
      submitMockMutation({
        companySlug: companyId,
        answers: finalAnswers,
        allQuestionIds: testData?.allQuestionIds || [],
        timeTakenSeconds: timeTaken,
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

            {/* Section / Stage Breakdown */}
            <div className="space-y-3 pt-2 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-base-content/60 block">
                {testReport.stageBreakdown ? "Stage-Wise Assessment Breakdown" : "Section-Wise Breakdown"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(testReport.stageBreakdown || testReport.categoryBreakdown || {}).map(([name, val]) => (
                  <div key={name} className="p-4 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-extrabold text-base-content">{name}</span>
                      <span className="text-primary font-black">{val.score} / {val.total} marks</span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          val.total > 0 && val.score === val.total
                            ? "bg-emerald-500"
                            : val.score > 0
                            ? "bg-primary"
                            : "bg-base-content/20"
                        }`}
                        style={{ width: `${val.total > 0 ? (val.score / val.total) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-base-content/50 font-bold pt-0.5">
                      <span>{val.total > 0 ? Math.round((val.score / val.total) * 100) : 0}% Accuracy</span>
                      <span className="uppercase">{val.category || "Assessment"}</span>
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

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Link to={`/placement/${companyId}`} className="btn btn-primary rounded-2xl font-black text-xs uppercase tracking-wider px-6">
                Back to Company Track
              </Link>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem(storageKey);
                  } catch (e) {}
                  window.location.reload();
                }}
                className="btn btn-outline btn-primary rounded-2xl font-black text-xs uppercase tracking-wider px-6 gap-2"
              >
                <RotateCcw className="size-4" />
                Retake Assessment
              </button>
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
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion._id || currentQuestionIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-content/10 shadow-md space-y-6"
                  >
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
                            className={`p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex items-center gap-3.5 ${
                              isSelected
                                ? "bg-primary/10 border-primary/40 text-primary shadow-xs"
                                : "border-base-content/10 hover:bg-base-200/50"
                            }`}
                          >
                            <div
                              className={`size-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
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

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-base-content/10 gap-3">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex > 0) {
                            setCurrentQuestionIndex((prev) => prev - 1);
                          } else if (activeSectionIndex > 0) {
                            const prevSec = activeSectionIndex - 1;
                            setActiveSectionIndex(prevSec);
                            setCurrentQuestionIndex(sections[prevSec].questions.length - 1);
                          }
                        }}
                        disabled={currentQuestionIndex === 0 && activeSectionIndex === 0}
                        className="btn btn-ghost btn-sm rounded-2xl font-bold gap-1 text-xs"
                      >
                        <ChevronLeft className="size-4" />
                        <span>Previous</span>
                      </button>

                      {currentQuestionIndex < currentQuestions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                          className="btn btn-primary btn-sm rounded-2xl font-black uppercase text-xs tracking-wider px-6 shadow-sm gap-1"
                        >
                          <span>Next Question</span>
                          <ChevronRight className="size-4" />
                        </button>
                      ) : activeSectionIndex < sections.length - 1 ? (
                        <button
                          onClick={() => {
                            const nextSec = activeSectionIndex + 1;
                            setActiveSectionIndex(nextSec);
                            setCurrentQuestionIndex(0);
                            toast.success(`Advanced to Section ${nextSec + 1}: ${sections[nextSec]?.sectionName}`);
                          }}
                          className="btn btn-secondary text-secondary-content btn-sm rounded-2xl font-black uppercase text-xs tracking-wider px-6 shadow-md gap-1.5"
                        >
                          <span>Next Section: {sections[activeSectionIndex + 1]?.category?.toUpperCase()}</span>
                          <ChevronRight className="size-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleManualSubmit}
                          disabled={isSubmitting}
                          className="btn btn-success text-white btn-sm rounded-2xl font-black uppercase text-xs tracking-wider px-6 shadow-md gap-1.5"
                        >
                          <Send className="size-3.5" />
                          <span>{isSubmitting ? "Submitting..." : "Submit OA Assessment"}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: Question Palette */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-base-100 rounded-3xl p-5 border border-base-content/10 shadow-sm space-y-4 relative z-10">
                  <div className="flex items-center justify-between pb-1 border-b border-base-content/5">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Layers className="size-4" />
                      </div>
                      <span className="font-bold text-sm text-base-content">Section Questions</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      {currentQuestions.filter((q) => answers[q._id] !== undefined).length} / {currentQuestions.length} Answered
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                    {currentQuestions.map((q, idx) => {
                      const isAnswered = answers[q._id] !== undefined;
                      const isCurrent = currentQuestionIndex === idx;

                      let tileClass = "bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content border border-base-content/10 font-bold";

                      if (isAnswered) {
                        tileClass = "bg-success text-success-content font-bold shadow-xs hover:brightness-105 border-transparent";
                      }

                      if (isCurrent) {
                        tileClass = "bg-primary text-primary-content font-black shadow-md scale-105 ring-2 ring-primary/40 ring-offset-2 ring-offset-base-100 border-transparent";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`size-10 sm:size-11 rounded-2xl flex items-center justify-center text-xs sm:text-sm transition-all duration-150 cursor-pointer ${tileClass}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Palette Status Legend */}
                  <div className="flex items-center justify-between pt-3 border-t border-base-content/10 text-[11px] font-bold text-base-content/60">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-primary ring-2 ring-primary/30" />
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-success" />
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-base-300 border border-base-content/20" />
                      <span>Unanswered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── FULL CODING PROBLEM & LIVE MONACO COMPILER LAYOUT ── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-base-100 rounded-3xl p-6 border border-base-content/10 shadow-md space-y-5 flex flex-col justify-between max-h-[780px] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  {/* If Debugging Round: AI is STRICTLY DISABLED */}
                  {!isDebuggingQuestion && (
                    <div className="flex items-center gap-1.5 p-1 bg-base-200/80 rounded-2xl border border-base-content/5">
                      <button
                        onClick={() => setCodingLeftTab("description")}
                        className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all ${
                          codingLeftTab === "description"
                            ? "bg-base-100 text-base-content shadow-xs"
                            : "text-base-content/60 hover:text-base-content"
                        }`}
                      >
                        Problem Details
                      </button>
                      <button
                        onClick={() => setCodingLeftTab("copilot")}
                        className={`flex-1 py-1.5 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                          codingLeftTab === "copilot"
                            ? "bg-primary text-primary-content shadow-xs"
                            : "text-primary hover:bg-primary/10"
                        }`}
                      >
                        <Sparkles className="size-3.5" />
                        <span>Ask AI Copilot</span>
                        <span className="badge badge-xs bg-primary-content/20 text-current font-extrabold uppercase text-[9px]">
                          Round 3
                        </span>
                      </button>
                    </div>
                  )}

                  {isDebuggingQuestion || codingLeftTab === "description" ? (
                    <>
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

                      {/* Stage-Specific Context Banner */}
                      {isDebuggingQuestion ? (
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-1 text-xs">
                          <span className="font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                            <Bug className="size-3.5" />
                            Round 2: Hands-On Code Debugging (No AI Allowed)
                          </span>
                          <p className="text-[11px] text-base-content/80 font-medium">
                            The starter code preloaded in the compiler has <strong>intentional bugs</strong>. Analyze the code, find the errors, and fix them in the editor. AI Copilot is strictly disabled for this round.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-2xl space-y-1 text-xs">
                          <span className="font-extrabold text-primary flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                            <Sparkles className="size-3.5" />
                            Round 3: AI-Assisted Coding Studio
                          </span>
                          <p className="text-[11px] text-base-content/80 font-medium">
                            Need guidance? Click <strong>"Ask AI Copilot"</strong> tab above to get intuition clues, edge-case hints, and strategy advice (AI will never write the full code for you).
                          </p>
                        </div>
                      )}

                      <div className="space-y-2 text-xs text-base-content/80 leading-relaxed whitespace-pre-line">
                        <p>{currentQuestion.problemDescription || currentQuestion.description}</p>
                      </div>

                      {/* Examples & Test Cases */}
                      {((currentQuestion.examples && currentQuestion.examples.length > 0) || (currentQuestion.testCases && currentQuestion.testCases.length > 0)) && (
                        <div className="space-y-3 pt-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-base-content/50 block">
                            Example Test Cases
                          </span>
                          {(currentQuestion.examples && currentQuestion.examples.length > 0
                            ? currentQuestion.examples
                            : currentQuestion.testCases.slice(0, 2)
                          ).map((ex, idx) => (
                            <div key={idx} className="p-3 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1.5 text-xs font-mono">
                              <div>
                                <span className="font-bold text-base-content/50">Input: </span>
                                <span className="text-base-content font-semibold">{ex.input}</span>
                              </div>
                              <div>
                                <span className="font-bold text-base-content/50">Expected: </span>
                                <span className="text-emerald-500 font-bold">{ex.expectedOutput || ex.output || "—"}</span>
                              </div>
                              {ex.explanation && (
                                <p className="text-[11px] font-sans text-base-content/60 pt-1">{ex.explanation}</p>
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
                    </>
                  ) : (
                    /* ── LIVE INTERACTIVE AI COPILOT CHAT PANE ── */
                    <div className="space-y-3.5 text-xs leading-relaxed animate-in fade-in flex flex-col h-full">
                      {/* Banner */}
                      <div className="p-3 bg-gradient-to-br from-primary/15 via-base-200 to-secondary/15 rounded-2xl border border-primary/20 space-y-1 shadow-xs">
                        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                          <Sparkles className="size-4" />
                          <span>AI Mentor &amp; Clue Assistant</span>
                        </div>
                        <p className="text-[11px] text-base-content/80 font-medium">
                          Ask for intuition clues, edge-case checks, and time/space advice. AI will never write full answers or code.
                        </p>
                      </div>

                      {/* Quick Prompt Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleAskAiCopilot("Can you give me high-level intuition clues and what data structure to use?")}
                          disabled={isAiLoading}
                          className="px-2.5 py-1 rounded-xl bg-base-200 hover:bg-primary/15 hover:text-primary border border-base-content/10 text-[11px] font-bold transition-all text-left cursor-pointer"
                        >
                          💡 Intuition Clues
                        </button>
                        <button
                          onClick={() => handleAskAiCopilot("What are the critical edge cases to watch out for?")}
                          disabled={isAiLoading}
                          className="px-2.5 py-1 rounded-xl bg-base-200 hover:bg-primary/15 hover:text-primary border border-base-content/10 text-[11px] font-bold transition-all text-left cursor-pointer"
                        >
                          ⚠️ Key Edge Cases
                        </button>
                        <button
                          onClick={() => handleAskAiCopilot("What is the optimal time and space complexity requirement?")}
                          disabled={isAiLoading}
                          className="px-2.5 py-1 rounded-xl bg-base-200 hover:bg-primary/15 hover:text-primary border border-base-content/10 text-[11px] font-bold transition-all text-left cursor-pointer"
                        >
                          ⏱️ Complexity Limits
                        </button>
                        <button
                          onClick={() => handleAskAiCopilot("Review my current code logic and tell me if my approach has any flaws.")}
                          disabled={isAiLoading}
                          className="px-2.5 py-1 rounded-xl bg-base-200 hover:bg-primary/15 hover:text-primary border border-base-content/10 text-[11px] font-bold transition-all text-left cursor-pointer"
                        >
                          🔍 Review My Logic
                        </button>
                      </div>

                      {/* Chat Messages Feed */}
                      <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar p-2 bg-base-200/40 rounded-2xl border border-base-content/5">
                        {(aiChatMap[currentQuestion._id] || [
                          {
                            role: "assistant",
                            text: "👋 I'm your AI Coding Copilot for Round 3. Ask me for intuition clues, edge-case checks, or algorithmic strategies. (Note: I will guide your thinking, but will never write the complete code for you!)",
                          },
                        ]).map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start gap-2 ${
                              msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <div
                              className={`size-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-content"
                                  : "bg-secondary/20 text-secondary"
                              }`}
                            >
                              {msg.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                            </div>
                            <div
                              className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] whitespace-pre-line ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-content rounded-tr-none font-medium"
                                  : "bg-base-100 text-base-content border border-base-content/10 rounded-tl-none font-medium shadow-xs"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}

                        {isAiLoading && (
                          <div className="flex items-center gap-2 text-xs text-base-content/60 italic p-2 bg-base-100 rounded-xl border border-base-content/5">
                            <Loader2 className="size-3.5 animate-spin text-primary" />
                            <span>AI Copilot is analyzing clues...</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Chat Input */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAskAiCopilot();
                        }}
                        className="flex items-center gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={aiInputText}
                          onChange={(e) => setAiInputText(e.target.value)}
                          placeholder="Ask AI for a hint or edge-case..."
                          disabled={isAiLoading}
                          className="input input-sm flex-1 rounded-xl bg-base-200 border-base-content/10 text-xs focus:border-primary focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isAiLoading || !aiInputText.trim()}
                          className="btn btn-sm btn-primary rounded-xl px-3 font-bold gap-1 text-xs shadow-xs"
                        >
                          <Send className="size-3.5" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Section Question Switcher & Action */}
                <div className="pt-4 border-t border-base-content/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {currentQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`size-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          currentQuestionIndex === idx
                            ? "bg-primary text-primary-content font-bold shadow-xs scale-105"
                            : answers[q._id]?.isAccepted
                            ? "bg-success/20 text-success border border-success/30 font-bold"
                            : "bg-base-200 text-base-content/70 hover:bg-base-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveCodingAnswer}
                      className={`btn btn-sm rounded-xl font-bold gap-1.5 ${
                        answers[currentQuestion._id]?.isAccepted
                          ? "btn-success text-white shadow-sm"
                          : "btn-primary"
                      }`}
                    >
                      <Send className="size-3.5" />
                      <span>{answers[currentQuestion._id]?.isAccepted ? "Code Saved ✓" : "Save Solution"}</span>
                    </button>

                    {currentQuestionIndex < currentQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="btn btn-neutral btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-3 gap-1"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="size-3.5" />
                      </button>
                    ) : activeSectionIndex < sections.length - 1 ? (
                      <button
                        onClick={() => {
                          const nextSec = activeSectionIndex + 1;
                          setActiveSectionIndex(nextSec);
                          setCurrentQuestionIndex(0);
                          toast.success(`Advanced to ${sections[nextSec]?.sectionName}`);
                        }}
                        className="btn btn-secondary text-secondary-content btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-4 shadow-md gap-1.5"
                      >
                        <span>Next Round →</span>
                        <ChevronRight className="size-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleManualSubmit}
                        disabled={isSubmitting}
                        className="btn btn-success text-white btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-4 shadow-md gap-1.5"
                      >
                        <Send className="size-3.5" />
                        <span>{isSubmitting ? "Submitting..." : "Finish OA"}</span>
                      </button>
                    )}
                  </div>
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRunCode(false)}
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
                                  runResult.error
                                    ? "text-rose-400"
                                    : runResult.isMatch === false
                                    ? "text-rose-400"
                                    : runResult.isMatch === true
                                    ? "text-emerald-400"
                                    : "text-cyan-400"
                                }`}
                              >
                                Status:{" "}
                                {runResult.error
                                  ? "Runtime / Compile Error ✗"
                                  : runResult.isMatch === false
                                  ? "Wrong Answer ✗"
                                  : runResult.isMatch === true
                                  ? "Passed ✓"
                                  : "Execution Finished"}
                              </span>
                              {runResult.executionTime && (
                                <span className="text-white/40">{runResult.executionTime}ms</span>
                              )}
                            </div>
                            {runResult.expectedOutput && (
                              <div className="text-[10px] text-white/60">
                                Expected: <span className="text-emerald-400 font-mono">{runResult.expectedOutput}</span>
                              </div>
                            )}
                            {runResult.output && (
                              <div>
                                <span className="text-white/40 block text-[10px]">Actual Output:</span>
                                <pre className={`${runResult.isMatch === false ? "text-rose-300" : "text-emerald-300"} whitespace-pre-wrap`}>
                                  {runResult.output}
                                </pre>
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

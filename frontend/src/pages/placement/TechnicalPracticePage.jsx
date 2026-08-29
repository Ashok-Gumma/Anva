import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Code,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Check,
  RotateCcw,
  Sparkles,
  Timer,
  Layers,
} from "lucide-react";
import {
  getPlacementQuestions,
  submitPlacementAnswer,
  resetPlacementProgress,
} from "../../lib/placementApi";
import { motion, AnimatePresence } from "framer-motion";
import PomodoroTimer from "../../components/PomodoroTimer";

const TechnicalPracticePage = () => {
  const { companyId } = useParams();
  const queryClient = useQueryClient();

  const [selectedTopic, setSelectedTopic] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptMap, setAttemptMap] = useState({});
  const [showPomodoro, setShowPomodoro] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["placementQuestions", companyId, "technical", selectedTopic],
    queryFn: () =>
      getPlacementQuestions({
        company: companyId,
        category: "technical",
        topic: selectedTopic,
        limit: 100,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const questions = data?.questions || [];
  const topics = data?.availableTopics || [];
  const currentQuestion = questions[currentIndex] || null;

  // Reset Progress Mutation
  const { mutate: resetProgressMutation, isPending: isResetting } = useMutation({
    mutationFn: resetPlacementProgress,
    onSuccess: (_, variables) => {
      if (variables?.questionId) {
        setAttemptMap((prev) => {
          const next = { ...prev };
          delete next[variables.questionId];
          return next;
        });
        if (currentQuestion?._id === variables.questionId) {
          setSelectedOption(null);
          setSubmissionResult(null);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["placementQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["placementCompanies"] });
      queryClient.invalidateQueries({ queryKey: ["companyPlacementDetails"] });
      queryClient.invalidateQueries({ queryKey: ["placementUserProgress"] });
      toast.success("Question reset successfully.");
    },
  });

  const handleResetCurrentQuestion = () => {
    if (!currentQuestion || isResetting) return;
    if (!submissionResult && selectedOption !== null) {
      setSelectedOption(null);
      return;
    }
    resetProgressMutation({
      company: companyId,
      category: "technical",
      questionId: currentQuestion._id,
    });
  };

  const handleResetDeck = () => {
    if (isResetting || !questions.length) return;
    const questionIds = questions.map((q) => q._id);
    resetProgressMutation({
      company: companyId,
      category: "technical",
      questionIds,
    });
    setAttemptMap({});
    setSelectedOption(null);
    setSubmissionResult(null);
    setCurrentIndex(0);
    toast.success("All questions in this deck have been reset! 🔄");
  };

  useEffect(() => {
    if (currentQuestion) {
      const qId = currentQuestion._id;
      if (attemptMap[qId]) {
        setSelectedOption(attemptMap[qId].userChoice);
        setSubmissionResult(attemptMap[qId]);
      } else if (currentQuestion.userAttempt) {
        const attempt = {
          isCorrect: currentQuestion.userAttempt.isCorrect,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation,
          userChoice: currentQuestion.userAttempt.userChoice,
        };
        setSelectedOption(currentQuestion.userAttempt.userChoice);
        setSubmissionResult(attempt);
        setAttemptMap((prev) => ({ ...prev, [qId]: attempt }));
      } else {
        setSelectedOption(null);
        setSubmissionResult(null);
      }
    }
  }, [currentIndex, currentQuestion?._id]);

  const { mutate: submitAnswerMutation } = useMutation({
    mutationFn: submitPlacementAnswer,
    onMutate: () => setIsSubmitting(true),
    onSuccess: (res) => {
      setSubmissionResult(res);
      if (currentQuestion) {
        setAttemptMap((prev) => ({
          ...prev,
          [currentQuestion._id]: {
            ...res,
            userChoice: selectedOption,
          },
        }));

        // Optimistically update query cache for instant persistence
        queryClient.setQueryData(
          ["placementQuestions", companyId, "technical", selectedTopic],
          (old) => {
            if (!old?.questions) return old;
            return {
              ...old,
              questions: old.questions.map((q) => {
                if (q._id === currentQuestion._id) {
                  return {
                    ...q,
                    isSolved: res.isCorrect,
                    userAttempt: {
                      isCorrect: res.isCorrect,
                      userChoice: selectedOption,
                      correctAnswer: res.correctAnswer,
                      explanation: res.explanation,
                    },
                  };
                }
                return q;
              }),
            };
          }
        );
      }
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["companyPlacementDetails", companyId], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["placementUserProgress"], refetchType: "none" });
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    submitAnswerMutation({
      questionId: currentQuestion._id,
      userChoice: selectedOption,
      companySlug: companyId || "all",
    });
  };

  const totalSolved = useMemo(() => {
    return questions.filter((q) => attemptMap[q._id]?.isCorrect || q.userAttempt?.isCorrect).length;
  }, [questions, attemptMap]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-base-content/60">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">Loading Technical Deck...</span>
        </div>
      </div>
    );
  }

  const isMaster = !companyId || companyId.toLowerCase() === "all";

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200/50 p-2 sm:p-5 font-sans text-base-content">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* ── TOP HEADER / NAV BAR ── */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-base-100 p-4 rounded-3xl border border-base-content/10 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              to={isMaster ? "/placement" : `/placement/${companyId}`}
              className="p-2 rounded-2xl bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content transition-colors shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                  {isMaster ? "MASTER LIBRARY" : companyId?.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-base-content/40">•</span>
                <span className="text-xs font-black uppercase tracking-wider text-base-content/70">
                  Core CS &amp; Technical MCQ
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-base-content">
                Practice &amp; Mastery Deck
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset All Questions in Deck Button */}
            <button
              onClick={handleResetDeck}
              disabled={isResetting || totalSolved === 0}
              className="btn btn-ghost btn-sm rounded-2xl border border-base-content/10 text-xs font-bold hover:bg-error/10 hover:text-error hover:border-error/20 flex items-center gap-1.5 px-3 transition-colors disabled:opacity-40"
              title="Reset progress for all questions in this deck"
            >
              <RotateCcw className={`size-3.5 ${isResetting ? "animate-spin" : ""}`} />
              <span>Reset All</span>
            </button>

            {/* Pomodoro Focus Timer */}
            <button
              onClick={() => setShowPomodoro((prev) => !prev)}
              className="btn btn-ghost btn-sm rounded-2xl border border-base-content/10 text-xs font-bold hover:bg-base-200 flex items-center gap-2 px-3"
              title="Pomodoro Focus Timer"
            >
              <Timer className="size-4 text-primary" />
              <span>Focus Mode</span>
            </button>
          </div>
        </header>

        {/* ── TOPIC FILTERS BAR ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
          <span className="text-[11px] font-black uppercase tracking-wider text-base-content/40 pl-1 shrink-0">
            Topics:
          </span>
          <button
            onClick={() => {
              setSelectedTopic("all");
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              selectedTopic === "all"
                ? "bg-primary text-primary-content font-black shadow-xs"
                : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/5"
            }`}
          >
            All Topics
          </button>
          {topics.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedTopic(t);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                selectedTopic === t
                  ? "bg-primary text-primary-content font-black shadow-xs"
                  : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── MAIN WORKSPACE ── */}
        {questions.length > 0 && currentQuestion ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Question Card (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-base-100 rounded-3xl p-6 border border-base-content/10 shadow-xs space-y-6">
                <div className="flex items-center justify-between gap-2 border-b border-base-content/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-primary uppercase tracking-wider">
                      Question {currentIndex + 1}
                    </span>
                    <span className="text-xs text-base-content/30">of {questions.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border bg-primary/10 text-primary border-primary/20">
                      {currentQuestion.topic || "Core CS"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-base sm:text-lg font-bold text-base-content leading-relaxed">
                    {currentQuestion.problemDescription || currentQuestion.description || currentQuestion.title}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {(currentQuestion.options || []).map((option, idx) => {
                    const isSelected =
                      selectedOption !== null &&
                      selectedOption !== undefined &&
                      Number(selectedOption) === Number(idx);
                    let optionStyle = "border-base-content/10 bg-base-100/60 hover:border-primary/30 hover:bg-base-200/50";
                    let badgeStyle = "bg-base-200 text-base-content/70";
                    let textStyle = "text-base-content font-semibold";

                    if (submissionResult) {
                      const isCorrectChoice = Number(idx) === Number(submissionResult.correctAnswer);
                      const isUserChoice =
                        selectedOption !== null &&
                        selectedOption !== undefined &&
                        Number(selectedOption) === Number(idx);

                      if (isCorrectChoice) {
                        optionStyle = "bg-emerald-500/15 border-emerald-600 dark:border-emerald-400 shadow-sm ring-2 ring-emerald-500/30";
                        badgeStyle = "bg-emerald-600 text-white font-black shadow-xs";
                        textStyle = "text-emerald-950 dark:text-emerald-50 font-bold";
                      } else if (isUserChoice && !submissionResult.isCorrect) {
                        optionStyle = "bg-rose-500/15 border-rose-600 dark:border-rose-400 shadow-sm ring-2 ring-rose-500/30";
                        badgeStyle = "bg-rose-600 text-white font-black shadow-xs";
                        textStyle = "text-rose-950 dark:text-rose-50 font-bold";
                      } else {
                        optionStyle = "border-base-content/10 bg-base-100/40 opacity-70";
                        badgeStyle = "bg-base-200 text-base-content/50";
                        textStyle = "text-base-content/70 font-medium";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-primary/15 border-primary shadow-xs ring-2 ring-primary/30";
                      badgeStyle = "bg-primary text-primary-content font-black";
                      textStyle = "text-base-content font-bold";
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!submissionResult) setSelectedOption(idx);
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${optionStyle}`}
                      >
                        <div className={`size-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${badgeStyle}`}>
                          {submissionResult && Number(idx) === Number(submissionResult.correctAnswer) ? (
                            <Check className="size-4 stroke-[3]" />
                          ) : submissionResult && selectedOption !== null && Number(selectedOption) === Number(idx) && !submissionResult.isCorrect ? (
                            <XCircle className="size-4" />
                          ) : (
                            ["A", "B", "C", "D", "E"][idx] || idx + 1
                          )}
                        </div>
                        <span className={`text-sm flex-1 leading-snug ${textStyle}`}>{option}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-base-content/5">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="btn btn-ghost btn-sm rounded-xl font-bold gap-1 text-xs"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {!submissionResult ? (
                      <>
                        {selectedOption !== null && (
                          <button
                            onClick={handleResetCurrentQuestion}
                            className="btn btn-ghost btn-sm rounded-xl font-bold uppercase text-xs tracking-wider gap-1.5 text-base-content/60 hover:text-error hover:bg-error/10"
                            title="Clear choice"
                          >
                            <RotateCcw className="size-3.5" />
                            <span>Clear</span>
                          </button>
                        )}
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={selectedOption === null || isSubmitting}
                          className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6 shadow-sm"
                        >
                          {isSubmitting ? <span className="loading loading-spinner size-3" /> : "Submit Answer"}
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleResetCurrentQuestion}
                          disabled={isResetting}
                          className="btn btn-ghost btn-sm rounded-xl font-bold uppercase text-xs tracking-wider gap-1.5 hover:bg-base-200 text-base-content/70 hover:text-error transition-colors"
                          title="Reset question to try again"
                        >
                          <RotateCcw className={`size-3.5 ${isResetting ? "animate-spin" : ""}`} />
                          <span>Reset &amp; Try Again</span>
                        </button>
                        <button
                          onClick={() => {
                            if (currentIndex < questions.length - 1) {
                              setCurrentIndex((prev) => prev + 1);
                            }
                          }}
                          disabled={currentIndex === questions.length - 1}
                          className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6 gap-1"
                        >
                          <span>Next Question</span>
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Explanation Card */}
                <AnimatePresence>
                  {submissionResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-base-content/10 space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        {submissionResult.isCorrect ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black text-sm">
                            <CheckCircle2 className="size-5 text-emerald-500" />
                            <span>Correct! Excellent concept understanding.</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-black text-sm">
                            <XCircle className="size-5 text-rose-500" />
                            <span>
                              Incorrect. Correct Answer: Option{" "}
                              {["A", "B", "C", "D", "E"][submissionResult.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-base-200/60 rounded-2xl space-y-2 border border-base-content/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                          Technical Explanation
                        </span>
                        <p className="text-xs text-base-content/85 font-medium whitespace-pre-line leading-relaxed">
                          {submissionResult.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Question Navigation Palette (4 cols, sticky on desktop) */}
            <div className="lg:col-span-4 space-y-4 sticky top-4 self-start">
              <div className="bg-base-100 rounded-3xl p-5 border border-base-content/10 shadow-sm space-y-4 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b border-base-content/5">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    <span className="font-bold text-xs uppercase tracking-wider text-base-content/70">
                      Question Palette
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalSolved > 0 && (
                      <button
                        onClick={handleResetDeck}
                        disabled={isResetting}
                        className="text-[10px] font-bold text-base-content/40 hover:text-error hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                        title="Reset all questions in this deck"
                      >
                        <RotateCcw className="size-2.5" />
                        <span>Reset All</span>
                      </button>
                    )}
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                      {totalSolved}/{questions.length} Solved
                    </span>
                  </div>
                </div>

                {/* Minimal Question Grid */}
                <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                  {questions.map((q, idx) => {
                    const isSolved = attemptMap[q._id]?.isCorrect || q.userAttempt?.isCorrect;
                    const isAttempted = Boolean(attemptMap[q._id] || q.userAttempt);
                    const isCurrent = idx === currentIndex;

                    let tileClass = "bg-base-200/70 hover:bg-base-200 text-base-content/80 border border-base-content/10 hover:border-base-content/25";

                    if (isSolved) {
                      tileClass = "bg-emerald-600 hover:bg-emerald-700 text-white font-bold border border-emerald-600 shadow-xs";
                    } else if (isAttempted) {
                      tileClass = "bg-rose-600 hover:bg-rose-700 text-white font-bold border border-rose-600 shadow-xs";
                    }

                    if (isCurrent) {
                      if (isSolved) {
                        tileClass = "bg-emerald-600 text-white font-black ring-2 ring-primary ring-offset-2 ring-offset-base-100 shadow-sm";
                      } else if (isAttempted) {
                        tileClass = "bg-rose-600 text-white font-black ring-2 ring-primary ring-offset-2 ring-offset-base-100 shadow-sm";
                      } else {
                        tileClass = "border-2 border-primary bg-primary/15 text-primary font-black shadow-xs";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 w-full rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center ${tileClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Minimal Status Legend */}
                <div className="pt-3 border-t border-base-content/10 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-base-200/40 border border-base-content/5">
                    <span className="size-2.5 rounded-full bg-emerald-600 shrink-0" />
                    <span className="text-base-content/70 text-[11px] font-medium">Solved</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-base-200/40 border border-base-content/5">
                    <span className="size-2.5 rounded-full bg-rose-600 shrink-0" />
                    <span className="text-base-content/70 text-[11px] font-medium">Incorrect</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-base-200/40 border border-base-content/5">
                    <span className="size-2.5 rounded-full border-2 border-primary bg-primary/20 shrink-0" />
                    <span className="text-base-content/70 text-[11px] font-medium">Current</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-base-200/40 border border-base-content/5">
                    <span className="size-2.5 rounded-full bg-base-300 border border-base-content/30 shrink-0" />
                    <span className="text-base-content/70 text-[11px] font-medium">Unattempted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-base-100 rounded-3xl border border-base-content/10 space-y-2">
            <h3 className="font-bold text-base text-base-content">No Questions Found</h3>
            <p className="text-xs text-base-content/50">Try selecting a different topic filter above.</p>
          </div>
        )}
      </div>

      {/* Pomodoro Focus Timer */}
      <PomodoroTimer isOpen={showPomodoro} onClose={() => setShowPomodoro(false)} />
    </div>
  );
};

export default TechnicalPracticePage;

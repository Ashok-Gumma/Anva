import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Layers,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Code2,
  Database,
  Cpu,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  getPlacementQuestions,
  submitPlacementAnswer,
  resetPlacementProgress,
} from "../../lib/placementApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import PomodoroTimer from "../../components/PomodoroTimer";

const TechnicalPracticePage = () => {
  const { companyId } = useParams();
  const queryClient = useQueryClient();

  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptMap, setAttemptMap] = useState({});
  const [showPomodoro, setShowPomodoro] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["placementQuestions", companyId, "technical", selectedTopic, selectedDifficulty],
    queryFn: () =>
      getPlacementQuestions({
        company: companyId,
        category: "technical",
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        limit: 100,
      }),
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
        toast.success("Question reset! You can try again.");
      } else {
        setAttemptMap({});
        setSelectedOption(null);
        setSubmissionResult(null);
        toast.success("Progress reset successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["placementQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["companyPlacementDetails", companyId] });
      queryClient.invalidateQueries({ queryKey: ["placementUserProgress"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to reset progress.");
    },
  });

  const handleResetCurrentQuestion = () => {
    if (!currentQuestion) return;
    resetProgressMutation({ questionId: currentQuestion._id });
  };

  const handleResetAll = () => {
    if (questions.length === 0) return;
    resetProgressMutation({
      questionIds: questions.map((q) => q._id),
      category: "technical",
    });
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
      }
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["companyPlacementDetails", companyId] });
      queryClient.invalidateQueries({ queryKey: ["placementUserProgress"] });
      queryClient.invalidateQueries({ queryKey: ["placementQuestions"] });
      if (res.isCorrect) toast.success("Correct Answer! 🚀");
      else toast.error("Incorrect answer. Review the concept breakdown.");
    },
    onError: (err) => {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || "Failed to submit answer.");
    },
  });

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    submitAnswerMutation({
      questionId: currentQuestion._id,
      userChoice: selectedOption,
    });
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-3 sm:p-6 lg:p-8 font-sans text-base-content">
      <div className="container mx-auto max-w-[1300px] space-y-6">
        {/* ── 1. HEADER ── */}
        <div className="flex items-center justify-between bg-base-100 p-4 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              to={`/placement/${companyId}`}
              className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wider text-purple-500">
                  {companyId?.toUpperCase()}
                </span>
                <span className="text-base-content/40">•</span>
                <span className="font-black text-base text-base-content">Core CS Technical MCQs</span>
              </div>
              <p className="text-xs text-base-content/60 font-medium">
                Operating Systems, DBMS, SQL, Computer Networks &amp; OOP Concepts
              </p>
            </div>
          </div>

          {/* Pomodoro Focus Button */}
          <button
            onClick={() => setShowPomodoro((prev) => !prev)}
            className="btn btn-ghost btn-sm rounded-xl border border-base-content/10 gap-1.5 text-xs font-bold hover:bg-base-200"
            title="Open Pomodoro Focus Timer"
          >
            <span className="text-sm">🍅</span>
            <span className="hidden sm:inline">Pomodoro</span>
          </button>
        </div>

        {/* ── 2. TOPIC CHIPS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 shrink-0 ml-1">
            Core Domains:
          </span>
          <button
            onClick={() => setSelectedTopic("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedTopic === "all"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
            }`}
          >
            All Topics ({questions.length})
          </button>
          {topics.map((tp) => (
            <button
              key={tp}
              onClick={() => setSelectedTopic(tp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedTopic === tp
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
              }`}
            >
              {tp}
            </button>
          ))}
        </div>

        {/* ── 3. MAIN PRACTICE INTERFACE ── */}
        {isLoading ? (
          <div className="flex items-center justify-center p-20 bg-base-100 rounded-3xl border border-base-content/10">
            <span className="loading loading-spinner loading-lg text-purple-600" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center p-16 bg-base-100 rounded-3xl border border-base-content/10 space-y-4">
            <Database className="size-16 mx-auto text-base-content/30" />
            <h3 className="font-black text-lg">No Technical Questions Found</h3>
            <p className="text-sm text-base-content/60">Try choosing a different domain filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Question & Solution */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-content/10 shadow-sm space-y-6">
                {/* Meta & Bookmark */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 font-extrabold text-xs">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-base-200 font-bold text-xs capitalize text-base-content/70">
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                </div>

                {/* Prompt */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-base-content leading-relaxed whitespace-pre-line">
                    {currentQuestion.description || currentQuestion.title}
                  </h3>
                  {currentQuestion.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {currentQuestion.topics.map((tp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                        >
                          #{tp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {(currentQuestion.options || []).map((option, idx) => {
                    const isSelected =
                      selectedOption !== null &&
                      selectedOption !== undefined &&
                      Number(selectedOption) === Number(idx);
                    let optionStyle = "border-base-content/10 hover:border-purple-500/30 hover:bg-base-200/50";
                    let badgeStyle = "bg-base-200 text-base-content/70";

                    if (submissionResult) {
                      const isCorrectChoice = Number(idx) === Number(submissionResult.correctAnswer);
                      const isUserChoice =
                        selectedOption !== null &&
                        selectedOption !== undefined &&
                        Number(selectedOption) === Number(idx);

                      if (isCorrectChoice) {
                        optionStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs ring-2 ring-emerald-500/30";
                        badgeStyle = "bg-emerald-500 text-white shadow-xs";
                      } else if (isUserChoice && !submissionResult.isCorrect) {
                        optionStyle = "bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200 font-bold shadow-xs ring-2 ring-rose-500/30";
                        badgeStyle = "bg-rose-500 text-white shadow-xs";
                      } else {
                        optionStyle = "border-base-content/10 opacity-60";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-purple-500/10 border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-xs ring-1 ring-purple-500/30";
                      badgeStyle = "bg-purple-600 text-white";
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
                        <span className="text-sm font-semibold flex-1 leading-snug">{option}</span>
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

                  {!submissionResult ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null || isSubmitting}
                      className="btn bg-purple-600 hover:bg-purple-700 text-white btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6 shadow-md"
                    >
                      {isSubmitting ? <span className="loading loading-spinner size-3" /> : "Submit Answer"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetCurrentQuestion}
                        disabled={isResetting}
                        className="btn btn-ghost btn-sm rounded-xl font-bold uppercase text-xs tracking-wider gap-1.5 hover:bg-base-200 text-base-content/70 hover:text-error transition-colors cursor-pointer"
                        title="Reset this question and try again"
                      >
                        <RotateCcw className={`size-3.5 ${isResetting ? "animate-spin" : ""}`} />
                        <span>Try Again</span>
                      </button>
                      <button
                        onClick={() => {
                          if (currentIndex < questions.length - 1) {
                            setCurrentIndex((prev) => prev + 1);
                          }
                        }}
                        disabled={currentIndex === questions.length - 1}
                        className="btn bg-purple-600 hover:bg-purple-700 text-white btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6 gap-1"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Explanation */}
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
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                            <CheckCircle2 className="size-5" />
                            <span>Correct! Solid conceptual clarity.</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-black text-sm">
                            <XCircle className="size-5" />
                            <span>
                              Incorrect. Correct Answer: Option{" "}
                              {["A", "B", "C", "D", "E"][submissionResult.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-base-200/60 rounded-2xl space-y-2 border border-base-content/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                          Computer Science Concept Deep-Dive
                        </span>
                        <p className="text-xs text-base-content/80 font-medium whitespace-pre-line leading-relaxed">
                          {submissionResult.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Question Palette (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-base-100 rounded-3xl p-6 border border-base-content/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm uppercase tracking-wider text-base-content">
                    Questions Palette
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/40 font-bold">
                      {questions.filter((q) => (attemptMap[q._id] ? attemptMap[q._id].isCorrect : q.isSolved)).length}/{questions.length} Solved
                    </span>
                    <button
                      onClick={handleResetAll}
                      disabled={isResetting}
                      className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/50 hover:text-error transition-colors cursor-pointer"
                      title="Reset all questions in this topic"
                    >
                      <RotateCcw className={`size-3.5 ${isResetting ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 pt-2">
                  {questions.map((q, idx) => {
                    const isCurrent = currentIndex === idx;
                    let numStyle = "bg-base-200 text-base-content/70 hover:bg-base-300";

                    const attempt = attemptMap[q._id] || q.userAttempt;
                    const isSolved = attemptMap[q._id] ? attemptMap[q._id].isCorrect : q.isSolved;

                    if (isSolved) {
                      numStyle = "bg-purple-600 text-white font-bold";
                    } else if (attempt && !attempt.isCorrect) {
                      numStyle = "bg-rose-500/20 text-rose-600 font-bold border border-rose-500/30";
                    }

                    if (isCurrent) {
                      numStyle += " ring-2 ring-purple-600 ring-offset-2 ring-offset-base-100 scale-105";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`size-10 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${numStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pomodoro Focus Timer */}
      <PomodoroTimer isOpen={showPomodoro} onClose={() => setShowPomodoro(false)} />
    </div>
  );
};

export default TechnicalPracticePage;

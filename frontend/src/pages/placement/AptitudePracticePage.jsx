import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Award,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Filter,
  Check,
  Flame,
  Timer,
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

const AptitudePracticePage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState("practice"); // "practice" | "mock"
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptMap, setAttemptMap] = useState({});
  const [showPomodoro, setShowPomodoro] = useState(false);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [mockSecondsRemaining, setMockSecondsRemaining] = useState(25 * 60); // 25 mins for mock

  // Mock test session answers: map of questionId -> { choice, isCorrect }
  const [mockAnswers, setMockAnswers] = useState({});
  const [isMockCompleted, setIsMockCompleted] = useState(false);

  // Fetch Questions
  const { data, isLoading, isError } = useQuery({
    queryKey: ["placementQuestions", companyId, "aptitude", selectedTopic, selectedDifficulty],
    queryFn: () =>
      getPlacementQuestions({
        company: companyId,
        category: "aptitude",
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        limit: 100,
      }),
  });

  const questions = data?.questions || [];
  const topics = data?.availableTopics || [];
  const currentQuestion = questions[currentIndex] || null;

  // Sync answer states when moving to another question
  useEffect(() => {
    if (currentQuestion) {
      const qId = currentQuestion._id;
      if (mode === "practice") {
        if (attemptMap[qId]) {
          setSelectedOption(attemptMap[qId].userChoice);
          setSubmissionResult(attemptMap[qId]);
        } else if (currentQuestion.userAttempt) {
          const attempt = {
            isCorrect: currentQuestion.userAttempt.isCorrect,
            correctAnswer: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            formula: currentQuestion.formula,
            userChoice: currentQuestion.userAttempt.userChoice,
          };
          setSelectedOption(currentQuestion.userAttempt.userChoice);
          setSubmissionResult(attempt);
          setAttemptMap((prev) => ({ ...prev, [qId]: attempt }));
        } else {
          setSelectedOption(null);
          setSubmissionResult(null);
        }
      } else {
        // Mock mode
        const previousChoice = mockAnswers[qId];
        setSelectedOption(previousChoice !== undefined ? previousChoice : null);
      }
    }
  }, [currentIndex, currentQuestion?._id, mode]);

  // Practice Mode Elapsed Timer
  useEffect(() => {
    if (mode === "practice") {
      const interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Mock Mode Countdown Timer
  useEffect(() => {
    if (mode === "mock" && !isMockCompleted) {
      const interval = setInterval(() => {
        setMockSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishMock();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, isMockCompleted]);

  // Format timer
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Submit answer in Practice Mode
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
      if (res.isCorrect) {
        toast.success("Correct Answer! 🎉");
      } else {
        toast.error("Incorrect. Check the explanation below.");
      }
    },
    onError: (err) => {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || "Failed to submit answer.");
    },
  });

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;

    if (mode === "practice") {
      submitAnswerMutation({
        questionId: currentQuestion._id,
        userChoice: selectedOption,
      });
    } else {
      // Mock Mode: Record answer locally
      setMockAnswers((prev) => ({
        ...prev,
        [currentQuestion._id]: selectedOption,
      }));
      // Move to next question if available
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        toast.success("Reached last question. You can review or submit your test.");
      }
    }
  };

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
      category: "aptitude",
    });
  };

  // Mock test submission
  const handleFinishMock = () => {
    setIsMockCompleted(true);
    // Grade all answered questions
    let correctCount = 0;
    questions.forEach((q) => {
      const choice = mockAnswers[q._id];
      if (choice !== undefined && Number(choice) === Number(q.correctAnswer)) {
        correctCount++;
        // Submit to persist
        submitPlacementAnswer({ questionId: q._id, userChoice: choice });
      }
    });
    toast.success(`Mock Test Completed! Scored ${correctCount} / ${questions.length}`);
  };

  const answeredCount = Object.keys(mockAnswers).length;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200 p-3 sm:p-6 lg:p-8 font-sans text-base-content">
      <div className="container mx-auto max-w-[1300px] space-y-6">
        {/* ── 1. HEADER & MODE SWITCHER ── */}
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
                <span className="font-extrabold text-sm uppercase tracking-wider text-primary">
                  {companyId?.toUpperCase()}
                </span>
                <span className="text-base-content/40">•</span>
                <span className="font-black text-base text-base-content">Quantitative & Logical Aptitude</span>
              </div>
              <p className="text-xs text-base-content/60 font-medium">
                {mode === "practice" ? "Practice mode with step-by-step solutions" : "Timed mock test evaluation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switch */}
            <div className="join bg-base-200 p-1 rounded-2xl border border-base-content/5">
              <button
                onClick={() => {
                  setMode("practice");
                  setIsMockCompleted(false);
                }}
                className={`join-item px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === "practice"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                Practice Mode
              </button>
              <button
                onClick={() => {
                  setMode("mock");
                  setMockSecondsRemaining(25 * 60);
                  setIsMockCompleted(false);
                }}
                className={`join-item px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === "mock"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                Mock Test
              </button>
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

            {/* Mock Test Countdown Timer only */}
            {mode === "mock" && (
              <div className="flex items-center gap-2 px-3 py-2 bg-base-200 rounded-xl border border-base-content/5 text-xs font-mono font-bold text-base-content shrink-0">
                <Clock className="size-4 text-primary" />
                <span>{formatTime(mockSecondsRemaining)}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── 2. TOPIC & DIFFICULTY FILTERS (Practice Mode) ── */}
        {mode === "practice" && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 shrink-0 ml-1">
              Topics:
            </span>
            <button
              onClick={() => setSelectedTopic("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedTopic === "all"
                  ? "bg-primary text-primary-content shadow-xs"
                  : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
              }`}
            >
              All Topics
            </button>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedTopic === t
                    ? "bg-primary text-primary-content shadow-xs"
                    : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* ── 3. MAIN QUESTION WORKSPACE ── */}
        {isLoading ? (
          <div className="bg-base-100 rounded-3xl p-12 border border-base-content/10 flex flex-col items-center justify-center gap-3">
            <span className="loading loading-spinner loading-md text-primary" />
            <span className="text-xs font-bold text-base-content/60">Loading questions...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-base-100 rounded-3xl p-12 border border-base-content/10 text-center space-y-3">
            <Brain className="size-12 mx-auto text-base-content/30" />
            <h3 className="font-extrabold text-base">No questions available</h3>
            <p className="text-xs text-base-content/60">
              No aptitude questions found for the selected topic filter.
            </p>
            <button onClick={() => setSelectedTopic("all")} className="btn btn-primary btn-sm rounded-xl font-bold">
              Show All Topics
            </button>
          </div>
        ) : isMockCompleted ? (
          /* Mock Test Result Card */
          <div className="bg-base-100 rounded-3xl p-8 sm:p-12 border border-base-content/10 text-center space-y-6 shadow-xl">
            <Award className="size-16 mx-auto text-primary animate-bounce" />
            <div className="space-y-2">
              <h2 className="text-2xl font-black">Mock Test Completed!</h2>
              <p className="text-sm text-base-content/60 font-medium">
                Here is your performance summary for {companyId?.toUpperCase()} Aptitude Assessment:
              </p>
            </div>

            <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
              <div className="p-4 bg-base-200 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-base-content/50 block">Total</span>
                <span className="text-2xl font-black text-base-content">{questions.length}</span>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <span className="text-[10px] font-black uppercase text-emerald-600 block">Attempted</span>
                <span className="text-2xl font-black text-emerald-600">{answeredCount}</span>
              </div>
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <span className="text-[10px] font-black uppercase text-primary block">Time</span>
                <span className="text-2xl font-black text-primary">{formatTime(25 * 60 - mockSecondsRemaining)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setMode("practice");
                  setIsMockCompleted(false);
                }}
                className="btn btn-primary rounded-2xl font-black text-xs uppercase tracking-wider px-6"
              >
                Review in Practice Mode
              </button>
              <button
                onClick={() => {
                  setMockAnswers({});
                  setMockSecondsRemaining(25 * 60);
                  setIsMockCompleted(false);
                  setCurrentIndex(0);
                }}
                className="btn btn-outline rounded-2xl font-black text-xs uppercase tracking-wider px-6"
              >
                Retake Mock Test
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Question Card (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-content/10 shadow-md space-y-6 relative overflow-hidden">
                {/* Top Question Info */}
                <div className="flex items-center justify-between border-b border-base-content/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                      Question {currentIndex + 1}
                    </span>
                    <span className="text-xs text-base-content/40">of {questions.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="badge badge-sm font-black bg-base-200 border-base-content/10 text-base-content/80 text-[10px] uppercase">
                      {currentQuestion.difficulty}
                    </span>
                    {currentQuestion.frequency && (
                      <span className="badge badge-sm font-black bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] uppercase">
                        🔥 {currentQuestion.frequency} Freq
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-base-content leading-relaxed">
                    {currentQuestion.description || currentQuestion.title}
                  </h3>
                  {currentQuestion.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {currentQuestion.topics.map((tp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-base-200 text-base-content/60"
                        >
                          #{tp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {(currentQuestion.options || []).map((option, idx) => {
                    const isSelected =
                      selectedOption !== null &&
                      selectedOption !== undefined &&
                      Number(selectedOption) === Number(idx);
                    let optionStyle = "border-base-content/10 hover:border-primary/30 hover:bg-base-200/50";
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
                      optionStyle = "bg-primary/10 border-primary/40 text-primary shadow-xs ring-1 ring-primary/30";
                      badgeStyle = "bg-primary text-primary-content";
                    }

                    const optionLetters = ["A", "B", "C", "D", "E"];

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!submissionResult || mode === "mock") {
                            setSelectedOption(idx);
                          }
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${optionStyle}`}
                      >
                        <div className={`size-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${badgeStyle}`}>
                          {submissionResult && Number(idx) === Number(submissionResult.correctAnswer) ? (
                            <Check className="size-4 stroke-[3]" />
                          ) : submissionResult && selectedOption !== null && Number(selectedOption) === Number(idx) && !submissionResult.isCorrect ? (
                            <XCircle className="size-4" />
                          ) : (
                            optionLetters[idx] || idx + 1
                          )}
                        </div>
                        <span className="text-sm font-semibold flex-1 leading-snug">{option}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
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
                    {mode === "practice" ? (
                      !submissionResult ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={selectedOption === null || isSubmitting}
                          className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6 shadow-md"
                        >
                          {isSubmitting ? <span className="loading loading-spinner size-3" /> : "Submit Answer"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleResetCurrentQuestion}
                            disabled={isResetting}
                            className="btn btn-ghost btn-sm rounded-xl font-bold uppercase text-xs tracking-wider gap-1.5 hover:bg-base-200 text-base-content/70 hover:text-error transition-colors"
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
                            className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6 gap-1"
                          >
                            <span>Next Question</span>
                            <ChevronRight className="size-4" />
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6"
                      >
                        {currentIndex === questions.length - 1 ? "Save & Review" : "Save & Next"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Explanation Box (Shows after submission in Practice Mode) */}
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
                            <span>Correct! Excellent logic.</span>
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

                      {submissionResult.formula && (
                        <div className="p-3 bg-primary/5 rounded-xl border border-primary/15 text-xs font-mono text-primary font-bold">
                          💡 Formula: {submissionResult.formula}
                        </div>
                      )}

                      <div className="p-4 bg-base-200/60 rounded-2xl space-y-2 border border-base-content/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                          Step-by-Step Solution &amp; Explanation
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

            {/* Right: Question Navigation Palette (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-base-100 rounded-3xl p-6 border border-base-content/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm uppercase tracking-wider text-base-content">
                    Question Palette
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-content/40 font-bold">
                      {mode === "practice"
                        ? `${questions.filter((q) => (attemptMap[q._id] ? attemptMap[q._id].isCorrect : q.isSolved)).length}/${questions.length} Solved`
                        : `${answeredCount}/${questions.length} Answered`}
                    </span>
                    {mode === "practice" && (
                      <button
                        onClick={handleResetAll}
                        disabled={isResetting}
                        className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/50 hover:text-error transition-colors cursor-pointer"
                        title="Reset all questions in this topic"
                      >
                        <RotateCcw className={`size-3.5 ${isResetting ? "animate-spin" : ""}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {questions.map((q, idx) => {
                    const isCurrent = currentIndex === idx;
                    let numStyle = "bg-base-200 text-base-content/70 hover:bg-base-300";

                    if (mode === "practice") {
                      const attempt = attemptMap[q._id] || q.userAttempt;
                      const isSolved = attemptMap[q._id] ? attemptMap[q._id].isCorrect : q.isSolved;
                      if (isSolved) {
                        numStyle = "bg-emerald-500 text-white font-bold";
                      } else if (attempt && !attempt.isCorrect) {
                        numStyle = "bg-rose-500/20 text-rose-600 font-bold border border-rose-500/30";
                      }
                    } else {
                      if (mockAnswers[q._id] !== undefined) {
                        numStyle = "bg-primary text-primary-content font-bold shadow-xs";
                      }
                    }

                    if (isCurrent) {
                      numStyle += " ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105";
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

                {/* Mock mode Finish Button */}
                {mode === "mock" && (
                  <div className="pt-4 border-t border-base-content/10">
                    <button
                      onClick={handleFinishMock}
                      className="btn btn-error btn-sm rounded-xl font-black uppercase text-xs tracking-wider w-full shadow-md"
                    >
                      Submit Mock Test
                    </button>
                  </div>
                )}
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

export default AptitudePracticePage;

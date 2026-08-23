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
  Layers,
  Lightbulb,
} from "lucide-react";
import {
  getPlacementQuestions,
  submitPlacementAnswer,
  resetPlacementProgress,
} from "../../lib/placementApi";
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
  const [mockSecondsRemaining, setMockSecondsRemaining] = useState(25 * 60);

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

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Submit answer in Practice Mode (Quiet inline feedback)
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
    },
    onError: () => {
      setIsSubmitting(false);
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
      setMockAnswers((prev) => ({ ...prev, [currentQuestion._id]: selectedOption }));
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  // Reset single question in Practice Mode
  const { mutate: resetQuestionMutation, isPending: isResetting } = useMutation({
    mutationFn: resetPlacementProgress,
    onSuccess: () => {
      if (currentQuestion) {
        const qId = currentQuestion._id;
        setAttemptMap((prev) => {
          const copy = { ...prev };
          delete copy[qId];
          return copy;
        });
      }
      setSelectedOption(null);
      setSubmissionResult(null);
      queryClient.invalidateQueries({ queryKey: ["companyPlacementDetails", companyId] });
      queryClient.invalidateQueries({ queryKey: ["placementUserProgress"] });
      queryClient.invalidateQueries({ queryKey: ["placementQuestions"] });
    },
  });

  const handleResetCurrentQuestion = () => {
    if (!currentQuestion || isResetting) return;
    resetQuestionMutation({
      company: companyId,
      category: "aptitude",
      questionId: currentQuestion._id,
    });
  };

  const handleFinishMock = () => {
    setIsMockCompleted(true);
  };

  // Summary Metrics
  const totalSolved = useMemo(() => {
    return questions.filter((q) => attemptMap[q._id]?.isCorrect || q.userAttempt?.isCorrect).length;
  }, [questions, attemptMap]);

  const mockScore = useMemo(() => {
    if (mode !== "mock") return 0;
    let score = 0;
    questions.forEach((q) => {
      if (mockAnswers[q._id] !== undefined && Number(mockAnswers[q._id]) === Number(q.correctAnswer)) {
        score += 1;
      }
    });
    return score;
  }, [mode, questions, mockAnswers]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] bg-base-200 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-base-content/60">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">Loading Practice Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200/50 p-2 sm:p-5 font-sans text-base-content">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* ── TOP HEADER / NAV BAR ── */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-base-100 p-4 rounded-3xl border border-base-content/10 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              to={`/placement/${companyId}`}
              className="p-2 rounded-2xl bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content transition-colors shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                  {companyId?.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-base-content/40">•</span>
                <span className="text-xs font-black uppercase tracking-wider text-base-content/70">
                  Quantitative Aptitude
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-base-content">
                Practice &amp; Mastery Deck
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-base-200 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setMode("practice")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  mode === "practice" ? "bg-base-100 text-primary font-black shadow-xs" : "text-base-content/60"
                }`}
              >
                Practice
              </button>
              <button
                onClick={() => setMode("mock")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  mode === "mock" ? "bg-base-100 text-primary font-black shadow-xs" : "text-base-content/60"
                }`}
              >
                Mock Test
              </button>
            </div>

            {/* Timer Display */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-base-200/80 rounded-2xl text-xs font-mono font-bold text-base-content/80 border border-base-content/5">
              <Clock className="size-3.5 text-primary" />
              <span>{mode === "practice" ? formatTime(secondsElapsed) : formatTime(mockSecondsRemaining)}</span>
            </div>

            {/* Pomodoro Focus */}
            <button
              onClick={() => setShowPomodoro((prev) => !prev)}
              className="btn btn-ghost btn-sm rounded-2xl border border-base-content/10 text-xs font-bold hover:bg-base-200"
              title="Pomodoro Focus Timer"
            >
              <span>🍅</span>
              <span className="hidden md:inline">Focus</span>
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

        {/* ── MAIN PRACTICE WORKSPACE (Grid: 8 cols Deck, 4 cols Palette) ── */}
        {questions.length > 0 && currentQuestion ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Question Card Deck (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-base-100 rounded-3xl p-6 border border-base-content/10 shadow-xs space-y-6">
                {/* Question Header & Meta */}
                <div className="flex items-center justify-between gap-2 border-b border-base-content/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-primary uppercase tracking-wider">
                      Question {currentIndex + 1}
                    </span>
                    <span className="text-xs text-base-content/30">of {questions.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${
                        currentQuestion.difficulty === "Easy"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : currentQuestion.difficulty === "Medium"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                          : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {currentQuestion.difficulty}
                    </span>
                    {currentQuestion.frequency && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Flame className="size-3" /> {currentQuestion.frequency} Freq
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Statement */}
                <div className="space-y-3">
                  <h2 className="text-base sm:text-lg font-bold text-base-content leading-relaxed">
                    {currentQuestion.problemDescription || currentQuestion.description || currentQuestion.title}
                  </h2>
                  {currentQuestion.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {currentQuestion.topics.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-base-200 text-base-content/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Options Tiles List */}
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
                        <span className={`text-sm flex-1 leading-snug ${textStyle}`}>{option}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Bar */}
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
                          className="btn btn-primary btn-sm rounded-xl font-black uppercase text-xs tracking-wider px-6 shadow-sm"
                        >
                          {isSubmitting ? <span className="loading loading-spinner size-3" /> : "Submit Answer"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleResetCurrentQuestion}
                            disabled={isResetting}
                            className="btn btn-ghost btn-sm rounded-xl font-bold uppercase text-xs tracking-wider gap-1.5 hover:bg-base-200 text-base-content/70 hover:text-error transition-colors"
                            title="Reset question to try again"
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

                {/* Mastery Breakdown / Step-by-Step Solution Card */}
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
                            <span>Correct! Excellent solution.</span>
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

                      {submissionResult.formula && (
                        <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/15 text-xs font-mono text-primary font-bold">
                          💡 Formula: {submissionResult.formula}
                        </div>
                      )}

                      <div className="p-4 bg-base-200/60 rounded-2xl space-y-2 border border-base-content/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                          Step-by-Step Solution &amp; Explanation
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

            {/* Right: Question Navigation Palette (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-base-100 rounded-3xl p-5 border border-base-content/10 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-wider text-base-content/70">
                    Question Palette
                  </h3>
                  <span className="text-[11px] font-bold text-primary">
                    {totalSolved}/{questions.length} Solved
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(totalSolved / (questions.length || 1)) * 100}%` }}
                  />
                </div>

                {/* Palette Grid */}
                <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                  {questions.map((q, idx) => {
                    const isSolved = attemptMap[q._id]?.isCorrect || q.userAttempt?.isCorrect;
                    const isAttempted = attemptMap[q._id] || q.userAttempt || mockAnswers[q._id] !== undefined;
                    const isCurrent = idx === currentIndex;

                    let numStyle = "bg-base-200 text-base-content/70 hover:bg-base-300";

                    if (isSolved) {
                      numStyle = "bg-emerald-600 text-white font-black shadow-xs";
                    } else if (isAttempted && !isSolved && mode === "practice") {
                      numStyle = "bg-rose-600 text-white font-black shadow-xs";
                    } else if (isAttempted && mode === "mock") {
                      numStyle = "bg-primary text-primary-content font-black";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${numStyle} ${
                          isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105" : ""
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-2 border-t border-base-content/5 grid grid-cols-2 gap-2 text-[10px] font-bold text-base-content/60">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-600" />
                    <span>Solved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-rose-600" />
                    <span>Incorrect</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full ring-2 ring-primary bg-base-100" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-base-200" />
                    <span>Unattempted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-base-100 rounded-3xl border border-base-content/10 space-y-2">
            <h3 className="font-bold text-base text-base-content">No Questions Found</h3>
            <p className="text-xs text-base-content/50">Try selecting a different topic or difficulty filter above.</p>
          </div>
        )}
      </div>

      {/* Pomodoro Focus Timer */}
      <PomodoroTimer isOpen={showPomodoro} onClose={() => setShowPomodoro(false)} />
    </div>
  );
};

export default AptitudePracticePage;

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, X, Minimize2, Maximize2, Coffee, Brain } from "lucide-react";
import toast from "react-hot-toast";

const MODES = {
  focus: { label: "Focus Session", defaultMinutes: 25, icon: Brain, color: "text-primary bg-primary/10 border-primary/20" },
  shortBreak: { label: "Short Break", defaultMinutes: 5, icon: Coffee, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  longBreak: { label: "Long Break", defaultMinutes: 15, icon: Sparkles, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
};

const PomodoroTimer = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("focus");
  const [durationMinutes, setDurationMinutes] = useState(25);
  // Store remaining time in seconds as single source of truth
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const timerRef = useRef(null);

  // Play audio chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Ignore if audio context blocked
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            playChime();

            if (mode === "focus") {
              setCompletedSessions((c) => c + 1);
              toast.success("🎯 Pomodoro Session Completed! Take a well-deserved break.", { duration: 5000 });
              setMode("shortBreak");
              setDurationMinutes(5);
              return 5 * 60;
            } else {
              toast.success("⚡ Break is over! Ready to focus again?", { duration: 5000 });
              setMode("focus");
              setDurationMinutes(25);
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, soundEnabled]);

  const switchMode = (newMode, customMinutes = null) => {
    setIsActive(false);
    setMode(newMode);
    const mins = customMinutes !== null ? customMinutes : MODES[newMode].defaultMinutes;
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const selectPresetMinutes = (mins) => {
    setIsActive(false);
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationMinutes * 60);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  const CurrentIcon = MODES[mode].icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 transition-all duration-300">
      {isMinimized ? (
        /* Minimized floating pill */
        <div
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-4 py-2.5 bg-base-100/95 backdrop-blur-md rounded-2xl border-2 border-primary shadow-2xl cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="size-3 rounded-full bg-primary animate-pulse" />
          <span className="font-mono font-black text-sm text-base-content">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs font-bold text-base-content/60 capitalize">
            {mode === "focus" ? "🍅 Focus" : "☕ Break"}
          </span>
          <Maximize2 className="size-3.5 text-base-content/40 hover:text-base-content" />
        </div>
      ) : (
        /* Full Pomodoro Card */
        <div className="w-80 sm:w-88 bg-base-100/95 backdrop-blur-xl rounded-3xl border border-base-content/10 shadow-2xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍅</span>
              <h3 className="font-black text-sm tracking-tight text-base-content">Pomodoro Focus Timer</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="btn btn-ghost btn-xs btn-circle text-base-content/60"
                title={soundEnabled ? "Mute alert" : "Unmute alert"}
              >
                {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="btn btn-ghost btn-xs btn-circle text-base-content/60"
                title="Minimize timer"
              >
                <Minimize2 className="size-3.5" />
              </button>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-error"
                title="Close"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-base-200 rounded-2xl">
            {Object.entries(MODES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === key
                    ? "bg-base-100 text-primary shadow-xs"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                {key === "focus" ? "Focus" : key === "shortBreak" ? "Short" : "Long"}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center justify-center py-4 bg-base-200/50 rounded-2xl border border-base-content/5 space-y-1 relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/60 mb-1">
              <CurrentIcon className="size-3.5 text-primary" />
              <span>{MODES[mode].label}</span>
            </div>
            <span className="font-mono text-5xl font-black tracking-tighter text-base-content">
              {formatTime(timeLeft)}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-base-content/50 pt-1">
              <span>Completed:</span>
              <span className="text-primary font-black">{completedSessions} 🍅</span>
            </div>
          </div>

          {/* Quick Preset Buttons (15m, 25m, 45m, 60m) */}
          {mode === "focus" && (
            <div className="flex items-center justify-center gap-2">
              {[15, 25, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => selectPresetMinutes(m)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    durationMinutes === m && timeLeft === m * 60
                      ? "bg-primary text-primary-content border-primary shadow-xs"
                      : "bg-base-200 text-base-content/70 border-base-content/5 hover:bg-base-300"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimer}
              className={`btn flex-1 rounded-2xl font-black uppercase text-xs tracking-wider gap-2 shadow-md cursor-pointer ${
                isActive ? "btn-warning text-warning-content" : "btn-primary"
              }`}
            >
              {isActive ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              <span>{isActive ? "Pause" : "Start Focus"}</span>
            </button>
            <button
              onClick={resetTimer}
              className="btn btn-base-200 hover:btn-base-300 rounded-2xl text-base-content/70 cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;

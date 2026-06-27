import { motion } from "framer-motion";
import AnvaLogo from "./AnvaLogo";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  const letters = ["A", "N", "V", "A"];

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 overflow-hidden" 
      data-theme={theme}
    >
      <div className="relative flex flex-col items-center gap-12">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-base-content/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

        {/* Pulsing Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1,
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
          className="relative z-10"
        >
          <div className="p-6 rounded-[2.5rem] bg-base-content shadow-2xl shadow-base-content/10">
            <AnvaLogo className="size-20 text-base-100" />
          </div>
        </motion.div>

        {/* Staggered Text */}
        <div className="flex gap-4">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + index * 0.1,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="text-4xl font-black tracking-tighter text-base-content"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Progress Bar (Subtle) */}
        <motion.div 
          className="absolute -bottom-16 w-32 h-1 bg-base-content/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="h-full bg-base-content rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PageLoader;

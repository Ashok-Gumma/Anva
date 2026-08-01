import { motion } from "framer-motion";
import AnvaLogo from "./AnvaLogo";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-[#f8f6ee] text-[#2c221e] dark:bg-[#161412] dark:text-[#f8f6ee] overflow-hidden relative selection:bg-amber-900/20" 
      data-theme={theme}
    >
      {/* Warm Retro Ambient Backlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative flex flex-col items-center gap-6 z-10 px-4">
        {/* Floating Animated Retro Logo Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: [0.95, 1.02, 0.98, 1], y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative p-3 bg-white/60 dark:bg-black/30 rounded-full border border-base-content/10 shadow-2xl backdrop-blur-sm"
        >
          <AnvaLogo className="size-36 sm:size-44 shadow-md" />
        </motion.div>

        {/* Retro Shimmer Loading Line */}
        <motion.div 
          className="w-48 sm:w-56 h-1 bg-current opacity-25 rounded-full overflow-hidden relative mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="h-full bg-current rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.8,
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

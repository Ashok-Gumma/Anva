import { motion } from "framer-motion";
import { Link } from "react-router";
import ParticleBackground from "../components/ParticleBackground";
import {
  Users,
  Zap,
  BookOpen,
  Video,
  Code,
  Clock,
  ArrowRight,
  ChevronLeft,
  Target,
  Bot,
  Terminal,
  Share2,
  Timer,
  Award,
  Sparkles,
  ShieldCheck,
  Building2,
} from "lucide-react";

const features = [
  {
    title: "Company Placement Tracks",
    description: "Tailored preparation tracks for TCS, Infosys, Wipro, Google, Microsoft, Amazon, and top tech companies.",
    icon: <Target className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "24/7 AI Tutor & Grammar Coach",
    description: "Instant doubt resolution, real-time grammar checks, LaTeX math formatting, and voice pronunciation feedback.",
    icon: <Bot className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "In-Browser Multi-Language Compiler",
    description: "Interactive code studio supporting JavaScript, Python, C++, Java, and Go with custom input stdin and stdout.",
    icon: <Terminal className="w-6 h-6" />,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "1-on-1 HD Video & Voice Practice",
    description: "Launch crystal-clear video and audio calls with peers for language fluency, study sessions, and mock interviews.",
    icon: <Video className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "EduFeed & PDF Community Notes",
    description: "Share study notes, diagrams, and downloadable PDF study guides with likes, comments, and rich post sharing.",
    icon: <BookOpen className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600",
  },
  {
    title: "Interactive Coding Arena",
    description: "Practice algorithmic and data structure problems with real-time testcase execution and automated evaluation.",
    icon: <Code className="w-6 h-6" />,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Timed Mock Assessments",
    description: "Simulate real recruitment exams with strict time limits, automated scoring, and detailed solution explanations.",
    icon: <Award className="w-6 h-6" />,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Pomodoro Focus Timer",
    description: "Integrated customizable Pomodoro timer across practice pages to maximize study stamina and concentration.",
    icon: <Timer className="w-6 h-6" />,
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Global Peer Exchange",
    description: "Match and converse with native speakers worldwide based on mutual language goals and educational interests.",
    icon: <Users className="w-6 h-6" />,
    color: "bg-teal-50 text-teal-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const FeaturesPage = () => {
  return (
    <div
      className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans"
      data-theme="light"
    >
      {/* 3D Rotating Particles */}
      <ParticleBackground />

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center select-none group">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
              An<span className="font-curly font-bold ml-0.5 text-blue-600">va</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/sign-up"
            className="bg-slate-900 text-white hover:bg-blue-600 transition-colors px-5 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs shadow-2xs font-bold uppercase tracking-wider mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span>Discover Anva Features</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-3xl mx-auto"
          >
            Everything you need for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              academic &amp; career success
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Anva integrates global peer community, 24/7 AI tutoring, company placement readiness, live compilers, and productivity tools in one seamless experience.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/90 backdrop-blur-md border border-slate-200/90 p-7 sm:p-8 rounded-3xl shadow-2xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-13 h-13 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xs`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center bg-slate-950 rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-2xl text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
              Ready to reach new heights?
            </h2>
            <p className="text-slate-300 mb-8 text-sm sm:text-base leading-relaxed">
              Join learners and job-seekers on Anva. Practice placements, connect with peers, and study with 24/7 AI.
            </p>
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-blue-50 transition-all px-8 py-3.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 text-xs uppercase tracking-wider"
            >
              Start Your Journey Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 py-10 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} Anva. Master Languages, Ace Placements, and Build Together.
        </p>
      </footer>
    </div>
  );
};

export default FeaturesPage;

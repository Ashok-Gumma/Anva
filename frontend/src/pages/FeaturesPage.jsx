import { motion } from "framer-motion";
import { Link } from "react-router";
import ParticleBackground from "../components/ParticleBackground";
import AnvaLogo from "../components/AnvaLogo";
import { 
  Users, 
  Sparkles, 
  BookOpen, 
  Video, 
  Code, 
  Clock, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";

const features = [
  {
    title: "Global Language Exchange",
    description: "Connect with native speakers worldwide and practice in a natural, immersive environment.",
    icon: <Users className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "AI Language Tutor",
    description: "Get 24/7 assistance with grammar, vocabulary, and conversational practice from our advanced AI.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Interactive Flashcards",
    description: "Master new vocabulary using our smart spaced-repetition system tailored to your learning pace.",
    icon: <BookOpen className="w-6 h-6" />,
    color: "bg-pink-50 text-pink-600"
  },
  {
    title: "Voice & Video Practice",
    description: "Break the ice with high-quality audio and video calls designed for seamless language practice.",
    icon: <Video className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600"
  },
  {
    title: "Technical Language Support",
    description: "Integrated code compiler and technical tools for developers learning new languages.",
    icon: <Code className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Learn Anytime, Anywhere",
    description: "Access your lessons, friends, and progress across all your devices, whenever you're ready.",
    icon: <Clock className="w-6 h-6" />,
    color: "bg-yellow-50 text-yellow-600"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans" data-theme="light">
      {/* 3D Rotating Particles */}
      <ParticleBackground />

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <AnvaLogo className="h-9 w-9 object-cover rounded-lg drop-shadow-sm group-hover:scale-105 transition-transform text-primary" />
            <span className="text-slate-900 font-bold text-xl tracking-tight hidden sm:block">Anva</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link to="/signup" className="bg-slate-900 text-white hover:bg-slate-800 transition-colors px-5 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2">
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm shadow-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Discover Anva Features</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-slate-900 mb-6 leading-tight"
          >
            Everything you need for <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 italic">liftoff</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Anva combines community, artificial intelligence, and specialized tools to create the most effective language learning experience.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-md border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20 text-center bg-slate-900 rounded-[3rem] p-12 sm:p-20 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to reach new heights?</h2>
            <p className="text-slate-300 mb-10 text-lg max-w-xl mx-auto">
              Join thousands of learners around the world who are already experiencing the future of language exchange.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 transition-all px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95">
              Start Your Journey Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </main>
      
      <footer className="relative z-10 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Anva. Fly high with every word.
        </p>
      </footer>
    </div>
  );
};

export default FeaturesPage;

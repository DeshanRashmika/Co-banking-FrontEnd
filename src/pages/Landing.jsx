import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import bitcoinAsset from '../assets/OIP.jpg';
import iconAsset from '../assets/icon-removebg-preview.png';
import home2Asset from '../assets/home2.png';

export default function Landing() {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Creative Background Architecture */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Glow Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
        />
        
        {/* Vector Accents */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navbar - Floating Glass Style */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
        <div className="bg-gray-950/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white/5 rounded-lg border border-white/10">
              <img src={iconAsset} alt="Logo" className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              SECUREBANK
            </span>
          </div>
          
          <div className="hidden md:flex gap-10 items-center text-[13px] font-bold uppercase tracking-widest text-gray-400">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Security</a>
          </div>

          <div className="flex gap-4 items-center">
            {user ? (
              <Link to="/dashboard" className="bg-white text-black px-6 py-2 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95">
                DASHBOARD
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">LOG IN</Link>
                <Link to="/register" className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 rounded-full text-sm font-black transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95">
                  GET STARTED
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - High Impact */}
      <section ref={heroRef} className="relative pt-48 pb-32 px-6 md:px-12 flex flex-col items-center text-center z-10 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl"
        >
          <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">Next-Gen Financial Operating System</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            THE NEW STANDARD <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
              FOR MODERN WEALTH
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            A unified banking experience engineered for performance, security, and absolute control over your digital assets.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="group relative bg-white text-black px-10 py-5 rounded-2xl text-lg font-black transition-all hover:scale-[1.02] shadow-2xl shadow-white/10 overflow-hidden">
              <span className="relative z-10">OPEN YOUR ACCOUNT</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white z-20">OPEN YOUR ACCOUNT</span>
            </Link>
            <a href="#features" className="px-10 py-5 rounded-2xl text-lg font-bold border border-white/10 hover:bg-white/5 transition-all backdrop-blur-sm">
              EXPLORE PLATFORM
            </a>
          </motion.div>
        </motion.div>

        {/* Visual Anchor - Floating Dashboard */}
        <motion.div 
          style={{ y: y1, opacity }}
          className="mt-24 relative w-full max-w-5xl"
        >
          <div className="absolute -inset-10 bg-cyan-500/20 blur-[100px] rounded-full z-0 opacity-50" />
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 p-2 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden backdrop-blur-md"
          >
            <img 
              src={bitcoinAsset} 
              alt="Dashboard" 
              className="w-full h-auto rounded-[2.2rem] opacity-90 brightness-110"
            />
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        </motion.div>
      </section>

      {/* Features - Grid Refinement */}
      <section id="features" className="relative py-32 px-6 md:px-12 z-10 bg-gradient-to-b from-transparent via-[#030712] to-[#030712]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
                ENGINEERED FOR <br /> <span className="text-cyan-500">PEAK PERFORMANCE</span>
              </h2>
              <p className="text-gray-400 text-xl mb-12 leading-relaxed">
                We've rebuilt the banking stack from the ground up to ensure every transaction, trade, and transfer happens at the speed of thought.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent">
                  <div className="p-6 h-full bg-[#0a0f1d] rounded-2xl">
                    <div className="text-cyan-400 font-black text-2xl mb-2">0.01ms</div>
                    <div className="text-gray-500 text-sm font-bold uppercase tracking-widest">Latency core</div>
                  </div>
                </div>
                <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent">
                  <div className="p-6 h-full bg-[#0a0f1d] rounded-2xl">
                    <div className="text-blue-400 font-black text-2xl mb-2">100%</div>
                    <div className="text-gray-500 text-sm font-bold uppercase tracking-widest">Uptime guarantee</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src={home2Asset} alt="Modern Banking" className="w-full rounded-3xl shadow-2xl border border-white/5" />
              <div className="absolute -inset-4 bg-cyan-500/5 blur-2xl -z-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Quantum Security", desc: "Advanced encryption protocols protecting every layer of your financial identity.", color: "cyan" },
              { title: "Smart Logic", desc: "AI-driven insights that categorize spending and optimize your savings automatically.", color: "blue" },
              { title: "Global Access", desc: "Seamless cross-border transfers and multi-currency accounts without the hidden fees.", color: "purple" }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all backdrop-blur-sm"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${f.color}-500/10 flex items-center justify-center mb-8 border border-${f.color}-500/20 group-hover:scale-110 transition-transform`}>
                  <div className={`w-3 h-3 rounded-full bg-${f.color}-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]`} />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Professional Minimalism */}
      <footer className="relative py-20 px-6 md:px-12 z-10 border-t border-white/5 bg-[#010309]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src={iconAsset} alt="Logo" className="h-6 w-6 opacity-50" />
              <span className="text-sm font-black tracking-[0.4em] opacity-50">SECUREBANK</span>
            </div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">© 2026 GLOBAL FINANCIAL INFRASTRUCTURE</p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Network</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

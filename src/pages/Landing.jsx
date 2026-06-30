import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import iconPng from '../assets/icon-removebg-preview.png';
import home2Asset from '../assets/home2.png';
import {
  FiShield, FiZap, FiGlobe, FiTrendingUp, FiArrowRight,
  FiCheckCircle, FiLock, FiCreditCard, FiBarChart2, FiSend
} from 'react-icons/fi';
import { BiBitcoin } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi2';

// ── Reusable fade-in-up wrapper ──────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stats data ────────────────────────────────────────────────────────────────
const STATS = [
  { value: '$4.2B+', label: 'Assets Managed' },
  { value: '2M+',   label: 'Active Users' },
  { value: '180+',  label: 'Countries Supported' },
  { value: '99.99%',label: 'Uptime SLA' },
];

// ── Feature cards data ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <FiShield size={24} />,
    color: 'cyan',
    title: 'Quantum-Grade Security',
    desc: 'Military-level AES-256 encryption, biometric auth, and real-time fraud detection guarding every transaction.',
  },
  {
    icon: <FiZap size={24} />,
    color: 'yellow',
    title: 'Instant Transfers',
    desc: 'Send money anywhere in the world in under 2 seconds with near-zero fees via our optimised rail network.',
  },
  {
    icon: <FiTrendingUp size={24} />,
    color: 'green',
    title: 'Smart Investments',
    desc: 'AI-curated portfolios, real-time stock data, and automated rebalancing to grow your wealth on autopilot.',
  },
  {
    icon: <FiGlobe size={24} />,
    color: 'blue',
    title: 'Global Access',
    desc: 'Multi-currency accounts, borderless payments, and local IBANs in 180+ countries — all from one dashboard.',
  },
  {
    icon: <FiCreditCard size={24} />,
    color: 'purple',
    title: 'Virtual & Physical Cards',
    desc: 'Instant virtual cards for online purchases and premium metal cards shipped worldwide within 3 days.',
  },
  {
    icon: <FiBarChart2 size={24} />,
    color: 'pink',
    title: 'Spending Analytics',
    desc: 'Categorised spend insights, budget goals, and personalised saving tips powered by machine learning.',
  },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Freelance Designer',
    avatar: 'PS',
    text: 'Co-Banking completely replaced my traditional bank. International client payments now take seconds, not days.',
  },
  {
    name: 'Marcus Chen',
    role: 'Startup Founder',
    avatar: 'MC',
    text: 'The investment tools are phenomenal. My portfolio has grown 34% since I switched — the AI suggestions are spot on.',
  },
  {
    name: 'Aisha Okonkwo',
    role: 'E-commerce Operator',
    avatar: 'AO',
    text: 'Managing multiple currency accounts used to be a nightmare. Co-Banking makes it feel effortless.',
  },
];

// ── Color map for Tailwind (avoids dynamic class purging) ─────────────────────
const colorMap = {
  cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   text: 'text-cyan-400',   glow: 'shadow-cyan-500/20'   },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',  glow: 'shadow-green-500/20'  },
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   glow: 'shadow-blue-500/20'   },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  pink:   { bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   text: 'text-pink-400',   glow: 'shadow-pink-500/20'   },
};


export default function Landing() {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="bg-[#030712] min-h-screen text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">

      {/* ── Global background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/8 blur-[140px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-blue-600/8 blur-[140px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      </div>

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50"
      >
        <div className="bg-gray-950/50 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl shadow-black/60">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src={iconPng} alt="Co-Banking" className="h-8 w-auto" />
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Co-Banking
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex gap-8 text-[13px] font-semibold text-gray-400 tracking-wide">
            {['#features', '#solutions', '#security', '#testimonials'].map((href) => (
              <a key={href} href={href} className="hover:text-white transition-colors capitalize">
                {href.slice(1)}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-3 items-center">
            {user ? (
              <Link to="/dashboard"
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors px-3 py-2">
                  Log in
                </Link>
                <Link to="/register"
                  className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 z-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-cyan-500/10 border border-cyan-500/25 backdrop-blur-sm"
          >
            <HiSparkles className="text-cyan-400" size={14} />
            <span className="text-[11px] font-bold tracking-[0.25em] text-cyan-400 uppercase">Next-Gen Financial OS</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.92] tracking-tighter mb-8"
          >
            Banking Built for
            <br />
            <span className="gradient-text">The Future</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            One unified platform for payments, investments, multi-currency accounts,
            and real-time analytics — engineered for performance and absolute security.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/register"
              className="group flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-cyan-500/30">
              Open Free Account
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-gray-300">
              Explore Platform
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap justify-center gap-6 text-[12px] text-gray-500 font-semibold"
          >
            {['256-bit Encryption', 'FDIC Insured', 'No Hidden Fees', '24/7 Support'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <FiCheckCircle className="text-cyan-500" size={13} /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 w-full max-w-4xl mx-auto"
        >
          <div className="absolute -inset-6 bg-cyan-500/10 blur-[80px] rounded-full" />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <img src={home2Asset} alt="Co-Banking Dashboard" className="w-full h-auto object-cover rounded-3xl opacity-90" />

            {/* Floating stat cards */}
            <div className="absolute top-6 left-6 bg-gray-950/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Portfolio</div>
              <div className="text-white font-black text-xl">$24,812.50</div>
              <div className="text-green-400 text-xs font-bold">↑ +8.4% this month</div>
            </div>

            <div className="absolute bottom-6 right-6 bg-gray-950/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <FiSend className="text-cyan-400" size={14} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Last Transfer</div>
                  <div className="text-white font-bold text-sm">$1,200 → Marcus</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1} className="text-center">
              <div className="text-4xl md:text-5xl font-black gradient-text mb-2">{s.value}</div>
              <div className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-5">
              Platform Features
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
              Everything You Need,<br />
              <span className="gradient-text">Nothing You Don't</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              A complete financial ecosystem built for individuals and businesses who demand the best.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <FadeIn key={f.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.25 }}
                    className="group h-full p-8 rounded-3xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-colors backdrop-blur-sm"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center mb-6 ${c.text} group-hover:scale-110 transition-transform`}>
                      {f.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">{f.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SOLUTIONS — two-column highlight
      ══════════════════════════════════════════ */}
      <section id="solutions" className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-[#030d1a] to-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left copy */}
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-6">
              Solutions
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8">
              Personal or Business —<br />
              <span className="gradient-text">We've Got You Covered</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              From everyday spending accounts to multi-entity corporate treasury management,
              Co-Banking scales with your ambitions.
            </p>

            <div className="space-y-4">
              {[
                { icon: <FiCreditCard />, label: 'Personal Accounts', desc: 'Free current accounts, savings vaults, and crypto wallets.' },
                { icon: <FiBarChart2 />, label: 'Business Accounts', desc: 'Multi-user access, expense cards, and invoicing built in.' },
                { icon: <BiBitcoin />, label: 'Crypto & Investments', desc: 'Buy, sell, and stake assets alongside your fiat balance.' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-white mb-0.5">{item.label}</div>
                    <div className="text-gray-500 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/register"
              className="inline-flex items-center gap-2 mt-10 bg-cyan-500 hover:bg-cyan-400 text-white px-7 py-3.5 rounded-2xl font-bold transition-all hover:scale-[1.03] shadow-lg shadow-cyan-500/25">
              Start for Free <FiArrowRight />
            </Link>
          </FadeIn>

          {/* Right — decorative card stack */}
          <FadeIn delay={0.2} className="relative">
            <div className="relative h-[480px]">
              {/* Card 1 — back */}
              <div className="absolute top-0 right-0 w-72 h-44 bg-gradient-to-br from-purple-600/30 to-blue-600/20 border border-white/10 rounded-3xl rotate-6 backdrop-blur-sm" />
              {/* Card 2 — mid */}
              <div className="absolute top-10 right-6 w-72 h-44 bg-gradient-to-br from-blue-600/30 to-cyan-600/20 border border-white/10 rounded-3xl rotate-2 backdrop-blur-sm" />
              {/* Card 3 — front */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 right-12 w-72 h-44 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 rounded-3xl backdrop-blur-xl p-6 shadow-2xl shadow-cyan-500/10"
              >
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-4">Co-Banking</div>
                <div className="text-white font-mono text-sm tracking-widest mb-6">•••• •••• •••• 4291</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Cardholder</div>
                    <div className="text-white text-sm font-bold">Alex Rivera</div>
                  </div>
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full border border-cyan-500/30 flex items-center justify-center">
                    <FiCreditCard className="text-cyan-400" size={16} />
                  </div>
                </div>
              </motion.div>

              {/* Balance widget */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-12 left-0 bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl w-56"
              >
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Balance</div>
                <div className="text-2xl font-black text-white mb-1">$48,291.00</div>
                <div className="text-green-400 text-xs font-bold flex items-center gap-1">
                  <FiTrendingUp size={11} /> +12.3% vs last month
                </div>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECURITY SECTION
      ══════════════════════════════════════════ */}
      <section id="security" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-5">
              Security First
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
              Your Money Is<br />
              <span className="gradient-text">Fortress-Protected</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We didn't bolt on security as an afterthought. It's the foundation every feature is built upon.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <FiLock size={22} />, title: 'AES-256 Encryption', desc: 'All data encrypted at rest and in transit.' },
              { icon: <FiShield size={22} />, title: 'Fraud Detection', desc: 'Real-time ML models block suspicious activity.' },
              { icon: <FiCheckCircle size={22} />, title: 'Regulatory Compliant', desc: 'PCI-DSS, SOC 2 Type II, and GDPR certified.' },
              { icon: <FiZap size={22} />, title: 'Instant Freeze', desc: 'Freeze and unfreeze your card in one tap.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="group p-7 rounded-3xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all text-center">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto mb-5 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section id="testimonials" className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-[#030d1a] to-transparent">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-5">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              Trusted by <span className="gradient-text">2 Million+</span> Users
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-3xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-black">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-purple-600/10 p-16 text-center shadow-2xl shadow-cyan-500/5">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />

              <div className="relative z-10">
                <div className="text-cyan-400 mb-4 flex justify-center">
                  <HiSparkles size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                  Ready to Take Control<br />of Your Finances?
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
                  Join over 2 million people who've already made the switch. Free to open, free to use.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register"
                    className="group inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-[1.03] shadow-xl shadow-cyan-500/30">
                    Create Free Account
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-gray-300">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/5 bg-[#010309] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={iconPng} alt="Co-Banking" className="h-7 w-auto opacity-80" />
                <span className="font-bold text-white">Co-Banking</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The next-generation financial platform built for the modern world.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4">Product</div>
              <div className="space-y-2.5">
                {['Features', 'Security', 'Pricing', 'Changelog'].map((l) => (
                  <a key={l} href="#" className="block text-gray-500 text-sm hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4">Company</div>
              <div className="space-y-2.5">
                {['About', 'Blog', 'Careers', 'Press'].map((l) => (
                  <a key={l} href="#" className="block text-gray-500 text-sm hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4">Legal</div>
              <div className="space-y-2.5">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'].map((l) => (
                  <a key={l} href="#" className="block text-gray-500 text-sm hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-700 text-xs">© 2026 Co-Banking. All rights reserved.</p>
            <p className="text-gray-700 text-xs">Regulated by the Financial Conduct Authority · FDIC Insured</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

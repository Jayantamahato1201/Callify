import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { Sparkles, MessageSquare, Video, ShieldCheck, Zap, Bot, Network, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';

export const Landing = () => {
  const user = useAuthStore(state => state.user);

  if (user) {
    return <Navigate to="/chat" />;
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden selection:bg-primary/30 font-sans relative bg-mesh">
      {/* Animated Glowing Orbs Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6D5DFC]/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#EC4899]/10 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] left-[60%] w-[400px] h-[400px] bg-[#06B6D4]/15 blur-[120px] rounded-full" 
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-md border-b border-white/5 mt-4 rounded-3xl glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D5DFC] to-[#A855F7] p-[1px] glow-box">
            <div className="w-full h-full rounded-xl bg-[#0F1021] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">NexusChat <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign in</Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-[#6D5DFC] to-[#A855F7] hover:opacity-90 shadow-[0_0_20px_rgba(109,93,252,0.4)] border-0 rounded-full px-6 transition-all hover:scale-105 active:scale-95">
              Create Account
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#8B5CF6]/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse"></span>
            <span className="text-sm font-medium text-slate-200">Introducing NexusChat 2.0 with Gemini AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            AI-Powered <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#06B6D4] animate-gradient-x glow-text pb-2 inline-block">
              Communication Platform
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect, collaborate, chat, call, and interact with AI in one intelligent ecosystem. Designed for the future of social networking and teamwork.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full bg-gradient-to-r from-[#6D5DFC] to-[#EC4899] shadow-[0_0_30px_rgba(109,93,252,0.5)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] border-0 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group">
                Get Started Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full glass hover:bg-white/10 transition-colors flex items-center gap-2">
              <Video className="w-5 h-5 text-[#06B6D4]" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Mockup - Hero Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="mt-24 relative mx-auto max-w-6xl animate-float perspective-1000"
        >
          <div className="glass-panel rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-colors duration-500">
            {/* Abstract glow inside mockup */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-50" />
            
            <div className="rounded-2xl overflow-hidden bg-[#0F1021] aspect-[16/9] relative flex flex-col border border-white/5">
               {/* Mockup Header */}
               <div className="h-14 border-b border-white/5 flex items-center px-6 gap-4 bg-white/5">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 </div>
                 <div className="flex-1 flex justify-center">
                   <div className="h-6 w-48 bg-white/5 rounded-full"></div>
                 </div>
               </div>
               
               {/* Mockup Body */}
               <div className="flex-1 flex p-6 gap-6 relative">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
                 
                 {/* Sidebar Mock */}
                 <div className="w-64 flex flex-col gap-4 z-10">
                   <div className="h-12 glass rounded-xl flex items-center px-4 gap-3">
                     <div className="w-6 h-6 rounded bg-[#6D5DFC]/20 flex items-center justify-center"><Network className="w-4 h-4 text-[#8B5CF6]" /></div>
                     <div className="h-3 w-24 bg-white/20 rounded-full"></div>
                   </div>
                   <div className="h-12 glass rounded-xl flex items-center px-4 gap-3">
                     <div className="w-6 h-6 rounded bg-[#EC4899]/20 flex items-center justify-center"><MessageSquare className="w-4 h-4 text-[#EC4899]" /></div>
                     <div className="h-3 w-16 bg-white/20 rounded-full"></div>
                   </div>
                   <div className="h-32 glass rounded-xl mt-auto p-4 flex flex-col gap-3 justify-end border-[#8B5CF6]/30">
                     <div className="h-2 w-16 bg-[#8B5CF6]/50 rounded-full mb-1"></div>
                     <div className="h-8 bg-gradient-to-r from-[#6D5DFC] to-[#A855F7] rounded-lg opacity-80"></div>
                   </div>
                 </div>

                 {/* Main Chat Mock */}
                 <div className="flex-1 flex flex-col gap-4 z-10">
                   <div className="flex-1 glass rounded-2xl p-6 flex flex-col justify-end gap-4 border-t border-l border-white/10">
                     <div className="flex items-end gap-3 self-start w-2/3">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                       <div className="glass p-4 rounded-2xl rounded-bl-sm flex-1">
                         <div className="h-2 w-full bg-white/20 rounded-full mb-2"></div>
                         <div className="h-2 w-4/5 bg-white/20 rounded-full"></div>
                       </div>
                     </div>
                     <div className="flex items-end gap-3 self-end w-2/3 flex-row-reverse">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
                       <div className="bg-gradient-to-r from-[#6D5DFC] to-[#8B5CF6] p-4 rounded-2xl rounded-br-sm flex-1 shadow-lg shadow-[#6D5DFC]/20">
                         <div className="h-2 w-full bg-white/90 rounded-full mb-2"></div>
                         <div className="h-2 w-2/3 bg-white/90 rounded-full"></div>
                       </div>
                     </div>
                   </div>
                   <div className="h-16 glass rounded-2xl flex items-center px-4 gap-4 border-[#06B6D4]/20">
                     <div className="w-8 h-8 rounded-full bg-white/10"></div>
                     <div className="flex-1 h-4 bg-white/5 rounded-full"></div>
                     <div className="w-20 h-10 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#06B6D4] opacity-80"></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The Ultimate Ecosystem</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Everything you need, built with next-gen technology for uncompromised performance and beauty.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Real-Time Sync", desc: "Instant message delivery powered by edge networks.", color: "from-yellow-400 to-orange-500" },
            { icon: Bot, title: "AI Assistant", desc: "Your personal Gemini AI to summarize and draft messages.", color: "from-[#8B5CF6] to-[#EC4899]" },
            { icon: Video, title: "Crystal Calls", desc: "Ultra-low latency WebRTC video & voice integration.", color: "from-[#06B6D4] to-blue-500" },
            { icon: ShieldCheck, title: "Secure Core", desc: "End-to-end encrypted feel with robust architecture.", color: "from-green-400 to-emerald-600" }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="glass-card p-8 rounded-3xl relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity rounded-full -mr-10 -mt-10`}></div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} p-[1px] mb-8 shadow-lg`}>
                <div className="w-full h-full rounded-2xl bg-[#0F1021] flex items-center justify-center">
                  <feat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};


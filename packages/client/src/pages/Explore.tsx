
import { Compass, Users, Hash, TrendingUp, Globe, Search } from 'lucide-react';
import { Input } from '../components/ui/Input';

export const Explore = () => {
  return (
    <div className="flex-1 flex flex-col glass-panel rounded-[2rem] border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] z-20 overflow-hidden relative">
      <div className="h-[88px] px-8 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between z-20 shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-[#06B6D4] flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <h2 className="font-bold text-xl leading-tight tracking-tight text-white">Global Network</h2>
            <p className="text-xs text-[#06B6D4] mt-0.5">Discover communities and nodes</p>
          </div>
        </div>
        
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input className="bg-[#050816] border-white/10 rounded-xl h-10 pl-9 focus:border-blue-500 text-white text-sm" placeholder="Search spaces..." />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 scroll-smooth text-white">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-[#EC4899]" /> Trending Nodes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'AI Researchers', members: 1245, tag: '#ai-research', color: 'from-[#8B5CF6] to-[#EC4899]' },
                { name: 'Neural Devs', members: 892, tag: '#neural-dev', color: 'from-[#06B6D4] to-blue-500' },
                { name: 'Quantum Design', members: 430, tag: '#design', color: 'from-[#EC4899] to-orange-500' },
              ].map((community, i) => (
                <div key={i} className="glass-card rounded-[1.5rem] p-5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${community.color} flex items-center justify-center font-bold text-lg mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {community.name[0]}
                  </div>
                  <h4 className="font-bold text-lg">{community.name}</h4>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Hash size={12}/> {community.tag.replace('#', '')}</span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Users size={12}/> {community.members}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#6D5DFC]/10 via-[#06B6D4]/10 to-transparent border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="absolute right-[-10%] top-[-50%] w-64 h-64 bg-[#06B6D4]/20 blur-3xl rounded-full group-hover:bg-[#06B6D4]/30 transition-colors pointer-events-none"></div>
              <Globe size={40} className="text-[#06B6D4] mb-4" />
              <h3 className="text-2xl font-bold mb-2">Connect to the Global Hub</h3>
              <p className="text-slate-300 max-w-lg mb-6">Join the global directory to allow other nodes to discover your profile and connect with you instantly.</p>
              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-blue-500 font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">Enable Global Discovery</button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

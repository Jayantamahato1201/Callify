import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { login } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  if (user) return <Navigate to="/chat" />;

  const onSubmit = async (data: any) => {
    try {
      const response = await login(data.email, data.password);
      setAuth(response.user, response.accessToken);
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050816] text-white selection:bg-[#6D5DFC]/30 font-sans relative overflow-hidden bg-mesh">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#6D5DFC]/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#EC4899]/10 blur-[150px] rounded-full" 
        />
      </div>

      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md glass-panel p-10 rounded-[2rem] border-white/10"
        >
          <div className="mb-10 flex items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D5DFC] to-[#A855F7] p-[1px] glow-box">
              <div className="w-full h-full rounded-xl bg-[#0F1021] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">NexusChat</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to continue to your AI workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  {...register('email')} 
                  className="pl-11 h-12 bg-white/5 border-white/10 focus:border-[#6D5DFC] focus:ring-[#6D5DFC]/20 rounded-xl transition-all text-white placeholder:text-slate-500" 
                  placeholder="name@example.com"
                  error={!!errors.email}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1 mb-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="#" className="text-xs text-[#8B5CF6] hover:text-[#A855F7] transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  type="password" 
                  {...register('password')} 
                  className="pl-11 h-12 bg-white/5 border-white/10 focus:border-[#6D5DFC] focus:ring-[#6D5DFC]/20 rounded-xl transition-all text-white placeholder:text-slate-500" 
                  placeholder="••••••••"
                  error={!!errors.password}
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message as string}</p>}
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6D5DFC] to-[#8B5CF6] hover:from-[#5b4be0] hover:to-[#7a4ce0] border-0 shadow-[0_0_20px_rgba(109,93,252,0.4)] transition-all flex items-center justify-center gap-2 group mt-4 text-base font-semibold">
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#06B6D4] hover:text-cyan-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side: Abstract visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center border-l border-white/5 bg-[#0F1021]/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6D5DFC]/10 via-transparent to-transparent z-0" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 glass-card p-12 rounded-3xl max-w-lg border-white/10 mx-8 overflow-hidden group hover:border-[#8B5CF6]/30 transition-colors duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity rounded-full -mr-10 -mt-10"></div>
          <Sparkles className="w-12 h-12 text-[#06B6D4] mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          <h3 className="text-4xl font-bold mb-4 leading-tight glow-text">Start connecting with intelligence.</h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            NexusChat AI combines the speed of modern WebSockets with the power of next-generation LLMs in one beautiful workspace.
          </p>
        </motion.div>
      </div>
    </div>
  );
};


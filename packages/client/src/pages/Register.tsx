import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { register as registerUser } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const Register = () => {
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
      const response = await registerUser(data.username, data.email, data.password);
      setAuth(response.user, response.accessToken);
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050816] text-white selection:bg-[#EC4899]/30 font-sans relative overflow-hidden bg-mesh">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-[#06B6D4]/15 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#A855F7]/15 blur-[150px] rounded-full" 
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md glass-panel p-10 rounded-[2rem] border-white/10"
        >
          <div className="mb-10 flex items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D5DFC] to-[#EC4899] p-[1px] glow-box">
              <div className="w-full h-full rounded-xl bg-[#0F1021] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#EC4899]" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">NexusChat</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
            <p className="text-slate-400">Join thousands of users communicating smartly.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  {...register('username')} 
                  className="pl-11 h-12 bg-white/5 border-white/10 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl transition-all text-white placeholder:text-slate-500" 
                  placeholder="johndoe"
                  error={!!errors.username}
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1 ml-1">{errors.username.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  {...register('email')} 
                  className="pl-11 h-12 bg-white/5 border-white/10 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl transition-all text-white placeholder:text-slate-500" 
                  placeholder="name@example.com"
                  error={!!errors.email}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  type="password" 
                  {...register('password')} 
                  className="pl-11 h-12 bg-white/5 border-white/10 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl transition-all text-white placeholder:text-slate-500" 
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

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7a4ce0] hover:to-[#db3a8c] border-0 shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all flex items-center justify-center gap-2 group mt-4 text-base font-semibold">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6D5DFC] hover:text-[#8B5CF6] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center border-l border-white/5 bg-[#0F1021]/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#06B6D4]/10 via-transparent to-transparent z-0" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 glass-card p-12 rounded-3xl max-w-lg border-white/10 mx-8 overflow-hidden group hover:border-[#06B6D4]/30 transition-colors duration-500"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#06B6D4] to-[#6D5DFC] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity rounded-full -ml-10 -mt-10"></div>
          <Sparkles className="w-12 h-12 text-[#A855F7] mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h3 className="text-4xl font-bold mb-4 leading-tight glow-text">Elevate your workspace.</h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            Join the platform that redefines team collaboration, AI assistance, and social networking.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

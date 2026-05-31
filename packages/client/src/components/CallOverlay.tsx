import { useEffect, useRef } from 'react';
import { useCall } from '../context/CallContext';
import { Phone, PhoneOff, Video, Mic, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

export const CallOverlay = () => {
  const { 
    callStatus, 
    incomingCallData, 
    activeCallData, 
    localStream, 
    remoteStream, 
    acceptCall, 
    rejectCall, 
    endCall 
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callStatus]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, callStatus]);

  if (callStatus === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#050816]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 selection:bg-[#6D5DFC]/30 bg-mesh"
      >
        {/* Incoming Call Ringing */}
        {callStatus === 'ringing' && (
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="glass-panel p-10 rounded-[2.5rem] max-w-sm w-full text-center border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(109,93,252,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6D5DFC]/10 to-[#EC4899]/10 z-0" />
            <div className="relative z-10">
              <div className="w-28 h-28 bg-gradient-to-br from-[#6D5DFC] to-[#EC4899] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(236,72,153,0.4)] relative">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                <div className="absolute inset-[-10px] bg-[#6D5DFC] rounded-full animate-ping opacity-10" style={{ animationDelay: '0.2s' }} />
                {incomingCallData?.type === 'video' ? <Video size={44} className="text-white" /> : <Phone size={44} className="text-white" />}
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white glow-text">Incoming Neural Link</h2>
              <p className="text-slate-400 mb-10 font-medium">Unknown Node is attempting connection...</p>
              
              <div className="flex justify-center space-x-8">
                <Button 
                  onClick={rejectCall}
                  size="icon"
                  className="w-16 h-16 rounded-2xl bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-500 hover:text-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <PhoneOff size={28} />
                </Button>
                <Button 
                  onClick={acceptCall}
                  size="icon"
                  className="w-16 h-16 rounded-2xl bg-[#06B6D4]/20 hover:bg-[#06B6D4]/40 border border-[#06B6D4]/50 text-[#06B6D4] hover:text-cyan-300 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                >
                  <Phone size={28} className="animate-pulse" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Outgoing Call Calling */}
        {callStatus === 'calling' && (
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center text-white relative z-10"
          >
            <div className="w-36 h-36 mx-auto rounded-[2.5rem] bg-[#0F1021] border border-white/10 mb-10 flex items-center justify-center relative shadow-[0_0_40px_rgba(109,93,252,0.2)]">
              <div className="absolute inset-0 rounded-[2.5rem] border-2 border-[#6D5DFC] animate-ping opacity-50" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-[-20px] rounded-[3rem] border border-[#A855F7] animate-ping opacity-20" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              <Phone size={50} className="text-[#8B5CF6]" />
            </div>
            <h2 className="text-4xl font-bold mb-3 glow-text">Establishing Link...</h2>
            <p className="text-[#06B6D4] text-xl mb-14 tracking-wide font-medium">Awaiting target response</p>
            <Button 
              onClick={endCall}
              size="icon"
              className="w-16 h-16 rounded-2xl mx-auto bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-500 hover:text-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
              <PhoneOff size={28} />
            </Button>
          </motion.div>
        )}

        {/* Active Call */}
        {callStatus === 'active' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-6xl aspect-video bg-[#050816] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col items-center justify-center"
          >
            {/* Remote Video / Audio UI */}
            {activeCallData?.type === 'video' ? (
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white text-center w-full h-full flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6D5DFC]/10 via-transparent to-transparent z-0" />
                <div className="w-40 h-40 bg-gradient-to-br from-[#6D5DFC] to-[#A855F7] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(109,93,252,0.4)] mb-8 mx-auto relative z-10">
                   <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                   <Phone size={60} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold z-10 glow-text">Audio Link Active</h2>
                <audio ref={remoteVideoRef} autoPlay />
              </div>
            )}

            {/* Local Video Mini-player */}
            {activeCallData?.type === 'video' && localStream && (
              <motion.div 
                drag
                dragConstraints={{ top: 20, right: 20, bottom: 20, left: 20 }}
                className="absolute top-6 right-6 w-56 aspect-video bg-[#0F1021] rounded-2xl overflow-hidden border-2 border-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.3)] z-10 cursor-move"
              >
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              </motion.div>
            )}

            {/* Cinematic Call Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 glass px-8 py-4 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-white/10 z-20">
              <Button size="icon" className="rounded-xl w-12 h-12 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all">
                <Mic size={20} />
              </Button>
              <Button size="icon" className="rounded-xl w-12 h-12 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all">
                <Video size={20} />
              </Button>
              <Button 
                onClick={endCall}
                size="icon"
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 border-0 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] mx-2 transition-all hover:scale-105 active:scale-95"
              >
                <PhoneOff size={24} className="text-white" />
              </Button>
              <Button size="icon" className="rounded-xl w-12 h-12 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all">
                <Maximize size={20} />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

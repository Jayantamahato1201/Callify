import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';


type CallStatus = 'idle' | 'ringing' | 'calling' | 'active';

interface CallContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callStatus: CallStatus;
  incomingCallData: { callerId: string; type: 'audio' | 'video'; conversationId: string } | null;
  activeCallData: { peerId: string; type: 'audio' | 'video' } | null;
  initiateCall: (targetUserId: string, type: 'audio' | 'video') => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useSocket();


  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [incomingCallData, setIncomingCallData] = useState<any>(null);
  const [activeCallData, setActiveCallData] = useState<any>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const createPeerConnection = (peerId: string, _isInitiator: boolean) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('webrtc_ice_candidate', { targetUserId: peerId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const getMediaStream = async (type: 'audio' | 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video',
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Failed to get media devices:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('incoming_call', (data) => {
      if (callStatus !== 'idle') {
        socket.emit('call_rejected', { callerId: data.callerId });
        return;
      }
      setIncomingCallData(data);
      setCallStatus('ringing');
    });

    socket.on('call_accepted', async ({ calleeId }) => {
      if (callStatus !== 'calling' || !activeCallData) return;
      
      const pc = createPeerConnection(calleeId, true);
      localStream?.getTracks().forEach((track) => pc.addTrack(track, localStream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      socket.emit('webrtc_offer', { targetUserId: calleeId, offer });
      setCallStatus('active');
    });

    socket.on('call_rejected', () => {
      cleanupCall();
    });

    socket.on('call_ended', () => {
      cleanupCall();
    });

    socket.on('webrtc_offer', async ({ senderId, offer }) => {
      console.debug('Received offer from', senderId);
      const pc = peerConnectionRef.current;
      if (!pc) return;
      
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socket.emit('webrtc_answer', { targetUserId: senderId, answer });
    });

    socket.on('webrtc_answer', async ({ senderId, answer }) => {
      console.debug('Received answer from', senderId);
      const pc = peerConnectionRef.current;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('webrtc_ice_candidate', async ({ senderId, candidate }) => {
      console.debug('Received ice candidate from', senderId);
      const pc = peerConnectionRef.current;
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off('incoming_call');
      socket.off('call_accepted');
      socket.off('call_rejected');
      socket.off('call_ended');
      socket.off('webrtc_offer');
      socket.off('webrtc_answer');
      socket.off('webrtc_ice_candidate');
    };
  }, [socket, callStatus, activeCallData, localStream]);

  const initiateCall = async (targetUserId: string, type: 'audio' | 'video') => {
    const stream = await getMediaStream(type);
    if (!stream) return;

    setActiveCallData({ peerId: targetUserId, type });
    setCallStatus('calling');
    socket?.emit('call_initiate', { targetUserId, type });
  };

  const acceptCall = async () => {
    if (!incomingCallData) return;
    
    const stream = await getMediaStream(incomingCallData.type);
    if (!stream) {
      rejectCall();
      return;
    }

    const callerId = incomingCallData.callerId;
    setActiveCallData({ peerId: callerId, type: incomingCallData.type });
    setCallStatus('active');
    setIncomingCallData(null);
    
    const pc = createPeerConnection(callerId, false);
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    
    socket?.emit('call_accepted', { callerId });
  };

  const rejectCall = () => {
    if (incomingCallData) {
      socket?.emit('call_rejected', { callerId: incomingCallData.callerId });
    }
    cleanupCall();
  };

  const endCall = () => {
    if (activeCallData) {
      socket?.emit('call_end', { targetUserId: activeCallData.peerId });
    }
    cleanupCall();
  };

  const cleanupCall = () => {
    setCallStatus('idle');
    setIncomingCallData(null);
    setActiveCallData(null);
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  return (
    <CallContext.Provider value={{
      localStream,
      remoteStream,
      callStatus,
      incomingCallData,
      activeCallData,
      initiateCall,
      acceptCall,
      rejectCall,
      endCall
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used within CallProvider');
  return context;
};

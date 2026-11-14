import { io, type Socket } from 'socket.io-client';
import { API_BASE, tokenStore } from './api';

export function createLiveSocket(): Socket {
  return io(API_BASE || undefined, {
    auth: { token: tokenStore.get() },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 6,
  });
}

export interface LiveStroke {
  id: string;
  points: number[];
  color: string;
  width: number;
}

export interface LiveParticipant {
  socketId: string;
  id: string;
  name: string;
  role: string;
  raised: boolean;
  joinedAt: string;
  durationMin: number;
}

export interface LiveChatMessage {
  id: string;
  user: { id: string; name: string; role: string };
  text: string;
  at: string;
}

export interface LivePoll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  correctIndex: number | null;
  active: boolean;
  totalVotes: number;
  startedAt: string;
  endedAt?: string;
}

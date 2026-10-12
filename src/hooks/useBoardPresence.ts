import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface PresencePeer {
  connId: string;
  name: string;
  initials: string;
  color: string;
  device: string;
}

export interface PeerCursor {
  x: number;
  y: number;
  name: string;
  color: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16'];
const CURSOR_THROTTLE_MS = 60;

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function deviceLabel(): string {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Celular' : 'Computador';
}

/**
 * Real presence for a board via Supabase Realtime: who has the board open right now
 * (one entry per open tab/device) and their live cursor positions in board coordinates.
 * Boards are private to their owner today, so peers are the owner's other devices/tabs.
 */
export function useBoardPresence(boardId: string) {
  const [others, setOthers] = useState<PresencePeer[]>([]);
  const [cursors, setCursors] = useState<Record<string, PeerCursor>>({});
  const [self, setSelf] = useState<PresencePeer | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const selfRef = useRef<PresencePeer | null>(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let cancelled = false;
    const connId = crypto.randomUUID();

    (async () => {
      const { data } = await client.auth.getSession();
      const user = data.session?.user;
      if (!user || cancelled) return;

      const meta = user.user_metadata || {};
      const name: string = meta.full_name || meta.name || user.email?.split('@')[0] || 'Você';
      const self: PresencePeer = {
        connId,
        name,
        initials: initialsOf(name),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        device: deviceLabel(),
      };
      selfRef.current = self;
      setSelf(self);

      const channel = client.channel(`presence:board:${user.id}:${boardId}`, {
        config: { presence: { key: connId }, broadcast: { self: false } },
      });
      channelRef.current = channel;

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState<PresencePeer>();
          const peers = Object.entries(state)
            .filter(([key]) => key !== connId)
            .map(([, metas]) => metas[0])
            .filter(Boolean) as PresencePeer[];
          setOthers(peers);
          // Drop cursors of peers that left
          const alive = new Set(peers.map((p) => p.connId));
          setCursors((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => alive.has(id))));
        })
        .on('broadcast', { event: 'cursor' }, ({ payload }) => {
          const { connId: id, x, y, name: peerName, color } = payload as PeerCursor & { connId: string };
          setCursors((prev) => ({ ...prev, [id]: { x, y, name: peerName, color } }));
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') await channel.track(self);
        });
    })();

    return () => {
      cancelled = true;
      if (channelRef.current) client.removeChannel(channelRef.current);
      channelRef.current = null;
      selfRef.current = null;
      setSelf(null);
      setOthers([]);
      setCursors({});
    };
  }, [boardId]);

  // Throttled broadcast of this device's cursor (board coordinates)
  const sendCursor = useCallback((x: number, y: number) => {
    const channel = channelRef.current;
    const self = selfRef.current;
    if (!channel || !self) return;
    const now = performance.now();
    if (now - lastSentRef.current < CURSOR_THROTTLE_MS) return;
    lastSentRef.current = now;
    channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: { connId: self.connId, x, y, name: `${self.name} (${self.device})`, color: self.color },
    });
  }, []);

  return { others, cursors, sendCursor, self };
}

import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Minimize2,
  Maximize2,
  PanelRightClose,
  Hand,
  Copy,
  Check,
  Sparkles,
  Users,
  Radio,
  Pin,
  Bot,
  Send,
  ExternalLink,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

// Stylized Official Google Meet SVG Icon
export const GoogleMeetIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 8.5V6C14 4.89543 13.1046 4 12 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H12C13.1046 20 14 19.1046 14 18V15.5L20 19.5V4.5L14 8.5Z"
      fill="#00AC47"
    />
    <path d="M14 8.5L20 4.5V10.5L14 12V8.5Z" fill="#00832D" />
    <path d="M14 15.5L20 19.5V13.5L14 12V15.5Z" fill="#006622" />
    <path
      d="M12 4H4C2.89543 4 2 4.89543 2 6V12L8 12.5L14 12V6C14 4.89543 13.1046 4 12 4Z"
      fill="#2684FC"
    />
    <path
      d="M2 12V18C2 19.1046 2.89543 20 4 20H12C13.1046 20 14 19.1046 14 18V12L8 11.5L2 12Z"
      fill="#EA4335"
    />
    <path
      d="M8 12.5L14 12V18C14 19.1046 13.1046 20 12 20H8V12.5Z"
      fill="#FBBC04"
    />
  </svg>
);

interface VideoCallStudioProps {
  isOpen: boolean;
  onClose: () => void;
  boardTitle: string;
  onInsertNotesToCanvas?: (notes: { text: string; color: string }[]) => void;
  /** Meet room saved on the board */
  meetLink?: string;
  onMeetLinkChange?: (link: string) => void;
}

function meetCodeFromLink(link?: string): string {
  if (!link) return '';
  const trimmed = link.trim();
  const code = trimmed.includes('meet.google.com/')
    ? trimmed.split('meet.google.com/')[1]
    : trimmed;
  return code.split(/[?#/]/)[0].toLowerCase();
}

// Google Meet refuses to load inside other sites (iframe), so it opens in a
// popup window docked to the right side of the screen, next to the board.
function openMeetWindow(url: string) {
  const availW = window.screen.availWidth || window.innerWidth;
  const availH = window.screen.availHeight || window.innerHeight;
  const availLeft = (window.screen as Screen & { availLeft?: number }).availLeft ?? 0;
  const availTop = (window.screen as Screen & { availTop?: number }).availTop ?? 0;
  const width = Math.max(420, Math.min(560, Math.round(availW * 0.34)));
  const left = availLeft + availW - width;
  const features = `popup=yes,width=${width},height=${availH},left=${left},top=${availTop}`;
  const win = window.open(url, 'diorfy-google-meet', features);
  if (win) {
    win.opener = null;
    win.focus();
  } else {
    // Popup blocked: fall back to a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export const VideoCallStudio: React.FC<VideoCallStudioProps> = ({
  isOpen,
  onClose,
  boardTitle,
  onInsertNotesToCanvas,
  meetLink,
  onMeetLinkChange,
}) => {
  const { t } = useTranslation();

  // Google Meet room saved on the board ('' = no room yet)
  const [googleMeetCode, setGoogleMeetCodeState] = useState<string>(() => meetCodeFromLink(meetLink));
  const setGoogleMeetCode = (code: string) => {
    setGoogleMeetCodeState(code);
    onMeetLinkChange?.(code ? `https://meet.google.com/${code}` : '');
  };

  const [isMeetCopied, setIsMeetCopied] = useState(false);
  const [customMeetInput, setCustomMeetInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Layout mode
  const [layoutMode, setLayoutMode] = useState<'floating' | 'pip' | 'sidebar'>('floating');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isAiExpanded, setIsAiExpanded] = useState(true);

  // Floating reactions on screen
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);

  // Position for floating draggable window
  const [position, setPosition] = useState({ x: Math.max(20, window.innerWidth - 440), y: 75 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: position.x,
    posY: position.y,
  });

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const hasAutoOpenedRef = useRef(false);

  // AI Scribe Live Action Items & Notes
  const [aiNotes, setAiNotes] = useState<
    { id: string; title: string; category: 'action' | 'decision' | 'idea'; color: string }[]
  >([
    {
      id: 'n1',
      title: 'Validar exportação vetorial SVG 4K e PDF de alta resolução',
      category: 'action',
      color: '#fef08a',
    },
    {
      id: 'n2',
      title: 'Slide Motion: suporte a transições 60fps com animações em tempo real',
      category: 'decision',
      color: '#bbf7d0',
    },
    {
      id: 'n3',
      title: 'Diorfy AI Hub: sincronização automática com reuniões do Google Meet',
      category: 'idea',
      color: '#fed7aa',
    },
  ]);

  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Open Google Meet tab immediately
  const handleOpenGoogleMeet = (code?: string) => {
    playSound.pop();
    const targetCode = code || googleMeetCode;
    if (!targetCode) {
      // No room yet: let Google create one, then the user pastes its link here
      handleGenerateNewMeet();
      return;
    }
    openMeetWindow(`https://meet.google.com/${targetCode}`);
  };

  // Lifecycle: Auto-open Google Meet immediately when call is tapped
  useEffect(() => {
    if (!isOpen) {
      hasAutoOpenedRef.current = false;
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
        broadcastChannelRef.current = null;
      }
      return;
    }

    playSound.pop();

    // Auto open Meet on first trigger if not already opened
    if (!hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      if (googleMeetCode) handleOpenGoogleMeet();
      else setShowCustomInput(true);
    }

    // Set up real BroadcastChannel for cross-tab multi-user call sync
    const channelName = `diorfy_meet_${boardTitle.replace(/\s+/g, '_')}`;
    const channel = new BroadcastChannel(channelName);
    broadcastChannelRef.current = channel;

    channel.postMessage({
      type: 'user_joined_meet',
      meetCode: googleMeetCode,
    });

    channel.onmessage = (event) => {
      const { type, meetCode, reaction, note } = event.data;

      if (type === 'sync_meet_code' && meetCode) {
        setGoogleMeetCodeState(meetCode);
      }

      if (type === 'reaction' && reaction) {
        sendLocalReaction(reaction.emoji, false);
      }

      if (type === 'ai_note' && note) {
        setAiNotes((prev) => [note, ...prev]);
        playSound.success();
      }
    };

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [isOpen, boardTitle, googleMeetCode]);

  // Dragging handlers for floating window
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const newX = Math.max(10, Math.min(window.innerWidth - 420, dragRef.current.posX + dx));
      const newY = Math.max(60, Math.min(window.innerHeight - 300, dragRef.current.posY + dy));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Send Floating Reaction
  const sendLocalReaction = (emoji: string, broadcast = true) => {
    playSound.pop();
    const id = Date.now() + Math.random();
    setFloatingReactions((prev) => [...prev, { id, emoji, x: Math.random() * 70 + 15 }]);

    if (emoji === '🎉' || emoji === '🚀' || emoji === '🔥') {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.82, x: 0.8 },
      });
    }

    if (broadcast && broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'reaction',
        reaction: { emoji },
      });
    }

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2500);
  };

  // Raise Hand
  const toggleHandRaise = () => {
    playSound.pop();
    const next = !isHandRaised;
    setIsHandRaised(next);
    if (next) {
      sendLocalReaction('✋');
    }
  };

  // Insert AI generated notes to Canvas
  const handleInsertNotesToCanvas = () => {
    playSound.click();
    confetti({ particleCount: 40, spread: 65 });
    if (onInsertNotesToCanvas) {
      onInsertNotesToCanvas(
        aiNotes.map((n) => ({
          text: `🎯 [Google Meet & IA] ${n.title}`,
          color: n.color,
        }))
      );
    }
  };

  // Ask Diorfy AI in Call to generate action items
  const handleAskAiInCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCustomPrompt.trim()) return;
    setIsAiGenerating(true);
    playSound.pop();

    const promptText = aiCustomPrompt.trim();
    setAiCustomPrompt('');

    setTimeout(() => {
      const colors = ['#fef08a', '#bbf7d0', '#fed7aa', '#e9d5ff', '#bae6fd'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newNote = {
        id: `note-${Date.now()}`,
        title: promptText,
        category: 'action' as const,
        color: randomColor,
      };

      setAiNotes((prev) => [newNote, ...prev]);
      setIsAiGenerating(false);
      playSound.success();

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'ai_note',
          note: newNote,
        });
      }
    }, 800);
  };

  // Copy Meet Link
  const handleCopyMeetLink = () => {
    if (!googleMeetCode) return;
    playSound.pop();
    const url = `https://meet.google.com/${googleMeetCode}`;
    navigator.clipboard.writeText(url);
    setIsMeetCopied(true);
    setTimeout(() => setIsMeetCopied(false), 2200);
  };

  // Generate new Google Meet room
  // Google creates the room at meet.google.com/new; the user pastes the link back to save it
  function handleGenerateNewMeet() {
    playSound.pop();
    openMeetWindow('https://meet.google.com/new');
    setShowCustomInput(true);
    setLayoutMode('floating'); // the paste-link field lives in the full panel
  }

  // Custom Meet submit
  const handleCustomMeetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMeetInput.trim()) return;
    playSound.click();

    const code = meetCodeFromLink(customMeetInput);
    if (!code) return;
    setGoogleMeetCode(code);
    setShowCustomInput(false);
    setCustomMeetInput('');

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'sync_meet_code',
        meetCode: code,
      });
    }
    handleOpenGoogleMeet(code);
  };

  if (!isOpen) return null;

  // 1. Picture-in-Picture (PiP) Mode
  if (layoutMode === 'pip') {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in-95 duration-200 select-none">
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-2.5 shadow-2xl border border-white/20 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-emerald-950/60 ring-2 ring-emerald-500/50 flex items-center justify-center shrink-0">
            <GoogleMeetIcon className="w-7 h-7" />
          </div>

          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate max-w-[120px]">Google Meet</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500 text-white animate-pulse">
                AO VIVO
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-mono mt-0.5 truncate max-w-[130px]">
              {googleMeetCode ? `meet.google.com/${googleMeetCode}` : 'Nenhuma sala salva ainda'}
            </p>
          </div>

          <div className="flex items-center gap-1 pl-1 border-l border-white/10">
            <button
              onClick={() => handleOpenGoogleMeet()}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              title="Abrir no Google Meet"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('floating')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playSound.click();
                onClose();
              }}
              className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Sidebar Docked Mode
  if (layoutMode === 'sidebar') {
    return (
      <aside className="fixed top-13 right-0 bottom-0 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-40 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none text-white">
        {/* Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 min-w-0">
            <GoogleMeetIcon className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold text-white truncate">Google Meet ({boardTitle})</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500 text-white">LIVE</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLayoutMode('floating')}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              title="Janela Flutuante"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-rose-400 hover:text-rose-200 rounded-lg hover:bg-rose-500/20"
              title="Fechar Central"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Google Meet Active Room Box */}
        <div className="p-3 bg-slate-950/60 border-b border-white/10 space-y-2.5">
          <div className="p-3 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 rounded-2xl border border-emerald-500/30 text-center space-y-2 shadow-inner">
            <div className="flex items-center justify-center gap-2">
              <GoogleMeetIcon className="w-6 h-6" />
              <span className="font-extrabold text-xs text-white">Sala Oficial Google Meet</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/20 font-mono text-xs text-emerald-400 font-bold flex items-center justify-between">
              <span className="truncate">{googleMeetCode ? `meet.google.com/${googleMeetCode}` : 'Nenhuma sala salva ainda'}</span>
              <button
                onClick={handleCopyMeetLink}
                className="p-1 hover:text-white rounded transition-colors cursor-pointer"
                title="Copiar Link"
              >
                {isMeetCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleOpenGoogleMeet()}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Google Meet</span>
              </button>
              <button
                onClick={handleGenerateNewMeet}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Criar Nova Sala"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 1. EMOJIS REACTIONS BAR */}
        <div className="px-3 py-1.5 bg-slate-950/70 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {['❤️', '👏', '🔥', '🎉', '🚀', '💡'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendLocalReaction(emoji)}
                className="p-1 hover:scale-125 transition-transform text-sm cursor-pointer rounded hover:bg-white/10"
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            onClick={toggleHandRaise}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isHandRaised ? 'bg-amber-500 text-slate-950 ring-1 ring-amber-300' : 'bg-white/10 text-white'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span className="text-[10px]">{isHandRaised ? 'Mão Erguida' : 'Pedir Fala'}</span>
          </button>
        </div>

        {/* 2. DIORFY IA COPILOT (DIRETAMENTE ABAIXO DOS EMOJIS) */}
        <div className="p-3 bg-gradient-to-b from-indigo-950/70 to-slate-950 border-t border-indigo-500/30 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="space-y-2 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-indigo-400" /> Diorfy IA Copilot
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Google Meet Sync
              </span>
            </div>

            <div className="space-y-1.5">
              {aiNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-2 rounded-lg text-slate-900 text-xs font-medium shadow-xs flex items-start gap-1.5"
                  style={{ backgroundColor: note.color }}
                >
                  <Pin className="w-3 h-3 text-slate-700 shrink-0 mt-0.5" />
                  <span className="leading-tight">{note.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-2 border-t border-white/10">
            <button
              onClick={handleInsertNotesToCanvas}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Inserir Post-its no Quadro</span>
            </button>

            <form onSubmit={handleAskAiInCall} className="flex items-center gap-1">
              <input
                type="text"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="Perguntar à IA ou criar tarefa..."
                className="flex-1 bg-white/10 text-white placeholder-slate-400 text-xs px-2.5 py-1.5 rounded-lg outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                type="submit"
                disabled={isAiGenerating}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-3 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => handleOpenGoogleMeet()}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <GoogleMeetIcon className="w-4 h-4" />
            <span>Ir para o Meet</span>
          </button>
          <button
            onClick={onClose}
            className="ml-2 p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-md"
            title="Fechar"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // 3. Floating Draggable Window (Default)
  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '410px',
        zIndex: 45,
      }}
      className="bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 select-none"
    >
      {/* Draggable Title Header */}
      <div
        onMouseDown={handleMouseDown}
        className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between cursor-grab active:cursor-grabbing bg-slate-800/80"
      >
        <div className="flex items-center gap-2 min-w-0">
          <GoogleMeetIcon className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold text-white truncate max-w-[180px]">Google Meet</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500 text-white tracking-wider animate-pulse">
            AO VIVO
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyMeetLink}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Copiar Link do Google Meet"
          >
            {isMeetCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setLayoutMode('sidebar')}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Fixar na Lateral"
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLayoutMode('pip')}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Minimizar (PiP)"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
            title="Fechar"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Reactions overlay */}
      {floatingReactions.map((item) => (
        <div
          key={item.id}
          style={{ left: `${item.x}%`, bottom: '110px' }}
          className="absolute text-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 pointer-events-none z-50"
        >
          {item.emoji}
        </div>
      ))}

      {/* Google Meet Direct Launch Card */}
      <div className="p-3 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/10 space-y-2.5">
        <div className="p-3 bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-slate-950 rounded-2xl border border-emerald-500/30 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <GoogleMeetIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Reunião Aberta no Google Meet
                </h4>
                <p className="text-[10px] text-slate-400">
                  {boardTitle} • Sala sincronizada
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              Ao Vivo
            </span>
          </div>

          {/* Room Link Display & Actions */}
          <div className="p-2 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-2">
            <div className="min-w-0 font-mono text-xs text-emerald-400 font-bold truncate">
              {googleMeetCode ? `meet.google.com/${googleMeetCode}` : 'Nenhuma sala salva ainda'}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopyMeetLink}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Copiar Link"
              >
                {isMeetCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isMeetCopied ? 'Copiado!' : 'Copiar'}</span>
              </button>
              <button
                onClick={handleGenerateNewMeet}
                className="p-1 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Criar Nova Sala"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Big Launch / Reopen Button */}
          <button
            onClick={() => handleOpenGoogleMeet()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 hover:shadow-emerald-950/60 transition-all cursor-pointer"
          >
            <GoogleMeetIcon className="w-4 h-4" />
            <span>{googleMeetCode ? 'Abrir Google Meet ao lado do quadro' : 'Criar sala no Google Meet'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Custom Meet Code Toggle */}
          <div className="text-center pt-0.5">
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-[10px] text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {showCustomInput ? '▲ Ocultar' : googleMeetCode ? '▼ Trocar a sala deste quadro' : '▼ Já tenho um link do Meet'}
            </button>
          </div>

          {showCustomInput && (
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Crie a sala no Google Meet, copie o link da janela que abriu e cole aqui. Ele fica salvo neste quadro para as próximas reuniões.
            </p>
          )}

          {showCustomInput && (
            <form onSubmit={handleCustomMeetSubmit} className="flex items-center gap-1.5 pt-1 animate-in fade-in">
              <input
                type="text"
                value={customMeetInput}
                onChange={(e) => setCustomMeetInput(e.target.value)}
                placeholder="Cole o link: meet.google.com/abc-defg-hij"
                className="flex-1 bg-slate-900/90 text-white placeholder-slate-500 text-xs px-2.5 py-1.5 rounded-xl border border-white/10 outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Salvar sala
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 1. QUICK EMOJI REACTIONS BAR */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {['❤️', '👏', '🔥', '🎉', '🚀', '💡'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => sendLocalReaction(emoji)}
              className="p-1 hover:scale-130 active:scale-95 transition-transform text-sm cursor-pointer rounded-lg hover:bg-white/10"
              title={`Reagir com ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          onClick={toggleHandRaise}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isHandRaised
              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-bold shadow-md animate-bounce'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Levantar a mão"
        >
          <Hand className="w-3.5 h-3.5" />
          <span className="text-[11px]">{isHandRaised ? 'Mão Erguida' : 'Pedir Fala'}</span>
        </button>
      </div>

      {/* 2. DIORFY IA COPILOT (COLOCADO DIRETAMENTE ABAIXO DOS EMOJIS) */}
      <div className="bg-gradient-to-b from-indigo-950/90 via-slate-900/90 to-slate-950 border-t border-indigo-500/30 p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="p-1 rounded-lg bg-indigo-600/30 border border-indigo-400/30 text-indigo-300">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-indigo-200">Diorfy IA Copilot</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
              Meet Sincronizado
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleInsertNotesToCanvas}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              title="Inserir itens de ação como post-its no quadro"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Inserir Post-its</span>
            </button>
            <button
              onClick={() => setIsAiExpanded(!isAiExpanded)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 text-xs"
            >
              {isAiExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {isAiExpanded && (
          <>
            {/* Action Items List */}
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {aiNotes.map((note) => (
                <div
                  key={note.id}
                  className="px-2.5 py-1.5 rounded-lg text-slate-900 text-[11px] font-semibold shadow-xs flex items-start gap-1.5"
                  style={{ backgroundColor: note.color }}
                >
                  <Pin className="w-3 h-3 text-slate-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{note.title}</span>
                </div>
              ))}
            </div>

            {/* Quick Prompt Input for Diorfy AI in Call */}
            <form onSubmit={handleAskAiInCall} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="Pedir à IA para resumir decisão ou criar tarefa..."
                className="flex-1 bg-white/10 text-white placeholder-slate-400 text-xs px-2.5 py-1.5 rounded-xl outline-none focus:ring-1 focus:ring-indigo-400 border border-white/10"
              />
              <button
                type="submit"
                disabled={isAiGenerating}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isAiGenerating ? (
                  <Sparkles className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Criar</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Bottom Close / Leave */}
      <div className="p-2.5 bg-slate-950 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={() => handleOpenGoogleMeet()}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <GoogleMeetIcon className="w-4 h-4" />
          <span>Acessar Google Meet</span>
        </button>
        <button
          onClick={() => {
            playSound.click();
            onClose();
          }}
          className="ml-2 px-3 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold cursor-pointer transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

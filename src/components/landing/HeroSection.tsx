import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Clock, 
  Users, 
  Plus, 
  MoreHorizontal, 
  Layers, 
  Zap, 
  MousePointer, 
  Flame, 
  Compass, 
  Check, 
  Calendar,
  Sparkle
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

interface HeroSectionProps {
  onOpenRegister: () => void;
  onOpenDemo: () => void;
}

interface ProjectCard {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  priority: 'Alta' | 'Média' | 'Normal';
  dueDate: string;
  assignee: { name: string; avatar: string; color: string };
  progress: number;
  commentsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenRegister,
  onOpenDemo,
}) => {
  // Interactive Kanban Mockup State
  const [columns, setColumns] = useState<{
    backlog: ProjectCard[];
    inProgress: ProjectCard[];
    completed: ProjectCard[];
  }>({
    backlog: [
      {
        id: 'c1',
        title: 'Estruturar Arquitetura do Funil de Conversão',
        category: 'Arquitetura',
        categoryColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        priority: 'Alta',
        dueDate: 'Hoje',
        assignee: { name: 'Lucas', avatar: 'L', color: 'bg-indigo-600' },
        progress: 35,
        commentsCount: 6,
      },
      {
        id: 'c2',
        title: 'Benchmark de Onboarding & UX Mobile',
        category: 'Pesquisa',
        categoryColor: 'bg-amber-50 text-amber-700 border-amber-200',
        priority: 'Normal',
        dueDate: 'Amanhã',
        assignee: { name: 'Beatriz', avatar: 'B', color: 'bg-amber-500' },
        progress: 15,
        commentsCount: 3,
      },
    ],
    inProgress: [
      {
        id: 'c3',
        title: 'Mapeamento Visual de Microsserviços & APIs',
        category: 'Engenharia',
        categoryColor: 'bg-blue-50 text-blue-700 border-blue-200',
        priority: 'Alta',
        dueDate: '14 Out',
        assignee: { name: 'Gabriel', avatar: 'G', color: 'bg-blue-600' },
        progress: 70,
        commentsCount: 12,
      },
      {
        id: 'c4',
        title: 'Wireframe Interativo da Nova Dashboard SaaS',
        category: 'Design System',
        categoryColor: 'bg-purple-50 text-purple-700 border-purple-200',
        priority: 'Alta',
        dueDate: '16 Out',
        assignee: { name: 'Mariana', avatar: 'M', color: 'bg-purple-600' },
        progress: 85,
        commentsCount: 8,
      },
    ],
    completed: [
      {
        id: 'c5',
        title: 'Brainstorming Estratégico Q4 & OKRs 2026',
        category: 'Estratégia',
        categoryColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        priority: 'Normal',
        dueDate: 'Concluído',
        assignee: { name: 'Felipe', avatar: 'F', color: 'bg-emerald-600' },
        progress: 100,
        commentsCount: 14,
      },
    ],
  });

  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Move card to next column on click
  const handleMoveCard = (cardId: string, currentColumn: 'backlog' | 'inProgress' | 'completed') => {
    playSound.pop();
    setActiveCardId(cardId);
    setTimeout(() => setActiveCardId(null), 400);

    setColumns((prev) => {
      let card: ProjectCard | undefined;
      const newBacklog = [...prev.backlog];
      const newInProgress = [...prev.inProgress];
      const newCompleted = [...prev.completed];

      if (currentColumn === 'backlog') {
        const idx = newBacklog.findIndex((c) => c.id === cardId);
        if (idx !== -1) {
          card = { ...newBacklog[idx], progress: 65 };
          newBacklog.splice(idx, 1);
          newInProgress.unshift(card);
        }
      } else if (currentColumn === 'inProgress') {
        const idx = newInProgress.findIndex((c) => c.id === cardId);
        if (idx !== -1) {
          card = { ...newInProgress[idx], progress: 100, dueDate: 'Concluído' };
          newInProgress.splice(idx, 1);
          newCompleted.unshift(card);
        }
      } else {
        const idx = newCompleted.findIndex((c) => c.id === cardId);
        if (idx !== -1) {
          card = { ...newCompleted[idx], progress: 20, dueDate: 'Reaberto' };
          newCompleted.splice(idx, 1);
          newBacklog.push(card);
        }
      }

      return {
        backlog: newBacklog,
        inProgress: newInProgress,
        completed: newCompleted,
      };
    });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40">
      {/* Background Subtle Gradient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-400/15 via-purple-300/15 to-cyan-300/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-300/10 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-purple-300/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Grid Pattern Background subtle */}
      <div className="absolute inset-0 canvas-grid-dots opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Content */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge: PLANEJAMENTO INTELIGENTE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-blue-200/80 shadow-xs backdrop-blur-md animate-float-slow">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ideia → Plano → Entrega
            </span>
            <div className="w-px h-3 bg-slate-200" />
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Com IA integrada
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] text-balance">
            Pare de planejar em 5 ferramentas.{' '}
            <span className="diorfy-gradient-text relative inline-block">
              Comece a entregar.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-cyan-400/60" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Brainstorming, funis, mapas mentais e Kanban no <strong className="font-semibold text-slate-800">mesmo quadro</strong>. Sua equipe sai da ideia para a tarefa com 1 clique, sem copiar e colar entre apps e sem reunião para "alinhar onde está cada coisa".
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => {
                playSound.pop();
                onOpenRegister();
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Criar meu quadro grátis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                playSound.click();
                onOpenDemo();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/90 border border-slate-200/90 text-slate-700 font-semibold text-base hover:bg-slate-50 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
            >
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3 h-3 fill-blue-600 ml-0.5" />
              </div>
              <span>Ver como funciona</span>
            </button>
          </div>

          {/* Social Micro Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Sem necessidade de cartão</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pronto para usar em 2 minutos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Plano grátis para sempre</span>
            </div>
          </div>
        </div>

        {/* Mockup Visual of Project Dashboard (Backlog, Em andamento, Concluído) */}
        <div id="dashboard-preview" className="mt-14 relative max-w-6xl mx-auto">
          {/* Subtle Ambient Glow underneath frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-[28px] blur-xl opacity-70 -z-10" />

          {/* Main Dashboard Window Container */}
          <div className="relative rounded-[24px] border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 overflow-hidden">
            {/* Window Topbar */}
            <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Traffic lights dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-4 w-px bg-slate-200" />
                {/* Project Title & Status */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Sprint Q4: Lançamento Diorfy Core</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Ao Vivo</span>
                </div>
              </div>

              {/* Top right collaboration avatars & actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white" title="Lucas (Product)">L</div>
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white" title="Mariana (Design)">M</div>
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white" title="Gabriel (Tech)">G</div>
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">+4</div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium px-2 py-1 rounded-lg bg-white border border-slate-200">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>88% Concluído</span>
                </div>
              </div>
            </div>

            {/* Dashboard Workspace Body */}
            <div className="p-4 sm:p-6 bg-slate-50/40">
              {/* Filter / Search Bar strip */}
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visualização:</span>
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                    <button className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Quadro Kanban</span>
                    </button>
                    <button className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-semibold">
                      Tabela
                    </button>
                    <button className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-semibold">
                      Timeline
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  <Sparkle className="w-3 h-3 text-indigo-500" />
                  <span>Dica: Clique nos cards para avançar de coluna</span>
                </div>
              </div>

              {/* 3 Columns: Backlog, Em andamento, Concluído */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {/* COLUMN 1: BACKLOG */}
                <div className="flex flex-col bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3.5 min-h-[340px]">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Backlog</h3>
                      <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
                        {columns.backlog.length}
                      </span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columns.backlog.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => handleMoveCard(card.id, 'backlog')}
                        className={`p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group ${
                          activeCardId === card.id ? 'scale-98 ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${card.categoryColor}`}>
                            {card.category}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {card.dueDate}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                          {card.title}
                        </h4>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-5 h-5 rounded-full ${card.assignee.color} text-white text-[9px] font-bold flex items-center justify-center`}>
                              {card.assignee.avatar}
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">{card.assignee.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            Mover <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: EM ANDAMENTO */}
                <div className="flex flex-col bg-blue-50/40 border border-blue-200/80 rounded-2xl p-3.5 min-h-[340px]">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Em andamento</h3>
                      <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-blue-200 text-blue-800">
                        {columns.inProgress.length}
                      </span>
                    </div>
                    <button className="text-blue-400 hover:text-blue-600 p-1">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columns.inProgress.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => handleMoveCard(card.id, 'inProgress')}
                        className={`p-3.5 rounded-xl bg-white border border-blue-200/90 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group ${
                          activeCardId === card.id ? 'scale-98 ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${card.categoryColor}`}>
                            {card.category}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {card.progress}%
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                          {card.title}
                        </h4>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-5 h-5 rounded-full ${card.assignee.color} text-white text-[9px] font-bold flex items-center justify-center`}>
                              {card.assignee.avatar}
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">{card.assignee.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            Concluir <Check className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 3: CONCLUÍDO */}
                <div className="flex flex-col bg-emerald-50/30 border border-emerald-200/80 rounded-2xl p-3.5 min-h-[340px]">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Concluído</h3>
                      <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-200 text-emerald-800">
                        {columns.completed.length}
                      </span>
                    </div>
                    <button className="text-emerald-500 hover:text-emerald-700 p-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columns.completed.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => handleMoveCard(card.id, 'completed')}
                        className={`p-3.5 rounded-xl bg-white border border-emerald-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group ${
                          activeCardId === card.id ? 'scale-98 ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${card.categoryColor}`}>
                            {card.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Feito
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug line-through text-slate-400">
                          {card.title}
                        </h4>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-5 h-5 rounded-full ${card.assignee.color} text-white text-[9px] font-bold flex items-center justify-center`}>
                              {card.assignee.avatar}
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">{card.assignee.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">100% entregue</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Live Team Cursor Badges */}
            <div className="absolute bottom-6 right-8 hidden lg:flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float-slow pointer-events-none">
              <MousePointer className="w-3.5 h-3.5 fill-white" />
              <span>Mariana editando Wireframe</span>
            </div>
            <div className="absolute top-20 left-12 hidden lg:flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float-reverse pointer-events-none">
              <MousePointer className="w-3.5 h-3.5 fill-white" />
              <span>Gabriel adicionou 2 nós de API</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, 
  Workflow, 
  ArrowRight, 
  MousePointer, 
  Check, 
  Zap, 
  Brain, 
  Share2, 
  Layout, 
  Plus, 
  MessageSquare, 
  Layers,
  Sparkle,
  Copy,
  FolderKanban
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

export const FlowchartSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [stickyNotes, setStickyNotes] = useState([
    { id: 1, text: '💡 Adicionar etapa de Qualificação por WhatsApp', color: 'bg-amber-100 border-amber-300 text-amber-900', author: 'Beatriz' },
    { id: 2, text: '⚡ Otimizar checkout com 1 clique (Pix Express)', color: 'bg-emerald-100 border-emerald-300 text-emerald-900', author: 'Lucas' },
  ]);
  const [newStickyText, setNewStickyText] = useState('');

  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Ideação & Pesquisa',
      desc: 'Reúna benchmarks, imagens com Ctrl+V, notas de pesquisa e personas em um canvas sem limites.',
      badge: 'Brainstorming',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 2,
      number: '02',
      title: 'Arquitetura & Wireframes',
      desc: 'Desenhe wireframes de alta fidelidade e mapas mentais com nós inteligentes e alinhamento automático.',
      badge: 'Design & UX',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 3,
      number: '03',
      title: 'Funil de Conversão & Ações',
      desc: 'Mapeie cada etapa de tráfego, checkout, gatilhos de automação e eventos de compra com precisão.',
      badge: 'Growth & Vendas',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 4,
      number: '04',
      title: 'Execução Ágil no Kanban',
      desc: 'Transforme qualquer nó ou ideia do quadro em cartões acionáveis de sprint com 1 clique.',
      badge: 'Delivery & Sprints',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  const handleAddSticky = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStickyText.trim()) return;
    playSound.pop();
    setStickyNotes([
      ...stickyNotes,
      {
        id: Date.now(),
        text: newStickyText.trim(),
        color: 'bg-blue-100 border-blue-300 text-blue-900',
        author: 'Você',
      },
    ]);
    setNewStickyText('');
  };

  return (
    <section id="fluxograma" className="py-20 md:py-28 bg-slate-50/70 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-l from-indigo-200/20 via-purple-200/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-blue-200/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-200/80 shadow-2xs">
            <Workflow className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Fluxo Visual Unificado
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            A ideia não se perde{' '}
            <span className="diorfy-gradient-text">no caminho até a entrega.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            O rascunho, o funil e a tarefa vivem conectados. Quando o plano muda, todo mundo vê na hora, do primeiro post-it até o card no Kanban.
          </p>
        </div>

        {/* 4 Interactive Process Steps Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {steps.map((step) => {
            const isSelected = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => {
                  playSound.click();
                  setActiveStep(step.id);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none text-left relative overflow-hidden group ${
                  isSelected
                    ? 'bg-white border-blue-500 ring-4 ring-blue-500/10 shadow-lg'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black font-mono text-slate-400 group-hover:text-blue-600 transition-colors">
                    {step.number}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Mockup Canvas Visual Diagram */}
        <div className="relative rounded-[24px] border border-slate-200/90 bg-white shadow-xl overflow-hidden">
          {/* Canvas Topbar toolbar */}
          <div className="px-5 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-blue-600" />
                Fluxo de Onboarding & Aquisição SaaS (Canvas Interativo)
              </span>
            </div>

            {/* Quick Sticky Form */}
            <form onSubmit={handleAddSticky} className="flex items-center gap-2">
              <input
                type="text"
                value={newStickyText}
                onChange={(e) => setNewStickyText(e.target.value)}
                placeholder="+ Adicionar nota adesiva..."
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs"
              >
                Fixar
              </button>
            </form>
          </div>

          {/* Canvas Working Area with Visual Nodes & Connectors */}
          <div className="relative min-h-[460px] p-6 sm:p-10 canvas-grid-lines bg-slate-50/30 overflow-x-auto">
            {/* SVG Connecting Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '750px' }}>
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              {/* Curve from Node 1 to Node 2 */}
              <path
                d="M 210,130 C 270,130 280,130 340,130"
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="2.5"
                strokeDasharray="6,4"
              />
              {/* Curve from Node 2 to Node 3 */}
              <path
                d="M 520,130 C 580,130 590,130 650,130"
                fill="none"
                stroke="url(#flowGrad)"
                strokeWidth="2.5"
                strokeDasharray="6,4"
              />
              {/* Curve down to Kanban Step */}
              <path
                d="M 750,195 C 750,260 500,290 400,290"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5,3"
              />
            </svg>

            {/* FLOW NODES ROW */}
            <div className="flex items-start gap-12 relative z-10 pb-8" style={{ minWidth: '850px' }}>
              {/* NODE 1: Anúncio & Tráfego */}
              <div
                onClick={() => {
                  playSound.pop();
                  setActiveStep(1);
                }}
                className={`w-48 p-4 rounded-2xl bg-white border-2 shadow-md transition-all cursor-pointer ${
                  activeStep === 1 ? 'border-blue-600 ring-4 ring-blue-500/15 scale-105' : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Origem
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">12.4k views</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">📢 Tráfego Pago & Ads</h4>
                <p className="text-[11px] text-slate-500 leading-tight">Campanhas Meta, Google e TikTok</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-blue-600 font-bold">
                  <span>CTR: 4.2%</span>
                  <span>CPC: R$ 0,85</span>
                </div>
              </div>

              {/* NODE 2: Landing Page Wireframe */}
              <div
                onClick={() => {
                  playSound.pop();
                  setActiveStep(2);
                }}
                className={`w-52 p-4 rounded-2xl bg-white border-2 shadow-md transition-all cursor-pointer ${
                  activeStep === 2 ? 'border-indigo-600 ring-4 ring-indigo-500/15 scale-105' : 'border-slate-200 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    Página de Vendas
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">38% conv.</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">🖥️ Landing Page Diorfy</h4>
                <p className="text-[11px] text-slate-500 leading-tight">VSL + Prova Social + Calculadora</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-slate-600 font-bold">4.7k Leads</span>
                  <span className="text-emerald-600 font-bold">A/B Test Vencedor</span>
                </div>
              </div>

              {/* NODE 3: Checkout & Ação de Conversão */}
              <div
                onClick={() => {
                  playSound.pop();
                  setActiveStep(3);
                }}
                className={`w-52 p-4 rounded-2xl bg-white border-2 shadow-md transition-all cursor-pointer ${
                  activeStep === 3 ? 'border-purple-600 ring-4 ring-purple-500/15 scale-105' : 'border-slate-200 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    Conversão
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">R$ 142k</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">💳 Checkout & Upgrade Pro</h4>
                <p className="text-[11px] text-slate-500 leading-tight">Assinatura Anual com 20% OFF</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-purple-700 font-bold">
                  <span>942 Vendas</span>
                  <span>Pix + Cartão</span>
                </div>
              </div>
            </div>

            {/* LOWER ROW: Sticky Notes & Kanban Task Card */}
            <div className="mt-4 flex items-start gap-5 flex-wrap relative z-10">
              {/* Sticky Notes Container */}
              <div className="flex items-center gap-3 flex-wrap">
                {stickyNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`w-52 p-3.5 rounded-xl border shadow-xs ${note.color} transition-transform hover:scale-105 cursor-default`}
                  >
                    <p className="text-xs font-medium leading-snug">{note.text}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] opacity-75 font-semibold">
                      <span>{note.author}</span>
                      <span>Agora</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Converted Kanban Task Card */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs w-64 text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <FolderKanban className="w-3 h-3" /> Tarefa no Sprint
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">Sincronizado</span>
                </div>
                <p className="text-xs font-bold text-emerald-950">Implementar Pix Express no Checkout</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">Responsável: Carlos (Tech Lead) • Prazo: 2 dias</p>
              </div>
            </div>

            {/* Live Floating Cursor Mock */}
            <div className="absolute top-8 left-96 hidden md:flex items-center gap-1.5 bg-purple-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-float-slow pointer-events-none">
              <MousePointer className="w-3 h-3 fill-white" />
              <span>Mariana conectando nós</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

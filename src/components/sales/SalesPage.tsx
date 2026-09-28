import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  ShieldCheck,
  Layers,
  Copy,
  ChevronDown,
  Play,
  Maximize2,
  Users,
  Compass,
  FileCode,
  Layout,
  Plus,
  MousePointer,
  Brain,
  Download,
  CheckCircle2,
  Trash2,
  Calculator,
  TrendingUp,
  Clock,
  Coins,
  Share2,
  Lock,
  Sparkle,
  Image as ImageIcon,
  Workflow,
  BarChart3,
  HelpCircle,
  Eye,
  Sliders,
  X,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Bot,
  MoveRight,
  Share,
  MessageSquare,
  Globe,
  Building2,
  Database,
  Grid,
  Laptop,
} from 'lucide-react';
import { UserProfile, UserPlan } from '../../types/auth';
import { AuthModal } from '../auth/AuthModal';
import { CheckoutModal } from './CheckoutModal';
import { playSound } from '../../utils/soundEffects';
import { LanguageSelector } from '../common/LanguageSelector';
import { useTranslation } from '../../i18n/I18nContext';

interface SalesPageProps {
  onEnterPlatform: () => void;
  onOpenBoard?: (boardId: string) => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onEnterPlatform }) => {
  const { t } = useTranslation();
  // Modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<UserPlan>('pro');
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  // Billing cycle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Interactive Pillar Tab
  const [activeFeatureTab, setActiveFeatureTab] = useState<'mindmap' | 'clipboard' | 'architecture' | 'ai'>('mindmap');

  // Mindmap Structure Selector
  const [selectedMindmapType, setSelectedMindmapType] = useState<'radial' | 'tree' | 'fishbone' | 'funnel'>('radial');

  // Interactive Live Canvas Sandbox in Hero
  const [heroNotes, setHeroNotes] = useState<Array<{ id: number; text: string; color: string; x: number; y: number; author: string; tag: string }>>([
    { id: 1, text: 'Definir Arquitetura & Microsserviços', color: '#EFF6FF', x: 20, y: 20, author: 'Carlos (Tech Lead)', tag: 'Planejamento' },
    { id: 2, text: 'Validar Jornada de Onboarding do Usuário', color: '#FEF3C7', x: 240, y: 30, author: 'Beatriz (Product)', tag: 'UX Research' },
    { id: 3, text: 'Cole prints da concorrência com Ctrl+V', color: '#ECFDF5', x: 460, y: 20, author: 'Gabriel (Design)', tag: 'Benchmark' },
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  // ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(8);
  const [weeklyMeetingHours, setWeeklyMeetingHours] = useState<number>(10);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Computed ROI
  const calculatedSavings = useMemo(() => {
    const hoursSavedPerWeek = teamSize * weeklyMeetingHours * 0.45;
    const hoursSavedPerMonth = Math.round(hoursSavedPerWeek * 4.3);
    const financialSavingsPerMonth = hoursSavedPerMonth * 65;
    const efficiencyGain = Math.min(360, 160 + teamSize * 15);

    return {
      hoursSavedPerMonth,
      financialSavingsPerMonth,
      efficiencyGain,
    };
  }, [teamSize, weeklyMeetingHours]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    playSound.click();
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleOpenPlanCheckout = (plan: UserPlan) => {
    playSound.click();
    if (plan === 'free') {
      handleOpenAuth('register');
      return;
    }
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleAddHeroNote = () => {
    if (!newNoteInput.trim()) return;
    playSound.pop();
    setHeroNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newNoteInput,
        color: '#EFF6FF',
        x: 40 + ((prev.length * 40) % 360),
        y: 80 + ((prev.length * 30) % 100),
        author: 'Você',
        tag: 'Ideia Nova',
      },
    ]);
    setNewNoteInput('');
  };

  const handleAuthSuccess = (_user: UserProfile) => {
    setIsAuthOpen(false);
    onEnterPlatform();
  };

  const handleCheckoutSuccess = (_plan: UserPlan) => {
    setIsCheckoutOpen(false);
    onEnterPlatform();
  };

  const faqs = [
    {
      q: 'O que diferencia o Diorfy de ferramentas tradicionais de lousa?',
      a: 'O Diorfy foi desenhado para remover qualquer fricção de trabalho visual: permite colar capturas de tela instantaneamente da área de transferência com Ctrl+V diretamente na coordenada do cursor, possui um gerador nativo de 6 estruturas de mapas mentais navegáveis via teclado (Tab e Enter), mais de 30 símbolos de engenharia de software e inteligência artificial Gemini para síntese e expansão de ideias.',
    },
    {
      q: 'Como funciona o recurso de Copiar e Colar Imagens (Ctrl+V)?',
      a: 'Basta tirar qualquer print da tela (PrintScreen, ferramenta de captura do Windows ou Cmd+Shift+4 no Mac) ou copiar uma imagem da internet e pressionar Ctrl+V diretamente no canvas. O Diorfy reconhece a imagem instantaneamente e a renderiza sem necessidade de upload em janela separada.',
    },
    {
      q: 'Quais estruturas de mapas mentais estão incluídas?',
      a: 'A plataforma oferece 6 estruturas completas: Radial 360°, Árvore Horizontal, Organograma Top-Down, Diagrama Ishikawa (Espinha de Peixe para análise de causa-raiz), Matriz SWOT e Funil de Jornada. Você ramifica nós com velocidade máxima através de atalhos de teclado.',
    },
    {
      q: 'O pagamento é processado em moeda nacional (R$)?',
      a: 'Sim. Todas as cobranças são 100% em Reais brasileiros (R$), disponíveis via PIX com liberação instantânea da conta em segundos ou Cartão de Crédito em até 12x, livres de qualquer taxa de IOF internacional ou flutuação de câmbio.',
    },
    {
      q: 'Posso convidar outros membros da equipe para editar simultaneamente?',
      a: 'Sim. Nos planos Pro e Enterprise Team, você tem colaboração em tempo real com múltiplos editores simultâneos, visualização de cursores ao vivo com fotos dos participantes, notas protegidas e links de compartilhamento com controle granular de permissões.',
    },
    {
      q: 'Como funciona a política de garantia incondicional de 7 dias?',
      a: 'Se você assinar qualquer plano pago e achar que a plataforma não atendeu suas expectativas, basta solicitar o cancelamento dentro do período de 7 dias para receber 100% do valor de volta, sem burocracia.',
    },
  ];

  return (
    <div className="h-screen w-screen bg-white text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white overflow-y-auto select-text relative">
      {/* 1. TOP BAR (Clean Professional Executive Navigation) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              playSound.click();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-xs group-hover:bg-blue-700 transition-colors">
              D
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-950">
                Diorfy
              </span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full">
                Workspace
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a
              href="#recursos"
              className="hover:text-slate-950 transition-colors py-2"
            >
              {t('nav.features')}
            </a>
            <a
              href="#solucoes"
              className="hover:text-slate-950 transition-colors py-2"
            >
              {t('nav.useCases')}
            </a>
            <a
              href="#calculadora"
              className="hover:text-slate-950 transition-colors py-2"
            >
              ROI
            </a>
            <a
              href="#planos"
              className="hover:text-slate-950 transition-colors py-2 text-blue-600 font-bold"
            >
              {t('nav.pricing')}
            </a>
            <a
              href="#faq"
              className="hover:text-slate-950 transition-colors py-2"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action CTAs & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector in Navbar */}
            <LanguageSelector variant="light" showLabel={true} />

            <button
              onClick={() => handleOpenAuth('login')}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
            >
              {t('nav.login')}
            </button>
            <button
              onClick={() => handleOpenAuth('register')}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('nav.getStartedFree')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Executive Polish with Balanced Typography) */}
      <section className="relative pt-12 pb-18 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC] to-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Subtle Pill Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200/80 px-4 py-1 rounded-full mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Workspace Visual & Gerador de Mapas Mentais com Inteligência Artificial</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 font-normal">Sem Limites de Quadros</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.14] text-balance">
            A plataforma de inteligência visual para equipes que transformam ideias em resultados
          </h1>

          {/* Value Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Estruture mapas mentais com 6 modelos consagrados, cole capturas de tela instantaneamente com <strong className="text-slate-900 font-semibold">Ctrl+V</strong>, utilize mais de 30 formas de engenharia e sintetize fluxos com IA.
          </p>

          {/* Main Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => handleOpenAuth('register')}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Começar Gratuitamente (Sem Cartão)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playSound.click();
                setIsDemoTourOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>Ver Demonstração Interativa</span>
            </button>
          </div>

          {/* Executive Trust Badges */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-950 font-extrabold text-sm tabular-nums">+180%</span>
              <span>Velocidade de Ideação</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-950 font-extrabold text-sm tabular-nums">50.000+</span>
              <span>Quadros Ativos</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-950 font-extrabold text-sm tabular-nums">0.0s</span>
              <span>Lag no Ctrl+V de Imagens</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-950 font-extrabold text-sm tabular-nums">100%</span>
              <span>Em Reais (com PIX)</span>
            </div>
          </div>

          {/* Interactive Live Canvas Simulation Card */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-300/80 shadow-xl overflow-hidden text-left relative">
            {/* Top Canvas Bar */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Quadro Colaborativo: Roadmap de Produto & Arquitetura Q4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white">
                    C
                  </div>
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white">
                    B
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white">
                    G
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">3 Editores ao vivo</span>
              </div>
            </div>

            {/* Canvas Interactive Surface */}
            <div className="p-6 bg-[#FAFAFC] relative min-h-[280px] sm:min-h-[320px] overflow-hidden">
              {/* Simulated Connectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-400 stroke-2">
                <path d="M 170 70 C 210 70, 210 80, 240 80" fill="none" strokeDasharray="4,4" />
                <path d="M 390 80 C 430 80, 430 70, 460 70" fill="none" strokeDasharray="4,4" />
              </svg>

              <div className="flex flex-wrap gap-4 relative z-10">
                {heroNotes.map((note) => (
                  <div
                    key={note.id}
                    style={{ backgroundColor: note.color }}
                    className="p-4 rounded-xl border border-slate-200/90 shadow-sm w-56 text-xs transition-transform hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 font-medium">
                      <span className="font-semibold text-slate-700">{note.tag}</span>
                      <span>{note.author}</span>
                    </div>
                    <div className="font-bold text-slate-900 leading-snug">{note.text}</div>
                  </div>
                ))}
              </div>

              {/* Input in Hero to test responsiveness */}
              <div className="mt-8 pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHeroNote()}
                  placeholder="Experimente adicionar uma nota adesiva ao vivo..."
                  className="px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-80"
                />
                <button
                  onClick={handleAddHeroNote}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Nota</span>
                </button>
              </div>

              <div className="absolute bottom-3 right-4 text-[11px] text-slate-500 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Pressione <strong>Ctrl+V</strong> para colar capturas de tela instantaneamente</span>
              </div>
            </div>
          </div>

          {/* Enterprise Logo Cloud */}
          <div className="mt-14 pt-10 border-t border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Confiado por profissionais em empresas inovadoras
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all text-sm font-extrabold text-slate-700 tracking-wider">
              <span className="text-base font-black">STRIPE</span>
              <span className="text-base font-black tracking-tight">DELOITTE</span>
              <span className="text-base font-serif font-black">SONY</span>
              <span className="text-base font-bold text-purple-700">Nubank</span>
              <span className="text-base font-bold">Salesforce</span>
              <span className="text-base font-bold tracking-tight">Spotify</span>
              <span className="text-base font-bold text-blue-700">Workday</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE FEATURE PILLARS */}
      <section id="recursos" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Capacidades da Plataforma</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Tudo o que sua equipe precisa para estruturar ideias sem atrito
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Conheça as ferramentas integradas que eliminam a dispersão entre múltiplos softwares.
            </p>

            {/* Segmented Feature Tabs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1 bg-slate-100 rounded-xl max-w-2xl mx-auto border border-slate-200">
              {[
                { id: 'mindmap', label: '🧠 Mapas Mentais (6 Estruturas)' },
                { id: 'clipboard', label: '🖼️ Copiar & Colar 2.0 (Ctrl+V)' },
                { id: 'architecture', label: '📐 30+ Formas & Engenharia' },
                { id: 'ai', label: '🤖 Copiloto de IA Gemini' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playSound.click();
                    setActiveFeatureTab(tab.id as any);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeFeatureTab === tab.id
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: MINDMAPS */}
          {activeFeatureTab === 'mindmap' && (
            <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    01. Estúdio de Mapas Mentais
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
                    Estruturação Acelerada de Pensamento com Atalhos
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Escolha entre 6 estruturas automáticas consagradas para qualquer tipo de ideação. Ramifique nós filhos com a tecla <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold text-slate-800">Tab</kbd> e nós irmãos com <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold text-slate-800">Enter</kbd>.
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-800 block">Modelos Disponíveis:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'radial', name: 'Radial 360°', desc: 'Brainstorming amplo' },
                        { id: 'tree', name: 'Árvore Horizontal', desc: 'Processos e sprints' },
                        { id: 'fishbone', name: 'Espinha Ishikawa', desc: 'Causa e efeito' },
                        { id: 'funnel', name: 'Funil de Vendas', desc: 'Jornada do usuário' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            playSound.click();
                            setSelectedMindmapType(type.id as any);
                          }}
                          className={`p-2.5 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                            selectedMindmapType === type.id
                              ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <div className="font-bold">{type.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Criar Mapa Mental Gratuito</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md relative min-h-[300px] flex items-center justify-center">
                  <img
                    src="/src/assets/images/sales_mindmap_diagram_1790519861864.jpg"
                    alt="Diagrama de Mapa Mental"
                    className="w-full h-full object-cover max-h-[360px]"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-semibold border border-white/10">
                    Estrutura: {selectedMindmapType.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLIPBOARD */}
          {activeFeatureTab === 'clipboard' && (
            <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    02. Copiar & Colar 2.0
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
                    Tire um Print e Cole Direto na Lousa com Ctrl+V
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Elimine a necessidade de salvar arquivos intermediários no disco rígido para depois fazer upload. O Diorfy recebe o print da sua área de transferência e o insere na coordenada exata do mouse.
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Posicionamento no Cursor:</strong> A imagem pousa onde você estiver apontando.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Suporte Completo:</strong> PNG, JPEG, WebP, SVG e prints diretos do sistema.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Conexão com Mapas:</strong> Conecte notas e nós de mapa diretamente na imagem.</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Testar Ctrl+V no Diorfy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Copy className="w-4 h-4 text-indigo-600" />
                        <span>Fluxo de Colagem em 3 Passos</span>
                      </div>
                      <span className="text-emerald-600 font-bold">Sem Latência</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mx-auto mb-1.5">
                          1
                        </div>
                        <span className="font-bold block text-slate-900">Tire o Print</span>
                        <span className="text-[10px] text-slate-500">PrintScreen ou Snipping</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mx-auto mb-1.5">
                          2
                        </div>
                        <span className="font-bold block text-slate-900">Pressione Ctrl+V</span>
                        <span className="text-[10px] text-slate-500">Direto na tela</span>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mx-auto mb-1.5">
                          3
                        </div>
                        <span className="font-bold block text-emerald-900">Pronto!</span>
                        <span className="text-[10px] text-emerald-700">Edite & Conecte</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARCHITECTURE */}
          {activeFeatureTab === 'architecture' && (
            <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    03. Engenharia de Sistemas
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
                    Mais de 30 Formas Técnicas e Símbolos de Nuvem
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Documente arquiteturas corporativas, bancos de dados relacionais, servidores distribuídos e diagramas BPMN com rapidez e clareza.
                  </p>

                  <div className="pt-3">
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Acessar Biblioteca Técnica</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {[
                      { name: 'Cubo 3D', icon: '🧊' },
                      { name: 'Banco Dados', icon: '💾' },
                      { name: 'Decisão', icon: '🔶' },
                      { name: 'Chaves { }', icon: '🔣' },
                      { name: 'Nuvem Cloud', icon: '☁️' },
                      { name: 'Servidor', icon: '🖥️' },
                      { name: 'Segurança', icon: '🛡️' },
                      { name: 'Engrenagem', icon: '⚙️' },
                      { name: 'Funil', icon: '🔻' },
                      { name: 'Documento', icon: '📄' },
                      { name: 'Etapa', icon: '⏩' },
                      { name: 'Categoria', icon: '🏷️' },
                    ].map((shape, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-2xl">{shape.icon}</span>
                        <span className="text-[11px] font-semibold text-slate-800">{shape.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI COPILOT */}
          {activeFeatureTab === 'ai' && (
            <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    04. Inteligência Artificial Gemini
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
                    Transforme Prompts em Árvores Estruturadas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Gere tópicos de reuniões, análises SWOT completas e sínteses visuais a partir de instruções em linguagem natural.
                  </p>

                  <div className="pt-3">
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Experimentar Copiloto de IA</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2 font-bold text-purple-300">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span>Copiloto Diorfy IA • Gemini Flash</span>
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold">● Pronto</span>
                  </div>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-3 bg-purple-950/60 border border-purple-800 rounded-lg text-purple-200 font-bold">
                      💡 Prompt: "Lançamento de Produto Digital & Tráfego"
                    </div>
                    <div className="pl-3 space-y-1.5 border-l-2 border-purple-500/40 text-slate-300">
                      <div className="p-2 bg-slate-800/80 rounded border border-slate-700">🎯 Definição de ICP & Proposta de Valor</div>
                      <div className="p-2 bg-slate-800/80 rounded border border-slate-700">📢 Estratégia de Tráfego Multicanal</div>
                      <div className="p-2 bg-slate-800/80 rounded border border-slate-700">💳 Checkout Otimizado em 1 Clique</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. INTERACTIVE ROI CALCULATOR */}
      <section id="calculadora" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculadora de Retorno sobre Investimento</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Quanto tempo e dinheiro sua equipe economiza com o Diorfy?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Ajuste as variáveis e simule o ganho de eficiência mensal na operação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-2">
                  <span>Membros na equipe / empresa:</span>
                  <span className="text-sm font-extrabold text-blue-600 tabular-nums">{teamSize} pessoas</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>1 (Individual)</span>
                  <span>25</span>
                  <span>50+ (Equipes)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-2">
                  <span>Horas semanais em reuniões & alinhamentos:</span>
                  <span className="text-sm font-extrabold text-blue-600 tabular-nums">{weeklyMeetingHours} horas / semana</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={weeklyMeetingHours}
                  onChange={(e) => setWeeklyMeetingHours(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>2h</span>
                  <span>12h</span>
                  <span>25h+</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">Metodologia de Cálculo:</span>
                <p>
                  Baseado em dados consolidados de produtividade onde lousas compartilhadas e mapas mentais reduzem retrabalho e desalinhamentos em até 45% comparado a conversas de texto dispersas.
                </p>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Impacto Mensal Estimado</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                  Retorno Imediato
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Horas Economizadas</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    {calculatedSavings.hoursSavedPerMonth} h
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">por mês em alinhamentos</div>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Economia Financeira</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                    R$ {calculatedSavings.financialSavingsPerMonth.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">em horas produtivas</div>
                </div>
              </div>

              <div className="p-3.5 bg-blue-950/40 rounded-xl border border-blue-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-blue-200">Aceleração nas entregas de sprints:</span>
                </div>
                <span className="text-sm font-bold text-blue-300 tabular-nums">
                  +{calculatedSavings.efficiencyGain}%
                </span>
              </div>

              <button
                onClick={() => handleOpenPlanCheckout('pro')}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Garantir Esse Retorno no Plano Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DETAILED COMPARISON MATRIX */}
      <section id="comparativo" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Comparativo de Mercado</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Por que Equipes de Alto Desempenho Escolhem o Diorfy?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Veja o comparativo frente a soluções tradicionais do mercado.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-800">
                    <th className="p-4 font-bold">RECURSO / CAPACIDADE</th>
                    <th className="p-4 font-bold text-blue-700 bg-blue-50/60 border-l border-r border-blue-100">
                      DIORFY WORKSPACE
                    </th>
                    <th className="p-4 font-bold text-slate-500">Miro / Whimsical</th>
                    <th className="p-4 font-bold text-slate-500">Lousas Genéricas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Preço 100% em Reais (com PIX sem IOF)</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30 border-l border-r border-blue-100">
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Em R$ com PIX Instantâneo</span>
                    </td>
                    <td className="p-4 text-slate-600">Em Dólar (USD) + IOF 4.38%</td>
                    <td className="p-4 text-slate-400">Variável</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Copiar & Colar Prints com Ctrl+V Instantâneo</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30 border-l border-r border-blue-100">
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Sem lag no cursor</span>
                    </td>
                    <td className="p-4 text-slate-600">Requer upload demorado</td>
                    <td className="p-4 text-rose-500">Incompatível</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">6 Estruturas de Mapas Mentais com Tab/Enter</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30 border-l border-r border-blue-100">
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Ishikawa, Radial, Árvore, Funil</span>
                    </td>
                    <td className="p-4 text-slate-600">Apenas 1 modelo básico</td>
                    <td className="p-4 text-rose-500">Não possui</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">30+ Símbolos de Engenharia e Cubos 3D</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30 border-l border-r border-blue-100">
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Completo e nativo</span>
                    </td>
                    <td className="p-4 text-slate-600">Plugins extras</td>
                    <td className="p-4 text-rose-500">Básico apenas</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Exportação em PNG 4K e SVG sem Marca D'água</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30 border-l border-r border-blue-100">
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Ilimitado no Pro</span>
                    </td>
                    <td className="p-4 text-slate-600">Bloqueado em planos básicos</td>
                    <td className="p-4 text-rose-500">Baixa resolução</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-900">Garantia Incondicional de 7 Dias</td>
                    <td className="p-4 text-blue-700 font-bold bg-blue-50/30 border-l border-r border-blue-100">
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> 100% Devolução</span>
                    </td>
                    <td className="p-4 text-slate-600">Suporte em inglês</td>
                    <td className="p-4 text-slate-400">Sem garantia</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING & TIERS */}
      <section id="planos" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Planos Transparentes para Qualquer Tamanho de Equipe
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Comece gratuitamente ou desbloqueie poder ilimitado para criadores e empresas.
            </p>

            {/* Monthly / Annual Switcher */}
            <div className="mt-8 inline-flex items-center gap-1.5 p-1 bg-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setBillingCycle('monthly');
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Cobrança Mensal
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setBillingCycle('annual');
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span>Cobrança Anual</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch text-left">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Gratuito / Starter</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ideal para ideação individual e experimentação inicial.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-slate-950">R$ 0</span>
                  <span className="text-xs text-slate-500 ml-1">/ para sempre</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Até 3 quadros colaborativos ativos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Copiar e colar imagens com Ctrl+V</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Mapas mentais básicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Exportação padrão PNG</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenPlanCheckout('free')}
                className="mt-8 w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-colors text-center cursor-pointer"
              >
                Começar Grátis
              </button>
            </div>

            {/* Pro Creator Plan (Highlight) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-blue-600 shadow-lg flex flex-col justify-between relative transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                ★ Mais Escolhido
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-950">Pro Creator</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Poder visual ilimitado para criadores e profissionais.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-slate-950">
                    {billingCycle === 'annual' ? 'R$ 31' : 'R$ 39'}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    {billingCycle === 'annual' ? '/ mês (faturado R$ 374/ano)' : '/ mês'}
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-950">Quadros ilimitados sem restrições</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Estúdio de Mapas Mentais Completo (6 layouts)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Copiloto de IA Gemini para Brainstorming</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>30+ Formas geométricas e símbolos de engenharia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Exportação em Alta Resolução (SVG, PDF e PNG 4K)</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenPlanCheckout('pro')}
                className="mt-8 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Assinar Plano Pro com PIX / Cartão</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Enterprise Team Plan */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Enterprise Team</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Para agências, equipes de tecnologia e empresas em escala.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-extrabold text-slate-950">
                    {billingCycle === 'annual' ? 'R$ 71' : 'R$ 89'}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    {billingCycle === 'annual' ? '/ mês (faturado R$ 854/ano)' : '/ mês'}
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Tudo incluído no plano Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Múltiplos membros de equipe com permissões</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Workspaces compartilhados para clientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Suporte prioritário via WhatsApp / E-mail</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenPlanCheckout('team')}
                className="mt-8 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors text-center cursor-pointer"
              >
                Contratar para Equipe
              </button>
            </div>
          </div>

          {/* Guarantee Seal */}
          <div className="mt-10 max-w-2xl mx-auto p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 text-xs text-emerald-950 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold block text-emerald-900">Garantia Incondicional de 7 Dias</span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Experimente o plano Pro ou Enterprise sem nenhum risco. Se por qualquer motivo não gostar, solicite o cancelamento em até 7 dias e devolvemos 100% do seu valor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXECUTIVE FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tire todas as suas dúvidas sobre a plataforma, planos e recursos.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => {
                    playSound.click();
                    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
                  }}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transform transition-transform ${
                      openFaqIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL HIGH-CONVERSION CTA */}
      <section className="py-16 md:py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pronto para transformar sua ideação em resultados práticos?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Crie sua conta em menos de 1 minuto e comece a desenhar seus mapas mentais agora mesmo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Criar Conta Gratuita e Acessar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              Já Possuo uma Conta
            </button>
          </div>
        </div>
      </section>

      {/* 9. QUIET FOOTER */}
      <footer className="py-12 bg-white text-slate-500 text-xs border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-bold text-slate-900">Diorfy Workspace</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{t('common.tagline')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <LanguageSelector variant="compact" dropDirection="up" showLabel={true} />
            <a href="#recursos" className="hover:text-slate-900 transition-colors">
              {t('nav.features')}
            </a>
            <a href="#planos" className="hover:text-slate-900 transition-colors">
              {t('nav.pricing')}
            </a>
            <button onClick={() => handleOpenAuth('login')} className="hover:text-slate-900 transition-colors cursor-pointer">
              {t('nav.login')}
            </button>
            <span className="text-slate-400">© 2026 Diorfy Technologies Inc.</span>
          </div>
        </div>
      </footer>

      {/* Interactive Video Tour Modal */}
      {isDemoTourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                <span className="font-bold text-sm">Demonstração Interativa do Diorfy Workspace</span>
              </div>
              <button
                onClick={() => setIsDemoTourOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-left">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video flex items-center justify-center">
                <img
                  src="/src/assets/images/sales_hero_canvas_1790519840611.jpg"
                  alt="Preview da Demonstração"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl mb-3 cursor-pointer">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <h4 className="text-base font-bold text-white">Tour Guiado: Canvas, Mapas & Ctrl+V</h4>
                  <p className="text-xs text-slate-300 max-w-md mt-1">
                    Veja como criar um projeto do zero, ramificar ideias em árvore e exportar em 4K.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="font-bold text-blue-400 block mb-1">1. Ramificação Rápida</span>
                  <p className="text-slate-300 text-[11px]">Use Tab para nós filhos e Enter para irmãos.</p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="font-bold text-indigo-400 block mb-1">2. Ctrl+V Instantâneo</span>
                  <p className="text-slate-300 text-[11px]">Cole prints direto da área de transferência.</p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="font-bold text-emerald-400 block mb-1">3. Exportação 4K</span>
                  <p className="text-slate-300 text-[11px]">Gere PNGs e vetores SVG em alta definição.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsDemoTourOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setIsDemoTourOpen(false);
                    handleOpenAuth('register');
                  }}
                  className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Acessar Plataforma Agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Component */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
        selectedPlan={selectedPlanForCheckout}
      />

      {/* Checkout Modal Component */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        planId={selectedPlanForCheckout}
        billingCycle={billingCycle}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../../types/auth';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { SocialProofLogos } from './SocialProofLogos';
import { PainSolutionSection } from './PainSolutionSection';
import { FlowchartSection } from './FlowchartSection';
import { FeaturesGridSection } from './FeaturesGridSection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';
import { CtaBanner } from './CtaBanner';
import { Footer } from './Footer';
import { AuthModal } from '../auth/AuthModal';
import { CheckoutModal } from '../sales/CheckoutModal';
import { playSound } from '../../utils/soundEffects';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Brain, 
  Workflow, 
  Layout, 
  MousePointer, 
  CheckCircle2, 
  Play 
} from 'lucide-react';

interface DiorfyLandingPageProps {
  onEnterPlatform: (user?: UserProfile) => void;
  onOpenBoard?: (boardId: string) => void;
}

export const DiorfyLandingPage: React.FC<DiorfyLandingPageProps> = ({
  onEnterPlatform,
}) => {
  // Modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<UserPlan>('pro');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  // Mobile sticky CTA: visible after the hero, hidden again near the footer
  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 500;
      setShowStickyCta(window.scrollY > 700 && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handlers
  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setIsAuthOpen(true);
  };

  const handleSelectPlan = (plan: UserPlan) => {
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setIsAuthOpen(false);
    onEnterPlatform(user);
  };

  const handleCheckoutSuccess = (plan: UserPlan) => {
    setIsCheckoutOpen(false);
    onEnterPlatform();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white relative">
      {/* 1. Header Navbar */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onEnterPlatform={onEnterPlatform}
      />

      {/* 2. Hero Section with Badge & Dashboard Mockup */}
      <HeroSection
        onOpenRegister={handleOpenRegister}
        onOpenDemo={() => setIsDemoModalOpen(true)}
      />

      {/* 3. Social Proof & Trust Metrics */}
      <SocialProofLogos />

      {/* 3b. Pain vs. Solution (before / after) */}
      <PainSolutionSection onOpenRegister={handleOpenRegister} />

      {/* 4. From Brainstorming to Execution (Interactive Flowchart) */}
      <FlowchartSection />

      {/* 5. Features Grid & ROI Impact Calculator */}
      <FeaturesGridSection />

      {/* 6. Transparent Pricing Cards */}
      <PricingSection
        onSelectPlan={handleSelectPlan}
        onOpenRegister={handleOpenRegister}
      />

      {/* 7. Frequently Asked Questions */}
      <FaqSection />

      {/* 8. Conversion Banner */}
      <CtaBanner
        onOpenRegister={handleOpenRegister}
        onOpenDemo={() => setIsDemoModalOpen(true)}
      />

      {/* 9. Polished Footer */}
      <Footer />

      {/* Mobile sticky CTA */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-white via-white/95 to-white/0 transition-all duration-300 ${
          showStickyCta && !isAuthOpen && !isCheckoutOpen && !isDemoModalOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => {
            playSound.pop();
            handleOpenRegister();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-base shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-transform cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Criar meu quadro grátis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        planId={selectedPlanForCheckout}
        billingCycle="annual"
      />

      {/* INTERACTIVE DEMO TOUR MODAL */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tour Interativo Diorfy</h3>
                  <p className="text-xs text-slate-500">Experimente a velocidade e elegância do workspace</p>
                </div>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Preview */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-left space-y-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900">Mapas Mentais & Canvas</h4>
                  <p className="text-[11px] text-slate-600">Desenhe ideias com atalhos e alinhamento magnético.</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-left space-y-2">
                  <Workflow className="w-6 h-6 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900">Wireframes de Funil</h4>
                  <p className="text-[11px] text-slate-600">50+ blocos pré-configurados de conversão e produto.</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-left space-y-2">
                  <Layers className="w-6 h-6 text-purple-600" />
                  <h4 className="text-xs font-bold text-slate-900">Kanban de Execução</h4>
                  <p className="text-[11px] text-slate-600">Transforme qualquer diagrama em cartões de sprint.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Acesse o Workspace Completo</p>
                    <p className="text-[11px] text-slate-400">Você pode testar todos os recursos na prática agora mesmo.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSound.pop();
                    setIsDemoModalOpen(false);
                    onEnterPlatform();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold hover:scale-105 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  Abrir Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

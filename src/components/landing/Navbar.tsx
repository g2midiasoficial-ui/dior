import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Layout,
  Workflow,
  BarChart3,
  Users
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onEnterPlatform: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenRegister,
  onEnterPlatform,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    playSound.click();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Diorfy */}
          <div 
            onClick={() => {
              playSound.click();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                Diorfy
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 -mt-1">
                Planning SaaS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Produto */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('produto')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => scrollToSection('dashboard-preview')}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Produto
              </button>
              {activeDropdown === 'produto' && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 animate-in fade-in zoom-in-95 duration-150">
                  <div 
                    onClick={() => scrollToSection('dashboard-preview')}
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Layout className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Dashboard Visual</p>
                      <p className="text-[11px] text-slate-500">Kanban, tarefas e métricas de sprint</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => scrollToSection('fluxograma')}
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Fluxos & Diagramas</p>
                      <p className="text-[11px] text-slate-500">Mapeamento infinito de ideias e funis</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Soluções */}
            <button
              onClick={() => scrollToSection('beneficios')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-colors cursor-pointer"
            >
              Soluções
            </button>

            {/* Recursos */}
            <button
              onClick={() => scrollToSection('fluxograma')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-colors cursor-pointer"
            >
              Recursos
            </button>

            {/* Preços */}
            <button
              onClick={() => scrollToSection('precos')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-colors cursor-pointer"
            >
              Preços
            </button>

            {/* FAQ */}
            <button
              onClick={() => scrollToSection('faq')}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                playSound.click();
                onOpenLogin();
              }}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              Entrar
            </button>

            <button
              onClick={() => {
                playSound.pop();
                onOpenRegister();
              }}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Comece agora</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Abrir Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => scrollToSection('dashboard-preview')}
                className="w-full px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Produto & Dashboard
              </button>
              <button
                onClick={() => scrollToSection('fluxograma')}
                className="w-full px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Do Brainstorming à Execução
              </button>
              <button
                onClick={() => scrollToSection('beneficios')}
                className="w-full px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Benefícios & Métricas
              </button>
              <button
                onClick={() => scrollToSection('precos')}
                className="w-full px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Planos & Preços
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="w-full px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Perguntas Frequentes
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm"
              >
                Comece agora
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

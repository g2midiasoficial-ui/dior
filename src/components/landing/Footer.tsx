import React from 'react';
import { DiorfyLogo } from '../brand/DiorfyLogo';
import { Sparkles, Globe, Shield, Heart, ArrowUp } from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    playSound.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-14 border-b border-slate-800/80">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <div 
              onClick={scrollToTop}
              className="flex items-center cursor-pointer select-none"
            >
              <DiorfyLogo tone="light" markClassName="h-8 w-auto" textClassName="text-2xl" />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              A plataforma moderna de planejamento visual que unifica brainstorming, diagramas de funil, mapas mentais e execução ágil em um espaço de trabalho elegante.
            </p>

            {/* System Status Pill */}
            <div className="pt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Todos os sistemas operacionais (99.98%)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Produto */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Produto</p>
            <ul className="space-y-2 text-xs">
              <li><a href="#dashboard-preview" className="hover:text-white transition-colors">Quadro Kanban</a></li>
              <li><a href="#fluxograma" className="hover:text-white transition-colors">Mapas Mentais</a></li>
              <li><a href="#fluxograma" className="hover:text-white transition-colors">Wireframes de Funil</a></li>
              <li><a href="#beneficios" className="hover:text-white transition-colors">Ctrl+V Inteligente</a></li>
              <li><a href="#beneficios" className="hover:text-white transition-colors">Modo Apresentação</a></li>
              <li><a href="#precos" className="hover:text-white transition-colors">Preços & Planos</a></li>
            </ul>
          </div>

          {/* Col 3: Soluções */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Soluções</p>
            <ul className="space-y-2 text-xs">
              <li><a href="#beneficios" className="hover:text-white transition-colors">Para Equipes de Produto</a></li>
              <li><a href="#beneficios" className="hover:text-white transition-colors">Para Growth & Marketing</a></li>
              <li><a href="#beneficios" className="hover:text-white transition-colors">Para Startups & SaaS</a></li>
              <li><a href="#beneficios" className="hover:text-white transition-colors">Para Engenharia & Tech</a></li>
              <li><a href="#precos" className="hover:text-white transition-colors">Planos Enterprise</a></li>
            </ul>
          </div>

          {/* Col 4: Empresa & Legal */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Segurança & Legal</p>
            <ul className="space-y-2 text-xs">
              <li><a href="#faq" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Privacidade & LGPD</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Criptografia AES-256</a></li>
              <li><a href="mailto:contato@diorfy.com" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Subfooter */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Diorfy Inc. Todos os direitos reservados. Feito para equipes de alta performance.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

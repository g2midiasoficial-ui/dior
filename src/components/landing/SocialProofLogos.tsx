import React from 'react';
import { ShieldCheck, Star, Zap, Users2, TrendingUp, Sparkles } from 'lucide-react';

export const SocialProofLogos: React.FC = () => {
  const companies = [
    { name: 'TechCorp Global', symbol: '◈ TECHCORP' },
    { name: 'Nubank', symbol: '⬡ NUBANK' },
    { name: 'Mercado Livre', symbol: '❖ MERCADO LIVRE' },
    { name: 'Stone Payments', symbol: '◆ STONE' },
    { name: 'QuintoAndar', symbol: '◬ QUINTOANDAR' },
    { name: 'Loft Imóveis', symbol: '■ LOFT' },
    { name: 'VTEX Commerce', symbol: '▲ VTEX' },
    { name: 'Creditas Tech', symbol: '● CREDITAS' },
  ];

  return (
    <section className="py-14 border-y border-slate-200/80 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">
            Confiado por mais de <span className="text-slate-900 font-extrabold">15.000+ equipes</span> inovadoras de tecnologia, produto e marketing
          </p>
        </div>

        {/* Company Logos Grid / Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          {companies.map((comp) => (
            <div
              key={comp.name}
              className="flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 transition-colors cursor-default group"
              title={comp.name}
            >
              <span className="text-xs sm:text-sm font-black tracking-widest font-mono whitespace-nowrap group-hover:scale-105 transition-transform">
                {comp.symbol}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Key Metric Highlights Strip */}
        <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
              <TrendingUp className="w-5 h-5 text-blue-600" /> +45%
            </p>
            <p className="text-xs font-semibold text-slate-500">Velocidade de entrega de sprints</p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" /> 4.9/5.0
            </p>
            <p className="text-xs font-semibold text-slate-500">Avaliação de satisfação em 2026</p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 text-indigo-600" /> 18h
            </p>
            <p className="text-xs font-semibold text-slate-500">Economizadas por semana por equipe</p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 99.98%
            </p>
            <p className="text-xs font-semibold text-slate-500">Disponibilidade e SLA em nuvem</p>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2, Zap } from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

interface CtaBannerProps {
  onOpenRegister: () => void;
  onOpenDemo: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  onOpenRegister,
  onOpenDemo,
}) => {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner Box with Signature Diorfy Gradient Glow */}
        <div className="relative rounded-[32px] bg-slate-950 text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
          {/* Internal Gradient Light Shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-600/30 via-indigo-600/20 to-purple-600/30 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Comece em menos de 2 minutos
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Seu próximo projeto pode começar{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                organizado de verdade.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Junte-se a mais de 15.000 equipes que já planejam, desenham funis e executam sprints com o Diorfy.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  playSound.pop();
                  onOpenRegister();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-bold text-base shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Criar meu quadro grátis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  onOpenDemo();
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-200 font-bold text-base hover:bg-slate-800 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Play className="w-4 h-4 fill-slate-300" />
                <span>Ver como funciona</span>
              </button>
            </div>

            {/* Guarantee mini badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>14 dias grátis de Pro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

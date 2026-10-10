import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

interface PainSolutionSectionProps {
  onOpenRegister: () => void;
}

const pains = [
  'Ideias no Miro, tarefas no Trello, funil no Figma e decisões perdidas no WhatsApp',
  'Reunião só para descobrir em que pé está cada coisa',
  'O plano muda e metade do time continua trabalhando na versão antiga',
  'Horas copiando conteúdo de uma ferramenta para outra',
];

const gains = [
  'Brainstorming, funis, mapas mentais e Kanban no mesmo quadro',
  'Todo mundo vê o status ao vivo, sem precisar perguntar',
  'Mudou o plano? O quadro atualiza para todos na hora',
  'Qualquer ideia vira tarefa com responsável e prazo em 1 clique',
];

export const PainSolutionSection: React.FC<PainSolutionSectionProps> = ({ onOpenRegister }) => {
  return (
    <section className="py-20 md:py-28 bg-slate-50/70 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16">
          <span className="inline-flex px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[11px] font-bold uppercase tracking-wider text-rose-700">
            Parece familiar?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            O problema não é a sua equipe.{' '}
            <span className="diorfy-gradient-text">É a bagunça de ferramentas.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Quando o planejamento está espalhado, o time gasta mais energia procurando informação do que executando.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Before */}
          <div className="rounded-3xl bg-white border border-slate-200 p-7 sm:p-9 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">Sem o Diorfy</p>
            <ul className="space-y-5">
              {pains.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-rose-500" />
                  </span>
                  <span className="text-[15px] text-slate-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="relative rounded-3xl bg-slate-950 border border-slate-800 p-7 sm:p-9 shadow-2xl shadow-blue-900/20 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-bl from-blue-600/40 via-indigo-600/25 to-purple-600/30 blur-[80px] rounded-full pointer-events-none" />
            <p className="relative text-xs font-black uppercase tracking-wider text-cyan-300 mb-6">Com o Diorfy</p>
            <ul className="relative space-y-5">
              {gains.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                  <span className="text-[15px] text-slate-200 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                playSound.pop();
                onOpenRegister();
              }}
              className="relative mt-8 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Organizar minha equipe agora</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

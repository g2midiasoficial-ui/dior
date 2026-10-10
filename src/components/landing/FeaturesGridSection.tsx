import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Brain, 
  Layers, 
  Workflow, 
  Zap, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Coins, 
  CheckCircle2, 
  Sliders, 
  Sparkle,
  Copy,
  Layout,
  Presentation,
  Check
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

export const FeaturesGridSection: React.FC = () => {
  // Interactive ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(10);
  const [weeklyMeetingHours, setWeeklyMeetingHours] = useState<number>(12);

  // Computed ROI
  const calculatedSavings = useMemo(() => {
    // Estimating 40% reduction in alignment time and meeting waste
    const hoursSavedPerWeek = teamSize * weeklyMeetingHours * 0.40;
    const hoursSavedPerMonth = Math.round(hoursSavedPerWeek * 4.3);
    const financialSavingsPerMonth = hoursSavedPerMonth * 70; // average hourly cost R$ 70/h
    return {
      hoursMonth: hoursSavedPerMonth,
      moneyMonth: financialSavingsPerMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
      productivityBoost: '+45%',
    };
  }, [teamSize, weeklyMeetingHours]);

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      tag: 'Estruturação',
      title: 'Mapas Mentais & Radiais',
      desc: 'Crie estruturas de pensamento não-lineares, árvores de decisão e diagramas espinha de peixe com 1 atalho de teclado.',
      metric: '+65% de clareza no alinhamento',
      gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      borderColor: 'group-hover:border-blue-300',
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-600" />,
      tag: 'Gestão Ágil',
      title: 'Kanban Integrado ao Fluxo',
      desc: 'Transforme ideias visuais em cartões de sprint com responsáveis, etiquetas, checklists e prazos em tempo real.',
      metric: 'Elimina 4 ferramentas paralelas',
      gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
      borderColor: 'group-hover:border-indigo-300',
    },
    {
      icon: <Workflow className="w-6 h-6 text-purple-600" />,
      tag: 'Growth & Vendas',
      title: 'Wireframes & Funis Prontos',
      desc: 'Mais de 50 blocos de wireframe de landing pages, anúncios, popups, checkouts e ações de conversão em diamante.',
      metric: '3x mais rápido que Figma ou Miro',
      gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
      borderColor: 'group-hover:border-purple-300',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      tag: 'Zero Fricção',
      title: 'Ctrl+V & Colagem Inteligente',
      desc: 'Copie capturas de tela, links, imagens e textos de qualquer lugar e cole direto no quadro sem barras ou textos indesejados.',
      metric: 'Paste instantâneo sem uploads',
      gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderColor: 'group-hover:border-amber-300',
    },
    {
      icon: <Presentation className="w-6 h-6 text-cyan-600" />,
      tag: 'Apresentação',
      title: 'Modo Slide & Motion',
      desc: 'Apresente suas estratégias como uma apresentação interativa cinematográfica sem precisar exportar para PowerPoint.',
      metric: '1-click Pitch Mode',
      gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
      borderColor: 'group-hover:border-cyan-300',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      tag: 'Corporativo',
      title: 'Segurança & Exportação',
      desc: 'Criptografia em repouso, histórico de versões, backup automático e exportação em alta resolução (JSON, PNG, PDF).',
      metric: '99.98% de disponibilidade',
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'group-hover:border-emerald-300',
    },
  ];

  return (
    <section id="beneficios" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Recursos de Alta Performance
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Tudo o que sua equipe precisa.{' '}
            <span className="diorfy-gradient-text">Nada que atrapalhe.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Menos tempo organizando ferramentas, mais tempo executando. Cada recurso existe para encurtar o caminho entre a ideia e o resultado.
          </p>
        </div>

        {/* 6 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`p-7 rounded-3xl border border-slate-200/90 bg-white hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between ${item.borderColor}`}
            >
              {/* Subtle Ambient Background Gradient on Card */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-white transition-all">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {item.metric}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Interactive ROI & Time Saved Calculator Widget */}
        <div className="relative rounded-3xl border border-blue-200/90 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/40 p-8 sm:p-12 shadow-xl shadow-blue-500/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Calculadora de Impacto & Retorno (ROI)</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Veja quanto tempo e dinheiro sua equipe economizará todo mês.
                </h3>
                <p className="text-sm text-slate-600">
                  Ajuste o tamanho do time e as horas gastas em reuniões e alinhamentos para simular o ganho de eficiência com o Diorfy.
                </p>
              </div>

              {/* Sliders */}
              <div className="space-y-5 pt-2">
                {/* Team Size Slider */}
                <div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-800 mb-2">
                    <span>Membros na equipe:</span>
                    <span className="text-base text-blue-600 font-mono bg-white px-3 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      {teamSize} pessoas
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={teamSize}
                    onChange={(e) => {
                      playSound.click();
                      setTeamSize(Number(e.target.value));
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>2 membros</span>
                    <span>50 membros</span>
                    <span>100+ membros</span>
                  </div>
                </div>

                {/* Meeting Hours Slider */}
                <div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-800 mb-2">
                    <span>Horas semanais em alinhamentos / reuniões por pessoa:</span>
                    <span className="text-base text-indigo-600 font-mono bg-white px-3 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      {weeklyMeetingHours} horas / semana
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="30"
                    value={weeklyMeetingHours}
                    onChange={(e) => {
                      playSound.click();
                      setWeeklyMeetingHours(Number(e.target.value));
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>4 horas</span>
                    <span>15 horas</span>
                    <span>30 horas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg text-center space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Economia Estimada Mensal
              </span>

              <div className="space-y-1">
                <p className="text-4xl sm:text-5xl font-black diorfy-gradient-text tracking-tight">
                  {calculatedSavings.moneyMonth}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  em custos de horas de alinhamento desperdiçadas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xl font-bold text-blue-600 font-mono">
                    {calculatedSavings.hoursMonth}h
                  </p>
                  <p className="text-[11px] text-slate-500">Horas livres / mês</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xl font-bold text-emerald-600 font-mono">
                    {calculatedSavings.productivityBoost}
                  </p>
                  <p className="text-[11px] text-slate-500">Velocidade de entrega</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 flex items-center justify-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Retorno sobre investimento imediato a partir do 1º sprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

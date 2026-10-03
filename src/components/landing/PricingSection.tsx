import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle,
  Building2,
  Users,
  Layers,
  Crown
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';
import { UserPlan } from '../../types/auth';

interface PricingSectionProps {
  onSelectPlan: (plan: UserPlan) => void;
  onOpenRegister: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  onOpenRegister,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      id: 'free' as UserPlan,
      name: 'Gratuito',
      badge: 'Para Sempre',
      badgeColor: 'bg-slate-100 text-slate-700',
      description: 'Ideal para indivíduos, estudantes e exploração inicial de planejamento.',
      monthlyPrice: 'R$ 0',
      annualPrice: 'R$ 0',
      period: 'grátis para sempre',
      popular: false,
      buttonText: 'Comece Grátis',
      buttonStyle: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200',
      features: [
        'Até 3 quadros visuais simultâneos',
        'Mapas mentais e radiais essenciais',
        'Quadro Kanban básico',
        'Colagem rápida com Ctrl+V',
        'Exportação padrão em PNG/JPEG',
        'Colaboração com até 2 membros convidados',
      ],
      notIncluded: [
        'Wireframes avançados de funil',
        'Histórico ilimitado de versões',
        'Modo Slide & Motion de Apresentação',
      ],
    },
    {
      id: 'pro' as UserPlan,
      name: 'Pro / Business',
      badge: 'Mais Popular',
      badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs',
      description: 'Para profissionais, startups e equipes em crescimento que buscam velocidade e resultados.',
      monthlyPrice: 'R$ 49',
      annualPrice: 'R$ 39',
      period: 'por usuário / mês',
      popular: true,
      buttonText: 'Testar 14 Dias Grátis',
      buttonStyle: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98]',
      features: [
        'Quadros e canvases ilimitados',
        'Colaboradores ilimitados em tempo real',
        'Biblioteca de 50+ Wireframes & Funis',
        'Ações de conversão em diamante interativo',
        'Modo Apresentação (Slides & Motion)',
        'Histórico completo e recuperação de versões',
        'Exportação em alta resolução (JSON, PNG, PDF)',
        'Suporte prioritário via chat & WhatsApp',
      ],
      notIncluded: [],
    },
    {
      id: 'enterprise' as UserPlan,
      name: 'Enterprise',
      badge: 'Corporativo',
      badgeColor: 'bg-purple-100 text-purple-700',
      description: 'Para médias e grandes empresas que exigem governança, segurança corporativa e SLA dedicado.',
      monthlyPrice: 'R$ 139',
      annualPrice: 'R$ 119',
      period: 'por usuário / mês (faturado anual)',
      popular: false,
      buttonText: 'Falar com Especialista',
      buttonStyle: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md',
      features: [
        'Tudo do plano Pro / Business',
        'Single Sign-On (SSO SAML / Okta / Google)',
        'Painel de administração e auditoria de logs',
        'Controle granular de permissões e papéis',
        'Isolamento de dados e conformidade LGPD/GDPR',
        'Gerente de sucesso (CSM) dedicado',
        'Onboarding personalizado e treinamento de time',
        'SLA de 99.99% com suporte 24/7',
      ],
      notIncluded: [],
    },
  ];

  return (
    <section id="precos" className="py-20 md:py-28 bg-slate-50/60 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Planos & Investimento
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Transparência total.{' '}
            <span className="diorfy-gradient-text">Escale sem surpresas.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Comece gratuitamente e evolua conforme sua equipe cresce. Cancele ou altere seu plano quando quiser com 1 clique.
          </p>

          {/* Billing Cycle Toggle (Monthly vs Annual with 20% discount) */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
              Mensal
            </span>

            <button
              type="button"
              onClick={() => {
                playSound.click();
                setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly');
              }}
              className="w-14 h-7 bg-slate-200 rounded-full p-1 relative transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: billingCycle === 'annual' ? '#2563eb' : '#cbd5e1' }}
            >
              <div
                className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform"
                style={{ transform: billingCycle === 'annual' ? 'translateX(28px)' : 'translateX(0px)' }}
              />
            </button>

            <span className={`text-sm font-bold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-400'}`}>
              <span>Anual</span>
              <span className="text-[11px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Economize 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {plans.map((plan) => {
            const currentPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between relative ${
                  plan.popular
                    ? 'bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/10 scale-100 lg:scale-105 z-10'
                    : 'bg-white/90 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-slate-300'
                }`}
              >
                {/* Popular Ribbon Tag */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-300" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Header of Card */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    {!plan.popular && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="pb-6 mb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        {currentPrice}
                      </span>
                      {plan.id !== 'free' && (
                        <span className="text-xs font-semibold text-slate-400">
                          /mês
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{plan.period}</p>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      O que está incluído:
                    </p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}

                    {plan.notIncluded.map((notFeat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 line-through">
                        <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[9px] font-bold">✕</span>
                        </div>
                        <span>{notFeat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Action Button */}
                <button
                  onClick={() => {
                    playSound.pop();
                    if (plan.id === 'free') {
                      onOpenRegister();
                    } else {
                      onSelectPlan(plan.id);
                    }
                  }}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 group ${plan.buttonStyle}`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Enterprise Security & Guarantee footnote */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garantia incondicional de 14 dias ou seu dinheiro de volta</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Migração assistida e suporte de importação</span>
          </div>
        </div>
      </div>
    </section>
  );
};

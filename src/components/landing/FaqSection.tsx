import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'O que torna o Diorfy diferente de ferramentas como Miro ou Trello?',
      a: 'O Diorfy foi desenhado exclusivamente para equipes de alta performance que precisam conectar brainstorming, funis de conversão, mapas mentais e execução ágil (Kanban) em uma única tela. Você não precisa alternar entre 4 ferramentas: tudo o que você esboça se transforma em tarefas e processos com 1 clique, sem a lentidão ou sobrecarga visual de plataformas legadas.',
    },
    {
      q: 'Posso convidar membros da minha equipe gratuitamente?',
      a: 'Sim! No plano Gratuito você pode convidar até 2 membros para colaborar com você. Nos planos Pro e Enterprise, a colaboração em tempo real é ilimitada, com cursores ao vivo, comentários contextuais e permissões granulares de edição ou visualização.',
    },
    {
      q: 'Como funciona o teste gratuito de 14 dias do plano Pro?',
      a: 'Você tem acesso total e irrestrito a todas as funcionalidades do plano Pro por 14 dias, incluindo os mais de 50 wireframes de funil, ações de conversão em diamante, histórico completo de versões e apresentações no Modo Slide. Não há cobrança surpresa e você pode cancelar a qualquer momento.',
    },
    {
      q: 'É possível exportar meus quadros em alta resolução?',
      a: 'Sim. O Diorfy permite exportar seus quadros, mapas mentais e funis em formatos de alta resolução como PNG transparente, PDF vetorial e também em arquivo JSON aberto da Diorfy para backup ou compartilhamento offline.',
    },
    {
      q: 'Meus dados, estratégias e diagramas estão seguros na nuvem?',
      a: 'Absolutamente. Utilizamos criptografia de nível militar AES-256 em repouso e TLS 1.3 em trânsito, com servidores redundantes de alta disponibilidade (99.98% SLA). Seus quadros são privados e pertencem exclusivamente à sua organização, em total conformidade com a LGPD e GDPR.',
    },
    {
      q: 'Preciso cadastrar cartão de crédito para criar minha conta?',
      a: 'Não! Você pode criar sua conta gratuita imediatamente usando seu e-mail ou login social do Google em menos de 30 segundos, sem necessidade de informar cartão de crédito.',
    },
  ];

  const handleToggle = (index: number) => {
    playSound.click();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Tire Suas Dúvidas
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Perguntas <span className="diorfy-gradient-text">Frequentes</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Tudo o que você precisa saber sobre a plataforma, planos, colaboração e segurança.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-50/80 border-blue-300 ring-2 ring-blue-500/10 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-blue-50 border-blue-200 text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Card Footer */}
        <div className="mt-12 text-center p-6 bg-slate-50 border border-slate-200/80 rounded-2xl max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Ainda tem dúvidas específicas?</p>
              <p className="text-[11px] text-slate-500">Nosso time de produto responde em poucos minutos.</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound.click();
              window.open('mailto:contato@diorfy.com', '_blank');
            }}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          >
            Falar com Suporte
          </button>
        </div>
      </div>
    </section>
  );
};

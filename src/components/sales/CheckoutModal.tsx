import React, { useState } from 'react';
import {
  X,
  Check,
  CreditCard,
  QrCode,
  FileText,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserPlan } from '../../types/auth';
import { updateUserPlan, getCurrentUser } from '../../utils/auth';
import { playSound } from '../../utils/soundEffects';
import { LanguageSelector } from '../common/LanguageSelector';
import { useTranslation } from '../../i18n/I18nContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: UserPlan) => void;
  planId: UserPlan;
  billingCycle: 'monthly' | 'annual';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  planId,
  billingCycle,
}) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [buyerName, setBuyerName] = useState('G2 Mídias');
  const [buyerEmail, setBuyerEmail] = useState('g2midiasoficial@gmail.com');
  const [buyerCpf, setBuyerCpf] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  if (!isOpen) return null;

  const planName = planId === 'team' ? 'Plano Enterprise Team' : 'Plano Pro Creator';
  const price =
    planId === 'team'
      ? billingCycle === 'annual'
        ? 'R$ 854,00 / ano'
        : 'R$ 89,00 / mês'
      : billingCycle === 'annual'
      ? 'R$ 374,00 / ano'
      : 'R$ 39,00 / mês';

  const mockPixKey = '00020126580014br.gov.bcb.pix0136diorfy-workspace-pix-access-key5204000053039865802BR5915DIORFY WORKSPACE6009SAO PAULO62070503***6304ABCD';

  const handleCopyPix = () => {
    playSound.pop();
    navigator.clipboard.writeText(mockPixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleCompletePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    playSound.click();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      updateUserPlan(planId, billingCycle);
      playSound.pop();

      try {
        confetti({
          particleCount: 110,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#3B82F6', '#10B981', '#0F172A'],
        });
      } catch (e) {}

      onSuccess(planId);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
              D
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950 leading-tight">
                {t('checkout.title')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('checkout.guaranteeDays')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector variant="compact" showLabel={false} />
            <button
              onClick={() => {
                playSound.click();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Box */}
          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  {planName}
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {billingCycle === 'annual' ? 'Anual (20% OFF)' : 'Mensal'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Lousas infinitas, IA integrada e mapas mentais completos.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-slate-950 block">{price}</span>
              <span className="text-[10px] text-slate-500">Sem taxa de adesão</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2.5">
              FORMA DE PAGAMENTO:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setPaymentMethod('pix');
                }}
                className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>PIX Instantâneo</span>
                <span className="text-[9px] text-emerald-600 font-semibold">Liberação imediata</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setPaymentMethod('credit_card');
                }}
                className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Cartão de Crédito</span>
                <span className="text-[9px] text-slate-500">Até 12x</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setPaymentMethod('boleto');
                }}
                className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'boleto'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <FileText className="w-5 h-5 text-amber-600" />
                <span>Boleto Bancário</span>
                <span className="text-[9px] text-slate-500">1 a 2 dias</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCompletePurchase} className="space-y-4">
            {paymentMethod === 'pix' && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl border border-slate-300 shadow-2xs flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 p-1 flex items-center justify-center rounded-xl">
                    <QrCode className="w-28 h-28 text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  Escaneie o QR Code no seu aplicativo do banco ou copie a chave Pix:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mockPixKey}
                    className="w-full text-[11px] bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-500 truncate focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    {pixCopied ? '✓ Copiado!' : 'Copiar Pix'}
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Impresso no Cartão
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="NOME COMPLETO"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Validade
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      required
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      required
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <p className="font-bold">INFORMAÇÃO SOBRE O BOLETO:</p>
                <p className="text-slate-700">
                  O boleto será gerado no seu e-mail ({buyerEmail}) com vencimento para 3 dias úteis.
                </p>
              </div>
            )}

            {/* Buyer Info */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NOME DO TITULAR
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-MAIL PARA ACESSO
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Trust & Guarantee */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SSL 256-Bit Criptografado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Garantia 7 Dias</span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {paymentMethod === 'pix'
                      ? 'Confirmar Pagamento PIX e Acessar'
                      : 'Confirmar Assinatura Agora'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CanvasElement } from '../../types/miro';
import { renderTrafficIcon } from './FunnelIcons';
import {
  Download,
  CheckCircle2,
  Calendar,
  Play,
  CreditCard,
  User,
  Users,
  Eye,
  TrendingUp,
  Mail,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
  Zap,
  FileText,
  UserCheck,
  RefreshCw,
  RotateCcw,
  Tag,
  MousePointerClick,
  FileCheck,
  PhoneCall,
  Flame,
  Send,
  Sparkles,
  Link as LinkIcon,
  Edit2,
  Check,
  ArrowRight,
  Plus,
  DollarSign,
  SlidersHorizontal,
  X,
} from 'lucide-react';

interface FunnelWireframeElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent: (id: string, newContent: string) => void;
  onUpdateStyle?: (id: string, styleUpdates: Partial<CanvasElement['style']>) => void;
  onStartConnect?: (elementId: string, anchor: 'top' | 'right' | 'bottom' | 'left') => void;
}

export interface FunnelActionOption {
  id: string;
  label: string;
  iconName: string;
  bgGradient: string;
  badgeBg: string;
  textColor: string;
  defaultMetric: string;
  description: string;
}

export const FUNNEL_ACTION_OPTIONS: FunnelActionOption[] = [
  {
    id: 'purchase-approved',
    label: 'Compra Aprovada',
    iconName: 'cart',
    bgGradient: 'from-emerald-500 to-green-600',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    textColor: 'text-emerald-500',
    defaultMetric: 'R$ 197,00',
    description: 'Venda finalizada e pagamento aprovado',
  },
  {
    id: 'pix-approved',
    label: 'PIX Aprovado / Gerado',
    iconName: 'zap',
    bgGradient: 'from-teal-500 to-emerald-600',
    badgeBg: 'bg-teal-50 border-teal-200 text-teal-700',
    textColor: 'text-teal-500',
    defaultMetric: 'R$ 197,00',
    description: 'Pagamento instantâneo via chave PIX',
  },
  {
    id: 'boleto-generated',
    label: 'Boleto Bancário',
    iconName: 'file-text',
    bgGradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    textColor: 'text-amber-500',
    defaultMetric: 'R$ 197,00',
    description: 'Boleto impresso ou código de barras copiado',
  },
  {
    id: 'credit-card',
    label: 'Cartão de Crédito',
    iconName: 'credit-card',
    bgGradient: 'from-indigo-500 to-blue-600',
    badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    textColor: 'text-indigo-500',
    defaultMetric: 'R$ 297,00',
    description: 'Transação processada no cartão à vista ou parcelada',
  },
  {
    id: 'upsell-orderbump',
    label: 'Upsell / Order Bump',
    iconName: 'trending-up',
    bgGradient: 'from-violet-500 to-purple-600',
    badgeBg: 'bg-violet-50 border-violet-200 text-violet-700',
    textColor: 'text-violet-500',
    defaultMetric: '+ R$ 47,00',
    description: 'Oferta complementar adicionada no checkout',
  },
  {
    id: 'initiate-checkout',
    label: 'Checkout Iniciado',
    iconName: 'bag',
    bgGradient: 'from-blue-500 to-sky-600',
    badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
    textColor: 'text-blue-500',
    defaultMetric: '120 visitas',
    description: 'Lead clicou para ir à tela de pagamento',
  },
  {
    id: 'abandoned-cart',
    label: 'Carrinho Abandonado',
    iconName: 'cart-abandon',
    bgGradient: 'from-rose-500 to-pink-600',
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
    textColor: 'text-rose-500',
    defaultMetric: 'Recuperar',
    description: 'Não concluiu compra, disparar régua de recuperação',
  },
  {
    id: 'lead-optin',
    label: 'Lead Capturado',
    iconName: 'user-check',
    bgGradient: 'from-sky-500 to-cyan-600',
    badgeBg: 'bg-sky-50 border-sky-200 text-sky-700',
    textColor: 'text-sky-500',
    defaultMetric: '48% taxa',
    description: 'Novo contato registrado no formulário',
  },
  {
    id: 'meeting-scheduled',
    label: 'Reunião Agendada',
    iconName: 'calendar',
    bgGradient: 'from-amber-600 to-yellow-600',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    textColor: 'text-amber-600',
    defaultMetric: '18 agendados',
    description: 'Call de fechamento ou demonstração marcada',
  },
  {
    id: 'subscription',
    label: 'Assinatura Recorrente',
    iconName: 'refresh',
    bgGradient: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    textColor: 'text-emerald-600',
    defaultMetric: 'R$ 97/mês',
    description: 'Plano mensal/anual com renovação automática',
  },
  {
    id: 'refund-requested',
    label: 'Reembolso Solicitado',
    iconName: 'refund',
    bgGradient: 'from-slate-600 to-slate-700',
    badgeBg: 'bg-slate-100 border-slate-300 text-slate-700',
    textColor: 'text-slate-600',
    defaultMetric: '1.2%',
    description: 'Cancelamento ou estorno no gateway',
  },
  {
    id: 'tag-crm',
    label: 'Tag no CRM',
    iconName: 'tag',
    bgGradient: 'from-teal-600 to-cyan-700',
    badgeBg: 'bg-teal-50 border-teal-200 text-teal-700',
    textColor: 'text-teal-600',
    defaultMetric: 'Tag: Quente',
    description: 'Etiqueta de segmentação atribuída ao lead',
  },
  {
    id: 'webhook-fired',
    label: 'Webhook / API',
    iconName: 'sparkles',
    bgGradient: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    textColor: 'text-cyan-600',
    defaultMetric: 'Status: 200',
    description: 'Disparo de evento para ferramentas externas',
  },
];

export const FunnelWireframeElement: React.FC<FunnelWireframeElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdateContent,
  onUpdateStyle,
  onStartConnect,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(element.content || 'Página');
  const [isHovered, setIsHovered] = useState(false);
  const [isActionPickerOpen, setIsActionPickerOpen] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [valueText, setValueText] = useState(element.style.metricValue || 'R$ 197,00');

  const funnelType = element.style.funnelPageType || 'generic-page';
  const currentActionType = element.style.actionType || 'purchase-approved';

  const actionConfig =
    FUNNEL_ACTION_OPTIONS.find((opt) => opt.id === currentActionType) || FUNNEL_ACTION_OPTIONS[0];

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onUpdateContent(element.id, titleText.trim());
    }
    setIsEditingTitle(false);
  };

  const handleSaveValue = () => {
    if (onUpdateStyle) {
      onUpdateStyle(element.id, { metricValue: valueText.trim() });
    }
    setIsEditingValue(false);
  };

  const handleSelectAction = (action: FunnelActionOption) => {
    onUpdateContent(element.id, action.label);
    setTitleText(action.label);
    if (onUpdateStyle) {
      onUpdateStyle(element.id, {
        actionType: action.id,
        metricValue: valueText || action.defaultMetric,
      });
    }
    setIsActionPickerOpen(false);
  };

  // Render Action Icon according to name
  const renderActionIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'cart':
        return <ShoppingCart className={className} />;
      case 'zap':
        return <Zap className={className} />;
      case 'file-text':
        return <FileText className={className} />;
      case 'credit-card':
        return <CreditCard className={className} />;
      case 'bag':
        return <ShoppingBag className={className} />;
      case 'cart-abandon':
        return <ShoppingCart className={className} />;
      case 'user-check':
        return <UserCheck className={className} />;
      case 'trending-up':
        return <TrendingUp className={className} />;
      case 'calendar':
        return <Calendar className={className} />;
      case 'refresh':
        return <RefreshCw className={className} />;
      case 'refund':
        return <RotateCcw className={className} />;
      case 'tag':
        return <Tag className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Connection Anchors component rendered on all funnel items
  const renderConnectionAnchors = () => {
    if (!onStartConnect) return null;
    const showAnchors = isSelected || isHovered;

    return (
      <div
        className={`transition-opacity duration-150 ${
          showAnchors ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Anchor */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnect(element.id, 'top');
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStartConnect(element.id, 'top');
          }}
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 hover:bg-blue-500 border-2 border-white shadow-md flex items-center justify-center text-white transition-transform hover:scale-130 z-30 cursor-crosshair group/anchor"
          title="Conectar seta pelo topo"
        >
          <div className="w-2 h-2 rounded-full bg-white group-hover/anchor:scale-125" />
        </button>

        {/* Right Anchor with Arrow Indicator */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnect(element.id, 'right');
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStartConnect(element.id, 'right');
          }}
          className="absolute top-1/2 -right-3 -translate-y-1/2 w-5.5 h-5.5 rounded-full bg-blue-600 hover:bg-blue-500 border-2 border-white shadow-md flex items-center justify-center text-white transition-transform hover:scale-130 z-30 cursor-crosshair group/anchor"
          title="Puxar seta de conexão (Direita)"
        >
          <ArrowRight className="w-3.5 h-3.5 group-hover/anchor:translate-x-0.5 transition-transform" />
        </button>

        {/* Bottom Anchor */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnect(element.id, 'bottom');
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStartConnect(element.id, 'bottom');
          }}
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 hover:bg-blue-500 border-2 border-white shadow-md flex items-center justify-center text-white transition-transform hover:scale-130 z-30 cursor-crosshair group/anchor"
          title="Conectar seta pela base"
        >
          <div className="w-2 h-2 rounded-full bg-white group-hover/anchor:scale-125" />
        </button>

        {/* Left Anchor */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnect(element.id, 'left');
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStartConnect(element.id, 'left');
          }}
          className="absolute top-1/2 -left-3 -translate-y-1/2 w-5.5 h-5.5 rounded-full bg-blue-600 hover:bg-blue-500 border-2 border-white shadow-md flex items-center justify-center text-white transition-transform hover:scale-130 z-30 cursor-crosshair group/anchor"
          title="Conectar seta pela esquerda"
        >
          <div className="w-2 h-2 rounded-full bg-white group-hover/anchor:scale-125" />
        </button>
      </div>
    );
  };

  // Render SVG Wireframe Artwork based on page type
  const renderWireframeArt = () => {
    switch (funnelType) {
      case 'download-page':
        return (
          <div className="w-full h-full flex flex-col items-center justify-between p-2">
            <div className="w-12 h-12 rounded-full border-2 border-sky-400 bg-sky-50 flex items-center justify-center text-sky-500 mt-1">
              <Download className="w-6 h-6 animate-bounce" />
            </div>
            <div className="w-full space-y-1 my-auto px-2">
              <div className="h-2 bg-slate-300 rounded w-4/5 mx-auto" />
              <div className="h-1.5 bg-slate-200 rounded w-full" />
              <div className="h-1.5 bg-slate-200 rounded w-3/4 mx-auto" />
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'DOWNLOAD'}
            </div>
          </div>
        );

      case 'optin-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="space-y-1">
              <div className="h-2.5 bg-slate-400 rounded w-5/6" />
              <div className="h-1.5 bg-slate-200 rounded w-2/3" />
            </div>
            <div className="space-y-1.5 my-auto">
              <div className="h-5 border border-slate-300 rounded bg-white px-2 flex items-center">
                <div className="h-1 bg-slate-200 rounded w-1/3" />
              </div>
              <div className="h-5 border border-slate-300 rounded bg-white px-2 flex items-center">
                <div className="h-1 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'OPT IN'}
            </div>
          </div>
        );

      case 'sales-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-14 border border-sky-300 bg-sky-50 rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-sky-600" />
              </div>
              <div className="space-y-1 py-1">
                <div className="h-2 bg-slate-400 rounded w-full" />
                <div className="h-1.5 bg-slate-200 rounded w-4/5" />
                <div className="h-1.5 bg-slate-200 rounded w-3/5" />
              </div>
            </div>
            <div className="h-8 border border-dashed border-slate-200 rounded bg-slate-50 my-1" />
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'BUY NOW'}
            </div>
          </div>
        );

      case 'squeeze-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-12 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="space-y-1 my-1">
              <div className="h-2 bg-slate-400 rounded w-4/5" />
              <div className="h-1.5 bg-slate-200 rounded w-full" />
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'CALL TO ACTION'}
            </div>
          </div>
        );

      case 'vsl-video-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-20 border border-sky-400 bg-sky-50/50 rounded flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
              </div>
            </div>
            <div className="space-y-1 my-1">
              <div className="h-2 bg-slate-400 rounded w-3/4 mx-auto" />
              <div className="h-1.5 bg-slate-200 rounded w-1/2 mx-auto" />
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'CALL TO ACTION'}
            </div>
          </div>
        );

      case 'webinar-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-12 border border-sky-400 bg-sky-50 rounded flex items-center justify-center gap-1">
              <Calendar className="w-5 h-5 text-sky-500" />
              <span className="text-[9px] font-bold text-sky-600">LIVE</span>
            </div>
            <div className="space-y-1 my-1">
              <div className="h-2 bg-slate-400 rounded w-4/5" />
              <div className="h-1.5 bg-slate-200 rounded w-2/3" />
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'REGISTER'}
            </div>
          </div>
        );

      case 'upsell-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-14 border-2 border-emerald-400 bg-emerald-50 rounded flex flex-col items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <span className="text-[8px] font-bold text-emerald-700 mt-0.5">SPECIAL UPGRADE</span>
            </div>
            <div className="space-y-1 my-1">
              <div className="h-2 bg-slate-400 rounded w-full" />
              <div className="h-1.5 bg-slate-200 rounded w-4/5" />
            </div>
            <div className="w-full bg-emerald-600 text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'YES! UPGRADE'}
            </div>
          </div>
        );

      case 'thankyou-page':
        return (
          <div className="w-full h-full flex flex-col items-center justify-between p-2">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center text-emerald-500 mt-1">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div className="w-full space-y-1 my-auto px-2">
              <div className="h-2.5 bg-emerald-600/80 rounded w-3/4 mx-auto" />
              <div className="h-1.5 bg-slate-200 rounded w-full" />
              <div className="h-1.5 bg-slate-200 rounded w-2/3 mx-auto" />
            </div>
            <div className="w-full bg-emerald-600 text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'ACESSAR AGORA'}
            </div>
          </div>
        );

      case 'custom-page':
        return (
          <div className="w-full h-full flex flex-col items-center justify-between p-2">
            {element.style.customSvgIcon ? (
              <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden my-auto">
                <img
                  src={element.style.customSvgIcon}
                  alt="custom"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-500 my-auto">
                <Sparkles className="w-6 h-6" />
              </div>
            )}
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'ACESSAR'}
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-12 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="space-y-1 my-1">
              <div className="h-2 bg-slate-400 rounded w-full" />
              <div className="h-1.5 bg-slate-200 rounded w-4/5" />
              <div className="h-1.5 bg-slate-200 rounded w-3/4" />
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'CALL TO ACTION'}
            </div>
          </div>
        );
    }
  };

  // If this element is a Traffic Source
  if (element.type === 'traffic-source') {
    const isPaid = (element.style.trafficSourceType || '').startsWith('ad-');
    return (
      <div
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          zIndex: element.zIndex,
        }}
        className={`group select-none cursor-move flex flex-col items-center justify-center p-2 rounded-2xl bg-white border-2 shadow-md transition-all ${
          isSelected
            ? 'border-blue-600 ring-4 ring-blue-500/20 shadow-xl'
            : 'border-slate-200 hover:border-blue-400'
        }`}
      >
        <div className="mb-1.5 transition-transform group-hover:scale-105 pointer-events-none">
          {renderTrafficIcon(element.style.trafficSourceType || 'ad-facebook', 48, isPaid)}
        </div>

        {isEditingTitle ? (
          <div className="w-full flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              className="w-full text-xs font-bold text-slate-800 bg-white border border-blue-500 rounded px-1 py-0.5 outline-none text-center"
            />
          </div>
        ) : (
          <span
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
            onClick={(e) => {
              if (isSelected) {
                e.stopPropagation();
                setIsEditingTitle(true);
              }
            }}
            className="text-xs font-bold text-slate-800 text-center truncate max-w-full hover:text-blue-600 cursor-pointer"
            title="Clique para renomear"
          >
            {element.content}
          </span>
        )}

        {/* Connection Anchors */}
        {renderConnectionAnchors()}
      </div>
    );
  }

  // If this element is a Funnel Action (Compra Aprovada, PIX, Boleto, etc.)
  if (element.type === 'funnel-action') {
    return (
      <div
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          zIndex: element.zIndex,
        }}
        className={`group select-none cursor-move flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-2xl bg-white border-2 shadow-md transition-all ${
          isSelected
            ? 'border-blue-600 ring-4 ring-blue-500/20 shadow-xl'
            : 'border-slate-200 hover:border-emerald-400 hover:shadow-lg'
        }`}
      >
        {/* Left Clickable Action Icon Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsActionPickerOpen((prev) => !prev);
          }}
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${actionConfig.bgGradient} text-white flex items-center justify-center shrink-0 shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer relative group/icon`}
          title="Clique para escolher ação e trocar ícone"
        >
          {renderActionIcon(actionConfig.iconName, 'w-4.5 h-4.5')}
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover/icon:opacity-100 transition-opacity">
            <SlidersHorizontal className="w-2 h-2" />
          </span>
        </button>

        {/* Middle Title Area */}
        <div className="min-w-0 flex-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
                placeholder="Nome da ação..."
                className="w-full text-xs font-bold text-slate-900 bg-white border border-blue-500 rounded px-1.5 py-0.5 outline-none"
              />
            </div>
          ) : (
            <p
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              onClick={(e) => {
                if (isSelected) {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }
              }}
              className="text-xs font-bold text-slate-800 truncate hover:text-blue-600 cursor-pointer"
              title="Clique para renomear"
            >
              {element.content}
            </p>
          )}
        </div>

        {/* Right Metric / Monetary Value Badge (Clickable to Edit) */}
        <div className="shrink-0">
          {isEditingValue ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={valueText}
                onChange={(e) => setValueText(e.target.value)}
                onBlur={handleSaveValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveValue();
                  if (e.key === 'Escape') setIsEditingValue(false);
                }}
                autoFocus
                placeholder="R$ 197,00"
                className="w-20 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-400 rounded px-1.5 py-0.5 outline-none text-center"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingValue(true);
              }}
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer ${actionConfig.badgeBg}`}
              title="Clique para alterar valor"
            >
              {element.style.metricValue || valueText || 'R$ 197,00'}
            </button>
          )}
        </div>

        {/* Interactive Action & Value Picker Popover */}
        {isActionPickerOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95 select-none"
          >
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900">Configurar Ação do Funil</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsActionPickerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value Editor Input in Popover */}
            <div className="mb-3 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Valor / Métrica da Ação:</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={valueText}
                  onChange={(e) => setValueText(e.target.value)}
                  placeholder="Ex: R$ 197,00"
                  className="flex-1 text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-lg px-2.5 py-1.5 outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateStyle) {
                      onUpdateStyle(element.id, { metricValue: valueText });
                    }
                  }}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Salvar
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1 pt-1">
                {['R$ 47,00', 'R$ 97,00', 'R$ 197,00', 'R$ 497,00', 'R$ 997,00'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setValueText(preset);
                      if (onUpdateStyle) {
                        onUpdateStyle(element.id, { metricValue: preset });
                      }
                    }}
                    className="text-[9px] font-mono font-bold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Types Grid */}
            <div>
              <p className="text-[11px] font-bold text-slate-700 mb-1.5">Escolha o Tipo de Ação:</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {FUNNEL_ACTION_OPTIONS.map((opt) => {
                  const isCurrent = opt.id === currentActionType;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectAction(opt)}
                      className={`p-2 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${opt.bgGradient} text-white flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {renderActionIcon(opt.iconName, 'w-3.5 h-3.5')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                          {opt.label}
                        </p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5 truncate">
                          {opt.defaultMetric}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Connection Anchors */}
        {renderConnectionAnchors()}
      </div>
    );
  }

  // Main Funnel Page Wireframe Card
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
      }}
      className={`group select-none cursor-move flex flex-col bg-white rounded-xl border-2 shadow-lg transition-all ${
        isSelected
          ? 'border-blue-600 ring-4 ring-blue-500/20 shadow-2xl'
          : 'border-slate-300 hover:border-blue-400'
      }`}
    >
      {/* Browser Mockup Top Bar with Traffic Dots */}
      <div className="h-6 bg-slate-100 border-b border-slate-200 px-2 flex items-center justify-between rounded-t-[10px] shrink-0">
        <div className="flex items-center gap-1 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="h-2.5 w-16 bg-white border border-slate-200 rounded-sm pointer-events-none" />
        <div className="w-2" />
      </div>

      {/* Wireframe Canvas Body */}
      <div className="flex-1 bg-white overflow-hidden relative pointer-events-none">
        {renderWireframeArt()}
      </div>

      {/* Bottom Title Bar (Click or Double-Click to Rename) */}
      <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-[10px]">
        {isEditingTitle ? (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              placeholder="Nome da página..."
              className="w-full text-xs font-bold text-slate-800 bg-white border border-blue-500 rounded px-1.5 py-0.5 outline-none cursor-text shadow-xs"
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
              title="Salvar nome"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={(e) => {
              if (isSelected) {
                e.stopPropagation();
                setIsEditingTitle(true);
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
            className="flex items-center justify-between group/title cursor-pointer py-0.5"
          >
            <span
              className="text-xs font-bold text-slate-800 truncate select-none hover:text-blue-600 transition-colors"
              title="Clique para renomear"
            >
              {element.content}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="p-0.5 text-slate-400 hover:text-blue-600 opacity-70 group-hover/title:opacity-100 transition-opacity cursor-pointer"
              title="Renomear página"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Connection Anchors on all 4 sides with Arrow Buttons */}
      {renderConnectionAnchors()}
    </div>
  );
};

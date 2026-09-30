import React, { useState } from 'react';
import {
  Megaphone,
  Layout,
  Target,
  Plus,
  Image as ImageIcon,
  Download,
  Calendar,
  Play,
  CreditCard,
  User,
  TrendingUp,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';
import {
  renderTrafficIcon,
  TrafficIconData,
  renderActionDiamondIcon,
  ACTIONS_CATEGORIES,
} from './FunnelIcons';

interface FunnelWireframesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertFunnelPage: (
    funnelPageType: string,
    title: string,
    ctaText?: string,
    customSvg?: string
  ) => void;
  onInsertTrafficSource: (
    trafficType: string,
    title: string,
    badge: string,
    color: string
  ) => void;
  onInsertAction: (actionType: string, title: string, metric?: string) => void;
}

export const FunnelWireframesDrawer: React.FC<FunnelWireframesDrawerProps> = ({
  isOpen,
  onClose,
  onInsertFunnelPage,
  onInsertTrafficSource,
  onInsertAction,
}) => {
  const [activeTab, setActiveTab] = useState<'fontes' | 'paginas' | 'acoes'>('fontes');
  const [customIcons, setCustomIcons] = useState<{ id: string; name: string; url: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const newIcon = {
            id: `custom-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: reader.result as string,
          };
          setCustomIcons((prev) => [...prev, newIcon]);
          playSound.pop();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Wireframe Pages List
  const pagesList: {
    id: string;
    label: string;
    shortLabel: string;
    ctaText: string;
    renderPreview: () => React.ReactNode;
  }[] = [
    {
      id: 'generic-page',
      label: 'Página Genérica',
      shortLabel: 'Página Gen...',
      ctaText: 'CALL TO ACTION',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="w-full h-8 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="space-y-0.5 my-1">
            <div className="h-1.5 bg-slate-400 rounded w-full" />
            <div className="h-1 bg-slate-200 rounded w-4/5" />
            <div className="h-1 bg-slate-200 rounded w-3/4" />
          </div>
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            CALL TO ACTION
          </div>
        </div>
      ),
    },
    {
      id: 'download-page',
      label: 'Download',
      shortLabel: 'Download',
      ctaText: 'DOWNLOAD',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col items-center justify-between p-1.5 bg-white">
          <div className="w-8 h-8 rounded-full border border-sky-400 bg-sky-50 flex items-center justify-center text-sky-500 mt-0.5">
            <Download className="w-4 h-4" />
          </div>
          <div className="w-full space-y-0.5 my-1 px-1">
            <div className="h-1 bg-slate-300 rounded w-4/5 mx-auto" />
            <div className="h-0.5 bg-slate-200 rounded w-full" />
          </div>
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            DOWNLOAD
          </div>
        </div>
      ),
    },
    {
      id: 'optin-page',
      label: 'Aceitar',
      shortLabel: 'Aceitar',
      ctaText: 'OPT IN',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="space-y-0.5">
            <div className="h-1.5 bg-slate-400 rounded w-5/6" />
            <div className="h-1 bg-slate-200 rounded w-2/3" />
          </div>
          <div className="space-y-1 my-1">
            <div className="h-3 border border-slate-300 rounded bg-white px-1 flex items-center" />
            <div className="h-3 border border-slate-300 rounded bg-white px-1 flex items-center" />
          </div>
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            OPT IN
          </div>
        </div>
      ),
    },
    {
      id: 'sales-page',
      label: 'Página de Vendas',
      shortLabel: 'Página de ...',
      ctaText: 'BUY NOW',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="grid grid-cols-2 gap-1">
            <div className="h-7 border border-sky-300 bg-sky-50 rounded flex items-center justify-center">
              <CreditCard className="w-3 h-3 text-sky-600" />
            </div>
            <div className="space-y-0.5 py-0.5">
              <div className="h-1 bg-slate-400 rounded w-full" />
              <div className="h-1 bg-slate-200 rounded w-4/5" />
            </div>
          </div>
          <div className="h-4 border border-dashed border-slate-200 rounded bg-slate-50 my-1" />
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            BUY NOW
          </div>
        </div>
      ),
    },
    {
      id: 'squeeze-page',
      label: 'Página de Captura',
      shortLabel: 'Página de ...',
      ctaText: 'CALL TO ACTION',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="w-full h-7 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="space-y-0.5 my-1">
            <div className="h-1 bg-slate-400 rounded w-4/5" />
            <div className="h-1 bg-slate-200 rounded w-full" />
          </div>
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            CALL TO ACTION
          </div>
        </div>
      ),
    },
    {
      id: 'vsl-video-page',
      label: 'Vídeo da Página',
      shortLabel: 'Vídeo da p...',
      ctaText: 'CALL TO ACTION',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="w-full h-11 border border-sky-400 bg-sky-50/50 rounded flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center">
              <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
            </div>
          </div>
          <div className="space-y-0.5 my-1">
            <div className="h-1 bg-slate-400 rounded w-3/4 mx-auto" />
            <div className="h-1 bg-slate-200 rounded w-full" />
          </div>
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            CALL TO ACTION
          </div>
        </div>
      ),
    },
    {
      id: 'calendar-page',
      label: 'Calendário',
      shortLabel: 'Calendário',
      ctaText: 'AGENDAR',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-bold py-0.5 rounded text-center tracking-wider">
            CALENDAR
          </div>
          <div className="grid grid-cols-4 gap-0.5 my-auto p-0.5 bg-slate-50 rounded border border-slate-200">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-xs flex items-center justify-center text-[5px] ${
                  i === 3 ? 'bg-sky-500 text-white font-bold' : 'bg-white text-slate-400'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="h-1 bg-slate-300 rounded w-3/4 mx-auto" />
        </div>
      ),
    },
    {
      id: 'survey-quiz-page',
      label: 'Enquete',
      shortLabel: 'Enquete',
      ctaText: 'CALL TO ACTION',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="h-1 bg-slate-400 rounded w-4/5" />
          <div className="space-y-1 my-1">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-xs border ${item === 1 ? 'border-sky-500 bg-sky-500' : 'border-slate-300 bg-white'}`} />
                <div className="h-1 bg-slate-200 rounded flex-1" />
              </div>
            ))}
          </div>
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            CALL TO ACTION
          </div>
        </div>
      ),
    },
    {
      id: 'upsell-page',
      label: 'Venda Adicional',
      shortLabel: 'Venda adici...',
      ctaText: 'BUY NOW',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="h-1 bg-amber-500 rounded w-3/4" />
          <div className="w-full h-8 border border-sky-400 bg-sky-50 rounded flex items-center justify-center my-0.5">
            <Play className="w-3 h-3 text-sky-600 fill-current" />
          </div>
          <div className="h-1 bg-slate-200 rounded w-full" />
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            BUY NOW
          </div>
        </div>
      ),
    },
    {
      id: 'webinar-live-page',
      label: 'Webinar ao Vivo',
      shortLabel: 'Webinar ao...',
      ctaText: 'ASSISTIR',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="w-full h-9 border border-sky-400 bg-sky-50 rounded flex flex-col items-center justify-center p-0.5">
            <div className="flex items-center gap-0.5">
              <User className="w-2.5 h-2.5 text-sky-600" />
              <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 py-0.5 text-slate-400">
            <User className="w-2 h-2" />
            <User className="w-2 h-2" />
            <User className="w-2 h-2" />
          </div>
          <div className="h-1 bg-slate-300 rounded w-3/4 mx-auto" />
        </div>
      ),
    },
    {
      id: 'webinar-replay-page',
      label: 'Gravação do Webinar',
      shortLabel: 'Gravação d...',
      ctaText: 'BUY NOW',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="w-full h-9 border border-slate-300 bg-slate-100 rounded flex items-center justify-center">
            <Play className="w-3 h-3 text-slate-700 fill-current" />
          </div>
          <div className="h-1 bg-slate-200 rounded w-full my-0.5" />
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            BUY NOW
          </div>
        </div>
      ),
    },
    {
      id: 'blog-post-page',
      label: 'Postagem de Blog',
      shortLabel: 'Postagem ...',
      ctaText: 'LER POST',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="w-full h-7 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="flex items-center gap-1 my-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 flex items-center justify-center">
              <User className="w-1.5 h-1.5 text-slate-600" />
            </div>
            <div className="h-1 bg-slate-300 rounded flex-1" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 bg-slate-200 rounded w-full" />
            <div className="h-0.5 bg-slate-200 rounded w-5/6" />
          </div>
        </div>
      ),
    },
    {
      id: 'membership-page',
      label: 'Área de Membros',
      shortLabel: 'Área de me...',
      ctaText: 'ACESSAR',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1.5 bg-white">
          <div className="w-full h-7 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
            <User className="w-3 h-3 text-sky-600" />
          </div>
          <div className="space-y-0.5 my-0.5">
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-xs bg-sky-400" />
              <div className="h-0.5 bg-slate-300 rounded flex-1" />
            </div>
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-xs bg-sky-400" />
              <div className="h-0.5 bg-slate-300 rounded flex-1" />
            </div>
          </div>
          <div className="h-1 bg-slate-200 rounded w-3/4" />
        </div>
      ),
    },
    {
      id: 'thankyou-page',
      label: 'Obrigado',
      shortLabel: 'Obrigado',
      ctaText: 'CALL TO ACTION',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col items-center justify-between p-1.5 bg-white">
          <div className="w-8 h-8 rounded-full border border-sky-400 bg-sky-50 flex items-center justify-center text-sky-600 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="w-full space-y-0.5 my-1 px-1">
            <div className="h-1 bg-slate-400 rounded w-4/5 mx-auto" />
            <div className="h-0.5 bg-slate-200 rounded w-full" />
          </div>
          <div className="w-full bg-[#0284c7] text-white text-[6px] font-extrabold py-0.5 rounded text-center tracking-wider">
            CALL TO ACTION
          </div>
        </div>
      ),
    },
    {
      id: 'popup-modal',
      label: 'Aparecer (Pop-up)',
      shortLabel: 'Aparecer',
      ctaText: 'CALL TO ACTION',
      renderPreview: () => (
        <div className="w-full h-full flex flex-col justify-between p-1 bg-slate-100">
          <div className="w-full h-full border border-sky-400 bg-white rounded p-1 flex flex-col justify-between">
            <div className="w-full h-5 border border-sky-300 bg-sky-50 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="h-0.5 bg-slate-200 rounded w-full my-0.5" />
            <div className="w-full bg-[#0284c7] text-white text-[5px] font-extrabold py-0.5 rounded text-center tracking-wider">
              CALL TO ACTION
            </div>
          </div>
        </div>
      ),
    },
  ];

  // ALL FONTES CATEGORIES MATCHING SCREENSHOT EXACTLY
  const fontesCategories: {
    categoryKey: string;
    title: string;
    items: {
      id: string;
      label: string;
      shortLabel: string;
      badge: string;
      color: string;
      hasDollar?: boolean;
    }[];
  }[] = [
    {
      categoryKey: 'pago',
      title: 'Pago',
      items: [
        { id: 'ad-facebook', label: 'Anúncio do Facebook', shortLabel: 'Anúncio do...', badge: 'f', color: '#1877f2', hasDollar: true },
        { id: 'ad-google', label: 'Anúncios do Google', shortLabel: 'Anúncios d...', badge: 'G', color: '#10b981', hasDollar: true },
        { id: 'ad-instagram', label: 'Anúncio do Instagram', shortLabel: 'Anúncio do...', badge: 'IG', color: '#d6249f', hasDollar: true },
        { id: 'ad-bing', label: 'Anúncios do Bing', shortLabel: 'Anúncios d...', badge: 'b', color: '#f59e0b', hasDollar: true },
        { id: 'ad-linkedin', label: 'Anúncio do LinkedIn', shortLabel: 'Anúncio do...', badge: 'in', color: '#0a66c2', hasDollar: true },
        { id: 'ad-youtube', label: 'Anúncios do YouTube', shortLabel: 'Anúncios d...', badge: 'YT', color: '#ff0000', hasDollar: true },
        { id: 'ad-x', label: 'X Anúncios', shortLabel: 'X Anúncios', badge: '𝕏', color: '#000000', hasDollar: true },
        { id: 'ad-tiktok', label: 'Anúncios do TikTok', shortLabel: 'Anúncios d...', badge: 'TT', color: '#000000', hasDollar: true },
        { id: 'ad-pinterest', label: 'Anúncios do Pinterest', shortLabel: 'Anúncios d...', badge: 'P', color: '#e60023', hasDollar: true },
        { id: 'ad-reddit', label: 'Anúncios do Reddit', shortLabel: 'Anúncios d...', badge: 'RD', color: '#ff4500', hasDollar: true },
      ],
    },
    {
      categoryKey: 'procurar',
      title: 'Procurar',
      items: [
        { id: 'search-all', label: 'Todas as pesquisas', shortLabel: 'Todas as p...', badge: '🔍', color: '#ea4335' },
        { id: 'search-bing', label: 'Bing', shortLabel: 'Bing', badge: 'b', color: '#f59e0b' },
        { id: 'search-google', label: 'Google', shortLabel: 'Google', badge: 'G', color: '#4285f4' },
        { id: 'search-youtube', label: 'YouTube', shortLabel: 'YouTube', badge: 'YT', color: '#ff0000' },
      ],
    },
    {
      categoryKey: 'social',
      title: 'Social',
      items: [
        { id: 'social-facebook', label: 'Facebook Orgânico', shortLabel: 'Facebook ...', badge: 'f', color: '#1877f2' },
        { id: 'social-pinterest', label: 'Pinterest Orgânico', shortLabel: 'Pinterest O...', badge: 'P', color: '#e60023' },
        { id: 'social-reddit', label: 'Reddit', shortLabel: 'Reddit', badge: 'RD', color: '#ff4500' },
        { id: 'social-instagram', label: 'Instagram Orgânico', shortLabel: 'Instagram ...', badge: 'IG', color: '#d6249f' },
        { id: 'social-linkedin', label: 'LinkedIn Orgânico', shortLabel: 'LinkedIn Or...', badge: 'in', color: '#0a66c2' },
        { id: 'social-tiktok', label: 'TikTok Orgânico', shortLabel: 'Tiktok Org...', badge: 'TT', color: '#000000' },
        { id: 'social-x', label: 'X Orgânico', shortLabel: 'X Orgânico', badge: '𝕏', color: '#000000' },
      ],
    },
    {
      categoryKey: 'outro',
      title: 'Outro',
      items: [
        { id: 'other-email', label: 'E-mail Marketing', shortLabel: 'E-mail', badge: '✉', color: '#0284c7' },
        { id: 'other-direct', label: 'Tráfego Direto', shortLabel: 'Direto', badge: '➔', color: '#0f172a' },
        { id: 'other-affiliates', label: 'Afiliados & Parcerias', shortLabel: 'Afiliados', badge: '🤝', color: '#16a34a' },
      ],
    },
    {
      categoryKey: 'crms',
      title: 'CRMs',
      items: [
        { id: 'crm-ontraport', label: 'Ontraport', shortLabel: 'Ontraport', badge: 'on', color: '#0284c7' },
        { id: 'crm-keap', label: 'Keap', shortLabel: 'Keap', badge: 'k', color: '#16a34a' },
        { id: 'crm-mailchimp', label: 'Mailchimp', shortLabel: 'Mailchimp', badge: '🐵', color: '#0f172a' },
        { id: 'crm-pipedrive', label: 'Pipedrive', shortLabel: 'Pipedrive', badge: 'P', color: '#16a34a' },
        { id: 'crm-interfone', label: 'Interfone / Intercom', shortLabel: 'Interfone', badge: '💬', color: '#0284c7' },
        { id: 'crm-mercado', label: 'Mercado', shortLabel: 'Mercado', badge: '📊', color: '#6366f1' },
        { id: 'crm-constant-contact', label: 'Contato Constante', shortLabel: 'Contato co...', badge: 'CC', color: '#0ea5e9' },
        { id: 'crm-activecampaign', label: 'Campanha Ativa', shortLabel: 'Campanha ...', badge: '≫', color: '#2563eb' },
        { id: 'crm-hubspot', label: 'Hubspot', shortLabel: 'Hubspot', badge: '⚙', color: '#f97316' },
        { id: 'crm-pingar', label: 'Pingar', shortLabel: 'Pingar', badge: '☻', color: '#ec4899' },
        { id: 'crm-salesforce', label: 'Salesforce', shortLabel: 'Salesforce', badge: '☁', color: '#0284c7' },
      ],
    },
    {
      categoryKey: 'mensagens',
      title: 'Mensagens',
      items: [
        { id: 'msg-livechat', label: 'Caixa de bate-papo', shortLabel: 'Caixa de b...', badge: '💬', color: '#0284c7' },
        { id: 'msg-slack', label: 'Slack', shortLabel: 'Slack', badge: '#', color: '#e11d48' },
        { id: 'msg-telegram', label: 'Telegrama', shortLabel: 'Telegrama', badge: '✈', color: '#0284c7' },
        { id: 'msg-messenger', label: 'Mensageiro', shortLabel: 'Mensageiro', badge: '⚡', color: '#2563eb' },
        { id: 'msg-sms', label: 'SMS', shortLabel: 'SMS', badge: 'SMS', color: '#db2777' },
        { id: 'msg-chatbot', label: 'Chatbot', shortLabel: 'Chatbot', badge: '🤖', color: '#2563eb' },
      ],
    },
    {
      categoryKey: 'outros_sites',
      title: 'Outros sites',
      items: [
        { id: 'site-zoho', label: 'Zoho', shortLabel: 'Zoho', badge: 'Z', color: '#0f172a' },
        { id: 'site-yelp', label: 'Yelp', shortLabel: 'Yelp', badge: '✱', color: '#dc2626' },
        { id: 'site-zendesk', label: 'Zendesk', shortLabel: 'Zendesk', badge: 'ZD', color: '#064e3b' },
        { id: 'site-deriva', label: 'Deriva / Drift', shortLabel: 'Deriva', badge: '⚡', color: '#0f172a' },
        { id: 'site-gotomeeting', label: 'Ir para a reunião', shortLabel: 'Ir para a re...', badge: '❄', color: '#ea580c' },
        { id: 'site-amazon', label: 'Amazon', shortLabel: 'Amazon', badge: 'a', color: '#ea580c' },
        { id: 'site-zoom', label: 'Zoom', shortLabel: 'Zoom', badge: '📹', color: '#2563eb' },
        { id: 'site-gmail', label: 'Gmail', shortLabel: 'Gmail', badge: 'M', color: '#ef4444' },
        { id: 'site-spotify', label: 'Spotify', shortLabel: 'Spotify', badge: '♫', color: '#22c55e' },
        { id: 'site-snapchat', label: 'Snapchat', shortLabel: 'Snapchat', badge: '👻', color: '#eab308' },
        { id: 'site-clutch', label: 'Embreagem / Clutch', shortLabel: 'Embreagem', badge: 'C', color: '#0f172a' },
        { id: 'site-gmaps', label: 'Google Maps', shortLabel: 'Google Maps', badge: '📍', color: '#2563eb' },
      ],
    },
    {
      categoryKey: 'offline',
      title: 'Offline',
      items: [
        { id: 'off-interview', label: 'Entrevista / Boca a Boca', shortLabel: 'Entrevista ...', badge: '👥', color: '#06b6d4' },
        { id: 'off-newspaper', label: 'Anúncio impresso / Jornal', shortLabel: 'Anúncio im...', badge: '📰', color: '#334155' },
        { id: 'off-conference', label: 'Conferência / Evento', shortLabel: 'Conferência', badge: '🎤', color: '#7c3aed' },
        { id: 'off-meeting-online', label: 'Reunião online / Presencial', shortLabel: 'Reunião on...', badge: '📊', color: '#f97316' },
        { id: 'off-banner', label: 'Bandeira / Banner', shortLabel: 'Bandeira', badge: 'Ad', color: '#7c3aed' },
        { id: 'off-direct-mail', label: 'Mala direta', shortLabel: 'Mala direta', badge: '✉', color: '#2563eb' },
        { id: 'off-tv-ad', label: 'Anúncio de TV', shortLabel: 'Anúncio de...', badge: 'AD', color: '#2563eb' },
        { id: 'off-directory', label: 'Diretório de empresas', shortLabel: 'Diretório d...', badge: '🚏', color: '#2563eb' },
        { id: 'off-workshop', label: 'Workshop presencial', shortLabel: 'Workshop ...', badge: '🎓', color: '#0891b2' },
        { id: 'off-radio', label: 'Rádio', shortLabel: 'Rádio', badge: '📻', color: '#ea580c' },
        { id: 'off-guest-blog', label: 'Blog de Convidado', shortLabel: 'Blog de Co...', badge: '✍', color: '#0891b2' },
        { id: 'off-jobs', label: 'Site de empregos', shortLabel: 'Site de em...', badge: '💼', color: '#2563eb' },
        { id: 'off-1on1', label: 'Reunião 1:1', shortLabel: 'Reunião', badge: '👤', color: '#16a34a' },
        { id: 'off-billboard', label: 'Outdoor / Painel', shortLabel: 'Outdoor', badge: 'Ad', color: '#eab308' },
        { id: 'off-business-card', label: 'Cartão de visita', shortLabel: 'Cartão de ...', badge: '🪪', color: '#1e40af' },
        { id: 'off-careers', label: 'Site de Carreiras / Educação', shortLabel: 'Site de Car...', badge: '🎓', color: '#16a34a' },
        { id: 'off-phone', label: 'Telefone / Ligação', shortLabel: 'Telefone', badge: '📞', color: '#0284c7' },
        { id: 'off-report', label: 'Relatório / E-book impresso', shortLabel: 'Relatório', badge: '📄', color: '#64748b' },
        { id: 'off-qrcode', label: 'Código QR', shortLabel: 'Código QR', badge: '⬛', color: '#000000' },
      ],
    },
  ];

  // Actions List
  const actionsList = [
    {
      id: 'purchase-approved',
      label: 'Compra Aprovada',
      metric: 'R$ 197,00',
      description: 'Venda aprovada no checkout',
      icon: <CreditCard className="w-4 h-4" />,
      bgGradient: 'from-emerald-500 to-green-600',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    {
      id: 'pix-approved',
      label: 'PIX Aprovado / Gerado',
      metric: 'R$ 197,00',
      description: 'Pagamento instantâneo via PIX',
      icon: <Target className="w-4 h-4" />,
      bgGradient: 'from-teal-500 to-emerald-600',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-700',
    },
    {
      id: 'boleto-generated',
      label: 'Boleto Bancário',
      metric: 'R$ 197,00',
      description: 'Boleto gerado pelo cliente',
      icon: <CreditCard className="w-4 h-4" />,
      bgGradient: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    {
      id: 'credit-card',
      label: 'Cartão de Crédito',
      metric: 'R$ 297,00',
      description: 'Transação processada no cartão',
      icon: <CreditCard className="w-4 h-4" />,
      bgGradient: 'from-indigo-500 to-blue-600',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    },
    {
      id: 'upsell-orderbump',
      label: 'Upsell / Order Bump',
      metric: '+ R$ 47,00',
      description: 'Oferta complementar aceita',
      icon: <TrendingUp className="w-4 h-4" />,
      bgGradient: 'from-violet-500 to-purple-600',
      badgeBg: 'bg-violet-50 border-violet-200 text-violet-700',
    },
    {
      id: 'abandoned-cart',
      label: 'Carrinho Abandonado',
      metric: 'Recuperar',
      description: 'Disparar régua de recuperação',
      icon: <Target className="w-4 h-4" />,
      bgGradient: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
    },
    {
      id: 'lead-optin',
      label: 'Lead Cadastrado',
      metric: '48% taxa',
      description: 'Novo contato registrado no funil',
      icon: <User className="w-4 h-4" />,
      bgGradient: 'from-sky-500 to-cyan-600',
      badgeBg: 'bg-sky-50 border-sky-200 text-sky-700',
    },
    {
      id: 'meeting-scheduled',
      label: 'Reunião Agendada',
      metric: '18 agendados',
      description: 'Call de fechamento marcada',
      icon: <Calendar className="w-4 h-4" />,
      bgGradient: 'from-amber-600 to-yellow-600',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    {
      id: 'subscription',
      label: 'Assinatura Recorrente',
      metric: 'R$ 97/mês',
      description: 'Plano com renovação automática',
      icon: <TrendingUp className="w-4 h-4" />,
      bgGradient: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    {
      id: 'tag-crm',
      label: 'Tag Aplicada no CRM',
      metric: 'Tag: Quente',
      description: 'Etiqueta de segmentação no lead',
      icon: <Target className="w-4 h-4" />,
      bgGradient: 'from-teal-600 to-cyan-700',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-700',
    },
    {
      id: 'webhook-fired',
      label: 'Webhook / API Disparado',
      metric: 'Status: 200',
      description: 'Integração externa acionada',
      icon: <Target className="w-4 h-4" />,
      bgGradient: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    },
  ];

  return (
    <div className="absolute left-full top-0 ml-2 bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 w-[450px] max-h-[85vh] flex flex-col overflow-hidden text-slate-800 animate-in fade-in select-none">
      {/* Top 3 Navigation Tabs matching screenshot */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/80 shrink-0">
        <button
          onClick={() => setActiveTab('fontes')}
          className={`flex-1 py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-r border-slate-200 ${
            activeTab === 'fontes'
              ? 'bg-white text-blue-600 shadow-2xs border-b-2 border-b-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-slate-500" />
          <span>Fontes</span>
        </button>

        <button
          onClick={() => setActiveTab('paginas')}
          className={`flex-1 py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-r border-slate-200 ${
            activeTab === 'paginas'
              ? 'bg-white text-blue-600 shadow-2xs border-b-2 border-b-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Layout className="w-3.5 h-3.5 text-slate-500" />
          <span>Páginas</span>
        </button>

        <button
          onClick={() => setActiveTab('acoes')}
          className={`flex-1 py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'acoes'
              ? 'bg-white text-blue-600 shadow-2xs border-b-2 border-b-blue-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-slate-500" />
          <span>Ações</span>
        </button>

        <button
          onClick={onClose}
          className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* TAB 1: FONTES DE TRÁFEGO (Matching uploaded image exactly) */}
        {activeTab === 'fontes' && (
          <div className="space-y-6">
            {fontesCategories.map((cat) => (
              <div key={cat.categoryKey} className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 tracking-wide">
                  {cat.title}
                </h4>
                <div className="grid grid-cols-7 gap-2">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        playSound.pop();
                        onInsertTrafficSource(item.id, item.label, item.badge, item.color);
                      }}
                      className="flex flex-col items-center gap-1 group cursor-pointer"
                      title={item.label}
                    >
                      <div className="transition-transform group-hover:scale-110 active:scale-95">
                        {renderTrafficIcon(item.id, 44, item.hasDollar)}
                      </div>
                      <span className="text-[10px] text-slate-500 text-center truncate max-w-[54px] group-hover:text-blue-600">
                        {item.shortLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Custom Uploaded Icons Section */}
            <div className="pt-3 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 mb-3">
                Ícones personalizados carregados
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {/* + Adicionar Button Card */}
                <label className="flex flex-col items-center gap-1 group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                  <div className="w-11 h-11 rounded-2xl border-2 border-blue-500 bg-blue-50 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                    <div className="relative">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                      <Plus className="w-3 h-3 text-blue-700 absolute -bottom-1 -right-1 stroke-[3]" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 text-center group-hover:text-blue-600">
                    Adicionar
                  </span>
                </label>

                {/* Custom User Icons List */}
                {customIcons.map((ci) => (
                  <div
                    key={ci.id}
                    onClick={() => {
                      playSound.pop();
                      onInsertTrafficSource('custom-source', ci.name, '★', '#2563eb');
                    }}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                    title={ci.name}
                  >
                    <div className="w-11 h-11 rounded-2xl border border-slate-300 bg-white p-1 overflow-hidden shadow-2xs group-hover:border-blue-500 group-hover:scale-110 transition-all flex items-center justify-center">
                      <img src={ci.url} alt={ci.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] text-slate-500 text-center truncate max-w-[54px]">
                      {ci.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PÁGINAS */}
        {activeTab === 'paginas' && (
          <>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Páginas</h3>
              <div className="grid grid-cols-4 gap-3">
                {pagesList.map((pg) => (
                  <div
                    key={pg.id}
                    onClick={() => {
                      playSound.pop();
                      onInsertFunnelPage(pg.id, pg.label, pg.ctaText);
                    }}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    title={pg.label}
                  >
                    {/* Browser Wireframe Card */}
                    <div className="w-full aspect-[4/5] rounded-xl border border-slate-300 bg-white overflow-hidden shadow-2xs group-hover:border-blue-500 group-hover:shadow-md transition-all group-hover:scale-105 flex flex-col">
                      {/* Browser header bar */}
                      <div className="h-3.5 bg-slate-100 border-b border-slate-200 px-1 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-rose-400" />
                          <div className="w-1 h-1 rounded-full bg-amber-400" />
                          <div className="w-1 h-1 rounded-full bg-emerald-400" />
                        </div>
                        <div className="h-1.5 w-6 bg-white border border-slate-200 rounded-xs" />
                        <div className="w-1" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        {pg.renderPreview()}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 text-center truncate max-w-full group-hover:text-blue-600">
                      {pg.shortLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Uploaded Icons Section */}
            <div className="pt-3 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Ícones personalizados carregados
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {/* + Adicionar Button Card */}
                <label className="flex flex-col items-center gap-1.5 group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                  <div className="w-full aspect-[4/5] rounded-xl border-2 border-blue-500 bg-blue-50/50 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-blue-100/70 group-hover:scale-105 transition-all">
                    <div className="relative">
                      <ImageIcon className="w-7 h-7 text-blue-600" />
                      <Plus className="w-3.5 h-3.5 text-blue-700 absolute -bottom-1 -right-1 stroke-[3]" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 text-center group-hover:text-blue-600">
                    Adicionar
                  </span>
                </label>

                {/* Custom User Icons List */}
                {customIcons.map((ci) => (
                  <div
                    key={ci.id}
                    onClick={() => {
                      playSound.pop();
                      onInsertFunnelPage('custom-page', ci.name, 'ACESSAR', ci.url);
                    }}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    title={ci.name}
                  >
                    <div className="w-full aspect-[4/5] rounded-xl border border-slate-300 bg-white p-1 overflow-hidden shadow-2xs group-hover:border-blue-500 group-hover:scale-105 transition-all flex items-center justify-center">
                      <img src={ci.url} alt={ci.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 text-center truncate max-w-full">
                      {ci.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 3: AÇÕES (Matching uploaded image exactly) */}
        {activeTab === 'acoes' && (
          <div className="space-y-6">
            {ACTIONS_CATEGORIES.map((cat) => (
              <div key={cat.categoryKey} className="space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 tracking-wide">
                    {cat.title}
                  </h4>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        playSound.pop();
                        onInsertAction(item.id, item.label, item.defaultMetric);
                      }}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer"
                      title={item.label}
                    >
                      <div className="transition-transform group-hover:scale-115 active:scale-95">
                        {renderActionDiamondIcon(item.id, 46)}
                      </div>
                      <span className="text-[10px] text-slate-500 text-center truncate max-w-[62px] group-hover:text-blue-600">
                        {item.shortLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Custom Uploaded Action Icons Section */}
            <div className="pt-3 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 mb-3">
                Ícones personalizados carregados
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {/* + Adicionar Button Card */}
                <label className="flex flex-col items-center gap-1.5 group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                  <div className="transition-transform group-hover:scale-115 active:scale-95">
                    {renderActionDiamondIcon('action-custom-add', 46)}
                  </div>
                  <span className="text-[10px] text-slate-500 text-center group-hover:text-blue-600">
                    Adicionar
                  </span>
                </label>

                {/* Custom User Icons List */}
                {customIcons.map((ci) => (
                  <div
                    key={ci.id}
                    onClick={() => {
                      playSound.pop();
                      onInsertAction('custom-action', ci.name, 'R$ 197,00');
                    }}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    title={ci.name}
                  >
                    <div className="w-10 h-10 rounded-[10px] rotate-45 border border-slate-300 bg-white p-1 overflow-hidden shadow-2xs group-hover:border-blue-500 group-hover:scale-110 transition-all flex items-center justify-center">
                      <div className="-rotate-45 w-full h-full flex items-center justify-center">
                        <img src={ci.url} alt={ci.name} className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 text-center truncate max-w-[62px]">
                      {ci.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

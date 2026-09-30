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
} from 'lucide-react';

interface FunnelWireframeElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent: (id: string, newContent: string) => void;
  onStartConnect?: (elementId: string, anchor: 'top' | 'right' | 'bottom' | 'left') => void;
}

export const FunnelWireframeElement: React.FC<FunnelWireframeElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdateContent,
  onStartConnect,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(element.content || 'Página');
  const [isHovered, setIsHovered] = useState(false);
  const funnelType = element.style.funnelPageType || 'generic-page';

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onUpdateContent(element.id, titleText.trim());
    }
    setIsEditingTitle(false);
  };

  // Connection Anchors component rendered on all funnel items
  const renderConnectionAnchors = () => {
    if (!onStartConnect) return null;
    const showAnchors = isSelected || isHovered;

    return (
      <div className={`transition-opacity duration-150 ${showAnchors ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
              <div className="h-5 border border-slate-300 rounded bg-white px-1.5 flex items-center">
                <span className="text-[8px] text-slate-400">Seu nome...</span>
              </div>
              <div className="h-5 border border-slate-300 rounded bg-white px-1.5 flex items-center">
                <span className="text-[8px] text-slate-400">Seu e-mail...</span>
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
              <div className="h-10 border border-sky-300 bg-sky-50 rounded flex flex-col items-center justify-center p-0.5">
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span className="text-[7px] font-bold text-sky-700">R$ OFERTA</span>
              </div>
              <div className="space-y-1 py-0.5">
                <div className="h-2 bg-slate-400 rounded w-full" />
                <div className="h-1.5 bg-slate-200 rounded w-4/5" />
                <div className="h-1.5 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
            <div className="h-7 border border-dashed border-slate-200 rounded bg-slate-50 p-1 flex items-center justify-between">
              <div className="h-1.5 bg-slate-300 rounded w-1/2" />
              <span className="text-[8px] font-bold text-emerald-600">Garantia 7d</span>
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'BUY NOW'}
            </div>
          </div>
        );

      case 'vsl-video-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-18 border border-sky-400 bg-sky-50/50 rounded flex items-center justify-center relative group">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 ml-0.5 fill-current" />
              </div>
            </div>
            <div className="space-y-1 my-1">
              <div className="h-2 bg-slate-400 rounded w-3/4 mx-auto" />
              <div className="h-1.5 bg-slate-200 rounded w-full" />
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'CALL TO ACTION'}
            </div>
          </div>
        );

      case 'calendar-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-bold py-1 rounded text-center tracking-wider uppercase">
              CALENDAR
            </div>
            <div className="grid grid-cols-5 gap-1 my-auto p-1 bg-slate-50 rounded border border-slate-200">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 rounded flex items-center justify-center text-[7px] font-mono ${
                    i === 7 ? 'bg-sky-500 text-white font-bold' : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-slate-300 rounded w-3/4 mx-auto" />
          </div>
        );

      case 'survey-quiz-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="h-2 bg-slate-400 rounded w-4/5" />
            <div className="space-y-1.5 my-auto">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-xs border ${item === 1 ? 'border-sky-500 bg-sky-500' : 'border-slate-300 bg-white'}`} />
                  <div className="h-1.5 bg-slate-200 rounded flex-1" />
                </div>
              ))}
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'CALL TO ACTION'}
            </div>
          </div>
        );

      case 'upsell-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="h-2 bg-amber-500 rounded w-3/4" />
            <div className="w-full h-12 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
              <Play className="w-4 h-4 text-sky-600 fill-current" />
            </div>
            <div className="h-1.5 bg-slate-200 rounded w-full" />
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'BUY NOW'}
            </div>
          </div>
        );

      case 'webinar-live-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-14 border border-sky-400 bg-sky-50 rounded flex flex-col items-center justify-center p-1">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-sky-600" />
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-[7px] font-bold text-sky-700 mt-0.5">AO VIVO</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1 text-slate-400">
              <User className="w-3 h-3" />
              <User className="w-3 h-3" />
              <User className="w-3 h-3" />
            </div>
            <div className="h-1.5 bg-slate-300 rounded w-3/4 mx-auto" />
          </div>
        );

      case 'webinar-replay-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-14 border border-slate-300 bg-slate-100 rounded flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center">
                <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
              </div>
            </div>
            <div className="h-1.5 bg-slate-200 rounded w-full my-1" />
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'BUY NOW'}
            </div>
          </div>
        );

      case 'blog-post-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-10 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 my-1">
              <div className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center">
                <User className="w-2.5 h-2.5 text-slate-600" />
              </div>
              <div className="h-1.5 bg-slate-300 rounded flex-1" />
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-slate-200 rounded w-full" />
              <div className="h-1 bg-slate-200 rounded w-5/6" />
            </div>
          </div>
        );

      case 'membership-page':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="w-full h-10 border border-sky-400 bg-sky-50 rounded flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-sky-500 bg-white flex items-center justify-center text-sky-600">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="space-y-1 my-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-xs bg-sky-400" />
                <div className="h-1 bg-slate-300 rounded flex-1" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-xs bg-sky-400" />
                <div className="h-1 bg-slate-300 rounded flex-1" />
              </div>
            </div>
            <div className="h-1.5 bg-slate-200 rounded w-3/4" />
          </div>
        );

      case 'thankyou-page':
        return (
          <div className="w-full h-full flex flex-col items-center justify-between p-2">
            <div className="w-12 h-12 rounded-full border-2 border-sky-400 bg-sky-50 flex items-center justify-center text-sky-600 mt-1">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="w-full space-y-1 my-auto px-2">
              <div className="h-2 bg-slate-400 rounded w-4/5 mx-auto" />
              <div className="h-1.5 bg-slate-200 rounded w-full" />
            </div>
            <div className="w-full bg-[#0284c7] text-white text-[9px] font-extrabold py-1.5 rounded text-center tracking-wider shadow-xs uppercase">
              {element.style.ctaText || 'CALL TO ACTION'}
            </div>
          </div>
        );

      case 'popup-modal':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2 bg-slate-100/70">
            <div className="w-full h-full border border-sky-400 bg-white rounded shadow-sm p-1.5 flex flex-col justify-between">
              <div className="w-full h-8 border border-sky-300 bg-sky-50 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="h-1.5 bg-slate-200 rounded w-full my-0.5" />
              <div className="w-full bg-[#0284c7] text-white text-[8px] font-extrabold py-1 rounded text-center tracking-wider shadow-xs uppercase">
                {element.style.ctaText || 'CALL TO ACTION'}
              </div>
            </div>
          </div>
        );

      case 'generic-page':
      case 'squeeze-page':
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

  // If this element is a Funnel Action
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
        className={`group select-none cursor-move flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white border shadow-md transition-all ${
          isSelected
            ? 'border-blue-400 ring-4 ring-blue-500/30 shadow-xl'
            : 'border-slate-700 hover:border-blue-400'
        }`}
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
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
                className="w-full text-xs font-bold text-slate-900 bg-white border border-blue-400 rounded px-1.5 py-0.5 outline-none"
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
              className="text-[11px] font-bold text-white truncate hover:text-blue-300 cursor-pointer"
              title="Clique para renomear"
            >
              {element.content}
            </p>
          )}
        </div>

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

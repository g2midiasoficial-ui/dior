import React from 'react';

export interface TrafficIconData {
  id: string;
  name: string;
  shortLabel: string;
  category: 'pago' | 'procurar' | 'social' | 'outro' | 'crms' | 'mensagens' | 'outros_sites' | 'offline';
  bgColor: string;
  hasDollarBadge?: boolean;
}

export const renderTrafficIcon = (id: string, size = 40, hasDollar = false) => {
  const iconBase = () => {
    switch (id) {
      // 1. PAGO & SOCIAL
      case 'ad-facebook':
      case 'social-facebook':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold shadow-xs"
            style={{ backgroundColor: '#1877f2' }}
          >
            <span className="text-xl font-sans font-bold leading-none select-none">f</span>
          </div>
        );

      case 'ad-google':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold shadow-xs"
            style={{ backgroundColor: '#10b981' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
        );

      case 'ad-instagram':
      case 'social-instagram':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB]"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
        );

      case 'ad-bing':
      case 'search-bing':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold shadow-xs"
            style={{ backgroundColor: '#f59e0b' }}
          >
            <span className="text-lg font-serif font-black italic select-none">b</span>
          </div>
        );

      case 'ad-linkedin':
      case 'social-linkedin':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-xs"
            style={{ backgroundColor: '#0a66c2' }}
          >
            <span className="text-sm font-sans font-bold select-none">in</span>
          </div>
        );

      case 'ad-youtube':
      case 'search-youtube':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#ff0000' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
            </svg>
          </div>
        );

      case 'ad-x':
      case 'social-x':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs bg-black"
          >
            <span className="text-base font-sans font-black select-none">𝕏</span>
          </div>
        );

      case 'ad-tiktok':
      case 'social-tiktok':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs bg-black"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.74 1.35-.07 2.54-.93 2.94-2.22.15-.46.22-.95.22-1.44V.02h.01z" />
            </svg>
          </div>
        );

      case 'ad-pinterest':
      case 'social-pinterest':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs"
            style={{ backgroundColor: '#e60023' }}
          >
            <span className="text-lg font-serif font-black select-none">P</span>
          </div>
        );

      case 'ad-reddit':
      case 'social-reddit':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#ff4500' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path fill="#ffffff" d="M12 7.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-3 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
            </svg>
          </div>
        );

      // 2. PROCURAR (Search)
      case 'search-all':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#ea4335' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        );

      case 'search-google':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs"
            style={{ backgroundColor: '#4285f4' }}
          >
            <span className="text-lg font-sans font-bold select-none">G</span>
          </div>
        );

      // 3. OUTRO
      case 'other-email':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0284c7' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        );

      case 'other-direct':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs bg-slate-900"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M4 2l16 10-8 2-2 8L4 2z" />
            </svg>
          </div>
        );

      case 'other-affiliates':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#16a34a' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>
        );

      // 4. CRMS
      case 'crm-ontraport':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs"
            style={{ backgroundColor: '#0284c7' }}
          >
            <span className="text-xs font-mono font-bold select-none">on</span>
          </div>
        );

      case 'crm-keap':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs"
            style={{ backgroundColor: '#16a34a' }}
          >
            <span className="text-base font-sans font-bold select-none">k</span>
          </div>
        );

      case 'crm-mailchimp':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs bg-slate-900"
          >
            <span className="text-base select-none">🐵</span>
          </div>
        );

      case 'crm-pipedrive':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs"
            style={{ backgroundColor: '#16a34a' }}
          >
            <span className="text-base font-sans font-black select-none">P</span>
          </div>
        );

      case 'crm-interfone':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0284c7' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <rect x="4" y="6" width="3" height="12" rx="1" />
              <rect x="10.5" y="4" width="3" height="16" rx="1" />
              <rect x="17" y="6" width="3" height="12" rx="1" />
            </svg>
          </div>
        );

      case 'crm-mercado':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#6366f1' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <rect x="5" y="8" width="3.5" height="10" rx="1" />
              <rect x="10.5" y="4" width="3.5" height="14" rx="1" />
              <rect x="16" y="7" width="3.5" height="11" rx="1" />
            </svg>
          </div>
        );

      case 'crm-constant-contact':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0ea5e9' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        );

      case 'crm-activecampaign':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <span className="text-base font-mono font-black select-none">≫</span>
          </div>
        );

      case 'crm-hubspot':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#f97316' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="4" />
              <circle cx="12" cy="4" r="2" fill="currentColor" />
              <circle cx="20" cy="12" r="2" fill="currentColor" />
              <circle cx="7" cy="18" r="2" fill="currentColor" />
              <line x1="12" y1="6" x2="12" y2="8" />
              <line x1="18" y1="12" x2="16" y2="12" />
              <line x1="8.5" y1="16.5" x2="10" y2="15" />
            </svg>
          </div>
        );

      case 'crm-pingar':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#ec4899' }}
          >
            <span className="text-base select-none">☻</span>
          </div>
        );

      case 'crm-salesforce':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0284c7' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
          </div>
        );

      // 5. MENSAGENS
      case 'msg-livechat':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0284c7' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm0-3h10v2H7V6zm0 6h7v2H7v-2z" />
            </svg>
          </div>
        );

      case 'msg-slack':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#e11d48' }}
          >
            <span className="text-lg font-black select-none">#</span>
          </div>
        );

      case 'msg-telegram':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0284c7' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </div>
        );

      case 'msg-messenger':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.48 5.44 3.79 7.08V22l3.66-2.01c.82.23 1.68.35 2.55.35 5.52 0 10-4.03 10-9S17.52 2 12 2zm1.09 12.14l-2.63-2.81-5.13 2.81 5.64-5.99 2.7 2.81 5.06-2.81-5.64 5.99z" />
            </svg>
          </div>
        );

      case 'msg-sms':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-xs"
            style={{ backgroundColor: '#db2777' }}
          >
            <span className="text-[10px] font-sans font-black select-none">SMS</span>
          </div>
        );

      case 'msg-chatbot':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2zm-3 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
            </svg>
          </div>
        );

      // 6. OUTROS SITES
      case 'site-zoho':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs bg-slate-900"
          >
            <span className="text-base font-mono font-black select-none">Z</span>
          </div>
        );

      case 'site-yelp':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#dc2626' }}
          >
            <span className="text-xl font-bold select-none">✱</span>
          </div>
        );

      case 'site-zendesk':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#064e3b' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" />
              <path d="M6 18c0-3.3 2.7-6 6-6s6 2.7 6 6H6z" />
            </svg>
          </div>
        );

      case 'site-deriva':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs bg-slate-900"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
          </div>
        );

      case 'site-gotomeeting':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#ea580c' }}
          >
            <span className="text-xl select-none">❄</span>
          </div>
        );

      case 'site-amazon':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs"
            style={{ backgroundColor: '#ea580c' }}
          >
            <span className="text-lg font-serif font-black select-none">a</span>
          </div>
        );

      case 'site-zoom':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>
        );

      case 'site-gmail':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-xs"
            style={{ backgroundColor: '#ef4444' }}
          >
            <span className="text-sm font-sans font-black select-none">M</span>
          </div>
        );

      case 'site-spotify':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#22c55e' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path fill="#ffffff" d="M7 9c3-1 7-1 10 1M7.5 12c2.5-.8 5.5-.8 8 .8M8 15c2-.5 4-.5 6 .5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'site-snapchat':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#eab308' }}
          >
            <span className="text-lg select-none">👻</span>
          </div>
        );

      case 'site-clutch':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-black shadow-xs bg-slate-900"
          >
            <span className="text-base font-mono font-black select-none">C</span>
          </div>
        );

      case 'site-gmaps':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        );

      // 7. OFFLINE
      case 'off-interview':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#06b6d4' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
        );

      case 'off-newspaper':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs bg-slate-700"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
        );

      case 'off-conference':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#7c3aed' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="11" rx="2" />
              <path d="M10 19h4M12 15v4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        );

      case 'off-meeting-online':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#f97316' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        );

      case 'off-banner':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-xs"
            style={{ backgroundColor: '#7c3aed' }}
          >
            <span className="text-xs font-sans font-black select-none">Ad</span>
          </div>
        );

      case 'off-direct-mail':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
        );

      case 'off-tv-ad':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <span className="text-[10px] font-sans font-black select-none">AD</span>
          </div>
        );

      case 'off-directory':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" />
            </svg>
          </div>
        );

      case 'off-workshop':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0891b2' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 14l-4-4h8l-4 4z" />
            </svg>
          </div>
        );

      case 'off-radio':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#ea580c' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-.83-.51-1.57-1.24-1.85L12 2.54 3.24 6.15zM7 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm10 0h-4v-2h4v2zm0-4h-4v-2h4v2z" />
            </svg>
          </div>
        );

      case 'off-guest-blog':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0891b2' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        );

      case 'off-jobs':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#2563eb' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
            </svg>
          </div>
        );

      case 'off-1on1':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#16a34a' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
        );

      case 'off-billboard':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-xs"
            style={{ backgroundColor: '#eab308' }}
          >
            <span className="text-xs font-sans font-black select-none">Ad</span>
          </div>
        );

      case 'off-business-card':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#1e40af' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-6 10H8v-2h6v2zm3-4H8V8h9v2z" />
            </svg>
          </div>
        );

      case 'off-careers':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#16a34a' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
        );

      case 'off-phone':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: '#0284c7' }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </div>
        );

      case 'off-report':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs bg-slate-600"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
        );

      case 'off-qrcode':
        return (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-xs bg-black"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h3v2h-3zm-5 0h3v3h-3zm2 3h3v2h-3zm3 3h3v3h-3zm-3 0h3v-2h-3zm-2-2h2v2h-2z" />
            </svg>
          </div>
        );

      default:
        return (
          <div className="w-full h-full rounded-full flex items-center justify-center text-white bg-blue-600 shadow-xs">
            <span className="text-xs font-bold">{id.slice(0, 2).toUpperCase()}</span>
          </div>
        );
    }
  };

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {iconBase()}
      {hasDollar && (
        <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-black shadow-sm select-none">
          $
        </div>
      )}
    </div>
  );
};

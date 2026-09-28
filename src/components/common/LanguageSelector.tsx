import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import { LanguageCode } from '../../i18n/types';
import { playSound } from '../../utils/soundEffects';

interface LanguageSelectorProps {
  variant?: 'dark' | 'light' | 'minimal' | 'compact';
  showLabel?: boolean;
  dropDirection?: 'down' | 'up';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'light',
  showLabel = true,
  dropDirection = 'down',
  className = '',
}) => {
  const { language, setLanguage, currentLanguage, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: LanguageCode) => {
    playSound.click();
    setLanguage(code);
    setIsOpen(false);
  };

  // Styling variants
  const getButtonStyles = () => {
    switch (variant) {
      case 'dark':
        return 'bg-white/10 hover:bg-white/15 text-slate-100 border border-white/10 hover:border-white/20';
      case 'minimal':
        return 'bg-transparent hover:bg-slate-100 text-slate-700 border-transparent';
      case 'compact':
        return 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs py-1 px-2';
      case 'light':
      default:
        return 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs';
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          playSound.pop();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${getButtonStyles()}`}
        title="Alterar Idioma / Change Language"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        {showLabel && (
          <span className="truncate max-w-[100px] hidden sm:inline">
            {currentLanguage.nativeName}
          </span>
        )}
        <span className="font-semibold text-[11px] text-slate-600 uppercase sm:hidden">
          {currentLanguage.shortCode}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 ${
            dropDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
          } w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              Idioma / Language
            </span>
            <span className="text-[10px] text-slate-600 font-mono">8 idiomas</span>
          </div>

          <div className="max-h-64 overflow-y-auto p-1 space-y-0.5">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0">{lang.flag}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-slate-900">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-600 font-normal truncate">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

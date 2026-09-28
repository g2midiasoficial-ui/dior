import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { LanguageCode, LanguageOption, TranslationSchema } from './types';
import { supportedLanguages, translations } from './translations';

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguage: LanguageOption;
  languages: LanguageOption[];
  t: (path: string, params?: Record<string, string | number>) => string;
  schema: TranslationSchema;
}

const STORAGE_KEY = 'diorfy_user_language';

const I18nContext = createContext<I18nContextType | null>(null);

function getInitialLanguage(): LanguageCode {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (saved && supportedLanguages.some((l) => l.code === saved)) {
      return saved;
    }

    // Auto-detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('de')) return 'de';
    if (browserLang.startsWith('it')) return 'it';
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('zh')) return 'zh';
  }
  return 'pt'; // Default
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentLanguage = useMemo(() => {
    return supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];
  }, [language]);

  const schema = useMemo(() => {
    return translations[language] || translations.pt;
  }, [language]);

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    // Traverse
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Portuguese or English
        let fallback: any = translations.pt;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            fallback = null;
            break;
          }
        }
        current = fallback ?? path;
        break;
      }
    }

    let result = typeof current === 'string' ? current : path;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal));
      });
    }

    return result;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguage,
        languages: supportedLanguages,
        t,
        schema,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, language, setLanguage, currentLanguage, languages, schema } = useI18n();
  return { t, language, setLanguage, currentLanguage, languages, schema };
}

import { LanguageCode, LanguageOption, TranslationSchema } from '../types';
import { pt } from './pt';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { ja } from './ja';
import { zh } from './zh';

export const supportedLanguages: LanguageOption[] = [
  { code: 'pt', name: 'Português (Brasil)', nativeName: 'Português', flag: '🇧🇷', shortCode: 'PT' },
  { code: 'en', name: 'English (US)', nativeName: 'English', flag: '🇺🇸', shortCode: 'EN' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', shortCode: 'ES' },
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', shortCode: 'FR' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', shortCode: 'DE' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', shortCode: 'IT' },
  { code: 'ja', name: '日本語', nativeName: '日本語', flag: '🇯🇵', shortCode: 'JA' },
  { code: 'zh', name: '简体中文', nativeName: '简体中文', flag: '🇨🇳', shortCode: 'ZH' },
];

export const translations: Record<LanguageCode, TranslationSchema> = {
  pt,
  en,
  es,
  fr,
  de,
  it,
  ja,
  zh,
};

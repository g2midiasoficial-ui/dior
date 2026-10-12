import { Deck, Slide, SlideElement, SLIDE_H, SLIDE_W, TextStyle, uid } from './types';

export interface SlideTheme {
  id: string;
  name: string;
  background: string;
  titleColor: string;
  textColor: string;
  accent: string;
  titleFont: string;
  bodyFont: string;
}

export const THEMES: SlideTheme[] = [
  { id: 'clean', name: 'Clássico', background: '#ffffff', titleColor: '#0f172a', textColor: '#334155', accent: '#4f46e5', titleFont: 'Plus Jakarta Sans', bodyFont: 'Inter' },
  { id: 'diorfy', name: 'Diorfy', background: 'linear-gradient(135deg, #0b1533 0%, #1e1b4b 55%, #3b0764 100%)', titleColor: '#ffffff', textColor: '#cbd5e1', accent: '#818cf8', titleFont: 'Plus Jakarta Sans', bodyFont: 'Inter' },
  { id: 'midnight', name: 'Meia-noite', background: '#0f172a', titleColor: '#f8fafc', textColor: '#94a3b8', accent: '#38bdf8', titleFont: 'Outfit', bodyFont: 'Inter' },
  { id: 'sunset', name: 'Pôr do sol', background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', titleColor: '#7c2d12', textColor: '#9a3412', accent: '#ea580c', titleFont: 'Outfit', bodyFont: 'Inter' },
  { id: 'forest', name: 'Floresta', background: '#f0fdf4', titleColor: '#14532d', textColor: '#166534', accent: '#16a34a', titleFont: 'Plus Jakarta Sans', bodyFont: 'Inter' },
  { id: 'mono', name: 'Minimal', background: '#fafafa', titleColor: '#000000', textColor: '#404040', accent: '#000000', titleFont: 'Inter', bodyFont: 'Inter' },
];

export const FONTS = ['Inter', 'Plus Jakarta Sans', 'Outfit', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Caveat'];

export const getTheme = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0];

export function titleStyle(theme: SlideTheme, size = 54, align: TextStyle['align'] = 'left'): TextStyle {
  return { fontFamily: theme.titleFont, fontSize: size, bold: true, color: theme.titleColor, align, valign: 'middle' };
}

export function bodyStyle(theme: SlideTheme, size = 28, list: TextStyle['list'] = 'none', align: TextStyle['align'] = 'left'): TextStyle {
  return { fontFamily: theme.bodyFont, fontSize: size, color: theme.textColor, align, valign: 'top', list, lineHeight: 1.35 };
}

export type LayoutId = 'title' | 'title-content' | 'section' | 'two-columns' | 'title-only' | 'blank' | 'image-text';

export const LAYOUTS: { id: LayoutId; name: string }[] = [
  { id: 'title', name: 'Slide de título' },
  { id: 'title-content', name: 'Título e conteúdo' },
  { id: 'two-columns', name: 'Duas colunas' },
  { id: 'image-text', name: 'Imagem e texto' },
  { id: 'section', name: 'Cabeçalho de seção' },
  { id: 'title-only', name: 'Somente título' },
  { id: 'blank', name: 'Em branco' },
];

const M = 80; // margin

export function layoutElements(layout: LayoutId, theme: SlideTheme, content?: { title?: string; subtitle?: string; body?: string; body2?: string; image?: string }): SlideElement[] {
  const t = content?.title ?? 'Clique para adicionar um título';
  switch (layout) {
    case 'title':
      return [
        { id: uid(), type: 'text', role: 'title', x: M, y: 220, w: SLIDE_W - 2 * M, h: 160, text: t, textStyle: titleStyle(theme, 72, 'center') },
        { id: uid(), type: 'text', role: 'subtitle', x: M + 120, y: 400, w: SLIDE_W - 2 * M - 240, h: 90, text: content?.subtitle ?? 'Clique para adicionar um subtítulo', textStyle: { ...bodyStyle(theme, 30, 'none', 'center'), valign: 'top' } },
      ];
    case 'section':
      return [
        { id: uid(), type: 'shape', shape: 'rect', x: M, y: 330, w: 120, h: 8, fill: theme.accent },
        { id: uid(), type: 'text', role: 'title', x: M, y: 200, w: SLIDE_W - 2 * M, h: 120, text: t, textStyle: { ...titleStyle(theme, 64), valign: 'bottom' } },
        { id: uid(), type: 'text', role: 'subtitle', x: M, y: 360, w: SLIDE_W - 2 * M, h: 80, text: content?.subtitle ?? 'Descrição da seção', textStyle: bodyStyle(theme, 28) },
      ];
    case 'title-content':
      return [
        { id: uid(), type: 'text', role: 'title', x: M, y: 50, w: SLIDE_W - 2 * M, h: 110, text: t, textStyle: titleStyle(theme, 48) },
        { id: uid(), type: 'text', role: 'body', x: M, y: 180, w: SLIDE_W - 2 * M, h: 470, text: content?.body ?? 'Primeiro tópico\nSegundo tópico\nTerceiro tópico', textStyle: bodyStyle(theme, 28, 'bullet') },
      ];
    case 'two-columns':
      return [
        { id: uid(), type: 'text', role: 'title', x: M, y: 50, w: SLIDE_W - 2 * M, h: 110, text: t, textStyle: titleStyle(theme, 48) },
        { id: uid(), type: 'text', role: 'body', x: M, y: 180, w: 540, h: 470, text: content?.body ?? 'Tópico da esquerda\nOutro tópico', textStyle: bodyStyle(theme, 26, 'bullet') },
        { id: uid(), type: 'text', role: 'body', x: SLIDE_W - M - 540, y: 180, w: 540, h: 470, text: content?.body2 ?? 'Tópico da direita\nOutro tópico', textStyle: bodyStyle(theme, 26, 'bullet') },
      ];
    case 'image-text': {
      const els: SlideElement[] = [
        { id: uid(), type: 'text', role: 'title', x: 680, y: 80, w: 520, h: 160, text: t, textStyle: titleStyle(theme, 44) },
        { id: uid(), type: 'text', role: 'body', x: 680, y: 260, w: 520, h: 380, text: content?.body ?? 'Descreva a imagem ou o ponto principal aqui.', textStyle: bodyStyle(theme, 24) },
      ];
      els.unshift(
        content?.image
          ? { id: uid(), type: 'image', x: M, y: 80, w: 540, h: 560, src: content.image }
          : { id: uid(), type: 'shape', shape: 'rounded', x: M, y: 80, w: 540, h: 560, fill: '#e2e8f0', text: 'Inserir → Imagem', textStyle: bodyStyle(theme, 22, 'none', 'center') }
      );
      return els;
    }
    case 'title-only':
      return [{ id: uid(), type: 'text', role: 'title', x: M, y: 50, w: SLIDE_W - 2 * M, h: 110, text: t, textStyle: titleStyle(theme, 48) }];
    case 'blank':
    default:
      return [];
  }
}

export function newSlide(layout: LayoutId, theme: SlideTheme, content?: Parameters<typeof layoutElements>[2]): Slide {
  return { id: uid('slide'), background: theme.background, elements: layoutElements(layout, theme, content), notes: '', transition: 'fade' };
}

/** Re-color a whole deck for a new theme (keeps content and positions) */
export function applyTheme(deck: Deck, theme: SlideTheme): Deck {
  return {
    ...deck,
    themeId: theme.id,
    slides: deck.slides.map((s) => ({
      ...s,
      background: theme.background,
      elements: s.elements.map((el) => {
        if (el.type === 'text' && el.textStyle) {
          const isTitle = el.role === 'title';
          return {
            ...el,
            textStyle: {
              ...el.textStyle,
              color: isTitle ? theme.titleColor : theme.textColor,
              fontFamily: isTitle ? theme.titleFont : theme.bodyFont,
            },
          };
        }
        if (el.type === 'shape' && el.fill && el.h <= 12) return { ...el, fill: theme.accent }; // accent bars
        return el;
      }),
    })),
  };
}

export function emptyDeck(themeId = 'clean'): Deck {
  const theme = getTheme(themeId);
  return { version: 2, themeId, slides: [newSlide('title', theme, { title: 'Título da apresentação', subtitle: 'Subtítulo' })] };
}

export { SLIDE_H, SLIDE_W };

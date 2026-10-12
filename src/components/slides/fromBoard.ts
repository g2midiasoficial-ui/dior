import { CanvasElement, CanvasFrame } from '../../types/miro';
import { Deck, Slide } from './types';
import { emptyDeck, getTheme, newSlide, SlideTheme } from './themes';

function inFrame(frame: CanvasFrame, el: CanvasElement) {
  return el.x >= frame.x - 40 && el.x <= frame.x + frame.width + 40 && el.y >= frame.y - 40 && el.y <= frame.y + frame.height + 40;
}

const textOf = (el: CanvasElement) => (el.content || '').replace(/\s+\n/g, '\n').trim();

function slideFromGroup(title: string, group: CanvasElement[], theme: SlideTheme): Slide {
  const texts = group.filter((el) => ['text', 'sticky', 'shape', 'mindmap'].includes(el.type) && textOf(el));
  const image = group.find((el) => el.type === 'image' && el.style?.imageUrl)?.style.imageUrl;
  const bullets = texts
    .map(textOf)
    .filter((t) => t && t !== title)
    .map((t) => t.split('\n')[0].slice(0, 120))
    .slice(0, 7);
  const body = bullets.length > 0 ? bullets.join('\n') : 'Adicione os pontos principais aqui';

  if (image) return newSlide('image-text', theme, { title, body, image });
  if (bullets.length >= 6) {
    const half = Math.ceil(bullets.length / 2);
    return newSlide('two-columns', theme, { title, body: bullets.slice(0, half).join('\n'), body2: bullets.slice(half).join('\n') });
  }
  return newSlide('title-content', theme, { title, body });
}

/** Builds a first draft deck from the board: one slide per frame (or a summary if there are no frames) */
export function deckFromBoard(boardTitle: string, frames: CanvasFrame[], elements: CanvasElement[], themeId = 'clean'): Deck {
  const theme = getTheme(themeId);
  const slides: Slide[] = [newSlide('title', theme, { title: boardTitle || 'Apresentação', subtitle: 'Gerado a partir do quadro no Diorfy' })];

  if (frames.length > 0) {
    [...frames]
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .forEach((frame) => slides.push(slideFromGroup(frame.title || 'Sem título', elements.filter((el) => inFrame(frame, el)), theme)));
  } else {
    const stickies = elements.filter((el) => el.type === 'sticky' && textOf(el));
    const others = elements.filter((el) => el.type !== 'sticky');
    if (stickies.length > 0) slides.push(slideFromGroup('Ideias do quadro', stickies, theme));
    if (others.some((el) => textOf(el) || el.type === 'image')) slides.push(slideFromGroup('Pontos principais', others, theme));
  }

  slides.push(newSlide('section', theme, { title: 'Obrigado!', subtitle: 'Perguntas?' }));
  return { version: 2, themeId: theme.id, slides };
}

/** Accepts whatever is stored on the board (new deck, old v1 slide list or nothing) */
export function loadDeck(saved: unknown): Deck | null {
  if (!saved) return null;
  if (typeof saved === 'object' && !Array.isArray(saved) && (saved as Deck).version === 2) return saved as Deck;
  if (Array.isArray(saved) && saved.length > 0) {
    // Migrate the previous template-based slides
    const theme = getTheme('clean');
    const deck = emptyDeck();
    deck.slides = saved.map((old: any) => {
      const points: string[] = [...(old.points || []), ...((old.cards || []).map((c: any) => c.title))].filter(Boolean);
      const slide = newSlide(points.length > 0 ? 'title-content' : 'title', theme, {
        title: old.title || 'Slide',
        subtitle: old.subtitle,
        body: points.join('\n') || old.subtitle,
      });
      return { ...slide, notes: old.notes || '' };
    });
    return deck;
  }
  return null;
}

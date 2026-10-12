// PowerPoint-style deck model. Coordinates are in slide units (1280 x 720, 16:9).

export const SLIDE_W = 1280;
export const SLIDE_H = 720;

export type SlideShape =
  | 'rect'
  | 'rounded'
  | 'ellipse'
  | 'triangle'
  | 'diamond'
  | 'arrow'
  | 'star'
  | 'line';

export type SlideTransition = 'none' | 'fade' | 'slide' | 'zoom';

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color: string;
  align: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  list?: 'none' | 'bullet' | 'number';
  lineHeight?: number;
}

export interface SlideElement {
  id: string;
  type: 'text' | 'shape' | 'image';
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  opacity?: number;
  /** text content (text boxes and shapes); lines separated by \n */
  text?: string;
  textStyle?: TextStyle;
  /** shapes */
  shape?: SlideShape;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  /** images */
  src?: string;
  /** placeholder role from the layout (title/body) */
  role?: 'title' | 'subtitle' | 'body';
}

export interface Slide {
  id: string;
  background: string; // css color or gradient
  elements: SlideElement[];
  notes: string;
  transition: SlideTransition;
}

export interface Deck {
  version: 2;
  themeId: string;
  slides: Slide[];
}

export const uid = (prefix = 'el') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

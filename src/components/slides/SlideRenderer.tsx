import React from 'react';
import { Slide, SlideElement, SlideShape, SLIDE_H, SLIDE_W, TextStyle } from './types';

// Shapes drawn in a 100x100 box, stretched to the element size
const SHAPE_POINTS: Partial<Record<SlideShape, string>> = {
  triangle: '50,0 100,100 0,100',
  diamond: '50,0 100,50 50,100 0,50',
  arrow: '0,30 62,30 62,0 100,50 62,100 62,70 0,70',
  star: '50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35',
};

export const ShapeGraphic: React.FC<{ el: SlideElement }> = ({ el }) => {
  const fill = el.fill ?? 'transparent';
  const stroke = el.stroke ?? 'none';
  const sw = el.strokeWidth ?? 0;
  if (el.shape === 'rect' || el.shape === 'rounded' || el.shape === 'ellipse' || !el.shape) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: fill,
          border: sw > 0 ? `${sw}px solid ${stroke}` : undefined,
          borderRadius: el.shape === 'ellipse' ? '50%' : el.shape === 'rounded' ? 24 : 0,
        }}
      />
    );
  }
  if (el.shape === 'line') {
    return (
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="100" y2="50" stroke={el.stroke ?? el.fill ?? '#334155'} strokeWidth={Math.max(sw, 4)} vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }
  return (
    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points={SHAPE_POINTS[el.shape]} fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
};

export function textCss(ts: TextStyle): React.CSSProperties {
  return {
    fontFamily: `'${ts.fontFamily}', system-ui, sans-serif`,
    fontSize: ts.fontSize,
    fontWeight: ts.bold ? 700 : 400,
    fontStyle: ts.italic ? 'italic' : 'normal',
    textDecoration: ts.underline ? 'underline' : 'none',
    color: ts.color,
    textAlign: ts.align,
    lineHeight: ts.lineHeight ?? 1.2,
  };
}

export const TextContent: React.FC<{ text: string; ts: TextStyle; placeholder?: boolean }> = ({ text, ts, placeholder }) => {
  const lines = text.split('\n');
  return (
    <div
      className="absolute inset-0 flex flex-col px-3 py-2 whitespace-pre-wrap break-words"
      style={{
        ...textCss(ts),
        justifyContent: ts.valign === 'middle' ? 'center' : ts.valign === 'bottom' ? 'flex-end' : 'flex-start',
        opacity: placeholder ? 0.45 : 1,
      }}
    >
      {lines.map((line, i) =>
        ts.list && ts.list !== 'none' && line.trim() !== '' ? (
          <div key={i} className="flex gap-[0.5em]" style={{ justifyContent: ts.align === 'center' ? 'center' : ts.align === 'right' ? 'flex-end' : 'flex-start' }}>
            <span className="shrink-0">{ts.list === 'number' ? `${lines.slice(0, i + 1).filter((l) => l.trim()).length}.` : '•'}</span>
            <span>{line}</span>
          </div>
        ) : (
          <div key={i}>{line || ' '}</div>
        )
      )}
    </div>
  );
};

export const ElementView: React.FC<{ el: SlideElement; hideText?: boolean }> = ({ el, hideText }) => (
  <div
    className="absolute"
    style={{
      left: el.x,
      top: el.y,
      width: el.w,
      height: el.h,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      opacity: el.opacity ?? 1,
    }}
  >
    {el.type === 'shape' && <ShapeGraphic el={el} />}
    {el.type === 'image' && el.src && (
      <img src={el.src} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover rounded-sm select-none" />
    )}
    {!hideText && el.text !== undefined && el.textStyle && (el.type === 'text' || el.text) && (
      <TextContent text={el.text} ts={el.textStyle} />
    )}
  </div>
);

/** Renders a slide at a given pixel width (keeps 16:9) */
export const SlideRenderer: React.FC<{
  slide: Slide;
  width: number;
  className?: string;
  hideTextOf?: string | null;
  children?: React.ReactNode;
}> = ({ slide, width, className = '', hideTextOf, children }) => {
  const scale = width / SLIDE_W;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height: SLIDE_H * scale }}>
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${scale})`, background: slide.background }}
      >
        {slide.elements.map((el) => (
          <ElementView key={el.id} el={el} hideText={hideTextOf === el.id} />
        ))}
        {children}
      </div>
    </div>
  );
};

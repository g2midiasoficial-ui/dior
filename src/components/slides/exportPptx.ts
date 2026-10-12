import { Deck, SlideElement, SLIDE_H, SLIDE_W } from './types';

// PowerPoint 16:9 slide is 13.333 x 7.5 inches
const IN_W = 13.333;
const PX_TO_IN = IN_W / SLIDE_W;
const PX_TO_PT = (IN_W * 72) / SLIDE_W; // font px (slide units) -> points

const hex = (c?: string) => {
  if (!c || c === 'transparent') return undefined;
  const m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return undefined;
  const h = m[1].length === 3 ? m[1].split('').map((x) => x + x).join('') : m[1];
  return h.toUpperCase();
};

// Gradients can't be expressed directly: use the first color of the gradient
const firstColor = (bg: string) => hex(bg) ?? hex(bg.match(/#[0-9a-f]{6}|#[0-9a-f]{3}/i)?.[0]) ?? 'FFFFFF';

const pos = (el: SlideElement) => ({
  x: el.x * PX_TO_IN,
  y: el.y * PX_TO_IN,
  w: el.w * PX_TO_IN,
  h: el.h * PX_TO_IN,
  rotate: el.rotation || undefined,
});

export async function exportDeckToPptx(deck: Deck, fileName: string) {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = fileName;

  const shapeMap: Record<string, any> = {
    rect: pptx.ShapeType.rect,
    rounded: pptx.ShapeType.roundRect,
    ellipse: pptx.ShapeType.ellipse,
    triangle: pptx.ShapeType.triangle,
    diamond: pptx.ShapeType.diamond,
    arrow: pptx.ShapeType.rightArrow,
    star: pptx.ShapeType.star5,
    line: pptx.ShapeType.line,
  };

  for (const s of deck.slides) {
    const slide = pptx.addSlide();
    slide.background = { color: firstColor(s.background) };
    if (s.notes) slide.addNotes(s.notes);

    for (const el of s.elements) {
      const p = pos(el);
      const ts = el.textStyle;
      const textOpts = ts
        ? {
            fontFace: ts.fontFamily,
            fontSize: Math.max(6, Math.round(ts.fontSize * PX_TO_PT)),
            bold: !!ts.bold,
            italic: !!ts.italic,
            underline: ts.underline ? { style: 'sng' as const } : undefined,
            color: hex(ts.color) ?? '000000',
            align: ts.align,
            valign: ts.valign ?? 'top',
            lineSpacingMultiple: ts.lineHeight ?? 1.2,
          }
        : {};
      const runs = (text: string) =>
        text.split('\n').map((line) => ({
          text: line,
          options: {
            breakLine: true,
            bullet: ts?.list === 'bullet' && line.trim() ? true : ts?.list === 'number' && line.trim() ? { type: 'number' as const } : false,
          },
        }));

      if (el.type === 'image' && el.src) {
        slide.addImage({ ...p, ...(el.src.startsWith('data:') ? { data: el.src } : { path: el.src }) });
      } else if (el.type === 'shape') {
        const shapeOpts = {
          ...p,
          fill: hex(el.fill) ? { color: hex(el.fill)! } : { type: 'none' as const },
          line: hex(el.stroke) && (el.strokeWidth ?? 0) > 0 ? { color: hex(el.stroke)!, width: (el.strokeWidth ?? 1) * PX_TO_PT } : el.shape === 'line' ? { color: hex(el.stroke ?? el.fill) ?? '334155', width: 3 } : undefined,
          rectRadius: el.shape === 'rounded' ? 0.15 : undefined,
        };
        if (el.text && ts) slide.addText(runs(el.text), { ...shapeOpts, ...textOpts, shape: shapeMap[el.shape ?? 'rect'] });
        else slide.addShape(shapeMap[el.shape ?? 'rect'], shapeOpts);
      } else if (el.type === 'text' && el.text !== undefined && ts) {
        slide.addText(runs(el.text), { ...p, ...textOpts, margin: 6 });
      }
    }
  }

  await pptx.writeFile({ fileName: `${fileName.replace(/[\\/:*?"<>|]+/g, '-') || 'apresentacao'}.pptx` });
}

export { SLIDE_H };

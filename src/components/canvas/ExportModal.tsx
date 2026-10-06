import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Layers, 
  Sparkles, 
  Check, 
  FileDown, 
  Printer, 
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import { BoardItem, CanvasElement, CanvasFrame } from '../../types/miro';
import { playSound } from '../../utils/soundEffects';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: BoardItem;
  elements: CanvasElement[];
  frames: CanvasFrame[];
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onShowToast: (message: string, emoji?: string) => void;
}

// Helper: Word wrap text for Canvas 2D
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(' ');
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
  }
  return lines;
}

// Helper: Draw rounded rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  board,
  elements,
  frames,
  canvasRef,
  onShowToast,
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | 'json'>('pdf');
  const [pdfOrientation, setPdfOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [pdfQuality, setPdfQuality] = useState<number>(2); // 1 = 1x, 2 = 2x HD (Padrão), 3 = 3x (300 DPI)
  const [includeBackground, setIncludeBackground] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  // --- Robust High-DPI Canvas Generator ---
  const generateRenderedCanvas = async (scale: number): Promise<HTMLCanvasElement> => {
    // 1. Compute bounding box of content
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    if (frames.length > 0) {
      frames.forEach((f) => {
        minX = Math.min(minX, f.x);
        minY = Math.min(minY, f.y);
        maxX = Math.max(maxX, f.x + f.width);
        maxY = Math.max(maxY, f.y + f.height);
      });
    }

    if (elements.length > 0) {
      elements.forEach((e) => {
        if (e.type === 'connector') return;
        minX = Math.min(minX, e.x);
        minY = Math.min(minY, e.y);
        maxX = Math.max(maxX, e.x + (e.width || 100));
        maxY = Math.max(maxY, e.y + (e.height || 100));
      });
    }

    // Default fallback if canvas is empty
    if (!isFinite(minX) || !isFinite(minY)) {
      minX = 0;
      minY = 0;
      maxX = 1200;
      maxY = 800;
    }

    const padding = 60;
    const contentWidth = Math.max(800, maxX - minX + padding * 2);
    const contentHeight = Math.max(600, maxY - minY + padding * 2);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(contentWidth * scale);
    canvas.height = Math.round(contentHeight * scale);

    const ctx = canvas.getContext('2d', { alpha: !includeBackground });
    if (!ctx) throw new Error('Could not create Canvas 2D context');

    ctx.scale(scale, scale);

    // Translate to align content with padding
    const originX = minX - padding;
    const originY = minY - padding;

    // Background
    if (includeBackground) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, contentWidth, contentHeight);

      // Draw subtle grid dots
      ctx.fillStyle = '#cbd5e1';
      for (let x = 20; x < contentWidth; x += 30) {
        for (let y = 20; y < contentHeight; y += 30) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // LAYER 0: FRAMES
    for (const frame of frames) {
      const fx = frame.x - originX;
      const fy = frame.y - originY;

      ctx.fillStyle = frame.backgroundColor || '#ffffff';
      drawRoundedRect(ctx, fx, fy, frame.width, frame.height, 16);
      ctx.fill();

      ctx.strokeStyle = frame.borderColor || '#94a3b8';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, fx, fy, frame.width, frame.height, 16);
      ctx.stroke();

      // Frame title badge
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(frame.title || 'Quadro', fx + 16, fy - 10);
    }

    // LAYER 1: CONNECTORS & LINES
    for (const el of elements) {
      if (el.type === 'connector' && el.style) {
        const src = elements.find((e) => e.id === el.style?.sourceId);
        const tgt = elements.find((e) => e.id === el.style?.targetId);
        if (src && tgt) {
          const x1 = src.x + src.width / 2 - originX;
          const y1 = src.y + src.height / 2 - originY;
          const x2 = tgt.x + tgt.width / 2 - originX;
          const y2 = tgt.y + tgt.height / 2 - originY;

          ctx.beginPath();
          ctx.strokeStyle = el.style.color || '#3b82f6';
          ctx.lineWidth = el.style.strokeWidth || 3;
          ctx.lineCap = 'round';

          if (el.style.connectorType === 'curved') {
            const cx = (x1 + x2) / 2;
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
          } else {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
          ctx.stroke();

          // Arrowhead tip
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const headLen = 12;
          ctx.beginPath();
          ctx.fillStyle = el.style.color || '#3b82f6';
          ctx.moveTo(x2, y2);
          ctx.lineTo(
            x2 - headLen * Math.cos(angle - Math.PI / 6),
            y2 - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            x2 - headLen * Math.cos(angle + Math.PI / 6),
            y2 - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
      }

      // Freehand Draw Paths
      if (el.type === 'draw' && el.style?.points && el.style.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = el.style.color || '#3b82f6';
        ctx.lineWidth = el.style.strokeWidth || 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const pts = el.style.points;
        ctx.moveTo(pts[0].x - originX, pts[0].y - originY);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x - originX, pts[i].y - originY);
        }
        ctx.stroke();
      }
    }

    // LAYER 2: ELEMENTS (Sticky Notes, Shapes, Texts, Images, Funnels)
    for (const el of elements) {
      const ex = el.x - originX;
      const ey = el.y - originY;
      const ew = el.width || 180;
      const eh = el.height || 140;

      // --- STICKY NOTE ---
      if (el.type === 'sticky') {
        const bgColor = el.style?.backgroundColor || '#fef08a';
        const textColor = el.style?.color || '#0f172a';
        const fontSize = el.style?.fontSize || 15;

        // Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = bgColor;
        drawRoundedRect(ctx, ex, ey, ew, eh, 12);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Sticky text
        ctx.fillStyle = textColor;
        ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
        const lines = wrapText(ctx, el.content || '', ew - 24);
        let textY = ey + 24;
        for (const line of lines.slice(0, 7)) {
          ctx.fillText(line, ex + 14, textY);
          textY += fontSize * 1.35;
        }

        // Author tag if present
        if (el.style?.author) {
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(el.style.author, ex + 14, ey + eh - 12);
        }
      }

      // --- SHAPE ELEMENT ---
      else if (el.type === 'shape') {
        const bgColor = el.style?.backgroundColor || '#ffffff';
        const borderColor = el.style?.borderColor || '#3b82f6';
        const textColor = el.style?.color || '#0f172a';
        const fontSize = el.style?.fontSize || 14;
        const shapeType = el.style?.shapeType || 'rectangle';

        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = el.style?.borderWidth || 2;

        if (shapeType === 'circle') {
          ctx.beginPath();
          ctx.arc(ex + ew / 2, ey + eh / 2, Math.min(ew, eh) / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (shapeType === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(ex + ew / 2, ey);
          ctx.lineTo(ex + ew, ey + eh / 2);
          ctx.lineTo(ex + ew / 2, ey + eh);
          ctx.lineTo(ex, ey + eh / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          drawRoundedRect(ctx, ex, ey, ew, eh, shapeType === 'rounded' ? 16 : 6);
          ctx.fill();
          ctx.stroke();
        }

        // Shape centered text
        if (el.content) {
          ctx.fillStyle = textColor;
          ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
          ctx.textAlign = 'center';
          const lines = wrapText(ctx, el.content, ew - 20);
          const totalTextHeight = lines.length * (fontSize * 1.3);
          let textY = ey + (eh - totalTextHeight) / 2 + fontSize;
          for (const line of lines) {
            ctx.fillText(line, ex + ew / 2, textY);
            textY += fontSize * 1.3;
          }
          ctx.textAlign = 'left';
        }
      }

      // --- TEXT ELEMENT ---
      else if (el.type === 'text') {
        const textColor = el.style?.color || '#0f172a';
        const fontSize = el.style?.fontSize || 20;
        const fontWeight = el.style?.fontWeight === 'bold' ? 'bold' : '600';

        ctx.fillStyle = textColor;
        ctx.font = `${fontWeight} ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
        const lines = wrapText(ctx, el.content || 'Texto', ew);
        let textY = ey + fontSize;
        for (const line of lines) {
          ctx.fillText(line, ex, textY);
          textY += fontSize * 1.35;
        }
      }

      // --- IMAGE ELEMENT ---
      else if (el.type === 'image' && el.style?.imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = el.style.imageUrl;

          await new Promise<void>((resolve) => {
            if (img.complete) resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });

          if (img.width > 0 && img.height > 0) {
            drawRoundedRect(ctx, ex, ey, ew, eh, 12);
            ctx.save();
            ctx.clip();
            ctx.drawImage(img, ex, ey, ew, eh);
            ctx.restore();
          }
        } catch {
          // Fallback placeholder box
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(ex, ey, ew, eh);
        }
      }

      // --- FUNNEL / WIREFRAME ELEMENTS ---
      else if (
        el.type === 'funnel-page' ||
        el.type === 'traffic-source' ||
        el.type === 'funnel-action'
      ) {
        ctx.fillStyle = '#ffffff';
        drawRoundedRect(ctx, ex, ey, ew, eh, 16);
        ctx.fill();

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        drawRoundedRect(ctx, ex, ey, ew, eh, 16);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(el.content || 'Etapa do Funil', ex + 14, ey + 28);
      }
    }

    return canvas;
  };

  // --- PDF Export Handler ---
  const handleExportPDF = async () => {
    setIsExporting(true);
    setStatusMessage('Desenhando elementos em alta definição...');
    playSound.click();

    try {
      // 1. Render high-DPI canvas directly
      const canvas = await generateRenderedCanvas(pdfQuality);
      setStatusMessage('Gerando documento PDF...');

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // 2. Setup jsPDF A4 Document
      const pdf = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgRatio = imgProps.width / imgProps.height;

      let finalWidth = pageWidth;
      let finalHeight = pageWidth / imgRatio;

      if (finalHeight > pageHeight) {
        finalHeight = pageHeight;
        finalWidth = pageHeight * imgRatio;
      }

      const posX = (pageWidth - finalWidth) / 2;
      const posY = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');

      const fileName = `${(board.title || 'quadro').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-diorfy.pdf`;

      // 3. Multi-layer Download Trigger (jsPDF .save + Blob Object URL + fallback)
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      playSound.success();
      onShowToast('PDF baixado com sucesso!', '📄');
      onClose();
    } catch (err) {
      console.error('PDF export error:', err);
      onShowToast('Ocorreu um erro ao gerar o PDF.', '❌');
    } finally {
      setIsExporting(false);
      setStatusMessage('');
    }
  };

  // --- PNG Image Export Handler ---
  const handleExportPNG = async () => {
    setIsExporting(true);
    setStatusMessage('Renderizando imagem PNG HD...');
    playSound.click();

    try {
      const canvas = await generateRenderedCanvas(pdfQuality);
      const link = document.createElement('a');
      link.download = `${(board.title || 'quadro').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-hd.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      playSound.success();
      onShowToast('Imagem PNG baixada com sucesso!', '🖼️');
      onClose();
    } catch (err) {
      console.error('PNG export error:', err);
      onShowToast('Erro ao exportar PNG', '❌');
    } finally {
      setIsExporting(false);
      setStatusMessage('');
    }
  };

  // --- JSON Backup Export Handler ---
  const handleExportJSON = () => {
    playSound.success();
    const exportData = {
      ...board,
      elements,
      frames,
      exportedAt: new Date().toISOString(),
      version: '4.0',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(board.title || 'quadro').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-diorfy.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Arquivo Diorfy JSON salvo!', '💾');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Exportar & Baixar Quadro</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{board.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Format Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Selecione o Formato:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* PDF Option */}
              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setExportFormat('pdf');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportFormat === 'pdf'
                    ? 'border-blue-600 bg-blue-50/70 ring-4 ring-blue-500/10 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Documento PDF</p>
                  <p className="text-[10px] text-slate-500">Impressão & A4</p>
                </div>
              </button>

              {/* PNG Option */}
              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setExportFormat('png');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportFormat === 'png'
                    ? 'border-blue-600 bg-blue-50/70 ring-4 ring-blue-500/10 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Imagem PNG</p>
                  <p className="text-[10px] text-slate-500">Ultra HD 2x/3x</p>
                </div>
              </button>

              {/* JSON Option */}
              <button
                type="button"
                onClick={() => {
                  playSound.click();
                  setExportFormat('json');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportFormat === 'json'
                    ? 'border-blue-600 bg-blue-50/70 ring-4 ring-blue-500/10 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Diorfy JSON</p>
                  <p className="text-[10px] text-slate-500">Backup Completo</p>
                </div>
              </button>
            </div>
          </div>

          {/* PDF Customization Settings */}
          {exportFormat === 'pdf' && (
            <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Orientação do Documento:</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setPdfOrientation('landscape')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfOrientation === 'landscape' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Paisagem (A4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfOrientation('portrait')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfOrientation === 'portrait' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Retrato (A4)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-xs font-bold text-slate-800">Qualidade & Nitidez:</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setPdfQuality(1)}
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfQuality === 1 ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Padrão
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfQuality(2)}
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfQuality === 2 ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    2x Ultra HD
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfQuality(3)}
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfQuality === 3 ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    300 DPI Print
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBackground}
                    onChange={(e) => setIncludeBackground(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  <span>Incluir fundo branco limpo no PDF</span>
                </label>
              </div>
            </div>
          )}

          {/* PNG Settings */}
          {exportFormat === 'png' && (
            <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Resolução da Imagem:</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setPdfQuality(1)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfQuality === 1 ? 'bg-emerald-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    1x
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfQuality(2)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfQuality === 2 ? 'bg-emerald-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    2x Ultra HD
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfQuality(3)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfQuality === 3 ? 'bg-emerald-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    3x Máxima
                  </button>
                </div>
              </div>

              <label className="text-xs font-medium text-slate-700 flex items-center gap-2 cursor-pointer pt-1 border-t border-slate-200/60">
                <input
                  type="checkbox"
                  checked={includeBackground}
                  onChange={(e) => setIncludeBackground(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>Fundo branco sólido (desmarque para transparente)</span>
              </label>
            </div>
          )}

          {/* Progress / Status feedback */}
          {isExporting && statusMessage && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          {exportFormat === 'pdf' && (
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportPDF}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/25 hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Processando PDF...' : 'Baixar Quadro em PDF'}</span>
            </button>
          )}

          {exportFormat === 'png' && (
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportPNG}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isExporting ? 'Processando PNG...' : 'Baixar Imagem PNG'}</span>
            </button>
          )}

          {exportFormat === 'json' && (
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 hover:bg-blue-700 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo JSON</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

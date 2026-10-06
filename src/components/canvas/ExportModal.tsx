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
  CheckCircle2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  board,
  elements,
  frames,
  canvasRef,
  onShowToast,
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | 'json' | 'svg'>('pdf');
  const [pdfOrientation, setPdfOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [pdfQuality, setPdfQuality] = useState<number>(2); // 1 = standard, 2 = 2x HD, 3 = 300 DPI Print
  const [includeBackground, setIncludeBackground] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportScope, setExportScope] = useState<'all' | 'frames'>('all');

  if (!isOpen) return null;

  // --- PDF Export Handler ---
  const handleExportPDF = async () => {
    setIsExporting(true);
    playSound.click();

    try {
      if (!canvasRef.current) {
        throw new Error('Canvas element not found');
      }

      // Calculate bounding box of all elements on canvas
      if (elements.length === 0 && frames.length === 0) {
        onShowToast('O quadro está vazio para exportar', '⚠️');
        setIsExporting(false);
        return;
      }

      const minX = Math.min(
        ...elements.map((e) => e.x),
        ...frames.map((f) => f.x),
        0
      );
      const minY = Math.min(
        ...elements.map((e) => e.y),
        ...frames.map((f) => f.y),
        0
      );
      const maxX = Math.max(
        ...elements.map((e) => e.x + e.width),
        ...frames.map((f) => f.x + f.width),
        800
      );
      const maxY = Math.max(
        ...elements.map((e) => e.y + e.height),
        ...frames.map((f) => f.y + f.height),
        600
      );

      const padding = 60;
      const captureWidth = Math.max(800, maxX - minX + padding * 2);
      const captureHeight = Math.max(600, maxY - minY + padding * 2);

      // Render high-DPI canvas
      const canvas = await html2canvas(canvasRef.current, {
        scale: pdfQuality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: includeBackground ? '#ffffff' : null,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      // Create PDF using jsPDF
      const pdf = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate aspect ratio fit
      const imgProps = pdf.getImageProperties(imgData);
      const imgRatio = imgProps.width / imgProps.height;
      const pageRatio = pageWidth / pageHeight;

      let finalWidth = pageWidth;
      let finalHeight = pageWidth / imgRatio;

      if (finalHeight > pageHeight) {
        finalHeight = pageHeight;
        finalWidth = pageHeight * imgRatio;
      }

      const posX = (pageWidth - finalWidth) / 2;
      const posY = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');
      
      const fileName = `${board.title.replace(/\s+/g, '-').toLowerCase()}-diorfy.pdf`;
      pdf.save(fileName);

      playSound.success();
      onShowToast('PDF de alta qualidade gerado com sucesso!', '📄');
      onClose();
    } catch (err) {
      console.error('PDF export error:', err);
      onShowToast('Erro ao gerar PDF. Tente com qualidade padrão.', '❌');
    } finally {
      setIsExporting(false);
    }
  };

  // --- PNG Image Export ---
  const handleExportPNG = async () => {
    setIsExporting(true);
    playSound.click();

    try {
      if (!canvasRef.current) return;

      const canvas = await html2canvas(canvasRef.current, {
        scale: pdfQuality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: includeBackground ? '#ffffff' : null,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${board.title.replace(/\s+/g, '-').toLowerCase()}-alta-resolucao.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      link.remove();

      playSound.success();
      onShowToast('Imagem PNG exportada em alta resolução!', '🖼️');
      onClose();
    } catch (err) {
      console.error('PNG export error:', err);
      onShowToast('Erro ao exportar PNG', '❌');
    } finally {
      setIsExporting(false);
    }
  };

  // --- JSON Backup Export ---
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
    link.download = `${board.title.replace(/\s+/g, '-').toLowerCase()}-diorfy.json`;
    link.click();
    link.remove();
    onShowToast('Arquivo Diorfy JSON salvo!', '💾');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
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
              Selecione o Formato de Exportação:
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
                  <p className="text-[10px] text-slate-500">Impressão & Vetor</p>
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
                <span className="text-xs font-bold text-slate-800">Orientação da Página:</span>
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
                <span className="text-xs font-bold text-slate-800">Nitidez das Letras & Resolução:</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setPdfQuality(1)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfQuality === 1 ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Padrão
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfQuality(2)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      pdfQuality === 2 ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    2x HD
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfQuality(3)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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

          {/* PNG Customization Settings */}
          {exportFormat === 'png' && (
            <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Resolução da Imagem:</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setPdfQuality(1)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      pdfQuality === 1 ? 'bg-emerald-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    1x
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfQuality(2)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      pdfQuality === 2 ? 'bg-emerald-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    2x Ultra HD
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfQuality(3)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
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
                <span>Fundo branco sólido (desmarque para fundo transparente)</span>
              </label>
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Gerando PDF em Alta Resolução...' : 'Baixar Quadro em PDF'}</span>
            </button>
          )}

          {exportFormat === 'png' && (
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportPNG}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isExporting ? 'Renderizando Imagem...' : 'Baixar Imagem PNG HD'}</span>
            </button>
          )}

          {exportFormat === 'json' && (
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
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

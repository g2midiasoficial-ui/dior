import React, { useState } from 'react';
import { CanvasElement } from '../../types/miro';
import {
  ArrowRight,
  CornerDownRight,
  TrendingUp,
  Minus,
  MoveHorizontal,
  Circle,
  Sparkles,
  Palette,
  Check,
  Type,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';

interface ConnectorOptionsBarProps {
  selectedConnector?: CanvasElement;
  onUpdateStyle: (styleUpdates: Partial<CanvasElement['style']>) => void;
  onUpdateContent?: (id: string, content: string) => void;
  onDelete?: () => void;
  isManualConnecting?: boolean;
  onToggleManualConnect?: () => void;
  onClose?: () => void;
}

export const ConnectorOptionsBar: React.FC<ConnectorOptionsBarProps> = ({
  selectedConnector,
  onUpdateStyle,
  onUpdateContent,
  onDelete,
  isManualConnecting,
  onToggleManualConnect,
  onClose,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customHex, setCustomHex] = useState('');
  const [labelText, setLabelText] = useState(selectedConnector?.content || '');
  const [showLabelInput, setShowLabelInput] = useState(false);

  const colors = [
    { name: 'Azul', hex: '#3b82f6' },
    { name: 'Verde', hex: '#22c55e' },
    { name: 'Vermelho', hex: '#ef4444' },
    { name: 'Roxo', hex: '#a855f7' },
    { name: 'Laranja', hex: '#f97316' },
    { name: 'Âmbar', hex: '#eab308' },
    { name: 'Ciano', hex: '#06b6d4' },
    { name: 'Rosa', hex: '#ec4899' },
    { name: 'Preto', hex: '#0f172a' },
    { name: 'Cinza', hex: '#64748b' },
  ];

  const strokeWidths = [
    { label: 'Fina', value: 1.5 },
    { label: 'Normal', value: 2.5 },
    { label: 'Média', value: 4 },
    { label: 'Grossa', value: 6 },
    { label: 'Extra', value: 9 },
  ];

  const currentColor = selectedConnector?.style.color || '#3b82f6';
  const currentWidth = selectedConnector?.style.strokeWidth || 2.5;
  const currentType = selectedConnector?.style.connectorType || 'curved';
  const currentBorder = selectedConnector?.style.borderStyle || 'solid';
  const currentEnd = selectedConnector?.style.arrowEnd || 'arrow';
  const currentStart = selectedConnector?.style.arrowStart || 'none';

  const handleApplyHex = (e: React.FormEvent) => {
    e.preventDefault();
    if (customHex.trim()) {
      const hex = customHex.startsWith('#') ? customHex : `#${customHex}`;
      onUpdateStyle({ color: hex });
      setShowColorPicker(false);
      playSound.pop();
    }
  };

  const handleSaveLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedConnector && onUpdateContent) {
      onUpdateContent(selectedConnector.id, labelText.trim());
      setShowLabelInput(false);
      playSound.pop();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-2 flex items-center gap-2 text-slate-800 animate-in slide-in-from-bottom-4 duration-200 select-none max-w-[95vw] overflow-x-auto">
      {/* Title / Badge */}
      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold shrink-0">
        <ArrowRight className="w-3.5 h-3.5" />
        <span>Opções de Seta</span>
      </div>

      <div className="h-4 w-px bg-slate-200 shrink-0" />

      {/* 1. TIPO DE TRAÇADO (Reta, Curva, Ortogonal) */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-xl shrink-0">
        <button
          onClick={() => {
            onUpdateStyle({ connectorType: 'curved' });
            playSound.click();
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            currentType === 'curved' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Seta Curva Suave"
        >
          <span>Curva</span>
        </button>

        <button
          onClick={() => {
            onUpdateStyle({ connectorType: 'straight' });
            playSound.click();
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            currentType === 'straight' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Seta Reta Direta"
        >
          <span>Reta</span>
        </button>

        <button
          onClick={() => {
            onUpdateStyle({ connectorType: 'orthogonal' });
            playSound.click();
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            currentType === 'orthogonal' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Seta Ortogonal (Ângulo Reto 90°)"
        >
          <span>90°</span>
        </button>
      </div>

      {/* 2. ESPESSURA / TAMANHO DA SETA */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-xl shrink-0">
        {strokeWidths.map((w) => (
          <button
            key={w.value}
            onClick={() => {
              onUpdateStyle({ strokeWidth: w.value });
              playSound.click();
            }}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentWidth === w.value ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title={`Espessura ${w.label} (${w.value}px)`}
          >
            {w.value}px
          </button>
        ))}
      </div>

      {/* 3. ESTILO DO TRAÇO (Sólido, Tracejado, Pontilhado) */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-xl shrink-0">
        <button
          onClick={() => {
            onUpdateStyle({ borderStyle: 'solid' });
            playSound.click();
          }}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentBorder === 'solid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Linha Contínua / Sólida"
        >
          ───
        </button>
        <button
          onClick={() => {
            onUpdateStyle({ borderStyle: 'dashed' });
            playSound.click();
          }}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentBorder === 'dashed' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Linha Tracejada"
        >
          - - -
        </button>
        <button
          onClick={() => {
            onUpdateStyle({ borderStyle: 'dotted' });
            playSound.click();
          }}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentBorder === 'dotted' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Linha Pontilhada"
        >
          ······
        </button>
      </div>

      {/* 4. TIPO DA PONTA (Seta simples, dupla, bolinha, nenhuma) */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-xl shrink-0">
        <button
          onClick={() => {
            onUpdateStyle({ arrowStart: 'none', arrowEnd: 'arrow' });
            playSound.click();
          }}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentEnd === 'arrow' && currentStart === 'none' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
          title="Ponta: Seta simples (➔)"
        >
          ➔
        </button>
        <button
          onClick={() => {
            onUpdateStyle({ arrowStart: 'arrow', arrowEnd: 'arrow' });
            playSound.click();
          }}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentEnd === 'arrow' && currentStart === 'arrow' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
          title="Ponta: Seta Dupla (⇄)"
        >
          ⇄
        </button>
        <button
          onClick={() => {
            onUpdateStyle({ arrowStart: 'none', arrowEnd: 'dot' });
            playSound.click();
          }}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentEnd === 'dot' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
          title="Ponta: Ponto circular (●)"
        >
          ●
        </button>
        <button
          onClick={() => {
            onUpdateStyle({ arrowStart: 'none', arrowEnd: 'none' });
            playSound.click();
          }}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentEnd === 'none' && currentStart === 'none' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
          }`}
          title="Sem ponta (Linha)"
        >
          ─
        </button>
      </div>

      {/* 5. PALETA DE CORES DA SETA */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-semibold"
          title="Escolher Cor da Seta"
        >
          <div
            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
            style={{ backgroundColor: currentColor }}
          />
          <Palette className="w-3 h-3 text-slate-500" />
        </button>

        {showColorPicker && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 w-52 animate-in fade-in">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Cor da Seta
            </span>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    onUpdateStyle({ color: c.hex });
                    setShowColorPicker(false);
                    playSound.pop();
                  }}
                  className="w-7 h-7 rounded-lg border border-black/10 hover:scale-115 active:scale-95 transition-transform flex items-center justify-center cursor-pointer shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {currentColor === c.hex && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
            <form onSubmit={handleApplyHex} className="flex items-center gap-1 pt-1.5 border-t border-slate-100">
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 text-[11px] font-mono border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 6. RÓTULO DE TEXTO NA SETA */}
      {selectedConnector && (
        <div className="relative shrink-0">
          {showLabelInput ? (
            <form onSubmit={handleSaveLabel} className="flex items-center gap-1">
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                placeholder="Ex: 80% conv..."
                autoFocus
                className="text-xs border border-blue-500 rounded-xl px-2 py-1 outline-none w-28 font-semibold"
              />
              <button
                type="submit"
                className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
              >
                <Check className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setLabelText(selectedConnector.content || '');
                setShowLabelInput(true);
              }}
              className="px-2 py-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
              title="Adicionar ou editar texto/rótulo na seta"
            >
              <Type className="w-3 h-3 text-slate-500" />
              <span className="truncate max-w-[80px]">{selectedConnector.content || '+ Rótulo'}</span>
            </button>
          )}
        </div>
      )}

      {/* 7. BOTÃO DE EXCLUIR SETA */}
      {selectedConnector && onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
          title="Excluir seta"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Fechar barra */}
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg shrink-0"
          title="Fechar opções"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

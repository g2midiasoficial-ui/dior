import React, { useState } from 'react';
import { CanvasElement } from '../../types/miro';

interface TextElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent: (id: string, content: string) => void;
}

export const TextElement: React.FC<TextElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdateContent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);

  const fontSize = element.style.fontSize || 20;
  const color = element.style.color || '#0f172a';
  const fontWeight = element.style.fontWeight === 'bold' ? 700 : element.style.fontWeight === 'medium' ? 600 : 500;
  const textAlign = element.style.textAlign || 'left';
  const fontFamily = element.style.fontFamily || "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
  const fontStyle = element.style.fontStyle || 'normal';

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateContent(element.id, content);
  };

  return (
    <div
      onClick={onSelect}
      onDoubleClick={() => setIsEditing(true)}
      className={`absolute select-none p-2.5 rounded-xl transition-all cursor-move ${
        isSelected ? 'ring-2 ring-blue-600 shadow-sm bg-blue-50/20' : 'hover:outline-dashed hover:outline-1 hover:outline-slate-300'
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        minHeight: `${element.height}px`,
        zIndex: element.zIndex,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
    >
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="w-full bg-transparent border-none outline-none resize-none tracking-tight leading-snug"
          style={{
            fontSize: `${fontSize}px`,
            color: color,
            fontWeight: fontWeight,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            textAlign: textAlign,
            letterSpacing: '-0.02em',
          }}
        />
      ) : (
        <div
          className="whitespace-pre-wrap leading-snug break-words tracking-tight"
          style={{
            fontSize: `${fontSize}px`,
            color: color,
            fontWeight: fontWeight,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            textAlign: textAlign,
            letterSpacing: '-0.015em',
            textRendering: 'optimizeLegibility',
          }}
        >
          {element.content || 'Clique 2x para editar texto'}
        </div>
      )}
    </div>
  );
};

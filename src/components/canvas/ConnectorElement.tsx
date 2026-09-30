import React, { useState } from 'react';
import { CanvasElement } from '../../types/miro';

interface ConnectorElementProps {
  element: CanvasElement;
  sourceEl?: CanvasElement;
  targetEl?: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onDelete?: (id: string) => void;
  onUpdateContent?: (id: string, content: string) => void;
}

export const ConnectorElement: React.FC<ConnectorElementProps> = ({
  element,
  sourceEl,
  targetEl,
  isSelected,
  onSelect,
  onDelete,
  onUpdateContent,
}) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelText, setLabelText] = useState(element.content || '');

  // If connector is bound to a source or target that was removed, do not render
  if ((element.style?.sourceId && !sourceEl) || (element.style?.targetId && !targetEl)) {
    return null;
  }

  // Calculate source and target coordinates
  let startX = element.x;
  let startY = element.y;
  let endX = element.x + element.width;
  let endY = element.y + element.height;

  if (sourceEl) {
    const anchor = element.style.sourceAnchor || 'right';
    if (anchor === 'right') {
      startX = sourceEl.x + sourceEl.width;
      startY = sourceEl.y + sourceEl.height / 2;
    } else if (anchor === 'left') {
      startX = sourceEl.x;
      startY = sourceEl.y + sourceEl.height / 2;
    } else if (anchor === 'top') {
      startX = sourceEl.x + sourceEl.width / 2;
      startY = sourceEl.y;
    } else if (anchor === 'bottom') {
      startX = sourceEl.x + sourceEl.width / 2;
      startY = sourceEl.y + sourceEl.height;
    }
  }

  if (targetEl) {
    const anchor = element.style.targetAnchor || 'left';
    if (anchor === 'left') {
      endX = targetEl.x;
      endY = targetEl.y + targetEl.height / 2;
    } else if (anchor === 'right') {
      endX = targetEl.x + targetEl.width;
      endY = targetEl.y + targetEl.height / 2;
    } else if (anchor === 'top') {
      endX = targetEl.x + targetEl.width / 2;
      endY = targetEl.y;
    } else if (anchor === 'bottom') {
      endX = targetEl.x + targetEl.width / 2;
      endY = targetEl.y + targetEl.height;
    }
  }

  const strokeColor = element.style.color || '#3b82f6';
  const strokeWidth = element.style.strokeWidth || 2.5;
  const connectorType = element.style.connectorType || 'curved';
  const borderStyle = element.style.borderStyle || 'solid';
  const arrowEnd = element.style.arrowEnd ?? 'arrow';
  const arrowStart = element.style.arrowStart ?? 'none';

  // Construct path definition
  let pathD = `M ${startX} ${startY} L ${endX} ${endY}`;

  if (connectorType === 'orthogonal') {
    const midX = (startX + endX) / 2;
    pathD = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  } else if (connectorType === 'curved') {
    const dx = endX - startX;
    const dy = endY - startY;
    const cx1 = startX + dx * 0.5;
    const cy1 = startY;
    const cx2 = startX + dx * 0.5;
    const cy2 = endY;
    pathD = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
  }

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const markerEndId = `arrow-end-${element.id}`;
  const markerStartId = `arrow-start-${element.id}`;
  const dotMarkerId = `dot-${element.id}`;

  const getDashArray = () => {
    if (borderStyle === 'dashed') return `${strokeWidth * 3},${strokeWidth * 2}`;
    if (borderStyle === 'dotted') return `${strokeWidth},${strokeWidth * 2}`;
    return undefined;
  };

  const handleSaveLabel = () => {
    if (onUpdateContent) {
      onUpdateContent(element.id, labelText);
    }
    setIsEditingLabel(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(element.id);
    }
  };

  return (
    <g
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(e);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(e);
      }}
      className="cursor-pointer group select-none pointer-events-auto"
    >
      <defs>
        {/* End Arrow Marker */}
        <marker
          id={markerEndId}
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth={strokeWidth * 2.5 + 4}
          markerHeight={strokeWidth * 2.5 + 4}
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={isSelected ? '#2563eb' : strokeColor} />
        </marker>

        {/* Start Arrow Marker */}
        <marker
          id={markerStartId}
          viewBox="0 0 10 10"
          refX="2"
          refY="5"
          markerWidth={strokeWidth * 2.5 + 4}
          markerHeight={strokeWidth * 2.5 + 4}
          orient="auto"
        >
          <path d="M 9 1.5 L 0 5 L 9 8.5 z" fill={isSelected ? '#2563eb' : strokeColor} />
        </marker>

        {/* Dot Marker */}
        <marker
          id={dotMarkerId}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth={strokeWidth * 2 + 4}
          markerHeight={strokeWidth * 2 + 4}
        >
          <circle cx="5" cy="5" r="4" fill={isSelected ? '#2563eb' : strokeColor} />
        </marker>
      </defs>

      {/* Invisible extra-wide stroke for effortless clicking */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.max(28, strokeWidth + 24)}
        style={{ pointerEvents: 'stroke' }}
        className="cursor-pointer"
      />

      {/* Glow highlight when selected */}
      {isSelected && (
        <path
          d={pathD}
          fill="none"
          stroke="#93c5fd"
          strokeWidth={strokeWidth + 8}
          strokeOpacity={0.7}
          strokeLinecap="round"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Main connector path */}
      <path
        d={pathD}
        fill="none"
        stroke={isSelected ? '#2563eb' : strokeColor}
        strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={getDashArray()}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerStart={
          arrowStart === 'arrow'
            ? `url(#${markerStartId})`
            : arrowStart === 'dot'
            ? `url(#${dotMarkerId})`
            : undefined
        }
        markerEnd={
          arrowEnd === 'arrow'
            ? `url(#${markerEndId})`
            : arrowEnd === 'dot'
            ? `url(#${dotMarkerId})`
            : undefined
        }
        className="transition-colors group-hover:stroke-blue-500"
      />

      {/* Floating Action Badge & Label at Center */}
      <g transform={`translate(${midX}, ${midY})`} style={{ pointerEvents: 'auto' }}>
        {/* Floating Quick Delete & Edit Action Bar when Selected */}
        {isSelected && !isEditingLabel && (
          <g transform="translate(0, -32)" style={{ pointerEvents: 'auto' }}>
            {/* Background pill badge */}
            <rect
              x={-42}
              y={-14}
              width={84}
              height={28}
              rx={14}
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth={1.5}
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
            />
            
            {/* Edit Label Button */}
            <g
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingLabel(true);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="cursor-pointer group/btn"
              transform="translate(-20, 0)"
            >
              <circle cx={0} cy={0} r={10} fill="#f1f5f9" className="group-hover/btn:fill-blue-100 transition-colors" />
              {/* Pencil SVG icon */}
              <path
                d="M -4 3 L -3 4 L 3 -2 L 2 -3 Z M 3 -2 L 4 -3 L 3 -4 L 2 -3 Z"
                fill="#475569"
                className="group-hover/btn:fill-blue-600"
              />
            </g>

            {/* Divider */}
            <line x1={0} y1={-7} x2={0} y2={7} stroke="#e2e8f0" strokeWidth={1} />

            {/* Delete Button (Red Trash) */}
            <g
              onClick={handleDelete}
              onMouseDown={handleDelete}
              className="cursor-pointer group/del"
              transform="translate(20, 0)"
            >
              <circle cx={0} cy={0} r={10} fill="#fee2e2" className="group-hover/del:fill-rose-500 transition-colors" />
              {/* Trash SVG icon */}
              <path
                d="M -4 -3 L 4 -3 M -2 -3 L -2 -4 L 2 -4 L 2 -3 M -3 -1 L -2.5 4 L 2.5 4 L 3 -1"
                fill="none"
                stroke="#dc2626"
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover/del:stroke-white"
              />
            </g>
          </g>
        )}

        {/* Text Input when editing label */}
        {isEditingLabel ? (
          <foreignObject x={-75} y={-16} width={150} height={32} style={{ pointerEvents: 'auto' }}>
            <div className="flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onBlur={handleSaveLabel}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveLabel();
                  if (e.key === 'Escape') setIsEditingLabel(false);
                }}
                autoFocus
                placeholder="Texto do fluxo..."
                className="w-full text-xs font-bold text-center bg-white border-2 border-blue-500 rounded-lg px-1.5 py-0.5 shadow-md outline-none text-slate-900"
              />
            </div>
          </foreignObject>
        ) : (
          /* Normal Label Text Display */
          (element.content || isSelected) && (
            <g
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingLabel(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(e);
              }}
              className="cursor-pointer"
            >
              {element.content ? (
                <>
                  <rect
                    x={-(element.content.length * 4.2 + 10)}
                    y={-12}
                    width={element.content.length * 8.4 + 20}
                    height={24}
                    rx={12}
                    fill="#ffffff"
                    stroke={isSelected ? '#2563eb' : strokeColor}
                    strokeWidth={1.5}
                    className="shadow-sm"
                  />
                  <text
                    x={0}
                    y={4}
                    textAnchor="middle"
                    fill={isSelected ? '#2563eb' : strokeColor}
                    fontSize="11"
                    fontWeight="700"
                    className="select-none font-sans"
                  >
                    {element.content}
                  </text>
                </>
              ) : isSelected ? (
                <g
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingLabel(true);
                  }}
                >
                  <rect
                    x={-40}
                    y={-10}
                    width={80}
                    height={20}
                    rx={10}
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth={1}
                    strokeDasharray="2,2"
                  />
                  <text
                    x={0}
                    y={3.5}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9.5"
                    fontWeight="600"
                  >
                    + Rótulo
                  </text>
                </g>
              ) : null}
            </g>
          )
        )}
      </g>
    </g>
  );
};

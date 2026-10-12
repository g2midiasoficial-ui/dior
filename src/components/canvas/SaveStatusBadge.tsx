import React, { useEffect, useState } from 'react';
import { Cloud, CloudOff, Loader2, AlertTriangle } from 'lucide-react';
import { subscribeToSaveStatus, flushBoardSave, SaveStatus } from '../../services/dbService';

// Small "Salvando… / Salvo" indicator for the canvas top bar
export const SaveStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribeToSaveStatus((s, e) => {
    setStatus(s);
    setError(e);
  }), []);

  if (status === 'idle') return null;

  const config = {
    saving: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, label: 'Salvando…', cls: 'text-slate-500', title: 'Salvando alterações no banco de dados' },
    saved: { icon: <Cloud className="w-3.5 h-3.5" />, label: 'Salvo', cls: 'text-emerald-600', title: 'Todas as alterações estão salvas na nuvem' },
    local: { icon: <CloudOff className="w-3.5 h-3.5" />, label: 'Só neste navegador', cls: 'text-amber-600', title: 'Sem conexão com o banco: salvo apenas neste navegador' },
    error: { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'Erro ao salvar', cls: 'text-rose-600', title: `Não foi possível salvar na nuvem${error ? `: ${error}` : ''}. Clique para tentar de novo.` },
  }[status];

  return (
    <button
      type="button"
      onClick={() => status === 'error' && flushBoardSave()}
      className={`hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] font-semibold shrink-0 ${config.cls} ${
        status === 'error' ? 'hover:bg-rose-50 cursor-pointer' : 'cursor-default'
      }`}
      title={config.title}
    >
      {config.icon}
      <span>{config.label}</span>
    </button>
  );
};

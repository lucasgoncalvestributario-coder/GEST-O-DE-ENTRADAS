import React, { useState, useEffect } from 'react';
import { appStorage } from '../services/storage';
import {
  Cloud,
  Database,
  Download,
  Upload,
  Check,
  RefreshCw,
  X,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [syncState, setSyncState] = useState(appStorage.getSyncStatus());
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSyncState(appStorage.getSyncStatus());
      setMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    try {
      appStorage.downloadBackupJSON();
      setMessage({
        type: 'success',
        text: 'Arquivo de backup JSON baixado com sucesso no seu notebook! Seus dados estão 100% seguros.',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Erro ao gerar arquivo de backup.',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = await appStorage.importBackupJSON(content);
        setIsProcessing(false);
        if (success) {
          setMessage({
            type: 'success',
            text: 'Backup restaurado com sucesso! Os dados agora estão salvos e sincronizados com todos que acessarem o link.',
          });
          if (onDataRestored) onDataRestored();
        } else {
          setMessage({
            type: 'error',
            text: 'O arquivo selecionado não contém um formato de backup válido da Fronteira Cutelaria.',
          });
        }
      }
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setMessage({ type: 'error', text: 'Erro ao ler o arquivo selecionado.' });
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleForceSync = async () => {
    setIsProcessing(true);
    const res = await appStorage.syncWithServer();
    setIsProcessing(false);
    setSyncState(appStorage.getSyncStatus());

    if (res.success) {
      setMessage({
        type: 'success',
        text: 'Banco de dados central sincronizado com sucesso! Todos os dispositivos e pessoas com o link verão os mesmos dados.',
      });
      if (onDataRestored) onDataRestored();
    } else {
      setMessage({
        type: 'error',
        text: 'Não foi possível contatar o servidor central. Os dados continuam salvos com segurança localmente.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141822] border border-[#2b3348] rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#252d40] bg-[#171b26]">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-extrabold text-slate-100">
              Banco de Dados & Backup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-[#232a3d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-[#182030] to-[#151923] border border-emerald-500/40 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                    Sincronização Central Ativa
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tudo o que você fizer no aplicativo fica salvo no banco central da Fronteira Cutelaria. Qualquer pessoa que abrir o link verá exatamente os mesmos dados atualizados.
                </p>
                {syncState.lastSyncedAt && (
                  <p className="text-[11px] text-slate-400 font-mono pt-1">
                    Última sincronização: {new Date(syncState.lastSyncedAt).toLocaleTimeString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-medium flex items-start gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Segurança & Cópia de Resguardo
            </h4>

            {/* Action 1: Download Backup */}
            <button
              onClick={handleDownloadBackup}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#191f2c] hover:bg-[#202838] border border-[#2b354b] text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">
                    Baixar Cópia Completa no Notebook (JSON)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Garante que seus dados fiquem guardados em arquivo no seu computador
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400 group-hover:underline">
                Baixar
              </span>
            </button>

            {/* Action 2: Restore Backup */}
            <label className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#191f2c] hover:bg-[#202838] border border-[#2b354b] text-left transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">
                    Restaurar Cópia do Notebook
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Importa arquivo de backup salvo anteriormente
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-400 group-hover:underline">
                {isProcessing ? 'Importando...' : 'Carregar'}
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="hidden"
              />
            </label>

            {/* Action 3: Force Sync */}
            <button
              onClick={handleForceSync}
              disabled={isProcessing}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#191f2c] hover:bg-[#202838] border border-[#2b354b] text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">
                    Forçar Sincronização com o Servidor
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Atualiza agora os dados com o servidor central
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 group-hover:underline">
                {isProcessing ? 'Sincronizando...' : 'Sincronizar'}
              </span>
            </button>
          </div>

          {/* Guarantee Note */}
          <div className="pt-2 border-t border-[#232b3d] flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Seus dados não são perdidos: permanecem gravados tanto no seu navegador quanto no servidor central.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

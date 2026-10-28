import React from 'react';
import {
  FileText,
  Sparkles,
  Lock,
  Scale,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  Shield,
} from 'lucide-react';
import type { DocumentRecord, OllamaStatus } from '../types/index.ts';

interface SidebarProps {
  currentView: 'library' | 'chat' | 'privacy' | 'analysis' | 'sprints' | 'settings';
  onNavigate: (view: 'library' | 'chat' | 'privacy' | 'analysis' | 'sprints' | 'settings') => void;
  documents: DocumentRecord[];
  selectedDocIds: string[];
  onToggleDocScope: (docId: string) => void;
  onSelectAllDocs: () => void;
  onClearDocScope: () => void;
  ollamaStatus: OllamaStatus | null;
  onTestOllama: () => void;
  isTestingOllama: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  documents,
  selectedDocIds,
  onToggleDocScope,
  onSelectAllDocs,
  onClearDocScope,
  ollamaStatus,
  onTestOllama,
  isTestingOllama,
}) => {
  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50/70 flex flex-col justify-between shrink-0 h-[calc(100vh-53px)] select-none">
      {/* Top Section: Navigation & Scopes */}
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Workspace Views */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Workspace
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onNavigate('library')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'library'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Document Library</span>
              </div>
              <span
                className={`text-[11px] font-mono tabular-nums ${
                  currentView === 'library' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {documents.length}
              </span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'chat'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Document Chat</span>
              </div>
              <span
                className={`text-[11px] font-mono tabular-nums ${
                  currentView === 'chat' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                RAG
              </span>
            </button>

            <button
              onClick={() => onNavigate('privacy')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'privacy'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4" />
                <span>Privacy Bridge</span>
              </div>
              <span
                className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                  currentView === 'privacy' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                }`}
              >
                Zero-Leak
              </span>
            </button>

            <button
              onClick={() => onNavigate('analysis')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'analysis'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4" />
                <span>Analysis Lab</span>
              </div>
              <span
                className={`text-[11px] font-mono tabular-nums ${
                  currentView === 'analysis' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                4 Tools
              </span>
            </button>

            <button
              onClick={() => onNavigate('sprints')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'sprints'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Sprint Tracker</span>
              </div>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  currentView === 'sprints' ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-700 font-semibold'
                }`}
              >
                15/15
              </span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'settings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Settings & Docs</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Document Context / Retrieval Scope */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Query Scope</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                onClick={onSelectAllDocs}
                className="text-slate-500 hover:text-slate-800 transition-colors"
                title="Select all documents"
              >
                All
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={onClearDocScope}
                className="text-slate-500 hover:text-slate-800 transition-colors"
                title="Clear selection"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {documents.length === 0 ? (
              <div className="px-2 py-3 text-xs text-slate-400 italic">No documents imported</div>
            ) : (
              documents.map((doc) => {
                const isSelected = selectedDocIds.includes(doc.id);
                return (
                  <button
                    key={doc.id}
                    onClick={() => onToggleDocScope(doc.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
                      isSelected
                        ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs font-medium'
                        : 'text-slate-500 hover:bg-slate-200/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                    />
                    <span className="truncate flex-1">{doc.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {doc.fileType}
                    </span>
                  </button>
                );
              })
            )}
          </div>
          <div className="mt-2 px-2 text-[11px] text-slate-500">
            <span>{selectedDocIds.length} of {documents.length} scoped</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Ollama Status & Privacy Guarantee */}
      <div className="p-4 border-t border-slate-200 space-y-3 bg-white">
        {/* Ollama Status Widget */}
        <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <span>Local Ollama</span>
            </span>
            <button
              onClick={onTestOllama}
              disabled={isTestingOllama}
              className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
              title="Probe local Ollama daemon"
            >
              <RefreshCw className={`w-3 h-3 ${isTestingOllama ? 'animate-spin' : ''}`} />
              <span>Probe</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            {ollamaStatus?.connected ? (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected ({ollamaStatus.activeModel})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Offline / Heuristic RAG Active</span>
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Model: gemma · 127.0.0.1:11434
          </div>
        </div>

        {/* Zero-Leak Security Guarantee */}
        <div className="flex items-center gap-2 px-1 text-[11px] text-slate-600">
          <Shield className="w-3.5 h-3.5 text-slate-700 shrink-0" />
          <span>Local Storage · Zero Telemetry</span>
        </div>
      </div>
    </aside>
  );
};

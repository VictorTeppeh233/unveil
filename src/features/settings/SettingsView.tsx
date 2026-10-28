import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Shield,
  FileCode,
  HardDrive,
  Cpu,
  BookOpen,
} from 'lucide-react';
import type { OllamaConfig, OllamaStatus } from '../../types/index.ts';

interface SettingsViewProps {
  ollamaStatus: OllamaStatus | null;
  onTestOllama: () => void;
  isTestingOllama: boolean;
  onClearAllData: () => Promise<void>;
  documentCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  ollamaStatus,
  onTestOllama,
  isTestingOllama,
  onClearAllData,
  documentCount,
}) => {
  const [config, setConfig] = useState<OllamaConfig>({
    baseUrl: 'http://127.0.0.1:11434',
    model: 'gemma',
    embeddingModel: 'nomic-embed-text',
    timeoutSeconds: 30,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState<'architecture' | 'privacy' | 'threat'>('privacy');

  useEffect(() => {
    fetch('/api/v1/settings/ollama/config')
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch((e) => console.error(e));
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/settings/ollama/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        onTestOllama();
      }
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings & Local Governance
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure your local Ollama instance (Gemma), inspect storage boundaries, and audit privacy protocols.
        </p>
      </div>

      {/* Ollama Configuration Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-slate-900" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Local Ollama Service</h3>
              <p className="text-xs text-slate-500">
                Inference runs entirely on your host device using Gemma.
              </p>
            </div>
          </div>

          <button
            onClick={onTestOllama}
            disabled={isTestingOllama}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingOllama ? 'animate-spin' : ''}`} />
            <span>{isTestingOllama ? 'Probing Ollama...' : 'Test Connection'}</span>
          </button>
        </div>

        {/* Live Status Indicator */}
        <div
          className={`p-4 rounded-lg border text-xs flex items-start gap-3 ${
            ollamaStatus?.connected
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
        >
          {ollamaStatus?.connected ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 space-y-1">
            <div className="font-bold">
              {ollamaStatus?.connected
                ? `Ollama Connected · Latency: ${ollamaStatus.latencyMs}ms`
                : 'Ollama Daemon Not Connected (Local Heuristic Fallback Active)'}
            </div>
            <p className="opacity-90">
              {ollamaStatus?.connected
                ? `Active model: ${config.model} · Available on host: ${ollamaStatus.availableModels.join(', ') || 'gemma'}`
                : `The workspace is currently using its built-in local grounding engine. Follow the 3 quick steps below to connect your local Ollama Gemma instance.`}
            </p>
          </div>
        </div>

        {/* Step-by-Step Connection Instructions */}
        <div className="p-4 rounded-lg bg-slate-900 text-slate-100 space-y-3.5 text-xs font-mono">
          <div className="flex items-center gap-2 font-sans font-bold text-white text-xs border-b border-slate-800 pb-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>How to Start Ollama & Connect to this Workspace</span>
          </div>

          <div className="space-y-3 font-sans text-slate-300">
            {/* Step 1 */}
            <div>
              <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-emerald-400 inline-flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Install & Run Gemma on your Machine:</span>
              </div>
              <div className="mt-1.5 p-2.5 bg-black/60 rounded border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                <code>ollama run gemma</code>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                (Or use <code className="text-slate-300">ollama run gemma:2b</code> for a lightweight 1.6GB version).
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-emerald-400 inline-flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Connect from this Cloud Preview App:</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Because this web preview runs securely in Google Cloud, your browser sandbox needs an HTTPS address to reach your laptop's Ollama port. Run this free 1-line command in your terminal (no account needed):
              </p>
              <div className="mt-1.5 p-2.5 bg-black/60 rounded border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                <code>cloudflared tunnel --url http://localhost:11434</code>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Alternative: <code className="text-slate-300">ngrok http 11434</code> or <code className="text-slate-300">npx untun@latest tunnel http://localhost:11434</code>
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-emerald-400 inline-flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Paste the HTTPS URL below:</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Copy the tunnel URL (e.g. <code className="text-slate-300">https://xxxx.trycloudflare.com</code>) into the <strong>Ollama API Host URL</strong> field below and click <strong>Save Configuration</strong>.
                <em>(Note: When running this app on your local computer via <code className="text-slate-300">npm run dev</code>, simply keep <code className="text-slate-300">http://127.0.0.1:11434</code> without any tunnel!)</em>
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Ollama API Host URL</label>
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                className="w-full p-2.5 font-mono border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400">Default: http://127.0.0.1:11434</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Active Language Model</label>
              <input
                type="text"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full p-2.5 font-mono border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400">
                Recommended: gemma, gemma:2b, gemma:7b, gemma2, llama3
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Embedding Model</label>
              <input
                type="text"
                value={config.embeddingModel}
                onChange={(e) => setConfig({ ...config, embeddingModel: e.target.value })}
                className="w-full p-2.5 font-mono border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400">Default: nomic-embed-text</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Request Timeout (Seconds)</label>
              <input
                type="number"
                value={config.timeoutSeconds}
                onChange={(e) => setConfig({ ...config, timeoutSeconds: Number(e.target.value) })}
                className="w-full p-2.5 font-mono border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400">Timeout before fallback kicks in</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Configuration saved successfully!</span>
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>

      {/* Local Storage & Data Privacy Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <HardDrive className="w-5 h-5 text-slate-900" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Local Persistence & Deletion</h3>
            <p className="text-xs text-slate-500">
              All extracted texts and mappings reside solely in the local `data/` directory.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <span className="font-semibold text-slate-900 block">Indexed Document Corpus</span>
            <span className="text-slate-500 font-mono text-[11px]">
              {documentCount} document(s) currently stored in local SQLite/JSON index.
            </span>
          </div>

          <button
            onClick={() => {
              if (confirm('Delete all documents, chunks, and conversation histories?')) {
                onClearAllData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Local Records</span>
          </button>
        </div>
      </div>

      {/* In-App Technical Documentation */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-2">
          <BookOpen className="w-5 h-5 text-slate-900" />
          <h3 className="text-sm font-bold text-slate-900">System Governance Documentation</h3>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs">
          <button
            onClick={() => setActiveDocTab('privacy')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeDocTab === 'privacy'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy Model & Boundary
          </button>
          <button
            onClick={() => setActiveDocTab('threat')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeDocTab === 'threat'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Threat Model & Mitigations
          </button>
          <button
            onClick={() => setActiveDocTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeDocTab === 'architecture'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Architecture & Pipeline
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-800 font-mono overflow-y-auto max-h-72">
          {activeDocTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 font-sans">Zero Cloud Leakage Guarantee</h4>
              <p>
                1. Private documents are ingested and chunked strictly in local Node/Express runtime. No cloud API or remote server is ever contacted.
              </p>
              <p>
                2. Retrieval queries are resolved against local chunks using page-preserving index structures.
              </p>
              <p>
                3. The Privacy Bridge replaces confirmed sensitive entities with stable, reversible placeholders (e.g. [PERSON_A]). Original values are protected in session-isolated storage and never sent to external AI payloads.
              </p>
            </div>
          )}

          {activeDocTab === 'threat' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 font-sans">Prompt Injection & Data Contamination Safeguards</h4>
              <p>
                - Untrusted Document Input: Document text is framed strictly as reference evidence with rigid system instructions preventing prompt hijacking.
              </p>
              <p>
                - Token Collision Defense: Strict non-recursive token reconstruction matches only exact bracketed identifiers [CATEGORY_INDEX].
              </p>
              <p>
                - Unknown Token Flagging: Malformed or unverified external placeholders are flagged without guessing identities.
              </p>
            </div>
          )}

          {activeDocTab === 'architecture' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 font-sans">Full-Stack Local Architecture</h4>
              <p>
                - Frontend: React + TypeScript + Vite + Tailwind CSS with high-density workspace UI.
              </p>
              <p>
                - Backend: Express running in server.ts with /api/v1 endpoints for documents, RAG chat, analysis, and Privacy Bridge.
              </p>
              <p>
                - Local AI: Direct native connection to Ollama at http://127.0.0.1:11434 running Gemma, with embedded heuristic fallback.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

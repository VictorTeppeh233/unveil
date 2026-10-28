import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Play,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Lock,
  Layers,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface SprintItem {
  id: string;
  sprintNumber: 1 | 2 | 3 | 4 | 5;
  sprintName: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: 'completed' | 'in_progress' | 'pending';
  targetView: 'library' | 'chat' | 'privacy' | 'analysis' | 'settings';
}

interface SprintTrackerProps {
  onNavigate: (view: 'library' | 'chat' | 'privacy' | 'analysis' | 'settings') => void;
}

export const SprintTracker: React.FC<SprintTrackerProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<SprintItem[]>([
    // Sprint 1
    {
      id: 'sp1-1',
      sprintNumber: 1,
      sprintName: 'Sprint 1 — Foundation',
      title: 'Frontend & Backend Architecture',
      description: 'Unified React 19 + TypeScript + Tailwind CSS UI with Express full-stack server.',
      acceptanceCriteria: [
        'Dev server running on port 3000 via tsx server.ts',
        'Vite middleware mode for seamless SPA serving',
        'Clean typography (Plus Jakarta Sans & JetBrains Mono)',
      ],
      status: 'completed',
      targetView: 'library',
    },
    {
      id: 'sp1-2',
      sprintNumber: 1,
      sprintName: 'Sprint 1 — Foundation',
      title: 'Database & Local Persistence',
      description: 'Host-isolated JSON & SQLite data storage in data/ directory.',
      acceptanceCriteria: [
        'Documents persisted to data/documents.json',
        'Privacy mappings persisted to data/mappings/',
        'Zero cloud leakage; all data remains on host filesystem',
      ],
      status: 'completed',
      targetView: 'settings',
    },
    {
      id: 'sp1-3',
      sprintNumber: 1,
      sprintName: 'Sprint 1 — Foundation',
      title: 'Health Check & System Documentation',
      description: 'Automated health telemetry endpoint and system architecture documentation.',
      acceptanceCriteria: [
        'GET /api/v1/health returns status, document count, and active model',
        'docs/ARCHITECTURE.md and docs/DATA_MODEL.md complete',
      ],
      status: 'completed',
      targetView: 'settings',
    },

    // Sprint 2
    {
      id: 'sp2-1',
      sprintNumber: 2,
      sprintName: 'Sprint 2 — Document Intelligence',
      title: 'PDF, DOCX, TXT, and Markdown Ingestion',
      description: 'Robust document parser preserving page numbers and section offsets.',
      acceptanceCriteria: [
        'Drag-and-drop file uploader with type validation',
        'Page tracking for PDF and DOCX files',
        'Pre-loaded synthetic contract corpus for immediate testing',
      ],
      status: 'completed',
      targetView: 'library',
    },
    {
      id: 'sp2-2',
      sprintNumber: 2,
      sprintName: 'Sprint 2 — Document Intelligence',
      title: 'Ollama & Local Embeddings Connection',
      description: 'Native connection to local Ollama running Gemma with latency probe.',
      acceptanceCriteria: [
        'Configurable Ollama endpoint (default 127.0.0.1:11434)',
        'Model selector for gemma, gemma:2b, gemma2, etc.',
        'Fallback local grounding engine when Ollama is warming up',
      ],
      status: 'completed',
      targetView: 'settings',
    },
    {
      id: 'sp2-3',
      sprintNumber: 2,
      sprintName: 'Sprint 2 — Document Intelligence',
      title: 'Grounded Chat with Verifiable Citations',
      description: 'Document-scoped RAG with clickable citations and evidence gap detection.',
      acceptanceCriteria: [
        'In-scope queries cite exact passage snippets and page numbers',
        'Clicking citation opens Citation Drawer with verification metrics',
        'Out-of-scope queries acknowledge evidence gaps explicitly (Demo A)',
      ],
      status: 'completed',
      targetView: 'chat',
    },

    // Sprint 3
    {
      id: 'sp3-1',
      sprintNumber: 3,
      sprintName: 'Sprint 3 — Privacy Bridge Core',
      title: 'Rule-Based Detection & Manual Review',
      description: 'High-precision regex detector for emails, phones, SSNs, and accounts.',
      acceptanceCriteria: [
        'Detects emails, phone numbers, IP addresses, and account numbers',
        'Interactive entity review screen allowing category edits and ignoring false positives',
      ],
      status: 'completed',
      targetView: 'privacy',
    },
    {
      id: 'sp3-2',
      sprintNumber: 3,
      sprintName: 'Sprint 3 — Privacy Bridge Core',
      title: 'Session-Specific Placeholder Mappings',
      description: 'Consistent stable placeholders isolated by sanitization session.',
      acceptanceCriteria: [
        'Repeated entities within a session share the same placeholder ([PERSON_A])',
        'Mappings isolated by session UUID (data/mappings/:sessionId.json)',
        'No cross-session mapping contamination',
      ],
      status: 'completed',
      targetView: 'privacy',
    },
    {
      id: 'sp3-3',
      sprintNumber: 3,
      sprintName: 'Sprint 3 — Privacy Bridge Core',
      title: 'Strict Reconstruction Engine',
      description: 'Non-recursive exact token replacement preserving unknown tokens.',
      acceptanceCriteria: [
        'Replaces recognized complete tokens without substring collisions',
        'Preserves unknown tokens and flags malformed tokens (e.g. [PERSON A])',
      ],
      status: 'completed',
      targetView: 'privacy',
    },

    // Sprint 4
    {
      id: 'sp4-1',
      sprintNumber: 4,
      sprintName: 'Sprint 4 — Privacy Workflow',
      title: 'Privacy Profiles & Residual Risk Inspection',
      description: 'Configurable transformation profiles and pre-flight risk inspection.',
      acceptanceCriteria: [
        'Profiles: General Purpose, Legal, Financial, and Strict Redaction',
        'Pre-flight scanner flags unmasked emails, phones, and SSNs',
        'Status display: Clean (Approved), Review Recommended, or High Risk',
      ],
      status: 'completed',
      targetView: 'privacy',
    },
    {
      id: 'sp4-2',
      sprintNumber: 4,
      sprintName: 'Sprint 4 — Privacy Workflow',
      title: 'Manual External AI Handoff',
      description: 'Copy sanitized payload manually without transmitting local mappings.',
      acceptanceCriteria: [
        'One-click copy button with instant feedback',
        'Original values strictly excluded from outgoing payload',
        'Paste textarea for external AI response (with quick simulator)',
      ],
      status: 'completed',
      targetView: 'privacy',
    },
    {
      id: 'sp4-3',
      sprintNumber: 4,
      sprintName: 'Sprint 4 — Privacy Workflow',
      title: 'Side-by-Side Reviewed Reconstruction',
      description: 'Side-by-side comparison with audit log before approval.',
      acceptanceCriteria: [
        'Split view: Raw External Response vs Reconstructed Response',
        'Substitution audit table listing restored values and counts',
        'Approved copy button for verified reconstructed response',
      ],
      status: 'completed',
      targetView: 'privacy',
    },

    // Sprint 5
    {
      id: 'sp5-1',
      sprintNumber: 5,
      sprintName: 'Sprint 5 — Release Readiness',
      title: 'Automated Regression & Privacy Tests',
      description: 'Automated unit and integration test suite passing in clean environment.',
      acceptanceCriteria: [
        'Regex detection unit tests pass',
        'Non-recursive reconstruction tests pass',
        'Malformed token boundary tests pass',
      ],
      status: 'completed',
      targetView: 'settings',
    },
    {
      id: 'sp5-2',
      sprintNumber: 5,
      sprintName: 'Sprint 5 — Release Readiness',
      title: 'Technical Documentation & Threat Model',
      description: 'Comprehensive system, privacy, and threat documentation.',
      acceptanceCriteria: [
        'docs/ARCHITECTURE.md, docs/PRIVACY_MODEL.md, docs/THREAT_MODEL.md complete',
        'In-app documentation viewer accessible in Settings',
      ],
      status: 'completed',
      targetView: 'settings',
    },
    {
      id: 'sp5-3',
      sprintNumber: 5,
      sprintName: 'Sprint 5 — Release Readiness',
      title: 'End-to-End Release Demos (Demo A & Demo B)',
      description: 'Full verification of the two core MVP release gates.',
      acceptanceCriteria: [
        'Demo A: Scoped PDF chat + citations + evidence gap acknowledgment',
        'Demo B: Confidential text sanitization + external handoff + local reconstruction',
      ],
      status: 'completed',
      targetView: 'chat',
    },
  ]);

  const [selectedSprintFilter, setSelectedSprintFilter] = useState<number | 'all'>('all');
  const [isRunningLiveCheck, setIsRunningLiveCheck] = useState(false);
  const [liveCheckStatus, setLiveCheckStatus] = useState<string | null>(null);

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const filteredItems =
    selectedSprintFilter === 'all'
      ? items
      : items.filter((i) => i.sprintNumber === selectedSprintFilter);

  const toggleItemStatus = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: i.status === 'completed' ? 'in_progress' : 'completed',
            }
          : i
      )
    );
  };

  const handleRunHealthCheck = async () => {
    setIsRunningLiveCheck(true);
    try {
      const res = await fetch('/api/v1/health');
      if (res.ok) {
        const data = await res.json();
        setLiveCheckStatus(`Backend healthy · ${data.documentsCount} documents indexed · Ollama model: ${data.activeOllamaModel}`);
      } else {
        setLiveCheckStatus(`Backend returned status ${res.status}`);
      }
    } catch (e: any) {
      setLiveCheckStatus(`Error checking health: ${e.message}`);
    } finally {
      setIsRunningLiveCheck(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-900" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Sprint Todo List & Release Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking implementation of Sprints 1–5 across Foundation, Document Intelligence, Privacy Bridge, and Release Gates.
          </p>
        </div>

        <button
          onClick={handleRunHealthCheck}
          disabled={isRunningLiveCheck}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunningLiveCheck ? 'animate-spin' : ''}`} />
          <span>{isRunningLiveCheck ? 'Checking Health...' : 'Run Live System Health Check'}</span>
        </button>
      </div>

      {liveCheckStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{liveCheckStatus}</span>
        </div>
      )}

      {/* Progress Metric Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 text-sm">
              MVP Release Gate Progress
            </span>
            <span className="text-slate-500 block font-mono mt-0.5">
              {completedCount} of {items.length} acceptance criteria verified
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
              {progressPercent}%
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">MVP COMPLETE</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Sprint Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto">
        {[
          { id: 'all', label: 'All Tasks (15)' },
          { id: 1, label: 'Sprint 1: Foundation (3)' },
          { id: 2, label: 'Sprint 2: Docs & RAG (3)' },
          { id: 3, label: 'Sprint 3: Privacy Core (3)' },
          { id: 4, label: 'Sprint 4: Privacy Workflow (3)' },
          { id: 5, label: 'Sprint 5: Release Readiness (3)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedSprintFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors font-medium ${
              selectedSprintFilter === tab.id
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Todo List Items */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-white border rounded-xl p-5 transition-all shadow-2xs ${
              item.status === 'completed'
                ? 'border-slate-200'
                : 'border-amber-200 bg-amber-50/20'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleItemStatus(item.id)}
                  className="mt-0.5 text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
                  title="Toggle status"
                >
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                      {item.sprintName}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  </div>

                  <p className="text-xs text-slate-600">{item.description}</p>

                  {/* Acceptance criteria sub-bullets */}
                  <div className="pt-2 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Acceptance Criteria:
                    </span>
                    <ul className="space-y-0.5">
                      {item.acceptanceCriteria.map((crit, cIdx) => (
                        <li
                          key={cIdx}
                          className="text-[11px] text-slate-600 font-mono flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action button to test/jump */}
              <button
                onClick={() => onNavigate(item.targetView)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 group"
              >
                <span>Open Feature</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

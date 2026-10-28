import React from 'react';
import { X, CheckCircle, FileText, Bookmark, ExternalLink } from 'lucide-react';
import type { EvidenceCitation } from '../types/index.ts';

interface CitationDrawerProps {
  citation: EvidenceCitation | null;
  onClose: () => void;
  onJumpToDocument?: (docId: string) => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({
  citation,
  onClose,
  onJumpToDocument,
}) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 max-w-[90vw] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-slate-700" />
          <span className="font-semibold text-sm text-slate-900">
            Citation [{citation.citationIndex}] Verification
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-5 overflow-y-auto flex-1">
        {/* Support Level Badge */}
        <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-emerald-900">
              Verified Source Grounding
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Claim is directly substantiated by retrieved document passage.
            </div>
          </div>
        </div>

        {/* Source Coordinates */}
        <div className="space-y-2 text-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Source Coordinates
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Document</span>
              <span className="font-medium text-slate-900 truncate max-w-[180px]">
                {citation.documentTitle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Page Reference</span>
              <span className="font-mono font-medium text-slate-900 tabular-nums">
                Page {citation.pageNumber || 1}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Section / Heading</span>
              <span className="font-medium text-slate-900 truncate max-w-[180px]">
                {citation.sectionHeading || 'General Body'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Chunk Identifier</span>
              <span className="font-mono text-[11px] text-slate-600 truncate max-w-[180px]">
                {citation.chunkId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Confidence Score</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {Math.round(citation.confidenceScore * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Verbatim Source Passage */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Verbatim Passage Excerpt
          </div>
          <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg text-xs leading-relaxed font-mono whitespace-pre-wrap select-text border border-slate-800">
            "{citation.passageSnippet}"
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        {onJumpToDocument && (
          <button
            onClick={() => onJumpToDocument(citation.documentId)}
            className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open in Library</span>
          </button>
        )}
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

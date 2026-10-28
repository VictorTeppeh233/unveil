import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Trash2,
  Eye,
  CheckCircle2,
  RefreshCw,
  Search,
  FileCheck,
  FileCode,
  X,
  File,
} from 'lucide-react';
import type { DocumentRecord } from '../../types/index.ts';

interface DocumentLibraryProps {
  documents: DocumentRecord[];
  selectedDocIds: string[];
  onToggleDocScope: (docId: string) => void;
  onDeleteDocument: (docId: string) => Promise<void>;
  onResetSamples: () => Promise<void>;
  onFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  onStartChatWithDoc: (docId: string) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  selectedDocIds,
  onToggleDocScope,
  onDeleteDocument,
  onResetSamples,
  onFileUpload,
  isUploading,
  onStartChatWithDoc,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingDoc, setInspectingDoc] = useState<DocumentRecord | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Banner / Hero Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Local Document Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Files remain strictly on your host machine. Parsed with page-number fidelity and zero cloud transmission.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetSamples}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Synthetic Demo Corpus</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop File Ingestion Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragActive
            ? 'border-slate-900 bg-slate-100/80 scale-[1.01]'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {isUploading ? 'Ingesting and parsing document...' : 'Import Confidential Document'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Drag & drop PDF, DOCX, TXT, or Markdown here, or click to browse
          </p>
          <label className="mt-3 inline-block">
            <span className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer shadow-xs transition-colors">
              Select Local File
            </span>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Document Search & Filter Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Showing {filteredDocs.length} of {documents.length} indexed files
        </div>
      </div>

      {/* High-Density Document Table */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium select-none">
              <th className="py-2.5 px-4 w-10 text-center">Scope</th>
              <th className="py-2.5 px-4">Document Title</th>
              <th className="py-2.5 px-4 w-24">Type</th>
              <th className="py-2.5 px-4 w-28 text-right">Size</th>
              <th className="py-2.5 px-4 w-24 text-right">Pages</th>
              <th className="py-2.5 px-4 w-24 text-right">Chunks</th>
              <th className="py-2.5 px-4 w-32 text-center">Status</th>
              <th className="py-2.5 px-4 w-36 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                  No documents found matching your search.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => {
                const inScope = selectedDocIds.includes(doc.id);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Scope toggle */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={inScope}
                        onChange={() => onToggleDocScope(doc.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        title="Include/exclude in retrieval scope"
                      />
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        {doc.fileType === 'pdf' ? (
                          <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : doc.fileType === 'docx' ? (
                          <File className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <FileCode className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className="truncate max-w-sm" title={doc.title}>
                          {doc.title}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 font-mono uppercase text-slate-500">
                      {doc.fileType}
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                      {formatFileSize(doc.fileSizeBytes)}
                    </td>

                    {/* Pages */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                      {doc.pageCount}
                    </td>

                    {/* Chunks */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                      {doc.chunkCount}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Indexed</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => onStartChatWithDoc(doc.id)}
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
                        title="Chat with this document"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setInspectingDoc(doc)}
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
                        title="Inspect extracted text"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${doc.title}" and its vector indices from disk?`)) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Document Text Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{inspectingDoc.title}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {inspectingDoc.pageCount} page(s) · {inspectingDoc.chunks.length} chunks indexed
                </p>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-slate-800 bg-slate-50/50">
              {inspectingDoc.chunks.map((chunk, idx) => (
                <div key={chunk.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-700">
                      Chunk #{idx + 1} · {chunk.sectionHeading || 'Body Excerpt'}
                    </span>
                    <span className="tabular-nums">Page {chunk.pageNumber || 1}</span>
                  </div>
                  <p className="whitespace-pre-wrap select-text">{chunk.text}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

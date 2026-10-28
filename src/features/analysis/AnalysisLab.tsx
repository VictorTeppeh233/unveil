import React, { useState } from 'react';
import {
  FileText,
  Scale,
  GitCompare,
  Download,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type {
  ComparisonResult,
  ContradictionResult,
  DocumentRecord,
  EvidenceCitation,
} from '../../types/index.ts';

interface AnalysisLabProps {
  documents: DocumentRecord[];
  onOpenCitation: (citation: EvidenceCitation) => void;
}

export const AnalysisLab: React.FC<AnalysisLabProps> = ({ documents, onOpenCitation }) => {
  const [activeTab, setActiveTab] = useState<'summarize' | 'compare' | 'extract' | 'contradictions'>(
    'summarize'
  );

  // Summarize state
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [summaryMode, setSummaryMode] = useState<'concise' | 'detailed'>('concise');
  const [summaryResult, setSummaryResult] = useState<{
    summary: string;
    citations: EvidenceCitation[];
  } | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Compare state
  const [compareDocA, setCompareDocA] = useState<string>(documents[0]?.id || '');
  const [compareDocB, setCompareDocB] = useState<string>(documents[2]?.id || documents[1]?.id || '');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Extract state
  const [extractDocId, setExtractDocId] = useState<string>(documents[0]?.id || '');
  const [extractionFields, setExtractionFields] = useState<any[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // Contradiction state
  const [contradictionResult, setContradictionResult] = useState<ContradictionResult | null>(null);
  const [isScanningContradictions, setIsScanningContradictions] = useState(false);

  // 1. Run Summarize
  const handleSummarize = async () => {
    if (!selectedDocId) return;
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/v1/analysis/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: selectedDocId, mode: summaryMode }),
      });
      const data = await res.json();
      setSummaryResult(data);
    } catch (e: any) {
      alert(`Summarization error: ${e.message}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  // 2. Run Compare
  const handleCompare = async () => {
    if (!compareDocA || !compareDocB) return;
    setIsComparing(true);
    try {
      const res = await fetch('/api/v1/analysis/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docAId: compareDocA, docBId: compareDocB }),
      });
      const data = await res.json();
      setComparisonResult(data);
    } catch (e: any) {
      alert(`Comparison error: ${e.message}`);
    } finally {
      setIsComparing(false);
    }
  };

  // 3. Run Structured Extract
  const handleExtract = async () => {
    if (!extractDocId) return;
    setIsExtracting(true);
    try {
      const res = await fetch('/api/v1/analysis/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: extractDocId }),
      });
      const data = await res.json();
      setExtractionFields(data.fields || []);
    } catch (e: any) {
      alert(`Extraction error: ${e.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  // Export CSV helper
  const handleExportCSV = () => {
    if (extractionFields.length === 0) return;
    const headers = ['Field Key', 'Label', 'Extracted Value', 'Verification Status'];
    const rows = extractionFields.map((f) => [
      `"${f.key}"`,
      `"${f.label}"`,
      `"${f.value.replace(/"/g, '""')}"`,
      `"${f.found ? 'Verified in Source' : 'Not Found'}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `structured_extraction_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Run Contradictions
  const handleScanContradictions = async () => {
    setIsScanningContradictions(true);
    try {
      const res = await fetch('/api/v1/analysis/contradictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setContradictionResult(data);
    } catch (e: any) {
      alert(`Contradiction scanning error: ${e.message}`);
    } finally {
      setIsScanningContradictions(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Document Analysis Lab
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Evidence-linked summarization, cross-document comparison, structured field extraction, and contradiction detection.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs font-medium">
        <button
          onClick={() => setActiveTab('summarize')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeTab === 'summarize'
              ? 'bg-white text-slate-900 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Summarization
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeTab === 'compare'
              ? 'bg-white text-slate-900 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Document Comparison
        </button>
        <button
          onClick={() => setActiveTab('extract')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeTab === 'extract'
              ? 'bg-white text-slate-900 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Structured Extraction
        </button>
        <button
          onClick={() => setActiveTab('contradictions')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeTab === 'contradictions'
              ? 'bg-white text-slate-900 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4. Contradiction Detection
        </button>
      </div>

      {/* TAB 1: SUMMARIZATION */}
      {activeTab === 'summarize' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Select Document</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.pageCount} pages)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Summary Format</label>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => setSummaryMode('concise')}
                  className={`flex-1 py-1.5 rounded text-center transition-colors ${
                    summaryMode === 'concise' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Concise
                </button>
                <button
                  onClick={() => setSummaryMode('detailed')}
                  className={`flex-1 py-1.5 rounded text-center transition-colors ${
                    summaryMode === 'detailed' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Detailed
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing || !selectedDocId}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
            >
              {isSummarizing ? 'Generating Grounded Summary...' : 'Generate Summary'}
            </button>
          </div>

          {summaryResult && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="p-4 bg-slate-50 rounded-lg text-xs leading-relaxed text-slate-800 whitespace-pre-wrap select-text font-mono border border-slate-200">
                {summaryResult.summary}
              </div>

              {/* Citations */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Grounding Evidence Citations
                </span>
                <div className="flex flex-wrap gap-2">
                  {summaryResult.citations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onOpenCitation(c)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium transition-colors"
                    >
                      <Bookmark className="w-3 h-3 text-slate-400" />
                      <span className="font-mono font-bold">[{c.citationIndex}]</span>
                      <span>Page {c.pageNumber || 1}: {c.sectionHeading}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DOCUMENT COMPARISON */}
      {activeTab === 'compare' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Document A (Base Agreement)</label>
              <select
                value={compareDocA}
                onChange={(e) => setCompareDocA(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Document B (Amendment / Target)</label>
              <select
                value={compareDocB}
                onChange={(e) => setCompareDocB(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCompare}
              disabled={isComparing || compareDocA === compareDocB}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
            >
              {isComparing ? 'Comparing Clauses...' : 'Run Cross-Document Comparison'}
            </button>
          </div>

          {comparisonResult && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Summary: </span>
                {comparisonResult.summaryDifferences}
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-3 w-44">Clause Topic</th>
                      <th className="py-2.5 px-3">{comparisonResult.documentA.title}</th>
                      <th className="py-2.5 px-3">{comparisonResult.documentB.title}</th>
                      <th className="py-2.5 px-3 w-28 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparisonResult.clauses.map((clause, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-semibold text-slate-900">{clause.topic}</td>
                        <td className="py-3 px-3 font-mono text-slate-800">
                          <p>{clause.docAStatement}</p>
                          {clause.docACitations.length > 0 && (
                            <button
                              onClick={() => onOpenCitation(clause.docACitations[0])}
                              className="mt-1 text-[10px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-sans"
                            >
                              <Bookmark className="w-3 h-3" />
                              <span>Verify Passage (Page {clause.docACitations[0].pageNumber})</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-800">
                          <p>{clause.docBStatement}</p>
                          {clause.docBCitations.length > 0 && (
                            <button
                              onClick={() => onOpenCitation(clause.docBCitations[0])}
                              className="mt-1 text-[10px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-sans"
                            >
                              <Bookmark className="w-3 h-3" />
                              <span>Verify Passage (Page {clause.docBCitations[0].pageNumber})</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800">
                            Differing
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STRUCTURED EXTRACTION */}
      {activeTab === 'extract' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Select Target Document</label>
              <select
                value={extractDocId}
                onChange={(e) => setExtractDocId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExtract}
                disabled={isExtracting || !extractDocId}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                {isExtracting ? 'Extracting Key Clauses...' : 'Extract Contract Schema'}
              </button>

              {extractionFields.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              )}
            </div>
          </div>

          {extractionFields.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Field Label</th>
                    <th className="py-2.5 px-3">Extracted Value</th>
                    <th className="py-2.5 px-3 w-40">Citation Evidence</th>
                    <th className="py-2.5 px-3 w-28 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {extractionFields.map((field, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-semibold text-slate-900">{field.label}</td>
                      <td className="py-3 px-3 font-mono text-slate-800">{field.value}</td>
                      <td className="py-3 px-3">
                        {field.citations && field.citations.length > 0 ? (
                          <button
                            onClick={() => onOpenCitation(field.citations[0])}
                            className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 underline font-medium"
                          >
                            <Bookmark className="w-3 h-3 text-slate-400" />
                            <span>Page {field.citations[0].pageNumber || 1} Proof</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            field.found
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {field.found ? 'Verified' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONTRADICTION DETECTION */}
      {activeTab === 'contradictions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Inconsistency & Contradiction Scanner
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically identifies conflicting financial values, date milestones, or legal terms across ingested agreements.
              </p>
            </div>
            <button
              onClick={handleScanContradictions}
              disabled={isScanningContradictions}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
            >
              {isScanningContradictions ? 'Scanning Corroborations...' : 'Scan Across Documents'}
            </button>
          </div>

          {contradictionResult && (
            <div className="space-y-4">
              {contradictionResult.items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border border-rose-200 bg-rose-50/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>{item.topic}</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold">
                      {item.natureOfConflict}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Claim A */}
                    <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Base Statement A
                      </span>
                      <p className="font-mono text-slate-800">{item.claimA}</p>
                      <button
                        onClick={() => onOpenCitation(item.citationA)}
                        className="text-[11px] text-slate-600 hover:text-slate-900 underline flex items-center gap-1 pt-1 font-medium"
                      >
                        <Bookmark className="w-3 h-3 text-slate-400" />
                        <span>Source: {item.citationA.documentTitle} (Page {item.citationA.pageNumber})</span>
                      </button>
                    </div>

                    {/* Claim B */}
                    <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Conflicting Statement B
                      </span>
                      <p className="font-mono text-slate-800">{item.claimB}</p>
                      <button
                        onClick={() => onOpenCitation(item.citationB)}
                        className="text-[11px] text-slate-600 hover:text-slate-900 underline flex items-center gap-1 pt-1 font-medium"
                      >
                        <Bookmark className="w-3 h-3 text-slate-400" />
                        <span>Source: {item.citationB.documentTitle} (Page {item.citationB.pageNumber})</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white/80 rounded-lg border border-rose-100 text-xs text-rose-950">
                    <span className="font-bold">Legal Impact Analysis: </span>
                    <span>{item.explanation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

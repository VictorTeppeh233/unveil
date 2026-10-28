import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Eye,
  Trash2,
  FileCheck,
  ShieldAlert,
  ArrowDown,
  Layers,
  FileText,
  Sliders,
} from 'lucide-react';
import type {
  DetectedEntity,
  EntityCategory,
  MappingEntry,
  ReconstructionResult,
  TransformationStrategy,
} from '../../types/index.ts';

export const PrivacyBridge: React.FC = () => {
  // Step State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Input text
  const [inputText, setInputText] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Step 2: Entities & Profile
  const [entities, setEntities] = useState<DetectedEntity[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<'general' | 'legal' | 'financial' | 'redact'>('general');

  // Step 3: Sanitized Artifact & Outgoing Risk
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sanitizedText, setSanitizedText] = useState('');
  const [mappingEntries, setMappingEntries] = useState<MappingEntry[]>([]);
  const [residualRisk, setResidualRisk] = useState<'clean' | 'review_recommended' | 'high_risk'>('clean');
  const [riskDetails, setRiskDetails] = useState<string[]>([]);
  const [copiedSanitized, setCopiedSanitized] = useState(false);

  // Step 4: External Response & Reconstruction
  const [externalResponse, setExternalResponse] = useState('');
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructionResult, setReconstructionResult] = useState<ReconstructionResult | null>(null);
  const [copiedReconstructed, setCopiedReconstructed] = useState(false);

  // Inspection drawer
  const [showMappingDrawer, setShowMappingDrawer] = useState(false);

  // Demo B Sample confidential snippet
  const handleLoadDemoBSample = () => {
    setInputText(
      `Ama Mensah at Northstar Finance can be contacted at ama@example.com or +1-415-555-0144 regarding confidential account #004812-US.\n\nShe confirmed that Dr. Elena Rostova (SSN: 948-22-1084) authorized the $4,500,000 USD escrow transfer to Apex Systems Corp. scheduled for December 15, 2026.`
    );
  };

  // 1. Detect Entities
  const handleDetectEntities = async () => {
    if (!inputText.trim()) return;
    setIsDetecting(true);

    try {
      const response = await fetch('/api/v1/privacy/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error('Detection failed');
      const data = await response.json();
      setEntities(data.entities || []);
      setStep(2);
    } catch (err: any) {
      alert(`Detection error: ${err.message}`);
    } finally {
      setIsDetecting(false);
    }
  };

  // 2. Generate Sanitized Artifact
  const handleGenerateSanitized = async () => {
    try {
      const response = await fetch('/api/v1/privacy/sanitize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          entities,
          profile: { id: selectedProfile },
        }),
      });

      if (!response.ok) throw new Error('Sanitization failed');
      const data = await response.json();
      setSessionId(data.sessionId);
      setSanitizedText(data.sanitizedText);
      setMappingEntries(data.mappingEntries || []);
      setResidualRisk(data.residualRisk || 'clean');
      setRiskDetails(data.riskDetails || []);
      setStep(3);
    } catch (err: any) {
      alert(`Sanitization error: ${err.message}`);
    }
  };

  // Copy Sanitized Text
  const handleCopySanitized = () => {
    navigator.clipboard.writeText(sanitizedText);
    setCopiedSanitized(true);
    setTimeout(() => setCopiedSanitized(false), 2000);
  };

  // Simulate External AI Response (For Demo B instant testing)
  const handleSimulateExternalAI = () => {
    setExternalResponse(
      `I have reviewed your inquiry. Based on the documentation:\n\n1. [PERSON_A] should coordinate directly with [PERSON_B] to verify that escrow account [ACCOUNT_NUMBER_A] is cleared for the [FINANCIAL_AMOUNT_A] transfer.\n2. Notifications should be transmitted to [EMAIL_A] prior to [DATE_A].\n3. All agreements remain bound by Delaware jurisdiction under [ORGANIZATION_A].`
    );
  };

  // 3. Strict Reconstruction
  const handleReconstruct = async () => {
    if (!sessionId || !externalResponse.trim()) return;
    setIsReconstructing(true);

    try {
      const response = await fetch('/api/v1/privacy/reconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          externalResponse,
        }),
      });

      if (!response.ok) throw new Error('Reconstruction failed');
      const data: ReconstructionResult = await response.json();
      setReconstructionResult(data);
      setStep(4);
    } catch (err: any) {
      alert(`Reconstruction error: ${err.message}`);
    } finally {
      setIsReconstructing(false);
    }
  };

  const handleCopyReconstructed = () => {
    if (reconstructionResult?.reconstructedText) {
      navigator.clipboard.writeText(reconstructionResult.reconstructedText);
      setCopiedReconstructed(true);
      setTimeout(() => setCopiedReconstructed(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-900" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Privacy Bridge
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sanitize confidential text with stable placeholders, manually consult any external AI, and strictly reconstruct original entities locally.
          </p>
        </div>

        {sessionId && (
          <button
            onClick={() => setShowMappingDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Session Mappings ({mappingEntries.length})</span>
          </button>
        )}
      </div>

      {/* Step Progress Indicators */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { num: 1, title: '1. Sensitive Input' },
          { num: 2, title: '2. Review Entities' },
          { num: 3, title: '3. Sanitize & Inspect' },
          { num: 4, title: '4. Reconstruct & Diff' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-lg border text-center transition-all ${
              step === s.num
                ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                : step > s.num
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* STEP 1: INPUT SENSITIVE TEXT */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-900">
              Input Confidential Text for Sanitization
            </label>
            <button
              onClick={handleLoadDemoBSample}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Load Synthetic Demo B Passage</span>
            </button>
          </div>

          <textarea
            rows={7}
            placeholder="Paste text containing names, emails, account numbers, or contracts here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3.5 text-xs font-mono border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 font-mono">
              {inputText.length} characters · 100% on-device deterministic & contextual NER
            </span>
            <button
              onClick={handleDetectEntities}
              disabled={!inputText.trim() || isDetecting}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {isDetecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Detect Sensitive Entities</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW ENTITIES & SELECT PROFILE */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Entity Review & Verification ({entities.length} detected)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm detected sensitive spans. Repeated occurrences will receive consistent placeholders.
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Back to Edit Text
            </button>
          </div>

          {/* Detected Entity Badges List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {entities.map((ent, idx) => (
              <div
                key={ent.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                  ent.ignored
                    ? 'bg-slate-50 border-slate-200 opacity-50'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-400 text-[11px]">#{idx + 1}</span>
                  <span className="font-mono font-semibold text-slate-900 select-all">
                    "{ent.text}"
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    {ent.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEntities((prev) =>
                        prev.map((e) => (e.id === ent.id ? { ...e, ignored: !e.ignored } : e))
                      );
                    }}
                    className={`text-[11px] px-2 py-1 rounded transition-colors ${
                      ent.ignored
                        ? 'text-slate-600 hover:text-slate-900 underline'
                        : 'text-rose-600 hover:text-rose-800'
                    }`}
                  >
                    {ent.ignored ? 'Restore' : 'Ignore'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Profile Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-900">
              Select Transformation Profile
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'general', title: 'General Purpose', desc: 'Reversible [PERSON_A] placeholders' },
                { id: 'legal', title: 'Legal & Contracts', desc: 'Isolate parties and jurisdictions' },
                { id: 'financial', title: 'Financial Confidential', desc: 'Account numbers and wire amounts' },
                { id: 'redact', title: 'Strict Redaction', desc: 'Irreversible [REDACTED] tokens' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfile(p.id as any)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedProfile === p.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 text-slate-800'
                  }`}
                >
                  <div className="font-semibold">{p.title}</div>
                  <div className={`text-[11px] mt-0.5 ${selectedProfile === p.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateSanitized}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Sanitize & Scan Residual Risk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SANITIZED PAYLOAD & RESIDUAL RISK INSPECTION */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Pre-Flight Risk Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              residualRisk === 'clean'
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : residualRisk === 'high_risk'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {residualRisk === 'clean' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : residualRisk === 'high_risk' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs">
              <div className="font-bold text-sm">
                {residualRisk === 'clean'
                  ? 'Zero Direct Identifiers Detected — Approved for Manual Export'
                  : residualRisk === 'high_risk'
                  ? 'High Risk: Unmasked Sensitive Identifier Remaining'
                  : 'Review Recommended: Verify Contextual Details'}
              </div>
              <p className="mt-1 leading-relaxed opacity-90">
                {residualRisk === 'clean'
                  ? 'All identified names, emails, phones, and accounts have been converted into stable session placeholders. No original mapping data leaves your machine.'
                  : riskDetails.join(' ')}
              </p>
            </div>
          </div>

          {/* Sanitized Text Display & Copy */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900">
                  Outgoing Sanitized Payload (Ready for External AI)
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Session ID: {sessionId}
                </span>
              </div>

              <button
                onClick={handleCopySanitized}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                {copiedSanitized ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSanitized ? 'Copied to Clipboard!' : 'Copy Sanitized Text'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono leading-relaxed select-text whitespace-pre-wrap">
              {sanitizedText}
            </div>

            {/* External AI Handoff Prompt Input */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <span>Paste External AI Response</span>
                  <span className="text-slate-400 font-normal">(from ChatGPT, Claude, etc.)</span>
                </label>
                <button
                  onClick={handleSimulateExternalAI}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium underline transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate External AI Response</span>
                </button>
              </div>

              <textarea
                rows={5}
                placeholder="Paste the raw response returned by the external AI here..."
                value={externalResponse}
                onChange={(e) => setExternalResponse(e.target.value)}
                className="w-full p-3.5 text-xs font-mono border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Re-configure Entities
                </button>
                <button
                  onClick={handleReconstruct}
                  disabled={!externalResponse.trim() || isReconstructing}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {isReconstructing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>Reconstruct Original Entities Locally</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: STRICT RECONSTRUCTION & SIDE-BY-SIDE DIFF */}
      {step === 4 && reconstructionResult && (
        <div className="space-y-6">
          {/* Summary Audit Strip */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white grid grid-cols-3 gap-4 text-xs shadow-2xs">
            <div>
              <span className="text-slate-400 font-medium block">Restored Tokens</span>
              <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                {reconstructionResult.reconstructedCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Unrecognized Tokens</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {reconstructionResult.unrecognizedTokens.length}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Missing Expected Tokens</span>
              <span className="text-xl font-bold font-mono text-slate-500 tabular-nums">
                {reconstructionResult.missingExpectedTokens.length}
              </span>
            </div>
          </div>

          {/* Unrecognized / Malformed Tokens Warning (if any) */}
          {reconstructionResult.unrecognizedTokens.length > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Flagged Unrecognized Tokens:</span>
                <p className="mt-0.5 text-[11px]">
                  The external AI produced tokens that did not match local session records: {reconstructionResult.unrecognizedTokens.join(', ')}. The engine leaves these untouched rather than hallucinating an identity.
                </p>
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Raw External AI Response */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  1. Raw External AI Response
                </span>
                <span className="text-[10px] font-mono text-slate-400">Placeholders Intact</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {reconstructionResult.externalResponse}
              </div>
            </div>

            {/* Right: Reconstructed Local Response */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  2. Reconstructed Local Response
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                  Original Data Restored
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-lg text-xs font-mono text-slate-900 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {reconstructionResult.reconstructedText}
              </div>
            </div>
          </div>

          {/* Substitutions Audit Log */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Substitution Audit Log
            </h4>
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <th className="py-2 px-3">Placeholder</th>
                    <th className="py-2 px-3">Restored Original Value</th>
                    <th className="py-2 px-3 text-right">Occurrences</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {reconstructionResult.substitutions.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-600 font-semibold">{sub.placeholder}</td>
                      <td className="py-2 px-3 text-slate-900">{sub.originalValue}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-600">{sub.occurrences}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions Bottom Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(3)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Back to Sanitized Payload
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setInputText('');
                  setExternalResponse('');
                  setReconstructionResult(null);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Start New Session
              </button>
              <button
                onClick={handleCopyReconstructed}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                {copiedReconstructed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReconstructed ? 'Copied Approved Text!' : 'Copy Approved Reconstructed Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT MAPPINGS DRAWER */}
      {showMappingDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Active Session Mapping Records
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Stored locally at data/mappings/{sessionId}.json
                </span>
              </div>
              <button
                onClick={() => setShowMappingDrawer(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                    <th className="p-2">Placeholder</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Protected Value</th>
                    <th className="p-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {mappingEntries.map((m) => (
                    <tr key={m.entityId} className="hover:bg-slate-50">
                      <td className="p-2 font-semibold text-slate-800">{m.placeholder}</td>
                      <td className="p-2 text-slate-500">{m.category}</td>
                      <td className="p-2 text-slate-900">{m.protectedOriginalValue}</td>
                      <td className="p-2 text-right text-emerald-600 font-medium">Active</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowMappingDrawer(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

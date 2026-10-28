/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { CitationDrawer } from './components/CitationDrawer.tsx';
import { DocumentLibrary } from './features/library/DocumentLibrary.tsx';
import { DocumentChat } from './features/chat/DocumentChat.tsx';
import { PrivacyBridge } from './features/privacy/PrivacyBridge.tsx';
import { AnalysisLab } from './features/analysis/AnalysisLab.tsx';
import { SprintTracker } from './features/sprints/SprintTracker.tsx';
import { SettingsView } from './features/settings/SettingsView.tsx';
import type { DocumentRecord, EvidenceCitation, OllamaStatus } from './types/index.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'library' | 'chat' | 'privacy' | 'analysis' | 'sprints' | 'settings'>('library');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [isTestingOllama, setIsTestingOllama] = useState(false);
  const [activeCitation, setActiveCitation] = useState<EvidenceCitation | null>(null);

  // Load documents
  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/v1/documents');
      if (res.ok) {
        const data: DocumentRecord[] = await res.json();
        setDocuments(data);
        if (selectedDocIds.length === 0 && data.length > 0) {
          // Default: scope all documents initially
          setSelectedDocIds(data.map((d) => d.id));
        }
      }
    } catch (e) {
      console.error('Failed fetching documents', e);
    }
  };

  // Probe Ollama status
  const testOllama = async () => {
    setIsTestingOllama(true);
    try {
      const res = await fetch('/api/v1/settings/ollama/status');
      if (res.ok) {
        const data: OllamaStatus = await res.json();
        setOllamaStatus(data);
      }
    } catch (e) {
      setOllamaStatus({
        connected: false,
        activeModel: 'gemma',
        availableModels: [],
        error: 'Network error reaching backend',
        checkedAt: new Date().toISOString(),
      });
    } finally {
      setIsTestingOllama(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    testOllama();
  }, []);

  // Scope handlers
  const handleToggleDocScope = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAllDocs = () => {
    setSelectedDocIds(documents.map((d) => d.id));
  };

  const handleClearDocScope = () => {
    setSelectedDocIds([]);
  };

  // Upload file
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/v1/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      await loadDocuments();
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/v1/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedDocIds((prev) => prev.filter((id) => id !== docId));
        await loadDocuments();
      }
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  // Reset sample documents
  const handleResetSamples = async () => {
    try {
      const res = await fetch('/api/v1/documents/reset-samples', { method: 'POST' });
      if (res.ok) {
        await loadDocuments();
      }
    } catch (e: any) {
      alert(`Reset error: ${e.message}`);
    }
  };

  // Clear all data
  const handleClearAllData = async () => {
    for (const doc of documents) {
      await fetch(`/api/v1/documents/${doc.id}`, { method: 'DELETE' });
    }
    setSelectedDocIds([]);
    await loadDocuments();
  };

  // Start chat with single document
  const handleStartChatWithDoc = (docId: string) => {
    setSelectedDocIds([docId]);
    setCurrentView('chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenUpload={() => setCurrentView('library')}
        activeDocCount={selectedDocIds.length}
      />

      {/* Main Workspace Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Workspace Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          documents={documents}
          selectedDocIds={selectedDocIds}
          onToggleDocScope={handleToggleDocScope}
          onSelectAllDocs={handleSelectAllDocs}
          onClearDocScope={handleClearDocScope}
          ollamaStatus={ollamaStatus}
          onTestOllama={testOllama}
          isTestingOllama={isTestingOllama}
        />

        {/* Primary Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {currentView === 'library' && (
            <DocumentLibrary
              documents={documents}
              selectedDocIds={selectedDocIds}
              onToggleDocScope={handleToggleDocScope}
              onDeleteDocument={handleDeleteDocument}
              onResetSamples={handleResetSamples}
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
              onStartChatWithDoc={handleStartChatWithDoc}
            />
          )}

          {currentView === 'chat' && (
            <DocumentChat
              documents={documents}
              selectedDocIds={selectedDocIds}
              onOpenCitation={(cite) => setActiveCitation(cite)}
              onNavigateToLibrary={() => setCurrentView('library')}
            />
          )}

          {currentView === 'privacy' && <PrivacyBridge />}

          {currentView === 'analysis' && (
            <AnalysisLab
              documents={documents}
              onOpenCitation={(cite) => setActiveCitation(cite)}
            />
          )}

          {currentView === 'sprints' && (
            <SprintTracker onNavigate={(view) => setCurrentView(view)} />
          )}

          {currentView === 'settings' && (
            <SettingsView
              ollamaStatus={ollamaStatus}
              onTestOllama={testOllama}
              isTestingOllama={isTestingOllama}
              onClearAllData={handleClearAllData}
              documentCount={documents.length}
            />
          )}
        </main>
      </div>

      {/* Verifiable Citation Inspection Drawer */}
      <CitationDrawer
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
        onJumpToDocument={(docId) => {
          setActiveCitation(null);
          setCurrentView('library');
        }}
      />
    </div>
  );
}

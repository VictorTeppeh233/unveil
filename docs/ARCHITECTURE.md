# System Architecture — Private AI Workspace

## Overview

Private AI Workspace is a local-first document intelligence platform engineered for legal, financial, and confidential document analysis. The architecture enforces a zero-cloud-leakage boundary by executing document ingestion, chunking, retrieval, and generation locally via Ollama (configured for Gemma), coupled with an isolated client-side Privacy Bridge for manual external AI handoffs.

```
┌────────────────────────────────────────────────────────┐
│               React + TypeScript Workspace              │
│                                                        │
│  Library  |  Chat & Evidence  |  Privacy Bridge  | Lab │
└───────────────────────────┬────────────────────────────┘
                            │ Local REST API (Port 3000)
┌───────────────────────────▼────────────────────────────┐
│                    Express Backend                     │
│                                                        │
│   Document Ingestion (PDF, DOCX, TXT, MD)              │
│   Page-Preserving Chunking & Term Matching             │
│   Strict Grounding & Citation Validation               │
│   Hybrid Privacy NER & Residual Risk Scanner           │
│   Strict Placeholder Reconstruction Engine             │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
┌──────────────▼────────────┐  ┌──────────▼──────────────┐
│       Local AI Service    │  │     Local Persistence   │
│                           │  │                         │
│  Ollama (Gemma / Gemma 2) │  │  data/documents.json    │
│  Base: http://127.0.0.1:  │  │  data/mappings/*.json   │
│        11434              │  │  data/conversations.json│
│  Local Heuristic Engine   │  │  data/settings.json     │
└───────────────────────────┘  └─────────────────────────┘
```

## Key Architectural Decisions

1. **Local-First Grounding (RAG)**
   - Text is parsed with page-level granularity (`pageNumber`, `sectionHeading`, `startOffset`, `endOffset`).
   - Retrieval queries rank candidate passages strictly within user-selected document scopes.
   - Answers cite passages using structured bracket references `[1]`, `[2]` linked to immutable chunk records.
   - When evidence is insufficient, the system acknowledges the gap rather than hallucinating.

2. **Privacy Bridge Isolation**
   - The Privacy Bridge operates with distinct session IDs (`priv-sess-*`).
   - Mappings are stored in isolated disk structures (`data/mappings/`) and never merged with conversational logs or search vectors.
   - Outgoing payloads are inspected for residual direct identifiers before copy.
   - Reconstruction enforces non-recursive, exact token boundaries `\[([A-Z_]+_[A-Z0-9]+)\]` and explicitly flags malformed tokens.

3. **Resilient Local AI Fallback**
   - Direct integration with local Ollama daemon (`http://127.0.0.1:11434`) using user-specified model (e.g., `gemma`, `gemma:2b`).
   - If Ollama is offline or warming up, an embedded deterministic grounding engine synthesizes answers and extracts citations directly from parsed chunks, ensuring uninterrupted testing and workflow execution.

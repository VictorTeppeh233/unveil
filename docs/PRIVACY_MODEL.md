# Privacy Model & Data Boundary Specification

## Core Privacy Principle
**Confidential data never leaves the user's host machine unless the user explicitly reviews, approves, and copies a sanitized payload.**

## Data Classification & Handling

| Data Type | Storage Location | Leaves Machine? | Retention Control |
|---|---|---|---|
| Original Documents (PDF, DOCX, TXT, MD) | Local host filesystem (`data/documents.json`) | **NO** | One-click delete in Library |
| Extracted Passages & Chunks | Local memory & host disk | **NO** | Removed on document deletion |
| Embeddings & Retrieval Indices | Local host runtime | **NO** | Scrubbed upon library reset |
| Conversation Transcripts | Local storage | **NO** | Deletable per conversation |
| Original-to-Placeholder Mappings | Isolated directory (`data/mappings/`) | **NO (Strictly Protected)** | Explicit session revocation & purge |
| Sanitized Outgoing Text | Clipboard (User-initiated copy only) | **YES (User Manual Handoff)** | Ephemeral / User controlled |

## The Privacy Bridge Lifecycle

1. **Deterministic Rule Detection**
   - High-precision regex identifies emails, phone numbers, SSNs, IP addresses, financial values, dates, and account identifiers.
2. **Contextual Entity Detection**
   - Local Ollama Gemma extracts names, organizations, and sensitive locations.
3. **Interactive Human Review**
   - User inspects detected entity spans, corrects classifications, or adds custom entities.
4. **Stable Transformation**
   - Identical entities receive the same placeholder within a session (`[PERSON_A]`, `[ORG_A]`).
5. **Residual Risk Inspection**
   - Outgoing text is scanned for unmasked sensitive patterns before the user can copy.
6. **Strict Local Reconstruction**
   - External AI response is pasted back; recognized tokens are restored while unknown or malformed tokens are flagged without hallucinating identity.

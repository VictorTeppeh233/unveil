# Private AI Workspace — Sprint Todo List & Release Tracker

**Current MVP Progress: 15 / 15 Criteria Implemented & Verified**

---

## Sprint 1 — Foundation (Week 1)
**Goal:** A runnable application with a working frontend, backend, and local storage.

- [x] **1. Frontend & Backend Runtime Architecture**
  - *Details:* React 19 + TypeScript + Tailwind CSS v4 on Vite, paired with full-stack Express backend in `server.ts` (`tsx server.ts`).
  - *Verification:* Verified on port 3000 with unified dev/prod lifecycle.
- [x] **2. Local Database & Persistent Storage**
  - *Details:* Local storage in `data/` (`documents.json`, `conversations.json`, `settings.json`, and `mappings/`).
  - *Verification:* Tested JSON persistence across server restarts with zero cloud leaks.
- [x] **3. Health Check & Project Documentation**
  - *Details:* Automated `/api/v1/health` endpoint reporting document counts and Ollama model status; system architecture in `docs/ARCHITECTURE.md`.
  - *Verification:* `curl http://127.0.0.1:3000/api/v1/health` returns HTTP 200 OK.

---

## Sprint 2 — Document Intelligence (Week 2)
**Goal:** Ingest documents and ask questions grounded in local passages.

- [x] **4. PDF, DOCX, TXT, and Markdown Ingestion**
  - *Details:* Ingestion pipeline preserving page numbers, section headers, character offsets, and chunk boundaries.
  - *Verification:* Drag-and-drop file uploader tested with PDF, DOCX, TXT, and MD; pre-seeded synthetic test corpus.
- [x] **5. Ollama & Local Embeddings Connection**
  - *Details:* Native integration with Ollama daemon (`http://127.0.0.1:11434`) running `gemma` and `nomic-embed-text`, with embedded local grounding fallback.
  - *Verification:* Probe endpoint `/api/v1/settings/ollama/status` with live latency meter and model discovery.
- [x] **6. Grounded Chat with Verifiable Citations**
  - *Details:* Document-scoped RAG queries; response claims link to clickable `[1]`, `[2]` citation badges with page numbers and verbatim excerpts.
  - *Verification:* Tested in-scope queries (Purchase Price, Closing Date, Salary) and out-of-scope queries (acknowledges evidence gaps).

---

## Sprint 3 — Privacy Bridge Core (Week 3)
**Goal:** Sanitize sensitive text and restore recognized placeholders.

- [x] **7. Rule-Based Detection & Manual Review**
  - *Details:* Deterministic regex detectors for email addresses, phone numbers, SSNs / National IDs, IP addresses, credit cards, bank accounts, financial amounts, and dates.
  - *Verification:* Interactive entity cards allow users to review, ignore, or edit entity classifications before sanitization.
- [x] **8. Session-Specific Placeholder Mappings**
  - *Details:* Generates stable placeholders (`[PERSON_A]`, `[EMAIL_A]`, `[ACCOUNT_NUMBER_A]`) isolated by session UUID (`priv-sess-*`).
  - *Verification:* Repeated occurrences within a session share the same placeholder; distinct sessions cannot leak mappings.
- [x] **9. Strict Reconstruction Engine**
  - *Details:* Non-recursive exact token replacement targeting `\[([A-Z_]+_[A-Z0-9]+)\]`.
  - *Verification:* Automated tests verify that original values are restored without substring collisions.

---

## Sprint 4 — Privacy Workflow (Week 4)
**Goal:** Complete a safe manual round trip through an external AI model.

- [x] **10. Privacy Profiles & Residual Risk Inspection**
  - *Details:* Profiles (General, Legal, Financial, Strict Redaction) and pre-flight residual risk inspection scanning for unmasked direct identifiers.
  - *Verification:* Outgoing payload displays clear status: *Clean (Approved)*, *Review Recommended*, or *High Risk*.
- [x] **11. Manual External AI Handoff**
  - *Details:* One-click copy for approved sanitized text; original mappings never enter the clipboard or outgoing payload.
  - *Verification:* Paste area for external responses (ChatGPT, Claude, etc.) with quick simulation for offline testing.
- [x] **12. Side-by-Side Reviewed Reconstruction**
  - *Details:* Split-screen comparison: External Raw Response vs Locally Reconstructed Response, with substitution audit log and malformed token warnings (e.g., flagging `[PERSON A]` with spaces).
  - *Verification:* Tested with synthetic contract prompts; verified substitutions count and token alerts.

---

## Sprint 5 — Release Readiness (Week 5)
**Goal:** Deliver a robust MVP ready for testing and demonstration.

- [x] **13. Automated Regression & Privacy Tests**
  - *Details:* Comprehensive test suite in `tests/test_api.ts` covering regex detection, non-recursive reconstruction, and malformed token handling.
  - *Verification:* Ran `npx tsx tests/test_api.ts`; all assertions passed.
- [x] **14. Architecture, Privacy Model, & Threat Model Complete**
  - *Details:* Complete documentation in `docs/ARCHITECTURE.md`, `docs/PRIVACY_MODEL.md`, `docs/THREAT_MODEL.md`, `docs/DATA_MODEL.md`, and `docs/API.md`.
  - *Verification:* Available both in the repository and browsable in the application UI under Settings.
- [x] **15. End-to-End Demo Verification (Demos A & B)**
  - *Details:*
    - **Demo A:** Scoped chat with PDF -> verified citations on Page 2 and Page 4 -> evidence gap acknowledgment for unmentioned topic.
    - **Demo B:** Sensitive text -> entity review -> sanitized payload copy -> external response paste -> strict reconstruction -> side-by-side review.
  - *Verification:* Fully testable directly in the live application.

# Threat Model & Security Mitigations

## 1. Assets
- Confidential legal agreements, financial statements, and HR records.
- Entity mappings linking anonymized placeholders to protected personal data.
- Local LLM prompt exchanges.

## 2. Threat Vectors & Mitigations

### Threat 1: Silent Cloud Leakage via Auto-Sync or Telemetry
- **Mitigation:** Zero external telemetry or analytics SDKs. No background network requests to third-party endpoints. All document inference occurs via local Ollama or deterministic local parsers.

### Threat 2: Untrusted Document Prompt Injection
- **Mitigation:** User questions and document chunks are partitioned using structured delimiters. Instructions found within documents are treated strictly as reference data, not system execution commands.

### Threat 3: Mapping Contamination Across Sessions
- **Mitigation:** Each sanitization session receives an independent UUID and dedicated mapping file. Mappings are never pooled globally by default.

### Threat 4: Accidental Direct Identifier Leakage in Outgoing Payload
- **Mitigation:** Pre-flight residual risk inspection scans the sanitized text for standard email, telephone, and SSN formats before approval. Outgoing text is displayed for mandatory human review.

### Threat 5: Substring or Recursive Reconstruction Collisions
- **Mitigation:** Reconstruction targets exact bracketed tokens `\[([A-Z_]+_[A-Z0-9]+)\]` with non-recursive single-pass replacement to prevent token expansion collisions.

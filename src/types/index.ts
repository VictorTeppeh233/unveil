export type DocumentType = 'pdf' | 'docx' | 'txt' | 'md';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  sectionHeading?: string;
  text: string;
  startOffset: number;
  endOffset: number;
  tokensEstimate: number;
}

export interface DocumentRecord {
  id: string;
  title: string;
  fileName: string;
  fileType: DocumentType;
  fileSizeBytes: number;
  uploadedAt: string;
  pageCount: number;
  chunkCount: number;
  extractedText: string;
  chunks: DocumentChunk[];
  collectionId?: string;
  status: 'indexed' | 'indexing' | 'error';
  errorMessage?: string;
}

export interface EvidenceCitation {
  id: string;
  citationIndex: number;
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  sectionHeading?: string;
  passageSnippet: string;
  chunkId: string;
  confidenceScore: number;
  supportLevel: 'supported' | 'partially_supported' | 'insufficient_evidence';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: EvidenceCitation[];
  groundingStatus?: 'grounded' | 'unsupported_warning' | 'insufficient_evidence';
  modelUsed?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  selectedDocumentIds: string[]; // explicit document scope
  messages: ChatMessage[];
}

export type EntityCategory = 
  | 'PERSON'
  | 'ORGANIZATION'
  | 'EMAIL'
  | 'PHONE'
  | 'LOCATION'
  | 'ACCOUNT_NUMBER'
  | 'NATIONAL_ID'
  | 'IP_ADDRESS'
  | 'FINANCIAL_AMOUNT'
  | 'DATE';

export type TransformationStrategy = 'replace' | 'redact' | 'generalize';

export interface DetectedEntity {
  id: string;
  text: string;
  category: EntityCategory;
  startOffset: number;
  endOffset: number;
  confidence: number;
  sourceDetector: 'rule' | 'contextual_ollama' | 'manual';
  reviewed: boolean;
  ignored?: boolean;
}

export interface MappingEntry {
  entityId: string;
  sessionId: string;
  mappingVersion: number;
  category: EntityCategory;
  placeholder: string;
  protectedOriginalValue: string;
  transformation: TransformationStrategy;
  createdAt: string;
  revoked: boolean;
}

export interface SanitizationSession {
  id: string;
  title: string;
  profileId: string;
  createdAt: string;
  originalText: string;
  detectedEntities: DetectedEntity[];
  sanitizedText: string;
  mappingEntries: MappingEntry[];
  residualRisk: 'high_risk' | 'review_recommended' | 'clean';
  riskDetails: string[];
}

export interface ReconstructionResult {
  sessionId: string;
  externalResponse: string;
  reconstructedText: string;
  reconstructedCount: number;
  unrecognizedTokens: string[];
  missingExpectedTokens: string[];
  substitutions: {
    placeholder: string;
    originalValue: string;
    occurrences: number;
  }[];
}

export interface PrivacyProfile {
  id: string;
  name: string;
  description: string;
  defaultTransformation: TransformationStrategy;
  categoryRules: Record<EntityCategory, {
    enabled: boolean;
    transformation: TransformationStrategy;
  }>;
}

export interface OllamaConfig {
  baseUrl: string;
  model: string;
  embeddingModel: string;
  timeoutSeconds: number;
}

export interface OllamaStatus {
  connected: boolean;
  activeModel: string;
  availableModels: string[];
  latencyMs?: number;
  error?: string;
  checkedAt: string;
}

export interface ExtractionTemplate {
  id: string;
  name: string;
  description: string;
  fields: {
    key: string;
    label: string;
    description: string;
    dataType: 'string' | 'number' | 'date' | 'array';
  }[];
}

export interface ExtractedFieldResult {
  key: string;
  label: string;
  value: string;
  found: boolean;
  citations: EvidenceCitation[];
}

export interface ComparisonResult {
  documentA: { id: string; title: string };
  documentB: { id: string; title: string };
  summaryDifferences: string;
  clauses: {
    topic: string;
    docAStatement: string;
    docACitations: EvidenceCitation[];
    docBStatement: string;
    docBCitations: EvidenceCitation[];
    status: 'identical' | 'differing' | 'exclusive_to_a' | 'exclusive_to_b';
  }[];
}

export interface ContradictionResult {
  items: {
    id: string;
    topic: string;
    claimA: string;
    citationA: EvidenceCitation;
    claimB: string;
    citationB: EvidenceCitation;
    natureOfConflict: 'direct_contradiction' | 'scope_difference' | 'date_divergence';
    explanation: string;
  }[];
}

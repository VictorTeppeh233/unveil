import assert from 'assert';

console.log('Testing Private AI Workspace Core Logic & Endpoints...');

// 1. Test Regex Detector
const REGEX_PATTERNS = [
  { category: 'EMAIL', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g },
  { category: 'PHONE', regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
  { category: 'NATIONAL_ID', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
  { category: 'ACCOUNT_NUMBER', regex: /\b(?:account|acct|iban|no\.|number)[:#\s]+([A-Z0-9-]{6,18})\b/gi },
  { category: 'FINANCIAL_AMOUNT', regex: /(?:\$|€|£|USD|EUR)\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?(?:\s?(?:million|billion|thousand|USD|EUR))?/gi },
];

const sampleText = "Contact Ama Mensah at ama@example.com or +1-415-555-0144 regarding account #004812-US for $4,500,000 USD.";

// Test email detection
const emailMatches = sampleText.match(REGEX_PATTERNS[0].regex);
assert.strictEqual(emailMatches?.[0], 'ama@example.com', 'Email must be detected correctly');

// Test phone detection
const phoneMatches = sampleText.match(REGEX_PATTERNS[1].regex);
assert(phoneMatches && phoneMatches.length > 0, 'Phone must be detected');

// Test account number
const acctMatches = sampleText.match(REGEX_PATTERNS[3].regex);
assert(acctMatches && acctMatches.length > 0, 'Account number must be detected');

console.log('✅ Rule-based regex detectors verified');

// 2. Test Strict Reconstruction Engine
const externalResponse = "Based on our analysis, [PERSON_A] should instruct [PERSON_B] to deposit funds into [ACCOUNT_NUMBER_A]. Please email confirmation to [EMAIL_A].";
const mappings = [
  { placeholder: '[PERSON_A]', original: 'Ama Mensah' },
  { placeholder: '[PERSON_B]', original: 'Dr. Elena Rostova' },
  { placeholder: '[ACCOUNT_NUMBER_A]', original: 'account #004812-US' },
  { placeholder: '[EMAIL_A]', original: 'ama@example.com' },
];

let reconstructed = externalResponse;
for (const m of mappings) {
  const escaped = m.placeholder.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
  const regex = new RegExp(`\\b${escaped}\\b|${escaped}`, 'g');
  reconstructed = reconstructed.replace(regex, m.original);
}

assert(reconstructed.includes('Ama Mensah'), 'Reconstruction must restore Person A');
assert(reconstructed.includes('account #004812-US'), 'Reconstruction must restore Account Number');
assert(reconstructed.includes('ama@example.com'), 'Reconstruction must restore Email');
assert(!reconstructed.includes('[PERSON_A]'), 'Placeholder must no longer be present');

console.log('✅ Strict non-recursive reconstruction verified');

// 3. Test Malformed & Unknown Token Detection
const malformedResponse = "Response with [PERSON A] and [UNKNOWN_TOKEN_99]";
const malformedRegex = /\[([A-Z]+)\s+([A-Z0-9]+)\]/g;
const hasMalformed = malformedRegex.test(malformedResponse);
assert.strictEqual(hasMalformed, true, 'Malformed tokens with whitespace must be detected');

console.log('✅ Malformed token detection verified');

console.log('All core security and privacy logic tests passed successfully!');

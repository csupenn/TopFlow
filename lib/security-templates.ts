import type { StoredWorkflow } from "./storage"
import { GITHUB_SCANNER_NODES, GITHUB_SCANNER_EDGES } from "./templates/github-scanner"

/**
 * Security-focused workflow templates demonstrating
 * compliance automation, privacy protection, and security controls
 */

export function getSecurityTemplates(): StoredWorkflow[] {
  const now = new Date().toISOString()

  // Templates are ordered for homepage display
  return [
    // Template 0: GitHub Repository Security Scanner (MVP Demo)
    {
      id: "github-security-scanner",
      name: "GitHub Repository Security Scanner",
      description:
        "Analyze any GitHub repository for security vulnerabilities, code quality, and OWASP compliance in under 30 seconds. Features parallel data fetching, weighted scoring algorithm, conditional branching, and AI-powered recommendations.",
      version: 1,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["github", "security", "demo", "popular", "compliance", "owasp"],
      category: "security",
      securityScore: 98,
      compliance: ["OWASP Top 10", "CWE Top 25", "NIST SSDF"],
      nodes: GITHUB_SCANNER_NODES,
      edges: GITHUB_SCANNER_EDGES,
    },
    // Template 1: GDPR Data Access Request Automation
    {
      id: "template-gdpr-access-request",
      name: "GDPR Data Access Request Handler",
      description:
        "Processes GDPR Article 15 requests end-to-end: intake parsing, identity verification, data retrieval, redaction, and audit logging.",
      version: 2,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["gdpr", "compliance", "privacy", "automation"],
      category: "security",
      securityScore: 95,
      compliance: ["GDPR", "ISO27001"],
      nodes: [
        {
          id: "gdpr-start",
          type: "start",
          position: { x: 100, y: 100 },
          data: {},
        },
        {
          id: "gdpr-intake-email",
          type: "prompt",
          position: { x: 100, y: 250 },
          data: {
            content:
              "From: Amelia Ellis <amelia.ellis@acme.eu>\nDate: 5 January 2026\nSubject: GDPR Article 15 Data Access Request\n\nAccount IDs: CRM-49318, Loyalty: ACME-0091\nChannel: email\n\nDear Data Protection Officer,\n\nI am exercising my rights under GDPR Article 15 to obtain a copy of all personal data related to my account, marketing preferences, fraud investigations, and support tickets for the past 18 months. I would also like to confirm whether my data was shared with third-party processors.\n\nVerification documents:\n- Passport ending in 7331 (attached)\n- Signed declaration dated 5 January 2026 (attached)\n\nPreferred delivery format: CSV + PDF bundle via secure portal\n\nThank you,\nAmelia Ellis\namelia.ellis@acme.eu",
          },
        },
        {
          id: "gdpr-intake-parser",
          type: "textModel",
          position: { x: 100, y: 420 },
            data: {
              model: "openai/gpt-4o-mini",
              temperature: 0.1,
              maxTokens: 600,
              structuredOutput: true,
              schemaName: "DSARRequest",
              schema: `z.object({
  requestId: z.string().describe("Unique request ID in format REQ-XXXXXX"),
  requester: z.string().describe("Full name of the data subject"),
  email: z.string().email().describe("Email address of requester"),
  accountIdentifiers: z.array(z.string()).describe("Account IDs, customer numbers, loyalty IDs"),
  channel: z.enum(["email", "web_form", "postal", "phone"]).describe("How request was received"),
  jurisdiction: z.enum(["EU", "UK", "California", "Other"]).describe("Jurisdiction (EU for GDPR, UK for UK GDPR, California for CCPA)"),
  urgency: z.enum(["routine", "expedited", "legal_request"]).describe("Urgency level: routine (default), expedited (urgent deadline mentioned), legal_request (court order/lawyer)"),
  dataCategories: z.array(z.string()).describe("Categories of data requested"),
  preferredFormat: z.string().describe("Preferred delivery format"),
  justification: z.string().describe("Legal basis cited (e.g. GDPR Article 15)"),
  identityDocuments: z.object({
    govIdLast4: z.string().nullable().describe("Last 4 digits of government ID"),
    signedStatement: z.string().nullable().describe("Date of signed attestation"),
    utilityBill: z.string().nullable().describe("Utility bill date if provided")
  }),
  verificationConfidence: z.number().min(0).max(1).describe("Confidence score for identity verification (0-1). Use 0.9+ only if all verification artifacts are explicitly mentioned. Be conservative."),
  dueDate: z.string().describe("Calculated due date (30 days from receipt)"),
  notes: z.string().describe("Additional notes or special requirements")
})`,
              systemPrompt:
              "You are a GDPR intake parser. Extract information from the DSAR email and populate the structured output schema. Generate a unique requestId in format REQ-XXXXXX. Use null for missing identity documents. Calculate dueDate as 30 days from today. Determine jurisdiction: look for GDPR (EU), UK GDPR (UK), CCPA (California), or default to EU. Classify urgency: routine (default), expedited (mentions urgent/deadline), legal_request (court order/lawyer). Calculate verificationConfidence (0-1) based on identity documents provided - be conservative, only 0.9+ if all artifacts are explicitly mentioned.",
            },
          },
        {
          id: "gdpr-classifier-brief",
          type: "prompt",
          position: { x: 550, y: 100 },
            data: {
              content:
              "Structured DSAR payload:\n$input1\n\nReturn your classification in the following format:\n```\n```json\n{ \"category\": \"standard_access\", ... }\n```\n---TEXT---\nOptional analyst guidance.\n```\nJSON must contain category, riskLevel, requiresManualReview, justificationSummary, recommendedSLAHours, justificationArticles[].",
            },
          },
        {
          id: "gdpr-classifier",
          type: "textModel",
          position: { x: 550, y: 280 },
          data: {
            model: "openai/gpt-4o-mini",
            temperature: 0.2,
            maxTokens: 400,
            structuredOutput: true,
            schemaName: "DSARClassification",
            schema: `z.object({
  category: z.enum(["standard_access", "complex_access", "rectification", "erasure", "portability"]).describe("Request category"),
  riskLevel: z.enum(["low", "medium", "high", "critical"]).describe("Risk assessment"),
  requiresManualReview: z.boolean().describe("Whether manual review is needed"),
  justificationSummary: z.string().describe("Brief explanation of classification"),
  recommendedSLAHours: z.number().describe("Recommended SLA in hours (72, 240, or 720)"),
  justificationArticles: z.array(z.string()).describe("Relevant GDPR articles cited")
})`,
            systemPrompt:
              "You are a privacy compliance analyst. Analyze the DSAR request and classify its category, risk level, and recommended SLA. Cite relevant GDPR articles.",
          },
        },
        {
          id: "gdpr-verification-js",
          type: "javascript",
          position: { x: 1000, y: 100 },
          data: {
            code: `// Handle both JSON objects (from structured output) and JSON strings
const extractJson = (content) => {
  if (!content) return null;

  // If already an object, return it directly
  if (typeof content === 'object' && content !== null) {
    return content;
  }

  // Convert to string for parsing
  const text = String(content).trim();

  // Try 1: Extract from markdown code blocks (using string to avoid backtick issues)
  const backtick = String.fromCharCode(96); // Backtick character
  const codeBlockPattern = new RegExp(backtick + '{3}(?:json)?\\\\s*([\\\\s\\\\S]*?)' + backtick + '{3}');
  const match = text.match(codeBlockPattern);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Try 2: Find JSON object boundaries
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    try {
      return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Try 3: Parse entire text as JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

// Parse inputs (handles both objects from structured output and strings)
const request = extractJson(input1) || {};
const classification = extractJson(input2) || {};

// Calculate verification confidence score
const hasGovId = request.identityDocuments?.govIdLast4 !== null;
const hasSignedStatement = request.identityDocuments?.signedStatement !== null;
const hasUtilityBill = request.identityDocuments?.utilityBill !== null;
const documentsCount = [hasGovId, hasSignedStatement, hasUtilityBill].filter(Boolean).length;
const documentScore = documentsCount / 3; // 0.0 to 1.0
const baseConfidence = request.verificationConfidence || 0.5;
const finalConfidence = Math.round(((baseConfidence + documentScore) / 2) * 100) / 100;

// Determine approval based on confidence threshold and document count
const approved = finalConfidence >= 0.7 && documentsCount >= 2;

// Build verification evidence list
const evidence = [];
if (hasGovId) evidence.push("Government ID (last 4 digits verified)");
if (hasSignedStatement) evidence.push("Signed attestation (" + request.identityDocuments.signedStatement + ")");
if (hasUtilityBill) evidence.push("Utility bill (" + request.identityDocuments.utilityBill + ")");

// Identify missing documents
const missingDocs = [];
if (!hasGovId) missingDocs.push("Government ID last 4 digits");
if (!hasSignedStatement) missingDocs.push("Signed attestation");
if (!hasUtilityBill) missingDocs.push("Utility bill (recommended)");

// Risk flags
const riskFlags = [];
if (request.urgency === "expedited") riskFlags.push("Expedited request - tight deadline");
if (request.urgency === "legal_request") riskFlags.push("Legal request - court order/lawyer involved");
if (classification.riskLevel === "high" || classification.riskLevel === "critical") {
  riskFlags.push("High-risk classification - manual review recommended");
}
if (finalConfidence < 0.7) riskFlags.push("Low verification confidence - additional checks needed");

// Compliance articles
const complianceArticles = approved
  ? ["GDPR Article 12", "GDPR Article 15"]
  : ["GDPR Article 12(6) - Identity verification"];

// Generate verification context
return {
  verified: approved,
  confidence: finalConfidence,
  evidence: evidence,
  missingDocs: approved ? [] : missingDocs,
  riskFlags: riskFlags,
  requestId: request.requestId || "REQ-" + Date.now(),
  requester: request.requester || "Unknown data subject",
  email: request.email || "unknown@domain.com",
  channel: request.channel || "email",
  jurisdiction: request.jurisdiction || "EU",
  urgency: request.urgency || "routine",
  preferredFormat: request.preferredFormat || "secure portal",
  category: classification.category || "standard_access",
  riskLevel: classification.riskLevel || "medium",
  dataCategories: request.dataCategories || [],
  slaHours: classification.recommendedSLAHours || 72,
  complianceArticles: complianceArticles,
  audit: {
    verifiedAt: new Date().toISOString(),
    verificationMethod: "automated_document_check",
    documentsProvided: documentsCount,
    confidenceThreshold: 0.7,
    passed: approved,
    verificationSummary: approved
      ? "Identity verified with confidence score " + finalConfidence + ". Documents: " + evidence.join(", ")
      : "Additional verification required. Confidence: " + finalConfidence + ". Missing: " + missingDocs.join(", "),
    riskAssessment: riskFlags.length > 0 ? riskFlags.join("; ") : "No risk flags",
    gdprArticles: complianceArticles
  },
  payload: request,
  classification: classification
};`,
          },
        },
        {
          id: "gdpr-decision",
          type: "conditional",
          position: { x: 1450, y: 100 },
          data: {
            condition: "input1.verified === true",
            description: "Route based on identity verification result",
          },
        },
        {
          id: "gdpr-crm-lookup",
          type: "javascript",
          position: { x: 1800, y: 100 },
          data: {
            code: `// DEMO MODE: Mock CRM lookup
// In production, replace with actual HTTP request to your CRM/database
// Example: fetch('https://your-api.com/users/lookup', { ... })

const context = input1 || {};
const requestId = context.requestId || "REQ-DEMO";
const requester = context.requester || "Demo User";
const email = context.email || "demo@example.com";

// Mock CRM profile data
return {
  requestId: requestId,
  requesterName: requester,
  requesterEmail: email,
  accountId: "ACC-" + Math.floor(Math.random() * 100000),
  createdAt: "2024-01-15T10:30:00Z",
  status: "active",
  dataLocations: [
    "crm_database",
    "marketing_platform",
    "support_system"
  ],
  estimatedDataSize: "~2.4 MB",
  thirdPartyProcessors: [
    "SendGrid (email delivery)",
    "Stripe (payment processing)"
  ],
  note: "🎬 DEMO DATA - Replace this JavaScript node with HTTP Request in production"
};`,
          },
        },
        {
          id: "gdpr-data-export",
          type: "javascript",
          position: { x: 2150, y: 100 },
          data: {
            code: `// DEMO MODE: Mock data export
// In production, replace with actual HTTP request to your data export API
// Example: fetch('https://your-api.com/gdpr/export', { ... })

const request = input1 || {};
const crmProfile = input2 || {};

// Mock exported data bundle
return {
  exportId: "EXP-" + Date.now(),
  requestId: request.requestId || "REQ-DEMO",
  requester: request.requester || crmProfile.requesterName || "Demo User",
  exportedAt: new Date().toISOString(),
  sections: [
    {
      name: "account_profile",
      records: 1,
      pii: ["full_name", "email", "address", "phone"],
      dataPoints: 47
    },
    {
      name: "marketing_preferences",
      records: 12,
      pii: ["email", "phone"],
      dataPoints: 23
    },
    {
      name: "support_tickets",
      records: 8,
      pii: ["name", "email", "ip_address"],
      dataPoints: 156
    },
    {
      name: "payment_history",
      records: 5,
      pii: ["name", "billing_address"],
      dataPoints: 34
    }
  ],
  totalRecords: 26,
  totalDataPoints: 260,
  estimatedSize: "2.4 MB",
  formats: ["csv", "pdf", "json"],
  note: "🎬 DEMO DATA - Replace this JavaScript node with HTTP Request in production"
};`,
          },
        },
        {
          id: "gdpr-redaction-engine",
          type: "javascript",
          position: { x: 2500, y: 100 },
          data: {
            code: `const exportBundle = typeof input1 === "string" ? JSON.parse(input1) : input1 || {};
const sections = exportBundle.sections || [
  { name: "account_profile", pii: ["full_name", "address", "email"] },
  { name: "marketing_preferences", pii: ["email", "phone"] },
  { name: "support_tickets", pii: ["names", "ip_address"] },
];

const redactionLog = sections.map((section) => ({
  section: section.name,
  piiFields: section.pii || [],
  redacted: section.pii ? section.pii.length : 0,
  checksum: \`sha256:\${section.name}-mask\`,
}));

const totalFields = redactionLog.reduce((sum, entry) => sum + entry.redacted, 0);

return {
  bundleSummary: {
    sections: sections.length,
    redactedFields: totalFields,
    deliveredFormats: ["csv", "pdf"],
  },
  evidence: redactionLog,
  downloadUrl: "https://secure.topflow.dev/downloads/REQ-230015.zip",
};`,
          },
        },
        {
          id: "gdpr-response-brief",
          type: "prompt",
          position: { x: 2850, y: 100 },
          data: {
            content:
              "Verification context:\n$input1\n\nData export payload:\n$input2\n\nRedaction evidence:\n$input3\n\nDraft a GDPR Article 15 fulfillment letter summarizing what data is attached, timelines, security controls, and how the requester can escalate. Include compliance references and contact info. Respond in well-formatted plain text.",
          },
        },
        {
          id: "gdpr-response-letter",
          type: "textModel",
          position: { x: 3200, y: 100 },
          data: {
            model: "openai/gpt-4o",
            temperature: 0.2,
            maxTokens: 800,
            systemPrompt:
              "You are TopFlow's compliance officer. Produce formal GDPR response letters with clear sections (Summary, Data Provided, Security Controls, Next Steps).",
          },
        },
        {
          id: "gdpr-final-package",
          type: "javascript",
          position: { x: 3550, y: 100 },
          data: {
            code: `const verification = typeof input1 === "string" ? JSON.parse(input1) : input1 || {};
const redaction = typeof input2 === "string" ? JSON.parse(input2) : input2 || {};
const letter = input3;

return {
  status: "fulfilled",
  requestId: verification.requestId,
  requester: verification.requester,
  channel: verification.channel,
  dataCategories: verification.dataCategories,
  responseLetter: letter,
  attachments: {
    downloadUrl: redaction.downloadUrl,
    bundleSummary: redaction.bundleSummary,
    redactionEvidence: redaction.evidence,
  },
  audit: verification.audit,
  completedAt: new Date().toISOString(),
};`,
          },
        },
        {
          id: "gdpr-audit-trail",
          type: "structuredOutput",
          position: { x: 3900, y: 100 },
          data: {
            name: "Audit Trail Generator",
            schema: `{
  "requestId": "string",
  "requesterName": "string",
  "requesterEmail": "string",
  "verificationStatus": "approved | rejected",
  "verificationEvidence": ["string"],
  "processedAt": "ISO timestamp",
  "slaDeadline": "ISO timestamp",
  "dataCategories": ["string"],
  "redactionScore": "number (0-1)",
  "reviewer": "string",
  "complianceArticles": ["GDPR Article 12", "GDPR Article 15"],
  "outputFormat": "JSON"
}`,
            prompt: `Based on the workflow execution, generate a complete audit trail:

Request ID: Extract from intake parsing (Node 3 output)
Requester: Extract name and email from intake
Verification Status: Extract from verification decision (Node 5 output)
Verification Evidence: List documents provided (passport, utility bill, signed attestation)
Processed At: Current timestamp
SLA Deadline: 30 days from request received date
Data Categories: Extract categories from intake (marketing, transactions, profile, etc.)
Redaction Score: Extract from redaction node (Node 10 output) - percentage of PII redacted
Reviewer: "Automated System" for demo, actual reviewer name in production
Compliance Articles: GDPR Article 12 (identity verification), Article 15 (right of access)

Return ONLY the JSON object with no additional text.

Input context: $input1`,
          },
        },
        {
          id: "gdpr-end-fulfilled",
          type: "end",
          position: { x: 4250, y: 100 },
          data: {},
        },
        {
          id: "gdpr-rejection-brief",
          type: "prompt",
          position: { x: 1800, y: 700 },
          data: {
            content:
              "Verification failure details:\n$input1\n\nGenerate a GDPR Article 12(6) clarification note explaining which documents are missing, how to resubmit securely, and SLA impact. Keep tone professional and cite the regulation.",
          },
        },
        {
          id: "gdpr-rejection-letter",
          type: "textModel",
          position: { x: 2150, y: 700 },
          data: {
            model: "openai/gpt-4o-mini",
            temperature: 0.2,
            maxTokens: 400,
            systemPrompt:
              "Write clear compliance notifications when requests cannot be fulfilled yet. Always cite Article 12(6) and list exact verification steps required.",
          },
        },
        {
          id: "gdpr-rejection-package",
          type: "javascript",
          position: { x: 2500, y: 700 },
          data: {
            code: `const verification = typeof input1 === "string" ? JSON.parse(input1) : input1 || {};
const letter = input2;

return {
  status: "pending_verification",
  requestId: verification.requestId,
  requester: verification.requester,
  missingDocuments: verification.missingDocs,
  responseLetter: letter,
  audit: verification.audit,
  nextSteps: "Awaiting identity verification artifacts before releasing data.",
  updatedAt: new Date().toISOString(),
};`,
          },
        },
        {
          id: "gdpr-end-rejected",
          type: "end",
          position: { x: 2850, y: 700 },
          data: {},
        },
      ],
      edges: [
        { id: "gdpr-e1", source: "gdpr-start", target: "gdpr-intake-email" },
        { id: "gdpr-e2", source: "gdpr-intake-email", target: "gdpr-intake-parser" },
        { id: "gdpr-e3", source: "gdpr-intake-parser", target: "gdpr-classifier-brief" },
        { id: "gdpr-e4", source: "gdpr-classifier-brief", target: "gdpr-classifier" },
        { id: "gdpr-e5", source: "gdpr-intake-parser", target: "gdpr-verification-js" },
        { id: "gdpr-e6", source: "gdpr-classifier", target: "gdpr-verification-js" },
        { id: "gdpr-e7", source: "gdpr-verification-js", target: "gdpr-decision" },
        { id: "gdpr-e8", source: "gdpr-decision", target: "gdpr-crm-lookup", sourceHandle: "true" },
        { id: "gdpr-e9", source: "gdpr-verification-js", target: "gdpr-crm-lookup" },
        { id: "gdpr-e10", source: "gdpr-verification-js", target: "gdpr-data-export" },
        { id: "gdpr-e11", source: "gdpr-crm-lookup", target: "gdpr-data-export" },
        { id: "gdpr-e12", source: "gdpr-data-export", target: "gdpr-redaction-engine" },
        { id: "gdpr-e13", source: "gdpr-verification-js", target: "gdpr-response-brief" },
        { id: "gdpr-e14", source: "gdpr-data-export", target: "gdpr-response-brief" },
        { id: "gdpr-e15", source: "gdpr-redaction-engine", target: "gdpr-response-brief" },
        { id: "gdpr-e16", source: "gdpr-response-brief", target: "gdpr-response-letter" },
        { id: "gdpr-e17", source: "gdpr-verification-js", target: "gdpr-final-package" },
        { id: "gdpr-e18", source: "gdpr-redaction-engine", target: "gdpr-final-package" },
        { id: "gdpr-e19", source: "gdpr-response-letter", target: "gdpr-final-package" },
        { id: "gdpr-e20", source: "gdpr-final-package", target: "gdpr-audit-trail" },
        { id: "gdpr-e20-audit", source: "gdpr-audit-trail", target: "gdpr-end-fulfilled" },
        { id: "gdpr-e21", source: "gdpr-decision", target: "gdpr-rejection-brief", sourceHandle: "false" },
        { id: "gdpr-e22", source: "gdpr-verification-js", target: "gdpr-rejection-brief" },
        { id: "gdpr-e23", source: "gdpr-rejection-brief", target: "gdpr-rejection-letter" },
        { id: "gdpr-e24", source: "gdpr-verification-js", target: "gdpr-rejection-package" },
        { id: "gdpr-e25", source: "gdpr-rejection-letter", target: "gdpr-rejection-package" },
        { id: "gdpr-e26", source: "gdpr-rejection-package", target: "gdpr-end-rejected" },
      ],
    },

    // Template 2: PII Detection & Redaction Pipeline
    {
      id: "template-pii-detection",
      name: "PII Detection & Redaction Pipeline",
      description: "Scans documents for sensitive data (SSN, credit cards, health info), applies intelligent redaction, and generates GDPR/CCPA/CPRA/HIPAA compliance reports with risk scoring",
      version: 1,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["privacy", "pii", "redaction", "compliance", "ccpa", "cpra"],
      category: "security",
      securityScore: 98,
      compliance: ["GDPR", "CCPA", "CPRA", "HIPAA"],
      nodes: [
        {
          id: "start-2",
          type: "start",
          position: { x: 50, y: 250 },
          data: {}
        },
        {
          id: "prompt-2",
          type: "prompt",
          position: { x: 250, y: 250 },
          data: {
            prompt: "Document to scan for PII:\n\n$input1\n\nIdentify all sensitive information including:\n- Personal identifiers (SSN, passport, driver's license)\n- Financial data (credit cards, bank accounts)\n- Health information (diagnoses, medications)\n- Contact details (email, phone, address)"
          }
        },
        {
          id: "text-3",
          type: "textModel",
          position: { x: 500, y: 250 },
          data: {
            model: "anthropic/claude-3-opus-20240229",
            temperature: 0.1,
            maxTokens: 1000,
            systemPrompt: "You are a PII detection specialist. Identify and categorize all personally identifiable information with high precision. Follow NIST SP 800-122 guidelines."
          }
        },
        {
          id: "js-2",
          type: "javascript",
          position: { x: 750, y: 250 },
          data: {
            code: `// Advanced PII Detection Engine
const text = input1;
const detectedPII = [];

// Pattern definitions with confidence scores
const patterns = {
  high_risk: {
    ssn: { regex: /\\b\\d{3}-\\d{2}-\\d{4}\\b/g, confidence: 0.95 },
    creditCard: { regex: /\\b(?:\\d{4}[\\s-]?){3}\\d{4}\\b/g, confidence: 0.90 },
    passport: { regex: /\\b[A-Z]{1,2}\\d{6,9}\\b/g, confidence: 0.85 },
    bankAccount: { regex: /\\b\\d{8,17}\\b/g, confidence: 0.70 }
  },
  medium_risk: {
    email: { regex: /\\b[\\w._%+-]+@[\\w.-]+\\.[A-Z|a-z]{2,}\\b/gi, confidence: 0.99 },
    phone: { regex: /\\b(?:\\+1)?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}\\b/g, confidence: 0.85 },
    dateOfBirth: { regex: /\\b(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])\\/(?:19|20)\\d{2}\\b/g, confidence: 0.75 }
  },
  low_risk: {
    name: { regex: /\\b[A-Z][a-z]+ [A-Z][a-z]+\\b/g, confidence: 0.60 },
    address: { regex: /\\b\\d+\\s+[A-Za-z\\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)\\b/gi, confidence: 0.70 }
  }
};

let redactedText = text;
let riskScore = 0;

// Scan for each pattern type
for (const [riskLevel, levelPatterns] of Object.entries(patterns)) {
  for (const [dataType, config] of Object.entries(levelPatterns)) {
    const matches = text.match(config.regex);
    if (matches) {
      const riskMultiplier = riskLevel === 'high_risk' ? 3 : riskLevel === 'medium_risk' ? 2 : 1;
      riskScore += matches.length * config.confidence * riskMultiplier;

      detectedPII.push({
        type: dataType,
        risk_level: riskLevel,
        count: matches.length,
        confidence: config.confidence,
        samples: matches.slice(0, 3).map(m => m.substring(0, 4) + '***')
      });

      // Apply redaction
      redactedText = redactedText.replace(config.regex, '[' + dataType.toUpperCase() + '-REDACTED]');
    }
  }
}

return {
  risk_score: Math.min(100, Math.round(riskScore)),
  pii_found: detectedPII.length > 0,
  categories_detected: detectedPII.map(p => p.type),
  detailed_findings: detectedPII,
  redacted_text: redactedText,
  compliance_check: {
    gdpr_compliant: riskScore < 50,
    ccpa_compliant: riskScore < 60,
    cpra_compliant: riskScore < 60, // CPRA has similar thresholds to CCPA
    hipaa_compliant: !detectedPII.some(p => p.type === 'health')
  }
};`
          }
        },
        {
          id: "struct-1",
          type: "structuredOutput",
          position: { x: 1000, y: 250 },
          data: {
            schema: `{
  "type": "object",
  "properties": {
    "report": {
      "type": "object",
      "properties": {
        "scan_date": { "type": "string", "format": "date-time" },
        "document_id": { "type": "string" },
        "risk_level": { "type": "string", "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
        "pii_summary": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "category": { "type": "string" },
              "count": { "type": "number" },
              "redacted": { "type": "boolean" }
            }
          }
        },
        "compliance_status": {
          "type": "object",
          "properties": {
            "gdpr": { "type": "boolean" },
            "ccpa": { "type": "boolean" },
            "cpra": { "type": "boolean" },
            "hipaa": { "type": "boolean" }
          }
        },
        "recommendations": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}`
          }
        },
        {
          id: "end-2",
          type: "end",
          position: { x: 1250, y: 250 },
          data: {}
        }
      ],
      edges: [
        { id: "e2-1", source: "start-2", target: "prompt-2" },
        { id: "e2-2", source: "prompt-2", target: "text-3" },
        { id: "e2-3", source: "text-3", target: "js-2" },
        { id: "e2-4", source: "js-2", target: "struct-1" },
        { id: "e2-5", source: "struct-1", target: "end-2" }
      ]
    },

    // Template 3: EU AI Act High-Risk AI System Assessment
    {
      id: "template-eu-ai-act-assessment",
      name: "EU AI Act High-Risk AI System Assessment",
      description:
        "Comprehensive EU AI Act compliance assessment workflow. AI-powered classification against all 8 Annex III high-risk categories, Article 11 technical documentation generator (10-section checklist), GDPR-AI Act intersection analysis (Article 22 automated decision-making), conformity assessment routing (internal vs. notified body), and prioritized risk mitigation recommendations.",
      version: 1,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["eu-ai-act", "annex-iii", "high-risk-ai", "article-11", "gdpr", "conformity-assessment", "ai-compliance"],
      category: "security",
      securityScore: 98,
      compliance: ["EU AI Act (Regulation 2024/1689)", "GDPR Article 22", "ISO 42001"],
      nodes: [
        {
          id: "ai-act-start",
          type: "start",
          position: { x: 100, y: 300 },
          data: {},
        },
        {
          id: "ai-act-info",
          type: "prompt",
          position: { x: 400, y: 300 },
          data: {
            content:
              "EU AI Act High-Risk AI System Assessment Workflow (Coming Soon)\n\nThis workflow automates:\n• AI system description intake (7 structured fields)\n• Annex III classification (all 8 high-risk categories: biometric ID, critical infrastructure, education, employment, essential services, law enforcement, migration, justice)\n• Risk score calculation (0-100 scale with aggravating factors)\n• Article 11 technical documentation generator (10-section compliance checklist)\n• GDPR-AI Act intersection analysis (Article 22 automated decision-making overlap)\n• Conformity assessment router (internal control vs. notified body pathway)\n• Prioritized risk mitigation recommendations (CRITICAL/HIGH/MEDIUM/LOW)\n• DPO consultation trigger (if GDPR Article 22 applies)\n\nDemo scenario: ResumeRanker Pro - AI-Powered Hiring Assistant\n• Use case: Automated resume screening with 50% auto-rejection rate\n• Deployment: EU (Germany, France, Netherlands) + 12,000 applications/month\n• Classification: HIGH-RISK (Annex III Point 4 - Employment)\n• Risk Score: 95/100 (CRITICAL)\n• Key Finding: NON-COMPLIANT with Article 14 (human oversight) + GDPR Article 22\n\nExpected outputs:\n• Risk classification report: HIGH-RISK, Annex III Point 4(a)\n• Article 11 technical documentation checklist (10 sections):\n  1. General description\n  2. Detailed design (model architecture, data requirements)\n  3. Development process (training methodology, bias mitigation)\n  4. Validation and testing (performance metrics, fairness testing)\n  5. Risk management (identified risks, mitigations, residual risks)\n  6. Human oversight (current gaps identified)\n  7. Accuracy, robustness, cybersecurity\n  8. Data governance (training data provenance)\n  9. Conformity assessment pathway\n  10. Transparency and user information\n• Compliance roadmap: 3-phase plan (3 weeks critical fixes, 4-8 weeks conformity assessment, 9-12 weeks total)\n• Cost estimate: €68K-115K (internal pathway) or €118K-260K (notified body pathway)\n• Final recommendation: DO NOT DEPLOY until critical gaps resolved\n\nExecution time: 45-90 seconds (13 nodes)\nCompliance: EU AI Act Regulation 2024/1689, GDPR Article 22, ISO 42001\n\n→ This template will be available in Phase 0 pre-launch (Jan 11-12, 2026)",
          },
        },
        {
          id: "ai-act-end",
          type: "end",
          position: { x: 750, y: 300 },
          data: {},
        },
      ],
      edges: [
        { id: "e-ai-act-1", source: "ai-act-start", target: "ai-act-info" },
        { id: "e-ai-act-2", source: "ai-act-info", target: "ai-act-end" },
      ],
    },

    // Template 4: HIPAA Patient Data Access Request
    {
      id: "template-hipaa-patient-access",
      name: "HIPAA Patient Data Access Request Handler",
      description:
        "Automates HIPAA Right of Access requests per 45 CFR § 164.524. Includes identity verification (DOB, MRN, SSN), PHI retrieval, AI-powered TPO redaction, FHIR R4 bundle generation (HL7 compliant), 30-day SLA tracking, and audit logging with 6-year retention.",
      version: 1,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["hipaa", "patient-access", "fhir", "phi", "healthcare", "right-of-access", "45-cfr-164"],
      category: "security",
      securityScore: 97,
      compliance: ["HIPAA", "45 CFR § 164.524", "FHIR R4", "HL7"],
      nodes: [
        {
          id: "hipaa-start",
          type: "start",
          position: { x: 100, y: 300 },
          data: {},
        },
        {
          id: "hipaa-info",
          type: "prompt",
          position: { x: 400, y: 300 },
          data: {
            content:
              "HIPAA Patient Data Access Request Workflow (Coming Soon)\n\nThis workflow automates:\n• Patient identity verification (DOB, MRN, SSN last 4)\n• PHI category classification (Conditions, Medications, Labs, Imaging, Visits)\n• AI-powered TPO redaction (Treatment/Payment/Operations filtering per 45 CFR § 164.524)\n• FHIR R4 bundle generation (HL7 standard compliance)\n• 30-day SLA countdown tracking\n• Audit log generation (SHA256 hash, 6-year retention)\n• Patient notification letter generation\n\nDemo scenario: Sarah Johnson (age 40, MRN-849271)\n• Medical history: Type 2 diabetes, hypertension\n• Records requested: 23 items (conditions, medications, lab results, visits)\n• Request date: Jan 8, 2026\n• Due date: Feb 7, 2026 (30-day SLA)\n\nExpected outputs:\n• FHIR R4 Bundle (1500+ lines JSON) with:\n  - Patient resource (demographics)\n  - Condition resources (diabetes, hypertension)\n  - MedicationStatement resources (metformin, lisinopril)\n  - Observation resources (lab results: HbA1c, blood pressure)\n  - DiagnosticReport resources (lipid panel, urinalysis)\n  - Encounter resources (office visits, telehealth)\n• SLA status: 22 days remaining\n• Audit log: SHA256 hash, timestamp, PHI categories accessed\n• Patient notification: Formatted letter with delivery instructions\n\nExecution time: 30-90 seconds (15 nodes)\nCompliance: HIPAA 45 CFR § 164.524, FHIR R4, HL7\n\n→ This template will be available in Phase 0 pre-launch (Jan 8-10, 2026)",
          },
        },
        {
          id: "hipaa-end",
          type: "end",
          position: { x: 750, y: 300 },
          data: {},
        },
      ],
      edges: [
        { id: "e-hipaa-1", source: "hipaa-start", target: "hipaa-info" },
        { id: "e-hipaa-2", source: "hipaa-info", target: "hipaa-end" },
      ],
    },

    // Template 5: SOC 2 Control Evidence Collection
    {
      id: "template-soc2-evidence",
      name: "SOC 2 Control Evidence Collection",
      description: "Automates collection and validation of SOC 2 Type II control evidence",
      version: 1,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["soc2", "compliance", "audit", "controls"],
      category: "security",
      securityScore: 94,
      compliance: ["SOC2", "ISO27001"],
      nodes: [
        {
          id: "start-4",
          type: "start",
          position: { x: 50, y: 250 },
          data: {}
        },
        {
          id: "prompt-5",
          type: "prompt",
          position: { x: 250, y: 250 },
          data: {
            prompt: "SOC 2 Control to evaluate:\n$input1\n\nIdentify:\n1. Control family (Security, Availability, Processing Integrity, Confidentiality, Privacy)\n2. Control ID and description\n3. Required evidence types\n4. Testing frequency\n5. Current compliance period"
          }
        },
        {
          id: "text-6",
          type: "textModel",
          position: { x: 500, y: 250 },
          data: {
            model: "anthropic/claude-3-opus-20240229",
            temperature: 0.2,
            maxTokens: 600,
            systemPrompt: "You are a SOC 2 compliance auditor. Analyze controls according to AICPA Trust Services Criteria (TSC) 2017."
          }
        },
        {
          id: "http-3",
          type: "httpRequest",
          position: { x: 750, y: 250 },
          data: {
            url: "https://api.example.com/compliance/collect-evidence",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: "{ \"control_id\": \"$input1\", \"period\": \"last_quarter\" }"
          }
        },
        {
          id: "js-4",
          type: "javascript",
          position: { x: 1000, y: 250 },
          data: {
            code: `// SOC 2 Evidence Validation
const evidence = input1;
const validationResults = [];

// Check evidence completeness
const requiredEvidence = [
  'access_logs',
  'change_management_records',
  'incident_reports',
  'training_records',
  'policy_attestations'
];

let completenessScore = 0;
const missing = [];

for (const item of requiredEvidence) {
  if (evidence && evidence[item]) {
    completenessScore += 20;
    validationResults.push({
      evidence_type: item,
      status: 'PRESENT',
      validity: 'VALID'
    });
  } else {
    missing.push(item);
    validationResults.push({
      evidence_type: item,
      status: 'MISSING',
      validity: 'INVALID'
    });
  }
}

return {
  compliance_score: completenessScore,
  is_compliant: completenessScore >= 80,
  validation_results: validationResults,
  missing_evidence: missing,
  recommendations: missing.map(item => 'Collect ' + item.replace(/_/g, ' ')),
  audit_ready: completenessScore === 100
};`
          }
        },
        {
          id: "end-4",
          type: "end",
          position: { x: 1250, y: 250 },
          data: {}
        }
      ],
      edges: [
        { id: "e4-1", source: "start-4", target: "prompt-5" },
        { id: "e4-2", source: "prompt-5", target: "text-6" },
        { id: "e4-3", source: "text-6", target: "http-3" },
        { id: "e4-4", source: "http-3", target: "js-4" },
        { id: "e4-5", source: "js-4", target: "end-4" }
      ]
    },

    // Template 6: ISO 27001 Risk Assessment Automation
    {
      id: "template-iso27001-risk-assessment",
      name: "ISO 27001 Risk Assessment Automation",
      description:
        "AI-powered ISO 27001:2022 Annex A risk assessment workflow. Classifies threats using MITRE ATT&CK + WP29 framework, calculates likelihood × impact scoring (1-25 scale), maps to Annex A.5-A.8 controls, and generates risk treatment strategies with residual risk analysis.",
      version: 1,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["iso27001", "risk-assessment", "annex-a", "mitre-attack", "compliance", "isms"],
      category: "security",
      securityScore: 96,
      compliance: ["ISO 27001:2022", "ISO 27002", "NIST CSF"],
      nodes: [
        {
          id: "iso-start",
          type: "start",
          position: { x: 100, y: 300 },
          data: {},
        },
        {
          id: "iso-info",
          type: "prompt",
          position: { x: 400, y: 300 },
          data: {
            content:
              "ISO 27001 Risk Assessment Workflow (Coming Soon)\n\nThis workflow automates:\n• System context & asset identification\n• Threat classification (MITRE ATT&CK tactics)\n• Likelihood × Impact scoring (1-25 scale)\n• Annex A control mapping (A.5-A.8)\n• Risk treatment recommendations\n• Residual risk calculation\n\nDemo scenario: Acme SaaS Corp with 5 information security risks:\n1. Unauthorized database access (External attacker)\n2. DDoS attack on API gateway (Availability threat)\n3. Insider threat - privileged user abuse (Internal actor)\n4. Supply chain compromise (Third-party vendor)\n5. S3 bucket misconfiguration (Cloud security)\n\nExpected outputs:\n• Risk register with 23-point scoring matrix\n• MITRE ATT&CK tactic mapping\n• ISO 27001 Annex A control recommendations\n• Treatment strategies (mitigate/accept/transfer/avoid)\n• Residual risk levels post-control implementation\n\nExecution time: 30-60 seconds (12 nodes)\nCompliance: ISO 27001:2022, ISO 27002, NIST CSF\n\n→ This template will be available in Phase 0 pre-launch (Jan 6-12, 2026)",
          },
        },
        {
          id: "iso-end",
          type: "end",
          position: { x: 750, y: 300 },
          data: {},
        },
      ],
      edges: [
        { id: "e-iso-1", source: "iso-start", target: "iso-info" },
        { id: "e-iso-2", source: "iso-info", target: "iso-end" },
      ],
    },

    // Template 7: OT Critical Infrastructure Defense
    {
      id: "template-ot-critical-infra",
      name: "Critical Infrastructure Defense",
      description:
        "IT/OT convergence threat monitoring for Energy, Utilities & Manufacturing. Detects lateral movement (IT → OT), generates NERC CIP-008 compliant incident reports, and visualizes Smart Grid infrastructure with state-sponsored APT intelligence.",
      version: 1,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["ot", "ics", "scada", "energy", "nerc-cip", "critical-infrastructure", "apt", "threat-intel"],
      category: "security",
      securityScore: 98,
      compliance: ["NERC CIP-008", "IEC 62443", "NIST SP 800-82"],
      nodes: [
        // Node 1: Start
        {
          id: "ot-start",
          type: "start",
          position: { x: 50, y: 350 },
          data: {},
        },
        // Node 2: IT Threat Feed
        {
          id: "ot-it-feed",
          type: "httpRequest",
          position: { x: 300, y: 200 },
          data: {
            url: "https://www.topflow.dev/api/demo-it-threat-intel",
            method: "GET",
            description: "Fetch IT/Enterprise CVE threat data (VPN, Linux, Cloud)",
          },
        },
        // Node 3: OT Threat Feed
        {
          id: "ot-ot-feed",
          type: "httpRequest",
          position: { x: 300, y: 500 },
          data: {
            url: "https://www.topflow.dev/api/demo-ot-threat-intel",
            method: "GET",
            description: "Fetch OT/ICS threat intelligence (SCADA, PLC, APT campaigns)",
          },
        },
        // Node 4: IoT/SCADA Telemetry
        {
          id: "ot-iot-telemetry",
          type: "httpRequest",
          position: { x: 600, y: 350 },
          data: {
            url: "https://www.topflow.dev/api/demo-iot-telemetry",
            method: "GET",
            description: "Real-time IoT/SCADA telemetry (heartbeat, packet loss, field devices)",
          },
        },
        // Node 5: Risk Calculator (JavaScript)
        {
          id: "ot-risk-calc",
          type: "javascript",
          position: { x: 950, y: 350 },
          data: {
            code: `// Unified IT/OT Risk Scoring Algorithm
const it_threats = input1?.data?.threats || input1?.threats || []
const ot_threats = input2?.data?.threats || input2?.threats || []
const telemetry = input3?.data || input3

// IT Risk Factors
const it_critical = it_threats.filter(t => t.severity === 'CRITICAL').length
const it_high = it_threats.filter(t => t.severity === 'HIGH').length
const it_exploitable = it_threats.filter(t => t.exploit_available).length

// OT Risk Factors (Higher weighting due to safety impact)
const ot_apt_active = ot_threats.some(t => t.type === 'APT') ? 1 : 0
const ot_scada_targeted = ot_threats.some(t => t.target?.includes('SCADA')) ? 1 : 0

// Telemetry Risk Signals
const iot_anomaly = telemetry.heartbeat_status === 'IRREGULAR' ? 1 : 0
const packet_loss_high = parseFloat(telemetry.packet_loss_percentage) > 10 ? 1 : 0

// Risk Formula (0-100 scale)
const it_risk = (it_critical * 25) + (it_high * 15) + (it_exploitable * 10)
const ot_risk = (ot_apt_active * 40) + (ot_scada_targeted * 30) + (iot_anomaly * 20) + (packet_loss_high * 15)

// Combined risk (OT weighted 1.5x due to physical safety implications)
const combined_risk = Math.min(100, it_risk + (ot_risk * 1.5))

// Priority determination
let priority = 'LOW'
let requires_nerc_report = false

if (combined_risk > 85) {
  priority = 'CRITICAL'
  requires_nerc_report = true
} else if (combined_risk > 65) {
  priority = 'HIGH'
  requires_nerc_report = true
} else if (combined_risk > 40) {
  priority = 'MEDIUM'
}

return {
  combined_risk_score: Math.round(combined_risk),
  it_risk_component: it_risk,
  ot_risk_component: ot_risk,
  priority: priority,
  requires_nerc_cip_report: requires_nerc_report,
  it_threat_count: it_threats.length,
  ot_threat_count: ot_threats.length,
  iot_alerts: telemetry.active_iot_alerts || 0,
  zone_status: telemetry.zone_segmentation || 'UNKNOWN',
  timestamp: new Date().toISOString()
}`,
          },
        },
        // Node 6: Zone Boundary Threat Checker
        {
          id: "ot-zone-checker",
          type: "javascript",
          position: { x: 1300, y: 350 },
          data: {
            code: `// Detect IT → OT lateral movement attempts
const it_threats = input1?.data?.threats || input1?.threats || []
const ot_threats = input2?.data?.threats || input2?.threats || []
const risk_data = input4

// Check for "boundary crossing" threat patterns
const vpn_compromised = it_threats.some(t =>
  t.target?.toLowerCase().includes('vpn') && t.severity === 'CRITICAL'
)

const jump_server_at_risk = it_threats.some(t =>
  t.target?.toLowerCase().includes('linux') || t.target?.toLowerCase().includes('server')
)

const ot_targeted = ot_threats.some(t =>
  t.affected_zone?.includes('OT') || t.target?.includes('SCADA')
)

// The "kill chain" for IT → OT pivot
const pivot_risk_high = vpn_compromised && jump_server_at_risk && ot_targeted

// Purdue Model zone analysis
const affected_zones = []
if (it_threats.length > 0) affected_zones.push('Zone 1 (IT/Cloud)')
if (jump_server_at_risk) affected_zones.push('Zone 2 (DMZ/Industrial DMZ)')
if (ot_targeted) affected_zones.push('Zone 3 (OT/SCADA)')

return {
  lateral_movement_risk: pivot_risk_high ? 'CRITICAL' : 'STANDARD',
  vpn_compromised: vpn_compromised,
  jump_server_at_risk: jump_server_at_risk,
  ot_layer_targeted: ot_targeted,
  affected_purdue_zones: affected_zones,
  data_diode_bypass_attempted: pivot_risk_high,
  recommendation: pivot_risk_high
    ? 'ISOLATE: Sever IT-OT connection immediately. Switch SCADA to local/manual mode.'
    : 'MONITOR: Continue observing for escalation signals.'
}`,
          },
        },
        // Node 7: Conditional - Critical Infrastructure Threat?
        {
          id: "ot-conditional",
          type: "conditional",
          position: { x: 1650, y: 350 },
          data: {
            condition: "input5.combined_risk_score > 85 || input6.lateral_movement_risk === 'CRITICAL'",
          },
        },
        // Node 8a: URGENT Alert (NERC CIP) - TRUE Branch
        {
          id: "ot-urgent-prompt",
          type: "prompt",
          position: { x: 1850, y: 150 },
          data: {
            content: `NERC CIP-008-6 CYBER SECURITY INCIDENT REPORT

Context:
- Combined Risk Score: $input5.combined_risk_score / 100
- Priority: $input5.priority
- Lateral Movement Detected: $input6.lateral_movement_risk
- Affected Zones: $input6.affected_purdue_zones
- NERC CIP Reporting Required: $input5.requires_nerc_cip_report

IT Threats: $input1
OT Threats: $input2
IoT Telemetry: $input3

Generate a NERC CIP-008-6 compliant incident report with:
1. EXECUTIVE SUMMARY (2-3 sentences for CISO/Plant Manager)
2. INCIDENT CLASSIFICATION (Reportable Cyber Security Incident per CIP-008)
3. AFFECTED ZONES (Purdue Model: Zone 1 IT → Zone 3 OT)
4. THREAT VECTORS (CVE details + APT tactics)
5. EMERGENCY ACTION PLAN (Containment, Defense, Recovery)
6. NERC CIP OBLIGATIONS (Reporting timeline, evidence preservation)

Use TLP:AMBER classification. Tone: Urgent, technical, compliance-focused.`,
          },
        },
        // Node 8b: Standard Alert - FALSE Branch
        {
          id: "ot-standard-prompt",
          type: "prompt",
          position: { x: 1850, y: 550 },
          data: {
            content: `Security Operations Center Threat Intelligence Briefing

Context:
- Combined Risk Score: $input5.combined_risk_score / 100
- Priority: $input5.priority
- IT Threats: $input1
- OT Threats: $input2
- IoT Telemetry: $input3

Generate a standard threat intelligence briefing with:
1. SUMMARY (Current threat landscape)
2. IT THREAT DETAILS (CVE analysis with CVSS scores)
3. OT CONSIDERATIONS (Any OT-specific advisories)
4. RECOMMENDED ACTIONS (Patch management, monitoring enhancements)

Tone: Informative, technical, proactive.`,
          },
        },
        // Node 9: AI Report Generator
        {
          id: "ot-ai-report",
          type: "textModel",
          position: { x: 2200, y: 350 },
          data: {
            model: "openai/gpt-4o-mini",
            temperature: 0.3,
            maxTokens: 2500,
            systemPrompt:
              "You are a critical infrastructure security expert with deep knowledge of NERC CIP, IEC 62443, and OT/ICS threat landscape. Generate clear, actionable incident reports with professional formatting.",
          },
        },
        // Node 10: Structured Output
        {
          id: "ot-structured",
          type: "structuredOutput",
          position: { x: 2550, y: 350 },
          data: {
            schemaName: "CriticalInfrastructureReport",
            schema: `z.object({
  incident_id: z.string(),
  timestamp: z.string(),
  classification: z.enum(["NERC_CIP_008", "STANDARD"]),
  threat_level: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  combined_risk_score: z.number(),
  affected_zones: z.array(z.string()),
  lateral_movement_detected: z.boolean(),
  executive_summary: z.string(),
  threat_intelligence: z.string(),
  emergency_actions: z.array(z.string()),
  nerc_compliance_notes: z.string().optional(),
  generated_at: z.string()
})`,
          },
        },
        // Node 11: Visualization
        {
          id: "ot-visualization",
          type: "imageGeneration",
          position: { x: 2900, y: 350 },
          data: {
            model: "dall-e-3",
            quality: "hd",
            size: "1792x1024",
            style: "natural",
            prompt:
              "Create a high-fidelity cybersecurity threat intelligence map for Smart Energy Grid showing IT/OT convergence with CVE-2024-3400 (VPN breach), CVE-2024-6387 (Linux Server), and Volt Typhoon APT targeting SCADA systems. Dark glassmorphism UI (#0f172a), Purdue Model zones (IT Cloud → Data Diode → OT SCADA), electric blue IT assets (#3b82f6), orange OT assets (#f59e0b), red/purple threat indicators. Header: 'CRITICAL INFRASTRUCTURE DEFENSE // REAL-TIME MONITORING'. HUD widgets showing IoT heartbeat IRREGULAR, packet loss 12%, encryption AES-256. Ultra-sharp 4K, glowing data flows, technical sans-serif font.",
          },
        },
        // Node 12: End
        {
          id: "ot-end",
          type: "end",
          position: { x: 3250, y: 350 },
          data: {},
        },
      ],
      edges: [
        { id: "e-ot-1", source: "ot-start", target: "ot-it-feed" },
        { id: "e-ot-2", source: "ot-start", target: "ot-ot-feed" },
        { id: "e-ot-3", source: "ot-start", target: "ot-iot-telemetry" },
        { id: "e-ot-4", source: "ot-it-feed", target: "ot-risk-calc" },
        { id: "e-ot-5", source: "ot-ot-feed", target: "ot-risk-calc" },
        { id: "e-ot-6", source: "ot-iot-telemetry", target: "ot-risk-calc" },
        { id: "e-ot-7", source: "ot-it-feed", target: "ot-zone-checker" },
        { id: "e-ot-8", source: "ot-ot-feed", target: "ot-zone-checker" },
        { id: "e-ot-9", source: "ot-risk-calc", target: "ot-zone-checker" },
        { id: "e-ot-10", source: "ot-risk-calc", target: "ot-conditional" },
        { id: "e-ot-11", source: "ot-zone-checker", target: "ot-conditional" },
        { id: "e-ot-12", source: "ot-conditional", target: "ot-urgent-prompt", sourceHandle: "true" },
        { id: "e-ot-13", source: "ot-conditional", target: "ot-standard-prompt", sourceHandle: "false" },
        { id: "e-ot-14", source: "ot-urgent-prompt", target: "ot-ai-report" },
        { id: "e-ot-15", source: "ot-standard-prompt", target: "ot-ai-report" },
        { id: "e-ot-16", source: "ot-ai-report", target: "ot-structured" },
        { id: "e-ot-17", source: "ot-structured", target: "ot-visualization" },
        { id: "e-ot-18", source: "ot-visualization", target: "ot-end" },
      ],
    },

    // Template 8: Security Incident Response Workflow
    {
      id: "template-incident-response",
      name: "Security Incident Response Automation",
      description: "Automates incident triage, severity assessment, and response coordination per NIST framework",
      version: 1,
      createdAt: now,
      updatedAt: now,
      author: "TopFlow Security",
      isPublic: true,
      tags: ["incident-response", "security", "automation", "nist"],
      category: "security",
      securityScore: 92,
      compliance: ["SOC2", "ISO27001", "NIST"],
      nodes: [
        {
          id: "start-3",
          type: "start",
          position: { x: 50, y: 300 },
          data: {}
        },
        {
          id: "prompt-3",
          type: "prompt",
          position: { x: 250, y: 300 },
          data: {
            prompt: "Incident Alert:\n$input1\n\nAnalyze this security incident and extract:\n1. Incident type (data breach, malware, unauthorized access, DDoS, other)\n2. Affected systems\n3. Time of detection\n4. Potential impact\n5. Initial indicators of compromise (IOCs)"
          }
        },
        {
          id: "text-4",
          type: "textModel",
          position: { x: 500, y: 300 },
          data: {
            model: "openai/gpt-4o-mini",
            temperature: 0.2,
            maxTokens: 800,
            systemPrompt: "You are a security incident response specialist following the NIST Incident Response Framework (SP 800-61r2). Analyze incidents and provide structured assessments."
          }
        },
        {
          id: "js-3",
          type: "javascript",
          position: { x: 750, y: 300 },
          data: {
            code: `// Incident Severity Scoring based on CVSS and business impact
const incident = input1;

// Parse incident details (simplified for demo)
const factors = {
  data_exposure: incident.includes('data') || incident.includes('breach') ? 30 : 0,
  system_criticality: incident.includes('production') || incident.includes('critical') ? 25 : 10,
  scope: incident.includes('multiple') || incident.includes('widespread') ? 20 : 5,
  active_threat: incident.includes('ongoing') || incident.includes('active') ? 25 : 10
};

const severityScore = Object.values(factors).reduce((a, b) => a + b, 0);

let severity, priority, sla;
if (severityScore >= 75) {
  severity = 'CRITICAL';
  priority = 'P1';
  sla = '15 minutes';
} else if (severityScore >= 50) {
  severity = 'HIGH';
  priority = 'P2';
  sla = '1 hour';
} else if (severityScore >= 25) {
  severity = 'MEDIUM';
  priority = 'P3';
  sla = '4 hours';
} else {
  severity = 'LOW';
  priority = 'P4';
  sla = '24 hours';
}

return {
  severity_score: severityScore,
  severity_level: severity,
  priority: priority,
  response_sla: sla,
  factors: factors,
  timestamp: new Date().toISOString()
};`
          }
        },
        {
          id: "cond-2",
          type: "conditional",
          position: { x: 1000, y: 300 },
          data: {
            condition: "input1.severity_level === 'CRITICAL' || input1.severity_level === 'HIGH'",
            description: "Check if immediate escalation required"
          }
        },
        {
          id: "http-2",
          type: "httpRequest",
          position: { x: 1250, y: 200 },
          data: {
            url: "https://api.example.com/soc/escalate",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Priority": "URGENT"
            },
            body: "{ \"incident\": \"$input1\", \"auto_escalate\": true }"
          }
        },
        {
          id: "text-5",
          type: "textModel",
          position: { x: 1500, y: 200 },
          data: {
            model: "openai/gpt-4o-mini",
            temperature: 0.3,
            maxTokens: 1000,
            systemPrompt: "Generate an incident response runbook following NIST guidelines. Include: 1) Containment steps, 2) Eradication procedures, 3) Recovery actions, 4) Lessons learned template."
          }
        },
        {
          id: "prompt-4",
          type: "prompt",
          position: { x: 1250, y: 400 },
          data: {
            prompt: "Generate standard response for lower priority incident. Include monitoring recommendations and scheduled review timeline."
          }
        },
        {
          id: "struct-2",
          type: "structuredOutput",
          position: { x: 1750, y: 300 },
          data: {
            schema: `{
  "type": "object",
  "properties": {
    "incident_report": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "severity": { "type": "string" },
        "status": { "type": "string", "enum": ["DETECTED", "CONTAINED", "ERADICATED", "RECOVERED", "CLOSED"] },
        "response_actions": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "action": { "type": "string" },
              "responsible": { "type": "string" },
              "deadline": { "type": "string" },
              "status": { "type": "string" }
            }
          }
        },
        "timeline": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "timestamp": { "type": "string" },
              "event": { "type": "string" }
            }
          }
        }
      }
    }
  }
}`
          }
        },
        {
          id: "end-3",
          type: "end",
          position: { x: 2000, y: 300 },
          data: {}
        }
      ],
      edges: [
        { id: "e3-1", source: "start-3", target: "prompt-3" },
        { id: "e3-2", source: "prompt-3", target: "text-4" },
        { id: "e3-3", source: "text-4", target: "js-3" },
        { id: "e3-4", source: "js-3", target: "cond-2" },
        { id: "e3-5", source: "cond-2", target: "http-2", sourceHandle: "true" },
        { id: "e3-6", source: "cond-2", target: "prompt-4", sourceHandle: "false" },
        { id: "e3-7", source: "http-2", target: "text-5" },
        { id: "e3-8", source: "text-5", target: "struct-2" },
        { id: "e3-9", source: "prompt-4", target: "struct-2" },
        { id: "e3-10", source: "struct-2", target: "end-3" }
      ]
    },
  ]
}

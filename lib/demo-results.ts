/**
 * Cached demo results for security workflow templates
 * These allow users to test workflows without API keys
 */

import type { DemoResult } from "./demo-data/types"

export const DEMO_RESULTS: DemoResult[] = [
  // GDPR Data Access Request Demo Results
  {
    templateId: "template-gdpr-access-request",
    workflowName: "GDPR Data Access Request Automation",
    outputs: {},
    nodeResults: {
      "gdpr-start": {
        output: "Workflow started"
      },
      "gdpr-intake-email": {
        output: `Data Subject Access Request (replace sample text before running):

---
From: Amelia Ellis <amelia.ellis@acme.eu>
Account IDs: CRM-49318, Loyalty: ACME-0091
Channel: email
Request:
I am exercising my rights under GDPR Article 15 to obtain a copy of all personal data related to my account, marketing preferences, fraud investigations, and support tickets for the past 18 months. I would also like to confirm whether my data was shared with third-party processors.
Verification documents attached: passport ending 7331 and signed declaration on 5 January 2026.
Preferred format: CSV + PDF bundle via secure portal.
---`
      },
      "gdpr-intake-parser": {
        output: `{
  "requestId": "REQ-230015",
  "requester": "Amelia Ellis",
  "email": "amelia.ellis@acme.eu",
  "accountIdentifiers": ["CRM-49318", "ACME-0091"],
  "channel": "email",
  "jurisdiction": "EU",
  "dataCategories": ["account_profile", "marketing_preferences", "fraud_investigations", "support_tickets"],
  "preferredFormat": "csv+pdf",
  "justification": "Article 15 - access request",
  "identityDocuments": {
    "govIdLast4": "7331",
    "signedStatement": "2026-01-05",
    "utilityBill": null
  },
  "dueDate": "2026-02-04",
  "notes": "Wants disclosure of third-party processors"
}`
      },
      "gdpr-classifier-brief": {
        output: `Structured DSAR payload:
{...}

Classify request risk, SLA, and recommended controls.`
      },
      "gdpr-classifier": {
        output: `{
  "category": "standard_access",
  "riskLevel": "medium",
  "requiresManualReview": false,
  "justificationSummary": "Identity verified via passport + signed statement. Standard Article 15 access request covering four data categories.",
  "recommendedSLAHours": 72,
  "justificationArticles": ["Article 12", "Article 15"]
}`
      },
      "gdpr-verification-js": {
        output: {
          verified: true,
          missingDocs: [],
          requestId: "REQ-230015",
          requester: "Amelia Ellis",
          email: "amelia.ellis@acme.eu",
          channel: "email",
          jurisdiction: "EU",
          preferredFormat: "csv+pdf",
          category: "standard_access",
          riskLevel: "medium",
          dataCategories: ["account_profile", "marketing_preferences", "fraud_investigations", "support_tickets"],
          slaHours: 72,
          audit: {
            verificationSummary: "Identity verified via gov ID and signed statement.",
            rationale: "Gov ID + signed statement on record.",
            gdprArticles: ["Article 12", "Article 15"]
          }
        }
      },
      "gdpr-decision": {
        output: true
      },
      "gdpr-crm-lookup": {
        output: {
          status: 200,
          profile: {
            accountCreated: "2023-01-15",
            subscription: "Enterprise",
            processors: ["Segment EU", "Postmark", "Snowflake EU"],
            dpaOnFile: true
          }
        }
      },
      "gdpr-data-export": {
        output: {
          status: 200,
          sections: [
            { name: "account_profile", pii: ["full_name", "address", "email", "phone"] },
            { name: "marketing_preferences", pii: ["email", "phone", "opt_in_history"] },
            { name: "support_tickets", pii: ["full_name", "ip_address", "conversation_body"] }
          ],
          exportId: "EXP-55412"
        }
      },
      "gdpr-redaction-engine": {
        output: {
          bundleSummary: {
            sections: 3,
            redactedFields: 11,
            deliveredFormats: ["csv", "pdf"]
          },
          evidence: [
            { section: "account_profile", piiFields: ["full_name", "address", "email", "phone"], checksum: "sha256:account_profile-mask" },
            { section: "marketing_preferences", piiFields: ["email", "phone", "opt_in_history"], checksum: "sha256:marketing_preferences-mask" },
            { section: "support_tickets", piiFields: ["full_name", "ip_address", "conversation_body"], checksum: "sha256:support_tickets-mask" }
          ],
          downloadUrl: "https://secure.topflow.dev/downloads/REQ-230015.zip"
        }
      },
      "gdpr-response-brief": {
        output: "Fulfillment summary compiled with verification context, CRM findings, and redaction evidence."
      },
      "gdpr-response-letter": {
        output: `Dear Ms. Ellis,

Re: GDPR Data Access Request REQ-230015

We completed our review of your Article 15 request. Attached you will find CSV and PDF copies of the following data sets:
• Account profile (registration data, contact details, preference center settings)
• Marketing preferences and opt-in history
• Fraud and support-ticket investigations conducted within the last 18 months

All sensitive identifiers (passport numbers, IP addresses, investigator notes) have been redacted in accordance with Articles 32 and 33. The underlying unredacted data remains secured within our EU region data lake.

No data has been shared with third parties beyond our contracted processors (Segment EU, Postmark, Snowflake EU). Copies of the applicable Data Processing Agreements are available upon request.

If you believe any information is inaccurate or would like to exercise additional rights (Articles 16-20), please contact us within 30 days at charlie@charliesu.com.

Regards,
TopFlow Security Office`
      },
      "gdpr-final-package": {
        output: {
          status: "fulfilled",
          requestId: "REQ-230015",
          requester: "Amelia Ellis",
          channel: "email",
          dataCategories: ["account_profile", "marketing_preferences", "fraud_investigations", "support_tickets"],
          responseLetter: `Dear Ms. Ellis,

Re: GDPR Data Access Request REQ-230015

We completed our review of your Article 15 request. Attached you will find CSV and PDF copies of the following data sets:
• Account profile (registration data, contact details, preference center settings)
• Marketing preferences and opt-in history
• Fraud and support-ticket investigations conducted within the last 18 months

All sensitive identifiers (passport numbers, IP addresses, investigator notes) have been redacted in accordance with Articles 32 and 33. The underlying unredacted data remains secured within our EU region data lake.

No data has been shared with third parties beyond our contracted processors (Segment EU, Postmark, Snowflake EU). Copies of the applicable Data Processing Agreements are available upon request.

If you believe any information is inaccurate or would like to exercise additional rights (Articles 16-20), please contact us within 30 days at charlie@charliesu.com.

Regards,
TopFlow Security Office`,
          attachments: {
            downloadUrl: "https://secure.topflow.dev/downloads/REQ-230015.zip",
            bundleSummary: {
              sections: 3,
              redactedFields: 11,
              deliveredFormats: ["csv", "pdf"]
            },
            redactionEvidence: [
              { section: "account_profile", piiFields: ["full_name", "address", "email", "phone"], checksum: "sha256:account_profile-mask" },
              { section: "marketing_preferences", piiFields: ["email", "phone", "opt_in_history"], checksum: "sha256:marketing_preferences-mask" },
              { section: "support_tickets", piiFields: ["full_name", "ip_address", "conversation_body"], checksum: "sha256:support_tickets-mask" }
            ]
          },
          audit: {
            verificationSummary: "Identity verified via gov ID and signed statement.",
            rationale: "Gov ID + signed statement on record.",
            gdprArticles: ["Article 12", "Article 15"]
          },
          completedAt: "2026-01-06T10:00:00Z"
        }
      },
      "gdpr-end-fulfilled": {
        output: {
          finalOutput: {
            status: "fulfilled",
            requestId: "REQ-230015",
            requester: "Amelia Ellis",
            channel: "email",
            dataCategories: ["account_profile", "marketing_preferences", "fraud_investigations", "support_tickets"],
            responseLetter: "See attached letter.",
            attachments: {
              downloadUrl: "https://secure.topflow.dev/downloads/REQ-230015.zip"
            },
            audit: {
              verificationSummary: "Identity verified via gov ID and signed statement.",
              rationale: "Gov ID + signed statement on record.",
              gdprArticles: ["Article 12", "Article 15"]
            },
            completedAt: "2026-01-06T10:00:00Z"
          }
        }
      }
    },
    executionTime: 3450,
    timestamp: "2025-01-06T10:30:00Z"
  },

  // PII Detection & Redaction Demo Results
  {
    templateId: "template-pii-detection",
    workflowName: "PII Detection & Redaction Pipeline",
    outputs: {},
    nodeResults: {
      "start-2": {
        output: `Employee Record:
Name: Sarah Johnson
SSN: 123-45-6789
Email: sarah.johnson@company.com
Phone: (555) 234-5678
DOB: 03/15/1985
Address: 456 Oak Avenue, Suite 200, New York, NY 10001
Medical: Diagnosed with hypertension, takes Lisinopril 10mg daily
Credit Card: 4532-1234-5678-9012
Employee ID: EMP-2024-0892`
      },
      "prompt-2": {
        output: `Document Analysis - PII Detected:

PERSONAL IDENTIFIERS:
✓ Full name: Sarah Johnson
✓ Social Security Number: 123-45-6789 [HIGH RISK]
✓ Date of Birth: 03/15/1985 [MEDIUM RISK]

FINANCIAL DATA:
✓ Credit Card: 4532-1234-5678-9012 [HIGH RISK]

HEALTH INFORMATION:
✓ Medical condition: Hypertension [HIPAA PROTECTED]
✓ Medication: Lisinopril 10mg [HIPAA PROTECTED]

CONTACT DETAILS:
✓ Email: sarah.johnson@company.com [MEDIUM RISK]
✓ Phone: (555) 234-5678 [LOW RISK]
✓ Address: 456 Oak Avenue, Suite 200, New York, NY 10001 [MEDIUM RISK]`
      },
      "text-3": {
        output: `PII Detection Analysis per NIST SP 800-122:

CATEGORY 1 - HIGH SENSITIVITY (Immediate Redaction Required):
• SSN: 123-45-6789 - Full SSN detected, high identity theft risk
• Credit Card: 4532-1234-5678-9012 - Valid Visa format, PCI DSS compliance required
• Medical Information: Hypertension diagnosis and medication details - HIPAA regulated

CATEGORY 2 - MEDIUM SENSITIVITY (Context-Dependent Redaction):
• Email: Corporate email address, may be publicly available
• Date of Birth: Combined with name creates identity risk
• Physical Address: Full address including suite number

CATEGORY 3 - LOW SENSITIVITY (Optional Redaction):
• Phone Number: Business phone, lower risk
• Employee ID: Internal identifier, limited external value

COMPLIANCE REQUIREMENTS:
• GDPR: Articles 32-34 require protection of all categories
• CCPA: Consumer right to deletion applies
• HIPAA: Medical information requires special handling`
      },
      "js-2": {
        output: {
          risk_score: 87,
          pii_found: true,
          categories_detected: ["ssn", "creditCard", "email", "phone", "dateOfBirth", "address", "name"],
          detailed_findings: [
            {
              type: "ssn",
              risk_level: "high_risk",
              count: 1,
              confidence: 0.95,
              samples: ["123-***"]
            },
            {
              type: "creditCard",
              risk_level: "high_risk",
              count: 1,
              confidence: 0.90,
              samples: ["4532-***"]
            },
            {
              type: "email",
              risk_level: "medium_risk",
              count: 1,
              confidence: 0.99,
              samples: ["sara***"]
            },
            {
              type: "phone",
              risk_level: "medium_risk",
              count: 1,
              confidence: 0.85,
              samples: ["(555***"]
            },
            {
              type: "dateOfBirth",
              risk_level: "medium_risk",
              count: 1,
              confidence: 0.75,
              samples: ["03/1***"]
            }
          ],
          redacted_text: `Employee Record:
Name: [NAME-REDACTED]
SSN: [SSN-REDACTED]
Email: [EMAIL-REDACTED]
Phone: [PHONE-REDACTED]
DOB: [DATEOFBIRTH-REDACTED]
Address: [ADDRESS-REDACTED]
Medical: [MEDICAL-INFO-REDACTED]
Credit Card: [CREDITCARD-REDACTED]
Employee ID: EMP-2024-0892`,
          compliance_check: {
            gdpr_compliant: false,
            ccpa_compliant: false,
            hipaa_compliant: false
          }
        }
      },
      "struct-1": {
        output: {
          report: {
            scan_date: "2025-01-06T10:45:00Z",
            document_id: "DOC-2025-PII-SCAN-001",
            risk_level: "CRITICAL",
            pii_summary: [
              { category: "SSN", count: 1, redacted: true },
              { category: "Credit Card", count: 1, redacted: true },
              { category: "Medical Info", count: 2, redacted: true },
              { category: "Email", count: 1, redacted: true },
              { category: "Phone", count: 1, redacted: true },
              { category: "Address", count: 1, redacted: true }
            ],
            compliance_status: {
              gdpr: false,
              ccpa: false,
              hipaa: false
            },
            recommendations: [
              "Immediately redact or encrypt SSN and credit card information",
              "Implement access controls for medical information per HIPAA",
              "Apply data minimization principles - collect only necessary PII",
              "Establish retention policies with automatic deletion",
              "Implement audit logging for all PII access"
            ]
          }
        }
      },
      "end-2": {
        output: "PII detection and redaction completed"
      }
    },
    executionTime: 2890,
    timestamp: "2025-01-06T10:45:00Z"
  },

  // Security Incident Response Demo Results
  {
    templateId: "template-incident-response",
    workflowName: "Security Incident Response Workflow",
    outputs: {},
    nodeResults: {
      "start-3": {
        output: `SECURITY ALERT: Potential data breach detected
Time: 2025-01-06 09:15:23 UTC
System: Production Database Server (DB-PROD-01)
Alert: Unusual data export activity detected
Details: Large volume data export (2.3GB) to unknown external IP 185.234.xxx.xxx
User: service_account_03 (normally inactive)
Affected Data: Customer records database
Status: ONGOING ACTIVITY DETECTED`
      },
      "prompt-3": {
        output: `Incident Analysis:

1. INCIDENT TYPE: Data Breach (Unauthorized Data Exfiltration)
2. AFFECTED SYSTEMS:
   - DB-PROD-01 (Production Database Server)
   - Customer Records Database
   - Service Account: service_account_03
3. TIME OF DETECTION: 2025-01-06 09:15:23 UTC
4. POTENTIAL IMPACT:
   - 2.3GB of customer data potentially compromised
   - Unknown number of customer records affected
   - Possible regulatory compliance violations (GDPR, CCPA)
   - Reputational damage risk: HIGH
5. INITIAL IOCs:
   - Suspicious IP: 185.234.xxx.xxx (Eastern European hosting provider)
   - Compromised account: service_account_03
   - Unusual export volume: 2.3GB (normal: <100MB)
   - Time of activity: Outside business hours`
      },
      "text-4": {
        output: `NIST Incident Response Assessment (SP 800-61r2):

PHASE 1 - PREPARATION: System monitoring detected the anomaly successfully.

PHASE 2 - DETECTION & ANALYSIS:
• Incident Vector: Compromised service account credentials
• Attack Pattern: Data exfiltration via authorized but unusual database export
• Severity Assessment: HIGH - Active data breach with customer PII involved
• Confidence Level: 85% - Clear indicators of malicious activity

PHASE 3 - CONTAINMENT (IMMEDIATE ACTIONS REQUIRED):
Short-term:
1. Disable service_account_03 immediately
2. Block outbound traffic to IP 185.234.xxx.xxx
3. Terminate active database connections from compromised account
4. Enable enhanced logging on all database servers

Long-term:
1. Reset all service account credentials
2. Implement IP allowlisting for service accounts
3. Deploy DLP solution to prevent future exfiltration

PHASE 4 - ERADICATION:
• Review all service account activity for past 30 days
• Scan for additional compromised accounts
• Patch any identified vulnerabilities

PHASE 5 - RECOVERY:
• Restore normal operations with enhanced monitoring
• Implement additional security controls
• Verify no backdoors remain`
      },
      "js-3": {
        output: {
          severity_score: 80,
          severity_level: "CRITICAL",
          priority: "P1",
          response_sla: "15 minutes",
          factors: {
            data_exposure: 30,
            system_criticality: 25,
            scope: 5,
            active_threat: 25
          },
          timestamp: "2025-01-06T09:30:00Z"
        }
      },
      "cond-2": {
        output: true,
        error: "CRITICAL severity - immediate escalation initiated"
      },
      "http-2": {
        output: {
          status: 200,
          response: {
            escalation_id: "ESC-2025-001",
            notified: [
              "CISO",
              "Security Operations Center",
              "Legal Team",
              "Communications Team"
            ],
            war_room_url: "https://incident.company.com/room/ESC-2025-001",
            status: "ESCALATED"
          }
        }
      },
      "text-5": {
        output: `INCIDENT RESPONSE RUNBOOK - CRITICAL DATA BREACH

1. CONTAINMENT STEPS (0-15 minutes):
□ Disable compromised account: service_account_03 [IN PROGRESS]
□ Block malicious IP at firewall: 185.234.xxx.xxx [COMPLETED]
□ Isolate affected database server DB-PROD-01 [PENDING]
□ Preserve forensic evidence - snapshot system state [PENDING]
□ Enable verbose audit logging on all critical systems [IN PROGRESS]
□ Notify incident response team via PagerDuty [COMPLETED]

2. ERADICATION PROCEDURES (15-60 minutes):
□ Conduct forensic analysis of compromised account activity
□ Identify and remove any persistence mechanisms
□ Reset credentials for all service accounts
□ Apply security patches if vulnerability exploited
□ Review and revoke suspicious API tokens
□ Scan for additional indicators of compromise

3. RECOVERY ACTIONS (1-4 hours):
□ Restore services with enhanced monitoring
□ Implement temporary additional access controls
□ Deploy honeypot accounts for detection
□ Increase SOC monitoring level to HIGH
□ Conduct integrity checks on affected data
□ Prepare breach notification if required

4. LESSONS LEARNED TEMPLATE:
• Incident Timeline: [Document all events with timestamps]
• Root Cause: [Compromised service account - investigate how]
• Detection Gap: [Why wasn't this caught earlier?]
• Response Effectiveness: [What worked, what didn't?]
• Preventive Measures: [Specific controls to implement]
• Process Improvements: [Updates to IR procedures]

COMPLIANCE REQUIREMENTS:
• GDPR: 72-hour notification to supervisory authority
• CCPA: Notification without unreasonable delay
• State Laws: Check breach notification requirements

COMMUNICATION PLAN:
• Internal: All-hands meeting at 10:00 UTC
• External: Prepare customer notification (legal review required)
• Media: Statement prepared by communications team`
      },
      "struct-2": {
        output: {
          incident_report: {
            id: "INC-2025-0106-001",
            severity: "CRITICAL",
            status: "CONTAINED",
            response_actions: [
              {
                action: "Disable compromised service account",
                responsible: "SOC Team",
                deadline: "2025-01-06T09:30:00Z",
                status: "COMPLETED"
              },
              {
                action: "Block malicious IP address",
                responsible: "Network Team",
                deadline: "2025-01-06T09:30:00Z",
                status: "COMPLETED"
              },
              {
                action: "Forensic analysis",
                responsible: "Security Team",
                deadline: "2025-01-06T10:30:00Z",
                status: "IN_PROGRESS"
              },
              {
                action: "Customer notification preparation",
                responsible: "Legal Team",
                deadline: "2025-01-06T12:00:00Z",
                status: "PENDING"
              }
            ],
            timeline: [
              { timestamp: "2025-01-06T09:15:23Z", event: "Initial detection of anomaly" },
              { timestamp: "2025-01-06T09:20:00Z", event: "Alert triggered and SOC notified" },
              { timestamp: "2025-01-06T09:25:00Z", event: "Incident confirmed as data breach" },
              { timestamp: "2025-01-06T09:30:00Z", event: "Containment measures implemented" },
              { timestamp: "2025-01-06T09:35:00Z", event: "Executive team notified" },
              { timestamp: "2025-01-06T09:45:00Z", event: "Forensic investigation initiated" }
            ]
          }
        }
      },
      "end-3": {
        output: "Incident response completed - moving to recovery phase"
      }
    },
    executionTime: 4200,
    timestamp: "2025-01-06T10:00:00Z"
  },

  // SOC 2 Control Evidence Collection Demo Results
  {
    templateId: "template-soc2-evidence",
    workflowName: "SOC 2 Control Evidence Collection",
    outputs: {},
    nodeResults: {
      "start-4": {
        output: `SOC 2 Control: CC6.1 - Logical and Physical Access Controls
Description: The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity's objectives.`
      },
      "prompt-5": {
        output: `SOC 2 Control Analysis:

1. CONTROL FAMILY: Security (Common Criteria)
2. CONTROL ID: CC6.1 - Logical and Physical Access Controls
3. CONTROL DESCRIPTION: Implementation of access controls to protect information assets
4. REQUIRED EVIDENCE TYPES:
   - Access control policies and procedures
   - User access provisioning/deprovisioning logs
   - Privileged access management records
   - Access review documentation
   - Multi-factor authentication reports
5. TESTING FREQUENCY: Quarterly with continuous monitoring
6. CURRENT COMPLIANCE PERIOD: Q4 2024 (October 1 - December 31, 2024)`
      },
      "text-6": {
        output: `SOC 2 TSC CC6.1 Compliance Assessment:

CONTROL OBJECTIVE: Restrict logical and physical access to information assets to authorized personnel.

EVIDENCE REQUIREMENTS per AICPA TSC 2017:
1. Access Control Policy: Document defining access requirements and restrictions
2. User Access Matrix: Current list of users and their access levels
3. Provisioning Logs: Evidence of appropriate approval for access grants
4. Deprovisioning Logs: Timely removal of access for terminated users
5. Privileged Access: Documentation of elevated privilege management
6. Access Reviews: Quarterly certification of user access appropriateness
7. MFA Implementation: Evidence of multi-factor authentication enforcement

TESTING PROCEDURES:
• Sample 25 new user accounts created in Q4 2024
• Verify approval documentation for each
• Confirm access levels match job requirements
• Test 10 terminations for timely deprovisioning
• Review all privileged account activity

CURRENT PERIOD STATUS: Evidence collection in progress for Q4 2024 audit.`
      },
      "http-3": {
        output: {
          status: 200,
          evidence_collected: {
            access_logs: {
              total_events: 15234,
              sample_size: 25,
              period: "Q4 2024",
              compliant_samples: 24,
              exceptions: 1
            },
            change_management_records: {
              total_changes: 89,
              approved: 89,
              emergency_changes: 3,
              documentation_complete: true
            },
            incident_reports: {
              total_incidents: 4,
              security_related: 2,
              resolved_within_sla: 4,
              root_cause_documented: true
            },
            training_records: {
              total_employees: 450,
              completed_training: 447,
              compliance_rate: "99.3%",
              overdue: 3
            },
            policy_attestations: {
              required: 450,
              completed: 445,
              compliance_rate: "98.9%",
              pending: 5
            }
          }
        }
      },
      "js-4": {
        output: {
          compliance_score: 100,
          is_compliant: true,
          validation_results: [
            {
              evidence_type: "access_logs",
              status: "PRESENT",
              validity: "VALID"
            },
            {
              evidence_type: "change_management_records",
              status: "PRESENT",
              validity: "VALID"
            },
            {
              evidence_type: "incident_reports",
              status: "PRESENT",
              validity: "VALID"
            },
            {
              evidence_type: "training_records",
              status: "PRESENT",
              validity: "VALID"
            },
            {
              evidence_type: "policy_attestations",
              status: "PRESENT",
              validity: "VALID"
            }
          ],
          missing_evidence: [],
          recommendations: [
            "Address the 1 exception found in access logs",
            "Complete training for 3 overdue employees",
            "Obtain policy attestations from 5 pending employees"
          ],
          audit_ready: true
        }
      },
      "end-4": {
        output: `SOC 2 Evidence Collection Complete:
- Control: CC6.1 - Logical and Physical Access Controls
- Compliance Score: 100%
- Audit Status: READY
- Minor Issues: 1 access exception, 3 training overdue, 5 attestations pending
- Overall Assessment: COMPLIANT with minor remediation items`
      }
    },
    executionTime: 2100,
    timestamp: "2025-01-06T11:00:00Z"
  }
]

/**
 * Get demo results for a specific template
 */
export function getDemoResults(templateId: string): DemoResult | undefined {
  return DEMO_RESULTS.find(result => result.templateId === templateId)
}

/**
 * Check if a template has demo results available
 */
export function hasDemoResults(templateId: string): boolean {
  return DEMO_RESULTS.some(result => result.templateId === templateId)
}

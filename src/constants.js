export const SYSTEM_PROMPT = `You are an expert L1 Support Assistant for Happiest Minds Technologies, specifically trained on the Happiest Health PMS platform (built on ERPNext Healthcare/Frappe).

Your role: Help L1 support agents resolve live calls from Happiest Health clinic staff (Front Desk, Therapists, Physicians, Admins).

KNOWLEDGE BASE:
1. LOGIN & ACCESS: PMS URL is staging3-erp.happiesthealth.com. Common fixes: clear browser cache, try incognito mode, update Zscaler on user machine. Session Defaults -> Service Unit to fix wrong clinic dashboard.
2. PATIENT REGISTRATION: Mandatory fields: Name, Gender, Mobile, Email, DOB. System prompts for duplicates on save. SMS/WhatsApp notification sent on registration.
3. APPOINTMENTS: Confirm Practitioner is Active. Check Medical Department and Service Unit mapping. Practitioner must have a Schedule assigned. Session Defaults must match the clinic.
4. BILLING & INVOICING: Discounts applied at item level NOT total bill. Tax template linked at item level. Use Nil-Rated HHSPL for no-tax items. NEVER delete invoices - use Credit Note then Cancel. For duplicates: Credit Note -> Cancel original -> Create fresh invoice.
5. RAZORPAY: POS profile must be set to RP Phone. If payment frozen: set Razorpay amount to 0, enter amount under Cash section, Save and Submit. QR code fallback: click Razorpay button at top of invoice.
6. THERAPY SESSIONS: ALL sessions must be in Submitted status for therapy plan to show Complete. Even one Saved but not Submitted session keeps plan as In Progress. External Treatment field must be populated on encounter for front desk to see therapy plan. Post-therapy notes: Therapy Session -> Create -> Clinical Note -> Save -> Submit.
7. PATIENT ENCOUNTER: Appointment must be Confirmed status. Dropdown fields must be selected from list not typed manually. Walk-in encounters can be created directly without appointment.
8. REPORTS: Service Itemwise Sales Register accessible from Physician workspace. Cash Collection Report also available. To export: List -> Report View -> Actions -> Export to CSV or Excel.

SLA MATRIX:
- P1 Critical: system down or billing failure for multiple users -> Respond 15 min, Resolve 2 hrs
- P2 High: single user blocked from key workflow -> Respond 15 min, Resolve 4 hrs
- P3 Medium: minor issue or guidance query -> Respond 2 hrs, Resolve 2 business days
- P4 Low: cosmetic issue or enhancement or non-urgent -> Respond 1 business day, Next release cycle
Support hours: 8:00 AM to 8:00 PM IST, Monday to Saturday.

ESCALATION CONTACTS (always follow this order):
- L1 Service Desk Lead: Shaik Basha - shaik.basha3@happiestminds.com
- L2 FIRST (PMS L2 Assignee): M Vishnu - escalate all PMS application issues to Vishnu first
- L2 SECOND (if Vishnu unavailable): Soundarya Angadi - PMS L2 specialist for access and configuration issues
- L2 THIRD (if both unavailable): Shivaprasad
- L3 Infra Support: HappiestHealth-InfraSupport@happiestminds.com
- Client Head of IT: Manjunath R - manjunatha.r@happiesthealth.com
- Toll-Free Helpdesk: 1800-891-3919

ESCALATION ORDER: M Vishnu -> Soundarya Angadi -> Shivaprasad

GOLDEN RULES:
- ALWAYS log the ticket in ServiceNow FIRST before any troubleshooting
- NEVER delete an invoice - always use Credit Note and Cancel process
- ONLY close a ticket after the user explicitly confirms resolution
- ALWAYS escalate with full evidence: screenshots, error text, steps already tried, username, clinic name

RESPONSE FORMAT:
1. Likely cause (1 sentence)
2. Step-by-step L1 actions (numbered, plain language)
3. When to escalate to L2 (specific condition)
4. Priority level if relevant (P1/P2/P3/P4)

Keep responses concise and practical. Plain language. No jargon. Be direct and actionable.`

export const QUICK_QUERIES = [
  { icon: '💳', label: 'Razorpay link not working', query: 'Razorpay payment link is not showing. What do I do?' },
  { icon: '🔐', label: 'Login issue - desktop only', query: 'User cannot log in to PMS on desktop but can on tablet' },
  { icon: '🧾', label: 'Wrong tax on invoice', query: 'Invoice shows wrong tax or missing tax. How to fix?' },
  { icon: '🏥', label: 'Therapy plan stuck', query: 'Therapy plan still shows In Progress even after all sessions are done' },
  { icon: '📅', label: 'Doctor not in dropdown', query: 'Doctor is not visible in the appointment booking dropdown' },
  { icon: '📄', label: 'Duplicate invoice created', query: 'Duplicate invoice was created by mistake. What should I do?' },
  { icon: '🏢', label: 'Wrong clinic on dashboard', query: 'Dashboard shows wrong clinic after login' },
]

export const STARTER_CHIPS = [
  { label: 'Top 5 common issues', query: 'What are the top 5 most common L1 issues?' },
  { label: 'When to escalate?', query: 'When should I escalate to L2?' },
  { label: 'P1 SLA timing', query: 'What is the SLA for a P1 ticket?' },
  { label: 'Cancel Razorpay payment', query: 'How do I cancel a frozen Razorpay payment?' },
  { label: 'Escalation contacts', query: 'Who do I contact for infrastructure issues?' },
]

export const DRILL_SCENARIOS = [
  {
    tag: 'Billing',
    scenario: '"I accidentally created a duplicate invoice for the same patient. What should I do?"',
    answer: '1. Do NOT attempt to delete the invoice.\n2. Create a Credit Note against the incorrect invoice.\n3. Cancel the original invoice after the credit note is applied.\n4. Create a fresh correct invoice for the patient.\n5. Document both invoice numbers in the SNOW ticket.\n\nEscalate to L2 if the Credit Note option is not visible or accessible.',
  },
  {
    tag: 'Razorpay',
    scenario: '"The Razorpay payment seems to have gone through but the invoice is still unpaid and the link is frozen."',
    answer: '1. Confirm POS profile = RP Phone.\n2. Set the Razorpay amount field to 0.\n3. Enter the full payment amount under the Cash section.\n4. Click Save and Submit to complete the invoice.\nAlternatively: click Razorpay button at the top to show QR code for a fresh payment.\n\nEscalate to L2 if API timeout repeats across multiple users.',
  },
  {
    tag: 'Login',
    scenario: '"I can log in from my tablet but not from my desktop. It keeps saying invalid credentials."',
    answer: '1. Verify the correct URL: staging3-erp.happiesthealth.com\n2. Clear browser cache or try incognito mode.\n3. Update the Zscaler application on the desktop machine.\n4. Confirm the account is Active and correct credentials are used.\n\nEscalate to IT team if issue persists after all steps.',
  },
  {
    tag: 'Therapy',
    scenario: '"The therapy plan still shows In Progress even though we have completed all the sessions."',
    answer: '1. Open each therapy session under the plan.\n2. Confirm every session has status = Submitted not just Saved.\n3. Even one unsubmitted session keeps the plan as In Progress.\n4. Submit any remaining sessions.\n\nEscalate to L2 if status does not update after all sessions are confirmed Submitted.',
  },
  {
    tag: 'Encounter',
    scenario: '"The doctor is trying to submit the patient encounter but keeps getting a validation error even though all fields look filled."',
    answer: '1. Check all dropdown fields - they must be selected from the list, not typed manually.\n2. Verify all mandatory sections are complete.\n3. Ask the doctor to clear each dropdown and re-select the value.\n4. Check for any hidden required fields.\n\nEscalate to L2 if submission is blocked by a backend error message.',
  },
]
export const sampleRegulations = [
  {
    id: 'reg-1',
    titleAr: 'نظام حماية البيانات الشخصية',
    titleEn: 'Personal Data Protection Law',
    type: 'law',
    description: 'Regulates the collection, processing, and storage of personal data within the Kingdom.',
    keywords: ['data protection', 'privacy', 'personal data', 'consent', 'data breach', 'encryption', 'retention'],
    clauses: [
      { id: 'c1', text: 'All personal data must be collected with explicit consent', keywords: ['consent', 'personal data', 'collection'], weight: 3 },
      { id: 'c2', text: 'Data must be encrypted at rest and in transit', keywords: ['encryption', 'data', 'security'], weight: 3 },
      { id: 'c3', text: 'Data retention period must not exceed 5 years', keywords: ['retention', 'period', 'years', 'storage'], weight: 2 },
      { id: 'c4', text: 'Data breach must be reported within 72 hours', keywords: ['breach', 'report', 'notification', 'hours'], weight: 3 },
      { id: 'c5', text: 'Data subjects have the right to access and delete their data', keywords: ['access', 'delete', 'right', 'subject'], weight: 2 },
    ]
  },
  {
    id: 'reg-2',
    titleAr: 'سياسة مكافحة غسل الأموال',
    titleEn: 'Anti-Money Laundering Policy',
    type: 'policy',
    description: 'Establishes controls and procedures to prevent money laundering activities.',
    keywords: ['anti-money laundering', 'AML', 'KYC', 'due diligence', 'suspicious', 'transaction', 'reporting'],
    clauses: [
      { id: 'c1', text: 'Know Your Customer (KYC) verification is mandatory', keywords: ['KYC', 'verification', 'customer', 'identity'], weight: 3 },
      { id: 'c2', text: 'All transactions above 50,000 SAR must be reported', keywords: ['transaction', 'report', 'threshold', 'amount'], weight: 3 },
      { id: 'c3', text: 'Suspicious activity reports must be filed within 24 hours', keywords: ['suspicious', 'activity', 'report', 'hours'], weight: 3 },
      { id: 'c4', text: 'Due diligence must be performed on all new clients', keywords: ['due diligence', 'client', 'new', 'assessment'], weight: 2 },
    ]
  },
  {
    id: 'reg-3',
    titleAr: 'تعميم الحوكمة المؤسسية',
    titleEn: 'Corporate Governance Circular',
    type: 'circular',
    description: 'Sets standards for corporate governance practices.',
    keywords: ['governance', 'board', 'audit', 'disclosure', 'transparency', 'compliance', 'committee'],
    clauses: [
      { id: 'c1', text: 'Board meetings must be held at least quarterly', keywords: ['board', 'meeting', 'quarterly', 'regular'], weight: 2 },
      { id: 'c2', text: 'Audit committee must include independent members', keywords: ['audit', 'committee', 'independent', 'member'], weight: 2 },
      { id: 'c3', text: 'Annual disclosure reports are mandatory', keywords: ['disclosure', 'annual', 'report', 'mandatory'], weight: 3 },
      { id: 'c4', text: 'Conflict of interest policies must be enforced', keywords: ['conflict', 'interest', 'policy', 'enforcement'], weight: 2 },
      { id: 'c5', text: 'Whistleblower protection must be provided', keywords: ['whistleblower', 'protection', 'reporting', 'anonymous'], weight: 2 },
    ]
  },
  {
    id: 'reg-4',
    titleAr: 'نظام العمل والعمال',
    titleEn: 'Labor Law',
    type: 'law',
    description: 'Governs employment relationships, worker rights, and employer obligations.',
    keywords: ['labor', 'employment', 'worker', 'rights', 'contract', 'termination', 'wages', 'leave'],
    clauses: [
      { id: 'c1', text: 'Employment contracts must be in writing', keywords: ['contract', 'written', 'employment', 'agreement'], weight: 3 },
      { id: 'c2', text: 'Maximum working hours are 8 hours per day', keywords: ['working hours', 'maximum', 'hours', 'day'], weight: 2 },
      { id: 'c3', text: 'Annual leave of 21 days minimum must be provided', keywords: ['annual leave', 'days', 'minimum', 'vacation'], weight: 2 },
      { id: 'c4', text: 'End of service benefits must be calculated per labor law', keywords: ['end of service', 'benefits', 'calculation', 'termination'], weight: 3 },
      { id: 'c5', text: 'Non-discrimination in hiring practices is required', keywords: ['discrimination', 'hiring', 'equal', 'opportunity'], weight: 3 },
    ]
  },
  {
    id: 'reg-5',
    titleAr: 'سياسة أمن المعلومات',
    titleEn: 'Information Security Policy',
    type: 'policy',
    description: 'Defines the information security controls and practices.',
    keywords: ['information security', 'access control', 'authentication', 'firewall', 'vulnerability', 'incident'],
    clauses: [
      { id: 'c1', text: 'Multi-factor authentication is required for all systems', keywords: ['authentication', 'multi-factor', 'MFA', 'access'], weight: 3 },
      { id: 'c2', text: 'Vulnerability assessments must be conducted quarterly', keywords: ['vulnerability', 'assessment', 'quarterly', 'scan'], weight: 2 },
      { id: 'c3', text: 'Access control lists must be reviewed monthly', keywords: ['access control', 'review', 'monthly', 'permissions'], weight: 2 },
      { id: 'c4', text: 'Security incidents must be logged and investigated', keywords: ['incident', 'log', 'investigation', 'security'], weight: 3 },
    ]
  }
];

export const sampleDocuments = [
  {
    id: 'doc-1',
    title: 'Employment Agreement - Senior Developer',
    titleAr: 'عقد توظيف - مطور أول',
    type: 'contract',
    department: 'Human Resources',
    departmentAr: 'الموارد البشرية',
    content: `This employment contract is entered into between the Company and the Employee.

1. The employee agrees to work 8 hours per day, 5 days per week.
2. The employee is entitled to 21 days of annual leave.
3. End of service benefits will be calculated according to the applicable labor law.
4. The contract is valid for 2 years and may be renewed.
5. Either party may terminate with 30 days written notice.
6. The employee must maintain confidentiality of company data.
7. Personal data of the employee will be stored securely with encryption.
8. The employee consents to the collection of personal information for HR purposes.`,
    createdAt: '2024-01-15'
  },
  {
    id: 'doc-2',
    title: 'Vendor Service Agreement',
    titleAr: 'اتفاقية خدمات مورد',
    type: 'agreement',
    department: 'Procurement',
    departmentAr: 'المشتريات',
    content: `This vendor service agreement outlines the terms of service between the Company and the Vendor.

1. The vendor shall provide IT infrastructure services.
2. Payment terms: Net 60 days from invoice date.
3. The vendor must comply with data protection requirements.
4. All data processed by the vendor must be encrypted.
5. The vendor agrees to KYC verification procedures.
6. Transaction records must be maintained for audit purposes.
7. The vendor must report any security incidents within 48 hours.
8. Annual security audits will be conducted on vendor systems.
9. The agreement is governed by the laws of the Kingdom.`,
    createdAt: '2024-03-22'
  },
  {
    id: 'doc-3',
    title: 'Internal Governance Manual',
    titleAr: 'دليل الحوكمة الداخلية',
    type: 'memo',
    department: 'Legal',
    departmentAr: 'الشؤون القانونية',
    content: `This governance manual establishes the internal governance framework.

1. The board of directors shall meet on a quarterly basis.
2. An independent audit committee is established with 3 members.
3. Annual disclosure reports will be published within Q1 each year.
4. All employees must declare conflicts of interest annually.
5. A whistleblower hotline is available for anonymous reporting.
6. Corporate governance training is mandatory for all directors.
7. Risk assessment reports must be presented to the board quarterly.
8. Compliance with all applicable regulations is monitored continuously.`,
    createdAt: '2024-02-10'
  },
  {
    id: 'doc-4',
    title: 'Data Processing Agreement',
    titleAr: 'اتفاقية معالجة البيانات',
    type: 'agreement',
    department: 'IT',
    departmentAr: 'تقنية المعلومات',
    content: `This data processing agreement governs the handling of personal data.

1. Personal data shall only be processed for specified purposes.
2. Data subjects must provide consent before data collection.
3. Data will be encrypted using AES-256 at rest and TLS in transit.
4. Data retention period is limited to 3 years.
5. Data subjects may request access to their data at any time.
6. Data subjects may request deletion of their data.
7. Data breach notifications will be sent within 72 hours.
8. Regular data protection impact assessments will be conducted.
9. Multi-factor authentication is required for data access systems.
10. Access logs are maintained and reviewed monthly.`,
    createdAt: '2024-04-05'
  }
];

export const sampleCheckHistory = [
  {
    id: 'chk-1',
    documentId: 'doc-1',
    regulationIds: ['reg-1', 'reg-4'],
    date: '2024-05-10',
    score: 85,
    riskLevel: 'low',
    conflicts: 1,
  },
  {
    id: 'chk-2',
    documentId: 'doc-2',
    regulationIds: ['reg-1', 'reg-2', 'reg-5'],
    date: '2024-05-12',
    score: 62,
    riskLevel: 'medium',
    conflicts: 4,
  },
  {
    id: 'chk-3',
    documentId: 'doc-3',
    regulationIds: ['reg-3'],
    date: '2024-05-15',
    score: 92,
    riskLevel: 'low',
    conflicts: 0,
  },
  {
    id: 'chk-4',
    documentId: 'doc-4',
    regulationIds: ['reg-1', 'reg-5'],
    date: '2024-05-18',
    score: 78,
    riskLevel: 'medium',
    conflicts: 2,
  }
];

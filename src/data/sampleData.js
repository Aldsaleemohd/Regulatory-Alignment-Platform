export const sampleRegulations = [
  {
    id: 'reg-labor',
    titleAr: 'نظام العمل',
    titleEn: 'Labor Law',
    type: 'law',
    description: 'ينظم العلاقة التعاقدية الشاملة بين العامل وصاحب العمل، ويحدد الحقوق والواجبات، وساعات العمل، والإجازات.',
    keywords: ['عمل', 'عامل', 'صاحب عمل', 'عقد', 'أجر', 'إجازة', 'ساعات', 'مكافأة'],
    clauses: [
      { 
        id: 'c1', 
        text: 'يجب أن يكون عقد العمل مكتوباً ومحرراً من نسختين، يحتفظ كل من الطرفين بنسخة', 
        keywords: ['عقد', 'مكتوبة', 'كتابة', 'نسختين', 'طرفين', 'عامل', 'صاحب عمل'], 
        intent: {
          concept: 'WRITTEN_CONTRACT',
          modality: 'MANDATORY'
        },
        weight: 3 
      },
      { 
        id: 'c2', 
        text: 'يجب دفع أجور العاملين في الوقت المحدد بالعملة الرسمية', 
        keywords: ['أجر', 'راتب', 'مستحقات', 'دفع', 'سداد', 'الوقت', 'المحدد'], 
        intent: {
          concept: 'WAGE_PAYMENT',
          modality: 'MANDATORY'
        },
        weight: 3 
      },
      { 
        id: 'c3', 
        text: 'لا يجوز تشغيل العامل تشغيلاً فعلياً أكثر من ثماني ساعات في اليوم الواحد', 
        keywords: ['ساعات', 'وقت', 'تشغيل', 'دوام', 'ثماني', 'يوم'], 
        intent: {
          concept: 'WORK_HOURS',
          modality: 'PROHIBITED',
          constraint: { type: 'MAX', value: 8, unit: 'ساعة' }
        },
        weight: 3 
      },
      { 
        id: 'c4', 
        text: 'يستحق العامل إجازة سنوية لا تقل مدتها عن واحد وعشرين يوماً', 
        keywords: ['إجازة', 'سنوية', 'عطلة', 'أيام', 'رصيد', 'راحة'], 
        intent: {
          concept: 'ANNUAL_LEAVE',
          modality: 'MANDATORY',
          constraint: { type: 'MIN', value: 21, unit: 'يوم' }
        },
        weight: 3 
      },
      { 
        id: 'c5', 
        text: 'يلتزم صاحب العمل بتوفير العناية الطبية الوقائية والعلاجية للعمال', 
        keywords: ['عناية', 'طبية', 'وقائية', 'تأمين', 'طبي', 'صحي', 'علاج'], 
        intent: {
          concept: 'MEDICAL_CARE',
          modality: 'MANDATORY'
        },
        weight: 3 
      },
      { 
        id: 'c6', 
        text: 'يجب على صاحب العمل دفع مكافأة نهاية الخدمة عند انتهاء العلاقة العمالية', 
        keywords: ['مكافأة', 'تعويض', 'نهاية', 'خدمة', 'انتهاء', 'علاقة'], 
        intent: {
          concept: 'END_OF_SERVICE',
          modality: 'MANDATORY'
        },
        weight: 3 
      }
    ]
  },
  {
    id: 'reg-companies',
    titleAr: 'نظام الشركات',
    titleEn: 'Companies Law',
    type: 'law',
    description: 'ينظم تأسيس الشركات وإدارتها وحوكمتها، إلى جانب ضمان حقوق الشركاء والمساهمين.',
    keywords: ['شركة', 'شركاء', 'مساهمين', 'إدارة', 'أرباح', 'حوكمة', 'تأسيس'],
    clauses: [
      { 
        id: 'c1', 
        text: 'يجب أن يتضمن عقد تأسيس الشركة اسم الشركة وغرضها ومركزها الرئيسي', 
        keywords: ['عقد', 'تأسيس', 'اسم', 'غرض', 'مركز', 'رئيسي'], 
        intent: {
          concept: 'COMPANY_INCORPORATION',
          modality: 'MANDATORY'
        },
        weight: 3 
      },
      { 
        id: 'c2', 
        text: 'يجوز للجمعية العامة العادية عزل أعضاء مجلس الإدارة بقرار يتخذ بالأغلبية', 
        keywords: ['جمعية', 'عامة', 'عزل', 'مجلس', 'إدارة', 'قرار'], 
        intent: {
          concept: 'BOARD_DISMISSAL',
          modality: 'PERMITTED'
        },
        weight: 3 
      },
      { 
        id: 'c3', 
        text: 'يجب على الشركة الاحتفاظ بسجلات محاسبية دقيقة وواضحة', 
        keywords: ['سجلات', 'محاسبية', 'قوائم', 'مالية', 'دقيقة', 'مراجعة'], 
        intent: {
          concept: 'FINANCIAL_RECORDS',
          modality: 'MANDATORY'
        },
        weight: 3 
      },
      { 
        id: 'c4', 
        text: 'لا يجوز لعضو مجلس الإدارة أن يكون له مصلحة مباشرة أو غير مباشرة في أعمال تعقد لحساب الشركة', 
        keywords: ['مصلحة', 'مباشرة', 'تعارض', 'أعمال', 'حساب', 'عضو', 'مجلس'], 
        intent: {
          concept: 'CONFLICT_OF_INTEREST',
          modality: 'PROHIBITED'
        },
        weight: 3 
      },
      { 
        id: 'c5', 
        text: 'تلتزم الشركة بتعين مراجع حسابات أو أكثر من بين المحاسبين المرخصين بالعمل في المملكة', 
        keywords: ['مراجع', 'حسابات', 'محاسب', 'تدقيق', 'مرخص', 'اعتماد'], 
        intent: {
          concept: 'AUDITOR_APPOINTMENT',
          modality: 'MANDATORY'
        },
        weight: 2 
      },
      { 
        id: 'c6', 
        text: 'توزع الأرباح الصافية على المساهمين بعد إقتطاع الاحتياطيات النظامية', 
        keywords: ['أرباح', 'توزيع', 'مساهمين', 'اقتطاع', 'احتياطي', 'صافية'], 
        intent: {
          concept: 'PROFIT_DISTRIBUTION',
          modality: 'MANDATORY',
          requirements: ['اقتطاع', 'احتياطي']
        },
        weight: 2 
      }
    ]
  },
  {
    id: 'reg-tenders',
    titleAr: 'نظام المنافسات والمشتريات الحكومية',
    titleEn: 'Government Tenders and Procurement Law',
    type: 'law',
    description: 'ينظم عمليات الشراء الحكومي ويضمن الشفافية والعدالة والمساواة في المنافسات العامة.',
    keywords: ['منافسة', 'مشتريات', 'عروض', 'مزايدة', 'حكومي', 'ترسية', 'متعاقد'],
    clauses: [
      { 
        id: 'c1', 
        text: 'يجب طرح الأعمال والمشتريات الحكومية في منافسة عامة تحقيقاً للشفافية وتكافؤ الفرص', 
        keywords: ['طرح', 'أعمال', 'مشتريات', 'منافسة', 'عامة', 'شفافية', 'فرص'], 
        intent: {
          concept: 'PUBLIC_TENDER',
          modality: 'MANDATORY'
        },
        weight: 3 
      },
      { 
        id: 'c2', 
        text: 'يجب على صاحب العرض تقديم ضمان ابتدائي مع العرض بنسبة محددة من قيمته', 
        keywords: ['ضمان', 'ابتدائي', 'بنكي', 'عرض', 'نسبة', 'تأمين', 'قيمة'], 
        intent: {
          concept: 'BID_BOND',
          modality: 'MANDATORY'
        },
        weight: 3 
      },
      { 
        id: 'c3', 
        text: 'لا يجوز مطلقاً تجزئة المشتريات أو الأعمال من أجل التهرب من شروط المنافسة', 
        keywords: ['تجزئة', 'تقسيم', 'مشتريات', 'أعمال', 'تهرب', 'شروط', 'منافسة'], 
        intent: {
          concept: 'TENDER_SPLITTING',
          modality: 'PROHIBITED'
        },
        weight: 3 
      },
      { 
        id: 'c4', 
        text: 'يتم دراسة وفحص العروض من قبل لجنة مختصة لضمان مطابقتها للشروط الفنية والمالية', 
        keywords: ['دراسة', 'فحص', 'عروض', 'لجنة', 'مختصة', 'مطابقة', 'فنية'], 
        intent: {
          concept: 'BID_EVALUATION',
          modality: 'MANDATORY'
        },
        weight: 2 
      },
      { 
        id: 'c5', 
        text: 'تدفع مستحقات المتعاقد وفقاً للمستخلصات المعتمدة وخلال المدة النظامية المحددة للاستحقاق', 
        keywords: ['دفع', 'سداد', 'مستحقات', 'متعاقد', 'مستخلص', 'صرف', 'مدة', 'نظامية'], 
        intent: {
          concept: 'PAYMENT_TERMS',
          modality: 'MANDATORY'
        },
        weight: 3 
      },
      { 
        id: 'c6', 
        text: 'تطبق غرامة تأخير على المتعاقد في حال إخلاله بتسليم الأعمال المطلوبة في موعدها', 
        keywords: ['غرامة', 'تأخير', 'جزاء', 'عقوبة', 'تعويض', 'تسليم', 'أعمال'], 
        intent: {
          concept: 'DELAY_PENALTY',
          modality: 'MANDATORY'
        },
        weight: 3 
      }
    ]
  }
];

export const sampleDocuments = [
  {
    id: 'doc-1',
    title: 'عقد توظيف قيادي',
    titleAr: 'عقد توظيف قيادي',
    type: 'contract',
    department: 'Human Resources',
    departmentAr: 'الموارد البشرية',
    content: `إتفاقية العمل:
1- يلتزم الموظف بالعمل لمدة 10 ساعات يومياً.
2- سيتم تحويل الرواتب في نهاية كل شهر.
3- لا يستحق الموظف أي إجازة سنوية خلال أول سنتين أو ما يعادل 15 يوم.
4- يقر الطرفان بعدم وجود تأمين طبي.
5- يعفى الطرف الثاني من حقه في مكافأة نهاية الخدمة المنصوص عليه نظاماً.`,
    createdAt: '2024-05-15'
  },
  {
    id: 'doc-2',
    title: 'مسودة عقد التأسيس',
    titleAr: 'مسودة عقد التأسيس',
    type: 'agreement',
    department: 'Legal',
    departmentAr: 'الشؤون القانونية',
    content: `ينص عقد الحوكمة وتأسيس الشركة على ما يلي:
- اسم الشركة وغرضها محدد ومركزها الرئيسي في جدة.
- يتم الاحتفاظ بكافة القوائم المالية والسجلات المحاسبية.
- يُسمح بشكل استثنائي لأعضاء مجلس الإدارة بالدخول في أعمال ذات مصلحة مباشرة مع الشركة.
- يجوز للجمعية العامة عزل الأعضاء وفقاً للأغلبية.
- يتم توزيع الأرباح على المساهمين مباشرة دون اقتطاع احتياطي تجنباً لتجميد الأموال.`,
    createdAt: '2024-06-20'
  },
  {
    id: 'doc-3',
    title: 'كراسة شروط مشروع البنية التحتية',
    titleAr: 'كراسة شروط مشروع البنية التحتية',
    type: 'policy',
    department: 'Procurement',
    departmentAr: 'المشتريات',
    content: `مستند طلب العروض لمشروع تقني:
- سيتم تجزئة المشتريات إلى عقود صغيرة لتسريع عملية التنفيذ وللتهرب من قيود المنافسة العامة.
- يتطلب من الجهة المنفذة تقديم ضمان ابتدائي مع العرض.
- لا تطبق غرامة تأخير على المتعاقد في حال تأخره عن تسليم الأعمال.
- يتم صرف المبالغ دون الرجوع إلى المستخلصات المعتمدة لتوفير الوقت.`,
    createdAt: '2024-07-10'
  }
];

export const sampleCheckHistory = [
  {
    id: 'chk-1',
    documentId: 'doc-1',
    regulationIds: ['reg-labor'],
    date: '2024-08-10',
    score: 45,
    riskLevel: 'high',
    conflicts: 3,
  },
  {
    id: 'chk-2',
    documentId: 'doc-2',
    regulationIds: ['reg-companies'],
    date: '2024-08-12',
    score: 60,
    riskLevel: 'medium',
    conflicts: 2,
  },
  {
    id: 'chk-3',
    documentId: 'doc-3',
    regulationIds: ['reg-tenders'],
    date: '2024-08-15',
    score: 30,
    riskLevel: 'high',
    conflicts: 4,
  }
];

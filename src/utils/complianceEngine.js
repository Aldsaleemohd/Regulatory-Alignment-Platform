const ONTOLOGY = {
  CONCEPTS: {
    "WORK_HOURS": ["ساعات", "تشغيل", "دوام"],
    "ANNUAL_LEAVE": ["إجازة", "سنوية", "رصيد إجازات"],
    "MEDICAL_CARE": ["تأمين طبي", "عناية طبية", "علاج", "وقاية"],
    "END_OF_SERVICE": ["مكافأة", "نهاية خدمة", "تعويض نهاية"],
    "WAGE_PAYMENT": ["راتب", "أجر", "رواتب"],
    "WRITTEN_CONTRACT": ["عقد", "مكتوب", "نسختين"],
    "COMPANY_INCORPORATION": ["تأسيس", "عقد تأسيس", "مركز", "اسم"],
    "BOARD_DISMISSAL": ["جمعية", "عزل", "استبعاد"],
    "FINANCIAL_RECORDS": ["سجلات", "محاسبية", "قوائم"],
    "CONFLICT_OF_INTEREST": ["مصلحة", "تنافس", "تعارض"],
    "AUDITOR_APPOINTMENT": ["مراجع", "محاسب مرخص"],
    "PROFIT_DISTRIBUTION": ["أرباح", "توزيع"],
    "PUBLIC_TENDER": ["منافسة عامة", "طرح", "شفافية"],
    "BID_BOND": ["ضمان", "ابتدائي", "بنكي"],
    "TENDER_SPLITTING": ["تجزئة", "صغيرة", "تقسيم المشتريات"],
    "BID_EVALUATION": ["فحص", "دراسة العروض", "مطابقة"],
    "PAYMENT_TERMS": ["مستخلصات", "صرف", "الدفع"],
    "DELAY_PENALTY": ["غرامة تأخير", "غرامة", "جزاء تأخير"]
  },
  NEGATIONS: ["لا", "يسقط", "عدم", "يعفى", "يستثنى", "بدون", "دون", "تنازل"],
  MANDATORY: ["يجب", "يلتزم", "على الطرفين", "يقر", "تلتزم", "يتطلب"],
  PROHIBITED: ["لا يجوز", "يمنع", "يحظر", "غير مسموح", "يمنع مطلقاً"]
};

// Map textual numbers to digits
const NUMBER_MAP = {
  "واحد": 1, "اثنين": 2, "ثلاثة": 3, "ثلاث": 3, "أربعة": 4, "أربع": 4, 
  "خمسة": 5, "خمس": 5, "ستة": 6, "ست": 6, "سبعة": 7, "سبع": 7, 
  "ثمانية": 8, "ثماني": 8, "تسعة": 9, "تسع": 9, "عشرة": 10, "عشر": 10,
  "عشرين": 20, "يوما": 1, "يوم": 1
};

export function normalizeText(text) {
  if (!text) return "";
  let norm = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟،"']/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/أ|إ|آ/g, "ا")
    .trim();

  // Convert explicit word numbers into digits for math
  Object.keys(NUMBER_MAP).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    norm = norm.replace(regex, NUMBER_MAP[word]);
  });
  
  return norm;
}

// Extract number positioned before or after a unit (e.g. "10 ساعات")
function extractNumberNearUnit(normalizedContent, unit) {
  const normUnit = normalizeText(unit);
  
  // Extract patterns like "10 ساعه" or "ساعه 10" or "10 ايام"
  // Assuming unit could be partially matched like "ساع" for "ساعات" or "ساعة"
  const unitRoot = normUnit.substring(0, 3); 
  
  const regex = new RegExp(`(\\d+)\\s*[^\\d]*?${unitRoot}|${unitRoot}[^\\d]*?\\s*(\\d+)`);
  const match = normalizedContent.match(regex);
  if (match) {
    if (match[1]) return parseInt(match[1]);
    if (match[2]) return parseInt(match[2]);
  }
  return null;
}

// Detect negated context
function isNegated(normalizedContent, conceptWords) {
  for (let kw of conceptWords) {
    let kwNorm = normalizeText(kw);
    let index = normalizedContent.indexOf(kwNorm);
    if (index !== -1) {
      // Look back ~20 characters to see if a negation word exists
      let contextBefore = normalizedContent.substring(Math.max(0, index - 25), index);
      // Look ahead ~20 chars
      let contextAfter = normalizedContent.substring(index, index + 25);
      
      let context = contextBefore + " " + contextAfter;
      let hasNegation = ONTOLOGY.NEGATIONS.some(n => context.includes(normalizeText(n)));
      if (hasNegation) return true;
    }
  }
  return false;
}

export function runComplianceCheck(document, regulations) {
  const results = [];
  let totalWeight = 0;
  let compliantWeight = 0;
  const conflicts = [];
  const recommendations = [];
  
  const contentNorm = normalizeText(document?.content || "");
  let hasAnyMatch = false;

  (regulations || []).forEach(reg => {
    (reg.clauses || []).forEach(clause => {
      totalWeight += clause.weight;
      
      const intent = clause.intent || {};
      const conceptWords = ONTOLOGY.CONCEPTS[intent.concept] || clause.keywords || [];
      
      const matchedOriginals = [];
      
      // 1. Core Semantic concept match
      conceptWords.forEach(kw => {
        const kwNorm = normalizeText(kw);
        if (contentNorm.includes(kwNorm)) {
          matchedOriginals.push(kw);
          hasAnyMatch = true;
        }
      });
      
      let isConceptMentioned = matchedOriginals.length > 0;
      let status = 'failed';
      let failureReason = '';
      let fraction = 0;

      // Intent Evaluation Engine
      if (!isConceptMentioned) {
        // If concept is not even mentioned, what does the intent say?
        if (intent.modality === 'MANDATORY') {
          status = 'failed';
          failureReason = `غياب مفهوم "${clause.keywords[0]}" الإلزامي`;
          fraction = 0;
        } else if (intent.modality === 'PROHIBITED') {
           // Not mentioned = compliant! (e.g. didn't mention conflict of interest)
           status = 'passed';
           fraction = 1;
        } else {
           status = 'warning';
           fraction = 0.5;
           failureReason = "عدم التطرق للمتطلب";
        }
      } else {
        // Concept is mentioned, analyze intent logic
        let negated = isNegated(contentNorm, conceptWords);
        
        // Logical rule check
        if (intent.modality === 'MANDATORY' && negated) {
           status = 'failed';
           fraction = 0;
           failureReason = `تم نفي التزام إجباري متعلق بـ "${clause.keywords[0]}"`;
        } else if (intent.modality === 'PROHIBITED' && !negated) {
           status = 'failed';
           fraction = 0;
           failureReason = `تم السماح بأمر محظور متعلق بـ "${clause.keywords[0]}"`;
        } else {
           status = 'passed';
           fraction = 1;
        }

        // Constraint evaluation
        if (intent.constraint && status === 'passed') {
           let extractedNum = extractNumberNearUnit(contentNorm, intent.constraint.unit);
           if (extractedNum !== null) {
              if (intent.constraint.type === 'MAX' && extractedNum > intent.constraint.value) {
                 status = 'failed';
                 fraction = 0;
                 failureReason = `الرقم المذكور (${extractedNum} ${intent.constraint.unit}) يتجاوز الحد المسموح وهو (${intent.constraint.value})`;
              } else if (intent.constraint.type === 'MIN' && extractedNum < intent.constraint.value) {
                 status = 'failed';
                 fraction = 0;
                 failureReason = `الرقم المذكور (${extractedNum} ${intent.constraint.unit}) يقل عن الحد الأدنى وهو (${intent.constraint.value})`;
              }
           }
        }
        
        // Explicit requirements logic embedded within a positive match
        if (intent.requirements && status === 'passed') {
          let missingReqs = intent.requirements.filter(req => !contentNorm.includes(normalizeText(req)));
          if (missingReqs.length > 0) {
             status = 'failed';
             fraction = 0;
             failureReason = `غياب شروط أساسية متعلقة بالبند: ${missingReqs.join(', ')}`;
             
             // Check if it explicitly states exclusion (e.g., "دون اقتطاع")
             let withoutReqsContext = ONTOLOGY.NEGATIONS.some(n => {
                 let nNorm = normalizeText(n);
                 return missingReqs.some(req => contentNorm.includes(nNorm + " " + normalizeText(req)));
             });
             
             if (withoutReqsContext) {
                 failureReason = `مخالفة صريحة - تم استثناء شرط أساسي: ${missingReqs.join(', ')}`;
             }
          }
        }
      }

      // Legacy fallback fallback behavior if ratio works better for partial UI
      let matchRatio = isConceptMentioned ? Math.round((matchedOriginals.length / Math.max(clause.keywords.length, 1)) * 100) : 0;
      if (status === 'passed') matchRatio = 100;
      if (status === 'warning') matchRatio = matchRatio || 50;

      if (status === 'passed') {
        compliantWeight += clause.weight;
      } else if (status === 'warning') {
        compliantWeight += clause.weight * 0.5;
      }

      const entry = {
        regulationId: reg.id,
        regulationTitle: reg.titleEn,
        regulationTitleAr: reg.titleAr,
        clauseId: clause.id,
        clauseText: clause.text,
        status,
        matchRatio,
        matchedKeywords: matchedOriginals,
        missingKeywords: clause.keywords.filter(k => !matchedOriginals.includes(k)),
        weight: clause.weight,
        failureReason
      };
      
      results.push(entry);

      if (status === 'failed') {
        conflicts.push({
          clause: clause.text,
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          severity: clause.weight >= 3 ? 'high' : 'medium',
          detail: failureReason || `لم يتم تحقيق القصد التشريعي المتعلق بـ "${clause.keywords[0]}"`,
        });
        
        recommendations.push({
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          text: `تعارض جوهري: يوصى بتعديل البند ليطابق النظام لتلافي (${failureReason})`,
          textAr: `تعارض جوهري: يوصى بتعديل البند ليطابق النظام لتلافي (${failureReason})`,
          priority: clause.weight >= 3 ? 'high' : 'medium',
        });
      } else if (status === 'warning') {
        recommendations.push({
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          text: `يوجد تعارض محتمل. يوصى بمراجعة النص.`,
          textAr: `يوجد نقص أو تعارض محتمل. يوصى بمراجعة النص بشكل أكثر تفصيلاً.`,
          priority: 'low',
        });
      }
    });
  });

  if (results.length === 0) {
    return {
      score: 0,
      riskLevel: "high",
      results: [],
      conflicts: [],
      recommendations: [{
        regulationAr: "عام",
        text: "تنبيه: لم يتم العثور على أي نتائج مطابقة.",
        textAr: "تنبيه: لم يتم العثور على أي نتائج مطابقة.",
        priority: "high",
      }],
      totalClauses: 0,
      passedClauses: 0,
      failedClauses: 0,
      warningClauses: 0
    };
  }

  if (!hasAnyMatch) {
    recommendations.unshift({
      regulationAr: "عام",
      text: "تنبيه: لم يتم العثور على أي ارتباطات دلالية في المستند مع الأنظمة.",
      textAr: "تنبيه: لم يتم العثور على أي ارتباطات دلالية في المستند مع الأنظمة.",
      priority: "high"
    });
  }

  const score = totalWeight > 0 ? Math.round((compliantWeight / totalWeight) * 100) : 0;
  let riskLevel = 'low';
  if (score < 60) riskLevel = 'high';
  else if (score < 85) riskLevel = 'medium';

  const uniqueRecommendations = recommendations.filter((r, index, self) =>
    index === self.findIndex((t) => t.textAr === r.textAr)
  );

  return {
    score,
    riskLevel,
    results,
    conflicts,
    recommendations: uniqueRecommendations,
    totalClauses: results.length,
    passedClauses: results.filter(r => r.status === 'passed').length,
    failedClauses: results.filter(r => r.status === 'failed').length,
    warningClauses: results.filter(r => r.status === 'warning').length
  };
}

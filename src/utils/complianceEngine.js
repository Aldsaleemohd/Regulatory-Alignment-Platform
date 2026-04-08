const SYNONYMS = {
  "أجر": ["راتب", "مستحقات", "أجر"],
  "دفع": ["سداد", "تحويل", "صرف"],
  "عقد": ["اتفاقية", "تعاقد"],
  "غرامة": ["جزاء", "عقوبة"]
};

function normalizeText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟،"']/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
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
      
      const matchedOriginals = [];
      const missingKeywords = [];

      clause.keywords.forEach(kw => {
        const kwNorm = normalizeText(kw);
        let syns = [kwNorm];
        
        for (const [key, values] of Object.entries(SYNONYMS)) {
          const keyNorm = normalizeText(key);
          const valuesNorm = values.map(normalizeText);
          if (keyNorm === kwNorm || valuesNorm.includes(kwNorm)) {
            syns = [...new Set([...syns, keyNorm, ...valuesNorm])];
          }
        }

        if (syns.some(syn => contentNorm.includes(syn))) {
          matchedOriginals.push(kw);
          hasAnyMatch = true;
        } else {
          missingKeywords.push(kw);
        }
      });

      const matchRatio = clause.keywords.length > 0 ? (matchedOriginals.length / clause.keywords.length) : 0;
      
      let status = 'failed';
      if (matchRatio >= 0.3) { 
        status = 'passed'; 
        compliantWeight += clause.weight; 
      } else if (matchRatio >= 0.15) { 
        status = 'warning'; 
        compliantWeight += clause.weight * 0.5; 
      }

      const entry = {
        regulationId: reg.id,
        regulationTitle: reg.titleEn,
        regulationTitleAr: reg.titleAr,
        clauseId: clause.id,
        clauseText: clause.text,
        status,
        matchRatio: Math.round(matchRatio * 100),
        matchedKeywords: matchedOriginals,
        missingKeywords: missingKeywords,
        weight: clause.weight,
      };
      
      results.push(entry);

      if (status === 'failed') {
        conflicts.push({
          clause: clause.text,
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          severity: clause.weight >= 3 ? 'high' : 'medium',
          detail: `الكلمات المفقودة: ${missingKeywords.join('، ')}`,
        });
        
        recommendations.push({
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          text: `يوصى بمراجعة هذا البند لضمان توافقه مع النظام`,
          textAr: `يوصى بمراجعة هذا البند لضمان توافقه مع النظام`,
          priority: clause.weight >= 3 ? 'high' : 'medium',
        });
      } else if (status === 'warning') {
        recommendations.push({
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          text: `يوجد تعارض محتمل. يوصى بتعديل البند ليكون أكثر توافقاً.`,
          textAr: `يوجد تعارض محتمل. يوصى بتعديل البند ليكون أكثر توافقاً.`,
          priority: 'low',
        });
      }
    });
  });

  if (results.length === 0) {
    return {
      score: 0,
      riskLevel: "high",
      results: [{
        regulationTitleAr: 'تنبيه النظام',
        clauseText: 'لا توجد بنود متاحة للفحص',
        status: 'warning',
        matchRatio: 0,
        matchedKeywords: [],
        missingKeywords: [],
        weight: 0
      }],
      conflicts: [],
      recommendations: [{
        regulationAr: "عام",
        text: "تنبيه: لم يتم العثور على أي نتائج مطابقة. يرجى التحقق من المدخلات.",
        textAr: "تنبيه: لم يتم العثور على أي نتائج مطابقة. يرجى التحقق من المدخلات.",
        priority: "high",
      }],
      totalClauses: 1,
      passedClauses: 0,
      failedClauses: 0,
      warningClauses: 1
    };
  }

  if (!hasAnyMatch) {
    recommendations.unshift({
      regulationAr: "عام",
      text: "تنبيه: لم يتم العثور على أي ارتباطات قانونية في المستند. يوصى بمراجعة وتعديل النص لتضمين المصطلحات النظامية.",
      textAr: "تنبيه: لم يتم العثور على أي ارتباطات قانونية في المستند. يوصى بمراجعة وتعديل النص لتضمين المصطلحات النظامية.",
      priority: "high"
    });
  }

  const score = totalWeight > 0 ? Math.round((compliantWeight / totalWeight) * 100) : 0;
  let riskLevel = 'low';
  if (score < 50) riskLevel = 'high';
  else if (score < 75) riskLevel = 'medium';

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

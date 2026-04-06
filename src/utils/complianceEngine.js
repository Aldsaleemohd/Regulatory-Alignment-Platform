// Improved Compliance Engine with Arabic normalization + synonyms

const SYNONYMS = {
  "أجر": ["راتب", "مستحقات", "أجر"],
  "دفع": ["سداد", "تحويل", "دفع"],
  "شهري": ["شهري", "كل شهر"],
  "عقد": ["اتفاقية", "عقد"],
  "غرامة": ["جزاء", "عقوبة", "غرامة"]
};

// تنظيف النص
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, "") // يدعم العربي
    .replace(/\s+/g, " ");
}

// توسيع الكلمات
function expandKeywords(keywords) {
  let expanded = [];
  keywords.forEach(k => {
    if (SYNONYMS[k]) {
      expanded = expanded.concat(SYNONYMS[k]);
    } else {
      expanded.push(k);
    }
  });
  return [...new Set(expanded)];
}

export function runComplianceCheck(document, regulations) {
  const results = [];
  let totalWeight = 0;
  let compliantWeight = 0;
  const conflicts = [];
  const recommendations = [];

  const content = normalizeText(document.content);

  regulations.forEach(reg => {
    reg.clauses.forEach(clause => {
      totalWeight += clause.weight;

      const expandedKeywords = expandKeywords(clause.keywords);

      const matched = expandedKeywords.filter(kw =>
        content.includes(normalizeText(kw))
      );

      const matchRatio = matched.length / expandedKeywords.length;

      let status = "failed";

      if (matchRatio >= 0.3) {
        status = "passed";
        compliantWeight += clause.weight;
      } else if (matchRatio >= 0.15) {
        status = "warning";
        compliantWeight += clause.weight * 0.5;
      }

      results.push({
        clauseText: clause.text,
        status,
        matchRatio: Math.round(matchRatio * 100),
        matchedKeywords: matched,
        weight: clause.weight
      });

      if (status === "failed") {
        conflicts.push({
          clause: clause.text,
          regulation: reg.titleAr,
          severity: clause.weight >= 3 ? "high" : "medium",
          detail: "لم يتم العثور على كلمات مطابقة"
        });

        recommendations.push({
          text: `يُنصح بمراجعة البند: "${clause.text}"`,
          priority: clause.weight >= 3 ? "high" : "medium"
        });
      }
    });
  });

  // fallback لو ما فيه نتائج
  if (results.length === 0) {
    return {
      score: 0,
      riskLevel: "high",
      results: [],
      conflicts: [{
        clause: "لا يوجد تطابق",
        regulation: "النظام",
        severity: "high",
        detail: "لم يتم العثور على أي كلمات قانونية"
      }],
      recommendations: [{
        text: "أضف كلمات قانونية أو عدل المستند",
        priority: "high"
      }],
      totalClauses: 0,
      passedClauses: 0,
      failedClauses: 0,
      warningClauses: 0
    };
  }

  const score = Math.round((compliantWeight / totalWeight) * 100);

  let riskLevel = "low";
  if (score < 50) riskLevel = "high";
  else if (score < 75) riskLevel = "medium";

  return {
    score,
    riskLevel,
    results,
    conflicts,
    recommendations,
    totalClauses: results.length,
    passedClauses: results.filter(r => r.status === "passed").length,
    failedClauses: results.filter(r => r.status === "failed").length,
    warningClauses: results.filter(r => r.status === "warning").length
  };
}

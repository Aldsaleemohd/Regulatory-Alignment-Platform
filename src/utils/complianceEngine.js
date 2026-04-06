// Compliance Check Engine - Keyword-based clause matching with weighted scoring

export function runComplianceCheck(document, regulations) {
  const results = [];
  let totalWeight = 0;
  let compliantWeight = 0;
  const conflicts = [];
  const recommendations = [];
  const contentLower = document.content.toLowerCase();

  regulations.forEach(reg => {
    reg.clauses.forEach(clause => {
      totalWeight += clause.weight;
      const matched = clause.keywords.filter(kw => contentLower.includes(kw.toLowerCase()));
      const matchRatio = matched.length / clause.keywords.length;
      let status = 'failed';
      if (matchRatio >= 0.6) { status = 'passed'; compliantWeight += clause.weight; }
      else if (matchRatio >= 0.3) { status = 'warning'; compliantWeight += clause.weight * 0.5; }

      const entry = {
        regulationId: reg.id,
        regulationTitle: reg.titleEn,
        regulationTitleAr: reg.titleAr,
        clauseId: clause.id,
        clauseText: clause.text,
        status,
        matchRatio: Math.round(matchRatio * 100),
        matchedKeywords: matched,
        missingKeywords: clause.keywords.filter(k => !matched.includes(k)),
        weight: clause.weight,
      };
      results.push(entry);

      if (status === 'failed') {
        conflicts.push({
          clause: clause.text,
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          severity: clause.weight >= 3 ? 'high' : 'medium',
          detail: `Missing keywords: ${clause.keywords.filter(k => !matched.includes(k)).join(', ')}`,
        });
        recommendations.push({
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          text: `Review and update document to address: "${clause.text}"`,
          textAr: `مراجعة وتحديث المستند لمعالجة: "${clause.text}"`,
          priority: clause.weight >= 3 ? 'high' : 'medium',
        });
      } else if (status === 'warning') {
        recommendations.push({
          regulation: reg.titleEn,
          regulationAr: reg.titleAr,
          text: `Partially addressed: "${clause.text}" - Consider strengthening language.`,
          textAr: `معالجة جزئية: "${clause.text}" - يُنصح بتعزيز الصياغة.`,
          priority: 'low',
        });
      }
    });
  });

  const score = totalWeight > 0 ? Math.round((compliantWeight / totalWeight) * 100) : 0;
  let riskLevel = 'low';
  if (score < 50) riskLevel = 'high';
  else if (score < 75) riskLevel = 'medium';

  return { score, riskLevel, results, conflicts, recommendations, totalClauses: results.length, passedClauses: results.filter(r => r.status === 'passed').length, failedClauses: results.filter(r => r.status === 'failed').length, warningClauses: results.filter(r => r.status === 'warning').length };
}

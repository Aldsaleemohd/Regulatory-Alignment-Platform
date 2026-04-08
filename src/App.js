import React, { useState, useMemo } from 'react';
import { useApp } from './context/AppContext';
import { runComplianceCheck } from './utils/complianceEngine';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/* ============================================================
   EXECUTIVE ICONS (inline SVG)
   ============================================================ */
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    check: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    report: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    play: <><polygon points="5 3 19 12 5 21 5 3"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

const EmptyState = ({ title, desc }) => (
  <div className="empty-state">
    <Icon name="info" />
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

/* ============================================================
   MODAL COMPONENT
   ============================================================ */
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-icon" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PAGE - CONSULTING GRADE
   ============================================================ */
function DashboardPage() {
  const { t, lang, documents, regulations, checkHistory } = useApp();

  const complianceAvg = checkHistory.length > 0 ? Math.round(checkHistory.reduce((a, c) => a + c.score, 0) / checkHistory.length) : 0;
  const totalConflicts = checkHistory.reduce((a, c) => a + c.conflicts, 0);

  const riskData = [
    { name: t('low'), value: checkHistory.filter(c => c.riskLevel === 'low').length, color: '#0B3D2E' },
    { name: t('medium'), value: checkHistory.filter(c => c.riskLevel === 'medium').length, color: '#C9A646' },
    { name: t('high'), value: checkHistory.filter(c => c.riskLevel === 'high').length, color: '#b91c1c' },
  ];

  return (
    <div>
      <div className="stats-wrapper">
        <div className="exec-stat-card primary">
          <div className="icon-box"><Icon name="file" size={24}/></div>
          <div className="exec-stat-content"><h4>{documents.length}</h4><p>{lang === 'ar' ? 'إجمالي المستندات' : 'Total Documents'}</p></div>
        </div>
        <div className="exec-stat-card primary">
          <div className="icon-box"><Icon name="book" size={24}/></div>
          <div className="exec-stat-content"><h4>{regulations.length}</h4><p>{lang === 'ar' ? 'الأنظمة المفهرسة' : 'Regulations'}</p></div>
        </div>
        <div className="exec-stat-card warning">
          <div className="icon-box"><Icon name="shield" size={24}/></div>
          <div className="exec-stat-content"><h4>{complianceAvg}%</h4><p>{lang === 'ar' ? 'مؤشر الامتثال' : 'Compliance Index'}</p></div>
        </div>
        <div className="exec-stat-card danger">
          <div className="icon-box"><Icon name="alert" size={24}/></div>
          <div className="exec-stat-content"><h4>{totalConflicts}</h4><p>{lang === 'ar' ? 'تعارضات مكتشفة' : 'Detected Conflicts'}</p></div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>{lang === 'ar' ? 'توزيع المخاطر النظامية' : 'Regulatory Risk Overview'}</h3></div>
          {checkHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={riskData} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={60} label={({ name, value }) => `${name}: ${value}`}>
                  {riskData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState title={t('noData')} desc={lang === 'ar' ? 'قم بإجراء فحص امتثال لتوليد الرسوم البيانية.' : 'Run a compliance check to generate charts.'} />}
        </div>
        
        <div className="card">
          <div className="card-header"><h3>{lang === 'ar' ? 'أهم التنبيهات (Key Alerts)' : 'Key Alerts'}</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {checkHistory.filter(c => c.conflicts > 0).slice(0, 4).map((ch, i) => {
              const doc = documents.find(d => d.id === ch.documentId);
              return (
                <div key={i} className={`exec-item ${ch.riskLevel}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{doc ? (lang === 'ar' ? doc.titleAr||doc.title : doc.title) : 'Unknown'}</strong>
                    <span className={`badge badge-${ch.riskLevel}`}>{t(ch.riskLevel)}</span>
                  </div>
                  <p style={{ marginTop: 6 }}>{lang === 'ar' ? `يحتوي على ${ch.conflicts} تعارضات تتطلب المراجعة الفورية.` : `${ch.conflicts} conflicts require immediate review.`}</p>
                </div>
              );
            })}
            {checkHistory.filter(c => c.conflicts > 0).length === 0 && <EmptyState title={lang === 'ar' ? 'لا توجد تنبيهات' : 'No Alerts'} desc="" />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   REGULATIONS PAGE
   ============================================================ */
function RegulationsPage() {
  const { t, lang, regulations } = useApp();
  
  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>{lang === 'ar' ? 'سجل التشريعات والأنظمة' : 'Regulations Registry'}</h3>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>{t('title')}</th><th>{t('type')}</th><th>{t('clauses')}</th></tr></thead>
          <tbody>
            {regulations.map(r => (
              <tr key={r.id}>
                <td><strong>{lang === 'ar' ? r.titleAr : r.titleEn}</strong><br /><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.description}</span></td>
                <td><span className={`badge badge-${r.type}`}>{t(r.type)}</span></td>
                <td>{r.clauses?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   DOCUMENTS PAGE
   ============================================================ */
function DocumentsPage() {
  const { t, lang, documents } = useApp();
  const [viewDoc, setViewDoc] = useState(null);

  return (
    <div className="card">
      <div className="card-header"><h3>{lang === 'ar' ? 'إدارة المستندات القانونية' : 'Legal Documents'}</h3></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>{t('title')}</th><th>{t('department')}</th><th>{t('actions')}</th></tr></thead>
          <tbody>
            {documents.map(d => (
              <tr key={d.id}>
                <td><strong>{lang === 'ar' ? (d.titleAr || d.title) : d.title}</strong></td>
                <td>{lang === 'ar' ? (d.departmentAr || d.department) : d.department}</td>
                <td><button className="btn-icon" onClick={() => setViewDoc(d)}><Icon name="eye" size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewDoc && (
        <Modal title={lang === 'ar' ? (viewDoc.titleAr || viewDoc.title) : viewDoc.title} onClose={() => setViewDoc(null)}>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7, fontFamily: 'inherit' }}>{viewDoc.content}</pre>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   COMPLIANCE CHECK PAGE (CORE)
   ============================================================ */
function ComplianceCheckPage() {
  const { t, lang, documents, regulations, addCheckResult } = useApp();
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedRegs, setSelectedRegs] = useState([]);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const toggleReg = (id) => setSelectedRegs(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);

  const handleRun = () => {
    if (!selectedDoc || selectedRegs.length === 0) return;
    setRunning(true);
    setTimeout(() => {
      const doc = documents.find(d => d.id === selectedDoc);
      const regs = regulations.filter(r => selectedRegs.includes(r.id));
      const res = runComplianceCheck(doc, regs);
      setResult(res);
      addCheckResult({ documentId: selectedDoc, regulationIds: selectedRegs, score: res.score, riskLevel: res.riskLevel, conflicts: res.conflicts.length });
      setRunning(false);
    }, 1200); // 1.2s loader to feel substantial
  };

  return (
    <div>
      {!result ? (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="card">
            <div className="card-header"><h3>{lang === 'ar' ? 'بدء فحص الامتثال المتقدم' : 'Initialize Compliance Check'}</h3></div>
            
            <div style={{ marginBottom: 24 }}>
              <label>{lang === 'ar' ? 'حدد المستند المستهدف' : 'Target Document'}</label>
              <select className="form-control" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}>
                <option value="">{t('selectDocument')}...</option>
                {documents.map(d => <option key={d.id} value={d.id}>{lang === 'ar' ? (d.titleAr || d.title) : d.title}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label>{lang === 'ar' ? 'اختر مراجع الامتثال التشريعي' : 'Select Regulatory Benchmarks'}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
                {regulations.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, border: '1px solid var(--border)', borderRadius: 4 }}>
                    <input type="checkbox" id={r.id} checked={selectedRegs.includes(r.id)} onChange={() => toggleReg(r.id)} />
                    <label htmlFor={r.id} style={{ margin: 0, color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? r.titleAr : r.titleEn}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }} onClick={handleRun} disabled={!selectedDoc || selectedRegs.length === 0 || running}>
              {running ? <span className="loader-spinner"></span> : <><Icon name="play" size={18} /> {lang === 'ar' ? 'بدء الفحص الآلي' : 'Run Compliance Check'}</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="results-view">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0 }}>{lang === 'ar' ? 'نتائج فحص الامتثال التشريعي' : 'Compliance Intelligence Report'}</h2>
            <button className="btn btn-outline" onClick={() => setResult(null)}>{lang === 'ar' ? 'فحص جديد' : 'New Check'}</button>
          </div>

          <div className="grid-3" style={{ marginBottom: 24 }}>
            <div className="compliance-score-box">
              <div className={`huge-score ${result.riskLevel}`}>{result.score}%</div>
              <div className="score-label">{lang === 'ar' ? 'مؤشر الامتثال الكلي' : 'Overall Compliance'}</div>
              <span className={`badge badge-${result.riskLevel}`}>{lang === 'ar' ? 'مستوى المخاطر:' : 'Risk:'} {t(result.riskLevel)}</span>
            </div>
            
            <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 0 }}>
              <h3 style={{ marginBottom: 16 }}>{lang === 'ar' ? 'موجز الالتزام (Summary)' : 'Executive Summary'}</h3>
              <div style={{ display: 'flex', gap: 24 }}>
                <div><strong style={{ color: 'var(--success)', fontSize: 24 }}>{result.passedClauses}</strong> <span style={{ color: 'var(--text-secondary)' }}>{t('passed')}</span></div>
                <div><strong style={{ color: 'var(--danger)', fontSize: 24 }}>{result.failedClauses}</strong> <span style={{ color: 'var(--text-secondary)' }}>{t('failed')}</span></div>
                <div><strong style={{ color: 'var(--warning)', fontSize: 24 }}>{result.warningClauses}</strong> <span style={{ color: 'var(--text-secondary)' }}>{t('warning')}</span></div>
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div>
              {result.conflicts.length > 0 ? (
                <>
                  <h3 style={{ marginBottom: 12, color: 'var(--danger)' }}>{lang === 'ar' ? 'أهم الملاحظات والتعارضات (Key Findings)' : 'Key Findings & Conflicts'}</h3>
                  {result.conflicts.map((c, i) => (
                    <div key={i} className={`exec-item ${c.severity}`}>
                      <h4>{lang === 'ar' ? c.regulationAr : c.regulation}</h4>
                      <p><strong>{lang === 'ar' ? 'نص البند:' : 'Clause:'}</strong> {c.clause}</p>
                      <p><strong>{lang === 'ar' ? 'المخالفة:' : 'Detail:'}</strong> {c.detail}</p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: 40, border: '1px solid var(--success)', background: '#f0fdf4' }}>
                  <h3 style={{ color: 'var(--success)' }}>{lang === 'ar' ? 'لا يوجد تعارضات جوهرية' : 'No Critical Conflicts'}</h3>
                  <p>{lang === 'ar' ? 'المستند متوافق بشكل ممتاز مع الأنظمة المختارة.' : 'Document is fully compliant.'}</p>
                </div>
              )}
            </div>

            <div>
              {result.recommendations.length > 0 && (
                <>
                  <h3 style={{ marginBottom: 12, color: 'var(--accent)' }}>{lang === 'ar' ? 'التوجيهات والتوصيات (Recommendations)' : 'Consulting Recommendations'}</h3>
                  {result.recommendations.map((r, i) => (
                    <div key={i} className={`exec-item`} style={{ borderColor: 'var(--accent)' }}>
                      <p><strong>{lang === 'ar' ? r.regulationAr : r.regulation}</strong></p>
                      <p>{lang === 'ar' ? r.textAr : r.text}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN APP WITH CONSULTING HIERARCHY
   ============================================================ */
const PAGES = [
  { key: 'dashboard', icon: 'dashboard' },
  { key: 'regulations', icon: 'book' },
  { key: 'documents', icon: 'file' },
  { key: 'complianceCheck', icon: 'check' },
];

export default function App() {
  const { t, dir, lang, toggleLang, role } = useApp();
  const [page, setPage] = useState('dashboard');

  const PageComponent = {
    dashboard: DashboardPage,
    regulations: RegulationsPage,
    documents: DocumentsPage,
    complianceCheck: ComplianceCheckPage,
  }[page];

  return (
    <div dir={dir} className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" onError={(e) => { e.target.style.display='none' }} />
          <span>{lang === 'ar' ? 'الامتثال التشريعي' : 'Compliance Portal'}</span>
        </div>
        <nav className="sidebar-nav">
          {PAGES.map(p => (
            <button key={p.key} className={`nav-item ${page === p.key ? 'active' : ''}`} onClick={() => setPage(p.key)}>
              <Icon name={p.icon} />
              <span>{t(p.key)}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="badge badge-law" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>{t(role)}</span>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h2>{t(page)}</h2>
          </div>
          <div className="topbar-right">
            <button className="btn-outline btn" onClick={toggleLang} style={{ padding: '6px 12px' }}>{lang === 'en' ? 'عربي' : 'English'}</button>
          </div>
        </header>
        
        <main className="page-content">
          <PageComponent />
        </main>
        
        <footer className="app-signature">
           Developed as a Legal Operations Model by Mohammed AlSaleem
        </footer>
      </div>
    </div>
  );
}

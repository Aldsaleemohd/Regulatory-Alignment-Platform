import React, { useState, useMemo } from 'react';
import { useApp } from './context/AppContext';
import { runComplianceCheck } from './utils/complianceEngine';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

/* ============================================================
   ICONS (inline SVG components)
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
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    chevron: <><polyline points="9 18 15 12 9 6"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

/* ============================================================
   LOGIN PAGE
   ============================================================ */
function LoginPage() {
  const { t, toggleLang, lang, role, setRole, setLoggedIn } = useApp();
  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/logo.png" alt="Logo" />
        <h1>{t('appName')}</h1>
        <p style={{ marginBottom: 12 }}>{t('welcome')}</p>
        <button className="btn-lang" onClick={toggleLang} style={{ marginBottom: 24 }}>{lang === 'en' ? 'العربية' : 'English'}</button>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('selectRole')}</label>
          <div className="role-select">
            {['admin', 'legal', 'viewer'].map(r => (
              <button key={r} className={`role-option ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
                {t(r)}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={() => setLoggedIn(true)}>
          {t('enter')}
        </button>
        <p style={{ marginTop: 24, fontSize: 11, color: 'var(--text-secondary)' }}>{t('footer')}</p>
      </div>
    </div>
  );
}

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
   DASHBOARD PAGE
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

  const trendData = checkHistory.map((c, i) => ({ name: `${t('complianceCheck')} ${i + 1}`, score: c.score }));

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Icon name="file" /></div>
          <div className="stat-info"><h4>{documents.length}</h4><p>{t('totalDocuments')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Icon name="book" /></div>
          <div className="stat-info"><h4>{regulations.length}</h4><p>{t('totalRegulations')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><Icon name="shield" /></div>
          <div className="stat-info"><h4>{complianceAvg}%</h4><p>{t('complianceRate')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Icon name="alert" /></div>
          <div className="stat-info"><h4>{totalConflicts}</h4><p>{t('conflictsDetected')}</p></div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>{t('riskDistribution')}</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {riskData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header"><h3>{t('complianceTrend')}</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#0B3D2E" strokeWidth={2} dot={{ fill: '#0B3D2E' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header"><h3>{t('checkHistory')}</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t('documentName')}</th><th>{t('date')}</th><th>{t('complianceScore')}</th><th>{t('riskLevel')}</th><th>{t('conflictsDetected')}</th></tr></thead>
            <tbody>
              {checkHistory.map(ch => {
                const doc = documents.find(d => d.id === ch.documentId);
                return (
                  <tr key={ch.id}>
                    <td>{doc ? (lang === 'ar' ? doc.titleAr : doc.title) : ch.documentId}</td>
                    <td>{ch.date}</td>
                    <td><strong>{ch.score}%</strong></td>
                    <td><span className={`badge badge-${ch.riskLevel}`}>{t(ch.riskLevel)}</span></td>
                    <td>{ch.conflicts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   REGULATIONS PAGE
   ============================================================ */
function RegulationsPage() {
  const { t, lang, role, regulations, addRegulation, updateRegulation, deleteRegulation } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modal, setModal] = useState(null); // null | 'add' | reg object
  const [form, setForm] = useState({ titleAr: '', titleEn: '', type: 'law', description: '', keywords: '', clauses: [] });

  const filtered = regulations.filter(r => {
    const matchSearch = r.titleEn.toLowerCase().includes(search.toLowerCase()) || r.titleAr.includes(search);
    const matchType = filterType === 'all' || r.type === filterType;
    return matchSearch && matchType;
  });

  const openAdd = () => { setForm({ titleAr: '', titleEn: '', type: 'law', description: '', keywords: '', clauses: [] }); setModal('add'); };
  const openEdit = (r) => { setForm({ ...r, keywords: r.keywords.join(', ') }); setModal(r); };

  const handleSave = () => {
    const data = { ...form, keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean) };
    if (!data.clauses) data.clauses = [];
    if (modal === 'add') addRegulation(data);
    else updateRegulation(modal.id, data);
    setModal(null);
  };

  const canEdit = role === 'admin' || role === 'legal';

  return (
    <div>
      <div className="search-bar">
        <div className="search-input" style={{ position: 'relative' }}>
          <Icon name="search" size={16} />
          <input className="form-control" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} style={{ paddingInlineStart: 36 }} />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">{t('all')}</option>
          <option value="law">{t('law')}</option>
          <option value="policy">{t('policy')}</option>
          <option value="circular">{t('circular')}</option>
        </select>
        {canEdit && <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={16} /> {t('addRegulation')}</button>}
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t('title')}</th><th>{t('type')}</th><th>{t('clauses')}</th><th>{t('keywords')}</th>{canEdit && <th>{t('actions')}</th>}</tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td><strong>{lang === 'ar' ? r.titleAr : r.titleEn}</strong><br /><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lang === 'ar' ? r.titleEn : r.titleAr}</span></td>
                  <td><span className={`badge badge-${r.type}`}>{t(r.type)}</span></td>
                  <td>{r.clauses?.length || 0}</td>
                  <td style={{ fontSize: 12 }}>{r.keywords?.slice(0, 4).join(', ')}</td>
                  {canEdit && <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" onClick={() => openEdit(r)}><Icon name="edit" size={16} /></button>
                      <button className="btn-icon" onClick={() => deleteRegulation(r.id)} style={{ color: 'var(--danger)' }}><Icon name="trash" size={16} /></button>
                    </div>
                  </td>}
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>{t('noData')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? t('addRegulation') : t('editRegulation')} onClose={() => setModal(null)} footer={
          <><button className="btn btn-outline" onClick={() => setModal(null)}>{t('cancel')}</button><button className="btn btn-primary" onClick={handleSave}>{t('save')}</button></>
        }>
          <div className="form-row">
            <div className="form-group"><label>{t('titleAr')}</label><input className="form-control" value={form.titleAr} onChange={e => setForm({ ...form, titleAr: e.target.value })} dir="rtl" /></div>
            <div className="form-group"><label>{t('titleEn')}</label><input className="form-control" value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>{t('type')}</label>
            <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="law">{t('law')}</option><option value="policy">{t('policy')}</option><option value="circular">{t('circular')}</option>
            </select>
          </div>
          <div className="form-group"><label>{t('description')}</label><textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-group"><label>{t('keywords')} (comma separated)</label><input className="form-control" value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} /></div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   DOCUMENTS PAGE
   ============================================================ */
function DocumentsPage() {
  const { t, lang, role, documents, addDocument, updateDocument, deleteDocument } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modal, setModal] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);
  const [form, setForm] = useState({ title: '', titleAr: '', type: 'contract', department: '', departmentAr: '', content: '' });

  const filtered = documents.filter(d => {
    const ms = d.title.toLowerCase().includes(search.toLowerCase()) || d.titleAr?.includes(search);
    const mt = filterType === 'all' || d.type === filterType;
    return ms && mt;
  });

  const canEdit = role === 'admin' || role === 'legal';
  const openAdd = () => { setForm({ title: '', titleAr: '', type: 'contract', department: '', departmentAr: '', content: '' }); setModal('add'); };
  const openEdit = (d) => { setForm({ ...d }); setModal(d); };

  const handleSave = () => {
    if (modal === 'add') addDocument(form);
    else updateDocument(modal.id, form);
    setModal(null);
  };

  return (
    <div>
      <div className="search-bar">
        <div className="search-input" style={{ position: 'relative' }}>
          <input className="form-control" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">{t('all')}</option>
          <option value="contract">{t('contract')}</option>
          <option value="agreement">{t('agreement')}</option>
          <option value="memo">{t('memo')}</option>
        </select>
        {canEdit && <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={16} /> {t('addDocument')}</button>}
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t('title')}</th><th>{t('type')}</th><th>{t('department')}</th><th>{t('date')}</th><th>{t('actions')}</th></tr></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td><strong>{lang === 'ar' ? (d.titleAr || d.title) : d.title}</strong></td>
                  <td><span className={`badge badge-${d.type}`}>{t(d.type)}</span></td>
                  <td>{lang === 'ar' ? (d.departmentAr || d.department) : d.department}</td>
                  <td>{d.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" onClick={() => setViewDoc(d)}><Icon name="eye" size={16} /></button>
                      {canEdit && <button className="btn-icon" onClick={() => openEdit(d)}><Icon name="edit" size={16} /></button>}
                      {canEdit && <button className="btn-icon" onClick={() => deleteDocument(d.id)} style={{ color: 'var(--danger)' }}><Icon name="trash" size={16} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>{t('noData')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {viewDoc && (
        <Modal title={lang === 'ar' ? (viewDoc.titleAr || viewDoc.title) : viewDoc.title} onClose={() => setViewDoc(null)}>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7, fontFamily: 'inherit' }}>{viewDoc.content}</pre>
        </Modal>
      )}

      {modal && (
        <Modal title={modal === 'add' ? t('addDocument') : t('editDocument')} onClose={() => setModal(null)} footer={
          <><button className="btn btn-outline" onClick={() => setModal(null)}>{t('cancel')}</button><button className="btn btn-primary" onClick={handleSave}>{t('save')}</button></>
        }>
          <div className="form-row">
            <div className="form-group"><label>{t('titleEn')}</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label>{t('titleAr')}</label><input className="form-control" value={form.titleAr} onChange={e => setForm({ ...form, titleAr: e.target.value })} dir="rtl" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>{t('type')}</label>
              <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="contract">{t('contract')}</option><option value="agreement">{t('agreement')}</option><option value="memo">{t('memo')}</option>
              </select>
            </div>
            <div className="form-group"><label>{t('department')}</label><input className="form-control" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>{t('content')}</label><textarea className="form-control" rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
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
    }, 800);
  };

  return (
    <div>
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>{t('selectDocument')}</h3></div>
          <select className="form-control" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}>
            <option value="">{t('selectDocument')}...</option>
            {documents.map(d => <option key={d.id} value={d.id}>{lang === 'ar' ? (d.titleAr || d.title) : d.title}</option>)}
          </select>
        </div>
        <div className="card">
          <div className="card-header"><h3>{t('selectRegulations')}</h3></div>
          <div className="checkbox-list">
            {regulations.map(r => (
              <div key={r.id} className="checkbox-item">
                <input type="checkbox" id={r.id} checked={selectedRegs.includes(r.id)} onChange={() => toggleReg(r.id)} />
                <label htmlFor={r.id}>
                  {lang === 'ar' ? r.titleAr : r.titleEn}
                  <span className={`badge badge-${r.type}`} style={{ marginInlineStart: 8 }}>{t(r.type)}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button className="btn btn-accent" onClick={handleRun} disabled={!selectedDoc || selectedRegs.length === 0 || running} style={{ padding: '14px 40px', fontSize: 16 }}>
          {running ? '...' : <><Icon name="play" size={18} /> {t('runComplianceCheck')}</>}
        </button>
      </div>

      {result && (
        <div>
          <div className="grid-3" style={{ marginBottom: 20 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className={`score-circle ${result.riskLevel}`}>
                <span className="score-value">{result.score}%</span>
                <span className="score-label">{t('complianceScore')}</span>
              </div>
              <span className={`badge badge-${result.riskLevel}`} style={{ fontSize: 14, padding: '6px 16px' }}>{t(result.riskLevel)} {t('riskLevel')}</span>
            </div>
            <div className="card">
              <div className="check-detail-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="check-mini-stat"><div className="num" style={{ color: 'var(--success)' }}>{result.passedClauses}</div><div className="lbl">{t('passed')}</div></div>
                <div className="check-mini-stat"><div className="num" style={{ color: 'var(--danger)' }}>{result.failedClauses}</div><div className="lbl">{t('failed')}</div></div>
                <div className="check-mini-stat"><div className="num" style={{ color: 'var(--accent)' }}>{result.warningClauses}</div><div className="lbl">{t('warning')}</div></div>
                <div className="check-mini-stat"><div className="num">{result.totalClauses}</div><div className="lbl">{t('totalChecks')}</div></div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3>{t('matchResult')}</h3></div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[{ name: t('passed'), value: result.passedClauses, fill: '#0B3D2E' }, { name: t('warning'), value: result.warningClauses, fill: '#C9A646' }, { name: t('failed'), value: result.failedClauses, fill: '#b91c1c' }]}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {[{ fill: '#0B3D2E' }, { fill: '#C9A646' }, { fill: '#b91c1c' }].map((c, i) => <Cell key={i} fill={c.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed results table */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h3>{t('checkDetails')}</h3></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>{t('regulation')}</th><th>{t('clause')}</th><th>{t('status')}</th><th>{t('matchResult')}</th><th>{t('weight')}</th></tr></thead>
                <tbody>
                  {result.results.map((r, i) => (
                    <tr key={i}>
                      <td>{lang === 'ar' ? r.regulationTitleAr : r.regulationTitle}</td>
                      <td style={{ fontSize: 13 }}>{r.clauseText}</td>
                      <td><span className={`badge badge-${r.status}`}>{t(r.status)}</span></td>
                      <td>{r.matchRatio}%</td>
                      <td>{r.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conflicts */}
          {result.conflicts.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header"><h3>{t('conflictList')} ({result.conflicts.length})</h3></div>
              {result.conflicts.map((c, i) => (
                <div key={i} className={`conflict-item ${c.severity}`}>
                  <h4>{lang === 'ar' ? c.regulationAr : c.regulation}</h4>
                  <p><strong>{t('clause')}:</strong> {c.clause}</p>
                  <p><strong>{t('details')}:</strong> {c.detail}</p>
                  <span className={`badge badge-${c.severity}`}>{t(c.severity)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="card">
              <div className="card-header"><h3>{t('recommendations')} ({result.recommendations.length})</h3></div>
              {result.recommendations.map((r, i) => (
                <div key={i} className="rec-item">
                  <p><strong>{lang === 'ar' ? r.regulationAr : r.regulation}</strong></p>
                  <p>{lang === 'ar' ? r.textAr : r.text}</p>
                  <span className={`badge badge-${r.priority}`} style={{ marginTop: 6 }}>{t(r.priority)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CONFLICT ANALYSIS PAGE
   ============================================================ */
function ConflictAnalysisPage() {
  const { t, lang, documents, regulations, checkHistory } = useApp();

  // Build conflicts from all checks
  const allConflicts = useMemo(() => {
    const conflicts = [];
    checkHistory.forEach(ch => {
      if (ch.conflicts > 0) {
        const doc = documents.find(d => d.id === ch.documentId);
        const regs = regulations.filter(r => ch.regulationIds.includes(r.id));
        if (doc) {
          const result = runComplianceCheck(doc, regs);
          result.conflicts.forEach(c => {
            conflicts.push({ ...c, documentTitle: lang === 'ar' ? (doc.titleAr || doc.title) : doc.title, date: ch.date, checkId: ch.id });
          });
        }
      }
    });
    return conflicts;
  }, [checkHistory, documents, regulations, lang]);

  const severityData = [
    { name: t('high'), value: allConflicts.filter(c => c.severity === 'high').length, fill: '#b91c1c' },
    { name: t('medium'), value: allConflicts.filter(c => c.severity === 'medium').length, fill: '#C9A646' },
  ];

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon red"><Icon name="alert" /></div>
          <div className="stat-info"><h4>{allConflicts.length}</h4><p>{t('conflictsDetected')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Icon name="alert" /></div>
          <div className="stat-info"><h4>{allConflicts.filter(c => c.severity === 'high').length}</h4><p>{t('high')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><Icon name="alert" /></div>
          <div className="stat-info"><h4>{allConflicts.filter(c => c.severity === 'medium').length}</h4><p>{t('medium')}</p></div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header"><h3>{t('riskBreakdown')}</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={severityData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>{severityData.map((d, i) => <Cell key={i} fill={d.fill} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header"><h3>{t('topViolations')}</h3></div>
          {allConflicts.slice(0, 4).map((c, i) => (
            <div key={i} className={`conflict-item ${c.severity}`} style={{ marginBottom: 8 }}>
              <h4 style={{ fontSize: 13 }}>{c.clause}</h4>
              <p style={{ fontSize: 12 }}>{lang === 'ar' ? c.regulationAr : c.regulation}</p>
            </div>
          ))}
          {allConflicts.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 30 }}>{t('noConflicts')}</p>}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>{t('conflictList')}</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t('documentName')}</th><th>{t('regulation')}</th><th>{t('clause')}</th><th>{t('severity')}</th><th>{t('details')}</th></tr></thead>
            <tbody>
              {allConflicts.map((c, i) => (
                <tr key={i}>
                  <td>{c.documentTitle}</td>
                  <td>{lang === 'ar' ? c.regulationAr : c.regulation}</td>
                  <td style={{ fontSize: 13 }}>{c.clause}</td>
                  <td><span className={`badge badge-${c.severity}`}>{t(c.severity)}</span></td>
                  <td style={{ fontSize: 12 }}>{c.detail}</td>
                </tr>
              ))}
              {allConflicts.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>{t('noConflicts')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   REPORTS PAGE
   ============================================================ */
function ReportsPage() {
  const { t, lang, documents, regulations, checkHistory } = useApp();
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [reportData, setReportData] = useState(null);

  const generate = (ch) => {
    const doc = documents.find(d => d.id === ch.documentId);
    const regs = regulations.filter(r => ch.regulationIds.includes(r.id));
    if (doc) {
      const result = runComplianceCheck(doc, regs);
      setReportData({ ...result, document: doc, regulations: regs, date: ch.date });
      setSelectedCheck(ch.id);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><h3>{t('checkHistory')}</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t('documentName')}</th><th>{t('date')}</th><th>{t('complianceScore')}</th><th>{t('riskLevel')}</th><th>{t('actions')}</th></tr></thead>
            <tbody>
              {checkHistory.map(ch => {
                const doc = documents.find(d => d.id === ch.documentId);
                return (
                  <tr key={ch.id}>
                    <td>{doc ? (lang === 'ar' ? (doc.titleAr || doc.title) : doc.title) : ch.documentId}</td>
                    <td>{ch.date}</td>
                    <td>{ch.score}%</td>
                    <td><span className={`badge badge-${ch.riskLevel}`}>{t(ch.riskLevel)}</span></td>
                    <td><button className="btn btn-sm btn-primary" onClick={() => generate(ch)}>{t('generateReport')}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {reportData && (
        <div className="card" id="report-print">
          <div style={{ borderBottom: '3px solid var(--primary)', paddingBottom: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <img src="/logo.png" alt="Logo" style={{ height: 40, borderRadius: 6 }} />
              <div>
                <h2 style={{ fontSize: 20, color: 'var(--primary)' }}>{t('reportTitle')}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('date')}: {reportData.date}</p>
              </div>
            </div>
          </div>

          <h4 style={{ marginBottom: 8 }}>{t('documentName')}: {lang === 'ar' ? (reportData.document.titleAr || reportData.document.title) : reportData.document.title}</h4>
          <p style={{ marginBottom: 4, fontSize: 14 }}><strong>{t('type')}:</strong> {t(reportData.document.type)}</p>
          <p style={{ marginBottom: 20, fontSize: 14 }}><strong>{t('department')}:</strong> {lang === 'ar' ? (reportData.document.departmentAr || reportData.document.department) : reportData.document.department}</p>

          <div className="check-detail-grid" style={{ marginBottom: 20 }}>
            <div className="check-mini-stat"><div className="num" style={{ color: reportData.riskLevel === 'high' ? 'var(--danger)' : reportData.riskLevel === 'medium' ? '#92400e' : 'var(--success)' }}>{reportData.score}%</div><div className="lbl">{t('complianceScore')}</div></div>
            <div className="check-mini-stat"><div className="num">{reportData.passedClauses}/{reportData.totalClauses}</div><div className="lbl">{t('passedChecks')}</div></div>
            <div className="check-mini-stat"><div className="num" style={{ color: 'var(--danger)' }}>{reportData.conflicts.length}</div><div className="lbl">{t('conflictsDetected')}</div></div>
          </div>

          <h4 style={{ marginBottom: 10 }}>{t('checkDetails')}</h4>
          <div className="table-wrap" style={{ marginBottom: 20 }}>
            <table>
              <thead><tr><th>{t('regulation')}</th><th>{t('clause')}</th><th>{t('status')}</th><th>{t('matchResult')}</th></tr></thead>
              <tbody>
                {reportData.results.map((r, i) => (
                  <tr key={i}>
                    <td>{lang === 'ar' ? r.regulationTitleAr : r.regulationTitle}</td>
                    <td style={{ fontSize: 13 }}>{r.clauseText}</td>
                    <td><span className={`badge badge-${r.status}`}>{t(r.status)}</span></td>
                    <td>{r.matchRatio}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reportData.recommendations.length > 0 && <>
            <h4 style={{ marginBottom: 10 }}>{t('recommendations')}</h4>
            {reportData.recommendations.map((r, i) => (
              <div key={i} className="rec-item"><p>{lang === 'ar' ? r.textAr : r.text}</p></div>
            ))}
          </>}

          <div style={{ marginTop: 30, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
            {t('footer')}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => window.print()}><Icon name="download" size={16} /> {t('print')}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
const PAGES = [
  { key: 'dashboard', icon: 'dashboard' },
  { key: 'regulations', icon: 'book' },
  { key: 'documents', icon: 'file' },
  { key: 'complianceCheck', icon: 'check' },
  { key: 'conflictAnalysis', icon: 'alert' },
  { key: 'reports', icon: 'report' },
];

export default function App() {
  const { t, dir, lang, toggleLang, role, loggedIn, setLoggedIn } = useApp();
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!loggedIn) return <LoginPage />;

  const PageComponent = {
    dashboard: DashboardPage,
    regulations: RegulationsPage,
    documents: DocumentsPage,
    complianceCheck: ComplianceCheckPage,
    conflictAnalysis: ConflictAnalysisPage,
    reports: ReportsPage,
  }[page];

  return (
    <div dir={dir} className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
          <span>{t('appName')}</span>
        </div>
        <nav className="sidebar-nav">
          {PAGES.map(p => (
            <button key={p.key} className={`nav-item ${page === p.key ? 'active' : ''}`} onClick={() => { setPage(p.key); setSidebarOpen(false); }}>
              <Icon name={p.icon} />
              <span>{t(p.key)}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="role-badge">{t(role)}</span>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><Icon name="menu" /></button>
            <h2>{t(page)}</h2>
          </div>
          <div className="topbar-right">
            <button className="btn-lang" onClick={toggleLang}>{lang === 'en' ? 'العربية' : 'English'}</button>
            <button className="btn-logout" onClick={() => setLoggedIn(false)}>{t('logout')}</button>
          </div>
        </header>
        <main className="page-content">
          <PageComponent />
        </main>
        <footer className="app-footer">{t('footer')}</footer>
      </div>
    </div>
  );
}

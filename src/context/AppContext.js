import React, { createContext, useContext, useState } from 'react';
import translations from '../data/translations';
import { sampleRegulations, sampleDocuments, sampleCheckHistory } from '../data/sampleData';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [role, setRole] = useState('admin');
  const [loggedIn, setLoggedIn] = useState(false);
  const [regulations, setRegulations] = useState(sampleRegulations);
  const [documents, setDocuments] = useState(sampleDocuments);
  const [checkHistory, setCheckHistory] = useState(sampleCheckHistory);

  const t = (key) => translations[lang]?.[key] || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');

  const addRegulation = (reg) => setRegulations(p => [...p, { ...reg, id: `reg-${Date.now()}` }]);
  const updateRegulation = (id, data) => setRegulations(p => p.map(r => r.id === id ? { ...r, ...data } : r));
  const deleteRegulation = (id) => setRegulations(p => p.filter(r => r.id !== id));
  const addDocument = (doc) => setDocuments(p => [...p, { ...doc, id: `doc-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }]);
  const updateDocument = (id, data) => setDocuments(p => p.map(d => d.id === id ? { ...d, ...data } : d));
  const deleteDocument = (id) => setDocuments(p => p.filter(d => d.id !== id));
  const addCheckResult = (result) => setCheckHistory(p => [...p, { ...result, id: `chk-${Date.now()}`, date: new Date().toISOString().split('T')[0] }]);

  return (
    <AppContext.Provider value={{ lang, dir, t, toggleLang, role, setRole, loggedIn, setLoggedIn, regulations, documents, checkHistory, addRegulation, updateRegulation, deleteRegulation, addDocument, updateDocument, deleteDocument, addCheckResult }}>
      {children}
    </AppContext.Provider>
  );
}


import React, { useState, useMemo } from 'react';
import { Collection, Student, AppTheme } from '../types';

interface CollectionsTabProps {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  students: Student[];
  theme: AppTheme;
  onDelete: (id: string) => void;
}

const CollectionsTab: React.FC<CollectionsTabProps> = ({ collections, setCollections, students, theme, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [title, setTitle] = useState('');
  const [inputMode, setInputMode] = useState<'total' | 'per_student'>('per_student');
  const [amount, setAmount] = useState<number>(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [viewingDetailsId, setViewingDetailsId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setInputMode('per_student');
    setAmount(0);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setParticipantIds([]);
    setShowModal(false);
    setEditingCollection(null);
  };

  const handleOpenNew = () => {
    setTitle('');
    setInputMode('per_student');
    setAmount(0);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    // Automatycznie dodaj wszystkich uczniów
    setParticipantIds(students.map(s => s.id));
    setEditingCollection(null);
    setShowModal(true);
  };

  const handleOpenEdit = (c: Collection) => {
    setEditingCollection(c);
    setTitle(c.title);
    setAmount(c.perStudentAmount); // Standardized to per student view in edit modal for simplicity
    setInputMode('per_student');
    setStartDate(c.startDate);
    setEndDate(c.endDate);
    setParticipantIds(c.participantIds);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!title || amount <= 0 || participantIds.length === 0) return;
    const perStudentAmount = inputMode === 'per_student' ? amount : amount / participantIds.length;
    const totalAmount = inputMode === 'total' ? amount : amount * participantIds.length;

    const data: Collection = {
      id: editingCollection?.id || crypto.randomUUID(),
      title,
      totalAmount,
      perStudentAmount,
      startDate,
      endDate,
      participantIds,
      payments: editingCollection?.payments || {}
    };

    setCollections(editingCollection ? collections.map(c => c.id === editingCollection.id ? data : c) : [...collections, data]);
    resetForm();
  };

  const updatePayment = (collectionId: string, studentId: string, value: number) => {
    setCollections(collections.map(c => {
      if (c.id === collectionId) {
        return { ...c, payments: { ...c.payments, [studentId]: value } };
      }
      return c;
    }));
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider opacity-80">Zbiórki</h2>
        <button onClick={handleOpenNew} className={`px-5 py-2 rounded-2xl bg-gradient-to-r ${theme.primary} text-white font-bold text-sm shadow-xl hover:scale-105 transition-all`}>
          + NOWA
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-2xl p-8 rounded-[2rem] ${theme.card} border shadow-2xl animate-scaleUp overflow-y-auto max-h-[90vh] scrollbar-hide`}>
            <h3 className="text-2xl font-black mb-8">Ustawienia Zbiórki</h3>
            <div className="space-y-6">
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nazwa zbiórki" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50" />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex">
                  {(['per_student', 'total'] as const).map(m => (
                    <button key={m} onClick={() => setInputMode(m)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${inputMode === m ? `bg-gradient-to-r ${theme.primary} text-white` : 'opacity-40'}`}>
                      {m === 'per_student' ? 'NA OSOBĘ' : 'CAŁOŚĆ'}
                    </button>
                  ))}
                </div>
                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="Kwota" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none text-sm" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none text-sm" />
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest">Uczestnicy ({participantIds.length})</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto scrollbar-hide pr-2">
                  {students.map(s => {
                    const isSelected = participantIds.includes(s.id);
                    return (
                      <button 
                        key={s.id} 
                        onClick={() => setParticipantIds(prev => isSelected ? prev.filter(i => i !== s.id) : [...prev, s.id])} 
                        className={`text-left p-2 px-3 rounded-xl text-[10px] font-bold border truncate transition-all ${isSelected ? `border-emerald-500/50 bg-emerald-500/10 text-emerald-400` : 'border-white/5 opacity-40'}`}
                      >
                        {s.lastName} {s.firstName}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setParticipantIds(students.map(s => s.id))} className="text-[9px] font-black uppercase opacity-40 hover:opacity-100">Zaznacz wszystkich</button>
                  <button onClick={() => setParticipantIds([])} className="text-[9px] font-black uppercase opacity-40 hover:opacity-100">Odznacz wszystkich</button>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={handleSave} className={`flex-1 py-4 rounded-2xl bg-gradient-to-r ${theme.primary} text-white font-black text-lg shadow-xl`}>ZAPISZ</button>
              <button onClick={resetForm} className="px-8 py-4 rounded-2xl bg-white/5 font-bold">ANULUJ</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {collections.map(c => {
          const isDetails = viewingDetailsId === c.id;
          const totalCollected = Object.values(c.payments).reduce((a, b) => a + b, 0);
          const progress = (totalCollected / c.totalAmount) * 100;

          return (
            <div key={c.id} className={`p-6 rounded-[2rem] ${theme.card} border transition-all overflow-hidden`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-black mb-1">{c.title}</h3>
                  <div className="flex gap-4 text-xs font-bold opacity-40 uppercase tracking-widest">
                    <span>{c.endDate || 'Bez terminu'}</span>
                    <span>{c.perStudentAmount.toFixed(2)} zł / os.</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xl font-black">{totalCollected.toFixed(2)} <span className="text-xs opacity-40">/ {c.totalAmount.toFixed(2)}</span></div>
                    <div className="w-32 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                      <div className={`h-full bg-gradient-to-r ${theme.primary} transition-all duration-700`} style={{ width: `${Math.min(100, progress)}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewingDetailsId(isDetails ? null : c.id)} className={`p-3 rounded-2xl ${isDetails ? theme.secondary : 'bg-white/5'} transition-all`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </button>
                    <button onClick={() => handleOpenEdit(c)} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => onDelete(c.id)} className="p-3 rounded-2xl bg-red-500/10 text-red-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {isDetails && (
                <div className="mt-8 pt-8 border-t border-white/5 animate-slideDown">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {students.filter(s => c.participantIds.includes(s.id)).map(s => {
                      const val = c.payments[s.id] || 0;
                      return (
                        <div key={s.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
                          <div className="font-bold text-xs truncate uppercase tracking-wider">{s.lastName} {s.firstName}</div>
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              value={val} 
                              onChange={e => updatePayment(c.id, s.id, Number(e.target.value))} 
                              className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <button onClick={() => updatePayment(c.id, s.id, c.perStudentAmount)} className={`p-2 rounded-xl text-[10px] font-bold border transition-all ${val === c.perStudentAmount ? 'bg-emerald-500 border-emerald-500 text-white' : 'opacity-40 border-white/20'}`}>PEŁNA</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionsTab;

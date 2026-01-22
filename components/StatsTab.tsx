
import React, { useMemo } from 'react';
import { Student, Collection, AppTheme, Refund } from '../types';

interface StatsTabProps {
  students: Student[];
  collections: Collection[];
  refunds: Refund[];
  setRefunds: React.Dispatch<React.SetStateAction<Refund[]>>;
  theme: AppTheme;
}

const StatsTab: React.FC<StatsTabProps> = ({ students, collections, refunds, setRefunds, theme }) => {
  const studentStats = useMemo(() => {
    return students.map(s => {
      const activeParticipations = collections.filter(c => c.participantIds.includes(s.id));
      const totalRequired = activeParticipations.reduce((sum, c) => sum + c.perStudentAmount, 0);
      const totalPaid = collections.reduce((sum, c) => sum + (c.payments[s.id] || 0), 0);
      const pendingRefunds = refunds.filter(r => r.studentId === s.id).reduce((sum, r) => sum + r.amount, 0);
      
      const balance = totalPaid - totalRequired;
      const totalToRefund = (balance > 0 ? balance : 0) + pendingRefunds;

      return {
        id: s.id,
        fullName: `${s.lastName} ${s.firstName}`,
        totalPaid,
        totalRequired,
        totalToRefund,
        activeOverpayment: balance > 0 ? balance : 0,
        pendingRefunds
      };
    }).sort((a,b) => b.totalToRefund - a.totalToRefund);
  }, [students, collections, refunds]);

  const aggregate = useMemo(() => {
    const totalCollected = collections.reduce((s, c) => s + Object.values(c.payments).reduce((a, b) => a + b, 0), 0);
    const totalRefundable = studentStats.reduce((s, st) => s + st.totalToRefund, 0);
    return { totalCollected, totalRefundable };
  }, [collections, studentStats]);

  const settleRefund = (studentId: string) => {
    if (confirm('Oznaczyć wszystkie zwroty dla tego ucznia jako przekazane?')) {
      // 1. Clear explicit refunds
      setRefunds(prev => prev.filter(r => r.studentId !== studentId));
      // Note: active overpayments must be settled by adjusting collection payments manually
    }
  };

  const removeRefundRecord = (id: string) => {
    setRefunds(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-8 rounded-[2rem] ${theme.card} border text-center`}>
          <p className="text-xs font-black uppercase opacity-40 mb-2 tracking-widest">W kasie (brutto)</p>
          <p className={`text-4xl font-black bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>{aggregate.totalCollected.toFixed(2)} zł</p>
        </div>
        <div className={`p-8 rounded-[2rem] ${theme.card} border text-center`}>
          <p className="text-xs font-black uppercase opacity-40 mb-2 tracking-widest">Do zwrotu (łącznie)</p>
          <p className="text-4xl font-black text-red-400">{aggregate.totalRefundable.toFixed(2)} zł</p>
        </div>
      </div>

      {aggregate.totalRefundable > 0 && (
        <div className={`p-8 rounded-[2rem] ${theme.card} border shadow-xl`}>
          <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-red-400 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Należne Zwroty
          </h3>
          <div className="space-y-3">
            {studentStats.filter(s => s.totalToRefund > 0).map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{s.fullName}</div>
                  <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest mt-1">
                    {s.activeOverpayment > 0 && <span>Nadpłata: {s.activeOverpayment.toFixed(2)} zł </span>}
                    {s.pendingRefunds > 0 && <span>Z usuniętych: {s.pendingRefunds.toFixed(2)} zł</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-black text-red-400">{s.totalToRefund.toFixed(2)} zł</div>
                  <button onClick={() => settleRefund(s.id)} className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-[10px] font-black hover:scale-105 transition-all">ODDANE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {refunds.length > 0 && (
        <div className={`p-8 rounded-[2rem] ${theme.card} border`}>
          <h3 className="text-lg font-black mb-6 opacity-60 uppercase tracking-widest">Historia/Detale Zwrotów</h3>
          <div className="space-y-2">
            {refunds.map(r => {
              const student = students.find(s => s.id === r.studentId);
              return (
                <div key={r.id} className="flex items-center justify-between p-3 px-5 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <div className="flex-1">
                    <span className="font-bold">{student?.lastName || 'Usunięty'}</span>
                    <span className="opacity-40 ml-2 italic">({r.reason})</span>
                  </div>
                  <div className="font-black text-red-400 mr-6">{r.amount.toFixed(2)} zł</div>
                  <button onClick={() => removeRefundRecord(r.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 opacity-40">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={`p-8 rounded-[2rem] ${theme.card} border overflow-x-auto`}>
        <h3 className="text-xl font-black mb-8 uppercase tracking-wider opacity-60">Pełne Zestawienie</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">
              <th className="pb-6 pl-4">Uczeń</th>
              <th className="pb-6">Wpłacono</th>
              <th className="pb-6">Wymagane</th>
              <th className="pb-6 pr-4 text-right">Bilans</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {studentStats.map((s, idx) => (
              <tr key={idx} className="group hover:bg-white/5 transition-colors">
                <td className="py-5 pl-4 font-bold">{s.fullName}</td>
                <td className="py-5 opacity-80">{s.totalPaid.toFixed(2)} zł</td>
                <td className="py-5 opacity-80">{s.totalRequired.toFixed(2)} zł</td>
                <td className={`py-5 pr-4 text-right font-black ${s.totalToRefund > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {(s.totalPaid - s.totalRequired).toFixed(2)} zł
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTab;

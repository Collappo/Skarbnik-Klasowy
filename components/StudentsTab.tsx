
import React, { useState } from 'react';
import { Student, AppTheme } from '../types';

interface StudentsTabProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  theme: AppTheme;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ students, setStudents, theme }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!firstName || !lastName) return;
    const newStudent: Student = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
    };
    setStudents([...students, newStudent]);
    resetForm();
  };

  const handleSaveEdit = () => {
    if (!firstName || !lastName || !editingId) return;
    setStudents(students.map(s => s.id === editingId ? { ...s, firstName, lastName } : s));
    resetForm();
  };

  const handleEdit = (s: Student) => {
    setEditingId(s.id);
    setFirstName(s.firstName);
    setLastName(s.lastName);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego ucznia?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider opacity-80">Lista Uczniów</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className={`px-5 py-2 rounded-2xl bg-gradient-to-r ${theme.primary} text-white font-bold text-sm shadow-xl hover:scale-105 transition-all`}
          >
            + DODAJ
          </button>
        )}
      </div>

      {isAdding && (
        <div className={`mb-8 p-6 rounded-3xl ${theme.card} border animate-slideDown shadow-xl`}>
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edycja' : 'Nowy Uczeń'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Imię"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nazwisko"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={editingId ? handleSaveEdit : handleAdd}
              className={`flex-1 py-3 rounded-2xl bg-gradient-to-r ${theme.primary} text-white font-bold shadow-lg`}
            >
              {editingId ? 'ZAPISZ' : 'DODAJ'}
            </button>
            <button onClick={resetForm} className="px-6 py-3 rounded-2xl bg-white/5 font-bold text-sm opacity-60">
              ANULUJ
            </button>
          </div>
        </div>
      )}

      {students.length === 0 ? (
        <div className={`p-16 text-center rounded-3xl ${theme.card} border border-dashed opacity-50`}>
          Brak uczniów w systemie.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {students.sort((a, b) => a.lastName.localeCompare(b.lastName)).map((student, studentIndex) => (
            <div
              key={student.id}
              className={`group flex items-center justify-between p-3 px-5 rounded-2xl ${theme.card} border border-white/5 hover:border-white/20 transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.primary} flex items-center justify-center font-bold text-white shadow-inner`}>
                  {(studentIndex + 1).toString()}
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base leading-tight">
                    {student.lastName} {student.firstName}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(student)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => handleDelete(student.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentsTab;

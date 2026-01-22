
import React, { useState, useEffect } from 'react';
import { Student, Collection, Tab, Refund } from './types';
import { THEMES } from './themes';
import StudentsTab from './components/StudentsTab';
import CollectionsTab from './components/CollectionsTab';
import StatsTab from './components/StatsTab';
import SettingsTab from './components/SettingsTab';
import Navigation from './components/Navigation';

const STORAGE_KEY = 'skarbnik_counterek';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('collections');
  const [themeKey, setThemeKey] = useState<string>('emerald');

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setStudents(parsed.students || []);
        setCollections(parsed.collections || []);
        setRefunds(parsed.refunds || []);
        setThemeKey(parsed.themeKey || 'emerald');
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ students, collections, refunds, themeKey }));
  }, [students, collections, refunds, themeKey]);

  useEffect(() => {
    if (students.length === 0) {
      setActiveTab('students');
    }
  }, [students.length]);

  const currentTheme = THEMES[themeKey] || THEMES.emerald;

  const handleExport = () => {
    const data = JSON.stringify({ students, collections, refunds, themeKey });
    navigator.clipboard.writeText(data);
    alert('Dane zostały skopiowane do schowka!');
  };

  const handleImport = () => {
    const input = prompt('Wklej dane wyeksportowane z innej instancji:');
    if (input) {
      try {
        const parsed = JSON.parse(input);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.collections) setCollections(parsed.collections);
        if (parsed.refunds) setRefunds(parsed.refunds);
        if (parsed.themeKey) setThemeKey(parsed.themeKey);
        alert('Dane zaimportowane pomyślnie!');
      } catch (e) {
        alert('Błąd formatu danych!');
      }
    }
  };

  const deleteCollection = (id: string) => {
    const col = collections.find(c => c.id === id);
    if (!col) return;

    if (confirm(`Usunąć zbiórkę "${col.title}"? Wpłacone pieniądze zostaną przeniesione do listy zwrotów.`)) {
      const newRefunds: Refund[] = [];
      Object.entries(col.payments).forEach(([studentId, amount]) => {
        if (amount > 0) {
          newRefunds.push({
            id: crypto.randomUUID(),
            studentId,
            amount,
            reason: `Usunięto zbiórkę: ${col.title}`,
            date: new Date().toISOString()
          });
        }
      });
      setRefunds(prev => [...prev, ...newRefunds]);
      setCollections(collections.filter(c => c.id !== id));
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-500 overflow-hidden flex flex-col`}>
      <div className={`fixed inset-0 bg-gradient-to-br ${currentTheme.gradient} pointer-events-none`} />

      <main className="flex-1 relative z-10 p-4 md:p-8 overflow-y-auto scrollbar-hide">
        <div className="max-w-5xl mx-auto pb-24">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                <span className={`bg-gradient-to-r ${currentTheme.primary} bg-clip-text text-transparent`}>Skarb</span>nik
              </h1>
              <p className="opacity-60 text-sm mt-1 uppercase tracking-widest font-medium">Panel Skarbnika Klasowego</p>
            </div>
            <div className={`hidden md:block px-4 py-2 rounded-2xl text-xs font-bold border ${currentTheme.card}`}>
              STUDENCI: {students.length}
            </div>
          </header>

          <div className="space-y-6">
            {activeTab === 'students' && (
              <StudentsTab students={students} setStudents={setStudents} theme={currentTheme} />
            )}
            {activeTab === 'collections' && (
              <CollectionsTab
                collections={collections}
                setCollections={setCollections}
                students={students}
                theme={currentTheme}
                onDelete={deleteCollection}
              />
            )}
            {activeTab === 'stats' && (
              <StatsTab students={students} collections={collections} refunds={refunds} setRefunds={setRefunds} theme={currentTheme} />
            )}
            {activeTab === 'settings' && (
              <SettingsTab themeKey={themeKey} setThemeKey={setThemeKey} onExport={handleExport} onImport={handleImport} theme={currentTheme} />
            )}
          </div>
        </div>
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} theme={currentTheme} />
    </div>
  );
};

export default App;

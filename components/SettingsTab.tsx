
import React from 'react';
import { THEMES } from '../themes';
import { AppTheme } from '../types';

interface SettingsTabProps {
  themeKey: string;
  setThemeKey: (key: string) => void;
  onExport: () => void;
  onImport: () => void;
  theme: AppTheme;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ themeKey, setThemeKey, onExport, onImport, theme }) => {
  return (
    <div className="animate-fadeIn space-y-8">
      <div className={`p-8 rounded-3xl ${theme.card} border`}>
        <h3 className="text-xl font-bold mb-6">Motyw Aplikacji</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setThemeKey(key)}
              className={`p-4 rounded-2xl border transition-all text-center group ${themeKey === key ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl' : 'border-white/5 hover:border-white/20'}`}
            >
              <div className={`w-full h-12 rounded-xl bg-gradient-to-br ${t.primary} mb-3`} />
              <div className="text-sm font-bold truncate">{t.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={`p-8 rounded-3xl ${theme.card} border`}>
        <h3 className="text-xl font-bold mb-2">Zarządzanie Danymi</h3>
        <p className="text-sm opacity-50 mb-8">Wszystkie Twoje dane są przechowywane lokalnie w Twojej przeglądarce. Możesz je przenieść na inne urządzenie za pomocą eksportu.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={onExport}
            className={`flex items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group`}
          >
            <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.primary} text-white`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            </div>
            <div className="text-left">
              <div className="font-bold">Eksportuj Dane</div>
              <div className="text-xs opacity-50">Kopiuj do schowka (JSON)</div>
            </div>
          </button>

          <button 
            onClick={onImport}
            className={`flex items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group`}
          >
            <div className={`p-3 rounded-xl bg-emerald-500 text-white`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 12l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
            <div className="text-left">
              <div className="font-bold">Importuj Dane</div>
              <div className="text-xs opacity-50">Zastąp obecne dane</div>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center opacity-30 text-[10px] font-bold tracking-widest uppercase">
        Skarbnik Pro v1.0 • Wykonano dla wygody Twojej i klasy
      </div>
    </div>
  );
};

export default SettingsTab;

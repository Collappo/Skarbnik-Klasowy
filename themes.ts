
import { AppTheme } from './types';

export const THEMES: Record<string, AppTheme> = {
  emerald: {
    name: 'Szmaragdowy',
    bg: 'bg-slate-950',
    card: 'bg-white/5 backdrop-blur-xl border-white/10',
    primary: 'from-emerald-400 to-cyan-500',
    secondary: 'bg-emerald-500',
    text: 'text-slate-100',
    accent: 'text-emerald-400',
    gradient: 'from-emerald-500/20 via-transparent to-cyan-500/20'
  },
  midnight: {
    name: 'Północny',
    bg: 'bg-gray-950',
    card: 'bg-gray-900/50 backdrop-blur-xl border-gray-800',
    primary: 'from-indigo-500 to-purple-600',
    secondary: 'bg-indigo-600',
    text: 'text-gray-100',
    accent: 'text-indigo-400',
    gradient: 'from-indigo-900/20 via-transparent to-purple-900/20'
  },
  sunset: {
    name: 'Zachód Słońca',
    bg: 'bg-stone-950',
    card: 'bg-white/5 backdrop-blur-xl border-white/5',
    primary: 'from-orange-400 to-rose-500',
    secondary: 'bg-rose-500',
    text: 'text-stone-100',
    accent: 'text-orange-400',
    gradient: 'from-orange-500/10 via-transparent to-rose-500/10'
  },
  minimal: {
    name: 'Minimalistyczny',
    bg: 'bg-zinc-50',
    card: 'bg-white border-zinc-200 shadow-sm',
    primary: 'from-zinc-800 to-zinc-950',
    secondary: 'bg-zinc-900',
    text: 'text-zinc-900',
    accent: 'text-zinc-600',
    gradient: 'from-zinc-200/50 via-transparent to-zinc-100/50'
  }
};

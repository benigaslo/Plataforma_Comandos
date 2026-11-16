import React from 'react';
import { UserProfile, OperatingSystem, ThemeMode } from '../types';
import { sounds } from '../lib/sound';
import { getRankForXp } from '../data/badges';
import {
  Terminal,
  Volume2,
  VolumeX,
  Award,
  Flame,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Trophy,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  currentOS: OperatingSystem;
  onSelectOS: (os: OperatingSystem) => void;
  onOpenBadges: () => void;
  onOpenLeaderboard: () => void;
  onToggleRole: () => void;
  onOpenTeacherPanel: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: ThemeMode;
  onSelectTheme: (t: ThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentOS,
  onSelectOS,
  onOpenBadges,
  onOpenLeaderboard,
  onToggleRole,
  onOpenTeacherPanel,
  soundEnabled,
  onToggleSound,
  theme,
  onSelectTheme,
}) => {
  const currentRank = getRankForXp(user.xp);
  const nextRankXp = user.level * 250;
  const currentLevelBaseXp = (user.level - 1) * 250;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((user.xp - currentLevelBaseXp) / (nextRankXp - currentLevelBaseXp)) * 100)
  );

  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  return (
    <header
      className={`border-b backdrop-blur-md sticky top-0 z-30 px-4 py-2.5 transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
          : isMatrix
          ? 'bg-[#020904]/95 border-[#00ff66]/30 shadow-lg shadow-[#00ff66]/10 text-[#d4ffe0]'
          : 'bg-gray-950/90 border-cyan-500/20 shadow-lg shadow-cyan-950/20 text-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                isLight
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : isMatrix
                  ? 'bg-[#00ff66] text-black shadow-[#00ff66]/50'
                  : 'bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 text-black shadow-cyan-500/30'
              }`}
            >
              <Terminal className="w-6 h-6 font-black" />
            </div>
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 animate-ping ${
                isLight
                  ? 'bg-emerald-500 border-white'
                  : isMatrix
                  ? 'bg-[#00ff66] border-gray-950'
                  : 'bg-emerald-400 border-gray-950'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`font-black text-xl tracking-wider font-mono ${
                  isLight
                    ? 'text-slate-900'
                    : isMatrix
                    ? 'text-[#00ff66] matrix-glow'
                    : 'bg-gradient-to-r from-emerald-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent'
                }`}
              >
                {isMatrix ? 'COMANDQUEST // MATRIX' : 'COMANDQUEST'}
              </span>
              <span
                className={`text-[9px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border shadow-inner ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                    : isMatrix
                    ? 'bg-[#003311] text-[#00ff66] border-[#00ff66]/60'
                    : 'bg-cyan-950 text-cyan-400 border-cyan-700/60'
                }`}
              >
                1º DAM
              </span>
            </div>
            <p className={`text-[11px] font-mono flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block animate-pulse ${
                  isLight ? 'bg-emerald-600' : isMatrix ? 'bg-[#00ff66]' : 'bg-emerald-400'
                }`}
              />
              IES Benigaslo • RA3 Gestión de Archivos y Almacenamiento
            </p>
          </div>
        </div>

        {/* Dual OS Switcher */}
        <div
          className={`flex items-center p-1 rounded-2xl border shadow-inner transition-colors ${
            isLight
              ? 'bg-slate-100 border-slate-300'
              : isMatrix
              ? 'bg-[#031508] border-[#00ff66]/30'
              : 'bg-gray-900/90 border-gray-800'
          }`}
        >
          <button
            onClick={() => {
              sounds.playKey();
              onSelectOS('linux');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentOS === 'linux'
                ? isLight
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : isMatrix
                  ? 'bg-[#00ff66] text-black shadow-md shadow-[#00ff66]/40 font-black'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-black shadow-md shadow-emerald-500/20 font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-base">🐧</span>
            <span>Linux Bash</span>
          </button>
          <button
            onClick={() => {
              sounds.playKey();
              onSelectOS('windows');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentOS === 'windows'
                ? isLight
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : isMatrix
                  ? 'bg-[#00cc55] text-black shadow-md shadow-[#00cc55]/40 font-black'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 font-black'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-base">🪟</span>
            <span>Windows PS</span>
          </button>
        </div>

        {/* Gamification, Theme Selector & HUD Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* THEME SELECTOR: LIGHT / DARK / MATRIX */}
          <div
            className={`flex items-center p-1 rounded-2xl border text-xs font-semibold ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-gray-900 border-gray-800'
            }`}
          >
            <button
              onClick={() => {
                sounds.playKey();
                onSelectTheme('light');
              }}
              className={`px-2 py-1 rounded-xl flex items-center gap-1 transition ${
                theme === 'light'
                  ? 'bg-amber-100 text-amber-900 font-bold shadow-sm'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Fondo Claro (Light Mode)"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Claro</span>
            </button>

            <button
              onClick={() => {
                sounds.playKey();
                onSelectTheme('dark');
              }}
              className={`px-2 py-1 rounded-xl flex items-center gap-1 transition ${
                theme === 'dark'
                  ? 'bg-gray-800 text-cyan-300 font-bold shadow-sm'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Fondo Oscuro Cyberpunk (Dark Mode)"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Oscuro</span>
            </button>

            <button
              onClick={() => {
                sounds.playKey();
                onSelectTheme('matrix');
              }}
              className={`px-2 py-1 rounded-xl flex items-center gap-1 transition ${
                theme === 'matrix'
                  ? 'bg-[#00ff66] text-black font-black shadow-sm shadow-[#00ff66]/40'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-gray-400 hover:text-[#00ff66]'
              }`}
              title="Fondo Matrix con lluvia de código"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Matrix</span>
            </button>
          </div>

          {/* XP & Level progress bar */}
          <div
            className={`border px-3 py-1.5 rounded-2xl flex items-center space-x-3 shadow-inner ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-800'
                : isMatrix
                ? 'bg-[#031508] border-[#00ff66]/30 text-[#00ff66]'
                : 'bg-gray-900/90 border-cyan-500/20'
            }`}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs space-x-2">
                <span className={`font-extrabold flex items-center gap-1 font-mono ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> NIV. {user.level}
                </span>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    isLight ? 'text-emerald-700' : isMatrix ? 'text-[#00ff66]' : 'text-cyan-400'
                  }`}
                >
                  {user.xp} XP
                </span>
              </div>
              <div className={`w-20 sm:w-24 h-2 rounded-full mt-1 overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-gray-800/90 border-gray-700/50'}`}>
                <div
                  className={`h-full transition-all duration-500 ${
                    isLight
                      ? 'bg-emerald-500'
                      : isMatrix
                      ? 'bg-[#00ff66]'
                      : 'bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className={`hidden md:block text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {currentRank.title}
            </div>
          </div>

          {/* Streak Flame */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-2xl text-xs font-black shadow-md ${
              isLight
                ? 'bg-orange-50 border border-orange-200 text-orange-700'
                : 'bg-orange-950/60 border border-orange-500/40 text-orange-400 shadow-orange-500/10'
            }`}
            title="Racha de retos superados"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
            <span>{user.streak}</span>
          </div>

          {/* Leaderboard Pódium */}
          <button
            onClick={() => {
              sounds.playKey();
              onOpenLeaderboard();
            }}
            className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-sm ${
              isLight
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100'
                : isMatrix
                ? 'bg-[#003311] text-[#00ff66] border-[#00ff66]/50 hover:bg-[#004d1a]'
                : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/50 hover:bg-cyan-900/50 shadow-cyan-500/10'
            }`}
            title="Abrir Tabla de Retos y Pódium de Clase"
          >
            <Trophy className="w-4 h-4" />
            <span>Pódium</span>
          </button>

          {/* Badges Trophy Button */}
          <button
            onClick={() => {
              sounds.playKey();
              onOpenBadges();
            }}
            className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-sm ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : 'bg-gray-900 hover:bg-gray-800 text-yellow-300 border-yellow-500/30'
            }`}
            title="Ver Logros e Insignias"
          >
            <Award className="w-4 h-4" />
            <span className={isLight ? 'text-amber-900' : 'text-gray-200'}>Logros</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isLight ? 'bg-amber-200 text-amber-900' : 'bg-yellow-500/20 text-yellow-300'
              }`}
            >
              {user.badges.length}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-2xl border transition ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                : 'bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border-gray-800'
            }`}
            title={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Teacher Mode Button */}
          {user.role === 'teacher' ? (
            <button
              onClick={onOpenTeacherPanel}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/30 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Docente</span>
            </button>
          ) : (
            <button
              onClick={onToggleRole}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-2xl text-[11px] border transition ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-gray-200 border-gray-800'
              }`}
              title="Cambiar a vista docente"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">Docente</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { UserProfile, OperatingSystem } from '../types';
import { sounds } from '../lib/sound';
import { getRankForXp } from '../data/badges';
import { Terminal, Volume2, VolumeX, Award, Flame, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  currentOS: OperatingSystem;
  onSelectOS: (os: OperatingSystem) => void;
  onOpenBadges: () => void;
  onToggleRole: () => void;
  onOpenTeacherPanel: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentOS,
  onSelectOS,
  onOpenBadges,
  onToggleRole,
  onOpenTeacherPanel,
  soundEnabled,
  onToggleSound,
}) => {
  const currentRank = getRankForXp(user.xp);
  const nextRankXp = user.level * 250;
  const currentLevelBaseXp = (user.level - 1) * 250;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((user.xp - currentLevelBaseXp) / (nextRankXp - currentLevelBaseXp)) * 100)
  );

  return (
    <header className="bg-gray-900/90 border-b border-gray-800 backdrop-blur sticky top-0 z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Terminal className="w-6 h-6 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                ComandQuest
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                1º DAM • SINF
              </span>
            </div>
            <p className="text-xs text-gray-400">IES Benigaslo • RA3 Gestión de Archivos</p>
          </div>
        </div>

        {/* OS Selector Tabs */}
        <div className="flex items-center bg-gray-950 p-1 rounded-xl border border-gray-800 shadow-inner">
          <button
            onClick={() => {
              sounds.playKey();
              onSelectOS('linux');
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentOS === 'linux'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-base">🐧</span>
            <span>Linux (Bash)</span>
          </button>
          <button
            onClick={() => {
              sounds.playKey();
              onSelectOS('windows');
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentOS === 'windows'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-base">🪟</span>
            <span>Windows (CMD/PS)</span>
          </button>
        </div>

        {/* Gamification Stats: XP, Level, Streak */}
        <div className="flex items-center flex-wrap gap-2">
          {/* XP & Level progress bar */}
          <div className="bg-gray-950/80 border border-gray-800 px-3 py-1.5 rounded-xl flex items-center space-x-3">
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs space-x-2">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Nivel {user.level}
                </span>
                <span className="text-gray-400 font-mono text-[11px]">{user.xp} XP</span>
              </div>
              {/* Progress bar */}
              <div className="w-28 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="hidden sm:block text-[10px] text-gray-500 font-mono">
              {currentRank.title}
            </div>
          </div>

          {/* Streak Flame */}
          <div
            className="flex items-center space-x-1.5 bg-orange-950/50 border border-orange-800/60 px-2.5 py-1.5 rounded-xl text-orange-400 text-xs font-bold shadow-sm"
            title="Racha de ejercicios completados"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{user.streak}</span>
          </div>

          {/* Badges Trophy Button */}
          <button
            onClick={() => {
              sounds.playKey();
              onOpenBadges();
            }}
            className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
            title="Ver Logros y Recompensas"
          >
            <Award className="w-4 h-4" />
            <span className="text-gray-200">Logros</span>
            <span className="bg-yellow-500/20 text-yellow-300 text-[10px] px-1.5 py-0.2 rounded-full">
              {user.badges.length}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition border border-gray-700/50"
            title={soundEnabled ? 'Silenciar efectos' : 'Activar sonido retro'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Teacher Mode Button */}
          {user.role === 'teacher' ? (
            <button
              onClick={onOpenTeacherPanel}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Panel Docente</span>
            </button>
          ) : (
            <button
              onClick={onToggleRole}
              className="flex items-center space-x-1 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-gray-200 px-2 py-1.5 rounded-xl text-[11px] border border-gray-700/50"
              title="Cambiar a vista de docente para monitorizar alumnos"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Vista Docente</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

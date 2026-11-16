import React from 'react';
import { UserProfile, OperatingSystem } from '../types';
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
}) => {
  const currentRank = getRankForXp(user.xp);
  const nextRankXp = user.level * 250;
  const currentLevelBaseXp = (user.level - 1) * 250;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((user.xp - currentLevelBaseXp) / (nextRankXp - currentLevelBaseXp)) * 100)
  );

  return (
    <header className="bg-gray-950/90 border-b border-cyan-500/20 backdrop-blur-md sticky top-0 z-30 px-4 py-2.5 shadow-lg shadow-cyan-950/20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Cyberpunk Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Terminal className="w-6 h-6 text-black font-black" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-950 animate-ping" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-xl tracking-wider font-mono bg-gradient-to-r from-emerald-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
                COMANDQUEST
              </span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/60 shadow-inner">
                v2.0 CYBER
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              IES Benigaslo • RA3 Sistemas Informáticos
            </p>
          </div>
        </div>

        {/* Dual OS Switcher */}
        <div className="flex items-center bg-gray-900/90 p-1 rounded-2xl border border-gray-800 shadow-inner">
          <button
            onClick={() => {
              sounds.playKey();
              onSelectOS('linux');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentOS === 'linux'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-black shadow-md shadow-emerald-500/20 font-black'
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
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 font-black'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-base">🪟</span>
            <span>Windows PS</span>
          </button>
        </div>

        {/* Gamification & Navigation HUD */}
        <div className="flex items-center flex-wrap gap-2">
          {/* XP & Level progress bar */}
          <div className="bg-gray-900/90 border border-cyan-500/20 px-3 py-1.5 rounded-2xl flex items-center space-x-3 shadow-inner">
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs space-x-2">
                <span className="font-extrabold text-amber-300 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> NIV. {user.level}
                </span>
                <span className="text-cyan-400 font-mono text-[11px] font-bold">{user.xp} XP</span>
              </div>
              <div className="w-28 h-2 bg-gray-800/90 rounded-full mt-1 overflow-hidden border border-gray-700/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="hidden sm:block text-[10px] text-gray-400 font-mono">
              {currentRank.title}
            </div>
          </div>

          {/* Streak Flame */}
          <div
            className="flex items-center space-x-1.5 bg-orange-950/60 border border-orange-500/40 px-2.5 py-1.5 rounded-2xl text-orange-400 text-xs font-black shadow-md shadow-orange-500/10"
            title="Racha de retos superados"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-400 animate-bounce" />
            <span>{user.streak}</span>
          </div>

          {/* LEADERBOARD BUTTON (Pique Sano) */}
          <button
            onClick={() => {
              sounds.playKey();
              onOpenLeaderboard();
            }}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-cyan-300 border border-cyan-500/50 px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-lg shadow-cyan-500/10 animate-pulse hover:animate-none"
            title="Abrir Tabla de Retos y Pódium de Clase"
          >
            <Trophy className="w-4 h-4 text-cyan-300" />
            <span>Pódium</span>
          </button>

          {/* Badges Trophy Button */}
          <button
            onClick={() => {
              sounds.playKey();
              onOpenBadges();
            }}
            className="flex items-center space-x-1.5 bg-gray-900 hover:bg-gray-800 text-yellow-300 border border-yellow-500/30 px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-sm"
            title="Ver Logros e Insignias"
          >
            <Award className="w-4 h-4" />
            <span className="text-gray-200">Logros</span>
            <span className="bg-yellow-500/20 text-yellow-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {user.badges.length}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-2xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition border border-gray-800"
            title={soundEnabled ? 'Silenciar efectos de audio' : 'Activar efectos arcade 8-bit'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Teacher Mode Button */}
          {user.role === 'teacher' ? (
            <button
              onClick={onOpenTeacherPanel}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/30 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Panel Docente</span>
            </button>
          ) : (
            <button
              onClick={onToggleRole}
              className="flex items-center space-x-1 bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-gray-200 px-2.5 py-1.5 rounded-2xl text-[11px] border border-gray-800"
              title="Cambiar a vista docente"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Docente</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

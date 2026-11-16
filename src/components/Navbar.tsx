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
  matrixMode: boolean;
  onToggleMatrix: () => void;
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
  matrixMode,
  onToggleMatrix,
}) => {
  const currentRank = getRankForXp(user.xp);
  const nextRankXp = user.level * 250;
  const currentLevelBaseXp = (user.level - 1) * 250;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((user.xp - currentLevelBaseXp) / (nextRankXp - currentLevelBaseXp)) * 100)
  );

  return (
    <header
      className={`border-b backdrop-blur-md sticky top-0 z-30 px-4 py-2.5 transition-colors duration-500 ${
        matrixMode
          ? 'bg-[#020904]/95 border-[#00ff66]/30 shadow-lg shadow-[#00ff66]/10'
          : 'bg-gray-950/90 border-cyan-500/20 shadow-lg shadow-cyan-950/20'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                matrixMode
                  ? 'bg-[#00ff66] text-black shadow-[#00ff66]/50'
                  : 'bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 text-black shadow-cyan-500/30'
              }`}
            >
              <Terminal className="w-6 h-6 font-black" />
            </div>
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-950 animate-ping ${
                matrixMode ? 'bg-[#00ff66]' : 'bg-emerald-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`font-black text-xl tracking-wider font-mono ${
                  matrixMode
                    ? 'text-[#00ff66] matrix-glow'
                    : 'bg-gradient-to-r from-emerald-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent'
                }`}
              >
                {matrixMode ? 'COMANDQUEST // MATRIX' : 'COMANDQUEST'}
              </span>
              <span
                className={`text-[9px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border shadow-inner ${
                  matrixMode
                    ? 'bg-[#003311] text-[#00ff66] border-[#00ff66]/60'
                    : 'bg-cyan-950 text-cyan-400 border-cyan-700/60'
                }`}
              >
                {matrixMode ? 'SIMULATOR 3.0' : 'CYBER 2.0'}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block animate-pulse ${
                  matrixMode ? 'bg-[#00ff66]' : 'bg-emerald-400'
                }`}
              />
              IES Benigaslo • RA3 Sistemas Informáticos
            </p>
          </div>
        </div>

        {/* Dual OS Switcher */}
        <div
          className={`flex items-center p-1 rounded-2xl border shadow-inner transition-colors ${
            matrixMode ? 'bg-[#031508] border-[#00ff66]/30' : 'bg-gray-900/90 border-gray-800'
          }`}
        >
          <button
            onClick={() => {
              sounds.playKey();
              onSelectOS('linux');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentOS === 'linux'
                ? matrixMode
                  ? 'bg-[#00ff66] text-black shadow-md shadow-[#00ff66]/40 font-black'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-black shadow-md shadow-emerald-500/20 font-black'
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
                ? matrixMode
                  ? 'bg-[#00cc55] text-black shadow-md shadow-[#00cc55]/40 font-black'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 font-black'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-base">🪟</span>
            <span>Windows PS</span>
          </button>
        </div>

        {/* Gamification & HUD Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* MATRIX TOGGLE PILL (La Pastilla de Matrix) */}
          <button
            onClick={() => {
              sounds.playKey();
              onToggleMatrix();
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition border shadow-lg ${
              matrixMode
                ? 'bg-[#00ff66] text-black border-[#00ff66] shadow-[#00ff66]/40 matrix-pulse'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50'
            }`}
            title="Activar / Desactivar Lluvia de Código y Estética Matrix"
          >
            <Zap className={`w-3.5 h-3.5 ${matrixMode ? 'text-black' : 'text-emerald-400'}`} />
            <span>{matrixMode ? '🟢 MATRIX ON' : '💊 Toque Matrix'}</span>
          </button>

          {/* XP & Level progress bar */}
          <div
            className={`border px-3 py-1.5 rounded-2xl flex items-center space-x-3 shadow-inner ${
              matrixMode
                ? 'bg-[#031508] border-[#00ff66]/30 text-[#00ff66]'
                : 'bg-gray-900/90 border-cyan-500/20'
            }`}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs space-x-2">
                <span className="font-extrabold text-amber-300 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> NIV. {user.level}
                </span>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    matrixMode ? 'text-[#00ff66]' : 'text-cyan-400'
                  }`}
                >
                  {user.xp} XP
                </span>
              </div>
              <div className="w-24 h-2 bg-gray-800/90 rounded-full mt-1 overflow-hidden border border-gray-700/50">
                <div
                  className={`h-full transition-all duration-500 ${
                    matrixMode
                      ? 'bg-[#00ff66]'
                      : 'bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400'
                  }`}
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

          {/* Leaderboard Pódium */}
          <button
            onClick={() => {
              sounds.playKey();
              onOpenLeaderboard();
            }}
            className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-2xl text-xs font-bold transition shadow-lg ${
              matrixMode
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
            title={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
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
              <span>Docente</span>
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

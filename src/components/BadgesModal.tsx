import React from 'react';
import { UserProfile, ThemeMode } from '../types';
import { BADGES, RANKS, getRankForXp } from '../data/badges';
import { sounds } from '../lib/sound';
import { X, Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  theme?: ThemeMode;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  user,
  theme = 'matrix',
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';
  const currentRank = getRankForXp(user.xp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className={`border-2 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative transition-colors ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800 shadow-slate-400'
            : isMatrix
            ? 'bg-gradient-to-b from-[#020b04] via-[#041307] to-[#020b04] border-[#00ff66]/40 shadow-[#00ff66]/20 text-[#d4ffe0]'
            : 'bg-gradient-to-b from-gray-900 via-[#0b101d] to-gray-950 border-amber-500/40 shadow-amber-500/10 text-gray-100'
        }`}
      >
        {/* Accent Bar */}
        <div
          className={`h-1.5 w-full ${
            isLight
              ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600'
              : isMatrix
              ? 'bg-gradient-to-r from-[#00ff66] via-emerald-400 to-[#00ff66]'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600'
          }`}
        />

        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isLight
              ? 'bg-slate-50 border-slate-200'
              : isMatrix
              ? 'bg-[#031508] border-[#00ff66]/30'
              : 'bg-gray-950/60 border-gray-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                isLight
                  ? 'bg-amber-100 border-amber-200 text-amber-600'
                  : isMatrix
                  ? 'bg-[#003311] border-[#00ff66]/50 text-[#00ff66]'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              }`}
            >
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2
                className={`text-lg font-bold flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : isMatrix ? 'text-[#00ff66]' : 'text-white'
                }`}
              >
                <span>Salón de Logros y Rangos</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-mono font-bold ${
                    isLight
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : isMatrix
                      ? 'bg-[#002b11] text-[#00ff66] border-[#00ff66]/50'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  {user.badges.length}/{BADGES.length} Desbloqueados
                </span>
              </h2>
              <p
                className={`text-xs ${
                  isLight ? 'text-slate-500' : isMatrix ? 'text-[#80e5a3]' : 'text-gray-400'
                }`}
              >
                Resuelve retos con soltura para ganar XP y ascender en el escalafón de SysAdmin
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playKey();
              onClose();
            }}
            className={`p-2 rounded-xl transition ${
              isLight
                ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                : isMatrix
                ? 'text-[#00ff66]/60 hover:text-[#00ff66] hover:bg-[#003311]/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          {/* Current Rank Banner */}
          <div
            className={`border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 ${
              isLight
                ? 'bg-slate-100/90 border-slate-200 shadow-sm'
                : isMatrix
                ? 'bg-[#020f06]/80 border-[#00ff66]/30 shadow-inner'
                : 'bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-gray-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{user.avatar}</span>
              <div>
                <div
                  className={`text-xs uppercase font-mono ${
                    isLight ? 'text-slate-500' : isMatrix ? 'text-[#80e5a3]' : 'text-gray-400'
                  }`}
                >
                  Rango actual
                </div>
                <div
                  className={`text-lg font-bold flex items-center gap-2 ${
                    isLight ? 'text-slate-900' : isMatrix ? 'text-[#00ff66]' : 'text-white'
                  }`}
                >
                  <span className={currentRank.color}>{currentRank.title}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono ${
                      isLight
                        ? 'bg-slate-200 text-slate-700'
                        : isMatrix
                        ? 'bg-[#003311] text-[#00ff66] border border-[#00ff66]/30'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    Nivel {user.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-xs uppercase font-mono ${
                  isLight ? 'text-slate-500' : isMatrix ? 'text-[#80e5a3]' : 'text-gray-400'
                }`}
              >
                Experiencia Total
              </div>
              <div
                className={`text-xl font-black font-mono flex items-center justify-end gap-1 ${
                  isMatrix ? 'text-[#00ff66]' : 'text-amber-500'
                }`}
              >
                <Sparkles className="w-4 h-4" /> {user.xp} XP
              </div>
            </div>
          </div>

          {/* Rank Roadmap */}
          <div className="space-y-2">
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-600' : isMatrix ? 'text-[#00ff66]' : 'text-gray-400'
              }`}
            >
              Escalafón de Rangos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {RANKS.map((r) => {
                const reached = user.xp >= r.minXp;
                return (
                  <div
                    key={r.level}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col justify-between ${
                      reached
                        ? `${r.badgeColor} border-emerald-500/40 text-white shadow-sm`
                        : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                        : isMatrix
                        ? 'bg-[#020c05] border-[#00ff66]/20 text-[#00ff66]/40'
                        : 'bg-gray-950/40 border-gray-800/80 text-gray-600 opacity-60'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase font-bold">Niv. {r.level}</div>
                    <div className="text-xs font-semibold my-1 line-clamp-1">{r.title}</div>
                    <div
                      className={`text-[10px] font-mono ${
                        isLight ? 'text-slate-500' : isMatrix ? 'text-[#80e5a3]' : 'text-gray-400'
                      }`}
                    >
                      {r.minXp} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="space-y-3">
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-600' : isMatrix ? 'text-[#00ff66]' : 'text-gray-400'
              }`}
            >
              Insignias y Medallas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES.map((badge) => {
                const unlocked = user.badges.includes(badge.id) || badge.condition(user);

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition flex items-start space-x-3 ${
                      unlocked
                        ? isLight
                          ? 'bg-amber-50/70 border-amber-300 shadow-sm text-slate-800'
                          : isMatrix
                          ? 'bg-[#021408] border-[#00ff66]/50 text-[#d4ffe0] shadow-[#00ff66]/10'
                          : 'bg-gray-950/80 border-amber-500/30 shadow-md shadow-amber-500/5 text-gray-100'
                        : isLight
                        ? 'bg-slate-100/60 border-slate-200 text-slate-400 opacity-60'
                        : isMatrix
                        ? 'bg-[#010803] border-[#00ff66]/15 text-[#00ff66]/30 opacity-60'
                        : 'bg-gray-950/30 border-gray-800/60 text-gray-500 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        unlocked
                          ? isLight
                            ? 'bg-amber-100 border border-amber-300 text-amber-700'
                            : isMatrix
                            ? 'bg-[#002b11] border border-[#00ff66]/60 text-[#00ff66]'
                            : 'bg-amber-950/40 border border-amber-700/60'
                          : isLight
                          ? 'bg-slate-200 border border-slate-300 text-slate-400'
                          : isMatrix
                          ? 'bg-[#020b04] border border-[#00ff66]/20 text-[#00ff66]/30'
                          : 'bg-gray-900 border border-gray-800 text-gray-600'
                      }`}
                    >
                      {unlocked ? badge.icon : <Lock className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold truncate ${
                            unlocked
                              ? isLight
                                ? 'text-slate-900'
                                : isMatrix
                                ? 'text-[#00ff66]'
                                : 'text-white'
                              : isLight
                              ? 'text-slate-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {badge.title}
                        </h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isLight
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : isMatrix
                              ? 'bg-[#002b11] text-[#00ff66] border-[#00ff66]/40'
                              : 'bg-amber-950/60 text-amber-300 border-amber-900/60'
                          }`}
                        >
                          +{badge.xpBonus} XP
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isLight ? 'text-slate-600' : isMatrix ? 'text-[#80e5a3]' : 'text-gray-400'
                        }`}
                      >
                        {badge.description}
                      </p>
                      <div className="mt-2 flex items-center text-[11px]">
                        {unlocked ? (
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              isMatrix ? 'text-[#00ff66]' : 'text-emerald-500'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Desbloqueada
                          </span>
                        ) : (
                          <span
                            className={`font-mono ${
                              isLight ? 'text-slate-400' : isMatrix ? 'text-[#00ff66]/40' : 'text-gray-500'
                            }`}
                          >
                            Bloqueada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

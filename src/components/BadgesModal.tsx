import React from 'react';
import { UserProfile } from '../types';
import { BADGES, RANKS, getRankForXp } from '../data/badges';
import { sounds } from '../lib/sound';
import { X, Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const currentRank = getRankForXp(user.xp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Salón de Logros y Rangos</span>
                <span className="text-xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800">
                  {user.badges.length}/{BADGES.length} Desbloqueados
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Resuelve retos con soltura para ganar XP y ascender en el escalafón de SysAdmin
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playKey();
              onClose();
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          {/* Current Rank Banner */}
          <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{user.avatar}</span>
              <div>
                <div className="text-xs text-gray-400 uppercase font-mono">Rango actual</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span className={currentRank.color}>{currentRank.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                    Nivel {user.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase font-mono">Experiencia Total</div>
              <div className="text-xl font-black text-amber-400 font-mono flex items-center justify-end gap-1">
                <Sparkles className="w-4 h-4" /> {user.xp} XP
              </div>
            </div>
          </div>

          {/* Rank Roadmap */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
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
                        ? `${r.badgeColor} border-emerald-500/40 text-white`
                        : 'bg-gray-950/40 border-gray-800/80 text-gray-600 opacity-60'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase font-bold">Niv. {r.level}</div>
                    <div className="text-xs font-semibold my-1 line-clamp-1">{r.title}</div>
                    <div className="text-[10px] font-mono text-gray-400">{r.minXp} XP</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
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
                        ? 'bg-gray-950/80 border-amber-500/30 shadow-md shadow-amber-500/5'
                        : 'bg-gray-950/30 border-gray-800/60 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        unlocked
                          ? 'bg-amber-950/40 border border-amber-700/60'
                          : 'bg-gray-900 border border-gray-800'
                      }`}
                    >
                      {unlocked ? badge.icon : <Lock className="w-5 h-5 text-gray-600" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">{badge.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-900/60">
                          +{badge.xpBonus} XP
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                      <div className="mt-2 flex items-center text-[11px]">
                        {unlocked ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Desbloqueada
                          </span>
                        ) : (
                          <span className="text-gray-500 font-mono">Bloqueada</span>
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

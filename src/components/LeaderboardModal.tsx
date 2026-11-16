import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { fetchLeaderboard } from '../lib/supabase';
import { sounds } from '../lib/sound';
import {
  Trophy,
  Flame,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard(currentUserId).then((data) => {
        setEntries(data);
      });
    }
  }, [isOpen, currentUserId]);

  if (!isOpen) return null;

  const top3 = entries.slice(0, 3);
  const currentUserEntry = entries.find((e) => e.isCurrentUser || e.id === currentUserId);
  const nextRival = currentUserEntry && currentUserEntry.rank > 1 ? entries[currentUserEntry.rank - 2] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-gradient-to-b from-gray-900 via-[#0a0f1d] to-gray-950 border-2 border-cyan-500/40 rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden relative">
        {/* Cyberpunk Top Neon Line */}
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-fuchsia-500 w-full" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/80 bg-gray-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-400 tracking-wide font-mono uppercase">
                  Tabla de Retos & Pódium DAM
                </h2>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800 font-mono font-bold animate-pulse">
                  EN VIVO
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Pique sano de clase: ¡Resuelve más retos para liderar el salón de la fama de Sistemas!
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900/50">
          {/* Motivation Box: "Pique Sano" */}
          {currentUserEntry && nextRival && (
            <div className="bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-gray-950 border border-cyan-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                <span className="text-gray-300 font-medium">
                  Estás en la posición <strong className="text-cyan-300">#{currentUserEntry.rank}</strong>. Te faltan solo{' '}
                  <strong className="text-amber-400 font-mono">+{nextRival.xp - currentUserEntry.xp} XP</strong> para adelantar a{' '}
                  <strong className="text-white">{nextRival.name}</strong>.
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-cyan-900/40 border border-cyan-700/60 px-2.5 py-1 rounded-xl text-cyan-300 font-bold shrink-0">
                ¡A por el podio!
              </span>
            </div>
          )}

          {/* TOP 3 PODIUM */}
          <div className="grid grid-cols-3 gap-3 pt-4 pb-2 items-end">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="bg-gradient-to-t from-gray-950 to-slate-900/80 border border-slate-700/80 rounded-2xl p-4 text-center space-y-2 h-44 flex flex-col justify-end relative shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥈</div>
                <div className="font-bold text-xs text-slate-300 line-clamp-1">{top3[1].name}</div>
                <div className="text-[10px] text-cyan-400 font-mono font-semibold">{top3[1].rankTitle}</div>
                <div className="text-base font-black text-amber-300 font-mono">
                  {top3[1].xp} <span className="text-[10px] text-gray-400 font-normal">XP</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-medium">
                  {top3[1].completedCount} retos
                </div>
                <div className="bg-slate-700/40 py-1 rounded-lg text-[10px] font-bold text-slate-300 uppercase font-mono">
                  2º Lugar
                </div>
              </div>
            )}

            {/* 1st Place (Crown) */}
            {top3[0] && (
              <div className="bg-gradient-to-t from-gray-950 via-amber-950/30 to-amber-900/20 border-2 border-amber-500/80 rounded-2xl p-4 text-center space-y-2 h-52 flex flex-col justify-end relative shadow-xl shadow-amber-500/10">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl animate-bounce">👑</div>
                <div className="font-black text-sm text-amber-200 line-clamp-1">{top3[0].name}</div>
                <div className="text-[11px] text-amber-400 font-mono font-bold">{top3[0].rankTitle}</div>
                <div className="text-xl font-black text-amber-300 font-mono flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {top3[0].xp} <span className="text-xs text-amber-500/80">XP</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono font-bold flex items-center justify-center gap-1">
                  <Target className="w-3.5 h-3.5" /> {top3[0].completedCount} retos
                </div>
                <div className="bg-amber-500/20 border border-amber-500/50 py-1 rounded-lg text-xs font-black text-amber-300 uppercase font-mono">
                  🥇 Campeón Actual
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="bg-gradient-to-t from-gray-950 to-amber-950/40 border border-amber-800/60 rounded-2xl p-4 text-center space-y-2 h-40 flex flex-col justify-end relative shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥉</div>
                <div className="font-bold text-xs text-amber-200/90 line-clamp-1">{top3[2].name}</div>
                <div className="text-[10px] text-cyan-400 font-mono font-semibold">{top3[2].rankTitle}</div>
                <div className="text-base font-black text-amber-300 font-mono">
                  {top3[2].xp} <span className="text-[10px] text-gray-400 font-normal">XP</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-medium">
                  {top3[2].completedCount} retos
                </div>
                <div className="bg-amber-900/30 py-1 rounded-lg text-[10px] font-bold text-amber-400 uppercase font-mono">
                  3º Lugar
                </div>
              </div>
            )}
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-gray-950/80 border border-gray-800 rounded-2xl overflow-hidden shadow-inner">
            <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between text-xs font-mono font-bold text-gray-400 uppercase">
              <span>Posición / Alumno</span>
              <div className="flex items-center space-x-8">
                <span>Racha</span>
                <span>Retos</span>
                <span>Experiencia</span>
              </div>
            </div>

            <div className="divide-y divide-gray-800/80 text-xs">
              {entries.map((item) => {
                const isUser = item.isCurrentUser || item.id === currentUserId;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-4 py-3 transition ${
                      isUser
                        ? 'bg-cyan-950/50 border-l-4 border-cyan-400 text-cyan-200'
                        : 'hover:bg-gray-900/60 text-gray-300'
                    }`}
                  >
                    {/* Rank & Name */}
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                          item.rank === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                            : item.rank === 2
                            ? 'bg-slate-500/20 text-slate-300 border border-slate-500/50'
                            : item.rank === 3
                            ? 'bg-amber-800/20 text-amber-400 border border-amber-800/50'
                            : 'bg-gray-800 text-gray-400 font-normal'
                        }`}
                      >
                        #{item.rank}
                      </span>

                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {isUser && (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-400 text-black font-extrabold font-mono">
                              TÚ
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Niv. {item.level} • {item.rankTitle}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-8 font-mono">
                      <div className="flex items-center space-x-1 text-orange-400 w-12 justify-end">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" />
                        <span className="font-bold">{item.streak}</span>
                      </div>

                      <div className="w-12 text-right text-emerald-400 font-semibold">
                        {item.completedCount}
                      </div>

                      <div className="w-20 text-right font-black text-amber-400">
                        {item.xp} <span className="text-[10px] text-gray-500 font-normal">XP</span>
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

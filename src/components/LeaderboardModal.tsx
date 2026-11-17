import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, CourseGroup, ThemeMode } from '../types';
import { fetchLeaderboard } from '../lib/supabase';
import { sounds } from '../lib/sound';
import {
  Trophy,
  Flame,
  Sparkles,
  Target,
  X,
  Zap,
  Users,
  GraduationCap,
} from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  theme?: ThemeMode;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  theme = 'matrix',
}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseGroup | 'TODOS'>('TODOS');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (isOpen) {
      setLoading(true);
      fetchLeaderboard(currentUserId, selectedCourse)
        .then((data) => {
          if (!isCancelled) {
            setEntries(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!isCancelled) setLoading(false);
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [isOpen, currentUserId, selectedCourse]);

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  const top3 = entries.slice(0, 3);
  const currentUserEntry = entries.find((e) => e.isCurrentUser || e.id === currentUserId);
  const nextRival = currentUserEntry && currentUserEntry.rank > 1 ? entries[currentUserEntry.rank - 2] : null;

  const renderCourseBadge = (course?: CourseGroup) => {
    if (course === '1DAW') {
      return (
        <span
          className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold border ${
            isLight
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
          }`}
        >
          1º DAW
        </span>
      );
    }
    if (course === '2SMR') {
      return (
        <span
          className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold border ${
            isLight
              ? 'bg-purple-100 text-purple-800 border-purple-300'
              : 'bg-purple-950 text-purple-300 border-purple-800'
          }`}
        >
          2º SMR
        </span>
      );
    }
    return (
      <span
        className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold border ${
          isLight
            ? 'bg-blue-100 text-blue-800 border-blue-300'
            : 'bg-blue-950 text-blue-300 border-blue-800'
        }`}
      >
        1º DAM
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className={`border-2 rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden relative ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800 shadow-slate-400'
            : isMatrix
            ? 'bg-gradient-to-b from-[#020b04] via-[#051408] to-[#020b04] border-[#00ff66]/40 shadow-[#00ff66]/20 text-[#d4ffe0]'
            : 'bg-gradient-to-b from-gray-900 via-[#0a0f1d] to-gray-950 border-cyan-500/40 shadow-cyan-500/10 text-gray-100'
        }`}
      >
        {/* Cyberpunk Top Neon Line */}
        <div
          className={`h-1.5 w-full ${
            isLight
              ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600'
              : isMatrix
              ? 'bg-gradient-to-r from-[#00ff66] via-emerald-400 to-[#00ff66]'
              : 'bg-gradient-to-r from-emerald-400 via-cyan-500 to-fuchsia-500'
          }`}
        />

        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isLight ? 'bg-slate-50 border-slate-200' : isMatrix ? 'bg-[#031508]/80 border-[#00ff66]/30' : 'bg-gray-950/70 border-gray-800/80'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-lg ${
                isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-amber-200'
                  : isMatrix
                  ? 'bg-[#003311] border-[#00ff66]/60 text-[#00ff66] shadow-[#00ff66]/30'
                  : 'bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border-amber-500/50 text-amber-400 shadow-amber-500/20'
              }`}
            >
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2
                  className={`text-lg font-black tracking-wide font-mono uppercase ${
                    isLight
                      ? 'text-slate-900'
                      : isMatrix
                      ? 'text-[#00ff66]'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-400'
                  }`}
                >
                  Tabla de Retos & Pódium
                </h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold animate-pulse ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : isMatrix
                      ? 'bg-[#002b0f] text-[#00ff66] border-[#00ff66]/80'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  }`}
                >
                  EN VIVO
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Pique sano de clase: ¡Resuelve más retos para liderar el salón de la fama de Sistemas!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playKey();
              onClose();
            }}
            className={`p-2 rounded-xl transition ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Filter Tabs */}
        <div
          className={`flex items-center justify-between px-6 py-2.5 border-b text-xs font-mono font-bold ${
            isLight ? 'bg-slate-100/70 border-slate-200' : isMatrix ? 'bg-[#020e05] border-[#00ff66]/20' : 'bg-gray-900/60 border-gray-800'
          }`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className={`text-[11px] mr-1 hidden sm:inline ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Filtrar por grupo:
            </span>

            <button
              onClick={() => {
                sounds.playKey();
                setSelectedCourse('TODOS');
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                selectedCourse === 'TODOS'
                  ? isLight
                    ? 'bg-slate-900 text-white shadow'
                    : isMatrix
                    ? 'bg-[#00ff66] text-black shadow-md shadow-[#00ff66]/40 font-black'
                    : 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-black'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Todos (DAM, DAW & SMR)</span>
            </button>

            <button
              onClick={() => {
                sounds.playKey();
                setSelectedCourse('1DAM');
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                selectedCourse === '1DAM'
                  ? isLight
                    ? 'bg-blue-600 text-white shadow'
                    : isMatrix
                    ? 'bg-[#00ff66] text-black shadow-md shadow-[#00ff66]/40 font-black'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-black'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>1º DAM</span>
            </button>

            <button
              onClick={() => {
                sounds.playKey();
                setSelectedCourse('1DAW');
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                selectedCourse === '1DAW'
                  ? isLight
                    ? 'bg-emerald-600 text-white shadow'
                    : isMatrix
                    ? 'bg-[#00ff66] text-black shadow-md shadow-[#00ff66]/40 font-black'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-black'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>1º DAW</span>
            </button>

            <button
              onClick={() => {
                sounds.playKey();
                setSelectedCourse('2SMR');
              }}
              className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                selectedCourse === '2SMR'
                  ? isLight
                    ? 'bg-purple-600 text-white shadow'
                    : isMatrix
                    ? 'bg-[#00ff66] text-black shadow-md shadow-[#00ff66]/40 font-black'
                    : 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-black'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>2º SMR</span>
            </button>
          </div>

          <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            {entries.length} {entries.length === 1 ? 'alumno' : 'alumnos'}
          </span>
        </div>

        {/* Content Body */}
        <div
          className={`flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin ${
            isLight ? 'scrollbar-thumb-slate-300' : isMatrix ? 'scrollbar-thumb-emerald-950' : 'scrollbar-thumb-cyan-900/50'
          }`}
        >
          {/* Motivation Box: "Pique Sano" */}
          {currentUserEntry && nextRival && (
            <div
              className={`border rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs ${
                isLight
                  ? 'bg-cyan-50/70 border-cyan-200 text-slate-800'
                  : isMatrix
                  ? 'bg-[#002b0f]/60 border-[#00ff66]/40 text-[#d4ffe0]'
                  : 'bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-gray-950 border-cyan-500/40'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                <span className={isLight ? 'text-slate-700 font-medium' : 'text-gray-300 font-medium'}>
                  Estás en la posición{' '}
                  <strong className={isLight ? 'text-blue-700' : 'text-cyan-300'}>#{currentUserEntry.rank}</strong> del grupo{' '}
                  <span className="font-bold font-mono">
                    {selectedCourse === 'TODOS'
                      ? 'General'
                      : selectedCourse === '1DAM'
                      ? '1º DAM'
                      : selectedCourse === '1DAW'
                      ? '1º DAW'
                      : '2º SMR'}
                  </span>
                  . Te faltan solo{' '}
                  <strong className="text-amber-500 font-mono">+{nextRival.xp - currentUserEntry.xp} XP</strong> para adelantar a{' '}
                  <strong className={isLight ? 'text-slate-900' : 'text-white'}>{nextRival.name}</strong>.
                </span>
              </div>
              <span
                className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-xl font-bold shrink-0 border ${
                  isLight
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : isMatrix
                    ? 'bg-[#00ff66] text-black border-[#00ff66]'
                    : 'bg-cyan-900/40 border-cyan-700/60 text-cyan-300'
                }`}
              >
                ¡A por el podio!
              </span>
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-8 text-xs font-mono text-cyan-400 animate-pulse">
              Cargando clasificación...
            </div>
          )}

          {/* TOP 3 PODIUM */}
          {!loading && entries.length > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-4 pb-2 items-end">
              {/* 2nd Place or Placeholder */}
              {top3[1] ? (
                <div
                  className={`border rounded-2xl p-4 text-center space-y-2 h-44 flex flex-col justify-end relative shadow-lg ${
                    isLight
                      ? 'bg-slate-100 border-slate-300'
                      : isMatrix
                      ? 'bg-[#031508] border-[#00ff66]/30'
                      : 'bg-gradient-to-t from-gray-950 to-slate-900/80 border-slate-700/80'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥈</div>
                  <div className={`font-bold text-xs line-clamp-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {top3[1].name}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {renderCourseBadge(top3[1].course)}
                  </div>
                  <div
                    className={`text-[10px] font-mono font-semibold ${
                      isLight ? 'text-slate-600' : isMatrix ? 'text-[#00ff66]' : 'text-cyan-400'
                    }`}
                  >
                    {top3[1].rankTitle}
                  </div>
                  <div className={`text-base font-black font-mono ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                    {top3[1].xp} <span className="text-[10px] text-gray-400 font-normal">XP</span>
                  </div>
                  <div
                    className={`text-[10px] font-mono font-medium ${
                      isLight ? 'text-emerald-700' : isMatrix ? 'text-[#00ff66]' : 'text-emerald-400'
                    }`}
                  >
                    {top3[1].completedCount} retos
                  </div>
                  <div
                    className={`py-1 rounded-lg text-[10px] font-bold uppercase font-mono ${
                      isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-700/40 text-slate-300'
                    }`}
                  >
                    2º Lugar
                  </div>
                </div>
              ) : (
                <div />
              )}

              {/* 1st Place (Crown) */}
              {top3[0] && (
                <div
                  className={`border-2 rounded-2xl p-4 text-center space-y-2 h-52 flex flex-col justify-end relative shadow-xl ${
                    isLight
                      ? 'bg-amber-50/70 border-amber-400 shadow-amber-200'
                      : isMatrix
                      ? 'bg-[#002b0f]/80 border-[#00ff66] shadow-[#00ff66]/30'
                      : 'bg-gradient-to-t from-gray-950 via-amber-950/30 to-amber-900/20 border-amber-500/80 shadow-amber-500/10'
                  }`}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl animate-bounce">👑</div>
                  <div
                    className={`font-black text-sm line-clamp-1 ${
                      isLight ? 'text-amber-900' : isMatrix ? 'text-white' : 'text-amber-200'
                    }`}
                  >
                    {top3[0].name}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {renderCourseBadge(top3[0].course)}
                  </div>
                  <div className={`text-[11px] font-mono font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                    {top3[0].rankTitle}
                  </div>
                  <div className={`text-xl font-black font-mono flex items-center justify-center gap-1 ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                    <Sparkles className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                    {top3[0].xp} <span className={`text-xs ${isLight ? 'text-amber-700' : 'text-amber-500/80'}`}>XP</span>
                  </div>
                  <div
                    className={`text-xs font-mono font-bold flex items-center justify-center gap-1 ${
                      isLight ? 'text-emerald-700' : isMatrix ? 'text-[#00ff66]' : 'text-emerald-400'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" /> {top3[0].completedCount} retos
                  </div>
                  <div
                    className={`py-1 rounded-lg text-xs font-black uppercase font-mono border ${
                      isLight
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : isMatrix
                        ? 'bg-[#00ff66] border-[#00ff66] text-black'
                        : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    }`}
                  >
                    🥇 Campeón Actual
                  </div>
                </div>
              )}

              {/* 3rd Place or Placeholder */}
              {top3[2] ? (
                <div
                  className={`border rounded-2xl p-4 text-center space-y-2 h-40 flex flex-col justify-end relative shadow-lg ${
                    isLight
                      ? 'bg-amber-50/50 border-amber-200'
                      : isMatrix
                      ? 'bg-[#031508] border-[#00ff66]/30'
                      : 'bg-gradient-to-t from-gray-950 to-amber-950/40 border-amber-800/60'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥉</div>
                  <div
                    className={`font-bold text-xs line-clamp-1 ${
                      isLight ? 'text-amber-900' : isMatrix ? 'text-gray-200' : 'text-amber-200/90'
                    }`}
                  >
                    {top3[2].name}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {renderCourseBadge(top3[2].course)}
                  </div>
                  <div
                    className={`text-[10px] font-mono font-semibold ${
                      isLight ? 'text-slate-600' : isMatrix ? 'text-[#00ff66]' : 'text-cyan-400'
                    }`}
                  >
                    {top3[2].rankTitle}
                  </div>
                  <div className={`text-base font-black font-mono ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                    {top3[2].xp} <span className="text-[10px] text-gray-400 font-normal">XP</span>
                  </div>
                  <div
                    className={`text-[10px] font-mono font-medium ${
                      isLight ? 'text-emerald-700' : isMatrix ? 'text-[#00ff66]' : 'text-emerald-400'
                    }`}
                  >
                    {top3[2].completedCount} retos
                  </div>
                  <div
                    className={`py-1 rounded-lg text-[10px] font-bold uppercase font-mono ${
                      isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-900/30 text-amber-400'
                    }`}
                  >
                    3º Lugar
                  </div>
                </div>
              ) : (
                <div />
              )}
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div
            className={`border rounded-2xl overflow-hidden shadow-inner ${
              isLight ? 'bg-white border-slate-200' : isMatrix ? 'bg-[#031508] border-[#00ff66]/30' : 'bg-gray-950/80 border-gray-800'
            }`}
          >
            <div
              className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono font-bold uppercase ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : isMatrix ? 'bg-[#020b04] border-[#00ff66]/30 text-[#00ff66]' : 'bg-gray-900/80 border-gray-800 text-gray-400'
              }`}
            >
              <span>Posición / Alumno / Curso</span>
              <div className="flex items-center space-x-8">
                <span>Racha</span>
                <span>Retos</span>
                <span>Experiencia</span>
              </div>
            </div>

            <div className={`divide-y text-xs ${isLight ? 'divide-slate-200' : isMatrix ? 'divide-[#00ff66]/15' : 'divide-gray-800/80'}`}>
              {entries.map((item) => {
                const isUser = item.isCurrentUser || item.id === currentUserId;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-4 py-3 transition ${
                      isUser
                        ? isLight
                          ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-950 font-bold'
                          : isMatrix
                          ? 'bg-[#002b0f] border-l-4 border-[#00ff66] text-[#d4ffe0]'
                          : 'bg-cyan-950/50 border-l-4 border-cyan-400 text-cyan-200'
                        : isLight
                        ? 'hover:bg-slate-50 text-slate-700'
                        : 'hover:bg-gray-900/60 text-gray-300'
                    }`}
                  >
                    {/* Rank, Name & Course */}
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                          item.rank === 1
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                            : item.rank === 2
                            ? 'bg-slate-500/20 text-slate-300 border border-slate-500/50'
                            : item.rank === 3
                            ? 'bg-amber-800/20 text-amber-400 border border-amber-800/50'
                            : isLight
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-gray-800 text-gray-400 font-normal'
                        }`}
                      >
                        #{item.rank}
                      </span>

                      <div>
                        <div className="font-bold flex items-center gap-2">
                          <span className={isLight ? 'text-slate-900' : 'text-white'}>{item.name}</span>
                          {renderCourseBadge(item.course)}
                          {isUser && (
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-extrabold font-mono ${
                                isLight ? 'bg-blue-600 text-white' : isMatrix ? 'bg-[#00ff66] text-black' : 'bg-cyan-400 text-black'
                              }`}
                            >
                              TÚ
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
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

                      <div
                        className={`w-12 text-right font-semibold ${
                          isLight ? 'text-emerald-700' : isMatrix ? 'text-[#00ff66]' : 'text-emerald-400'
                        }`}
                      >
                        {item.completedCount}
                      </div>

                      <div className={`w-20 text-right font-black ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                        {item.xp} <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>XP</span>
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
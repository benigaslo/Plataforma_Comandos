import React, { useState } from 'react';
import { Exercise, ThemeMode } from '../types';
import { sounds } from '../lib/sound';
import {
  Lightbulb,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  Info,
  Terminal,
} from 'lucide-react';

interface ExerciseViewProps {
  exercise: Exercise;
  isCompleted: boolean;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  theme: ThemeMode;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  exercise,
  isCompleted,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
  theme,
}) => {
  const [showHint, setShowHint] = useState(false);

  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  const diffBadge = {
    fácil: isLight
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
    medio: isLight
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : 'bg-amber-950/80 text-amber-300 border-amber-500/50',
    avanzado: isLight
      ? 'bg-rose-50 text-rose-800 border-rose-300'
      : 'bg-rose-950/80 text-rose-300 border-rose-500/50',
  }[exercise.difficulty];

  return (
    <div
      className={`border-2 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200'
          : isMatrix
          ? 'bg-gradient-to-b from-[#020b04] via-[#051408] to-[#020b04] border-[#00ff66]/30 shadow-[#00ff66]/10 text-[#d4ffe0]'
          : 'bg-gradient-to-b from-gray-900 via-[#0c1220] to-gray-950 border-cyan-500/30 shadow-cyan-950/20 text-gray-100'
      }`}
    >
      <div className="space-y-3.5">
        {/* Top Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-lg border ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : isMatrix
                  ? 'bg-[#003311] text-[#00ff66] border-[#00ff66]/50'
                  : 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80'
              }`}
            >
              {exercise.module}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border shadow-sm ${diffBadge}`}>
              {exercise.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black shadow-md font-mono border ${
                isLight
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>+{exercise.xpReward} XP</span>
            </div>

            {isCompleted && (
              <div
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-black font-mono shadow-md border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : isMatrix
                    ? 'bg-[#003311] text-[#00ff66] border-[#00ff66]'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SUPERADO</span>
              </div>
            )}
          </div>
        </div>

        {/* Exercise Title */}
        <h2 className={`text-xl font-black flex items-center gap-2 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <span>{exercise.title}</span>
        </h2>

        {/* Quest Box */}
        <div
          className={`border p-4 rounded-2xl space-y-2 relative overflow-hidden shadow-inner ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : isMatrix
              ? 'bg-[#020b04] border-[#00ff66]/40 text-[#d4ffe0]'
              : 'bg-gray-950/90 border-cyan-500/30 text-gray-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-2 text-[11px] font-black uppercase tracking-wider font-mono ${
                isLight ? 'text-emerald-700' : isMatrix ? 'text-[#00ff66]' : 'text-cyan-400'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Protocolo Objetivo // Misión</span>
            </div>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
              STATUS: PENDING_INPUT
            </span>
          </div>
          <p className="text-sm sm:text-base font-semibold leading-relaxed font-sans">
            {exercise.mission}
          </p>
        </div>

        {/* Starting Directory Context if specified */}
        {exercise.startingDir && (
          <div
            className={`flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-xl border ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600'
                : 'bg-gray-950/60 border-gray-800 text-gray-400'
            }`}
          >
            <Info className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <span>
              Ruta inicial:{' '}
              <code className={`font-bold ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>
                {exercise.startingDir}
              </code>
            </span>
          </div>
        )}

        {/* Technical Briefing */}
        <div className={`text-xs space-y-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
          <div
            className={`flex items-center space-x-1.5 font-bold font-mono text-[11px] uppercase ${
              isLight ? 'text-slate-800' : 'text-gray-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-500" />
            <span>Fundamento técnico del comando:</span>
          </div>
          <p className={`leading-relaxed pl-4 border-l-2 ${isLight ? 'border-indigo-400 text-slate-700' : 'border-indigo-500/50 text-gray-300'}`}>
            {exercise.explanation}
          </p>
        </div>

        {/* Hint Accordion */}
        <div className="pt-0.5">
          {!showHint ? (
            <button
              onClick={() => {
                sounds.playKey();
                setShowHint(true);
              }}
              className={`flex items-center space-x-1.5 text-xs font-bold transition py-1 group ${
                isLight ? 'text-amber-700 hover:text-amber-800' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 group-hover:scale-120 transition" />
              <span>¿Necesitas un cable? Solicitar pista</span>
            </button>
          ) : (
            <div
              className={`p-3 rounded-2xl text-xs space-y-1 border animate-in fade-in ${
                isLight
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Pista del Sistema:
                </span>
                <button
                  onClick={() => setShowHint(false)}
                  className={`text-[10px] underline ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Ocultar
                </button>
              </div>
              <p className="font-mono pl-5 text-[11px]">{exercise.hint}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={`flex items-center justify-between border-t pt-3 ${isLight ? 'border-slate-200' : 'border-gray-800/80'}`}>
        <button
          onClick={() => {
            sounds.playKey();
            setShowHint(false);
            onPrev();
          }}
          disabled={!hasPrev}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40'
              : 'bg-gray-850 hover:bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
          ID: {exercise.id}
        </span>

        <button
          onClick={() => {
            sounds.playKey();
            setShowHint(false);
            onNext();
          }}
          disabled={!hasNext}
          className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-black transition shadow-md ${
            isLight
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 shadow-emerald-600/20'
              : isMatrix
              ? 'bg-[#00ff66] hover:bg-[#33ff88] text-black disabled:opacity-30 shadow-[#00ff66]/30'
              : 'bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black disabled:opacity-30 shadow-cyan-500/20'
          }`}
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

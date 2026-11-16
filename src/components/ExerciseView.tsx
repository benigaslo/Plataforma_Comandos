import React, { useState } from 'react';
import { Exercise } from '../types';
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
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  exercise,
  isCompleted,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
}) => {
  const [showHint, setShowHint] = useState(false);

  const diffBadge = {
    fácil: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-500/10',
    medio: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-500/10',
    avanzado: 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-500/10',
  }[exercise.difficulty];

  return (
    <div className="bg-gradient-to-b from-gray-900 via-[#0c1220] to-gray-950 border-2 border-cyan-500/30 rounded-3xl p-5 shadow-2xl shadow-cyan-950/20 flex flex-col justify-between space-y-4 relative overflow-hidden">
      {/* Corner cybernetic accents */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />

      <div className="space-y-3.5">
        {/* Top Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-800/80">
              {exercise.module}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border shadow-sm ${diffBadge}`}
            >
              {exercise.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-black shadow-md shadow-amber-500/10 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>+{exercise.xpReward} XP</span>
            </div>

            {isCompleted && (
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-black font-mono shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SUPERADO</span>
              </div>
            )}
          </div>
        </div>

        {/* Exercise Title */}
        <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
          <span>{exercise.title}</span>
        </h2>

        {/* Quest Box (Estilo Misión Cyberpunk) */}
        <div className="bg-gray-950/90 border border-cyan-500/30 p-4 rounded-2xl space-y-2 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[11px] font-black uppercase text-cyan-400 tracking-wider font-mono">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Protocolo Objetivo // Misión</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">STATUS: PENDING_INPUT</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-gray-100 leading-relaxed font-sans">
            {exercise.mission}
          </p>
        </div>

        {/* Starting Directory Context if specified */}
        {exercise.startingDir && (
          <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono bg-gray-950/60 px-3 py-1.5 rounded-xl border border-gray-800">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Ruta inicial: <code className="text-cyan-300 font-bold">{exercise.startingDir}</code></span>
          </div>
        )}

        {/* Technical Briefing */}
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-gray-300 font-mono text-[11px] uppercase">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Fundamento técnico del comando:</span>
          </div>
          <p className="leading-relaxed pl-4 border-l-2 border-indigo-500/50 text-gray-300">
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
              className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold transition py-1 group"
            >
              <Lightbulb className="w-3.5 h-3.5 group-hover:scale-120 transition" />
              <span>¿Necesitas un cable? Solicitar pista</span>
            </button>
          ) : (
            <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-2xl text-xs space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Pista del Sistema:
                </span>
                <button
                  onClick={() => setShowHint(false)}
                  className="text-[10px] text-gray-400 hover:text-gray-200 underline"
                >
                  Ocultar
                </button>
              </div>
              <p className="text-gray-200 font-mono pl-5 text-[11px]">{exercise.hint}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-gray-800/80 pt-3">
        <button
          onClick={() => {
            sounds.playKey();
            setShowHint(false);
            onPrev();
          }}
          disabled={!hasPrev}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-gray-850 hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-gray-850 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="text-[11px] text-gray-500 font-mono">
          ID: {exercise.id}
        </span>

        <button
          onClick={() => {
            sounds.playKey();
            setShowHint(false);
            onNext();
          }}
          disabled={!hasNext}
          className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-black text-black bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-30 transition shadow-md shadow-cyan-500/20"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

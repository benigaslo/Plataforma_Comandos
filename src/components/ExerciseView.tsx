import React, { useState } from 'react';
import { Exercise } from '../types';
import { sounds } from '../lib/sound';
import {
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  Info,
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

  // Difficulty badge styling
  const diffBadge = {
    fácil: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
    medio: 'bg-amber-950/80 text-amber-400 border-amber-800/80',
    avanzado: 'bg-rose-950/80 text-rose-400 border-rose-800/80',
  }[exercise.difficulty];

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        {/* Header tags: Module, Difficulty, XP reward, Completion status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold">
              {exercise.module}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffBadge}`}
            >
              {exercise.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+{exercise.xpReward} XP</span>
            </div>

            {isCompleted && (
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Superado</span>
              </div>
            )}
          </div>
        </div>

        {/* Exercise Title */}
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>{exercise.title}</span>
        </h2>

        {/* Mission Box */}
        <div className="bg-gray-950/80 border border-gray-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-emerald-400 tracking-wide">
            <Target className="w-4 h-4" />
            <span>Misión a cumplir</span>
          </div>
          <p className="text-sm sm:text-base font-medium text-gray-200 leading-relaxed">
            {exercise.mission}
          </p>
        </div>

        {/* Starting Directory Context if specified */}
        {exercise.startingDir && (
          <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-800/60">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Directorio de partida: <code className="text-gray-200">{exercise.startingDir}</code></span>
          </div>
        )}

        {/* Explanation / Real World Theory */}
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center space-x-1 font-semibold text-gray-300">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Concepto técnico:</span>
          </div>
          <p className="leading-relaxed pl-4 border-l border-gray-800">
            {exercise.explanation}
          </p>
        </div>

        {/* Hint Accordion */}
        <div className="pt-1">
          {!showHint ? (
            <button
              onClick={() => {
                sounds.playKey();
                setShowHint(true);
              }}
              className="flex items-center space-x-1.5 text-xs text-amber-400/90 hover:text-amber-300 font-medium transition py-1"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>¿Necesitas una pista? (Clic aquí)</span>
            </button>
          ) : (
            <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Pista:
                </span>
                <button
                  onClick={() => setShowHint(false)}
                  className="text-[10px] text-gray-400 hover:text-gray-200 underline"
                >
                  Ocultar
                </button>
              </div>
              <p className="text-gray-300 font-mono pl-5">{exercise.hint}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons: Previous / Next */}
      <div className="flex items-center justify-between border-t border-gray-800/80 pt-3">
        <button
          onClick={() => {
            sounds.playKey();
            setShowHint(false);
            onPrev();
          }}
          disabled={!hasPrev}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-gray-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="text-xs text-gray-500 font-mono">
          ID: {exercise.id}
        </span>

        <button
          onClick={() => {
            sounds.playKey();
            setShowHint(false);
            onNext();
          }}
          disabled={!hasNext}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 transition shadow-sm"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

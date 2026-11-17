import React from 'react';
import { Exercise, ExerciseModule, OperatingSystem, ThemeMode } from '../types';
import { sounds } from '../lib/sound';
import { CheckCircle2, Circle, Layers } from 'lucide-react';

interface ExerciseListProps {
  os: OperatingSystem;
  modules: ExerciseModule[];
  activeExercise: Exercise;
  completedIds: string[];
  onSelectExercise: (ex: Exercise) => void;
  theme: ThemeMode;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  os,
  modules,
  activeExercise,
  completedIds,
  onSelectExercise,
  theme,
}) => {
  const filteredModules = modules.filter((m) => m.os === os);
  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  return (
    <div
      className={`border-2 rounded-3xl p-4 flex flex-col space-y-3 h-full overflow-hidden shadow-xl transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200'
          : isMatrix
          ? 'bg-gradient-to-b from-[#020b04] via-[#051408] to-[#020b04] border-[#00ff66]/30 shadow-[#00ff66]/10 text-[#d4ffe0]'
          : 'bg-gradient-to-b from-gray-950 via-[#0a0e1a] to-gray-950 border-cyan-500/30 shadow-cyan-950/20 text-gray-100'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-gray-800'}`}>
        <h3
          className={`text-xs font-black flex items-center space-x-2 font-mono uppercase tracking-wider ${
            isLight ? 'text-slate-900' : isMatrix ? 'text-[#00ff66]' : 'text-cyan-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Módulos de {os === 'linux' ? 'Linux' : 'Windows'}</span>
        </h3>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
            isLight
              ? 'bg-slate-100 text-slate-700 border border-slate-300'
              : isMatrix
              ? 'bg-[#003311] text-[#00ff66] border border-[#00ff66]/50'
              : 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
          }`}
        >
          {completedIds.filter((id) => id.startsWith(os === 'linux' ? 'linux' : 'win') || id.startsWith(os === 'linux' ? 'custom-linux' : 'custom-win')).length} hechos
        </span>
      </div>

      {/* Module Tree */}
      <div
        className={`flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin ${
          isLight ? 'scrollbar-thumb-slate-300' : isMatrix ? 'scrollbar-thumb-emerald-950' : 'scrollbar-thumb-cyan-950'
        }`}
      >
        {filteredModules.map((module) => {
          const modCompleted = module.exercises.filter((e) => completedIds.includes(e.id)).length;
          const totalInMod = module.exercises.length;
          const isModFinished = totalInMod > 0 && modCompleted === totalInMod;
          const progressPercent = Math.round((modCompleted / totalInMod) * 100);

          return (
            <div
              key={module.id}
              className={`space-y-1.5 p-3 rounded-2xl border transition ${
                isLight
                  ? 'bg-slate-50/80 border-slate-200 text-slate-800'
                  : 'bg-gray-900/40 border-gray-800/70 text-gray-200'
              }`}
            >
              {/* Module Header */}
              <div className="flex items-center justify-between text-xs font-bold px-1">
                <span className="truncate max-w-[200px]" title={module.name}>
                  {module.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isModFinished
                      ? isLight
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : isLight
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {modCompleted}/{totalInMod}
                </span>
              </div>

              {/* Progress mini-bar */}
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-gray-800'}`}>
                <div
                  className={`h-full transition-all duration-300 ${
                    isLight ? 'bg-emerald-500' : isMatrix ? 'bg-[#00ff66]' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Module Exercises */}
              <div className="space-y-1 pt-1">
                {module.exercises.map((ex) => {
                  const isCompleted = completedIds.includes(ex.id);
                  const isCurrent = ex.id === activeExercise.id;

                  return (
                    <button
                      key={ex.id}
                      onClick={() => {
                        sounds.playKey();
                        onSelectExercise(ex);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition group ${
                        isCurrent
                          ? isLight
                            ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 font-bold shadow-sm'
                            : isMatrix
                            ? 'bg-[#003311] text-[#00ff66] border-2 border-[#00ff66] font-bold shadow-md shadow-[#00ff66]/20'
                            : 'bg-gradient-to-r from-cyan-950/90 to-blue-950/80 text-cyan-200 border-2 border-cyan-400/80 shadow-md font-bold'
                          : isLight
                          ? 'hover:bg-slate-200/60 text-slate-700 border border-transparent'
                          : 'hover:bg-gray-800/60 text-gray-400 hover:text-gray-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        {isCompleted ? (
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isLight ? 'text-emerald-600' : isMatrix ? 'text-[#00ff66]' : 'text-emerald-400'
                            }`}
                          />
                        ) : (
                          <Circle
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isLight ? 'text-slate-400' : 'text-gray-600 group-hover:text-cyan-400'
                            }`}
                          />
                        )}
                        <span className="truncate">{ex.title}</span>
                      </div>

                      <span
                        className={`text-[10px] font-mono shrink-0 font-bold ${
                          isLight ? 'text-emerald-700' : isMatrix ? 'text-[#00ff66]' : 'text-cyan-400/80'
                        }`}
                      >
                        +{ex.xpReward}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Exercise, ExerciseModule, OperatingSystem } from '../types';
import { sounds } from '../lib/sound';
import { CheckCircle2, Circle, Layers } from 'lucide-react';

interface ExerciseListProps {
  os: OperatingSystem;
  modules: ExerciseModule[];
  activeExercise: Exercise;
  completedIds: string[];
  onSelectExercise: (ex: Exercise) => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  os,
  modules,
  activeExercise,
  completedIds,
  onSelectExercise,
}) => {
  const filteredModules = modules.filter((m) => m.os === os);

  return (
    <div className="bg-gradient-to-b from-gray-950 via-[#0a0e1a] to-gray-950 border-2 border-cyan-500/30 rounded-3xl p-4 flex flex-col space-y-3 h-full overflow-hidden shadow-xl shadow-cyan-950/20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <h3 className="text-xs font-black text-cyan-300 flex items-center space-x-2 font-mono uppercase tracking-wider">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Módulos de {os === 'linux' ? 'Linux' : 'Windows'}</span>
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/80 text-cyan-300 font-bold">
          {completedIds.filter((id) => id.startsWith(os === 'linux' ? 'linux' : 'win')).length} hechos
        </span>
      </div>

      {/* Module Tree */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-cyan-950">
        {filteredModules.map((module) => {
          const modCompleted = module.exercises.filter((e) => completedIds.includes(e.id)).length;
          const totalInMod = module.exercises.length;
          const isModFinished = totalInMod > 0 && modCompleted === totalInMod;
          const progressPercent = Math.round((modCompleted / totalInMod) * 100);

          return (
            <div key={module.id} className="space-y-1.5 bg-gray-900/40 p-2.5 rounded-2xl border border-gray-800/70">
              {/* Module Header */}
              <div className="flex items-center justify-between text-xs font-bold text-gray-200 px-1">
                <span className="truncate max-w-[200px]" title={module.name}>
                  {module.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isModFinished
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {modCompleted}/{totalInMod}
                </span>
              </div>

              {/* Progress mini-bar */}
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
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
                          ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/80 text-cyan-200 border-2 border-cyan-400/80 shadow-md shadow-cyan-500/10 font-bold'
                          : 'hover:bg-gray-800/60 text-gray-400 hover:text-gray-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-gray-600 shrink-0 group-hover:text-cyan-400" />
                        )}
                        <span className="truncate">{ex.title}</span>
                      </div>

                      <span className="text-[10px] font-mono text-cyan-400/80 shrink-0 font-bold">
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

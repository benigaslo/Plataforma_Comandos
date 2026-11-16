import React from 'react';
import { Exercise, ExerciseModule, OperatingSystem } from '../types';
import { sounds } from '../lib/sound';
import { CheckCircle2, Circle } from 'lucide-react';

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
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 flex flex-col space-y-3 h-full overflow-hidden">
      <div className="flex items-center justify-between pb-2 border-b border-gray-800">
        <h3 className="text-sm font-bold text-gray-200 flex items-center space-x-2">
          <span>{os === 'linux' ? '🐧' : '🪟'}</span>
          <span>Módulos de {os === 'linux' ? 'Linux' : 'Windows'}</span>
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
          {completedIds.filter((id) => id.startsWith(os === 'linux' ? 'linux' : 'win')).length} hechos
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-700">
        {filteredModules.map((module) => {
          const modCompleted = module.exercises.filter((e) => completedIds.includes(e.id)).length;
          const totalInMod = module.exercises.length;
          const isModFinished = totalInMod > 0 && modCompleted === totalInMod;

          return (
            <div key={module.id} className="space-y-1.5">
              {/* Module Header */}
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300 px-1">
                <span className="truncate max-w-[200px]" title={module.name}>
                  {module.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isModFinished
                      ? 'bg-emerald-950 text-emerald-400'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {modCompleted}/{totalInMod}
                </span>
              </div>

              {/* Module Exercises */}
              <div className="space-y-1 pl-1">
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
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                          : 'hover:bg-gray-800/80 text-gray-400 hover:text-gray-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-gray-600 shrink-0 group-hover:text-gray-400" />
                        )}
                        <span className="truncate font-medium">{ex.title}</span>
                      </div>

                      <span className="text-[10px] font-mono text-gray-500 shrink-0">
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

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../lib/sound';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getRankForXp } from '../data/badges';
import { ThemeMode } from '../types';

interface LevelUpModalProps {
  newLevel: number;
  newXp: number;
  onClose: () => void;
  theme?: ThemeMode;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  newXp,
  onClose,
  theme = 'matrix',
}) => {
  const rank = getRankForXp(newXp);
  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  useEffect(() => {
    sounds.playLevelUp();
    // Confetti burst
    const end = Date.now() + 1500;
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95">
      <div
        className={`rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden transition-colors border-2 ${
          isLight
            ? 'bg-white border-amber-400 shadow-amber-300/40 text-slate-800'
            : isMatrix
            ? 'bg-gradient-to-b from-[#020b04] via-[#041307] to-[#020b04] border-[#00ff66]/60 shadow-[#00ff66]/20 text-[#d4ffe0]'
            : 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-amber-500/60 shadow-amber-500/20 text-white'
        }`}
      >
        {/* Glow accent */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 blur-3xl rounded-full pointer-events-none ${
            isLight
              ? 'bg-amber-300/30'
              : isMatrix
              ? 'bg-[#00ff66]/20'
              : 'bg-amber-500/20'
          }`}
        />

        <div
          className={`w-20 h-20 mx-auto rounded-3xl border-2 flex items-center justify-center text-4xl shadow-lg ${
            isLight
              ? 'bg-amber-100 border-amber-400 shadow-amber-300/30'
              : isMatrix
              ? 'bg-[#003311] border-[#00ff66]/60 shadow-[#00ff66]/30'
              : 'bg-amber-500/20 border-amber-500/50 shadow-amber-500/30'
          }`}
        >
          🏆
        </div>

        <div className="space-y-2">
          <div
            className={`text-xs uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-1.5 ${
              isLight ? 'text-amber-600' : isMatrix ? 'text-[#00ff66]' : 'text-amber-400'
            }`}
          >
            <Sparkles className="w-4 h-4" /> ¡Ascenso de Nivel Conseguido!
          </div>
          <h2
            className={`text-3xl font-black tracking-tight ${
              isLight ? 'text-slate-900' : isMatrix ? 'text-[#00ff66]' : 'text-white'
            }`}
          >
            Nivel {newLevel}
          </h2>
          <div
            className={`text-base font-semibold ${
              isMatrix ? 'text-[#00ff66]' : 'text-emerald-500'
            }`}
          >
            Rango: {rank.title}
          </div>
          <p
            className={`text-xs max-w-xs mx-auto pt-1 ${
              isLight ? 'text-slate-600' : isMatrix ? 'text-[#80e5a3]' : 'text-gray-400'
            }`}
          >
            Has demostrado gran soltura con los comandos. ¡Continúa resolviendo retos para alcanzar el rango de SysAdmin Master!
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playKey();
            onClose();
          }}
          className={`w-full py-3 font-extrabold rounded-2xl text-sm flex items-center justify-center space-x-2 transition shadow-lg ${
            isMatrix
              ? 'bg-[#00ff66] hover:bg-[#33ff88] text-black shadow-[#00ff66]/30'
              : 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black shadow-emerald-500/25'
          }`}
        >
          <span>Continuar Desafío</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

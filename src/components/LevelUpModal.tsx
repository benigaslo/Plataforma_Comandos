import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../lib/sound';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getRankForXp } from '../data/badges';

interface LevelUpModalProps {
  newLevel: number;
  newXp: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, newXp, onClose }) => {
  const rank = getRankForXp(newXp);

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
      <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-2 border-amber-500/60 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl shadow-amber-500/20 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30">
          🏆
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> ¡Ascenso de Nivel Conseguido!
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Nivel {newLevel}
          </h2>
          <div className="text-base font-semibold text-emerald-400">
            Rango: {rank.title}
          </div>
          <p className="text-xs text-gray-400 max-w-xs mx-auto pt-1">
            Has demostrado gran soltura con los comandos. ¡Continúa resolviendo retos para alcanzar el rango de SysAdmin Master!
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playKey();
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-extrabold rounded-2xl text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/25"
        >
          <span>Continuar Desafío</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

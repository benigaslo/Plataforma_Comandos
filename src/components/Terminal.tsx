import React, { useState, useEffect, useRef } from 'react';
import { OperatingSystem, TerminalLine, Exercise, ThemeMode } from '../types';
import { TerminalSimulator } from '../lib/terminalSimulator';
import { sounds } from '../lib/sound';
import {
  Send,
  Trash2,
  HelpCircle,
  Terminal as TerminalIcon,
  ShieldCheck,
  Tv,
} from 'lucide-react';

interface TerminalProps {
  os: OperatingSystem;
  activeExercise?: Exercise;
  onCommandSuccess: (command: string, xpEarned: number) => void;
  onCommandAttempt?: (command: string, isCorrect: boolean) => void;
  crtMode: boolean;
  onToggleCrt: () => void;
  theme: ThemeMode;
}

export const TerminalComponent: React.FC<TerminalProps> = ({
  os,
  activeExercise,
  onCommandSuccess,
  onCommandAttempt,
  crtMode,
  onToggleCrt,
  theme,
}) => {
  const [simulator] = useState(() => new TerminalSimulator(os, activeExercise?.startingDir));
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  useEffect(() => {
    simulator.setOS(os, activeExercise?.startingDir);
    const banner =
      os === 'linux'
        ? [
            {
              id: 'init-1',
              type: 'system' as const,
              content: 'GNU Bash v5.2 // IES Benigaslo Sandbox [CONECTADO]',
            },
            {
              id: 'init-2',
              type: 'system' as const,
              content: 'Escribe los comandos del reto y presiona [ENTER]. Prueba escribir "matrix" o "help".',
            },
          ]
        : [
            {
              id: 'init-1',
              type: 'system' as const,
              content: 'Windows PowerShell [Versión 10.0.22631.4317] - DAM-STATION',
            },
            {
              id: 'init-2',
              type: 'system' as const,
              content: 'Escribe los comandos en la consola y presiona [ENTER]. Prueba "help" o "cls".',
            },
          ];
    setLines(banner);
  }, [os, activeExercise, simulator]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    sounds.playKey();

    const userLine: TerminalLine = {
      id: Math.random().toString(),
      type: 'input',
      content: cmd,
      prompt: simulator.getPrompt(),
    };

    const result = simulator.execute(cmd, activeExercise);

    if (result.outputLines.some((l) => l.content === '__CLEAR__')) {
      setLines([]);
    } else {
      setLines((prev) => [...prev, userLine, ...result.outputLines]);
    }

    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputVal('');

    if (result.isCorrect) {
      sounds.playSuccess();
      onCommandSuccess(cmd, result.earnedXp || 50);
      onCommandAttempt?.(cmd, true);
    } else {
      if (cmd.toLowerCase() !== 'clear' && cmd.toLowerCase() !== 'cls') {
        sounds.playError();
        onCommandAttempt?.(cmd, false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    }
  };

  const clearScreen = () => {
    sounds.playKey();
    setLines([]);
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`flex flex-col h-full rounded-3xl border-2 shadow-2xl overflow-hidden font-mono relative transition-colors ${
        crtMode
          ? 'crt-mode bg-[#021307] border-[#00ff66]/70 shadow-[#00ff66]/20'
          : isLight
          ? 'bg-[#0f172a] border-slate-300 shadow-slate-300/50'
          : isMatrix
          ? 'bg-[#030d05] border-[#00ff66]/30 shadow-[#00ff66]/10'
          : 'bg-[#080d1a] border-cyan-500/30 shadow-cyan-950/40'
      }`}
    >
      {/* Top Cyber Bar */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b select-none ${
          crtMode
            ? 'bg-[#031c0a] border-[#00ff66]/40 text-[#00ff66]'
            : isLight
            ? 'bg-slate-800 border-slate-700 text-slate-200'
            : isMatrix
            ? 'bg-[#020b04] border-[#00ff66]/30 text-[#00ff66]'
            : 'bg-gray-950/90 border-cyan-500/20 text-cyan-300'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm"></span>
          </div>

          <div className="flex items-center space-x-1.5 ml-2 text-xs font-bold">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>
              {os === 'linux' ? 'bash // usuario@ies-benigaslo' : 'powershell // sysadmin@benigaslo'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* CRT Monitor Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playKey();
              onToggleCrt();
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition border ${
              crtMode
                ? 'bg-[#00ff66] text-black border-[#00ff66] font-black'
                : isLight
                ? 'bg-slate-700 text-slate-200 hover:text-white border-slate-600'
                : 'bg-gray-800 text-gray-300 hover:text-white border-gray-700'
            }`}
            title="Activar / Desactivar Modo Monitor CRT Matrix"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{crtMode ? 'CRT MATRIX ON' : 'Modo CRT'}</span>
          </button>

          <span className="hidden sm:flex text-[10px] text-emerald-400 font-mono items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> ONLINE
          </span>

          <button
            onClick={clearScreen}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] transition ${
              isLight ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800/80'
            }`}
            title="Limpiar terminal"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        className={`flex-1 p-4 overflow-y-auto space-y-2 text-xs sm:text-sm leading-relaxed scrollbar-thin ${
          crtMode ? 'text-[#00ff66] scrollbar-thumb-emerald-900' : 'text-gray-200 scrollbar-thumb-slate-700'
        }`}
      >
        {lines.map((line) => (
          <div key={line.id}>
            {line.type === 'input' && (
              <div className="flex flex-wrap items-baseline gap-1">
                <span
                  className={
                    crtMode
                      ? 'text-[#00ff66] font-black'
                      : os === 'linux'
                      ? 'text-emerald-400 font-black'
                      : 'text-cyan-400 font-black'
                  }
                >
                  {line.prompt}
                </span>
                <span className="text-white font-bold">{line.content}</span>
              </div>
            )}
            {line.type === 'output' && (
              <pre
                className={`whitespace-pre-wrap font-mono pl-3 border-l-2 ${
                  crtMode ? 'text-[#33ff88] border-[#00ff66]/50' : 'text-gray-300 border-gray-750'
                }`}
              >
                {line.content}
              </pre>
            )}
            {line.type === 'error' && (
              <div
                className={`font-mono pl-3 border-l-2 py-1.5 rounded-r ${
                  crtMode
                    ? 'text-red-400 border-red-500 bg-red-950/40'
                    : 'text-rose-400 border-rose-500 bg-rose-950/40'
                }`}
              >
                {line.content}
              </div>
            )}
            {line.type === 'success' && (
              <div
                className={`font-mono pl-3 border-l-2 py-2 rounded-r font-black flex items-center gap-1.5 ${
                  crtMode
                    ? 'text-[#00ff66] border-[#00ff66] bg-[#00ff66]/10 animate-pulse'
                    : 'text-emerald-300 border-emerald-400 bg-emerald-950/40'
                }`}
              >
                {line.content}
              </div>
            )}
            {line.type === 'system' && (
              <div className={`italic text-[11px] ${crtMode ? 'text-[#009944]' : 'text-gray-400'}`}>
                # {line.content}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Bar */}
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 p-3 border-t ${
          crtMode
            ? 'bg-[#031c0a] border-[#00ff66]/30'
            : isLight
            ? 'bg-slate-950 border-slate-800'
            : 'bg-gray-950/90 border-cyan-500/20'
        }`}
      >
        <span
          className={`text-xs font-black font-mono select-none ${
            crtMode
              ? 'text-[#00ff66]'
              : os === 'linux'
              ? 'text-emerald-400'
              : 'text-cyan-400'
          }`}
        >
          {simulator.getPrompt()}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe el comando del reto aquí..."
          className={`flex-1 bg-transparent outline-none font-mono text-xs sm:text-sm font-bold ${
            crtMode
              ? 'text-[#00ff66] placeholder-[#007733] caret-[#00ff66]'
              : 'text-white placeholder-gray-500 caret-cyan-400'
          }`}
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className={`px-3.5 py-1.5 disabled:opacity-30 font-black rounded-xl text-xs flex items-center space-x-1 transition shadow-md ${
            crtMode
              ? 'bg-[#00ff66] hover:bg-[#33ff88] text-black shadow-[#00ff66]/30'
              : 'bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black shadow-cyan-500/20'
          }`}
        >
          <span>Ejecutar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick helper tip */}
      <div
        className={`px-4 py-1.5 border-t flex items-center justify-between text-[11px] ${
          crtMode
            ? 'bg-[#010e05] border-[#00ff66]/20 text-[#00aa44]'
            : isLight
            ? 'bg-slate-900 border-slate-800 text-slate-400'
            : 'bg-[#050912] border-gray-900 text-gray-500'
        }`}
      >
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-cyan-400" />
          Tip: Usa las flechas ↑ ↓ para recuperar comandos anteriores
        </span>
        <span className="font-mono font-bold">{crtMode ? 'PHOSPHOR GREEN CRT' : 'CYBER-SANDBOX v3'}</span>
      </div>
    </div>
  );
};

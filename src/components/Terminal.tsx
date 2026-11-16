import React, { useState, useEffect, useRef } from 'react';
import { OperatingSystem, TerminalLine, Exercise } from '../types';
import { TerminalSimulator } from '../lib/terminalSimulator';
import { sounds } from '../lib/sound';
import { Send, Trash2, HelpCircle, Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';

interface TerminalProps {
  os: OperatingSystem;
  activeExercise?: Exercise;
  onCommandSuccess: (command: string, xpEarned: number) => void;
  onCommandAttempt?: (command: string, isCorrect: boolean) => void;
}

export const TerminalComponent: React.FC<TerminalProps> = ({
  os,
  activeExercise,
  onCommandSuccess,
  onCommandAttempt,
}) => {
  const [simulator] = useState(() => new TerminalSimulator(os, activeExercise?.startingDir));
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    simulator.setOS(os, activeExercise?.startingDir);
    const banner =
      os === 'linux'
        ? [
            {
              id: 'init-1',
              type: 'system' as const,
              content: 'GNU Bash v5.2 (x86_64-pc-linux-gnu) • IES Benigaslo Sandbox',
            },
            {
              id: 'init-2',
              type: 'system' as const,
              content: 'Escribe los comandos solicitados y presiona [ENTER]. Usa "help" o "clear".',
            },
          ]
        : [
            {
              id: 'init-1',
              type: 'system' as const,
              content: 'Windows PowerShell [Versión 10.0.22631.4317] - IES Benigaslo Sandbox',
            },
            {
              id: 'init-2',
              type: 'system' as const,
              content: 'Escribe los comandos en la consola y presiona [ENTER]. Usa "help" o "cls".',
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
      className="flex flex-col h-full bg-[#080d1a] rounded-3xl border-2 border-cyan-500/30 shadow-2xl shadow-cyan-950/40 overflow-hidden font-mono relative"
    >
      {/* Top Cyber Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-950/90 border-b border-cyan-500/20 select-none">
        <div className="flex items-center space-x-2">
          {/* Neon Dots */}
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50"></span>
          </div>

          <div className="flex items-center space-x-1.5 ml-2 text-xs text-cyan-300 font-semibold">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {os === 'linux' ? 'bash // netrunner@benigaslo' : 'powershell // sysadmin@benigaslo'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> SANDBOX ONLINE
          </span>
          <button
            onClick={clearScreen}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] text-gray-400 hover:text-cyan-300 hover:bg-gray-800/80 transition"
            title="Limpiar terminal"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs sm:text-sm leading-relaxed scrollbar-thin scrollbar-thumb-cyan-950">
        {lines.map((line) => (
          <div key={line.id}>
            {line.type === 'input' && (
              <div className="flex flex-wrap items-baseline gap-1 text-gray-200">
                <span className={os === 'linux' ? 'text-emerald-400 font-black' : 'text-cyan-400 font-black'}>
                  {line.prompt}
                </span>
                <span className="text-white font-bold">{line.content}</span>
              </div>
            )}
            {line.type === 'output' && (
              <pre className="text-gray-300 whitespace-pre-wrap font-mono pl-3 border-l-2 border-gray-800">
                {line.content}
              </pre>
            )}
            {line.type === 'error' && (
              <div className="text-rose-400 font-mono pl-3 border-l-2 border-rose-500 bg-rose-950/30 py-1.5 rounded-r">
                {line.content}
              </div>
            )}
            {line.type === 'success' && (
              <div className="text-emerald-300 font-mono pl-3 border-l-2 border-emerald-400 bg-emerald-950/40 py-2 rounded-r font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/10">
                {line.content}
              </div>
            )}
            {line.type === 'system' && (
              <div className="text-gray-500 italic text-[11px]">
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
        className="flex items-center gap-2 p-3 bg-gray-950/80 border-t border-cyan-500/20"
      >
        <span
          className={`text-xs font-black font-mono select-none ${
            os === 'linux' ? 'text-emerald-400' : 'text-cyan-400'
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
          className="flex-1 bg-transparent text-gray-100 outline-none font-mono text-xs sm:text-sm placeholder-gray-600 caret-cyan-400 font-semibold"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-30 text-black font-black rounded-xl text-xs flex items-center space-x-1 transition shadow-md shadow-cyan-500/20"
        >
          <span>Ejecutar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick helper tip */}
      <div className="px-4 py-1.5 bg-[#050912] border-t border-gray-900 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-cyan-500" />
          Tip: Usa las flechas ↑ ↓ para recuperar comandos anteriores
        </span>
        <span className="text-cyan-400 font-mono font-bold">CYBER-PROMPT v2</span>
      </div>
    </div>
  );
};

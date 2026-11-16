import React, { useState, useEffect, useRef } from 'react';
import { OperatingSystem, TerminalLine, Exercise } from '../types';
import { TerminalSimulator } from '../lib/terminalSimulator';
import { sounds } from '../lib/sound';
import { Send, Trash2, HelpCircle, Terminal as TerminalIcon } from 'lucide-react';

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

  // Sync simulator whenever OS or activeExercise changes
  useEffect(() => {
    simulator.setOS(os, activeExercise?.startingDir);
    // Reset terminal banner for new challenge
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

    // Add user input line to view
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

    // History tracking
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
      className="flex flex-col h-full bg-[#0d1117] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden font-mono"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900/90 border-b border-gray-800 select-none">
        <div className="flex items-center space-x-2">
          {/* OS-styled Window Dots */}
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          <div className="flex items-center space-x-1.5 ml-2 text-xs text-gray-400 font-medium">
            <TerminalIcon className="w-3.5 h-3.5 text-gray-400" />
            <span>
              {os === 'linux' ? 'bash - usuario@ies-benigaslo' : 'Windows PowerShell (Administrator)'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={clearScreen}
            className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition"
            title="Limpiar terminal"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs sm:text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-700">
        {lines.map((line) => (
          <div key={line.id}>
            {line.type === 'input' && (
              <div className="flex flex-wrap items-baseline gap-1 text-gray-300">
                <span className={os === 'linux' ? 'text-emerald-400 font-bold' : 'text-blue-400 font-bold'}>
                  {line.prompt}
                </span>
                <span className="text-white font-semibold">{line.content}</span>
              </div>
            )}
            {line.type === 'output' && (
              <pre className="text-gray-300 whitespace-pre-wrap font-mono pl-2 border-l border-gray-800/80">
                {line.content}
              </pre>
            )}
            {line.type === 'error' && (
              <div className="text-rose-400 font-mono pl-2 border-l-2 border-rose-500 bg-rose-950/20 py-1 rounded-r">
                {line.content}
              </div>
            )}
            {line.type === 'success' && (
              <div className="text-emerald-300 font-mono pl-2 border-l-2 border-emerald-400 bg-emerald-950/30 py-1.5 rounded-r font-bold flex items-center gap-1.5 animate-pulse">
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
        className="flex items-center gap-2 p-3 bg-gray-900/60 border-t border-gray-800"
      >
        <span
          className={`text-xs font-bold font-mono select-none ${
            os === 'linux' ? 'text-emerald-400' : 'text-blue-400'
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
          placeholder="Escribe tu comando aquí..."
          className="flex-1 bg-transparent text-gray-100 outline-none font-mono text-xs sm:text-sm placeholder-gray-600 caret-emerald-400"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-black font-bold rounded-lg text-xs flex items-center space-x-1 transition shadow-sm"
        >
          <span>Ejecutar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick helper tip */}
      <div className="px-4 py-1.5 bg-gray-950/90 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-gray-400" />
          Tip: Usa las flechas ↑ ↓ para recuperar comandos anteriores
        </span>
        <span>Simulador IES Benigaslo</span>
      </div>
    </div>
  );
};

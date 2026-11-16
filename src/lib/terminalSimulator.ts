import { Exercise, OperatingSystem, TerminalLine } from '../types';

export interface CommandExecutionResult {
  isCorrect: boolean;
  outputLines: TerminalLine[];
  feedback?: string;
  earnedXp?: number;
}

export class TerminalSimulator {
  private os: OperatingSystem;
  private currentDir: string;
  private history: string[] = [];

  constructor(os: OperatingSystem, startingDir?: string) {
    this.os = os;
    this.currentDir = startingDir || (os === 'linux' ? '/home/usuario' : 'C:\\Users\\Alumno');
  }

  public setOS(os: OperatingSystem, defaultDir?: string) {
    this.os = os;
    if (defaultDir) {
      this.currentDir = defaultDir;
    } else {
      this.currentDir = os === 'linux' ? '/home/usuario' : 'C:\\Users\\Alumno';
    }
  }

  public setDir(dir: string) {
    this.currentDir = dir;
  }

  public getPrompt(): string {
    if (this.os === 'linux') {
      const displayPath = this.currentDir === '/home/usuario' ? '~' : this.currentDir;
      return `usuario@ies-benigaslo:${displayPath}$ `;
    } else {
      return `PS ${this.currentDir}> `;
    }
  }

  public execute(rawCommand: string, activeExercise?: Exercise): CommandExecutionResult {
    const trimmed = rawCommand.trim();
    if (!trimmed) {
      return {
        isCorrect: false,
        outputLines: [],
      };
    }

    this.history.push(trimmed);

    // 1. Check for universal / OS built-in commands (like clear, cls, whoami, etc.)
    const lower = trimmed.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      return {
        isCorrect: false,
        outputLines: [{ id: Math.random().toString(), type: 'system', content: '__CLEAR__' }],
      };
    }

    // 2. If an exercise is active, check validation first
    if (activeExercise) {
      const isMatch = activeExercise.validCommandPatterns.some((pattern) => {
        if (typeof pattern === 'string') {
          return this.os === 'windows'
            ? trimmed.toLowerCase() === pattern.toLowerCase()
            : trimmed === pattern;
        } else if (pattern instanceof RegExp) {
          return pattern.test(trimmed);
        }
        return false;
      });

      if (isMatch) {
        // Exercise solved!
        const lines: TerminalLine[] = [];
        const outputs = activeExercise.simulatedOutput.split('\n');
        outputs.forEach((out) => {
          lines.push({
            id: Math.random().toString(),
            type: 'output',
            content: out,
          });
        });

        // Add success celebratory line
        lines.push({
          id: Math.random().toString(),
          type: 'success',
          content: `✔ ¡CORRECTO! Reto completado. +${activeExercise.xpReward} XP ganados.`,
        });

        return {
          isCorrect: true,
          outputLines: lines,
          feedback: '¡Excelente comando! Objetivo cumplido con éxito.',
          earnedXp: activeExercise.xpReward,
        };
      }
    }

    // 3. Fallback: simulate realistic general shell behavior
    const simLines = this.generateSimulatedOutput(trimmed);

    return {
      isCorrect: false,
      outputLines: simLines,
      feedback: activeExercise
        ? 'El comando se ha ejecutado, pero no cumple con la misión solicitada en este ejercicio. Revisa las pistas si lo necesitas.'
        : undefined,
    };
  }

  private generateSimulatedOutput(cmd: string): TerminalLine[] {
    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();
    const lines: TerminalLine[] = [];

    const addLine = (content: string, type: 'output' | 'error' | 'system' = 'output') => {
      lines.push({ id: Math.random().toString(), type, content });
    };

    if (this.os === 'linux') {
      switch (base) {
        case 'ls':
          if (cmd.includes('-la') || cmd.includes('-al')) {
            addLine('total 24');
            addLine('drwxr-xr-x 4 usuario usuario 4096 nov 16 12:00 .');
            addLine('drwxr-xr-x 3 root    root    4096 nov 16 10:00 ..');
            addLine('-rw------- 1 usuario usuario  852 nov 16 11:30 .bash_history');
            addLine('-rw-r--r-- 1 usuario usuario  220 nov 16 10:00 .bash_logout');
            addLine('-rw-r--r-- 1 usuario usuario 3771 nov 16 10:00 .bashrc');
            addLine('drwxr-xr-x 2 usuario usuario 4096 nov 16 11:45 Documentos');
            addLine('drwxr-xr-x 2 usuario usuario 4096 nov 16 11:45 Descargas');
            addLine('-rw-r--r-- 1 usuario usuario    0 nov 16 12:01 arch_tam0');
          } else {
            addLine('Documentos  Descargas  Música  Imágenes  Vídeos  arch_tam0');
          }
          break;
        case 'pwd':
          addLine(this.currentDir);
          break;
        case 'whoami':
          addLine('usuario');
          break;
        case 'id':
          addLine('uid=1000(usuario) gid=1000(usuario) grupos=1000(usuario),4(adm),24(cdrom),27(sudo)');
          break;
        case 'date':
          addLine(new Date().toString());
          break;
        case 'uname':
          addLine('Linux ies-benigaslo 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux');
          break;
        case 'help':
          addLine('Simulador Bash Educativo IES Benigaslo v1.0');
          addLine('Comandos disponibles: ls, cd, pwd, touch, mkdir, cp, mv, rm, chmod, grep, wc, clear, date, whoami');
          break;
        case 'cd':
          addLine('(Cambio de directorio simulado)');
          break;
        default:
          addLine(`bash: ${parts[0]}: no se encontró la orden. ¿Revisaste la sintaxis?`, 'error');
          break;
      }
    } else {
      // Windows
      switch (base) {
        case 'dir':
          addLine(` El volumen de la unidad C no tiene etiqueta.`);
          addLine(` El número de serie del volumen es: 84B2-79A1\n`);
          addLine(` Directorio de ${this.currentDir}\n`);
          addLine(`16/11/2026  12:00    <DIR>          .`);
          addLine(`16/11/2026  12:00    <DIR>          ..`);
          addLine(`16/11/2026  11:40    <DIR>          Documentos`);
          addLine(`16/11/2026  11:40    <DIR>          Descargas`);
          addLine(`16/11/2026  11:40    <DIR>          Desktop`);
          addLine(`16/11/2026  12:05                 0 resumen.txt`);
          addLine(`               1 archivos              0 bytes`);
          addLine(`               5 dirs   45.210.849.280 bytes libres`);
          break;
        case 'cd':
          addLine('(Navegación de ruta simulada en Windows)');
          break;
        case 'whoami':
          addLine('ies-benigaslo\\alumno');
          break;
        case 'hostname':
          addLine('PC-AULA-DAM01');
          break;
        case 'ver':
          addLine('Microsoft Windows [Versión 10.0.22631.4317]');
          break;
        case 'help':
          addLine('Simulador de Consola Windows (CMD / PowerShell) - IES Benigaslo');
          addLine('Comandos soportados: dir, cd, mkdir, rmdir, type, echo, copy, move, ren, del, cls, whoami');
          break;
        default:
          addLine(`'${parts[0]}' no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.`, 'error');
          break;
      }
    }

    return lines;
  }
}

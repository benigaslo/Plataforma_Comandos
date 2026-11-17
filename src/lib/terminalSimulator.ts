import { Exercise, OperatingSystem, TerminalLine } from '../types';

export interface CommandExecutionResult {
  isCorrect: boolean;
  outputLines: TerminalLine[];
  feedback?: string;
  earnedXp?: number;
  easterEgg?: string;
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
      return `usuario@benigaslo-cyberdeck:${displayPath}$ `;
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
    const lower = trimmed.toLowerCase();

    // 1. Exercise Match Validation (Priority: if the user enters the correct mission command, complete it!)
    if (activeExercise) {
      const isMatch = activeExercise.validCommandPatterns.some((pattern) => {
        if (typeof pattern === 'string') {
          return this.os === 'windows'
            ? trimmed.toLowerCase() === pattern.toLowerCase()
            : trimmed === pattern;
        } else if (pattern instanceof RegExp) {
          if (pattern.test(trimmed)) return true;
          // En Windows, permitir también validar cuando el alumno usa '/' en vez de '\' en las rutas
          if (this.os === 'windows' && trimmed.includes('/')) {
            const normalizedBackslashes = trimmed.replace(/\//g, '\\');
            if (pattern.test(normalizedBackslashes)) return true;
          }
          return false;
        }
        return false;
      });

      if (isMatch) {
        const lines: TerminalLine[] = [];
        const outputs = activeExercise.simulatedOutput.split('\n');
        outputs.forEach((out) => {
          lines.push({
            id: Math.random().toString(),
            type: 'output',
            content: out,
          });
        });

        lines.push({
          id: Math.random().toString(),
          type: 'success',
          content: `✔ PROTOCOLO COMPLETADO. +${activeExercise.xpReward} XP de Cyber-Créditos sumados.`,
        });

        return {
          isCorrect: true,
          outputLines: lines,
          feedback: '¡Excelente comando! Objetivo cumplido con éxito.',
          earnedXp: activeExercise.xpReward,
        };
      }
    }

    // 2. Clear terminal
    if (lower === 'clear' || lower === 'cls') {
      return {
        isCorrect: false,
        outputLines: [{ id: Math.random().toString(), type: 'system', content: '__CLEAR__' }],
      };
    }

    // 3. FUN GEEK / GAMER EASTER EGGS
    if (lower === 'matrix') {
      return {
        isCorrect: false,
        outputLines: [
          { id: Math.random().toString(), type: 'system', content: '[MATRIX OVERRIDE INITIATED...]' },
          { id: Math.random().toString(), type: 'success', content: '01000010 01100101 01101110 01101001 01100111 01100001 01110011 01101100 01101111' },
          { id: Math.random().toString(), type: 'output', content: 'Despierta, Neo... La terminal de DAM te ha elegido. Sigue al pingüino blanco 🐇🐧' },
        ],
        easterEgg: 'matrix',
      };
    }

    if (lower.startsWith('sudo')) {
      return {
        isCorrect: false,
        outputLines: [
          { id: Math.random().toString(), type: 'error', content: '[ACCESO DENEGADO] Intento de escalada de privilegios detectado.' },
          { id: Math.random().toString(), type: 'system', content: 'Este incidente será reportado al profesor Ginés... 😉' },
        ],
      };
    }

    if (lower === 'konami') {
      return {
        isCorrect: false,
        outputLines: [
          { id: Math.random().toString(), type: 'success', content: '🎮 ↑ ↑ ↓ ↓ ← → ← → B A : ¡30 VIDAS EXTRA DESBLOQUEADAS!' },
          { id: Math.random().toString(), type: 'output', content: 'Eres un auténtico gamer de la vieja escuela.' },
        ],
      };
    }

    if (lower === 'hack') {
      return {
        isCorrect: false,
        outputLines: [
          { id: Math.random().toString(), type: 'system', content: 'Inyectando payload en mainframe IES Benigaslo...' },
          { id: Math.random().toString(), type: 'output', content: 'FIREWALL STATUS: [BYPASS 100%] // Acceso nivel Root otorgado.' },
          { id: Math.random().toString(), type: 'success', content: 'Tranquilo, estás en un sandbox seguro.' },
        ],
      };
    }

    // 4. Fallback: simulate realistic general shell behavior
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
            addLine('total 28');
            addLine('drwxr-xr-x 5 usuario usuario 4096 nov 16 12:00 .');
            addLine('drwxr-xr-x 3 root    root    4096 nov 16 10:00 ..');
            addLine('-rw------- 1 usuario usuario  852 nov 16 11:30 .bash_history');
            addLine('-rw-r--r-- 1 usuario usuario  220 nov 16 10:00 .bash_logout');
            addLine('-rw-r--r-- 1 usuario usuario 3771 nov 16 10:00 .bashrc');
            addLine('drwxr-xr-x 2 usuario usuario 4096 nov 16 11:45 Documentos');
            addLine('drwxr-xr-x 2 usuario usuario 4096 nov 16 11:45 Descargas');
            addLine('drwxr-xr-x 2 usuario usuario 4096 nov 16 11:45 PRUEBA');
            addLine('-rw-r--r-- 1 usuario usuario    0 nov 16 12:01 arch_tam0');
          } else {
            addLine('Documentos  Descargas  PRUEBA  Música  Imágenes  Vídeos  arch_tam0');
          }
          break;
        case 'pwd':
          addLine(this.currentDir);
          break;
        case 'whoami':
          addLine('usuario // netrunner level 3');
          break;
        case 'id':
          addLine('uid=1000(usuario) gid=1000(usuario) grupos=1000(usuario),4(adm),24(cdrom),27(sudo)');
          break;
        case 'date':
          addLine(new Date().toString());
          break;
        case 'uname':
          addLine('Linux benigaslo-cyberdeck 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux');
          break;
        case 'df':
          addLine('S.ficheros     Tamaño Usados Disp Uso% Montado en\n/dev/sda1        117G    32G   80G  29% /');
          break;
        case 'help':
          addLine('CYBER-TERMINAL IES BENIGASLO v3.8');
          addLine('Comandos formativos: ls, cd, pwd, touch, mkdir, cp, mv, rm, chmod, grep, wc, find, tar, df, du');
          addLine('Comandos frikis: matrix, sudo, konami, hack');
          break;
        case 'cd':
          addLine('(Navegación simulada en Linux)');
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
          addLine(`16/11/2026  11:40    <DIR>          Desktop`);
          addLine(`16/11/2026  12:05                 0 resumen.txt`);
          addLine(`               1 archivos              0 bytes`);
          addLine(`               4 dirs   45.210.849.280 bytes libres`);
          break;
        case 'tree':
          addLine(`C:\\USERS\\ALUMNO\n├───Desktop\n└───Documentos\n        resumen.txt`);
          break;
        case 'cd':
          addLine('(Navegación de ruta simulada en Windows)');
          break;
        case 'whoami':
          addLine('benigaslo\\alumno');
          break;
        case 'hostname':
          addLine('CYBER-RIG-DAM01');
          break;
        case 'ver':
          addLine('Microsoft Windows [Versión 10.0.22631.4317] - PowerShell 7.4');
          break;
        case 'help':
          addLine('Simulador de Consola Windows (PowerShell / CMD) - IES Benigaslo');
          addLine('Comandos soportados: dir, tree, cd, mkdir, rmdir, attrib, type, findstr, copy, move, ren, del');
          addLine('Comandos frikis: matrix, hack, konami');
          break;
        default:
          addLine(`'${parts[0]}' no se reconoce como un comando interno o externo, programa o script ejecutable.`, 'error');
          break;
      }
    }

    return lines;
  }
}

import { Badge } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first_command',
    title: 'Primer Contacto',
    description: 'Ejecuta tu primer comando con éxito en la plataforma.',
    icon: '⚡',
    category: 'general',
    xpBonus: 50,
    condition: (user) => user.completed_exercises.length >= 1,
  },
  {
    id: 'tux_apprentice',
    title: 'Pingüino Aprendiz',
    description: 'Resuelve tus primeros 3 retos en el entorno Linux.',
    icon: '🐧',
    category: 'linux',
    xpBonus: 100,
    condition: (user) =>
      user.completed_exercises.filter((id) => id.startsWith('linux')).length >= 3,
  },
  {
    id: 'windows_explorer',
    title: 'Explorador de Redmond',
    description: 'Resuelve tus primeros 3 retos en la consola de Windows.',
    icon: '🪟',
    category: 'windows',
    xpBonus: 100,
    condition: (user) =>
      user.completed_exercises.filter((id) => id.startsWith('win')).length >= 3,
  },
  {
    id: 'folder_architect',
    title: 'Arquitecto de Carpetas',
    description: 'Crea estructuras complejas de directorios y subcarpetas.',
    icon: '📁',
    category: 'general',
    xpBonus: 150,
    condition: (user) => {
      const folderEx = ['win-01', 'win-04', 'win-09', 'win-17', 'linux-12'];
      return folderEx.filter((id) => user.completed_exercises.includes(id)).length >= 3;
    },
  },
  {
    id: 'file_ninja',
    title: 'Ninja de Archivos',
    description: 'Domina el copiado, renombrado y movimiento de archivos.',
    icon: '🥷',
    category: 'general',
    xpBonus: 150,
    condition: (user) => {
      const fileEx = ['win-03', 'win-05', 'win-12', 'linux-13', 'linux-14', 'linux-16'];
      return fileEx.filter((id) => user.completed_exercises.includes(id)).length >= 3;
    },
  },
  {
    id: 'cleaner',
    title: 'Limpieza Quirúrgica',
    description: 'Elimina archivos y directorios con precisión y seguridad.',
    icon: '🧹',
    category: 'general',
    xpBonus: 150,
    condition: (user) => {
      const delEx = ['win-06', 'win-07', 'win-08', 'win-16', 'linux-19', 'linux-27'];
      return delEx.filter((id) => user.completed_exercises.includes(id)).length >= 3;
    },
  },
  {
    id: 'permissions_guardian',
    title: 'Guardián de Permisos',
    description: 'Comprende y aplica permisos octales y simbólicos en Linux.',
    icon: '🛡️',
    category: 'linux',
    xpBonus: 200,
    condition: (user) =>
      user.completed_exercises.filter((id) => id.includes('perm') || id === 'linux-29').length >= 1,
  },
  {
    id: 'pipe_master',
    title: 'Maestro de Tuberías y Filtros',
    description: 'Filtra y procesa información con grep y wc.',
    icon: '🔍',
    category: 'linux',
    xpBonus: 200,
    condition: (user) =>
      user.completed_exercises.filter((id) => id.includes('grep') || id.includes('wc')).length >= 2,
  },
  {
    id: 'streak_5',
    title: 'Racha Imparable',
    description: 'Alcanza una racha de 5 retos resueltos consecutivamente.',
    icon: '🔥',
    category: 'streak',
    xpBonus: 250,
    condition: (user) => user.streak >= 5,
  },
  {
    id: 'level_5_sysadmin',
    title: 'SysAdmin Junior',
    description: 'Alcanza el Nivel 4 o superior de experiencia.',
    icon: '👑',
    category: 'general',
    xpBonus: 300,
    condition: (user) => user.level >= 4,
  },
];

export const RANKS = [
  { level: 1, minXp: 0, title: 'Novato de la Consola', color: 'text-gray-400', badgeColor: 'bg-gray-800' },
  { level: 2, minXp: 150, title: 'Script Apprentice', color: 'text-blue-400', badgeColor: 'bg-blue-900/60' },
  { level: 3, minXp: 400, title: 'Explorador de Rutas', color: 'text-emerald-400', badgeColor: 'bg-emerald-900/60' },
  { level: 4, minXp: 800, title: 'Operador de Sistemas', color: 'text-purple-400', badgeColor: 'bg-purple-900/60' },
  { level: 5, minXp: 1400, title: 'SysAdmin Junior', color: 'text-amber-400', badgeColor: 'bg-amber-900/60' },
  { level: 6, minXp: 2200, title: 'Guerrero de Terminal', color: 'text-rose-400', badgeColor: 'bg-rose-900/60' },
  { level: 7, minXp: 3200, title: 'Root / SYSTEM Master', color: 'text-yellow-300', badgeColor: 'bg-yellow-900/60 font-bold' },
];

export function getRankForXp(xp: number) {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXp) {
      current = rank;
    } else {
      break;
    }
  }
  return current;
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, StudentProgressRow } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial mock state for demo / standalone mode
const DEMO_STUDENT: UserProfile = {
  id: 'demo-student-id',
  email: 'alumno.dam@iesbenigaslo.es',
  name: 'Alumno 1º DAM',
  role: 'student',
  xp: 120,
  level: 1,
  streak: 2,
  avatar: '👨‍💻',
  completed_exercises: ['win-01', 'linux-01'],
  badges: ['first_command'],
};

const DEMO_TEACHER: UserProfile = {
  id: 'demo-teacher-id',
  email: 'gasensio@iesbenigaslo.es',
  name: 'Prof. G. Asensio',
  role: 'teacher',
  xp: 9999,
  level: 7,
  streak: 99,
  avatar: '👨‍🏫',
  completed_exercises: [],
  badges: ['level_5_sysadmin'],
};

const MOCK_CLASSROOM_DATA: StudentProgressRow[] = [
  {
    studentId: 'std-1',
    studentName: 'Alejandro Martínez',
    studentEmail: 'amartinez@iesbenigaslo.es',
    level: 3,
    xp: 420,
    streak: 4,
    completedCount: 6,
    totalExercises: 20,
    lastActive: 'Hace 10 minutos',
    recentAttempts: [
      { exerciseId: 'linux-01', exerciseTitle: 'Crear archivo tamaño 0', command: 'touch arch_tam0', success: true, timestamp: '14:20' },
      { exerciseId: 'win-01', exerciseTitle: 'Crear carpeta Proyecto', command: 'mkdir Proyecto', success: true, timestamp: '14:25' },
      { exerciseId: 'linux-06', exerciseTitle: 'Listar todo con detalle', command: 'ls -l', success: false, timestamp: '14:32' },
      { exerciseId: 'linux-06', exerciseTitle: 'Listar todo con detalle', command: 'ls -la /', success: true, timestamp: '14:35' },
    ],
  },
  {
    studentId: 'std-2',
    studentName: 'Beatriz Navarro',
    studentEmail: 'bnavarro@iesbenigaslo.es',
    level: 4,
    xp: 880,
    streak: 7,
    completedCount: 11,
    totalExercises: 20,
    lastActive: 'Hace 2 horas',
    recentAttempts: [
      { exerciseId: 'win-08', exerciseTitle: 'Eliminar con recursión', command: 'rmdir /s /q Proyecto', success: true, timestamp: '12:15' },
      { exerciseId: 'linux-12', exerciseTitle: 'Árbol anidado mkdir -p', command: 'mkdir -p PRUEBA/dir3/dir31/dir311', success: true, timestamp: '12:30' },
    ],
  },
  {
    studentId: 'std-3',
    studentName: 'Carlos Gómez',
    studentEmail: 'cgomez@iesbenigaslo.es',
    level: 1,
    xp: 110,
    streak: 1,
    completedCount: 2,
    totalExercises: 20,
    lastActive: 'Ayer',
    recentAttempts: [
      { exerciseId: 'linux-01', exerciseTitle: 'Crear archivo tamaño 0', command: 'touch arch_tam0', success: true, timestamp: 'Ayer 18:00' },
      { exerciseId: 'linux-03', exerciseTitle: 'Listar orden inverso', command: 'ls -rev /etc', success: false, timestamp: 'Ayer 18:15' },
      { exerciseId: 'linux-03', exerciseTitle: 'Listar orden inverso', command: 'ls -r /etc/t*', success: true, timestamp: 'Ayer 18:20' },
    ],
  },
  {
    studentId: 'std-4',
    studentName: 'Daniela Soler',
    studentEmail: 'dsoler@iesbenigaslo.es',
    level: 2,
    xp: 260,
    streak: 3,
    completedCount: 4,
    totalExercises: 20,
    lastActive: 'Hace 30 minutos',
    recentAttempts: [
      { exerciseId: 'win-04', exerciseTitle: 'Crear subcarpetas', command: 'mkdir Imágenes Documentos', success: true, timestamp: '14:40' },
    ],
  },
];

export async function getCurrentUserSession(): Promise<UserProfile | null> {
  const saved = localStorage.getItem('comandquest_active_user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }

  if (isSupabaseConfigured && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        return {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || profile.email.split('@')[0],
          role: profile.role || 'student',
          xp: profile.xp || 0,
          level: profile.level || 1,
          streak: profile.streak || 0,
          avatar: profile.avatar_url || '👨‍💻',
          completed_exercises: profile.completed_exercises || [],
          badges: profile.badges || [],
        };
      }
    }
  }

  // Default to student demo user
  return DEMO_STUDENT;
}

export function saveUserToStorage(user: UserProfile) {
  localStorage.setItem('comandquest_active_user', JSON.stringify(user));
}

export function switchRole(role: 'student' | 'teacher'): UserProfile {
  const user = role === 'teacher' ? { ...DEMO_TEACHER } : { ...DEMO_STUDENT };
  saveUserToStorage(user);
  return user;
}

export async function recordExerciseCompletion(
  user: UserProfile,
  exerciseId: string,
  xpEarned: number,
  command: string
): Promise<UserProfile> {
  const isNew = !user.completed_exercises.includes(exerciseId);
  const updatedCompleted = isNew ? [...user.completed_exercises, exerciseId] : user.completed_exercises;
  const newXp = isNew ? user.xp + xpEarned : user.xp;
  const newStreak = isNew ? user.streak + 1 : user.streak;
  const newLevel = Math.max(1, Math.floor(newXp / 250) + 1);

  const updatedUser: UserProfile = {
    ...user,
    completed_exercises: updatedCompleted,
    xp: newXp,
    streak: newStreak,
    level: newLevel,
  };

  saveUserToStorage(updatedUser);

  if (isSupabaseConfigured && supabase) {
    try {
      // Update profile
      await supabase.from('profiles').update({
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        completed_exercises: updatedCompleted,
      }).eq('id', user.id);

      // Record submission
      await supabase.from('submissions').insert({
        user_id: user.id,
        exercise_id: exerciseId,
        command_used: command,
        success: true,
        xp_earned: isNew ? xpEarned : 0,
      });
    } catch (e) {
      console.warn('Could not sync with Supabase cloud:', e);
    }
  }

  return updatedUser;
}

export async function fetchClassroomProgress(): Promise<StudentProgressRow[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (!error && data && data.length > 0) {
        return data.map((st) => ({
          studentId: st.id,
          studentName: st.full_name || st.email.split('@')[0],
          studentEmail: st.email,
          level: st.level || 1,
          xp: st.xp || 0,
          streak: st.streak || 0,
          completedCount: (st.completed_exercises || []).length,
          totalExercises: 20,
          lastActive: 'Hoy',
          recentAttempts: [],
        }));
      }
    } catch {
      // fallback to mock data
    }
  }
  return MOCK_CLASSROOM_DATA;
}

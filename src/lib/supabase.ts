import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, StudentProgressRow, LeaderboardEntry } from '../types';
import { getRankForXp } from '../data/badges';

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
  xp: 350,
  level: 2,
  streak: 3,
  avatar: '⚡',
  completed_exercises: ['win-01', 'linux-01', 'linux-02', 'win-02'],
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
  avatar: '🛡️',
  completed_exercises: [],
  badges: ['level_5_sysadmin'],
};

const INITIAL_MOCK_STUDENTS: StudentProgressRow[] = [
  {
    studentId: 'std-1',
    studentName: 'Beatriz Navarro (CyberTux)',
    studentEmail: 'bnavarro@iesbenigaslo.es',
    initialPassword: 'dam' + Math.floor(1000 + Math.random() * 9000),
    level: 4,
    xp: 920,
    streak: 8,
    completedCount: 12,
    totalExercises: 20,
    lastActive: 'Hace 5 min',
    recentAttempts: [
      { exerciseId: 'win-08', exerciseTitle: 'Eliminar recursivo', command: 'rmdir /s /q Proyecto', success: true, timestamp: '14:15' },
      { exerciseId: 'linux-12', exerciseTitle: 'Árbol anidado mkdir -p', command: 'mkdir -p PRUEBA/dir3/dir31/dir311', success: true, timestamp: '14:30' },
    ],
  },
  {
    studentId: 'std-2',
    studentName: 'Alejandro Martínez (RootHero)',
    studentEmail: 'amartinez@iesbenigaslo.es',
    initialPassword: 'dam' + Math.floor(1000 + Math.random() * 9000),
    level: 3,
    xp: 540,
    streak: 5,
    completedCount: 7,
    totalExercises: 20,
    lastActive: 'Hace 12 min',
    recentAttempts: [
      { exerciseId: 'linux-06', exerciseTitle: 'Listar todo con detalle', command: 'ls -la /', success: true, timestamp: '15:10' },
    ],
  },
  {
    studentId: 'std-3',
    studentName: 'Daniela Soler (NetWalker)',
    studentEmail: 'dsoler@iesbenigaslo.es',
    initialPassword: 'dam' + Math.floor(1000 + Math.random() * 9000),
    level: 3,
    xp: 410,
    streak: 3,
    completedCount: 5,
    totalExercises: 20,
    lastActive: 'Hace 35 min',
    recentAttempts: [
      { exerciseId: 'win-04', exerciseTitle: 'Crear subcarpetas', command: 'mkdir Imágenes Documentos', success: true, timestamp: '14:40' },
    ],
  },
  {
    studentId: 'std-4',
    studentName: 'Carlos Gómez (BashRunner)',
    studentEmail: 'cgomez@iesbenigaslo.es',
    initialPassword: 'dam' + Math.floor(1000 + Math.random() * 9000),
    level: 2,
    xp: 220,
    streak: 2,
    completedCount: 3,
    totalExercises: 20,
    lastActive: 'Ayer',
    recentAttempts: [
      { exerciseId: 'linux-01', exerciseTitle: 'Crear archivo tamaño 0', command: 'touch arch_tam0', success: true, timestamp: 'Ayer 18:00' },
    ],
  },
  {
    studentId: 'std-5',
    studentName: 'Elena Valls (ZeroByte)',
    studentEmail: 'evalls@iesbenigaslo.es',
    initialPassword: 'dam' + Math.floor(1000 + Math.random() * 9000),
    level: 1,
    xp: 90,
    streak: 1,
    completedCount: 1,
    totalExercises: 20,
    lastActive: 'Hace 1 hora',
    recentAttempts: [
      { exerciseId: 'win-01', exerciseTitle: 'Crear carpeta', command: 'mkdir Proyecto', success: true, timestamp: '13:00' },
    ],
  },
];

function getStoredStudents(): StudentProgressRow[] {
  const saved = localStorage.getItem('comandquest_classroom_students');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return INITIAL_MOCK_STUDENTS;
}

function saveStoredStudents(students: StudentProgressRow[]) {
  localStorage.setItem('comandquest_classroom_students', JSON.stringify(students));
}

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
          avatar: profile.avatar_url || '⚡',
          completed_exercises: profile.completed_exercises || [],
          badges: profile.badges || [],
        };
      }
    }
  }

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

  // Sync to mock classroom student entry if in demo mode
  const currentStudents = getStoredStudents();
  const idx = currentStudents.findIndex((s) => s.studentId === user.id || s.studentEmail === user.email);
  if (idx !== -1) {
    currentStudents[idx].xp = newXp;
    currentStudents[idx].level = newLevel;
    currentStudents[idx].streak = newStreak;
    currentStudents[idx].completedCount = updatedCompleted.length;
    currentStudents[idx].lastActive = 'Ahora mismo';
    currentStudents[idx].recentAttempts.unshift({
      exerciseId,
      exerciseTitle: exerciseId,
      command,
      success: true,
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
    });
    saveStoredStudents(currentStudents);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').update({
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        completed_exercises: updatedCompleted,
      }).eq('id', user.id);

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
        .eq('role', 'student')
        .order('xp', { ascending: false });

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
  return getStoredStudents();
}

// =========================================================================
// GESTIÓN DE USUARIOS DIRECTA DESDE LA WEB (SIN ABRIR SUPABASE)
// =========================================================================

export async function createStudentAccount(
  name: string,
  email: string,
  tempPassword: string
): Promise<{ success: boolean; message: string; student?: StudentProgressRow }> {
  const newStudentRow: StudentProgressRow = {
    studentId: 'std-' + Date.now().toString(36),
    studentName: name,
    studentEmail: email,
    initialPassword: tempPassword,
    level: 1,
    xp: 0,
    streak: 0,
    completedCount: 0,
    totalExercises: 20,
    lastActive: 'Nunca',
    recentAttempts: [],
  };

  // Always update local cache
  const list = getStoredStudents();
  list.unshift(newStudentRow);
  saveStoredStudents(list);

  if (isSupabaseConfigured && supabase) {
    try {
      // Call Supabase RPC function for admin user creation
      const { data, error } = await supabase.rpc('admin_create_student', {
        student_email: email,
        student_password: tempPassword,
        student_name: name,
      });

      if (error) {
        // Fallback: regular sign up if RPC not created yet
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password: tempPassword,
          options: {
            data: { full_name: name },
          },
        });
        if (signUpErr) {
          return { success: false, message: signUpErr.message };
        }
      } else if (data && data.user_id) {
        newStudentRow.studentId = data.user_id;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al conectar con Supabase';
      return { success: false, message: msg };
    }
  }

  return {
    success: true,
    message: `Alumno "${name}" creado con éxito. Ya puede iniciar sesión.`,
    student: newStudentRow,
  };
}

export async function bulkCreateStudents(
  lines: string[]
): Promise<{ createdCount: number; errors: string[] }> {
  let created = 0;
  const errors: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Expected format: "Nombre, email, contraseña" or tab-separated
    const parts = trimmed.split(/[,;\t]+/).map((s) => s.trim());
    if (parts.length >= 2) {
      const name = parts[0];
      const email = parts[1];
      const password = parts[2] || 'ies' + Math.floor(1000 + Math.random() * 9000);
      const res = await createStudentAccount(name, email, password);
      if (res.success) {
        created++;
      } else {
        errors.push(`${email}: ${res.message}`);
      }
    } else {
      errors.push(`Línea inválida: "${trimmed}". Formato requerido: Nombre, Correo, Contraseña`);
    }
  }

  return { createdCount: created, errors };
}

export async function deleteStudent(studentId: string): Promise<boolean> {
  const current = getStoredStudents().filter((s) => s.studentId !== studentId);
  saveStoredStudents(current);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').delete().eq('id', studentId);
    } catch {
      // fallback
    }
  }
  return true;
}

// =========================================================================
// TABLA DE RETOS Y RANKING DEL AULA (LEADERBOARD)
// =========================================================================

export async function fetchLeaderboard(currentUserId?: string): Promise<LeaderboardEntry[]> {
  const students = await fetchClassroomProgress();

  // Sort descending by XP and then completedCount
  const sorted = [...students].sort((a, b) => b.xp - a.xp || b.completedCount - a.completedCount);

  return sorted.map((st, index) => {
    const rankObj = getRankForXp(st.xp);
    return {
      rank: index + 1,
      id: st.studentId,
      name: st.studentName,
      avatar: index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👾',
      xp: st.xp,
      level: st.level,
      streak: st.streak,
      completedCount: st.completedCount,
      rankTitle: rankObj.title,
      isCurrentUser: st.studentId === currentUserId,
    };
  });
}

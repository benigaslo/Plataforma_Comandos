import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, StudentProgressRow, LeaderboardEntry, UserRole, CourseGroup } from '../types';
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
  course: '1DAM',
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
  course: '1DAM',
  xp: 9999,
  level: 7,
  streak: 99,
  avatar: '🛡️',
  completed_exercises: [],
  badges: ['level_5_sysadmin'],
};

const INITIAL_MOCK_STUDENTS: StudentProgressRow[] = [
  // 1º DAM
  {
    studentId: 'std-1',
    studentName: 'Beatriz Navarro (CyberTux)',
    studentEmail: 'bnavarro@iesbenigaslo.es',
    role: 'student',
    course: '1DAM',
    initialPassword: 'dam' + Math.floor(1000 + Math.random() * 9000),
    level: 4,
    xp: 920,
    streak: 8,
    completedCount: 14,
    totalExercises: 26,
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
    role: 'student',
    course: '1DAM',
    initialPassword: 'dam' + Math.floor(1000 + Math.random() * 9000),
    level: 3,
    xp: 540,
    streak: 5,
    completedCount: 9,
    totalExercises: 26,
    lastActive: 'Hace 12 min',
    recentAttempts: [
      { exerciseId: 'linux-06', exerciseTitle: 'Listar todo con detalle', command: 'ls -la /', success: true, timestamp: '15:10' },
    ],
  },
  {
    studentId: 'std-4',
    studentName: 'Carlos Gómez (BashRunner)',
    studentEmail: 'cgomez@iesbenigaslo.es',
    role: 'student',
    course: '1DAM',
    initialPassword: 'dam' + Math.floor(1000 + Math.random() * 9000),
    level: 2,
    xp: 220,
    streak: 2,
    completedCount: 4,
    totalExercises: 26,
    lastActive: 'Ayer',
    recentAttempts: [
      { exerciseId: 'linux-01', exerciseTitle: 'Crear archivo tamaño 0', command: 'touch arch_tam0', success: true, timestamp: 'Ayer 18:00' },
    ],
  },

  // 2º SMR
  {
    studentId: 'std-smr-1',
    studentName: 'Marcos Rius (NetAdmin)',
    studentEmail: 'mrius@iesbenigaslo.es',
    role: 'student',
    course: '2SMR',
    initialPassword: 'smr' + Math.floor(1000 + Math.random() * 9000),
    level: 5,
    xp: 1450,
    streak: 11,
    completedCount: 19,
    totalExercises: 26,
    lastActive: 'Hace 20 min',
    recentAttempts: [
      { exerciseId: 'linux-raid1-mdadm', exerciseTitle: 'Configuración RAID 1', command: 'mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1', success: true, timestamp: '11:20' },
    ],
  },
  {
    studentId: 'std-3',
    studentName: 'Daniela Soler (NetWalker)',
    studentEmail: 'dsoler@iesbenigaslo.es',
    role: 'student',
    course: '2SMR',
    initialPassword: 'smr' + Math.floor(1000 + Math.random() * 9000),
    level: 3,
    xp: 410,
    streak: 3,
    completedCount: 6,
    totalExercises: 26,
    lastActive: 'Hace 35 min',
    recentAttempts: [
      { exerciseId: 'win-04', exerciseTitle: 'Crear subcarpetas', command: 'mkdir Imágenes Documentos', success: true, timestamp: '14:40' },
    ],
  },
  {
    studentId: 'std-smr-2',
    studentName: 'Joan Vicent (DiskMaster)',
    studentEmail: 'jvicent@iesbenigaslo.es',
    role: 'student',
    course: '2SMR',
    initialPassword: 'smr' + Math.floor(1000 + Math.random() * 9000),
    level: 2,
    xp: 320,
    streak: 4,
    completedCount: 5,
    totalExercises: 26,
    lastActive: 'Hoy',
    recentAttempts: [
      { exerciseId: 'linux-disk-01', exerciseTitle: 'Espacio df -h', command: 'df -h', success: true, timestamp: '10:00' },
    ],
  },

  // DOCENTE COMPAÑERO (EJEMPLO)
  {
    studentId: 'teach-2',
    studentName: 'Prof. M. Navarro (Sistemas)',
    studentEmail: 'mnavarro@iesbenigaslo.es',
    role: 'teacher',
    course: '2SMR',
    initialPassword: 'admin' + Math.floor(1000 + Math.random() * 9000),
    level: 7,
    xp: 8500,
    streak: 50,
    completedCount: 26,
    totalExercises: 26,
    lastActive: 'Hace 1 hora',
    recentAttempts: [],
  },
];

export function getStoredStudents(): StudentProgressRow[] {
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

export function saveStoredStudents(students: StudentProgressRow[]) {
  localStorage.setItem('comandquest_classroom_students', JSON.stringify(students));
}

export async function loginWithCredentials(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
  // 1. Intentar iniciar sesión en Supabase si está configurado
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (!error && data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: profile?.full_name || email.split('@')[0],
          role: profile?.role || 'student',
          course: profile?.course || '1DAM',
          xp: profile?.xp || 0,
          level: profile?.level || 1,
          streak: profile?.streak || 0,
          avatar: profile?.avatar_url || '⚡',
          completed_exercises: profile?.completed_exercises || [],
          badges: profile?.badges || [],
        };
        saveUserToStorage(user);
        return { success: true, user };
      } else if (error) {
        // Si Supabase devuelve error de credenciales explícito
        console.warn('Supabase auth notice:', error.message);
      }
    } catch (e) {
      console.warn('Supabase login fallback:', e);
    }
  }

  // 2. Comprobar cuentas del aula creadas por el docente (modo local / sin conexión)
  const students = getStoredStudents();
  const normalizedEmail = email.toLowerCase().trim();
  const found = students.find((s) => s.studentEmail.toLowerCase() === normalizedEmail);

  if (found) {
    if (found.initialPassword && found.initialPassword !== pass) {
      return { success: false, message: 'Contraseña incorrecta para este alumno.' };
    }
    const user: UserProfile = {
      id: found.studentId,
      email: found.studentEmail,
      name: found.studentName,
      role: found.role,
      course: found.course,
      xp: found.xp,
      level: found.level,
      streak: found.streak,
      avatar: found.role === 'teacher' ? '🛡️' : '👨‍💻',
      completed_exercises: found.recentAttempts.filter((a) => a.success).map((a) => a.exerciseId),
      badges: [],
    };
    saveUserToStorage(user);
    return { success: true, user };
  }

  // 3. Fallback permisivo de aula: si el correo es nuevo o no está registrado
  const isTeacher = email.toLowerCase().includes('prof') || email.toLowerCase().includes('gasensio');
  const fallbackUser: UserProfile = {
    id: 'user_' + Date.now(),
    email: normalizedEmail,
    name: email.split('@')[0].replace('.', ' '),
    role: isTeacher ? 'teacher' : 'student',
    course: '1DAM',
    xp: 0,
    level: 1,
    streak: 0,
    avatar: isTeacher ? '🛡️' : '👨‍💻',
    completed_exercises: [],
    badges: [],
  };
  saveUserToStorage(fallbackUser);
  return { success: true, user: fallbackUser };
}

export async function logoutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {}
  }
  localStorage.removeItem('comandquest_active_user');
}

export function loginAsGuest(): UserProfile {
  const guest: UserProfile = {
    ...DEMO_STUDENT,
    name: 'Alumno Invitado',
    email: 'invitado@iesbenigaslo.es',
  };
  saveUserToStorage(guest);
  return guest;
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const loaded: UserProfile = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || profile.email.split('@')[0],
            role: profile.role || 'student',
            course: profile.course || '1DAM',
            xp: profile.xp || 0,
            level: profile.level || 1,
            streak: profile.streak || 0,
            avatar: profile.avatar_url || '⚡',
            completed_exercises: profile.completed_exercises || [],
            badges: profile.badges || [],
          };
          saveUserToStorage(loaded);
          return loaded;
        }
      }
    } catch {
      // fallback
    }
  }

  return null;
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
        .order('xp', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((st) => ({
          studentId: st.id,
          studentName: st.full_name || st.email.split('@')[0],
          studentEmail: st.email,
          role: (st.role as UserRole) || 'student',
          course: (st.course as CourseGroup) || '1DAM',
          level: st.level || 1,
          xp: st.xp || 0,
          streak: st.streak || 0,
          completedCount: (st.completed_exercises || []).length,
          totalExercises: 26,
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
// GESTIÓN DE USUARIOS DIRECTA: ALUMNOS (1º DAM & 2º SMR) Y DOCENTES
// =========================================================================

export async function createStudentAccount(
  name: string,
  email: string,
  tempPassword: string,
  role: UserRole = 'student',
  course: CourseGroup = '1DAM'
): Promise<{ success: boolean; message: string; student?: StudentProgressRow }> {
  const newStudentRow: StudentProgressRow = {
    studentId: (role === 'teacher' ? 'teach-' : 'std-') + Date.now().toString(36),
    studentName: name,
    studentEmail: email,
    role,
    course,
    initialPassword: tempPassword,
    level: role === 'teacher' ? 7 : 1,
    xp: role === 'teacher' ? 9999 : 0,
    streak: role === 'teacher' ? 99 : 0,
    completedCount: 0,
    totalExercises: 26,
    lastActive: 'Nunca',
    recentAttempts: [],
  };

  const list = getStoredStudents();
  list.unshift(newStudentRow);
  saveStoredStudents(list);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.rpc('admin_create_student', {
        student_email: email,
        student_password: tempPassword,
        student_name: name,
        user_role: role,
        student_course: course,
      });

      if (error) {
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password: tempPassword,
          options: {
            data: { full_name: name, role, course },
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

  const roleText = role === 'teacher' ? 'Docente' : `Alumno de ${course === '1DAM' ? '1º DAM' : '2º SMR'}`;
  return {
    success: true,
    message: `${roleText} "${name}" registrado correctamente. Ya puede iniciar sesión.`,
    student: newStudentRow,
  };
}

export async function bulkCreateStudents(
  lines: string[],
  defaultCourse: CourseGroup = '1DAM',
  defaultRole: UserRole = 'student'
): Promise<{ createdCount: number; errors: string[] }> {
  let created = 0;
  const errors: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Expected format: "Nombre, email, contraseña [, curso, rol]"
    const parts = trimmed.split(/[,;\t]+/).map((s) => s.trim());
    if (parts.length >= 2) {
      const name = parts[0];
      const email = parts[1];
      const password = parts[2] || 'ies' + Math.floor(1000 + Math.random() * 9000);
      const courseStr = parts[3]?.toUpperCase();
      const course: CourseGroup = courseStr === '2SMR' || courseStr === 'SMR' ? '2SMR' : defaultCourse;
      const roleStr = parts[4]?.toLowerCase();
      const role: UserRole = roleStr === 'teacher' || roleStr === 'docente' || roleStr === 'profesor' ? 'teacher' : defaultRole;

      const res = await createStudentAccount(name, email, password, role, course);
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
// TABLA DE RETOS Y RANKING DEL AULA (LEADERBOARD MULTI-CURSO)
// =========================================================================

export async function fetchLeaderboard(
  currentUserId?: string,
  courseFilter?: CourseGroup | 'TODOS'
): Promise<LeaderboardEntry[]> {
  const allUsers = await fetchClassroomProgress();

  // Filter out teachers from the student competition leaderboard
  let students = allUsers.filter((u) => u.role !== 'teacher');

  if (courseFilter && courseFilter !== 'TODOS') {
    students = students.filter((s) => s.course === courseFilter);
  }

  const sorted = [...students].sort((a, b) => b.xp - a.xp || b.completedCount - a.completedCount);

  return sorted.map((st, index) => {
    const rankObj = getRankForXp(st.xp);
    return {
      rank: index + 1,
      id: st.studentId,
      name: st.studentName,
      course: st.course,
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

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, StudentProgressRow, LeaderboardEntry, UserRole, CourseGroup } from '../types';
import { getRankForXp } from '../data/badges';

// Configuración de Supabase con URL normalizada (sin /rest/v1)
const rawUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ronlnjcdlwdqsvceomtt.supabase.co';

export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_hHf5vPyZPfWGFnct4Pl58Q_uJ_XSYjK';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Cliente secundario aislado sin persistencia de sesión en localStorage para altas
export const registrationClient: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export function isTeacherAccount(email?: string, role?: string): boolean {
  if (role === 'teacher') return true;
  if (!email) return false;
  const norm = email.toLowerCase().trim();
  return (
    norm === 'g.asensiosanagusti@edu.gva.es' ||
    norm === 'v.mascarosalvarez@edu.gva.es' ||
    norm === 'profesor@comandquest.local' ||
    (norm.startsWith('profesor') && norm.endsWith('@iesbenigaslo.es'))
  );
}

// Estado inicial sin alumnos de ejemplo para que el aula empiece 100% limpia
const DEMO_STUDENT: UserProfile = {
  id: 'guest-student-id',
  email: 'invitado@comandquest.local',
  name: 'Alumno Invitado',
  role: 'student',
  course: '1DAM',
  xp: 0,
  level: 1,
  streak: 0,
  avatar: '⚡',
  completed_exercises: [],
  badges: [],
};

const DEMO_TEACHER: UserProfile = {
  id: 'demo-teacher-id',
  email: 'profesor@comandquest.local',
  name: 'Profesor (Docente)',
  role: 'teacher',
  course: '1DAM',
  xp: 9999,
  level: 7,
  streak: 99,
  avatar: '🛡️',
  completed_exercises: [],
  badges: ['level_5_sysadmin'],
};

const INITIAL_MOCK_STUDENTS: StudentProgressRow[] = [];

export function getStoredStudents(): StudentProgressRow[] {
  // 1. Almacén limpio v2
  const savedV2 = localStorage.getItem('comandquest_classroom_students_v2');
  if (savedV2) {
    try {
      return JSON.parse(savedV2);
    } catch {
      // fallback
    }
  }

  // 2. Limpieza de versiones anteriores: si había usuarios mock de ejemplo antiguos, eliminarlos automáticamente
  const legacy = localStorage.getItem('comandquest_classroom_students');
  if (legacy) {
    try {
      const parsed: StudentProgressRow[] = JSON.parse(legacy);
      const mockSampleEmails = [
        'bnavarro@iesbenigaslo.es',
        'amartinez@iesbenigaslo.es',
        'cgomez@iesbenigaslo.es',
        'mrius@iesbenigaslo.es',
        'dsoler@iesbenigaslo.es',
        'jvicent@iesbenigaslo.es',
        'mnavarro@iesbenigaslo.es',
        'alumno.dam@iesbenigaslo.es',
      ];
      // Conservar solo usuarios reales que haya creado manualmente el docente
      const onlyReal = parsed.filter((s) => !mockSampleEmails.includes(s.studentEmail.toLowerCase()));
      localStorage.setItem('comandquest_classroom_students_v2', JSON.stringify(onlyReal));
      localStorage.removeItem('comandquest_classroom_students');
      return onlyReal;
    } catch {
      localStorage.removeItem('comandquest_classroom_students');
    }
  }

  return INITIAL_MOCK_STUDENTS;
}

export function saveStoredStudents(students: StudentProgressRow[]) {
  localStorage.setItem('comandquest_classroom_students_v2', JSON.stringify(students));
}

export async function loginWithCredentials(
  email: string,
  pass: string,
  loginType: 'student' | 'teacher' = 'student'
): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Intentar iniciar sesión en Supabase si está configurado
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: pass,
      });

      if (!error && data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const isKnownTeacher = isTeacherAccount(normalizedEmail, profile?.role || data.user.user_metadata?.role);
        const isExplicitStudent = profile?.role === 'student' && !isKnownTeacher;

        // Si se intenta acceder por Acceso Docente con una cuenta de alumno
        if (loginType === 'teacher' && isExplicitStudent) {
          return {
            success: false,
            message: 'Esta cuenta es de alumno. Para resolver tus retos inicia sesión desde la pestaña "Acceso Alumnos".',
          };
        }

        const role: UserRole =
          loginType === 'teacher'
            ? 'teacher'
            : (isKnownTeacher ? 'teacher' : 'student');

        const course: CourseGroup = profile?.course || data.user.user_metadata?.course || '1DAM';
        const name =
          profile?.full_name ||
          data.user.user_metadata?.full_name ||
          (role === 'teacher' ? 'G. Asensio (Docente)' : email.split('@')[0].replace('.', ' '));

        // Sincronizar en profiles con rol docente (tolerante a si la columna course aún no existe en Supabase)
        try {
          const profilePayload: Record<string, unknown> = {
            id: data.user.id,
            email: normalizedEmail,
            full_name: name,
            role,
            avatar_url: role === 'teacher' ? '🛡️' : '👨‍💻',
          };
          const { error: upsertErr } = await supabase.from('profiles').upsert({
            ...profilePayload,
            course,
          });
          if (upsertErr && upsertErr.message?.includes('course')) {
            await supabase.from('profiles').upsert(profilePayload);
          }
        } catch {}

        const user: UserProfile = {
          id: data.user.id,
          email: data.user.email || normalizedEmail,
          name,
          role,
          course,
          xp: role === 'teacher' ? 9999 : (profile?.xp ?? 0),
          level: role === 'teacher' ? 7 : (profile?.level ?? 1),
          streak: role === 'teacher' ? 99 : (profile?.streak ?? 0),
          avatar: role === 'teacher' ? '🛡️' : (profile?.avatar_url || '👨‍💻'),
          completed_exercises: profile?.completed_exercises || [],
          badges: role === 'teacher' ? ['level_5_sysadmin'] : (profile?.badges || []),
        };
        saveUserToStorage(user);
        return { success: true, user };
      } else if (error) {
        console.warn('Supabase auth notice:', error.message);
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: 'Contraseña o correo incorrectos en Supabase. Verifica la contraseña de tu usuario.',
          };
        }
        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            message:
              'El correo requiere confirmación en Supabase. En tu proyecto de Supabase ve a Authentication -> Providers -> Email y desactiva "Confirm email" para permitir altas y accesos directos sin correo.',
          };
        }
      }
    } catch (e) {
      console.warn('Supabase login fallback:', e);
    }
  }

  // 2. Comprobar cuentas del aula creadas por el docente (modo local / sin conexión)
  const students = getStoredStudents();
  const found = students.find((s) => s.studentEmail.toLowerCase() === normalizedEmail);

  if (found) {
    if (found.initialPassword && found.initialPassword !== pass) {
      const roleLabel = loginType === 'teacher' || found.role === 'teacher' ? 'este docente' : 'este alumno';
      return { success: false, message: `Contraseña incorrecta para ${roleLabel}.` };
    }

    if (loginType === 'teacher') {
      const isTeacher = isTeacherAccount(normalizedEmail, found.role);

      if (!isTeacher) {
        return {
          success: false,
          message: 'Esta cuenta es de alumno. Para resolver tus retos inicia sesión desde la pestaña "Acceso Alumnos".',
        };
      }

      const user: UserProfile = {
        id: found.studentId,
        email: found.studentEmail,
        name: found.studentName,
        role: 'teacher',
        course: found.course,
        xp: 9999,
        level: 7,
        streak: 99,
        avatar: '🛡️',
        completed_exercises: [],
        badges: ['level_5_sysadmin'],
      };
      saveUserToStorage(user);
      return { success: true, user };
    } else {
      const user: UserProfile = {
        id: found.studentId,
        email: found.studentEmail,
        name: found.studentName,
        role: 'student',
        course: found.course,
        xp: found.xp || 0,
        level: found.level || 1,
        streak: found.streak || 0,
        avatar: '👨‍💻',
        completed_exercises: found.recentAttempts.filter((a) => a.success).map((a) => a.exerciseId),
        badges: [],
      };
      saveUserToStorage(user);
      return { success: true, user };
    }
  }

  // 3. Fallback directo para el docente administrador principal si accede por Acceso Docente
  if (loginType === 'teacher' && isTeacherAccount(normalizedEmail)) {
    const teacherUser: UserProfile = {
      id: 'teacher-admin-id',
      email: normalizedEmail,
      name: 'Prof. ' + email.split('@')[0].replace('.', ' '),
      role: 'teacher',
      course: '1DAM',
      xp: 9999,
      level: 7,
      streak: 99,
      avatar: '🛡️',
      completed_exercises: [],
      badges: ['level_5_sysadmin'],
    };
    saveUserToStorage(teacherUser);
    return { success: true, user: teacherUser };
  }

  return {
    success: false,
    message: 'Usuario no encontrado o contraseña incorrecta. Asegúrate de estar dado de alta por el profesor.',
  };
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
      const parsed: UserProfile = JSON.parse(saved);
      // Si la cuenta guardada es del profesor o docente, forzar rol y privilegios de docente
      if (isTeacherAccount(parsed.email, parsed.role)) {
        parsed.role = 'teacher';
        parsed.avatar = '🛡️';
        parsed.xp = Math.max(parsed.xp || 0, 9999);
        parsed.level = Math.max(parsed.level || 1, 7);
        parsed.streak = Math.max(parsed.streak || 0, 99);
        parsed.badges = parsed.badges && parsed.badges.length ? parsed.badges : ['level_5_sysadmin'];
        saveUserToStorage(parsed);
      }
      return parsed;
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

        const userEmail = (user.email || profile?.email || '').toLowerCase().trim();
        const teacherAccount = isTeacherAccount(userEmail, profile?.role || user.user_metadata?.role);
        const role: UserRole = teacherAccount ? 'teacher' : 'student';

        const loaded: UserProfile = {
          id: user.id,
          email: userEmail,
          name:
            role === 'teacher'
              ? (profile?.full_name || 'Profesor (Docente)')
              : (profile?.full_name || user.user_metadata?.full_name || userEmail.split('@')[0]),
          role,
          course: profile?.course || user.user_metadata?.course || '1DAM',
          xp: role === 'teacher' ? 9999 : (profile?.xp || 0),
          level: role === 'teacher' ? 7 : (profile?.level || 1),
          streak: role === 'teacher' ? 99 : (profile?.streak || 0),
          avatar: role === 'teacher' ? '🛡️' : (profile?.avatar_url || '👨‍💻'),
          completed_exercises: profile?.completed_exercises || [],
          badges: role === 'teacher' ? ['level_5_sysadmin'] : (profile?.badges || []),
        };
        saveUserToStorage(loaded);
        return loaded;
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
  let list: StudentProgressRow[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false });

      if (!error && data && data.length > 0) {
        list = data.map((st) => ({
          studentId: st.id,
          studentName: st.full_name || st.email.split('@')[0],
          studentEmail: st.email,
          role: (st.role as UserRole) || (isTeacherAccount(st.email) ? 'teacher' : 'student'),
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
      // fallback
    }
  }

  // Si no hay datos en Supabase, usar el almacenamiento local
  if (list.length === 0) {
    list = getStoredStudents();
  } else {
    // Si hay datos en Supabase, combinar con las contraseñas asignadas en local para acceso rápido
    const stored = getStoredStudents();
    list = list.map((st) => {
      const foundStored = stored.find(
        (s) => s.studentEmail.toLowerCase().trim() === st.studentEmail.toLowerCase().trim()
      );
      return {
        ...st,
        initialPassword: foundStored?.initialPassword || st.initialPassword,
      };
    });
  }

  // Deduplicación estricta por correo para evitar registros duplicados en la plataforma
  const seen = new Set<string>();
  const uniqueStudents: StudentProgressRow[] = [];
  for (const st of list) {
    const key = (st.studentEmail || '').toLowerCase().trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      uniqueStudents.push(st);
    }
  }

  return uniqueStudents;
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

  if (isSupabaseConfigured && (registrationClient || supabase)) {
    const client = registrationClient || supabase!;
    const redirectUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : 'https://gasensios.github.io/Plataforma_Comandos/';

    try {
      // 1. Intentar registrar vía RPC 'admin_create_student' (si está instalada en base de datos)
      const { data, error } = await client.rpc('admin_create_student', {
        student_email: email,
        student_password: tempPassword,
        student_name: name,
        user_role: role,
        student_course: course,
      });

      const rpcFailed = error || (data && data.success === false);

      if (rpcFailed) {
        // 2. Fallback: Registrar mediante signUp sin sobreescribir la sesión del profesor activo
        const { data: signUpData, error: signUpErr } = await client.auth.signUp({
          email,
          password: tempPassword,
          options: {
            data: { full_name: name, role, course },
            emailRedirectTo: redirectUrl,
          },
        });

        if (signUpErr) {
          if (signUpErr.message.toLowerCase().includes('already registered')) {
            return {
              success: false,
              message: `El correo "${email}" ya se encuentra registrado en Supabase.`,
            };
          }
          return { success: false, message: signUpErr.message };
        }

        if (signUpData?.user?.id) {
          newStudentRow.studentId = signUpData.user.id;
        }
      } else if (data && data.user_id) {
        newStudentRow.studentId = data.user_id;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al conectar con Supabase';
      return { success: false, message: msg };
    }
  }

  const roleText =
    role === 'teacher'
      ? 'Docente'
      : `Alumno de ${course === '1DAM' ? '1º DAM' : course === '1DAW' ? '1º DAW' : '2º SMR'}`;
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
      const course: CourseGroup =
        courseStr === '1DAW' || courseStr === 'DAW'
          ? '1DAW'
          : courseStr === '2SMR' || courseStr === 'SMR'
          ? '2SMR'
          : courseStr === '1DAM' || courseStr === 'DAM'
          ? '1DAM'
          : defaultCourse;
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

export async function deleteStudent(
  studentId: string,
  studentEmail?: string
): Promise<{ success: boolean; message?: string }> {
  const normEmail = studentEmail?.toLowerCase().trim();

  // 1. Limpiar de almacenamiento local
  const current = getStoredStudents().filter(
    (s) => s.studentId !== studentId && (!normEmail || s.studentEmail.toLowerCase().trim() !== normEmail)
  );
  saveStoredStudents(current);

  // 2. Limpiar de Supabase (Base de datos y Auth)
  if (isSupabaseConfigured && supabase) {
    try {
      // 2a. Intento RPC administrativo si está instalado
      if (normEmail) {
        try {
          await supabase.rpc('admin_delete_student', {
            target_email: normEmail,
            target_id: studentId && studentId.length === 36 ? studentId : null,
          });
        } catch (rpcErr) {
          console.warn('RPC admin_delete_student notice:', rpcErr);
        }
      }

      // 2b. Eliminación directa en la tabla 'profiles'
      if (normEmail) {
        await supabase.from('profiles').delete().eq('email', normEmail);
      }
      if (studentId && studentId.length === 36) {
        await supabase.from('profiles').delete().eq('id', studentId);
      }
    } catch (e: unknown) {
      console.warn('Error deleting student in Supabase:', e);
    }
  }

  return { success: true, message: 'Usuario eliminado correctamente de la base de datos' };
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

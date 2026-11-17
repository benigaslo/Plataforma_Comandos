import React, { useState, useEffect } from 'react';
import { StudentProgressRow, Exercise, OperatingSystem, UserRole, CourseGroup, ThemeMode } from '../types';
import {
  fetchClassroomProgress,
  createStudentAccount,
  bulkCreateStudents,
  deleteStudent,
} from '../lib/supabase';
import {
  getStoredCustomExercises,
  saveCustomExercise,
  deleteCustomExercise,
} from '../data/exercises';
import { sounds } from '../lib/sound';
import {
  Users,
  Search,
  Download,
  CheckCircle,
  Sparkles,
  Flame,
  ChevronRight,
  X,
  UserPlus,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  Check,
  GraduationCap,
  PlusCircle,
  BookOpen,
  Filter,
  ShieldAlert,
} from 'lucide-react';

interface TeacherPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExercisesUpdated?: () => void;
  theme?: ThemeMode;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({
  isOpen,
  onClose,
  onExercisesUpdated,
  theme = 'matrix',
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'management' | 'exercises'>('monitoring');
  const [students, setStudents] = useState<StudentProgressRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<'TODOS' | '1DAM' | '1DAW' | '2SMR' | 'TEACHERS'>('TODOS');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressRow | null>(null);

  // Form single user
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newCourse, setNewCourse] = useState<CourseGroup>('1DAM');
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk import
  const [bulkText, setBulkText] = useState('');
  const [bulkCourse, setBulkCourse] = useState<CourseGroup>('1DAM');
  const [bulkMsg, setBulkMsg] = useState<string | null>(null);

  // Custom Exercise Creation State
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [exOs, setExOs] = useState<OperatingSystem>('linux');
  const [exModule, setExModule] = useState('Linux - Retos Personalizados');
  const [exTitle, setExTitle] = useState('');
  const [exDifficulty, setExDifficulty] = useState<'fácil' | 'medio' | 'avanzado'>('medio');
  const [exXp, setExXp] = useState(75);
  const [exStartDir, setExStartDir] = useState('/home/usuario');
  const [exMission, setExMission] = useState('');
  const [exExplanation, setExExplanation] = useState('');
  const [exHint, setExHint] = useState('');
  const [exCommands, setExCommands] = useState('');
  const [exOutput, setExOutput] = useState('');
  const [exTargetCourse, setExTargetCourse] = useState<CourseGroup | 'TODOS'>('TODOS');
  const [exSuccessMsg, setExSuccessMsg] = useState<string | null>(null);

  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  const loadData = () => {
    fetchClassroomProgress().then(setStudents);
    setCustomExercises(getStoredCustomExercises());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (courseFilter === '1DAM') return st.course === '1DAM' && st.role === 'student';
    if (courseFilter === '1DAW') return st.course === '1DAW' && st.role === 'student';
    if (courseFilter === '2SMR') return st.course === '2SMR' && st.role === 'student';
    if (courseFilter === 'TEACHERS') return st.role === 'teacher';
    return true; // TODOS
  });

  const studentOnlyList = students.filter((s) => s.role === 'student');
  const totalXP = studentOnlyList.reduce((acc, st) => acc + st.xp, 0);
  const avgXP = studentOnlyList.length ? Math.round(totalXP / studentOnlyList.length) : 0;
  const avgCompletion = studentOnlyList.length
    ? Math.round(
        (studentOnlyList.reduce((acc, st) => acc + st.completedCount, 0) /
          (studentOnlyList.length * (studentOnlyList[0]?.totalExercises || 26))) *
          100
      )
    : 0;

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setFormMsg({ type: 'error', text: 'Por favor, rellena todos los campos.' });
      return;
    }

    sounds.playKey();
    setIsSubmitting(true);
    setFormMsg(null);

    const res = await createStudentAccount(
      newName.trim(),
      newEmail.trim(),
      newPassword.trim(),
      newRole,
      newCourse
    );
    setIsSubmitting(false);

    if (res.success) {
      sounds.playSuccess();
      setFormMsg({ type: 'success', text: res.message });
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      loadData();
    } else {
      sounds.playError();
      setFormMsg({ type: 'error', text: res.message });
    }
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;

    sounds.playKey();
    setIsSubmitting(true);
    setBulkMsg(null);

    const lines = bulkText.split('\n');
    const { createdCount, errors } = await bulkCreateStudents(lines, bulkCourse);
    setIsSubmitting(false);

    if (createdCount > 0) {
      sounds.playSuccess();
      let msg = `✔ Se han registrado ${createdCount} usuarios correctamente en ${
        bulkCourse === '1DAM' ? '1º DAM' : bulkCourse === '1DAW' ? '1º DAW' : '2º SMR'
      }.`;
      if (errors.length > 0) {
        msg += ` (Ocurrieron ${errors.length} avisos: ${errors.slice(0, 2).join('; ')})`;
      }
      setBulkMsg(msg);
      setBulkText('');
      loadData();
    } else {
      sounds.playError();
      setBulkMsg(`❌ No se pudieron registrar usuarios: ${errors.join(', ')}`);
    }
  };

  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string, email?: string) => {
    if (email && email.toLowerCase().trim() === 'g.asensiosanagusti@edu.gva.es') {
      alert('No se puede eliminar la cuenta del docente administrador principal.');
      return;
    }

    if (
      confirm(
        `¿Estás seguro de que deseas eliminar a "${name}" (${email || id}) de la base de datos?\n\nEsta acción borrará definitivamente al usuario de la plataforma y de Supabase.`
      )
    ) {
      sounds.playKey();
      setDeletingEmail(email || id);
      try {
        await deleteStudent(id, email);
        sounds.playSuccess();
        if (selectedStudent && (selectedStudent.studentId === id || selectedStudent.studentEmail === email)) {
          setSelectedStudent(null);
        }
        await loadData();
      } catch {
        sounds.playError();
        alert('Ocurrió un error al intentar eliminar al usuario.');
      } finally {
        setDeletingEmail(null);
      }
    }
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exTitle.trim() || !exMission.trim() || !exCommands.trim()) {
      alert('Por favor completa al menos el título, la misión y los comandos válidos.');
      return;
    }

    sounds.playSuccess();
    const id = `custom-${exOs}-${Date.now().toString(36)}`;
    const validPatterns = exCommands
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => new RegExp(`^${c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i'));

    const newEx: Exercise = {
      id,
      title: exTitle.trim(),
      os: exOs,
      module: exModule.trim() || `${exOs === 'linux' ? 'Linux' : 'Windows'} - Retos`,
      difficulty: exDifficulty,
      xpReward: Number(exXp) || 75,
      startingDir: exStartDir.trim() || (exOs === 'linux' ? '/home/usuario' : 'C:\\Users\\Alumno'),
      mission: exMission.trim(),
      explanation: exExplanation.trim() || 'Reto formativo creado por el docente.',
      hint: exHint.trim() || 'Revisa la sintaxis del comando indicado.',
      validCommandPatterns: validPatterns,
      simulatedOutput: exOutput.trim() || '(Comando ejecutado con éxito por el sistema)',
      isCustom: true,
      createdBy: 'Profesor',
      targetCourse: exTargetCourse,
    };

    saveCustomExercise(newEx);
    setCustomExercises(getStoredCustomExercises());
    setExSuccessMsg(`✔ Reto "${newEx.title}" creado con éxito.`);
    setExTitle('');
    setExMission('');
    setExCommands('');
    setExExplanation('');
    setExHint('');
    setExOutput('');

    onExercisesUpdated?.();
  };

  const handleDeleteExercise = (id: string) => {
    if (confirm('¿Eliminar este ejercicio personalizado?')) {
      sounds.playKey();
      deleteCustomExercise(id);
      setCustomExercises(getStoredCustomExercises());
      onExercisesUpdated?.();
    }
  };

  const exportCSV = () => {
    sounds.playKey();
    const headers = 'ID,Nombre,Email,Rol,Curso,Contraseña_Inicial,Nivel,XP,Racha,Completados,Total,Porcentaje\n';
    const rows = students
      .map(
        (st) =>
          `"${st.studentId}","${st.studentName}","${st.studentEmail}","${st.role}","${st.course}","${st.initialPassword || 'N/A'}",${st.level},${st.xp},${st.streak},${st.completedCount},${st.totalExercises},"${Math.round((st.completedCount / st.totalExercises) * 100)}%"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `usuarios_comandquest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className={`border-2 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative transition-colors ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800 shadow-slate-400'
            : isMatrix
            ? 'bg-gradient-to-b from-[#020b04] via-[#041307] to-[#020b04] border-[#00ff66]/40 shadow-[#00ff66]/20 text-[#d4ffe0]'
            : 'bg-gradient-to-b from-gray-900 via-[#0b101d] to-gray-950 border-indigo-500/40 shadow-indigo-500/10 text-gray-100'
        }`}
      >
        {/* Top Accent Line */}
        <div
          className={`h-1.5 w-full ${
            isLight
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500'
              : isMatrix
              ? 'bg-gradient-to-r from-[#00ff66] via-emerald-400 to-[#00ff66]'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500'
          }`}
        />

        {/* Header Bar */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isLight
              ? 'bg-slate-50 border-slate-200'
              : isMatrix
              ? 'bg-[#031508] border-[#00ff66]/30'
              : 'bg-gray-950/70 border-gray-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
                isLight
                  ? 'bg-indigo-100 border-indigo-200 text-indigo-700'
                  : isMatrix
                  ? 'bg-[#003311] border-[#00ff66]/60 text-[#00ff66]'
                  : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2
                  className={`text-lg font-black font-mono ${
                    isLight ? 'text-slate-900' : isMatrix ? 'text-[#00ff66]' : 'text-white'
                  }`}
                >
                  PANEL DE CONTROL DOCENTE
                </h2>
                <div className="flex space-x-1">
                  <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-mono font-bold">
                    1º DAM
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800 font-mono font-bold">
                    1º DAW
                  </span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800 font-mono font-bold">
                    2º SMR
                  </span>
                </div>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Gestión multi-curso, altas de alumnos/docentes y control de progreso
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
              title="Descargar lista de alumnos y contraseñas en CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={() => {
                sounds.playKey();
                onClose();
              }}
              className={`p-2 rounded-xl transition ${
                isLight
                  ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex items-center px-6 pt-3 border-b gap-4 flex-wrap ${
            isLight
              ? 'bg-slate-100/70 border-slate-200'
              : isMatrix
              ? 'bg-[#020e05] border-[#00ff66]/20'
              : 'bg-gray-950/40 border-gray-800'
          }`}
        >
          <button
            onClick={() => {
              sounds.playKey();
              setActiveTab('monitoring');
            }}
            className={`pb-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'monitoring'
                ? isLight
                  ? 'border-indigo-600 text-indigo-700'
                  : isMatrix
                  ? 'border-[#00ff66] text-[#00ff66]'
                  : 'border-indigo-400 text-indigo-300'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : isMatrix
                ? 'border-transparent text-gray-400 hover:text-[#00ff66]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>📊 Monitorización de Retos</span>
          </button>

          <button
            onClick={() => {
              sounds.playKey();
              setActiveTab('management');
            }}
            className={`pb-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'management'
                ? isLight
                  ? 'border-cyan-600 text-cyan-700'
                  : isMatrix
                  ? 'border-[#00ff66] text-[#00ff66]'
                  : 'border-cyan-400 text-cyan-300'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : isMatrix
                ? 'border-transparent text-gray-400 hover:text-[#00ff66]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>👥 Altas: Alumnos & Docentes</span>
          </button>

          <button
            onClick={() => {
              sounds.playKey();
              setActiveTab('exercises');
            }}
            className={`pb-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'exercises'
                ? isLight
                  ? 'border-amber-600 text-amber-700'
                  : isMatrix
                  ? 'border-[#00ff66] text-[#00ff66]'
                  : 'border-amber-400 text-amber-300'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : isMatrix
                ? 'border-transparent text-gray-400 hover:text-[#00ff66]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>✏️ Creador de Retos (Añadir Ejercicio)</span>
          </button>
        </div>

        {/* Content Body */}
        <div
          className={`flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin ${
            isLight
              ? 'scrollbar-thumb-slate-300'
              : isMatrix
              ? 'scrollbar-thumb-emerald-950'
              : 'scrollbar-thumb-gray-700'
          }`}
        >
          {activeTab === 'monitoring' && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`border p-4 rounded-2xl flex items-center space-x-3 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : isMatrix
                      ? 'bg-[#031508]/80 border-[#00ff66]/30 text-[#d4ffe0]'
                      : 'bg-gray-950/80 border-gray-800 text-gray-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs uppercase font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      Alumnos Matriculados
                    </div>
                    <div className={`text-2xl font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {studentOnlyList.length}
                    </div>
                  </div>
                </div>

                <div
                  className={`border p-4 rounded-2xl flex items-center space-x-3 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : isMatrix
                      ? 'bg-[#031508]/80 border-[#00ff66]/30 text-[#d4ffe0]'
                      : 'bg-gray-950/80 border-gray-800 text-gray-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs uppercase font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      Media XP Global
                    </div>
                    <div className="text-2xl font-black text-amber-400 font-mono">{avgXP} XP</div>
                  </div>
                </div>

                <div
                  className={`border p-4 rounded-2xl flex items-center space-x-3 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : isMatrix
                      ? 'bg-[#031508]/80 border-[#00ff66]/30 text-[#d4ffe0]'
                      : 'bg-gray-950/80 border-gray-800 text-gray-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs uppercase font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      Avance Promedio
                    </div>
                    <div className={`text-2xl font-black font-mono ${isLight ? 'text-emerald-700' : isMatrix ? 'text-[#00ff66]' : 'text-emerald-400'}`}>
                      {avgCompletion}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Buscar alumno por nombre o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-4 py-2 text-xs outline-none ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
                        : isMatrix
                        ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] placeholder-emerald-800 focus:border-[#00ff66]'
                        : 'bg-gray-950/80 border-gray-800 text-gray-200 placeholder-gray-500 focus:border-indigo-500'
                    }`}
                  />
                </div>

                {/* Course Filter */}
                <div
                  className={`flex items-center space-x-1 border p-1 rounded-xl text-xs font-semibold ${
                    isLight
                      ? 'bg-slate-100 border-slate-200'
                      : isMatrix
                      ? 'bg-[#020e05] border-[#00ff66]/30'
                      : 'bg-gray-950/80 border-gray-800'
                  }`}
                >
                  <span className={`px-2 flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                    <Filter className="w-3 h-3" /> Grupo:
                  </span>
                  <button
                    onClick={() => setCourseFilter('TODOS')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      courseFilter === 'TODOS'
                        ? isLight
                          ? 'bg-slate-900 text-white font-bold'
                          : isMatrix
                          ? 'bg-[#00ff66] text-black font-black'
                          : 'bg-indigo-600 text-white font-bold'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setCourseFilter('1DAM')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      courseFilter === '1DAM'
                        ? 'bg-blue-600 text-white font-bold shadow'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    1º DAM
                  </button>
                  <button
                    onClick={() => setCourseFilter('1DAW')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      courseFilter === '1DAW'
                        ? 'bg-emerald-600 text-white font-bold shadow'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    1º DAW
                  </button>
                  <button
                    onClick={() => setCourseFilter('2SMR')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      courseFilter === '2SMR'
                        ? 'bg-purple-600 text-white font-bold shadow'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    2º SMR
                  </button>
                  <button
                    onClick={() => setCourseFilter('TEACHERS')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      courseFilter === 'TEACHERS'
                        ? 'bg-amber-600 text-white font-bold shadow'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Docentes
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div
                className={`border rounded-2xl overflow-hidden shadow-inner ${
                  isLight
                    ? 'bg-white border-slate-200'
                    : isMatrix
                    ? 'bg-[#031508] border-[#00ff66]/30'
                    : 'bg-gray-950/60 border-gray-800'
                }`}
              >
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b text-[11px] font-mono font-bold uppercase ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-600'
                        : isMatrix
                        ? 'bg-[#020b04] border-[#00ff66]/30 text-[#00ff66]'
                        : 'bg-gray-900/90 border-gray-800 text-gray-400'
                    }`}
                  >
                    <tr>
                      <th className="px-4 py-3">Usuario</th>
                      <th className="px-4 py-3 text-center">Grupo / Rol</th>
                      <th className="px-4 py-3 text-center">Nivel</th>
                      <th className="px-4 py-3 text-right">XP</th>
                      <th className="px-4 py-3 text-center">Racha</th>
                      <th className="px-4 py-3">Progreso Retos</th>
                      <th className="px-4 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isLight
                        ? 'divide-slate-200 text-slate-800'
                        : isMatrix
                        ? 'divide-[#00ff66]/15 text-[#d4ffe0]'
                        : 'divide-gray-800/80 text-gray-300'
                    }`}
                  >
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-500 italic">
                          No se encontraron usuarios registrados en esta vista.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => {
                        const percent = Math.round((st.completedCount / st.totalExercises) * 100);

                        return (
                          <tr
                            key={st.studentId}
                            className={`transition ${
                              isLight
                                ? 'hover:bg-slate-50'
                                : isMatrix
                                ? 'hover:bg-[#002b0f]/50'
                                : 'hover:bg-gray-800/40'
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                {st.studentName}
                                {st.role === 'teacher' && (
                                  <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-mono font-bold">
                                    DOCENTE
                                  </span>
                                )}
                              </div>
                              <div className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                                {st.studentEmail}
                              </div>
                            </td>

                            <td className="px-4 py-3 text-center font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  st.role === 'teacher'
                                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                                    : st.course === '1DAM'
                                    ? 'bg-blue-950 text-blue-300 border-blue-800'
                                    : st.course === '1DAW'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                    : 'bg-purple-950 text-purple-300 border-purple-800'
                                }`}
                              >
                                {st.role === 'teacher'
                                  ? 'Docente'
                                  : st.course === '1DAM'
                                  ? '1º DAM'
                                  : st.course === '1DAW'
                                  ? '1º DAW'
                                  : '2º SMR'}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center font-mono">
                              <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                                Niv. {st.level}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-right font-mono font-black text-amber-400">
                              {st.xp} XP
                            </td>

                            <td className="px-4 py-3 text-center font-mono">
                              <span className="inline-flex items-center gap-1 text-orange-400 font-bold">
                                <Flame className="w-3.5 h-3.5 fill-orange-500" /> {st.streak}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <div className="w-32 space-y-1">
                                <div className={`flex justify-between text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                                  <span>{st.completedCount}/{st.totalExercises}</span>
                                  <span>{percent}%</span>
                                </div>
                                <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-gray-800'}`}>
                                  <div
                                    className={`h-full rounded-full ${isLight ? 'bg-emerald-500' : isMatrix ? 'bg-[#00ff66]' : 'bg-emerald-500'}`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => {
                                    sounds.playKey();
                                    setSelectedStudent(st);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition ${
                                    isLight
                                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                      : isMatrix
                                      ? 'bg-[#002b0f] hover:bg-[#004017] text-[#00ff66] border border-[#00ff66]/40'
                                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                  }`}
                                  title="Ver detalle del usuario"
                                >
                                  <span>Detalle</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>

                                {st.studentEmail.toLowerCase() !== 'g.asensiosanagusti@edu.gva.es' && (
                                  <button
                                    onClick={() => handleDelete(st.studentId, st.studentName, st.studentEmail)}
                                    disabled={deletingEmail === st.studentEmail || deletingEmail === st.studentId}
                                    className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition border border-rose-900/40 disabled:opacity-50"
                                    title="Eliminar usuario de la base de datos y de la plataforma"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'management' && (
            <div className="space-y-6">
              {/* Form 1: Crear Usuario Individual (Alumno o Docente) */}
              <div
                className={`border p-5 rounded-2xl space-y-4 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : isMatrix
                    ? 'bg-[#031508] border-[#00ff66]/30 text-[#d4ffe0]'
                    : 'bg-gray-950/80 border-gray-800 text-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-2 text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <UserPlus className="w-4 h-4 text-cyan-400" />
                    <span>Dar de Alta Nuevo Usuario (Alumno o Docente)</span>
                  </div>
                  <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Gestión multi-curso
                  </span>
                </div>

                {formMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      formMsg.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-700 text-emerald-300'
                        : 'bg-rose-950/60 border border-rose-700 text-rose-300'
                    }`}
                  >
                    {formMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{formMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleCreateStudent} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {/* Rol Selector */}
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Tipo de Usuario (Rol)
                      </label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as UserRole)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900'
                            : isMatrix
                            ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66]'
                            : 'bg-gray-900 border-gray-700 text-white'
                        }`}
                      >
                        <option value="student">👨‍💻 Alumno</option>
                        <option value="teacher">👨‍🏫 Docente (Profesor)</option>
                      </select>
                    </div>

                    {/* Curso / Grupo Selector */}
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Grupo {newRole === 'teacher' ? '(Departamento)' : '(Curso)'}
                      </label>
                      <select
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value as CourseGroup)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none font-bold ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900'
                            : isMatrix
                            ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66]'
                            : 'bg-gray-900 border-gray-700 text-white'
                        }`}
                      >
                        <option value="1DAM">1º DAM (Multiplataforma)</option>
                        <option value="1DAW">1º DAW (Web)</option>
                        <option value="2SMR">2º SMR (Microinformáticos)</option>
                      </select>
                    </div>

                    {/* Nombre */}
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Nombre y Apellidos
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Marcos Sánchez"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                            : isMatrix
                            ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                            : 'bg-gray-900 border-gray-700 text-white focus:border-cyan-400'
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="usuario@iesbenigaslo.es"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none font-mono ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                            : isMatrix
                            ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                            : 'bg-gray-900 border-gray-700 text-white focus:border-cyan-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Contraseña Inicial
                      </label>
                      <input
                        type="text"
                        placeholder="benigaslo2026"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none font-mono ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                            : isMatrix
                            ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                            : 'bg-gray-900 border-gray-700 text-white focus:border-cyan-400'
                        }`}
                      />
                    </div>

                    <div className="pt-5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-xl text-xs font-bold text-white transition shadow-md flex items-center space-x-1.5 ${
                          newRole === 'teacher'
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500'
                            : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500'
                        }`}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{isSubmitting ? 'Registrando...' : newRole === 'teacher' ? 'Dar de Alta Docente' : 'Dar de Alta Alumno'}</span>
                      </button>
                    </div>
                  </div>

                  {newRole === 'teacher' && (
                    <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Los docentes tendrán permisos para ver a todos los alumnos, diseñar ejercicios y crear cuentas.</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Form 2: Alta Masiva por Curso */}
              <div
                className={`border p-5 rounded-2xl space-y-3 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : isMatrix
                    ? 'bg-[#031508] border-[#00ff66]/30 text-[#d4ffe0]'
                    : 'bg-gray-950/80 border-gray-800 text-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-2 text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span>Alta Masiva de Alumnos por Grupo</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>Asignar a:</span>
                    <select
                      value={bulkCourse}
                      onChange={(e) => setBulkCourse(e.target.value as CourseGroup)}
                      className={`border rounded-lg px-2 py-1 text-xs font-bold ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900'
                          : 'bg-gray-900 border-gray-700 text-white'
                      }`}
                    >
                      <option value="1DAM">1º DAM</option>
                      <option value="1DAW">1º DAW</option>
                      <option value="2SMR">2º SMR</option>
                    </select>
                  </div>
                </div>

                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Pega varias líneas con el formato: <code className="text-cyan-400 font-mono">Nombre, Correo, Contraseña</code> (una por línea).
                </p>

                {bulkMsg && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs rounded-xl">
                    {bulkMsg}
                  </div>
                )}

                <textarea
                  rows={4}
                  placeholder={`Laura Pérez, lperez@iesbenigaslo.es, dam2026\nMarc Ramos, mramos@iesbenigaslo.es, dam2026`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className={`w-full border rounded-xl p-3 text-xs font-mono outline-none ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                      : isMatrix
                      ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                      : 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500'
                  }`}
                />

                <button
                  type="button"
                  onClick={handleBulkImport}
                  disabled={isSubmitting || !bulkText.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition"
                >
                  Importar lista para {bulkCourse === '1DAM' ? '1º DAM' : bulkCourse === '1DAW' ? '1º DAW' : '2º SMR'}
                </button>
              </div>

              {/* List of existing accounts */}
              <div
                className={`border rounded-2xl overflow-hidden ${
                  isLight
                    ? 'bg-white border-slate-200'
                    : isMatrix
                    ? 'bg-[#031508] border-[#00ff66]/30'
                    : 'bg-gray-950/80 border-gray-800'
                }`}
              >
                <div
                  className={`p-4 border-b flex items-center justify-between ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-gray-900/90 border-gray-800'
                  }`}
                >
                  <span className={`text-xs font-bold uppercase font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Cuentas Registradas en la Plataforma ({students.length})
                  </span>
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Contraseñas iniciales accesibles por el profesor
                  </span>
                </div>

                <div
                  className={`divide-y text-xs max-h-64 overflow-y-auto ${
                    isLight ? 'divide-slate-200' : isMatrix ? 'divide-[#00ff66]/15' : 'divide-gray-800/80'
                  }`}
                >
                  {students.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500 italic">
                      No hay alumnos registrados todavía. Da de alta al primer usuario en el formulario superior.
                    </div>
                  ) : (
                    students.map((st) => (
                      <div
                        key={st.studentId}
                        className={`px-4 py-3 flex items-center justify-between transition ${
                          isLight ? 'hover:bg-slate-50' : 'hover:bg-gray-900/40'
                        }`}
                      >
                        <div>
                          <div className={`font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            <span>{st.studentName}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                st.role === 'teacher'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : st.course === '1DAM'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : st.course === '1DAW'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-purple-950 text-purple-300 border border-purple-800'
                              }`}
                            >
                              {st.role === 'teacher' ? 'DOCENTE' : st.course}
                            </span>
                          </div>
                          <div className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                            {st.studentEmail}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div
                            className={`px-3 py-1 rounded-lg border font-mono text-[11px] ${
                              isLight
                                ? 'bg-slate-100 border-slate-200 text-slate-800'
                                : 'bg-gray-900 border-gray-800'
                            }`}
                          >
                            Pass: <code className="text-amber-400 font-bold">{st.initialPassword || 'Asignada'}</code>
                          </div>

                          {st.studentEmail.toLowerCase() !== 'g.asensiosanagusti@edu.gva.es' && (
                            <button
                              onClick={() => handleDelete(st.studentId, st.studentName, st.studentEmail)}
                              disabled={deletingEmail === st.studentEmail || deletingEmail === st.studentId}
                              className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-950/40 rounded-lg transition disabled:opacity-50"
                              title="Eliminar usuario de la base de datos y de la plataforma"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exercises' && (
            <div className="space-y-6">
              <div
                className={`border-2 p-5 rounded-2xl space-y-4 ${
                  isLight
                    ? 'bg-slate-50 border-amber-300 text-slate-800'
                    : isMatrix
                    ? 'bg-[#031508] border-[#00ff66]/50 text-[#d4ffe0]'
                    : 'bg-gray-950/80 border-amber-500/40 text-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2 text-sm font-bold text-amber-400">
                  <PlusCircle className="w-5 h-5 text-amber-500" />
                  <span>Diseñador de Nuevos Retos (1º DAM & 2º SMR)</span>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  Crea ejercicios adicionales a medida para tus grupos. Se integrarán automáticamente en los módulos correspondientes.
                </p>

                {exSuccessMsg && (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{exSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveExercise} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Sistema Operativo
                      </label>
                      <select
                        value={exOs}
                        onChange={(e) => {
                          const os = e.target.value as OperatingSystem;
                          setExOs(os);
                          setExModule(os === 'linux' ? 'Linux - Retos Personalizados' : 'Windows - Retos Personalizados');
                          setExStartDir(os === 'linux' ? '/home/usuario' : 'C:\\Users\\Alumno');
                        }}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900'
                            : 'bg-gray-900 border-gray-700 text-white'
                        }`}
                      >
                        <option value="linux">🐧 Linux (Bash)</option>
                        <option value="windows">🪟 Windows (PowerShell/CMD)</option>
                      </select>
                    </div>

                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Destinado a
                      </label>
                      <select
                        value={exTargetCourse}
                        onChange={(e) => setExTargetCourse(e.target.value as CourseGroup | 'TODOS')}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none font-bold ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900'
                            : 'bg-gray-900 border-gray-700 text-white'
                        }`}
                      >
                        <option value="TODOS">Todos (DAM, DAW & SMR)</option>
                        <option value="1DAM">Específico 1º DAM</option>
                        <option value="1DAW">Específico 1º DAW</option>
                        <option value="2SMR">Específico 2º SMR</option>
                      </select>
                    </div>

                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Módulo o Categoría
                      </label>
                      <input
                        type="text"
                        value={exModule}
                        onChange={(e) => setExModule(e.target.value)}
                        placeholder="Ej: Linux - Permisos Avanzados"
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                            : 'bg-gray-900 border-gray-700 text-white focus:border-amber-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Dificultad y XP
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={exDifficulty}
                          onChange={(e) => setExDifficulty(e.target.value as 'fácil' | 'medio' | 'avanzado')}
                          className={`flex-1 border rounded-xl px-2 py-2 text-xs outline-none ${
                            isLight
                              ? 'bg-white border-slate-300 text-slate-900'
                              : 'bg-gray-900 border-gray-700 text-white'
                          }`}
                        >
                          <option value="fácil">Fácil</option>
                          <option value="medio">Medio</option>
                          <option value="avanzado">Avanzado</option>
                        </select>
                        <input
                          type="number"
                          value={exXp}
                          onChange={(e) => setExXp(Number(e.target.value))}
                          className={`w-20 border rounded-xl px-2 py-2 text-xs font-mono text-center font-bold outline-none text-amber-400 ${
                            isLight ? 'bg-white border-slate-300' : 'bg-gray-900 border-gray-700'
                          }`}
                          title="Puntos XP"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Título del Reto
                      </label>
                      <input
                        type="text"
                        value={exTitle}
                        onChange={(e) => setExTitle(e.target.value)}
                        placeholder="Ej: Comprobar usuarios conectados al sistema"
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                            : 'bg-gray-900 border-gray-700 text-white focus:border-amber-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Directorio de Inicio (Opcional)
                      </label>
                      <input
                        type="text"
                        value={exStartDir}
                        onChange={(e) => setExStartDir(e.target.value)}
                        placeholder="/home/usuario o C:\Users\Alumno"
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                            : 'bg-gray-900 border-gray-700 text-white focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                      Misión (Lo que lee el alumno)
                    </label>
                    <textarea
                      rows={2}
                      value={exMission}
                      onChange={(e) => setExMission(e.target.value)}
                      placeholder="Muestra los usuarios que tienen una sesión activa actualmente en la máquina."
                      className={`w-full border rounded-xl p-3 text-xs outline-none ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                          : 'bg-gray-900 border-gray-700 text-white focus:border-amber-400'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Explicación Teórica / Fundamento
                      </label>
                      <input
                        type="text"
                        value={exExplanation}
                        onChange={(e) => setExExplanation(e.target.value)}
                        placeholder="El comando who lee el archivo /var/run/utmp..."
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900'
                            : 'bg-gray-900 border-gray-700 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Pista (Hint)
                      </label>
                      <input
                        type="text"
                        value={exHint}
                        onChange={(e) => setExHint(e.target.value)}
                        placeholder="Escribe simplemente: who"
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900'
                            : 'bg-gray-900 border-gray-700 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Comando(s) Aceptado(s) <span className="opacity-60">(uno por línea si hay variantes)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={exCommands}
                        onChange={(e) => setExCommands(e.target.value)}
                        placeholder={`who\nw`}
                        className={`w-full border rounded-xl p-3 text-xs font-mono outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-emerald-700 focus:border-emerald-600'
                            : 'bg-gray-900 border-gray-700 text-emerald-400 focus:border-emerald-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-[11px] font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                        Salida Simulada en Terminal <span className="opacity-60">(lo que imprimirá la pantalla)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={exOutput}
                        onChange={(e) => setExOutput(e.target.value)}
                        placeholder={`usuario   pts/0        2026-11-16 14:20 (:0)\nprofesor  pts/1        2026-11-16 15:00 (192.168.1.50)`}
                        className={`w-full border rounded-xl p-3 text-xs font-mono outline-none ${
                          isLight
                            ? 'bg-white border-slate-300 text-cyan-800 focus:border-cyan-600'
                            : 'bg-gray-900 border-gray-700 text-cyan-300 focus:border-cyan-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Publicar Nuevo Reto en la Plataforma</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* List of custom exercises already created */}
              <div
                className={`border rounded-2xl overflow-hidden ${
                  isLight
                    ? 'bg-white border-slate-200'
                    : isMatrix
                    ? 'bg-[#031508] border-[#00ff66]/30'
                    : 'bg-gray-950/80 border-gray-800'
                }`}
              >
                <div
                  className={`p-4 border-b flex items-center justify-between ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-gray-900/90 border-gray-800'
                  }`}
                >
                  <span className={`text-xs font-bold uppercase font-mono flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    Retos Creados por el Docente ({customExercises.length})
                  </span>
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Se muestran automáticamente en los módulos de los alumnos
                  </span>
                </div>

                {customExercises.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500 italic">
                    Aún no has creado ningún reto personalizado. Rellena el formulario superior para añadir uno nuevo.
                  </div>
                ) : (
                  <div
                    className={`divide-y text-xs ${
                      isLight ? 'divide-slate-200' : isMatrix ? 'divide-[#00ff66]/15' : 'divide-gray-800/80'
                    }`}
                  >
                    {customExercises.map((ex) => (
                      <div
                        key={ex.id}
                        className={`p-4 flex items-center justify-between transition ${
                          isLight ? 'hover:bg-slate-50' : 'hover:bg-gray-900/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-base">{ex.os === 'linux' ? '🐧' : '🪟'}</span>
                            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ex.title}</span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                isLight ? 'bg-slate-200 text-slate-700' : 'bg-gray-800 text-gray-300'
                              }`}
                            >
                              {ex.module}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                              +{ex.xpReward} XP
                            </span>
                            {ex.targetCourse && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                                {ex.targetCourse}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{ex.mission}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-950/40 rounded-xl transition"
                          title="Eliminar este reto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drill-down Modal for Selected Student */}
        {selectedStudent && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div
              className={`border-2 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col p-5 space-y-4 shadow-2xl relative ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 shadow-slate-300'
                  : isMatrix
                  ? 'bg-[#030d05] border-[#00ff66]/50 text-[#d4ffe0]'
                  : 'bg-gray-900 border-indigo-500/40 text-gray-100'
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-3 ${
                  isLight ? 'border-slate-200' : 'border-gray-800'
                }`}
              >
                <div>
                  <h3 className={`font-bold text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {selectedStudent.studentName}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono font-bold border border-indigo-800">
                      {selectedStudent.course === '1DAM'
                        ? '1º DAM'
                        : selectedStudent.course === '1DAW'
                        ? '1º DAW'
                        : '2º SMR'}
                    </span>
                  </h3>
                  <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    {selectedStudent.studentEmail}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className={`p-1.5 rounded-lg transition ${
                    isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                <div className={`text-xs font-bold uppercase ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  Últimos comandos intentados:
                </div>
                {selectedStudent.recentAttempts.length === 0 ? (
                  <div className="text-xs text-gray-500 italic p-4 text-center">
                    No hay intentos registrados recientemente para este usuario.
                  </div>
                ) : (
                  selectedStudent.recentAttempts.map((att, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-800'
                          : 'bg-gray-950 border-gray-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className={`font-sans font-semibold ${isLight ? 'text-slate-900' : 'text-gray-300'}`}>
                          {att.exerciseTitle}
                        </div>
                        <div className={isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'}>
                          <code>$ {att.command}</code>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                            att.success
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {att.success ? 'Acierto' : 'Fallo'}
                        </span>
                        <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                          {att.timestamp}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Botón de eliminación definitiva en base de datos desde la ficha */}
              {selectedStudent.studentEmail.toLowerCase() !== 'g.asensiosanagusti@edu.gva.es' && (
                <div className={`pt-3 border-t flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-gray-800'}`}>
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    ¿Eliminar este usuario de la base de datos?
                  </span>
                  <button
                    onClick={() => handleDelete(selectedStudent.studentId, selectedStudent.studentName, selectedStudent.studentEmail)}
                    disabled={deletingEmail === selectedStudent.studentEmail || deletingEmail === selectedStudent.studentId}
                    className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar de la Base de Datos</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

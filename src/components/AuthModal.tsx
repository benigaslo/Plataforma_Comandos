import React, { useState, useEffect } from 'react';
import { UserProfile, ThemeMode, CourseGroup } from '../types';
import {
  loginWithCredentials,
  logoutUser,
  getStoredStudents,
  switchRole,
} from '../lib/supabase';
import { sounds } from '../lib/sound';
import {
  LogIn,
  UserCheck,
  ShieldAlert,
  Info,
  X,
  LogOut,
  GraduationCap,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  theme?: ThemeMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  theme = 'matrix',
}) => {
  const [tab, setTab] = useState<'credentials' | 'quickselect'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStudentEmail, setSelectedStudentEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseGroup>('1DAM');
  const [quickPassword, setQuickPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [availableStudents, setAvailableStudents] = useState<
    { name: string; email: string; course: CourseGroup; role: string }[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      const list = getStoredStudents().map((s) => ({
        name: s.studentName,
        email: s.studentEmail,
        course: s.course,
        role: s.role,
      }));
      setAvailableStudents(list);
      if (list.length > 0 && !selectedStudentEmail) {
        const first = list.find((s) => s.course === selectedCourse && s.role !== 'teacher') || list[0];
        if (first) setSelectedStudentEmail(first.email);
      }
    }
  }, [isOpen, selectedCourse]);

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Introduce tu correo electrónico');
      return;
    }

    sounds.playKey();
    setErrorMsg('');
    setLoading(true);

    const res = await loginWithCredentials(email, password);
    setLoading(false);

    if (res.success && res.user) {
      sounds.playSuccess();
      setSuccessMsg(`¡Bienvenido/a, ${res.user.name}!`);
      setTimeout(() => {
        onUserChange(res.user!);
        onClose();
      }, 700);
    } else {
      sounds.playError();
      setErrorMsg(res.message || 'Error al iniciar sesión');
    }
  };

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentEmail) {
      setErrorMsg('Selecciona tu nombre en la lista');
      return;
    }

    sounds.playKey();
    setErrorMsg('');
    setLoading(true);

    const res = await loginWithCredentials(selectedStudentEmail, quickPassword);
    setLoading(false);

    if (res.success && res.user) {
      sounds.playSuccess();
      setSuccessMsg(`¡Sesión iniciada como ${res.user.name}!`);
      setTimeout(() => {
        onUserChange(res.user!);
        onClose();
      }, 700);
    } else {
      sounds.playError();
      setErrorMsg(res.message || 'Contraseña incorrecta');
    }
  };

  const handleLogout = async () => {
    sounds.playKey();
    await logoutUser();
    onUserChange(null);
    onClose();
  };

  const selectDemoRole = (role: 'student' | 'teacher') => {
    sounds.playKey();
    const u = switchRole(role);
    onUserChange(u);
    onClose();
  };

  const filteredStudents = availableStudents.filter(
    (s) => s.course === selectedCourse && s.role !== 'teacher'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className={`border-2 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative transition-colors ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800 shadow-slate-400'
            : isMatrix
            ? 'bg-[#030d05] border-[#00ff66]/40 shadow-[#00ff66]/20 text-[#d4ffe0]'
            : 'bg-gray-900 border-cyan-500/30 text-gray-100 shadow-cyan-950/30'
        }`}
      >
        <button
          onClick={() => {
            sounds.playKey();
            onClose();
          }}
          className={`absolute top-5 right-5 p-1.5 rounded-xl transition ${
            isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center">
          <div
            className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
              isLight
                ? 'bg-emerald-100 border border-emerald-300 text-emerald-700 shadow-emerald-200'
                : isMatrix
                ? 'bg-[#003311] border border-[#00ff66]/60 text-[#00ff66] shadow-[#00ff66]/30'
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
            }`}
          >
            <LogIn className="w-6 h-6" />
          </div>
          <h2
            className={`text-xl font-black font-mono tracking-wide ${
              isLight ? 'text-slate-900' : isMatrix ? 'text-[#00ff66] matrix-glow' : 'text-white'
            }`}
          >
            Acceso a ComandQuest
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            Entra con tu cuenta para guardar tu XP, insignias y progreso en el aula
          </p>
        </div>

        {/* Current Active User Status */}
        {currentUser && (
          <div
            className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : isMatrix
                ? 'bg-[#002b0f]/60 border-[#00ff66]/30 text-[#d4ffe0]'
                : 'bg-gray-950 border-gray-800 text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              <span className="text-base">{currentUser.avatar || '👨‍💻'}</span>
              <div className="truncate">
                <div className="font-bold truncate">{currentUser.name}</div>
                <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  {currentUser.role === 'teacher'
                    ? 'Docente'
                    : currentUser.course === '1DAW'
                    ? '1º DAW'
                    : currentUser.course === '2SMR'
                    ? '2º SMR'
                    : '1º DAM'} • {currentUser.xp} XP
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 rounded-xl text-[11px] font-bold flex items-center gap-1 transition"
              title="Cerrar la sesión actual"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        )}

        {/* Status Messages */}
        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-700 p-3 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/60 border border-emerald-600 p-3 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div
          className={`flex p-1 rounded-2xl border text-xs font-bold ${
            isLight ? 'bg-slate-100 border-slate-200' : isMatrix ? 'bg-[#011406] border-[#00ff66]/20' : 'bg-gray-950 border-gray-800'
          }`}
        >
          <button
            onClick={() => {
              sounds.playKey();
              setTab('credentials');
            }}
            className={`flex-1 py-1.5 rounded-xl transition text-center ${
              tab === 'credentials'
                ? isLight
                  ? 'bg-white text-slate-900 shadow font-bold'
                  : isMatrix
                  ? 'bg-[#00ff66] text-black font-black'
                  : 'bg-cyan-500 text-black font-bold'
                : isLight
                ? 'text-slate-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Correo y Contraseña
          </button>
          <button
            onClick={() => {
              sounds.playKey();
              setTab('quickselect');
            }}
            className={`flex-1 py-1.5 rounded-xl transition text-center ${
              tab === 'quickselect'
                ? isLight
                  ? 'bg-white text-slate-900 shadow font-bold'
                  : isMatrix
                  ? 'bg-[#00ff66] text-black font-black'
                  : 'bg-cyan-500 text-black font-bold'
                : isLight
                ? 'text-slate-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Selector Rápido de Clase
          </button>
        </div>

        {/* TAB 1: FORMULARIO CORREO / CONTRASEÑA */}
        {tab === 'credentials' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className={`text-xs block mb-1 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alumno@iesbenigaslo.es"
                required
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none font-mono ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    : isMatrix
                    ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                    : 'bg-gray-950 border-gray-800 text-white focus:border-cyan-400'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs block mb-1 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none font-mono ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    : isMatrix
                    ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                    : 'bg-gray-950 border-gray-800 text-white focus:border-cyan-400'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1.5 ${
                isLight
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : isMatrix
                  ? 'bg-[#00ff66] hover:bg-[#20ff77] text-black font-black'
                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Accediendo...' : 'Iniciar Sesión'}</span>
            </button>
          </form>
        )}

        {/* TAB 2: SELECTOR RÁPIDO DE ALUMNO EN CLASE */}
        {tab === 'quickselect' && (
          <form onSubmit={handleQuickLogin} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playKey();
                  setSelectedCourse('1DAM');
                }}
                className={`py-1.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                  selectedCourse === '1DAM'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-gray-950 border-gray-800 text-gray-400'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>1º DAM</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playKey();
                  setSelectedCourse('1DAW');
                }}
                className={`py-1.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                  selectedCourse === '1DAW'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-gray-950 border-gray-800 text-gray-400'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>1º DAW</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playKey();
                  setSelectedCourse('2SMR');
                }}
                className={`py-1.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                  selectedCourse === '2SMR'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-gray-950 border-gray-800 text-gray-400'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>2º SMR</span>
              </button>
            </div>

            <div>
              <label className={`text-xs block mb-1 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                Selecciona tu Nombre
              </label>
              <select
                value={selectedStudentEmail}
                onChange={(e) => setSelectedStudentEmail(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : isMatrix
                    ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66]'
                    : 'bg-gray-950 border-gray-800 text-white'
                }`}
              >
                {filteredStudents.length === 0 ? (
                  <option value="">No hay alumnos cargados en este curso</option>
                ) : (
                  filteredStudents.map((st) => (
                    <option key={st.email} value={st.email}>
                      {st.name} ({st.email})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className={`text-xs block mb-1 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                Contraseña Asignada
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={quickPassword}
                  onChange={(e) => setQuickPassword(e.target.value)}
                  placeholder="Tu contraseña del IES"
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none font-mono ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                      : isMatrix
                      ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                      : 'bg-gray-950 border-gray-800 text-white focus:border-cyan-400'
                  }`}
                />
                <KeyRound className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedStudentEmail}
              className={`w-full py-2.5 font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1.5 ${
                isLight
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : isMatrix
                  ? 'bg-[#00ff66] hover:bg-[#20ff77] text-black font-black'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Accediendo...' : 'Entrar con mi Alumno'}</span>
            </button>
          </form>
        )}

        {/* Demo Fast Switch (For quick test switching) */}
        <div className={`pt-2 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-gray-800'}`}>
          <div className={`text-[11px] text-center flex items-center justify-center gap-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Accesos rápidos de prueba de desarrollo:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => selectDemoRole('student')}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-1 transition ${
                currentUser?.role === 'student'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Alumno Demo</span>
            </button>

            <button
              onClick={() => selectDemoRole('teacher')}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-1 transition ${
                currentUser?.role === 'teacher'
                  ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                  : isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              <span>Docente Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

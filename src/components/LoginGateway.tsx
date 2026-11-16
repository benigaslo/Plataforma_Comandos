import React, { useState, useEffect } from 'react';
import { UserProfile, CourseGroup, ThemeMode } from '../types';
import {
  loginWithCredentials,
  getStoredStudents,
  loginAsGuest,
  switchRole,
} from '../lib/supabase';
import { sounds } from '../lib/sound';
import { MatrixRain } from './MatrixRain';
import {
  Terminal,
  LogIn,
  GraduationCap,
  KeyRound,
  ShieldAlert,
  AlertCircle,
  Sun,
  Moon,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface LoginGatewayProps {
  onLoginSuccess: (user: UserProfile) => void;
  theme: ThemeMode;
  onSelectTheme: (t: ThemeMode) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  onLoginSuccess,
  theme,
  onSelectTheme,
}) => {
  const [tab, setTab] = useState<'student' | 'teacher'>('student');
  const [selectedCourse, setSelectedCourse] = useState<CourseGroup>('1DAM');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Teacher / Email form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [authorizing, setAuthorizing] = useState(false);
  const [authorizedUser, setAuthorizedUser] = useState<UserProfile | null>(null);

  const [students, setStudents] = useState<
    { name: string; email: string; course: CourseGroup; role: string }[]
  >([]);

  useEffect(() => {
    const list = getStoredStudents().map((s) => ({
      name: s.studentName,
      email: s.studentEmail,
      course: s.course,
      role: s.role,
    }));
    setStudents(list);

    const first = list.find((s) => s.course === selectedCourse && s.role !== 'teacher');
    if (first) {
      setStudentEmail(first.email);
    } else {
      setStudentEmail('');
    }
  }, [selectedCourse]);

  const isLight = theme === 'light';
  const isMatrix = theme === 'matrix';

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) {
      setErrorMsg('Por favor, selecciona tu nombre de la lista');
      return;
    }

    sounds.playKey();
    setErrorMsg('');
    setLoading(true);

    const res = await loginWithCredentials(studentEmail, studentPassword);
    setLoading(false);

    if (res.success && res.user) {
      triggerAccessGranted(res.user);
    } else {
      sounds.playError();
      setErrorMsg(res.message || 'Contraseña incorrecta. Consulta a tu profesor.');
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Introduce tu correo y contraseña');
      return;
    }

    sounds.playKey();
    setErrorMsg('');
    setLoading(true);

    const res = await loginWithCredentials(email, password);
    setLoading(false);

    if (res.success && res.user) {
      triggerAccessGranted(res.user);
    } else {
      sounds.playError();
      setErrorMsg(res.message || 'Credenciales incorrectas');
    }
  };

  const handleGuestLogin = () => {
    sounds.playKey();
    const guest = loginAsGuest();
    triggerAccessGranted(guest);
  };

  const handleQuickDemo = (role: 'student' | 'teacher') => {
    sounds.playKey();
    const user = switchRole(role);
    triggerAccessGranted(user);
  };

  const triggerAccessGranted = (user: UserProfile) => {
    sounds.playSuccess();
    setAuthorizedUser(user);
    setAuthorizing(true);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 900);
  };

  const filteredStudents = students.filter(
    (s) => s.course === selectedCourse && s.role !== 'teacher'
  );

  return (
    <div
      className={`min-h-screen flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
        isLight
          ? 'bg-slate-50 text-slate-800'
          : isMatrix
          ? 'bg-[#020904] text-[#d4ffe0]'
          : 'bg-[#090d16] text-gray-100'
      }`}
    >
      {/* Matrix Digital Rain Animation */}
      {isMatrix && <MatrixRain opacity={0.25} speedMs={80} />}

      {/* Top Bar with Theme Selector */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-md ${
              isLight
                ? 'bg-emerald-600 text-white'
                : isMatrix
                ? 'bg-[#00ff66] text-black shadow-[#00ff66]/40'
                : 'bg-cyan-500 text-black'
            }`}
          >
            <Terminal className="w-5 h-5 font-black" />
          </div>
          <span className="font-mono font-black text-sm tracking-wider uppercase">
            {isMatrix ? 'COMANDQUEST // GATEWAY' : 'COMANDQUEST'}
          </span>
        </div>

        {/* Theme Buttons */}
        <div
          className={`flex items-center p-1 rounded-2xl border text-xs font-semibold ${
            isLight ? 'bg-white border-slate-200' : 'bg-gray-900/90 border-gray-800'
          }`}
        >
          <button
            onClick={() => onSelectTheme('light')}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition ${
              theme === 'light'
                ? 'bg-amber-100 text-amber-900 font-bold shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Tema Claro"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Claro</span>
          </button>

          <button
            onClick={() => onSelectTheme('dark')}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition ${
              theme === 'dark'
                ? 'bg-gray-800 text-cyan-300 font-bold shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Tema Oscuro"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Oscuro</span>
          </button>

          <button
            onClick={() => onSelectTheme('matrix')}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition ${
              theme === 'matrix'
                ? 'bg-[#00ff66] text-black font-black shadow-sm'
                : 'text-gray-400 hover:text-[#00ff66]'
            }`}
            title="Tema Matrix"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Matrix</span>
          </button>
        </div>
      </header>

      {/* Main Gateway Card */}
      <main className="relative z-20 flex-1 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-lg rounded-3xl border-2 p-6 sm:p-8 space-y-6 shadow-2xl relative transition-all ${
            isLight
              ? 'bg-white/95 border-slate-300 shadow-slate-300/80 backdrop-blur-md'
              : isMatrix
              ? 'bg-[#030d05]/95 border-[#00ff66]/40 shadow-2xl shadow-[#00ff66]/15 backdrop-blur-md text-[#d4ffe0]'
              : 'bg-gray-950/90 border-cyan-500/30 shadow-2xl shadow-cyan-950/40 backdrop-blur-md text-gray-100'
          }`}
        >
          {/* Cyberpunk Top Neon Accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${
              isLight
                ? 'bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600'
                : isMatrix
                ? 'bg-gradient-to-r from-[#00ff66] via-emerald-400 to-[#00ff66]'
                : 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500'
            }`}
          />

          {/* Hero Branding */}
          <div className="text-center space-y-2 pt-1">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : isMatrix
                    ? 'bg-[#002b0f] text-[#00ff66] border-[#00ff66]/60'
                    : 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                }`}
              >
                1º DAM & 2º SMR
              </span>
              <span
                className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                    : isMatrix
                    ? 'bg-[#001f0a] text-[#00ff66] border-[#00ff66]/40'
                    : 'bg-gray-900 text-gray-300 border-gray-700'
                }`}
              >
                IES Benigaslo
              </span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-black font-mono tracking-wider ${
                isLight
                  ? 'text-slate-900'
                  : isMatrix
                  ? 'text-[#00ff66] matrix-glow'
                  : 'bg-gradient-to-r from-emerald-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent'
              }`}
            >
              COMANDQUEST
            </h1>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
              Plataforma Gamificada de Comandos • Linux Bash & Windows PowerShell
            </p>
          </div>

          {/* Access Granted Animation Overlay */}
          {authorizing && authorizedUser && (
            <div
              className={`p-6 rounded-2xl border text-center space-y-3 animate-in zoom-in-95 duration-300 ${
                isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : isMatrix
                  ? 'bg-[#002b0f] border-[#00ff66] text-[#00ff66]'
                  : 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
              }`}
            >
              <div className="text-3xl animate-bounce">⚡</div>
              <div className="font-mono font-black text-sm uppercase tracking-wider">
                [ ACCESO AUTORIZADO ]
              </div>
              <div className="text-xs">
                Iniciando sesión como <strong className="underline">{authorizedUser.name}</strong> ({authorizedUser.course || 'DAM/SMR'})...
              </div>
            </div>
          )}

          {/* Normal Login Forms */}
          {!authorizing && (
            <>
              {/* Role Selection Tabs */}
              <div
                className={`flex p-1 rounded-2xl border text-xs font-bold ${
                  isLight
                    ? 'bg-slate-100 border-slate-200'
                    : isMatrix
                    ? 'bg-[#011406] border-[#00ff66]/30'
                    : 'bg-gray-900 border-gray-800'
                }`}
              >
                <button
                  onClick={() => {
                    sounds.playKey();
                    setTab('student');
                  }}
                  className={`flex-1 py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${
                    tab === 'student'
                      ? isLight
                        ? 'bg-white text-slate-900 shadow font-bold'
                        : isMatrix
                        ? 'bg-[#00ff66] text-black font-black shadow-md shadow-[#00ff66]/30'
                        : 'bg-cyan-500 text-black font-black shadow-md shadow-cyan-500/20'
                      : isLight
                      ? 'text-slate-600'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Acceso Alumnos</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playKey();
                    setTab('teacher');
                  }}
                  className={`flex-1 py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${
                    tab === 'teacher'
                      ? isLight
                        ? 'bg-white text-slate-900 shadow font-bold'
                        : isMatrix
                        ? 'bg-[#00ff66] text-black font-black shadow-md shadow-[#00ff66]/30'
                        : 'bg-cyan-500 text-black font-black shadow-md shadow-cyan-500/20'
                      : isLight
                      ? 'text-slate-600'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Acceso Docente</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-rose-950/70 border border-rose-700 p-3 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* TAB 1: ACCESO ALUMNOS (FAST SELECTOR) */}
              {tab === 'student' && (
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  {/* Course Group Selector */}
                  <div>
                    <label className={`text-xs block mb-1.5 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                      1. Elige tu Grupo:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playKey();
                          setSelectedCourse('1DAM');
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                          selectedCourse === '1DAM'
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                            : isLight
                            ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">💻</span>
                        <span>1º DAM</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sounds.playKey();
                          setSelectedCourse('2SMR');
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                          selectedCourse === '2SMR'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                            : isLight
                            ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">🛠️</span>
                        <span>2º SMR</span>
                      </button>
                    </div>
                  </div>

                  {/* Student Select */}
                  <div>
                    <label className={`text-xs block mb-1.5 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                      2. Selecciona tu Nombre de Alumno:
                    </label>
                    <select
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none font-medium ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                          : isMatrix
                          ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-cyan-400'
                      }`}
                    >
                      {filteredStudents.length === 0 ? (
                        <option value="">Aún no hay alumnos dados de alta en este grupo</option>
                      ) : (
                        filteredStudents.map((st) => (
                          <option key={st.email} value={st.email}>
                            {st.name} ({st.email})
                          </option>
                        ))
                      )}
                    </select>

                    {filteredStudents.length === 0 && (
                      <p className={`text-[11px] mt-1.5 flex items-center gap-1.5 font-mono p-2 rounded-xl border ${
                        isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                      }`}>
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                        <span>Aún no hay alumnos registrados en este curso. El docente puede crearlos desde "Acceso Docente".</span>
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className={`text-xs block mb-1.5 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                      3. Contraseña:
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Contraseña facilitada por el profesor"
                        required
                        className={`w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                            : isMatrix
                            ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                            : 'bg-gray-900 border-gray-800 text-white focus:border-cyan-400'
                        }`}
                      />
                      <KeyRound className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !studentEmail}
                    className={`w-full py-3 font-mono font-black uppercase tracking-wider rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-2 ${
                      isLight
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                        : isMatrix
                        ? 'bg-[#00ff66] hover:bg-[#20ff77] text-black shadow-lg shadow-[#00ff66]/30'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-cyan-500/20'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{loading ? 'Verificando...' : 'Acceder al Terminal de Comandos'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* TAB 2: ACCESO DOCENTE / CORREO */}
              {tab === 'teacher' && (
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div>
                    <label className={`text-xs block mb-1.5 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                      Correo Electrónico Docente
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="profesor@iesbenigaslo.es"
                      required
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                          : isMatrix
                          ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-indigo-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs block mb-1.5 font-medium ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                          : isMatrix
                          ? 'bg-[#011406] border-[#00ff66]/40 text-[#00ff66] focus:border-[#00ff66]'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-indigo-400'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 font-mono font-black uppercase tracking-wider rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{loading ? 'Accediendo...' : 'Iniciar Sesión Docente'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Guest / Demo shortcuts */}
              <div className={`pt-3 border-t flex flex-col items-center space-y-2.5 ${isLight ? 'border-slate-200' : 'border-gray-800'}`}>
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className={`text-xs font-medium hover:underline flex items-center gap-1 transition ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-cyan-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Probar en modo invitado (práctica libre sin guardar progreso)</span>
                </button>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                  <span>Pruebas rápidas:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('student')}
                    className="hover:underline text-cyan-400 font-mono"
                  >
                    Alumno Demo
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('teacher')}
                    className="hover:underline text-indigo-400 font-mono"
                  >
                    Docente Demo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-3 text-center text-[11px] text-gray-500 font-mono">
        IES Benigaslo • Curso 2025/2026 • Sistemas Informáticos (DAM & SMR)
      </footer>
    </div>
  );
};

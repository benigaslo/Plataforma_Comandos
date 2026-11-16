import React, { useState, useEffect } from 'react';
import { StudentProgressRow } from '../types';
import { fetchClassroomProgress } from '../lib/supabase';
import { sounds } from '../lib/sound';
import {
  Users,
  Search,
  Download,
  CheckCircle,
  Sparkles,
  Flame,
  KeyRound,
  ExternalLink,
  ChevronRight,
  X,
  GraduationCap,
} from 'lucide-react';

interface TeacherPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState<StudentProgressRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressRow | null>(null);
  const [showProvisioningGuide, setShowProvisioningGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClassroomProgress().then(setStudents);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredStudents = students.filter(
    (st) =>
      st.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalXP = students.reduce((acc, st) => acc + st.xp, 0);
  const avgXP = students.length ? Math.round(totalXP / students.length) : 0;
  const avgCompletion = students.length
    ? Math.round(
        (students.reduce((acc, st) => acc + st.completedCount, 0) /
          (students.length * (students[0]?.totalExercises || 20))) *
          100
      )
    : 0;

  const exportCSV = () => {
    sounds.playKey();
    const headers = 'ID,Nombre,Email,Nivel,XP,Racha,Completados,Total,Porcentaje\n';
    const rows = students
      .map(
        (st) =>
          `"${st.studentId}","${st.studentName}","${st.studentEmail}",${st.level},${st.xp},${st.streak},${st.completedCount},${st.totalExercises},"${Math.round((st.completedCount / st.totalExercises) * 100)}%"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `calificaciones_comandquest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">Panel de Control Docente</h2>
                <span className="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-800 font-mono">
                  1º DAM • SINF
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Supervisión del progreso, intentos y calificaciones del alumnado en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowProvisioningGuide(!showProvisioningGuide)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Gestión de Usuarios</span>
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={() => {
                sounds.playKey();
                onClose();
              }}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-950/80 border border-gray-800 p-4 rounded-2xl flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase font-mono">Alumnos Inscritos</div>
                <div className="text-2xl font-black text-white font-mono">{students.length}</div>
              </div>
            </div>

            <div className="bg-gray-950/80 border border-gray-800 p-4 rounded-2xl flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase font-mono">Media XP del Aula</div>
                <div className="text-2xl font-black text-amber-400 font-mono">{avgXP} XP</div>
              </div>
            </div>

            <div className="bg-gray-950/80 border border-gray-800 p-4 rounded-2xl flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase font-mono">Avance Promedio</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">{avgCompletion}%</div>
              </div>
            </div>
          </div>

          {/* Provisioning Guide Banner (Collapsible) */}
          {showProvisioningGuide && (
            <div className="bg-indigo-950/30 border border-indigo-800/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-indigo-300 font-bold text-sm">
                <span className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-400" /> ¿Cómo crear los accesos para los alumnos en Supabase?
                </span>
                <a
                  href="https://supabase.com/dashboard/org/bkqxrzvldyrnxehnidex"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-200 underline flex items-center gap-1"
                >
                  Abrir Panel Supabase <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ol className="text-xs text-gray-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
                <li>
                  Accede a tu panel en <strong className="text-white">Supabase Authentication → Users</strong>.
                </li>
                <li>
                  Haz clic en <strong className="text-white">"Add user" → "Create user"</strong>.
                </li>
                <li>
                  Introduce el correo corporativo del alumno (o un alias como <code className="text-indigo-300">alumno01@iesbenigaslo.es</code>) y asígnale una contraseña inicial.
                </li>
                <li>
                  El alumno no necesita registrarse por su cuenta: simplemente introduce esas credenciales en la pantalla de acceso de la web y empezará a resolver retos.
                </li>
              </ol>
            </div>
          )}

          {/* Search bar */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar alumno por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-gray-950/60 border border-gray-800 rounded-2xl overflow-hidden shadow-inner">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/90 text-gray-400 uppercase font-mono text-[11px] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">Alumno</th>
                  <th className="px-4 py-3 text-center">Nivel</th>
                  <th className="px-4 py-3 text-right">XP</th>
                  <th className="px-4 py-3 text-center">Racha</th>
                  <th className="px-4 py-3">Progreso Retos</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-gray-300">
                {filteredStudents.map((st) => {
                  const percent = Math.round((st.completedCount / st.totalExercises) * 100);

                  return (
                    <tr key={st.studentId} className="hover:bg-gray-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{st.studentName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{st.studentEmail}</div>
                      </td>

                      <td className="px-4 py-3 text-center font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                          Niv. {st.level}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">
                        {st.xp} XP
                      </td>

                      <td className="px-4 py-3 text-center font-mono">
                        <span className="inline-flex items-center gap-1 text-orange-400 font-bold">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" /> {st.streak}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="w-40 space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                            <span>{st.completedCount}/{st.totalExercises} retos</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            sounds.playKey();
                            setSelectedStudent(st);
                          }}
                          className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition"
                        >
                          <span>Historial</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drill-down Modal for Selected Student */}
        {selectedStudent && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h3 className="font-bold text-base text-white">
                    Historial de {selectedStudent.studentName}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">{selectedStudent.studentEmail}</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                <div className="text-xs font-bold uppercase text-gray-400">Últimos comandos intentados:</div>
                {selectedStudent.recentAttempts.length === 0 ? (
                  <div className="text-xs text-gray-500 italic p-4 text-center">
                    No hay intentos registrados recientemente para este alumno.
                  </div>
                ) : (
                  selectedStudent.recentAttempts.map((att, i) => (
                    <div
                      key={i}
                      className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="space-y-0.5">
                        <div className="text-gray-300 font-sans font-semibold">{att.exerciseTitle}</div>
                        <div className="text-emerald-400">
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
                        <div className="text-[10px] text-gray-500">{att.timestamp}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

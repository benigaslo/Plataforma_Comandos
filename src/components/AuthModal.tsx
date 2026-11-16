import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured, switchRole, saveUserToStorage } from '../lib/supabase';
import { sounds } from '../lib/sound';
import { LogIn, UserCheck, ShieldAlert, Info, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playKey();
    setErrorMsg('');
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const loadedUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            name: profile?.full_name || email.split('@')[0],
            role: profile?.role || 'student',
            xp: profile?.xp || 0,
            level: profile?.level || 1,
            streak: profile?.streak || 0,
            avatar: profile?.avatar_url || '👨‍💻',
            completed_exercises: profile?.completed_exercises || [],
            badges: profile?.badges || [],
          };

          saveUserToStorage(loadedUser);
          onUserChange(loadedUser);
          onClose();
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido al iniciar sesión';
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    } else {
      // In Demo / Standalone mode
      setLoading(false);
      const isTeacher = email.toLowerCase().includes('prof') || email.toLowerCase().includes('gasensio');
      const mockUser = switchRole(isTeacher ? 'teacher' : 'student');
      mockUser.email = email || mockUser.email;
      mockUser.name = email.split('@')[0] || mockUser.name;
      saveUserToStorage(mockUser);
      onUserChange(mockUser);
      onClose();
    }
  };

  const selectDemoRole = (role: 'student' | 'teacher') => {
    sounds.playKey();
    const u = switchRole(role);
    onUserChange(u);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Acceso a ComandQuest</h2>
          <p className="text-xs text-gray-400">
            Inicia sesión con las credenciales facilitadas por tu profesor
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/40 border border-rose-800/80 p-3 rounded-xl text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1 font-medium">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alumno@iesbenigaslo.es"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1 font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Entrando...' : 'Entrar a la Plataforma'}</span>
          </button>
        </form>

        {/* Demo Fast Switch (Useful for teacher testing) */}
        <div className="pt-2 border-t border-gray-800/80 space-y-2">
          <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Accesos rápidos de prueba (Demo):</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => selectDemoRole('student')}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-1 transition ${
                currentUser.role === 'student'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Modo Alumno</span>
            </button>

            <button
              onClick={() => selectDemoRole('teacher')}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-1 transition ${
                currentUser.role === 'teacher'
                  ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              <span>Modo Docente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

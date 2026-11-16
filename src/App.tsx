import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, OperatingSystem, Exercise, ThemeMode } from './types';
import { getAllExercises, getModulesForExercises } from './data/exercises';
import { BADGES } from './data/badges';
import {
  getCurrentUserSession,
  recordExerciseCompletion,
  switchRole,
} from './lib/supabase';
import { sounds } from './lib/sound';
import { Navbar } from './components/Navbar';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseView } from './components/ExerciseView';
import { TerminalComponent } from './components/Terminal';
import { BadgesModal } from './components/BadgesModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeacherPanel } from './components/TeacherPanel';
import { AuthModal } from './components/AuthModal';
import { LevelUpModal } from './components/LevelUpModal';
import { MatrixRain } from './components/MatrixRain';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentOS, setCurrentOS] = useState<OperatingSystem>('linux');

  // Dynamic exercise catalog (base + custom created by teacher)
  const [exercises, setExercises] = useState<Exercise[]>(() => getAllExercises());
  const [modules, setModules] = useState(() => getModulesForExercises(getAllExercises()));

  const [activeExercise, setActiveExercise] = useState<Exercise>(() => {
    const all = getAllExercises();
    return all.find((e) => e.os === 'linux') || all[0];
  });

  // Modals state
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isTeacherPanelOpen, setIsTeacherPanelOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; newXp: number } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => sounds.isEnabled());

  // Theme state: 'light' | 'dark' | 'matrix'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('comandquest_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'matrix') {
      return saved;
    }
    return 'matrix'; // Default to Matrix aesthetic as requested
  });

  const [crtMode, setCrtMode] = useState<boolean>(() => {
    return localStorage.getItem('comandquest_crt') === 'true';
  });

  // Sync body class with theme
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Reload dynamic exercises
  const refreshExercises = useCallback(() => {
    const updated = getAllExercises();
    setExercises(updated);
    setModules(getModulesForExercises(updated));
  }, []);

  // Load user session on mount
  useEffect(() => {
    getCurrentUserSession().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  // When OS changes, select first exercise of that OS
  const handleSelectOS = (os: OperatingSystem) => {
    setCurrentOS(os);
    const firstOfOs = exercises.find((e) => e.os === os);
    if (firstOfOs) {
      setActiveExercise(firstOfOs);
    }
  };

  const currentOsExercises = exercises.filter((e) => e.os === currentOS);
  const currentIndex = currentOsExercises.findIndex((e) => e.id === activeExercise.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < currentOsExercises.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setActiveExercise(currentOsExercises[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setActiveExercise(currentOsExercises[currentIndex + 1]);
    }
  };

  const handleCommandSuccess = async (command: string, xpEarned: number) => {
    if (!user) return;
    const oldLevel = user.level;
    const updated = await recordExerciseCompletion(user, activeExercise.id, xpEarned, command);

    // Check newly unlocked badges
    const newlyUnlocked: string[] = [];
    BADGES.forEach((b) => {
      if (!updated.badges.includes(b.id) && b.condition(updated)) {
        newlyUnlocked.push(b.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      updated.badges = [...updated.badges, ...newlyUnlocked];
    }

    setUser(updated);

    // If leveled up, trigger celebratory modal!
    if (updated.level > oldLevel) {
      setLevelUpData({ newLevel: updated.level, newXp: updated.xp });
    }
  };

  const handleToggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
  };

  const handleSelectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('comandquest_theme', newTheme);
  };

  const handleToggleCrt = () => {
    const next = !crtMode;
    setCrtMode(next);
    localStorage.setItem('comandquest_crt', String(next));
  };

  const handleToggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'student' ? 'teacher' : 'student';
    const updated = switchRole(newRole);
    setUser(updated);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030805] flex items-center justify-center text-[#00ff66] font-mono text-sm matrix-glow">
        INICIALIZANDO COMANDQUEST...
      </div>
    );
  }

  const isCompleted = user.completed_exercises.includes(activeExercise.id);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#00ff66] selection:text-black transition-colors duration-300">
      {/* Background Matrix Digital Rain Animation (Only active in Matrix theme) */}
      {theme === 'matrix' && <MatrixRain opacity={0.2} speedMs={80} />}

      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        currentOS={currentOS}
        onSelectOS={handleSelectOS}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleRole={handleToggleRole}
        onOpenTeacherPanel={() => setIsTeacherPanelOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        theme={theme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        {/* Left Column: Curriculum Modules List (4 cols) */}
        <aside className="lg:col-span-4 h-[400px] lg:h-[calc(100vh-95px)]">
          <ExerciseList
            os={currentOS}
            modules={modules}
            activeExercise={activeExercise}
            completedIds={user.completed_exercises}
            onSelectExercise={(ex) => setActiveExercise(ex)}
            theme={theme}
          />
        </aside>

        {/* Right Column: Mission Card + Simulated Terminal (8 cols) */}
        <section className="lg:col-span-8 flex flex-col space-y-4 h-[calc(100vh-95px)]">
          {/* Mission & Guidance Card (Top) */}
          <div className="shrink-0">
            <ExerciseView
              exercise={activeExercise}
              isCompleted={isCompleted}
              onNext={handleNext}
              onPrev={handlePrev}
              hasPrev={hasPrev}
              hasNext={hasNext}
              theme={theme}
            />
          </div>

          {/* Interactive Simulated Terminal (Bottom, fills remaining height) */}
          <div className="flex-1 min-h-[360px]">
            <TerminalComponent
              os={currentOS}
              activeExercise={activeExercise}
              onCommandSuccess={handleCommandSuccess}
              crtMode={crtMode}
              onToggleCrt={handleToggleCrt}
              theme={theme}
            />
          </div>
        </section>
      </main>

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserId={user?.id || ''}
        theme={theme}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        user={user}
      />

      <TeacherPanel
        isOpen={isTeacherPanelOpen}
        onClose={() => setIsTeacherPanelOpen(false)}
        onExercisesUpdated={refreshExercises}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onUserChange={(u) => setUser(u)}
        theme={theme}
      />

      {levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          newXp={levelUpData.newXp}
          onClose={() => setLevelUpData(null)}
        />
      )}
    </div>
  );
};
export default App;

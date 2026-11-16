import React, { useState, useEffect } from 'react';
import { UserProfile, OperatingSystem, Exercise } from './types';
import { EXERCISES, MODULES } from './data/exercises';
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
import { TeacherPanel } from './components/TeacherPanel';
import { AuthModal } from './components/AuthModal';
import { LevelUpModal } from './components/LevelUpModal';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentOS, setCurrentOS] = useState<OperatingSystem>('linux');
  const [activeExercise, setActiveExercise] = useState<Exercise>(() => {
    return EXERCISES.find((e) => e.os === 'linux') || EXERCISES[0];
  });

  // Modals state
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isTeacherPanelOpen, setIsTeacherPanelOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; newXp: number } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => sounds.isEnabled());

  // Load user session on mount
  useEffect(() => {
    getCurrentUserSession().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  // When OS changes, select first exercise of that OS
  const handleSelectOS = (os: OperatingSystem) => {
    setCurrentOS(os);
    const firstOfOs = EXERCISES.find((e) => e.os === os);
    if (firstOfOs) {
      setActiveExercise(firstOfOs);
    }
  };

  const currentOsExercises = EXERCISES.filter((e) => e.os === currentOS);
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

  const handleToggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'student' ? 'teacher' : 'student';
    const updated = switchRole(newRole);
    setUser(updated);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-emerald-400 font-mono text-sm">
        Cargando ComandQuest...
      </div>
    );
  }

  const isCompleted = user.completed_exercises.includes(activeExercise.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d13] text-gray-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        currentOS={currentOS}
        onSelectOS={handleSelectOS}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onToggleRole={handleToggleRole}
        onOpenTeacherPanel={() => setIsTeacherPanelOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Curriculum Modules List (4 cols) */}
        <aside className="lg:col-span-4 h-[400px] lg:h-[calc(100vh-100px)]">
          <ExerciseList
            os={currentOS}
            modules={MODULES}
            activeExercise={activeExercise}
            completedIds={user.completed_exercises}
            onSelectExercise={(ex) => setActiveExercise(ex)}
          />
        </aside>

        {/* Right Column: Mission Card + Simulated Terminal (8 cols) */}
        <section className="lg:col-span-8 flex flex-col space-y-4 h-[calc(100vh-100px)]">
          {/* Mission & Guidance Card (Top) */}
          <div className="shrink-0">
            <ExerciseView
              exercise={activeExercise}
              isCompleted={isCompleted}
              onNext={handleNext}
              onPrev={handlePrev}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />
          </div>

          {/* Interactive Simulated Terminal (Bottom, fills remaining height) */}
          <div className="flex-1 min-h-[360px]">
            <TerminalComponent
              os={currentOS}
              activeExercise={activeExercise}
              onCommandSuccess={handleCommandSuccess}
            />
          </div>
        </section>
      </main>

      {/* Modals */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        user={user}
      />

      <TeacherPanel
        isOpen={isTeacherPanelOpen}
        onClose={() => setIsTeacherPanelOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onUserChange={(u) => setUser(u)}
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

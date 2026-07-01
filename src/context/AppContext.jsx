import { createContext, useContext, useState, useEffect } from 'react';
import { useCourse } from './AdminContext';

const AppContext = createContext(null);

const STORAGE_KEY = 'lms_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const course = useCourse();
  const [user, setUser] = useState(() => loadState()?.user || null);
  const [completedLessons, setCompletedLessons] = useState(
    () => loadState()?.completedLessons || []
  );
  const [homeworks, setHomeworks] = useState(() => loadState()?.homeworks || {});
  const [accessCode, setAccessCode] = useState(() => loadState()?.accessCode || '');

  const hasFullAccess = user && (accessCode === 'DEMO2024' || user?.role === 'full');

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, completedLessons, homeworks, accessCode })
    );
  }, [user, completedLessons, homeworks, accessCode]);

  function getAllLessons() {
    if (!course) return [];
    return course.modules.flatMap(m => m.lessons);
  }

  function login(name, email) {
    setUser({ name, email, role: 'free' });
  }

  function logout() {
    setUser(null);
  }

  function completeLesson(lessonId) {
    setCompletedLessons(prev =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    );
  }

  function submitHomework(lessonId, text) {
    setHomeworks(prev => ({
      ...prev,
      [lessonId]: { text, submittedAt: new Date().toISOString() },
    }));
  }

  function applyCode(code) {
    setAccessCode(code);
  }

  function canAccessLesson(lesson) {
    if (lesson.free) return true;
    if (!user) return false;
    const all = getAllLessons();
    const idx = all.findIndex(l => l.id === lesson.id);
    if (idx < (course?.freeUntil ?? 2)) return true;
    return hasFullAccess;
  }

  const totalLessons = getAllLessons().length;
  const progress = totalLessons > 0
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      completedLessons,
      completeLesson,
      homeworks,
      submitHomework,
      accessCode,
      applyCode,
      hasFullAccess,
      canAccessLesson,
      getAllLessons,
      progress,
      totalLessons,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

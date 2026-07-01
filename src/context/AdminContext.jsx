import { createContext, useContext, useState, useEffect } from 'react';
import { course as defaultCourse } from '../data/course';

const AdminContext = createContext(null);

const COURSE_KEY = 'lms_course';
const ADMIN_KEY = 'lms_admin_auth';

function loadCourse() {
  try {
    const raw = localStorage.getItem(COURSE_KEY);
    return raw ? JSON.parse(raw) : defaultCourse;
  } catch {
    return defaultCourse;
  }
}

function saveCourse(c) {
  localStorage.setItem(COURSE_KEY, JSON.stringify(c));
}

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === 'true');
  const [course, setCourse] = useState(loadCourse);

  useEffect(() => {
    saveCourse(course);
  }, [course]);

  function adminLogin(password) {
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_KEY, 'true');
      return true;
    }
    return false;
  }

  function adminLogout() {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_KEY);
  }

  // --- Модули ---
  function addModule(title) {
    const newId = Date.now();
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, { id: newId, title, lessons: [] }],
    }));
  }

  function updateModule(moduleId, title) {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === moduleId ? { ...m, title } : m),
    }));
  }

  function deleteModule(moduleId) {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId),
    }));
  }

  // --- Уроки ---
  function addLesson(moduleId, lessonData) {
    const newLesson = {
      id: 'l' + Date.now(),
      moduleId,
      order: Date.now(),
      free: false,
      ...lessonData,
    };
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      ),
    }));
  }

  function updateLesson(moduleId, lessonId, lessonData) {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...lessonData } : l) }
          : m
      ),
    }));
  }

  function deleteLesson(moduleId, lessonId) {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
          : m
      ),
    }));
  }

  function updateCourseInfo(data) {
    setCourse(prev => ({ ...prev, ...data }));
  }

  return (
    <AdminContext.Provider value={{
      isAdmin, adminLogin, adminLogout,
      course, setCourse,
      addModule, updateModule, deleteModule,
      addLesson, updateLesson, deleteLesson,
      updateCourseInfo,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

export function useCourse() {
  const ctx = useContext(AdminContext);
  return ctx ? ctx.course : null;
}

import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCourse } from '../context/AdminContext';
import { Lock, CheckCircle, PlayCircle, ChevronRight } from 'lucide-react';

const GRADIENTS = [
  'from-red-500 to-orange-400',
  'from-purple-600 to-violet-500',
  'from-blue-600 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-pink-500 to-rose-400',
  'from-yellow-500 to-amber-400',
];

export default function Modules() {
  const { completedLessons, canAccessLesson, user, getAllLessons } = useApp();
  const course = useCourse();
  const allLessons = getAllLessons();

  if (!course) return null;

  return (
    <div className="px-5 space-y-5">
      <div>
        <h1 className="text-white font-bold text-xl">{course.title}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{course.modules.length} модуля · {allLessons.length} уроков</p>
      </div>

      {/* Прогресс */}
      {user && (
        <div className="bg-[#17171f] rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Общий прогресс</span>
            <span className="text-white font-bold text-sm">{completedLessons.length}/{allLessons.length}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-400 h-2 rounded-full transition-all"
              style={{ width: `${allLessons.length > 0 ? (completedLessons.length / allLessons.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Модули */}
      <div className="space-y-4">
        {course.modules.map((mod, mi) => {
          const modDone = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
          const pct = mod.lessons.length > 0 ? Math.round((modDone / mod.lessons.length) * 100) : 0;
          const gradient = GRADIENTS[mi % GRADIENTS.length];

          return (
            <div key={mod.id} className="bg-[#17171f] rounded-2xl border border-white/5 overflow-hidden">
              {/* Шапка модуля */}
              <div className={`bg-gradient-to-r ${gradient} px-5 py-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Модуль {mod.id}</p>
                    <h2 className="text-white font-bold text-base mt-0.5">{mod.title}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs">{modDone}/{mod.lessons.length}</p>
                    <div className="w-16 bg-white/25 rounded-full h-1.5 mt-1.5">
                      <div className="bg-white h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Уроки */}
              <div className="divide-y divide-white/5">
                {mod.lessons.map((lesson) => {
                  const done = completedLessons.includes(lesson.id);
                  const accessible = canAccessLesson(lesson);

                  return (
                    <div key={lesson.id} className={`flex items-center gap-3 px-4 py-3.5 ${!accessible ? 'opacity-50' : ''}`}>
                      <div className="flex-shrink-0">
                        {done
                          ? <CheckCircle size={18} className="text-emerald-400" />
                          : accessible
                          ? <PlayCircle size={18} className="text-violet-400" />
                          : <Lock size={18} className="text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{lesson.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5 capitalize">{lesson.type.replace('+', ' + ')}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {lesson.free && !user && (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Free</span>
                        )}
                        {accessible ? (
                          <Link to={`/lesson/${lesson.id}`} className="text-gray-500 hover:text-white transition-colors">
                            <ChevronRight size={16} />
                          </Link>
                        ) : (
                          <Link to="/access" className="text-gray-600 hover:text-violet-400 transition-colors">
                            <ChevronRight size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

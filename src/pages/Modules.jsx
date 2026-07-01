import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCourse } from '../context/AdminContext';
import { Lock, CheckCircle, PlayCircle, ChevronRight } from 'lucide-react';

export default function Modules() {
  const { completedLessons, canAccessLesson, user, getAllLessons } = useApp();
  const course = useCourse();
  const allLessons = getAllLessons();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-gray-500">{course.modules.length} модуля · {allLessons.length} уроков</p>
      </div>

      {/* Прогресс-бар (если авторизован) */}
      {user && (
        <div className="bg-purple-50 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Ваш прогресс</span>
            <span className="text-sm font-bold text-purple-700">
              {completedLessons.length} / {allLessons.length} уроков
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div
              className="bg-purple-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedLessons.length / allLessons.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {course.modules.map((mod) => {
          const modCompleted = mod.lessons.filter(l => completedLessons.includes(l.id)).length;

          return (
            <div key={mod.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Заголовок модуля */}
              <div className="bg-gradient-to-r from-purple-700 to-purple-800 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-xs font-medium uppercase tracking-wider mb-0.5">
                    Модуль {mod.id}
                  </p>
                  <h2 className="text-white font-bold text-lg">{mod.title}</h2>
                </div>
                <div className="text-right">
                  <div className="text-white/80 text-sm">{modCompleted}/{mod.lessons.length}</div>
                  <div className="w-16 bg-purple-500 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-yellow-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${(modCompleted / mod.lessons.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Уроки */}
              <div>
                {mod.lessons.map((lesson, i) => {
                  const done = completedLessons.includes(lesson.id);
                  const accessible = canAccessLesson(lesson);

                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-4 px-6 py-4 ${i < mod.lessons.length - 1 ? 'border-b border-gray-50' : ''} ${!accessible ? 'opacity-60' : ''}`}
                    >
                      <div className="flex-shrink-0">
                        {done ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : accessible ? (
                          <PlayCircle size={20} className="text-purple-600" />
                        ) : (
                          <Lock size={20} className="text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{lesson.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">{lesson.type.replace('+', ' + ')}</p>
                      </div>

                      <div className="flex-shrink-0">
                        {lesson.free && !user && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-2">
                            Бесплатно
                          </span>
                        )}
                        {accessible ? (
                          <Link
                            to={`/lesson/${lesson.id}`}
                            className="flex items-center gap-1 text-xs font-medium text-purple-700 hover:text-purple-900"
                          >
                            {done ? 'Повторить' : 'Начать'}
                            <ChevronRight size={14} />
                          </Link>
                        ) : (
                          <Link
                            to="/access"
                            className="text-xs text-gray-400 hover:text-purple-600"
                          >
                            Получить доступ
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

import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCourse } from '../context/AdminContext';
import { CheckCircle, BookOpen, Send, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { user, completedLessons, homeworks, progress, totalLessons, getAllLessons } = useApp();
  const course = useCourse();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Войдите, чтобы увидеть прогресс</p>
        <Link to="/login" className="bg-purple-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-800">
          Войти
        </Link>
      </div>
    );
  }

  const hwCount = Object.keys(homeworks).length;
  const allLessons = getAllLessons();
  if (!course) return null;
  const nextLesson = allLessons.find(l => !completedLessons.includes(l.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Привет, {user.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Ваш учебный дашборд</p>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Прогресс', value: `${progress}%`, color: 'bg-purple-50 text-purple-700' },
          { label: 'Пройдено уроков', value: `${completedLessons.length}/${totalLessons}`, color: 'bg-green-50 text-green-700' },
          { label: 'Домашних заданий', value: hwCount, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Модулей', value: course.modules.length, color: 'bg-blue-50 text-blue-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium opacity-70 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Общий прогресс */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">Общий прогресс</h2>
          <span className="text-sm font-bold text-purple-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
          <div
            className="bg-purple-700 h-3 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        {nextLesson && (
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="inline-flex items-center gap-2 bg-purple-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-purple-800 transition-colors"
          >
            Продолжить: {nextLesson.title}
            <ChevronRight size={16} />
          </Link>
        )}

        {!nextLesson && (
          <p className="text-green-600 font-medium text-sm">🎉 Поздравляем! Вы прошли весь курс!</p>
        )}
      </div>

      {/* Прогресс по модулям */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">По модулям</h2>
        <div className="space-y-4">
          {course.modules.map(mod => {
            const done = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
            const pct = Math.round((done / mod.lessons.length) * 100);
            return (
              <div key={mod.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{mod.title}</span>
                  <span className="text-xs text-gray-400">{done}/{mod.lessons.length}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Домашние задания */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Send size={18} className="text-purple-600" />
          Домашние задания
        </h2>
        {hwCount === 0 ? (
          <p className="text-gray-400 text-sm">Вы ещё не отправляли домашние задания</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(homeworks).map(([lessonId, hw]) => {
              const lesson = allLessons.find(l => l.id === lessonId);
              return (
                <div key={lessonId} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{lesson?.title || lessonId}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Отправлено
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{hw.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCourse } from '../context/AdminContext';
import { Send, ChevronRight, Trophy } from 'lucide-react';

export default function Dashboard() {
  const { user, completedLessons, homeworks, progress, totalLessons, getAllLessons } = useApp();
  const course = useCourse();

  if (!user) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="text-gray-400 mb-4">Войдите, чтобы увидеть прогресс</p>
        <Link to="/login" className="bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-violet-700 transition-colors inline-block">
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
    <div className="px-5 space-y-5">

      {/* Аватар и имя */}
      <div className="flex items-center gap-4 bg-[#17171f] rounded-2xl p-4 border border-white/5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-2xl">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-bold text-lg">{user.name}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: `${progress}%`, label: 'Прогресс', color: 'text-violet-400' },
          { value: `${completedLessons.length}/${totalLessons}`, label: 'Уроков', color: 'text-emerald-400' },
          { value: hwCount, label: 'Домашек', color: 'text-orange-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#17171f] rounded-2xl p-4 border border-white/5 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Прогресс */}
      <div className="bg-[#17171f] rounded-2xl p-4 border border-white/5">
        <div className="flex justify-between mb-3">
          <span className="text-white font-semibold text-sm">Прогресс курса</span>
          <span className="text-violet-400 font-bold text-sm">{progress}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
          <div
            className="bg-gradient-to-r from-violet-500 to-purple-400 h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        {nextLesson ? (
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="flex items-center justify-between bg-violet-600/20 border border-violet-500/30 rounded-xl px-4 py-3 hover:bg-violet-600/30 transition-colors"
          >
            <div>
              <p className="text-xs text-violet-400 font-medium">Продолжить</p>
              <p className="text-white text-sm font-semibold">{nextLesson.title}</p>
            </div>
            <ChevronRight size={18} className="text-violet-400" />
          </Link>
        ) : (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <Trophy size={20} className="text-emerald-400" />
            <p className="text-emerald-400 font-semibold text-sm">Курс пройден!</p>
          </div>
        )}
      </div>

      {/* По модулям */}
      <div className="bg-[#17171f] rounded-2xl p-4 border border-white/5">
        <p className="text-white font-semibold text-sm mb-4">По модулям</p>
        <div className="space-y-3">
          {course.modules.map(mod => {
            const done = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
            const pct = mod.lessons.length > 0 ? Math.round((done / mod.lessons.length) * 100) : 0;
            return (
              <div key={mod.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 text-xs">{mod.title}</span>
                  <span className="text-gray-500 text-xs">{done}/{mod.lessons.length}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Домашние задания */}
      {hwCount > 0 && (
        <div className="bg-[#17171f] rounded-2xl p-4 border border-white/5">
          <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Send size={16} className="text-orange-400" /> Домашние задания
          </p>
          <div className="space-y-2">
            {Object.entries(homeworks).map(([lessonId, hw]) => {
              const lesson = allLessons.find(l => l.id === lessonId);
              return (
                <div key={lessonId} className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-white text-xs font-medium">{lesson?.title || lessonId}</p>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full whitespace-nowrap">Отправлено</span>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-1">{hw.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

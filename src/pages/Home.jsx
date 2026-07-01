import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCourse } from '../context/AdminContext';
import { ChevronRight, BookOpen } from 'lucide-react';

const GRADIENTS = [
  'from-red-500 to-orange-400',
  'from-purple-600 to-violet-500',
  'from-blue-600 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-pink-500 to-rose-400',
  'from-yellow-500 to-amber-400',
];

export default function Home() {
  const { user, getAllLessons, completedLessons } = useApp();
  const course = useCourse();
  if (!course) return null;

  const allLessons = getAllLessons();
  const totalLessons = allLessons.length;
  const progress = totalLessons > 0
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;

  const nextLesson = allLessons.find(l => !completedLessons.includes(l.id));

  return (
    <div className="px-5 space-y-6">

      {/* Карточка курса (главная) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 p-5 min-h-[160px] flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="bg-white/20 rounded-2xl p-2.5">
            <BookOpen size={22} className="text-white" />
          </div>
        </div>
        <div>
          <p className="text-white/80 text-xs font-medium mb-1 uppercase tracking-wider">Текущий курс</p>
          <h2 className="text-white font-bold text-xl leading-tight mb-3">{course.title}</h2>
          {user && totalLessons > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/70 text-xs">Прогресс</span>
                <span className="text-white font-bold text-xs">{progress}%</span>
              </div>
              <div className="w-full bg-white/25 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Все модули', path: '/modules', gradient: 'from-[#1e1e2e] to-[#252535]', icon: '📚' },
          { label: nextLesson ? 'Продолжить' : 'Начать', path: nextLesson ? `/lesson/${nextLesson.id}` : '/modules', gradient: 'from-violet-600 to-purple-700', icon: '▶️' },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-4 flex flex-col justify-between min-h-[90px] border border-white/5`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-white font-semibold text-sm">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Модули курса */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base">Программа курса</h3>
          <Link to="/modules" className="text-gray-400 text-xs flex items-center gap-1 hover:text-white transition-colors">
            Все <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-3">
          {course.modules.map((mod, i) => {
            const done = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
            const pct = mod.lessons.length > 0 ? Math.round((done / mod.lessons.length) * 100) : 0;
            const gradient = GRADIENTS[i % GRADIENTS.length];
            const firstLesson = mod.lessons[0];

            return (
              <Link
                key={mod.id}
                to={firstLesson ? `/lesson/${firstLesson.id}` : '/modules'}
                className="flex items-center gap-4 bg-[#17171f] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors"
              >
                {/* Цветной квадрат */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex-shrink-0 flex items-center justify-center text-white font-bold text-lg`}>
                  {mod.id}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{mod.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {done}/{mod.lessons.length} уроков
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                    <div
                      className={`bg-gradient-to-r ${gradient} h-1 rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA для незарегистрированных */}
      {!user && (
        <div className="bg-gradient-to-br from-violet-600 to-purple-800 rounded-3xl p-5 text-center">
          <p className="text-white font-bold text-lg mb-1">Начни бесплатно</p>
          <p className="text-purple-200 text-sm mb-4">Первые 2 урока открыты без регистрации</p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors"
          >
            Зарегистрироваться
          </Link>
        </div>
      )}
    </div>
  );
}

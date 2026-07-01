import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { course } from '../data/course';
import { PlayCircle, Clock, BookOpen, ChevronRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user } = useApp();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-purple-500/30 text-purple-100 text-sm font-medium px-3 py-1 rounded-full mb-6">
            Онлайн-курс
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {course.title}
          </h1>
          <p className="text-lg md:text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
            {course.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/modules"
                className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-300 transition-colors"
              >
                Продолжить обучение
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-300 transition-colors"
                >
                  Начать обучение
                </Link>
                <Link
                  to="/modules"
                  className="border border-white/40 text-white font-medium px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors"
                >
                  Смотреть программу
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12 text-purple-200">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>{course.lessons} уроков</span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle size={18} />
              <span>Видео + практика</span>
            </div>
          </div>
        </div>
      </section>

      {/* Что вы получите */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Что вы получите
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Практические навыки', desc: 'Каждый урок — это теория + задание. Вы сразу применяете знания.' },
              { icon: '📐', title: 'Системный подход', desc: 'Не хаотичный набор советов, а стройная система знаний о дизайне.' },
              { icon: '🚀', title: 'Готовый проект', desc: 'К концу курса у вас будет портфолио с реальными работами.' },
            ].map((item, i) => (
              <div key={i} className="bg-purple-50 rounded-2xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Программа курса */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
            Программа курса
          </h2>
          <p className="text-center text-gray-500 mb-10">
            {course.modules.length} модуля · {course.lessons} уроков
          </p>

          <div className="space-y-4">
            {course.modules.map((mod) => (
              <div key={mod.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">
                      Модуль {mod.id}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-0.5">{mod.title}</h3>
                  </div>
                  <span className="text-sm text-gray-400">{mod.lessons.length} уроков</span>
                </div>
                <div className="border-t border-gray-50">
                  {mod.lessons.map((lesson, i) => (
                    <div key={lesson.id} className={`flex items-center gap-3 px-6 py-3 ${i < mod.lessons.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <CheckCircle size={16} className={lesson.free ? 'text-green-500' : 'text-gray-300'} />
                      <span className="text-sm text-gray-700">{lesson.title}</span>
                      {lesson.free && (
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Бесплатно
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to={user ? '/modules' : '/register'}
              className="inline-flex items-center gap-2 bg-purple-700 text-white font-bold px-8 py-4 rounded-xl hover:bg-purple-800 transition-colors"
            >
              {user ? 'Перейти к урокам' : 'Начать бесплатно'}
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Автор */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center text-4xl flex-shrink-0">
            👩‍🎨
          </div>
          <div>
            <p className="text-sm text-purple-600 font-medium mb-1">Автор курса</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.author}</h3>
            <p className="text-gray-600">
              Дизайнер с 8-летним опытом. Работала с брендами из Fortune 500. Преподаёт дизайн-мышление и визуальные коммуникации.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 px-4 bg-purple-700 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Готовы начать?
          </h2>
          <p className="text-purple-200 mb-8">Первые 2 урока — бесплатно. Без карты.</p>
          <Link
            to="/register"
            className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-300 transition-colors inline-block"
          >
            Зарегистрироваться бесплатно
          </Link>
        </section>
      )}
    </div>
  );
}

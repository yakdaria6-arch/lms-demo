import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getLessonById, getAdjacentLessons } from '../data/course';
import { CheckCircle, ChevronLeft, ChevronRight, Lock, Send } from 'lucide-react';

function Quiz({ questions }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleCheck() {
    if (selected === null) return;
    if (selected === questions[current].answer) setScore(s => s + 1);
    setChecked(true);
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setChecked(false);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="bg-purple-50 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-bold text-gray-900 text-lg">Тест пройден!</p>
        <p className="text-gray-500 mt-1">
          Правильных ответов: {score} из {questions.length}
        </p>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="bg-purple-50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-purple-700">
          Вопрос {current + 1} из {questions.length}
        </p>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full ${i <= current ? 'bg-purple-600' : 'bg-purple-200'}`}
            />
          ))}
        </div>
      </div>

      <p className="font-bold text-gray-900 mb-4">{q.question}</p>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !checked && setSelected(i)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
              checked
                ? i === q.answer
                  ? 'bg-green-100 border-green-400 text-green-800'
                  : selected === i
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-white border-gray-200 text-gray-600'
                : selected === i
                ? 'bg-purple-100 border-purple-400 text-purple-900'
                : 'bg-white border-gray-200 hover:border-purple-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {!checked ? (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-purple-800 transition-colors"
        >
          Проверить
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          {current < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
        </button>
      )}
    </div>
  );
}

function renderMarkdown(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith('**') && line.endsWith('**')) {
      const content = line.slice(2, -2);
      return <p key={i} className="font-bold text-gray-900 mt-4 mb-1">{content}</p>;
    }
    if (line.startsWith('- ')) {
      const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
      return <li key={i} className="text-gray-700 ml-4 mb-1" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    if (/^\d+\. /.test(line)) {
      const content = line.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
      return <li key={i} className="text-gray-700 ml-4 mb-1 list-decimal" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    if (line.trim() === '') return <br key={i} />;
    const html = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
    return <p key={i} className="text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canAccessLesson, completeLesson, completedLessons, submitHomework, homeworks, user } = useApp();

  const lesson = getLessonById(id);
  const { prev, next } = getAdjacentLessons(id);
  const [hwText, setHwText] = useState('');
  const [hwSent, setHwSent] = useState(false);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Урок не найден</p>
        <Link to="/modules" className="text-purple-700 hover:underline mt-4 inline-block">← К модулям</Link>
      </div>
    );
  }

  if (!canAccessLesson(lesson)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 max-w-md mx-auto">
          <Lock size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Закрытый урок</h2>
          <p className="text-gray-500 mb-6">
            {!user ? 'Зарегистрируйтесь, чтобы начать обучение' : 'Для доступа нужен полный доступ к курсу'}
          </p>
          <Link
            to={!user ? '/register' : '/access'}
            className="bg-purple-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-800 transition-colors inline-block"
          >
            {!user ? 'Зарегистрироваться' : 'Получить доступ'}
          </Link>
        </div>
      </div>
    );
  }

  const isDone = completedLessons.includes(lesson.id);
  const existingHw = homeworks[lesson.id];

  function handleComplete() {
    completeLesson(lesson.id);
    if (next) navigate(`/lesson/${next.id}`);
  }

  function handleSubmitHw() {
    if (!hwText.trim()) return;
    submitHomework(lesson.id, hwText);
    setHwSent(true);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modules" className="hover:text-purple-700 transition-colors">Модули</Link>
        <ChevronRight size={14} />
        <span className="text-gray-700">{lesson.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Основной контент */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{lesson.title}</h1>
            {isDone && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle size={14} /> Пройден
              </span>
            )}
          </div>

          {/* Видео */}
          {lesson.video && (
            <div className="rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={lesson.video}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          )}

          {/* Текст урока */}
          {lesson.text && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {renderMarkdown(lesson.text)}
            </div>
          )}

          {/* Тест */}
          {lesson.quiz && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Проверь себя</h3>
              <Quiz questions={lesson.quiz} />
            </div>
          )}

          {/* Задание */}
          {lesson.task && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">📝 Задание</h3>
              <p className="text-gray-700 text-sm">{lesson.task}</p>

              {/* Домашка */}
              <div className="mt-4">
                {existingHw ? (
                  <div className="bg-white rounded-xl p-4 border border-yellow-200">
                    <p className="text-xs text-green-600 font-medium mb-1">✅ Ответ отправлен</p>
                    <p className="text-sm text-gray-700">{existingHw.text}</p>
                  </div>
                ) : hwSent ? (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
                    <p className="text-green-700 font-medium text-sm">Отправлено на проверку!</p>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={hwText}
                      onChange={e => setHwText(e.target.value)}
                      placeholder="Напишите ваш ответ здесь..."
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-purple-400"
                      rows={4}
                    />
                    <button
                      onClick={handleSubmitHw}
                      className="mt-2 flex items-center gap-2 bg-yellow-400 text-gray-900 font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors"
                    >
                      <Send size={15} />
                      Отправить ответ
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Сайдбар */}
        <div className="space-y-4">
          {/* Кнопка завершения */}
          <button
            onClick={handleComplete}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-colors ${
              isDone
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-purple-700 text-white hover:bg-purple-800'
            }`}
          >
            <CheckCircle size={18} />
            {isDone ? 'Урок пройден!' : 'Отметить как пройденный'}
          </button>

          {/* Навигация */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            {prev && (
              <Link
                to={`/lesson/${prev.id}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700 transition-colors py-1"
              >
                <ChevronLeft size={16} />
                <span className="truncate">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link
                to={`/lesson/${next.id}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700 transition-colors py-1"
              >
                <ChevronRight size={16} />
                <span className="truncate">{next.title}</span>
              </Link>
            )}
            <Link
              to="/modules"
              className="block text-center text-xs text-gray-400 hover:text-purple-600 transition-colors pt-1"
            >
              Все модули
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

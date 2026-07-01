import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useCourse } from '../context/AdminContext';
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
      setCurrent(c => c + 1); setSelected(null); setChecked(false);
    } else { setFinished(true); }
  }

  if (finished) return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center">
      <div className="text-3xl mb-2">🎉</div>
      <p className="text-white font-bold">Тест пройден!</p>
      <p className="text-gray-400 text-sm mt-1">{score} из {questions.length} правильно</p>
    </div>
  );

  const q = questions[current];
  return (
    <div className="bg-[#1a1a24] rounded-2xl p-4 border border-white/5">
      <div className="flex justify-between mb-4">
        <p className="text-violet-400 text-sm font-medium">Вопрос {current + 1}/{questions.length}</p>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-1 w-5 rounded-full ${i <= current ? 'bg-violet-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
      <p className="text-white font-semibold mb-4">{q.question}</p>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !checked && setSelected(i)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
              checked
                ? i === q.answer ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : selected === i ? 'bg-red-500/20 border-red-500/50 text-red-300'
                  : 'bg-white/5 border-white/10 text-gray-400'
                : selected === i ? 'bg-violet-500/20 border-violet-500/50 text-violet-200'
                : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
            }`}
          >{opt}</button>
        ))}
      </div>
      {!checked
        ? <button onClick={handleCheck} disabled={selected === null} className="bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40">Проверить</button>
        : <button onClick={handleNext} className="bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
            {current < questions.length - 1 ? 'Следующий' : 'Завершить'}
          </button>
      }
    </div>
  );
}

function renderMarkdown(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-white text-lg font-bold mt-5 mb-2">{line.slice(3)}</h2>;
    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-white font-bold mt-3 mb-1">{line.slice(2, -2)}</p>;
    if (line.startsWith('- ')) {
      const html = line.slice(2).replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong class="text-white">${m}</strong>`);
      return <li key={i} className="text-gray-400 ml-4 mb-1 text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    if (/^\d+\. /.test(line)) {
      const html = line.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong class="text-white">${m}</strong>`);
      return <li key={i} className="text-gray-400 ml-4 mb-1 list-decimal text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    if (line.trim() === '') return <br key={i} />;
    const html = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong class="text-white">${m}</strong>`);
    return <p key={i} className="text-gray-400 text-sm mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canAccessLesson, completeLesson, completedLessons, submitHomework, homeworks, user, getAllLessons } = useApp();
  const course = useCourse();

  const allLessons = getAllLessons();
  const lesson = allLessons.find(l => l.id === id);
  const idx = allLessons.findIndex(l => l.id === id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const [hwText, setHwText] = useState('');
  const [hwSent, setHwSent] = useState(false);

  if (!lesson) return (
    <div className="px-5 py-16 text-center">
      <p className="text-gray-400">Урок не найден</p>
      <Link to="/modules" className="text-violet-400 mt-4 inline-block">← К модулям</Link>
    </div>
  );

  if (!canAccessLesson(lesson)) return (
    <div className="px-5 py-16 text-center">
      <div className="bg-[#17171f] rounded-3xl border border-white/5 p-8 max-w-sm mx-auto">
        <Lock size={40} className="text-gray-600 mx-auto mb-4" />
        <h2 className="text-white text-lg font-bold mb-2">Закрытый урок</h2>
        <p className="text-gray-500 text-sm mb-6">
          {!user ? 'Зарегистрируйтесь для доступа' : 'Нужен полный доступ'}
        </p>
        <Link
          to={!user ? '/register' : '/access'}
          className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold px-6 py-3 rounded-2xl inline-block hover:opacity-90"
        >
          {!user ? 'Зарегистрироваться' : 'Получить доступ'}
        </Link>
      </div>
    </div>
  );

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
    <div className="px-5 space-y-5">
      {/* Навигация */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <Link to="/modules" className="hover:text-gray-300 transition-colors">Модули</Link>
        <ChevronRight size={12} />
        <span className="text-gray-400 truncate">{lesson.title}</span>
      </div>

      {/* Заголовок */}
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-white font-bold text-xl leading-tight">{lesson.title}</h1>
        {isDone && <span className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full"><CheckCircle size={12} /> Пройден</span>}
      </div>

      {/* Видео */}
      {lesson.video && (
        <div className="rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
          <iframe src={lesson.video} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={lesson.title} />
        </div>
      )}

      {/* Текст */}
      {lesson.text && (
        <div className="bg-[#17171f] rounded-2xl border border-white/5 p-5">
          {renderMarkdown(lesson.text)}
        </div>
      )}

      {/* Тест */}
      {lesson.quiz && (
        <div>
          <p className="text-white font-semibold mb-3">Проверь себя</p>
          <Quiz questions={lesson.quiz} />
        </div>
      )}

      {/* Задание */}
      {lesson.task && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <p className="text-amber-400 font-semibold text-sm mb-2">📝 Задание</p>
          <p className="text-gray-300 text-sm">{lesson.task}</p>
          <div className="mt-4">
            {existingHw ? (
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-emerald-400 text-xs font-medium mb-1">✅ Ответ отправлен</p>
                <p className="text-gray-400 text-sm">{existingHw.text}</p>
              </div>
            ) : hwSent ? (
              <div className="bg-emerald-500/10 rounded-xl p-3 text-center">
                <p className="text-emerald-400 font-medium text-sm">Отправлено на проверку!</p>
              </div>
            ) : (
              <>
                <textarea
                  value={hwText}
                  onChange={e => setHwText(e.target.value)}
                  placeholder="Напишите ответ..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 text-sm resize-none focus:outline-none focus:border-violet-500"
                  rows={3}
                />
                <button onClick={handleSubmitHw} className="mt-2 flex items-center gap-2 bg-amber-500 text-gray-900 font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-amber-400">
                  <Send size={14} /> Отправить
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Кнопка завершения */}
      <button
        onClick={handleComplete}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-colors ${
          isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90'
        }`}
      >
        <CheckCircle size={18} />
        {isDone ? 'Урок пройден!' : 'Отметить как пройденный'}
      </button>

      {/* Навигация между уроками */}
      <div className="flex gap-3 pb-2">
        {prev && (
          <Link to={`/lesson/${prev.id}`} className="flex-1 flex items-center gap-2 bg-[#17171f] border border-white/5 rounded-2xl px-4 py-3 hover:border-white/10 transition-colors">
            <ChevronLeft size={16} className="text-gray-500" />
            <span className="text-gray-400 text-xs truncate">{prev.title}</span>
          </Link>
        )}
        {next && (
          <Link to={`/lesson/${next.id}`} className="flex-1 flex items-center justify-end gap-2 bg-[#17171f] border border-white/5 rounded-2xl px-4 py-3 hover:border-white/10 transition-colors">
            <span className="text-gray-400 text-xs truncate">{next.title}</span>
            <ChevronRight size={16} className="text-gray-500" />
          </Link>
        )}
      </div>
    </div>
  );
}

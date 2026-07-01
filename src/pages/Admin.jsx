import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  LogOut, Plus, Trash2, Edit2, ChevronDown, ChevronUp,
  BookOpen, Video, FileText, Save, X, Settings
} from 'lucide-react';

// --- Форма урока ---
function LessonForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    type: 'video+text',
    video: '',
    text: '',
    task: '',
    free: false,
    ...initial,
  });

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600 mb-1 block">Название урока *</label>
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Введите название"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Тип урока</label>
          <select
            value={form.type}
            onChange={e => set('type', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
          >
            <option value="video+text">Видео + текст</option>
            <option value="video+task">Видео + задание</option>
            <option value="text+task">Текст + задание</option>
            <option value="video">Только видео</option>
            <option value="text">Только текст</option>
            <option value="practice">Практика</option>
          </select>
        </div>

        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.free}
              onChange={e => set('free', e.target.checked)}
              className="w-4 h-4 accent-purple-700"
            />
            <span className="text-sm text-gray-700">Бесплатный урок</span>
          </label>
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600 mb-1 block">Ссылка на видео (YouTube)</label>
          <input
            value={form.video}
            onChange={e => set('video', e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
          />
          <p className="text-xs text-gray-400 mt-1">Используй ссылку вида: youtube.com/embed/ID_видео</p>
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600 mb-1 block">Текст урока</label>
          <textarea
            value={form.text}
            onChange={e => set('text', e.target.value)}
            placeholder="Текст урока. Поддерживается ## Заголовок, **жирный**, - список"
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-y"
          />
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600 mb-1 block">Задание</label>
          <textarea
            value={form.task}
            onChange={e => set('task', e.target.value)}
            placeholder="Опишите задание для ученика"
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-y"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => form.title.trim() && onSave(form)}
          className="flex items-center gap-1.5 bg-purple-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors font-medium"
        >
          <Save size={14} /> Сохранить
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <X size={14} /> Отмена
        </button>
      </div>
    </div>
  );
}

// --- Карточка модуля ---
function ModuleCard({ mod, onDeleteModule, onUpdateModule, onAddLesson, onUpdateLesson, onDeleteLesson }) {
  const [expanded, setExpanded] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleVal, setTitleVal] = useState(mod.title);
  const [addingLesson, setAddingLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  function saveTitle() {
    if (titleVal.trim()) onUpdateModule(mod.id, titleVal.trim());
    setEditingTitle(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Шапка модуля */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-800 px-5 py-3 flex items-center gap-3">
        <button onClick={() => setExpanded(!expanded)} className="text-white/70 hover:text-white">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {editingTitle ? (
          <input
            value={titleVal}
            onChange={e => setTitleVal(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={e => e.key === 'Enter' && saveTitle()}
            autoFocus
            className="flex-1 bg-white/20 text-white placeholder-white/50 rounded-lg px-3 py-1 text-sm focus:outline-none"
          />
        ) : (
          <span className="flex-1 text-white font-bold">{mod.title}</span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-white/60 text-xs">{mod.lessons.length} уроков</span>
          <button onClick={() => setEditingTitle(!editingTitle)} className="text-white/70 hover:text-white p-1">
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => window.confirm(`Удалить модуль "${mod.title}"?`) && onDeleteModule(mod.id)}
            className="text-white/70 hover:text-red-300 p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Уроки */}
      {expanded && (
        <div className="p-4 space-y-2">
          {mod.lessons.length === 0 && !addingLesson && (
            <p className="text-gray-400 text-sm text-center py-3">Уроков пока нет</p>
          )}

          {mod.lessons.map((lesson, i) => (
            <div key={lesson.id}>
              {editingLesson === lesson.id ? (
                <LessonForm
                  initial={lesson}
                  onSave={(data) => {
                    onUpdateLesson(mod.id, lesson.id, data);
                    setEditingLesson(null);
                  }}
                  onCancel={() => setEditingLesson(null)}
                />
              ) : (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 ${i > 0 ? '' : ''}`}>
                  <div className="flex-shrink-0 text-gray-400">
                    {lesson.video ? <Video size={16} /> : <FileText size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                    <p className="text-xs text-gray-400">
                      {lesson.type} {lesson.free && '· бесплатный'}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingLesson(lesson.id)}
                      className="p-1.5 text-gray-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => window.confirm(`Удалить урок "${lesson.title}"?`) && onDeleteLesson(mod.id, lesson.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {addingLesson ? (
            <LessonForm
              onSave={(data) => {
                onAddLesson(mod.id, data);
                setAddingLesson(false);
              }}
              onCancel={() => setAddingLesson(false)}
            />
          ) : (
            <button
              onClick={() => setAddingLesson(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-400 hover:border-purple-400 hover:text-purple-600 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Plus size={16} /> Добавить урок
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// --- Логин ---
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  function handle(e) {
    e.preventDefault();
    if (!onLogin(pw)) setError('Неверный пароль');
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Settings size={24} className="text-purple-700" />
          <h1 className="text-xl font-bold text-gray-900">Панель администратора</h1>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Пароль</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              placeholder="Введите пароль"
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-700 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition-colors"
          >
            Войти
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">Демо-пароль: admin123</p>
      </div>
    </div>
  );
}

// --- Главная страница админки ---
export default function Admin() {
  const {
    isAdmin, adminLogin, adminLogout,
    course, updateCourseInfo,
    addModule, updateModule, deleteModule,
    addLesson, updateLesson, deleteLesson,
  } = useAdmin();

  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [editingCourse, setEditingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: course.title, description: course.description });
  const [tab, setTab] = useState('modules');

  if (!isAdmin) return <AdminLogin onLogin={adminLogin} />;

  function handleAddModule() {
    if (!newModuleTitle.trim()) return;
    addModule(newModuleTitle.trim());
    setNewModuleTitle('');
  }

  function saveCourseInfo() {
    updateCourseInfo(courseForm);
    setEditingCourse(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-purple-400" />
          <span className="font-bold text-lg">Админ-панель</span>
          <span className="text-gray-400 text-sm">/ {course.title}</span>
        </div>
        <button
          onClick={adminLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} /> Выйти
        </button>
      </div>

      {/* Табы */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {[
            { key: 'modules', label: 'Модули и уроки' },
            { key: 'settings', label: 'Настройки курса' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-purple-700 text-purple-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* --- Вкладка: Модули и уроки --- */}
        {tab === 'modules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">
                Модули курса
                <span className="ml-2 text-sm font-normal text-gray-400">{course.modules.length} модулей</span>
              </h2>
            </div>

            {/* Добавить модуль */}
            <div className="flex gap-3">
              <input
                value={newModuleTitle}
                onChange={e => setNewModuleTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddModule()}
                placeholder="Название нового модуля..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleAddModule}
                className="flex items-center gap-2 bg-purple-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-purple-800 transition-colors"
              >
                <Plus size={16} /> Добавить модуль
              </button>
            </div>

            {/* Список модулей */}
            {course.modules.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">Добавьте первый модуль курса</p>
              </div>
            ) : (
              course.modules.map(mod => (
                <ModuleCard
                  key={mod.id}
                  mod={mod}
                  onDeleteModule={deleteModule}
                  onUpdateModule={updateModule}
                  onAddLesson={addLesson}
                  onUpdateLesson={updateLesson}
                  onDeleteLesson={deleteLesson}
                />
              ))
            )}
          </div>
        )}

        {/* --- Вкладка: Настройки курса --- */}
        {tab === 'settings' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Настройки курса</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Название курса</label>
                <input
                  value={courseForm.title}
                  onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Описание курса</label>
                <textarea
                  value={courseForm.description}
                  onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Автор курса</label>
                <input
                  value={courseForm.author || course.author}
                  onChange={e => setCourseForm(p => ({ ...p, author: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Бесплатных уроков (для гостей)</label>
                <input
                  type="number"
                  min={0}
                  value={courseForm.freeUntil ?? course.freeUntil}
                  onChange={e => setCourseForm(p => ({ ...p, freeUntil: Number(e.target.value) }))}
                  className="w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>
              <button
                onClick={saveCourseInfo}
                className="flex items-center gap-2 bg-purple-700 text-white font-medium text-sm px-6 py-3 rounded-xl hover:bg-purple-800 transition-colors"
              >
                <Save size={16} /> Сохранить изменения
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

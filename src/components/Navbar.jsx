import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, BookOpen, User, LogIn } from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export default function Navbar({ children }) {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/modules', icon: BookOpen, label: 'Курсы' },
    { path: user ? '/dashboard' : '/login', icon: user ? User : LogIn, label: user ? 'Профиль' : 'Войти' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col max-w-md mx-auto relative">
      {/* Верхняя шапка */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1e1e2e] flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">{getGreeting()}</p>
            <p className="font-semibold text-white text-sm leading-tight">
              {user ? user.name : 'Гость'}
            </p>
          </div>
        </div>

        {user && (
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Выйти
          </button>
        )}
      </header>

      {/* Контент */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Нижняя навигация */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#17171f]/95 backdrop-blur border-t border-white/5 px-4 py-3 flex justify-around z-50">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-white' : 'text-gray-500'}`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-white/10' : ''}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

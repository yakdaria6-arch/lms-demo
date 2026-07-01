import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, BookOpen, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-purple-700">
          <BookOpen size={22} />
          <span>ОсновыДизайна</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/modules" className="text-gray-600 hover:text-purple-700 transition-colors text-sm font-medium">
            Программа курса
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-600 hover:text-purple-700 transition-colors text-sm font-medium">
              Мой прогресс
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-700">
                <User size={16} />
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-600 hover:text-purple-700 font-medium">
                Войти
              </Link>
              <Link
                to="/register"
                className="bg-purple-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors font-medium"
              >
                Начать бесплатно
              </Link>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-1 text-gray-600" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link to="/modules" className="text-gray-700 font-medium" onClick={() => setOpen(false)}>
            Программа курса
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-700 font-medium" onClick={() => setOpen(false)}>
              Мой прогресс
            </Link>
          )}
          {user ? (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="text-left text-red-500 font-medium">
              Выйти
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 font-medium" onClick={() => setOpen(false)}>Войти</Link>
              <Link to="/register" className="bg-purple-700 text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setOpen(false)}>
                Начать бесплатно
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Заполните все поля'); return; }
    login('Пользователь', form.email);
    navigate('/dashboard');
  }

  return (
    <div className="px-5 py-8">
      <h1 className="text-white font-bold text-2xl mb-1">Вход</h1>
      <p className="text-gray-500 text-sm mb-8">Войдите в свой аккаунт</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1.5 block">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full bg-[#17171f] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1.5 block">Пароль</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            className="w-full bg-[#17171f] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity mt-2"
        >
          Войти
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Нет аккаунта?{' '}
        <Link to="/register" className="text-violet-400 font-medium hover:text-violet-300">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

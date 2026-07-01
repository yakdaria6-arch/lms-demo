import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Заполните все поля'); return; }
    if (form.password.length < 6) { setError('Пароль минимум 6 символов'); return; }
    login(form.name, form.email);
    navigate('/modules');
  }

  return (
    <div className="px-5 py-8">
      <h1 className="text-white font-bold text-2xl mb-1">Регистрация</h1>
      <p className="text-gray-500 text-sm mb-8">Первые 2 урока бесплатно</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key: 'name', label: 'Имя', placeholder: 'Ваше имя', type: 'text' },
          { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
          { key: 'password', label: 'Пароль', placeholder: 'Минимум 6 символов', type: 'password' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-gray-400 text-sm mb-1.5 block">{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full bg-[#17171f] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        ))}
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity mt-2"
        >
          Зарегистрироваться
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="text-violet-400 font-medium hover:text-violet-300">
          Войти
        </Link>
      </p>
    </div>
  );
}

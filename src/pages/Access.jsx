import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Key, CheckCircle } from 'lucide-react';

export default function Access() {
  const { applyCode, hasFullAccess } = useApp();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleApply() {
    if (code.trim() === 'DEMO2024') {
      applyCode(code.trim());
      setSuccess(true);
      setTimeout(() => navigate('/modules'), 1500);
    } else {
      setError('Неверный код доступа');
    }
  }

  if (hasFullAccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">У вас полный доступ!</h2>
        <p className="text-gray-500 mb-6">Все уроки курса открыты</p>
        <button
          onClick={() => navigate('/modules')}
          className="bg-purple-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-800"
        >
          Перейти к урокам
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Получить доступ</h1>
        <p className="text-gray-500 text-sm mb-8">Введите код доступа или оплатите курс</p>

        {/* Тарифы */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border-2 border-gray-100 rounded-2xl p-4 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase mb-2">Бесплатно</p>
            <p className="text-2xl font-bold text-gray-900">0 ₽</p>
            <p className="text-xs text-gray-500 mt-2">2 урока</p>
          </div>
          <div className="border-2 border-purple-700 rounded-2xl p-4 text-center bg-purple-50">
            <p className="text-xs font-medium text-purple-700 uppercase mb-2">Полный доступ</p>
            <p className="text-2xl font-bold text-purple-900">4 990 ₽</p>
            <p className="text-xs text-purple-600 mt-2">Все уроки навсегда</p>
          </div>
        </div>

        <button className="w-full bg-purple-700 text-white font-bold py-3.5 rounded-xl hover:bg-purple-800 transition-colors mb-6">
          Оплатить 4 990 ₽
        </button>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
            <Key size={16} className="text-gray-400" />
            Есть код доступа?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value); setError(''); }}
              placeholder="Введите код"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleApply}
              className="bg-gray-900 text-white font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Применить
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {success && <p className="text-green-600 text-xs mt-2 font-medium">✅ Доступ открыт! Перенаправляем...</p>}
          <p className="text-xs text-gray-400 mt-3">Демо-код: <code className="bg-gray-100 px-1 rounded">DEMO2024</code></p>
        </div>
      </div>
    </div>
  );
}

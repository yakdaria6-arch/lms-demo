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
      <div className="px-5 py-16 text-center">
        <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">Полный доступ открыт!</h2>
        <p className="text-gray-400 mb-6">Все уроки доступны</p>
        <button onClick={() => navigate('/modules')} className="bg-violet-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-violet-700">
          К урокам
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-8">
      <h1 className="text-white font-bold text-2xl mb-1">Получить доступ</h1>
      <p className="text-gray-500 text-sm mb-8">Выберите тариф или введите код</p>

      {/* Тарифы */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#17171f] border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-xs uppercase mb-2">Бесплатно</p>
          <p className="text-white text-2xl font-bold">0 ₽</p>
          <p className="text-gray-600 text-xs mt-1">2 урока</p>
        </div>
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-4 text-center">
          <p className="text-purple-200 text-xs uppercase mb-2">Полный</p>
          <p className="text-white text-2xl font-bold">4 990 ₽</p>
          <p className="text-purple-200 text-xs mt-1">Все уроки</p>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity mb-8">
        Оплатить 4 990 ₽
      </button>

      {/* Код доступа */}
      <div className="bg-[#17171f] rounded-2xl p-4 border border-white/5">
        <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
          <Key size={16} /> Код доступа
        </p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={e => { setCode(e.target.value); setError(''); }}
            placeholder="Введите код"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={handleApply}
            className="bg-violet-600 text-white font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-violet-700"
          >
            OK
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        {success && <p className="text-emerald-400 text-xs mt-2 font-medium">✅ Доступ открыт!</p>}
        <p className="text-gray-600 text-xs mt-3">Демо-код: <span className="text-gray-400">DEMO2024</span></p>
      </div>
    </div>
  );
}

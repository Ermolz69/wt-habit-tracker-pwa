import { useState } from 'react';
import { useAuthStore } from '@/entities/user';
import { API_URL } from '@/shared/api';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Щось пішло не так');
      }

      setUser(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-dark">
          {isLogin ? 'Вхід' : 'Реєстрація'}
        </h2>
        
        {error && <div className="text-danger mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Ім'я користувача" 
            className="p-3 rounded-xl border border-gray-300 focus:border-primary outline-none"
            required
          />
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Пароль" 
            className="p-3 rounded-xl border border-gray-300 focus:border-primary outline-none"
            required
          />
          <button type="submit" className="p-3 mt-2 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition">
            {isLogin ? 'Увійти' : 'Зареєструватись'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? 'Немає акаунту? ' : 'Вже є акаунт? '}
          <button 
            type="button"
            className="text-primary font-bold hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Створити' : 'Увійти'}
          </button>
        </p>
      </div>
    </div>
  );
};

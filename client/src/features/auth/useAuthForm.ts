import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import { loginUser, registerUser } from './api';

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = isLogin
        ? await loginUser({ username, password })
        : await registerUser({ username, password });

      setUser(response.user);
      navigate('/');
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Something went wrong';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    error,
    handleSubmit,
    isLogin,
    isSubmitting,
    password,
    setPassword,
    setUsername,
    toggleMode,
    username,
  };
};

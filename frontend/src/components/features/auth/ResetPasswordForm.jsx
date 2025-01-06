// frontend/src/components/features/auth/ResetPasswordForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { resetPassword } from '../../../store/slices/authSlice';

export function ResetPasswordForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Паролі не співпадають',
      });
      return;
    }

    if (formData.password.length < 6) {
      setStatus({
        type: 'error',
        message: 'Пароль повинен містити мінімум 6 символів',
      });
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        resetPassword({
          token,
          password: formData.password,
        })
      ).unwrap();

      setStatus({
        type: 'success',
        message: 'Пароль успішно змінено',
      });

      // Перенаправляємо на сторінку входу через 2 секунди
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Помилка при зміні паролю',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Встановлення нового паролю
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">Будь ласка, введіть новий пароль</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status.message && (
            <div
              className={`mb-4 p-4 rounded-md ${
                status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {status.message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Новий пароль
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Введіть новий пароль"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Підтвердження паролю
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Підтвердіть новий пароль"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Збереження...' : 'Зберегти новий пароль'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;

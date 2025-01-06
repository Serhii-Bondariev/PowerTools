// frontend/src/components/features/auth/ForgotPasswordForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Mail } from 'lucide-react';
import { requestPasswordReset } from '../../../store/slices/authSlice';

export function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(requestPasswordReset({ email })).unwrap();
      setStatus({
        type: 'success',
        message: 'Інструкції з відновлення паролю відправлені на вашу пошту',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Помилка при відправці запиту',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Відновлення паролю</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Введіть email, і ми надішлемо вам інструкції з відновлення
        </p>
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Введіть ваш email"
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
                {loading ? 'Відправляємо...' : 'Відправити'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;

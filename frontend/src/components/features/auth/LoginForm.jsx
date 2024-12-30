// src/features/auth/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Chrome, Facebook } from 'lucide-react';
import { login, socialLogin, clearError } from '../../../store/slices/authSlice';
import { useGoogleLogin } from '@react-oauth/google';

export function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  // Налаштування Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json());

        await dispatch(
          socialLogin({
            provider: 'google',
            token: tokenResponse.access_token,
            email: userInfo.email,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
          })
        ).unwrap();

        navigate('/');
      } catch (error) {
        console.error('Google login failed:', error);
        setLocalError(error || 'Google login failed');
      }
    },
    onError: () => {
      setLocalError('Failed to login with Google');
    },
  });

  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Ефект для перенаправлення після успішного входу
  useEffect(() => {
    if (user) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  // Обробник форми входу
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Login attempt with:', {
        email: formData.email,
        password: formData.password,
      });

      const result = await dispatch(
        login({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();

      console.log('Login successful:', result);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', {
        error,
        message: error.message,
        stack: error.stack,
      });
      setLocalError(error.message || 'Failed to login');
    }
  };

  // Налаштування Google Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json());

        await dispatch(
          socialLogin({
            provider: 'google',
            token: tokenResponse.access_token,
            email: userInfo.email,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
          })
        ).unwrap();

        navigate('/');
      } catch (error) {
        console.error('Google login failed:', error);
        setLocalError(error || 'Google login failed');
      }
    },
    onError: () => {
      setLocalError('Failed to login with Google');
    },
  });

  // Обробник входу через Facebook
  const handleFacebookLogin = async () => {
    try {
      await dispatch(socialLogin({ provider: 'facebook' })).unwrap();
    } catch (error) {
      setLocalError(error || 'Facebook login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(error || localError) && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email поле */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password поле */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember me і Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit кнопка */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Соціальні кнопки */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => googleLogin()} // Тепер викликаємо функцію googleLogin
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <Chrome className="h-5 w-5 mr-2 text-red-500" />
                Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <Facebook className="h-5 w-5 mr-2 text-blue-600" />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

// // src/features/auth/LoginForm.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { Mail, Lock, AlertCircle, Chrome, Facebook } from 'lucide-react';
// import { login, socialLogin, clearError } from '../../../store/slices/authSlice';
// import { useGoogleLogin } from '@react-oauth/google';
// import jwt_decode from 'jwt-decode';

// export function LoginForm() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Отримуємо дані з Redux store
//   const { user, loading, error } = useSelector((state) => state.auth);

//   // Локальні стейти
//   const [localError, setLocalError] = useState('');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });

//   // Ефект для перенаправлення після успішного входу
//   useEffect(() => {
//     if (user) {
//       navigate('/');
//     }
//     return () => {
//       dispatch(clearError());
//     };
//   }, [user, navigate, dispatch]);

//   // Обробник форми входу
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(
//         login({
//           email: formData.email,
//           password: formData.password,
//         })
//       ).unwrap();
//     } catch (error) {
//       setLocalError(error || 'Invalid email or password');
//     }
//   };

//   // Обробник входу через Google
//   const handleGoogleLogin = async () => {
//     try {
//       await dispatch(socialLogin({ provider: 'google' })).unwrap();
//     } catch (error) {
//       setLocalError(error || 'Google login failed');
//     }
//   };

//   // Обробник входу через Facebook
//   const handleFacebookLogin = async () => {
//     try {
//       await dispatch(socialLogin({ provider: 'facebook' })).unwrap();
//     } catch (error) {
//       setLocalError(error || 'Facebook login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
//           Sign in to your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{' '}
//           <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
//             create a new account
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {(error || localError) && (
//             <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
//               <AlertCircle className="h-5 w-5 mr-2" />
//               {error || localError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email поле */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email address</label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>

//             {/* Password поле */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="password"
//                   required
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="Enter your password"
//                 />
//               </div>
//             </div>

//             {/* Remember me і Forgot password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember_me"
//                   type="checkbox"
//                   checked={formData.rememberMe}
//                   onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
//                   Remember me
//                 </label>
//               </div>
//               <div className="text-sm">
//                 <Link
//                   to="/forgot-password"
//                   className="font-medium text-blue-600 hover:text-blue-500"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>
//             </div>

//             {/* Submit кнопка */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                   loading ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </button>
//             </div>
//           </form>

//           {/* Соціальні кнопки */}
//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={handleGoogleLogin}
//                 className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//               >
//                 <Chrome className="h-5 w-5 mr-2 text-red-500" />
//                 Google
//               </button>
//               <button
//                 type="button"
//                 onClick={handleFacebookLogin}
//                 className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//               >
//                 <Facebook className="h-5 w-5 mr-2 text-blue-600" />
//                 Facebook
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginForm;

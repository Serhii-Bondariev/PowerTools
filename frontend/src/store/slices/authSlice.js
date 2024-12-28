// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Sending login request:', { email });
      const { data } = await axios.post('/api/users/login', { email, password });
      console.log('Login response:', data);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Помилка входу');
    }
  }
);

export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async ({ provider, token, email, firstName, lastName }, { rejectWithValue }) => {
    try {
      console.log('Sending social login request:', {
        provider,
        email,
        firstName,
        lastName,
      });

      const { data } = await axios.post('/api/users/social-login', {
        provider,
        token,
        email,
        firstName,
        lastName,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Social login error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 'Помилка входу через соціальну мережу'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(socialLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// // frontend/src/store/slices/authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../utils/axios';

// export const login = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post('/users/login', { email, password });
//       // Зберігаємо токен та дані користувача
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data));
//       return data.user;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       state.user = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout, clearError } = authSlice.actions;
// export default authSlice.reducer;

// frontend/src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Асинхронні дії
export const getUsers = createAsyncThunk(
  'users/getUsers',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/users', {
        params: {
          page,
          limit,
          ...filters,
        },
      });
      return {
        users: data.users,
        stats: data.stats,
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка при отриманні користувачів');
    }
  }
);

export const getUserDetails = createAsyncThunk(
  'users/getUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/users/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/users/${userId}`, userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/users/${userId}/role`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка при оновленні ролі');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/users/${userId}/toggle-status`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle user status');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка при видаленні користувача');
    }
  }
);

export const exportUsers = createAsyncThunk(
  'users/export',
  async ({ format, filters }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users/export`, {
        params: { format, ...filters },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export users');
    }
  }
);

const initialState = {
  users: [],
  currentUser: null,
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  successMessage: null,
  userStats: {
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    newThisMonth: 0,
  },
  activityLog: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    currentPage: 1, // Додаємо початкове значення
    totalPages: 1,
    successMessage: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.currentPage = action.payload.currentPage; // Важливо! Оновлюємо поточну сторінку
        state.totalPages = action.payload.totalPages;
        state.userStats = action.payload.stats;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Details
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.activityLog = action.payload.activityLog || [];
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        state.currentUser = updatedUser;
        state.successMessage = 'User updated successfully';
      })
      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        state.successMessage = 'User role updated successfully';
      })
      // Toggle User Status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        state.successMessage = `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.successMessage = 'User deleted successfully';
      })
      // Export Users
      .addCase(exportUsers.fulfilled, (state) => {
        state.successMessage = 'Users exported successfully';
      });
  },
});

export const { clearError, clearSuccessMessage, setCurrentPage, clearCurrentUser } =
  userSlice.actions;
export default userSlice.reducer;

// // frontend/src/store/slices/userSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../utils/axios';

// // Асинхронні дії
// export const getUsers = createAsyncThunk(
//   'users/getUsers',
//   async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get('/api/users', {
//         params: {
//           page,
//           limit,
//           ...filters,
//         },
//       });
//       return {
//         users: data.users,
//         stats: data.stats,
//         total: data.total,
//         totalPages: data.totalPages,
//         currentPage: data.currentPage,
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Помилка при отриманні користувачів');
//     }
//   }
// );

// export const getUserDetails = createAsyncThunk(
//   'users/getUserDetails',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get(`/api/users/${userId}`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
//     }
//   }
// );

// export const updateUser = createAsyncThunk(
//   'users/updateUser',
//   async ({ userId, userData }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.put(`/api/users/${userId}`, userData);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update user');
//     }
//   }
// );

// export const updateUserRole = createAsyncThunk(
//   'users/updateRole',
//   async ({ userId, role }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.put(`/api/users/${userId}/role`, { role });
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
//     }
//   }
// );

// export const toggleUserStatus = createAsyncThunk(
//   'users/toggleStatus',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const { data } = await api.put(`/api/users/${userId}/toggle-status`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to toggle user status');
//     }
//   }
// );

// export const deleteUser = createAsyncThunk(
//   'users/deleteUser',
//   async (userId, { rejectWithValue }) => {
//     try {
//       await api.delete(`/api/users/${userId}`);
//       return userId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
//     }
//   }
// );

// export const exportUsers = createAsyncThunk(
//   'users/export',
//   async ({ format, filters }, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/api/users/export`, {
//         params: { format, ...filters },
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `users-export.${format}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       return true;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to export users');
//     }
//   }
// );

// const initialState = {
//   users: [],
//   currentUser: null,
//   totalUsers: 0,
//   currentPage: 1,
//   totalPages: 1,
//   loading: false,
//   error: null,
//   successMessage: null,
//   userStats: {
//     total: 0,
//     active: 0,
//     inactive: 0,
//     admins: 0,
//     newThisMonth: 0,
//   },
//   activityLog: [],
// };

// const userSlice = createSlice({
//   name: 'users',
//   initialState: {
//     successMessage: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccessMessage: (state) => {
//       state.successMessage = null;
//     },
//     setCurrentPage: (state, action) => {
//       state.currentPage = action.payload;
//     },
//     clearCurrentUser: (state) => {
//       state.currentUser = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Users
//       .addCase(getUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload.users;
//         state.totalUsers = action.payload.total;
//         state.totalPages = action.payload.totalPages;
//         state.userStats = action.payload.stats;
//       })
//       .addCase(getUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Get User Details
//       .addCase(getUserDetails.fulfilled, (state, action) => {
//         state.currentUser = action.payload;
//         state.activityLog = action.payload.activityLog || [];
//       })
//       // Update User
//       .addCase(updateUser.fulfilled, (state, action) => {
//         const updatedUser = action.payload;
//         state.users = state.users.map((user) =>
//           user._id === updatedUser._id ? updatedUser : user
//         );
//         state.currentUser = updatedUser;
//         state.successMessage = 'User updated successfully';
//       })
//       // Update User Role
//       .addCase(updateUserRole.fulfilled, (state, action) => {
//         const updatedUser = action.payload;
//         state.users = state.users.map((user) =>
//           user._id === updatedUser._id ? updatedUser : user
//         );
//         state.successMessage = 'User role updated successfully';
//       })
//       // Toggle User Status
//       .addCase(toggleUserStatus.fulfilled, (state, action) => {
//         const updatedUser = action.payload;
//         state.users = state.users.map((user) =>
//           user._id === updatedUser._id ? updatedUser : user
//         );
//         state.successMessage = `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`;
//       })
//       // Delete User
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.users = state.users.filter((user) => user._id !== action.payload);
//         state.successMessage = 'User deleted successfully';
//       })
//       // Export Users
//       .addCase(exportUsers.fulfilled, (state) => {
//         state.successMessage = 'Users exported successfully';
//       });
//   },
// });

// export const { clearError, clearSuccessMessage, setCurrentPage, clearCurrentUser } =
//   userSlice.actions;
// export default userSlice.reducer;

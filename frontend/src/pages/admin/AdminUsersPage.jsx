// frontend/src/pages/admin/AdminUsersPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Eye,
  Shield,
  ShieldOff,
  Search,
  Download,
  Trash2,
  Lock,
  Unlock,
  ChevronDown,
  Edit,
  RefreshCw,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  toggleUserStatus,
  exportUsers,
  clearSuccessMessage,
  clearError,
} from '../../store/slices/userSlice';
import { UserDetailsModal } from './components/UserDetailsModal';
import { UserEditModal } from './components/UserEditModal';
import { UserFilters } from './components/UserFilters';
import { UserStatsCards } from './components/UserStatsCards';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { Toast } from '../../components/common/Toast';
import { Menu, MenuItem, MenuButton, MenuItems } from '@headlessui/react';
import { Tooltip } from '../../components/common/Tooltip';

const ITEMS_PER_PAGE = 10;

export function AdminUsersPage() {
  const dispatch = useDispatch();
  const {
    users = [],
    loading = false,
    error = null,
    successMessage = null,
    totalPages = 1,
    currentPage = 1,
    userStats = {
      total: 0,
      active: 0,
      inactive: 0,
      admins: 0,
      newThisMonth: 0,
    },
  } = useSelector((state) => state.users || {});

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    sortBy: 'newest',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [toastConfig, setToastConfig] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  // Функції-хелпери для показу повідомлень
  const showToast = (message, type = 'success') => {
    setToastConfig({
      show: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToastConfig((prev) => ({
      ...prev,
      show: false,
    }));
  };

  // Load users on mount and when filters change
  useEffect(() => {
    loadUsers();
  }, [dispatch, currentPage, filters]);

  useEffect(() => {
    dispatch(
      getUsers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        filters,
      })
    );
  }, [dispatch]);

  const loadUsers = () => {
    dispatch(
      getUsers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        filters: {
          ...filters,
          search: searchTerm,
        },
      })
    );
  };

  // Search handlers
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(
      getUsers({
        page: 1,
        limit: ITEMS_PER_PAGE,
        filters: {
          ...filters,
          search: searchTerm,
        },
      })
    );
  };

  // Export handlers
  const handleExport = async (format) => {
    try {
      await dispatch(
        exportUsers({
          format,
          filters: {
            ...filters,
            search: searchTerm,
          },
        })
      ).unwrap();
      showToast(`Користувачів успішно експортовано у форматі ${format}`, 'success');
    } catch (error) {
      showToast('Помилка при експорті користувачів', 'error');
    }
  };

  // Table header click handlers
  const handleHeaderClick = (filterType) => {
    const newFilters = { ...filters };

    switch (filterType) {
      case 'role':
        newFilters.role = filters.role === 'admin' ? 'user' : 'admin';
        break;
      case 'status':
        newFilters.status = filters.status === 'active' ? 'inactive' : 'active';
        break;
      case 'date':
        newFilters.sortBy = filters.sortBy === 'newest' ? 'oldest' : 'newest';
        break;
    }

    setFilters(newFilters);
    dispatch(
      getUsers({
        page: 1,
        limit: ITEMS_PER_PAGE,
        filters: newFilters,
      })
    );
  };

  // User action handlers
  const handleViewDetails = (userId) => {
    setSelectedUser(userId);
    setShowDetailsModal(true);
  };

  const handleEditUser = (userId) => {
    setSelectedUser(userId);
    setShowEditModal(true);
  };

  const handleRoleChange = async (userId) => {
    try {
      const result = await dispatch(updateUserRole({ userId })).unwrap();
      showToast('Роль користувача успішно оновлено', 'success');
      loadUsers();
    } catch (error) {
      showToast(error || 'Помилка при зміні ролі користувача', 'error');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage); // Оновлюємо локальний стан
    dispatch(
      getUsers({
        page: newPage,
        limit: ITEMS_PER_PAGE,
        filters: {
          ...filters,
          search: searchTerm,
        },
      })
    );
  };

  const handleStatusToggle = async (userId) => {
    try {
      await dispatch(toggleUserStatus(userId)).unwrap();
      showToast('Статус користувача успішно змінено', 'success');
      loadUsers();
    } catch (error) {
      showToast('Помилка при зміні статусу користувача', 'error');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser(selectedUser)).unwrap();
      showToast('Користувача успішно видалено', 'success');
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      showToast(error || 'Помилка при видаленні користувача', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <UserStatsCards stats={userStats} />

      {/* Actions Bar */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Пошук за ім'ям, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </form>

        {/* Filters */}
        <button
          onClick={() => setShowFilters(true)}
          className="px-4 py-2 border rounded-lg flex items-center gap-2"
        >
          <Filter className="h-5 w-5" />
          Фільтри
        </button>

        {/* Export */}
        <Menu as="div" className="relative">
          <MenuButton className="px-4 py-2 border rounded-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            Експорт
          </MenuButton>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleExport('csv')}
                  className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                >
                  Експорт в CSV
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleExport('xlsx')}
                  className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2`}
                >
                  Експорт в Excel
                </button>
              )}
            </MenuItem>
          </Menu.Items>
        </Menu>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleHeaderClick('name')}
                >
                  Користувач
                  {filters.sortBy === 'name' && <ChevronDown className="inline h-4 w-4" />}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleHeaderClick('role')}
                >
                  Роль
                  {filters.role !== 'all' && <ChevronDown className="inline h-4 w-4" />}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleHeaderClick('status')}
                >
                  Статус
                  {filters.status !== 'all' && <ChevronDown className="inline h-4 w-4" />}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleHeaderClick('date')}
                >
                  Остання активність
                  {filters.sortBy === 'date' && <ChevronDown className="inline h-4 w-4" />}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xl text-gray-600">
                              {user.firstName?.[0] || user.email[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.isAdmin ? 'Адмін' : 'Користувач'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Активний' : 'Неактивний'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastLogin || user.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Tooltip content="Переглянути деталі">
                        <button
                          onClick={() => handleViewDetails(user._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </Tooltip>

                      <Tooltip content="Редагувати">
                        <button
                          onClick={() => handleEditUser(user._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </Tooltip>

                      <Tooltip content={user.isAdmin ? 'Забрати права адміна' : 'Зробити адміном'}>
                        <button
                          onClick={() => handleRoleChange(user._id)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          {user.isAdmin ? (
                            <ShieldOff className="h-5 w-5" />
                          ) : (
                            <Shield className="h-5 w-5" />
                          )}
                        </button>
                      </Tooltip>

                      <Tooltip content={user.isActive ? 'Деактивувати' : 'Активувати'}>
                        <button
                          onClick={() => handleStatusToggle(user._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          {user.isActive ? (
                            <Lock className="h-5 w-5" />
                          ) : (
                            <Unlock className="h-5 w-5" />
                          )}
                        </button>
                      </Tooltip>

                      <Tooltip content="Видалити користувача">
                        <button
                          onClick={() => {
                            setSelectedUser(user._id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) =>
            dispatch(
              getUsers({
                page,
                limit: ITEMS_PER_PAGE,
                filters: {
                  ...filters,
                  search: searchTerm,
                },
              })
            )
          }
        />
      </div>

      {/* Modals */}
      <UserDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        userId={selectedUser}
      />

      <UserEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userId={selectedUser}
        onSave={loadUsers}
      />

      <UserFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        currentFilters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setShowFilters(false);
          dispatch(
            getUsers({
              page: 1,
              limit: ITEMS_PER_PAGE,
              filters: newFilters,
            })
          );
        }}
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteUser}
        title="Видалення користувача"
        message="Ви впевнені, що хочете видалити цього користувача? Цю дію неможливо відмінити."
      />

      {/* Toast Messages */}
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => dispatch(clearSuccessMessage())}
        />
      )}
      {error && <Toast message={error} type="error" onClose={() => dispatch(clearError())} />}
    </div>
  );
}

export default AdminUsersPage;

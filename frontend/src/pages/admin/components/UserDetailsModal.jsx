// frontend/src/pages/admin/components/UserDetailsModal.jsx
import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { useSelector } from 'react-redux';

export function UserDetailsModal({ isOpen, onClose, userId }) {
  const users = useSelector((state) => state.users?.users) || [];
  const user = users.find((u) => u?._id === userId);

  if (!isOpen) return null;

  if (!user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Details">
        <div className="p-4 text-center text-gray-500">User not found</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
          <div className="mt-2">
            <p>
              <span className="font-medium">Name:</span> {user.firstName} {user.lastName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user.isAdmin ? 'Admin' : 'User'}
            </p>
            <p>
              <span className="font-medium">Status:</span> {user.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Activity</h3>
          <div className="mt-2">
            <p>
              <span className="font-medium">Last Active:</span>{' '}
              {new Date(user.lastLogin || user.updatedAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Joined:</span>{' '}
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// src/components/common/Pagination.jsx
import React from 'react';

export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
  return (
    <nav className="flex items-center space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="px-3 py-1 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded-lg border ${
            currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="px-3 py-1 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}

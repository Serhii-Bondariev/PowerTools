// src/components/common/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

export function LanguageSwitcher() {
  const { currentLanguage, setCurrentLanguage } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setCurrentLanguage('uk')}
        className={`px-2 py-1 rounded ${
          currentLanguage === 'uk' ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
      >
        UA
      </button>
      <button
        onClick={() => setCurrentLanguage('en')}
        className={`px-2 py-1 rounded ${
          currentLanguage === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  );
}
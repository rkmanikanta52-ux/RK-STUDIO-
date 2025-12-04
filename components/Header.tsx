import React from 'react';
import { ChefHatIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg text-white">
            <ChefHatIcon className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            Kurnool Biryani Finder
          </h1>
        </div>
        <div className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          Powered by Gemini
        </div>
      </div>
    </header>
  );
};
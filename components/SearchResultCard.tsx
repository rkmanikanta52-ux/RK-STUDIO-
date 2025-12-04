import React from 'react';
import { StarIcon, MapPinIcon, UtensilsIcon } from './Icons';
import { Restaurant } from '../types';

interface SearchResultCardProps {
  restaurant: Restaurant;
  index: number;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ restaurant, index }) => {
  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-1">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-orange-500">
            <StarIcon className="w-4 h-4 fill-current" fill={true} />
            <span className="font-bold text-sm">{restaurant.rating}</span>
          </div>
        </div>
        <div className="p-2 bg-orange-50 rounded-full text-orange-600">
          <UtensilsIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Why it's good</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{restaurant.description}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
            Famous For
          </h4>
          <p className="text-sm font-medium text-slate-800">{restaurant.specialties}</p>
        </div>
      </div>
    </div>
  );
};
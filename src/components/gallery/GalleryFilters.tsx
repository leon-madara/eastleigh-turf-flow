import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { categories } from '@/data/galleryData';

interface GalleryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto max-w-2xl"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by title, location, or description..."
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-12 text-gray-900 shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {categories.map((category, index) => {
          const isActive = selectedCategory === category.id;
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onCategoryChange(category.id)}
              className={`group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Active Background Animation */}
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center space-x-2">
                <span>{category.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}
                >
                  {category.count}
                </span>
              </span>

              {/* Hover Effect for Inactive Buttons */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || searchQuery) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-sm text-gray-600">Active filters:</span>

          {selectedCategory !== 'all' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
            >
              <span className="capitalize">{selectedCategory}</span>
              <button
                onClick={() => onCategoryChange('all')}
                className="text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          )}

          {searchQuery && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              <span>"{searchQuery}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          )}

          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                onCategoryChange('all');
                onSearchChange('');
              }}
              className="text-sm font-medium text-gray-600 underline hover:text-gray-800"
            >
              Clear all
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GalleryFilters;

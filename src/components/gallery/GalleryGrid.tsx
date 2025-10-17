import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { GalleryItem } from '@/data/galleryData';

interface GalleryGridProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem, index: number) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onItemClick }) => {
  // Distribute items into columns for masonry layout
  const columns = useMemo(() => {
    const cols: GalleryItem[][] = [[], [], []]; // 3 columns for desktop
    items.forEach((item, index) => {
      cols[index % 3].push(item);
    });
    return cols;
  }, [items]);

  return (
    <div className="w-full">
      {/* Mobile & Tablet: Single Column */}
      <div className="grid gap-6 md:hidden">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard
                item={item}
                index={index}
                onClick={() => onItemClick(item, index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Tablet: 2 Columns */}
      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:hidden">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard
                item={item}
                index={index}
                onClick={() => onItemClick(item, index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop: Masonry Layout (3 Columns) */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-6">
              {column.map((item, itemIndex) => {
                const originalIndex = items.findIndex(i => i.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.5,
                      delay: (columnIndex * 0.1) + (itemIndex * 0.1)
                    }}
                  >
                    <ProjectCard
                      item={item}
                      index={originalIndex}
                      onClick={() => onItemClick(item, originalIndex)}
                    />
                  </motion.div>
                );
              })}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalleryGrid;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Ruler, Play, Expand } from 'lucide-react';
import { GalleryItem } from '@/data/galleryData';

interface ProjectCardProps {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ item, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl">
        {/* Image Container with Parallax Effect */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
              style={{
                animation: 'shimmer 2s infinite'
              }}
            />
          )}

          {/* Main Image/Video Thumbnail */}
          <motion.img
            src={item.type === 'video' ? item.thumbnail : item.src}
            alt={item.title}
            className={`h-full w-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500"
            style={{ opacity: isHovered ? 1 : 0.6 }}
          />

          {/* Video Play Button */}
          {item.type === 'video' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: isHovered ? 1.2 : 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-2xl transition-all duration-300 hover:bg-white">
                <Play className="h-8 w-8 fill-green-600 text-green-600" />
              </div>
            </motion.div>
          )}

          {/* Category Badge */}
          <div className="absolute left-4 top-4 z-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="rounded-full bg-white/90 px-3 py-1 backdrop-blur-md"
            >
              <span className="text-xs font-semibold capitalize text-gray-800">
                {item.category}
              </span>
            </motion.div>
          </div>

          {/* Featured Badge */}
          {item.featured && (
            <div className="absolute right-4 top-4 z-10">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="rounded-full bg-amber-500/90 px-3 py-1 backdrop-blur-md"
              >
                <span className="text-xs font-bold text-white">★ Featured</span>
              </motion.div>
            </div>
          )}

          {/* Expand Icon on Hover */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovered ? 1 : 0,
              opacity: isHovered ? 1 : 0
            }}
            className="absolute right-4 bottom-4 z-10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg">
              <Expand className="h-5 w-5 text-gray-800" />
            </div>
          </motion.div>
        </div>

        {/* Content Section with Glassmorphism */}
        <div className="relative p-5">
          {/* Title */}
          <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 transition-colors duration-300 group-hover:text-green-600">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>

          {/* Details Grid */}
          <div className="space-y-2">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="mr-2 h-4 w-4 text-green-600" />
              <span className="font-medium">{item.location}</span>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="mr-2 h-4 w-4 text-green-600" />
              <span className="font-medium">{item.date}</span>
            </div>

            {item.area && (
              <div className="flex items-center text-xs text-gray-500">
                <Ruler className="mr-2 h-4 w-4 text-green-600" />
                <span className="font-medium">{item.area} m²</span>
              </div>
            )}
          </div>

          {/* Hover Effect Bottom Border */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* 3D Tilt Effect Border */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 transition-all duration-500 group-hover:ring-2 group-hover:ring-green-400/50"
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ProjectCard;

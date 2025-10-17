import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, MapPin, Calendar, Ruler, User } from 'lucide-react';
import { GalleryItem } from '@/data/galleryData';
import { Button } from '@/components/ui/button';

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showDetails, setShowDetails] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentItem = items[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          setZoom((prev) => Math.min(prev + 0.25, 3));
          break;
        case '-':
          setZoom((prev) => Math.max(prev - 0.25, 0.5));
          break;
        case 'i':
          setShowDetails((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset zoom when changing images
  useEffect(() => {
    setZoom(1);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % items.length);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentItem.src;
    link.download = `${currentItem.title}.${currentItem.type === 'video' ? 'mp4' : 'jpg'}`;
    link.click();
  };

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(20px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-black/95"
            onClick={onClose}
          />

          {/* Content Container */}
          <div className="relative z-10 flex h-full w-full flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 md:p-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-white"
                >
                  <h2 className="text-lg md:text-xl font-bold">{currentItem.title}</h2>
                  <p className="text-sm text-gray-400">
                    {currentIndex + 1} / {items.length}
                  </p>
                </motion.div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Zoom Controls (Desktop only) */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
                    className="text-white hover:bg-white/10"
                    disabled={currentItem.type === 'video'}
                  >
                    <ZoomOut className="h-5 w-5" />
                  </Button>
                  <span className="text-sm text-white">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3))}
                    className="text-white hover:bg-white/10"
                    disabled={currentItem.type === 'video'}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                </div>

                {/* Download Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/10"
                >
                  <Download className="h-5 w-5" />
                </Button>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 md:px-20">
              <div className="relative flex h-full w-full items-center justify-center">
                {/* Previous Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  className="absolute left-0 z-20 h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 md:left-4"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                {/* Image/Video Display */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex max-h-[80vh] max-w-[90vw] items-center justify-center"
                >
                  {currentItem.type === 'image' ? (
                    <img
                      src={currentItem.src}
                      alt={currentItem.title}
                      className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
                      style={{
                        transform: `scale(${zoom})`,
                        transition: 'transform 0.3s ease-out',
                      }}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={currentItem.src}
                      controls
                      autoPlay
                      className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
                    />
                  )}
                </motion.div>

                {/* Next Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="absolute right-0 z-20 h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 md:right-4"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            </div>

            {/* Bottom Details Panel */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="border-t border-white/10 bg-black/50 p-4 backdrop-blur-xl md:p-6"
                >
                  <div className="mx-auto max-w-6xl">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Description */}
                      <div className="md:col-span-2">
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                          Description
                        </h3>
                        <p className="text-sm text-white">{currentItem.description}</p>
                      </div>

                      {/* Details Grid */}
                      <div>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                          Project Details
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-white">
                            <MapPin className="mr-2 h-4 w-4 text-green-400" />
                            {currentItem.location}
                          </div>
                          <div className="flex items-center text-sm text-white">
                            <Calendar className="mr-2 h-4 w-4 text-green-400" />
                            {currentItem.date}
                          </div>
                          {currentItem.area && (
                            <div className="flex items-center text-sm text-white">
                              <Ruler className="mr-2 h-4 w-4 text-green-400" />
                              {currentItem.area} m²
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      {(currentItem.turfType || currentItem.clientName) && (
                        <div>
                          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                            Additional Info
                          </h3>
                          <div className="space-y-2">
                            {currentItem.turfType && (
                              <div className="text-sm text-white">
                                <span className="text-gray-400">Turf Type:</span> {currentItem.turfType}
                              </div>
                            )}
                            {currentItem.clientName && (
                              <div className="flex items-center text-sm text-white">
                                <User className="mr-2 h-4 w-4 text-green-400" />
                                {currentItem.clientName}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Details Button */}
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="absolute bottom-4 right-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md hover:bg-white/20 md:bottom-6 md:right-6"
            >
              {showDetails ? 'Hide' : 'Show'} Details (i)
            </button>

            {/* Keyboard Shortcuts Hint */}
            <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 space-y-1 text-xs text-white/50 lg:block">
              <div>← → Navigate</div>
              <div>+ - Zoom</div>
              <div>i Info</div>
              <div>Esc Close</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;

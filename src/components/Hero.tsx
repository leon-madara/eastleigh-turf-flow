import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroBeforeImage from '@/assets/hero-before.jpg';
import heroAfterImage from '@/assets/hero-after.jpg';

const Hero = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Reset to center with smooth ease animation
    setTimeout(() => {
      const startPos = sliderPosition;
      const targetPos = 50;
      const duration = 800; // 0.8 seconds
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentPos = startPos + (targetPos - startPos) * easeOut;
        
        setSliderPosition(currentPos);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, 100);
  }, [sliderPosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    // Reset to center with smooth ease animation
    setTimeout(() => {
      const startPos = sliderPosition;
      const targetPos = 50;
      const duration = 800; // 0.8 seconds
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentPos = startPos + (targetPos - startPos) * easeOut;
        
        setSliderPosition(currentPos);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, 100);
  }, [sliderPosition]);

  // Global event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          Transform Your Space with
          <span className="block text-gradient mt-2">Premium Turf Grass</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90 animate-slide-up">
          From barren landscapes to lush green paradise. Experience the difference with Eastleigh's premium artificial turf.
        </p>

        {/* Before/After Image Slider */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
          style={{ aspectRatio: '2/1' }}
        >
          {/* Before Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${heroBeforeImage})`,
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
            }}
          />
          
          {/* After Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${heroAfterImage})`,
              clipPath: `inset(0 0 0 ${sliderPosition}%)`
            }}
          />

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            After
          </div>

          {/* Divider Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-lg"
            style={{ left: `${sliderPosition}%` }}
          />

          {/* Drag Handle */}
          <div
            className="divider-handle"
            style={{ left: `calc(${sliderPosition}% - 12px)` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-bounce-in">
          <Link to="/products">
            <Button 
              size="lg" 
              className="btn-bounce grass-gradient text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl"
            >
              View Products
            </Button>
          </Link>
          
          <Link to="/contact">
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-bounce bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-3 rounded-xl backdrop-blur-sm"
            >
              Get Quote
            </Button>
          </Link>
        </div>
      </div>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient" />
    </section>
  );
};

export default Hero;
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Expand, MapPin, Calendar, Ruler, User } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  location: string;
  completionDate: string;
  area: number;
  turfType: string;
  clientName: string;
  image: string;
  description: string;
}

const OurWork = () => {
  const [cartCount, setCartCount] = useState(0);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Sample project data
  const projects: Project[] = [
    {
      id: '1',
      title: 'Luxury Garden Transformation',
      location: 'Karen, Nairobi',
      completionDate: 'March 2024',
      area: 150,
      turfType: 'Luxury Turf 30mm',
      clientName: 'Grace Wanjiku',
      image: '/eastleigh-turf-flow/Products/VelvetGreen.png',
      description: 'A stunning residential transformation featuring premium artificial turf with perfect installation.'
    },
    {
      id: '2',
      title: 'Modern Office Courtyard',
      location: 'Westlands, Nairobi',
      completionDate: 'February 2024',
      area: 200,
      turfType: 'Commercial Grade 25mm',
      clientName: 'James Mwangi',
      image: '/eastleigh-turf-flow/Products/FlexTurf.png',
      description: 'Professional commercial installation creating a beautiful outdoor workspace.'
    },
    {
      id: '3',
      title: 'Family Playground Paradise',
      location: 'Eastleigh, Nairobi',
      completionDate: 'January 2024',
      area: 80,
      turfType: 'Sports Turf 20mm',
      clientName: 'Peter Kipchoge',
      image: '/eastleigh-turf-flow/Products/ProfessionalGrade.png',
      description: 'Safe and durable playground installation perfect for children to play.'
    },
    {
      id: '4',
      title: 'Estate Lawn Installation',
      location: 'Kileleshwa, Nairobi',
      completionDate: 'December 2023',
      area: 300,
      turfType: 'Luxury Turf 35mm',
      clientName: 'Mary Njoki',
      image: '/eastleigh-turf-flow/Products/ProfitGrass.png',
      description: 'Large-scale residential installation with premium quality artificial grass.'
    },
    {
      id: '5',
      title: 'Restaurant Outdoor Dining',
      location: 'Lavington, Nairobi',
      completionDate: 'November 2023',
      area: 120,
      turfType: 'Commercial Grade 30mm',
      clientName: 'David Kimani',
      image: '/eastleigh-turf-flow/Products/UltraTurf.png',
      description: 'Beautiful outdoor dining area with weather-resistant artificial turf.'
    }
  ];

  const currentProject = projects[currentProjectIndex];
  const previousProject = projects[(currentProjectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentProjectIndex + 1) % projects.length];

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleViewDetails = () => {
    console.log('View details for project:', currentProject.id);
  };

  // Touch handlers for mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProjectIndex, isTransitioning]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentProjectIndex]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartCount}
        onBrokerLogin={() => {}}
      />

      {/* Hero Section with Apple TV Gallery Effect */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/eastleigh-turf-flow/Products/VelvetGreen.png')`,
            filter: 'blur(2px) brightness(0.7)'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Apple TV Gallery Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div 
            ref={galleryRef}
            className="w-full max-w-6xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Page Title and Stats */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Our Transformations
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-6 px-4">
                See how we've transformed spaces across Nairobi
              </p>
              <div className="flex items-center justify-center space-x-4 md:space-x-8 text-white">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold">2,000+</div>
                  <div className="text-xs md:text-sm text-gray-300">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold">15+</div>
                  <div className="text-xs md:text-sm text-gray-300">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold">1,500+</div>
                  <div className="text-xs md:text-sm text-gray-300">Customers</div>
                </div>
              </div>
            </div>

            {/* Project Cards Container */}
            <div className="relative flex items-center justify-center">
              
              {/* Previous Project Card (Left) - Hidden on mobile */}
              <div 
                className={`absolute transform transition-all duration-300 hidden md:block ${
                  isTransitioning ? 'opacity-0 scale-95' : 'opacity-60 scale-90'
                }`}
                style={{ 
                  zIndex: 1,
                  left: '50%',
                  transform: 'translateX(-95%)'
                }}
              >
                <div className="w-96 h-[28rem] bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
                  <div 
                    className="w-full h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${previousProject.image})` }}
                  />
                  <div className="p-6 text-gray-800">
                    <h3 className="text-lg font-semibold mb-2">{previousProject.title}</h3>
                    <div className="flex items-center text-sm text-gray-300 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {previousProject.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="w-4 h-4 mr-1" />
                      {previousProject.completionDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Project Card (Center) */}
              <div 
                className={`relative transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ zIndex: 3 }}
              >
                <div className="relative w-full max-w-sm md:w-96 h-[400px] md:h-[32rem] rounded-3xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
                  
                  {/* Hero Image Section */}
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img 
                      src={currentProject.image}
                      alt={`Project: ${currentProject.title}`}
                      className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-90'}`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling instanceof HTMLElement) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                    
                    {/* Fallback gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 hidden items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-3xl mb-2">🌱</div>
                        <div className="font-semibold">Turf Project</div>
                      </div>
                    </div>
                    
                    {/* Image overlay gradient for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-white/90 backdrop-blur-md rounded-full px-3 py-1 border border-white/20 shadow-lg">
                        <span className="text-sm font-semibold text-gray-800">Residential</span>
                      </div>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute bottom-4 right-4 z-20">
                      <div className="bg-amber-500/90 backdrop-blur-md rounded-full px-3 py-1 border border-amber-300/20 shadow-lg">
                        <div className="flex items-center space-x-1">
                          <span className="text-white text-xs">⭐</span>
                          <span className="text-white text-sm font-bold">5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Glassmorphism Content Section */}
                  <div className="relative h-[calc(100%-theme(height.48))] md:h-[calc(100%-theme(height.64))] overflow-hidden">
                    
                    {/* Multi-layered glass effect */}
                    <div className="absolute inset-0">
                      {/* Primary glass layer */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95 backdrop-blur-xl"></div>
                      
                      {/* Secondary color layer for depth */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/5 to-pink-500/8"></div>
                      
                      {/* Noise texture overlay for glass authenticity */}
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
                        backgroundSize: '128px 128px'
                      }}></div>
                      
                      {/* Top border light reflection */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                      
                      {/* Side light reflections */}
                      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-white/40 via-transparent to-white/40"></div>
                      <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-white/40 via-transparent to-white/40"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 p-4 md:p-6 h-full flex flex-col">
                      
                      {/* Title Section */}
                      <div className="mb-4">
                        <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">
                          {currentProject.title}
                        </h1>
                        <p className="text-sm text-gray-600 font-medium">
                          {currentProject.description.split(' ').slice(0, 10).join(' ') + (currentProject.description.split(' ').length > 10 ? '...' : '')}
                        </p>
                      </div>

                      {/* Details Grid - Material 3 Design */}
                      <div className="flex-1 space-y-3">
                        
                        {/* Client & Location Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</div>
                            <div className="text-sm font-semibold text-gray-900">{currentProject.clientName}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</div>
                            <div className="text-sm font-semibold text-gray-900">{currentProject.location}</div>
                          </div>
                        </div>

                        {/* Value & Area Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Value</div>
                            <div className="text-lg font-bold text-emerald-600">Value on Request</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Area</div>
                            <div className="text-sm font-semibold text-gray-900">{currentProject.area} m²</div>
                          </div>
                        </div>

                        {/* Turf & Completion Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Turf Type</div>
                            <div className="text-sm font-semibold text-gray-900">{currentProject.turfType}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</div>
                            <div className="text-sm font-semibold text-blue-600">{currentProject.completionDate}</div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action/Status Bar */}
                      <div className="mt-4 pt-4 border-t border-gray-200/60">
                        <div className="flex items-center justify-between">
                          {/* Status Indicator */}
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-600">Project Completed</span>
                          </div>
                          
                          {/* Accent Line */}
                          <div className="flex-1 ml-4">
                            <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-60"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* View Details Button */}
                      <Button 
                        onClick={handleViewDetails}
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        View Details
                        <Expand className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Project Card (Right) - Hidden on mobile */}
              <div 
                className={`absolute transform transition-all duration-300 hidden md:block ${
                  isTransitioning ? 'opacity-0 scale-95' : 'opacity-60 scale-90'
                }`}
                style={{ 
                  zIndex: 1,
                  right: '50%',
                  transform: 'translateX(95%)'
                }}
              >
                <div className="w-96 h-[28rem] bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
                  <div 
                    className="w-full h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${nextProject.image})` }}
                  />
                  <div className="p-6 text-gray-800">
                    <h3 className="text-lg font-semibold mb-2">{nextProject.title}</h3>
                    <div className="flex items-center text-sm text-gray-300 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {nextProject.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="w-4 h-4 mr-1" />
                      {nextProject.completionDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center mt-8 space-x-2 md:space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 md:flex hidden"
              >
                <ChevronLeft className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Previous</span>
              </Button>
              
              <div className="flex space-x-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProjectIndex(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentProjectIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                    title={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 md:flex hidden"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4 ml-1 md:ml-2" />
              </Button>
            </div>

            {/* Mobile Swipe Instructions */}
            <div className="text-center mt-4 md:hidden">
              <p className="text-white/70 text-sm">Swipe left or right to browse projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Complete Project Gallery</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Browse all our completed projects with detailed information, before/after photos, and client testimonials.
          </p>
          <Button size="lg" className="btn-bounce">
            View All Projects (Coming Soon)
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurWork;

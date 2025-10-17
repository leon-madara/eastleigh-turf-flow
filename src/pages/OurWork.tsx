import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
import GalleryFilters from '@/components/gallery/GalleryFilters';
import { galleryItems, GalleryItem } from '@/data/galleryData';
import { Award, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const OurWork = () => {
  const [cartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  const statsRef = useScrollReveal({ threshold: 0.3 });

  // Filter gallery items
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleItemClick = (item: GalleryItem, index: number) => {
    const actualIndex = galleryItems.findIndex((i) => i.id === item.id);
    setCurrentLightboxIndex(actualIndex);
    setLightboxOpen(true);
  };

  const stats = [
    {
      icon: Award,
      value: '2,000+',
      label: 'Projects Completed',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      value: '1,500+',
      label: 'Happy Clients',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      value: '15+',
      label: 'Years Experience',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      value: '100%',
      label: 'Satisfaction Rate',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header cartCount={cartCount} onBrokerLogin={() => {}} />

      {/* Hero Section with Parallax */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 pt-20 md:pt-24">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6 inline-flex items-center space-x-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md"
            >
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold text-white">
                Showcasing Excellence
              </span>
            </motion.div>

            <h1 className="mb-6 bg-gradient-to-r from-white to-green-50 bg-clip-text text-4xl font-bold text-transparent md:text-6xl lg:text-7xl">
              Our Work Gallery
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-green-50 md:text-xl">
              Explore our portfolio of stunning turf installations across Nairobi.
              From residential gardens to commercial spaces, see the quality that
              sets us apart.
            </p>

            {/* Stats Grid */}
            <motion.div
              ref={statsRef.ref}
              initial={{ opacity: 0, y: 30 }}
              animate={statsRef.isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    statsRef.isVisible
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/10 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/20 md:p-6"
                >
                  <div className="relative z-10">
                    <div
                      className={`mb-3 inline-flex rounded-full bg-gradient-to-r ${stat.color} p-3`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="mb-1 text-2xl font-bold text-white md:text-3xl">
                      {stat.value}
                    </div>
                    <div className="text-sm text-green-50">{stat.label}</div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="relative h-16 md:h-24">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {/* Filters */}
        <GalleryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center"
        >
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {filteredItems.length}
            </span>{' '}
            {filteredItems.length === 1 ? 'project' : 'projects'}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <GalleryGrid items={filteredItems} onItemClick={handleItemClick} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center"
          >
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No projects found
            </h3>
            <p className="mb-6 text-gray-600">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="rounded-full bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Transform Your Space?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-green-50">
              Join thousands of satisfied customers who have upgraded their spaces
              with our premium artificial turf solutions.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="rounded-full bg-white px-8 py-3 font-semibold text-green-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Get a Free Quote
              </a>
              <a
                href="/products"
                className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-green-600"
              >
                Browse Products
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <GalleryLightbox
        items={galleryItems}
        currentIndex={currentLightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentLightboxIndex}
      />

      <Footer />
    </div>
  );
};

export default OurWork;

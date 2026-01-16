import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { packagesService } from '../services/database';
import { adaptPackage, Package } from '../utils/adapters';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  
  // Ksamil beach images
  const images = [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&q=80',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [tours, setTours] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tours for slides 2 and 3
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await packagesService.getAll({ status: 'published' });
        const adaptedTours = data.map(adaptPackage);
        setTours(adaptedTours.slice(0, 2)); // Get first 2 tours
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 4) % 4);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 4);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Get image for each slide
  const getSlideImage = (index: number) => {
    if (index === 0) {
      return images[0]; // First slide - general Ksamil image
    } else if (index === 1 && tours[0]) {
      return tours[0].image || images[1]; // Second slide - first tour image
    } else if (index === 2 && tours[1]) {
      return tours[1].image || images[2]; // Third slide - second tour image
    } else if (index === 3) {
      return images[3]; // Fourth slide - car rental image
    }
    return images[index] || images[0];
  };

  // Content for each slide
  const getSlideContent = () => {
    if (currentIndex === 0) {
      // First slide - general
      return {
        badge: 'Ksamil, Albania',
        title: t('hero.title'),
        subtitle: t('hero.subtitle'),
        primaryCta: t('hero.cta'),
        primaryLink: '/packages',
        secondaryCta: t('hero.cta2'),
        secondaryLink: '/cars',
      };
    } else if (currentIndex === 1 && tours[0]) {
      // Second slide - first tour
      return {
        badge: tours[0].destination,
        title: tours[0].title,
        subtitle: tours[0].description || 'Experience this amazing destination',
        price: tours[0].price,
        primaryCta: 'View Details',
        primaryLink: `/packages/${tours[0].id}`,
        secondaryCta: 'Book Now',
        secondaryLink: `/packages/${tours[0].id}/book`,
      };
    } else if (currentIndex === 2 && tours[1]) {
      // Third slide - second tour
      return {
        badge: tours[1].destination,
        title: tours[1].title,
        subtitle: tours[1].description || 'Experience this amazing destination',
        price: tours[1].price,
        primaryCta: 'View Details',
        primaryLink: `/packages/${tours[1].id}`,
        secondaryCta: 'Book Now',
        secondaryLink: `/packages/${tours[1].id}/book`,
      };
    } else {
      // Fourth slide - car rental
      return {
        badge: 'Car Rental',
        title: 'Rent a Car in Albania',
        subtitle: 'Explore Albania at your own pace with our premium fleet',
        primaryCta: 'View Cars',
        primaryLink: '/cars',
        secondaryCta: 'View Tours',
        secondaryLink: '/packages',
      };
    }
  };

  const slideContent = getSlideContent();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.6, -0.05, 0.01, 0.99],
        duration: 0.6,
      },
    },
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0 bg-black">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.05
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={getSlideImage(index)}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a generic beach image if URL fails
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80';
              }}
            />
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50" />
          </motion.div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={`badge-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/30">
                <MapPin size={20} className="text-accent" />
                <span className="text-sm font-medium text-accent-blue">{slideContent.badge}</span>
            </div>
          </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
          <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
          >
              {slideContent.title}
          </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
          <motion.p
              key={`subtitle-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md line-clamp-2 max-w-3xl mx-auto"
          >
              {slideContent.subtitle}
          </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
          <motion.div
              key={`cta-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
              {(currentIndex === 1 || currentIndex === 2) && slideContent.price && (
                <div className="text-3xl font-bold text-white drop-shadow-lg mb-2 sm:mb-0">
                  ${slideContent.price}
                </div>
              )}
            <Link
                to={slideContent.primaryLink}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
            >
                <span className="font-medium">{slideContent.primaryCta}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
                to={slideContent.secondaryLink}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm text-accent-blue border-2 border-white/30 rounded-lg hover:bg-white transition-all font-medium"
            >
                <span>{slideContent.secondaryCta}</span>
            </Link>
          </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary dark:from-primary-dark to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      />
    </section>
  );
};

export default Hero;


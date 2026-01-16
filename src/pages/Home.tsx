import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import PackageCard from '../components/PackageCard';
import CarCard from '../components/CarCard';
import { motion } from 'framer-motion';
import { useSearch } from '../contexts/SearchContext';
import { packagesService, carsService } from '../services/database';
import { adaptPackage, adaptCar, Package, Car } from '../utils/adapters';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { searchQuery } = useSearch();
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [packages, cars] = await Promise.all([
          packagesService.getAll({ status: 'published', search: searchQuery || undefined }),
          carsService.getAll({ status: 'published', search: searchQuery || undefined }),
        ]);
        
        setFeaturedPackages(packages.slice(0, 3).map(adaptPackage));
        setFeaturedCars(cars.slice(0, 3).map(adaptCar));
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty arrays if database is not configured
        setFeaturedPackages([]);
        setFeaturedCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  // Client-side filtering for better UX (optional - can also rely on server-side)
  const filteredPackages = featuredPackages.filter((pkg) =>
    !searchQuery ||
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCars = featuredCars.filter((car) =>
    !searchQuery ||
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Hero />

      {/* Featured Packages */}
      <section className="py-16 bg-primary dark:bg-primary-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('packages.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('packages.subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg, index) => (
                <PackageCard key={pkg.id} package={pkg} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No packages available</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-secondary dark:bg-secondary-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('cars.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('cars.subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No cars available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

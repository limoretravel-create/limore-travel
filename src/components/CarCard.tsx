import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Fuel, Users, Settings, ArrowRight } from 'lucide-react';

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  pricePerDay: number;
  image: string;
  fuelType: string;
  seats: number;
  transmission: string;
  features: string[];
}

interface CarCardProps {
  car: Car;
  index: number;
}

const CarCard: React.FC<CarCardProps> = ({ car, index }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        ease: [0.6, -0.05, 0.01, 0.99],
        duration: 0.6,
      }}
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary dark:from-secondary-dark to-accent/20 dark:to-accent-dark/20">
        <motion.img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-contain p-4"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute top-4 right-4 bg-accent dark:bg-accent-dark text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${car.pricePerDay}/{t('cars.pricePerDay')}
        </div>
      </div>
      <div className="p-6">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {car.brand} {car.model}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{car.name}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Fuel size={18} />
            <span className="text-sm">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users size={18} />
            <span className="text-sm">{car.seats}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Settings size={18} />
            <span className="text-sm">{car.transmission}</span>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {t('cars.features')}:
          </p>
          <div className="flex flex-wrap gap-2">
            {car.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-secondary dark:bg-secondary-dark text-gray-700 dark:text-gray-300 rounded text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
        <Link
          to={`/cars/${car.id}/rent`}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent dark:bg-accent-dark text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Car size={18} />
          {t('cars.rentNow')}
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
};

export default CarCard;


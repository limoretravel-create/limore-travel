import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

interface Package {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  description: string;
  maxTravelers: number;
}

interface PackageCardProps {
  package: Package;
  index: number;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, index }) => {
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
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute top-4 right-4 bg-accent text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
          ${pkg.price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-accent-blue mb-2">
          {pkg.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {pkg.description}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} className="text-accent" />
            <span className="text-sm">{pkg.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} className="text-accent-blue" />
            <span className="text-sm">{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} className="text-accent-blue" />
            <span className="text-sm">Max {pkg.maxTravelers} travelers</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/packages/${pkg.id}`}
            className="flex-1 text-center px-4 py-2 bg-accent-blue/10 text-accent-blue rounded-lg hover:bg-accent-blue/20 transition-colors font-medium border border-accent-blue/20"
          >
            {t('packages.viewDetails')}
          </Link>
          <Link
            to={`/packages/${pkg.id}/book`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            {t('packages.bookNow')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;


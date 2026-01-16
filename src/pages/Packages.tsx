import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PackageCard from '../components/PackageCard';
import { motion } from 'framer-motion';
import { useSearch } from '../contexts/SearchContext';
import { Search } from 'lucide-react';
import { packagesService } from '../services/database';
import { adaptPackage, Package } from '../utils/adapters';

const Packages: React.FC = () => {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery } = useSearch();
  const [filter, setFilter] = useState<'all' | 'budget' | 'luxury'>('all');
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await packagesService.getAll({
          status: 'published',
          search: searchQuery || undefined,
        });
        setPackages(data.map(adaptPackage));
      } catch (error) {
        console.error('Error fetching packages:', error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [searchQuery]);

  const filteredPackages = packages.filter((pkg) => {
    if (filter === 'budget') return pkg.price < 1500;
    if (filter === 'luxury') return pkg.price >= 2000;
    return true;
  });

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-accent-blue mb-4">
            {t('packages.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('packages.subtitle')}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'budget', 'luxury'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-accent dark:bg-accent-dark text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-secondary dark:hover:bg-secondary-dark'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => (
              <PackageCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {t('search.noResults')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;

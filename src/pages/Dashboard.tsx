import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Package, Car, Calendar, CreditCard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-primary dark:bg-primary-dark py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Welcome back, {user?.name}!
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <Package className="text-accent dark:text-accent-dark" size={32} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">3</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Booked Packages</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <Car className="text-accent dark:text-accent-dark" size={32} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">2</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Active Rentals</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-accent dark:text-accent-dark" size={32} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">5</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Upcoming Trips</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="text-accent dark:text-accent-dark" size={32} />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$4,599</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Total Spent</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Bookings
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-secondary dark:bg-secondary-dark rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-white">Paris Dream Vacation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Booked on Jan 15, 2024</p>
                </div>
                <div className="p-4 bg-secondary dark:bg-secondary-dark rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-white">Mercedes E-Class</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rental until Jan 25, 2024</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/packages"
                  className="block w-full px-4 py-3 bg-accent dark:bg-accent-dark text-white rounded-lg text-center hover:opacity-90 transition-opacity"
                >
                  Browse Packages
                </Link>
                <Link
                  to="/cars"
                  className="block w-full px-4 py-3 bg-secondary dark:bg-secondary-dark text-gray-900 dark:text-white rounded-lg text-center hover:bg-secondary/80 dark:hover:bg-secondary-dark/80 transition-colors"
                >
                  Rent a Car
                </Link>
                <Link
                  to="/cms"
                  className="block w-full px-4 py-3 bg-secondary dark:bg-secondary-dark text-gray-900 dark:text-white rounded-lg text-center hover:bg-secondary/80 dark:hover:bg-secondary-dark/80 transition-colors"
                >
                  {t('nav.cms')}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


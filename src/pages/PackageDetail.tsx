import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Users, ArrowLeft,
  CheckCircle, Clock, Camera, Star
} from 'lucide-react';
import { packagesService } from '../services/database';
import { adaptPackage, Package } from '../utils/adapters';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) {
        setError('Package ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await packagesService.getById(id);
        setPkg(adaptPackage(data));
        setError(null);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Package not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading package details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Package Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The package you are looking for does not exist.'}</p>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Packages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Image Section */}
      <div className="relative h-[500px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Packages
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span className="text-lg">{pkg.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span className="text-lg">{pkg.duration}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {pkg.description || 'Experience the beauty and charm of this incredible destination with our carefully crafted package.'}
              </p>
            </motion.section>

            {/* Package Highlights */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Package Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Accommodation</h3>
                    <p className="text-gray-600">Comfortable stay in carefully selected hotels</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Guided Tours</h3>
                    <p className="text-gray-600">Expert local guides to show you the best spots</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Transportation</h3>
                    <p className="text-gray-600">Convenient transfers and local transport</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
                    <p className="text-gray-600">Round-the-clock assistance during your trip</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Itinerary */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-accent" size={20} />
                  <span className="text-gray-700">Duration: {pkg.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-accent" size={20} />
                  <span className="text-gray-700">Maximum {pkg.maxTravelers} travelers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Camera className="text-accent" size={20} />
                  <span className="text-gray-700">Photo opportunities at iconic locations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="text-accent" size={20} />
                  <span className="text-gray-700">Best value guaranteed</span>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-accent mb-2">
                  ${pkg.price}
                </div>
                <div className="text-gray-600">per person</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Destination</span>
                  <span className="font-semibold text-gray-900">{pkg.destination}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{pkg.duration}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Max Travelers</span>
                  <span className="font-semibold text-gray-900">{pkg.maxTravelers}</span>
                </div>
              </div>

              <Link
                to={`/packages/${pkg.id}/book`}
                className="w-full block text-center px-6 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold text-lg mb-4"
              >
                Book Now
              </Link>

              <button
                onClick={() => navigate('/contact')}
                className="w-full px-6 py-3 bg-secondary text-gray-900 rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Contact Us
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;



import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X, Package as PackageIcon, Car,
  Image, DollarSign, Users, Clock, MapPin, Fuel, Settings2,
  Check, AlertCircle
} from 'lucide-react';
import { packagesService, carsService } from '../services/database';
import { supabase, Database } from '../lib/supabase';

type PackageRow = Database['public']['Tables']['packages']['Row'];
type PackageInsert = Database['public']['Tables']['packages']['Insert'];
type CarRow = Database['public']['Tables']['cars']['Row'];
type CarInsert = Database['public']['Tables']['cars']['Insert'];

type Tab = 'packages' | 'cars';

const CMS: React.FC = () => {

  const [activeTab, setActiveTab] = useState<Tab>('packages');
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [cars, setCars] = useState<CarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<PackageRow> | null>(null);
  const [editingCar, setEditingCar] = useState<Partial<CarRow> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Package form state
  const [packageForm, setPackageForm] = useState<Partial<PackageInsert>>({
    title: '',
    destination: '',
    duration: '',
    price: 0,
    image_url: '',
    description: '',
    max_travelers: 1,
    status: 'draft',
  });

  // Car form state
  const [carForm, setCarForm] = useState<Partial<CarInsert>>({
    name: '',
    brand: '',
    model: '',
    price_per_day: 0,
    image_url: '',
    fuel_type: 'Petrol',
    seats: 4,
    transmission: 'Automatic',
    features: [],
    status: 'draft',
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [packagesData, carsData] = await Promise.all([
        packagesService.getAll(),
        carsService.getAll(),
      ]);
      setPackages(packagesData);
      setCars(carsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  // Image upload helpers (Supabase Storage)
  const uploadImage = async (file: File, folder: 'packages' | 'cars'): Promise<string | null> => {
    try {
      setUploadingImage(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Make sure you have a bucket named "cms-images" in Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        showNotification('error', 'Failed to upload image');
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('cms-images').getPublicUrl(filePath);

      return publicUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePackageImageFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, 'packages');
    if (url) {
      setPackageForm((prev) => ({ ...prev, image_url: url }));
      showNotification('success', 'Image uploaded for package');
    }
  };

  const handleCarImageFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, 'cars');
    if (url) {
      setCarForm((prev) => ({ ...prev, image_url: url }));
      showNotification('success', 'Image uploaded for car');
    }
  };

  // Package handlers
  const openPackageModal = (pkg?: PackageRow) => {
    if (pkg) {
      setIsEditing(true);
      setEditingPackage(pkg);
      setPackageForm({
        title: pkg.title,
        destination: pkg.destination,
        duration: pkg.duration,
        price: pkg.price,
        image_url: pkg.image_url,
        description: pkg.description,
        max_travelers: pkg.max_travelers,
        status: pkg.status,
      });
    } else {
      setIsEditing(false);
      setEditingPackage(null);
      setPackageForm({
        title: '',
        destination: '',
        duration: '',
        price: 0,
        image_url: '',
        description: '',
        max_travelers: 1,
        status: 'draft',
      });
    }
    setIsModalOpen(true);
  };

  const savePackage = async () => {
    if (!packageForm.title || !packageForm.destination) {
      showNotification('error', 'Please fill in required fields (Title and Destination)');
      return;
    }

    try {
      setSaving(true);
      // Ensure all required fields have valid values
      const packageData: PackageInsert = {
        title: packageForm.title || '',
        destination: packageForm.destination || '',
        duration: packageForm.duration || '',
        price: packageForm.price || 0,
        image_url: packageForm.image_url || '',
        description: packageForm.description || '',
        max_travelers: packageForm.max_travelers || 1,
        status: packageForm.status || 'draft',
      };

      if (isEditing && editingPackage?.id) {
        await packagesService.update(editingPackage.id, packageData);
        showNotification('success', 'Package updated successfully');
      } else {
        await packagesService.create(packageData);
        showNotification('success', 'Package created successfully');
      }
      setIsModalOpen(false);
      await fetchAll();
    } catch (error: any) {
      console.error('Error saving package:', error);
      const errorMessage = error?.message || 'Failed to save package';
      showNotification('error', `Failed to save package: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const deletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      await packagesService.delete(id);
      showNotification('success', 'Package deleted successfully');
      await fetchAll();
    } catch (error) {
      console.error('Error deleting package:', error);
      showNotification('error', 'Failed to delete package');
    }
  };

  // Car handlers
  const openCarModal = (car?: CarRow) => {
    if (car) {
      setIsEditing(true);
      setEditingCar(car);
      setCarForm({
        name: car.name,
        brand: car.brand,
        model: car.model,
        price_per_day: car.price_per_day,
        image_url: car.image_url,
        fuel_type: car.fuel_type,
        seats: car.seats,
        transmission: car.transmission,
        features: car.features || [],
        status: car.status,
      });
    } else {
      setIsEditing(false);
      setEditingCar(null);
      setCarForm({
        name: '',
        brand: '',
        model: '',
        price_per_day: 0,
        image_url: '',
        fuel_type: 'Petrol',
        seats: 4,
        transmission: 'Automatic',
        features: [],
        status: 'draft',
      });
    }
    setIsModalOpen(true);
  };

  const saveCar = async () => {
    if (!carForm.brand || !carForm.model) {
      showNotification('error', 'Please fill in required fields (Brand and Model)');
      return;
    }

    try {
      setSaving(true);
      // Ensure all required fields have valid values
      const carData: CarInsert = {
        name: carForm.name || `${carForm.brand} ${carForm.model}`,
        brand: carForm.brand || '',
        model: carForm.model || '',
        price_per_day: carForm.price_per_day || 0,
        image_url: carForm.image_url || '',
        fuel_type: carForm.fuel_type || 'Petrol',
        seats: carForm.seats || 4,
        transmission: carForm.transmission || 'Automatic',
        features: carForm.features || [],
        status: carForm.status || 'draft',
      };

      if (isEditing && editingCar?.id) {
        await carsService.update(editingCar.id, carData);
        showNotification('success', 'Car updated successfully');
      } else {
        await carsService.create(carData);
        showNotification('success', 'Car created successfully');
      }
      setIsModalOpen(false);
      await fetchAll();
    } catch (error: any) {
      console.error('Error saving car:', error);
      const errorMessage = error?.message || 'Failed to save car';
      showNotification('error', `Failed to save car: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      await carsService.delete(id);
      showNotification('success', 'Car deleted successfully');
      await fetchAll();
    } catch (error) {
      console.error('Error deleting car:', error);
      showNotification('error', 'Failed to delete car');
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !carForm.features?.includes(newFeature.trim())) {
      setCarForm({
        ...carForm,
        features: [...(carForm.features || []), newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setCarForm({
      ...carForm,
      features: carForm.features?.filter((f) => f !== feature) || [],
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
    setEditingCar(null);
  };

  return (
    <div className="min-h-screen bg-primary py-8">
      <div className="container mx-auto px-4">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
                }`}
            >
              {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Content Management
            </h1>
            <button
              onClick={() => activeTab === 'packages' ? openPackageModal() : openCarModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              <Plus size={20} />
              Add {activeTab === 'packages' ? 'Package' : 'Car'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-secondary/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all ${activeTab === 'packages'
                ? 'bg-white text-accent shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <PackageIcon size={18} />
              Packages ({packages.length})
            </button>
            <button
              onClick={() => setActiveTab('cars')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all ${activeTab === 'cars'
                ? 'bg-white text-accent shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Car size={18} />
              Cars ({cars.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeTab === 'packages' && (
                <>
                  {packages.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                      <PackageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-4">No packages yet</p>
                      <button
                        onClick={() => openPackageModal()}
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Add Your First Package
                      </button>
                    </div>
                  ) : (
                    packages.map((pkg) => (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="md:w-48 h-32 md:h-auto bg-gray-100 flex-shrink-0">
                            {pkg.image_url ? (
                              <img
                                src={pkg.image_url}
                                alt={pkg.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image size={32} className="text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-grow p-4 md:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${pkg.status === 'published'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                      }`}
                                  >
                                    {pkg.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {pkg.destination}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {pkg.duration}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users size={14} />
                                    Max {pkg.max_travelers}
                                  </span>
                                  <span className="flex items-center gap-1 font-medium text-accent">
                                    <DollarSign size={14} />
                                    ${pkg.price}
                                  </span>
                                </div>
                                {pkg.description && (
                                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => openPackageModal(pkg)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => deletePackage(pkg.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'cars' && (
                <>
                  {cars.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                      <Car size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-4">No cars yet</p>
                      <button
                        onClick={() => openCarModal()}
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Add Your First Car
                      </button>
                    </div>
                  ) : (
                    cars.map((car) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="md:w-48 h-32 md:h-auto bg-gray-100 flex-shrink-0">
                            {car.image_url ? (
                              <img
                                src={car.image_url}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car size={32} className="text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-grow p-4 md:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {car.brand} {car.model}
                                  </h3>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${car.status === 'published'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                      }`}
                                  >
                                    {car.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Fuel size={14} />
                                    {car.fuel_type}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users size={14} />
                                    {car.seats} seats
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Settings2 size={14} />
                                    {car.transmission}
                                  </span>
                                  <span className="flex items-center gap-1 font-medium text-accent">
                                    <DollarSign size={14} />
                                    ${car.price_per_day}/day
                                  </span>
                                </div>
                                {car.features && car.features.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {car.features.slice(0, 4).map((feature) => (
                                      <span
                                        key={feature}
                                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                    {car.features.length > 4 && (
                                      <span className="px-2 py-0.5 text-gray-500 text-xs">
                                        +{car.features.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => openCarModal(car)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => deleteCar(car.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-black/50 z-40"
              />

              {/* Modal Wrapper for centering */}
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  {/* Modal Content */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit' : 'Add'} {activeTab === 'packages' ? 'Package' : 'Car'}
                      </h2>
                      <button
                        onClick={closeModal}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-grow overflow-y-auto p-6">
                      {activeTab === 'packages' ? (
                        <div className="space-y-5">
                          {/* Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={packageForm.title || ''}
                              onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                              placeholder="e.g., Tropical Paradise Getaway"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                            />
                          </div>

                          {/* Destination & Duration */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Destination <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={packageForm.destination || ''}
                                onChange={(e) => setPackageForm({ ...packageForm, destination: e.target.value })}
                                placeholder="e.g., Maldives"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={packageForm.duration || ''}
                                onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                                placeholder="e.g., 7 Days / 6 Nights"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                            </div>
                          </div>

                          {/* Price & Max Travelers */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($)
                              </label>
                              <input
                                type="number"
                                value={packageForm.price || 0}
                                onChange={(e) => setPackageForm({ ...packageForm, price: Number(e.target.value) })}
                                placeholder="0"
                                min="0"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Travelers
                              </label>
                              <input
                                type="number"
                                value={packageForm.max_travelers || 1}
                                onChange={(e) => setPackageForm({ ...packageForm, max_travelers: Number(e.target.value) })}
                                min="1"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                            </div>
                          </div>

                          {/* Image URL + Upload */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image
                            </label>
                            <div className="flex flex-col md:flex-row gap-3 mb-2">
                              <input
                                type="url"
                                value={packageForm.image_url || ''}
                                onChange={(e) => setPackageForm({ ...packageForm, image_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                              <div className="flex items-center gap-2">
                                <label className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors">
                                  <Image size={18} className="mr-2" />
                                  <span className="text-sm font-medium">
                                    {uploadingImage ? 'Uploading...' : 'Upload'}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePackageImageFile}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                            {packageForm.image_url && (
                              <div className="mt-2 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={packageForm.image_url}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={packageForm.description || ''}
                              onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                              placeholder="Describe the package..."
                              rows={4}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
                            />
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              value={packageForm.status || 'draft'}
                              onChange={(e) => setPackageForm({ ...packageForm, status: e.target.value as 'published' | 'draft' })}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {/* Brand & Model */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={carForm.brand || ''}
                                onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                                placeholder="e.g., Toyota"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Model <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={carForm.model || ''}
                                onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                                placeholder="e.g., Camry"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                            </div>
                          </div>

                          {/* Display Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Display Name (optional)
                            </label>
                            <input
                              type="text"
                              value={carForm.name || ''}
                              onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                              placeholder="Leave empty to use Brand + Model"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                            />
                          </div>

                          {/* Price, Seats, Fuel Type, Transmission */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price/Day ($)
                              </label>
                              <input
                                type="number"
                                value={carForm.price_per_day || 0}
                                onChange={(e) => setCarForm({ ...carForm, price_per_day: Number(e.target.value) })}
                                min="0"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Seats
                              </label>
                              <input
                                type="number"
                                value={carForm.seats || 4}
                                onChange={(e) => setCarForm({ ...carForm, seats: Number(e.target.value) })}
                                min="1"
                                max="12"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fuel Type
                              </label>
                              <select
                                value={carForm.fuel_type || 'Petrol'}
                                onChange={(e) => setCarForm({ ...carForm, fuel_type: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Transmission
                              </label>
                              <select
                                value={carForm.transmission || 'Automatic'}
                                onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              >
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                              </select>
                            </div>
                          </div>

                          {/* Image URL + Upload */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image
                            </label>
                            <div className="flex flex-col md:flex-row gap-3 mb-2">
                              <input
                                type="url"
                                value={carForm.image_url || ''}
                                onChange={(e) => setCarForm({ ...carForm, image_url: e.target.value })}
                                placeholder="https://example.com/car-image.jpg"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                              <div className="flex items-center gap-2">
                                <label className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors">
                                  <Image size={18} className="mr-2" />
                                  <span className="text-sm font-medium">
                                    {uploadingImage ? 'Uploading...' : 'Upload'}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCarImageFile}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                            {carForm.image_url && (
                              <div className="mt-2 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={carForm.image_url}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Features
                            </label>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                placeholder="e.g., GPS Navigation"
                                className="flex-grow px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                              />
                              <button
                                type="button"
                                onClick={addFeature}
                                className="px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                              >
                                <Plus size={20} />
                              </button>
                            </div>
                            {carForm.features && carForm.features.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {carForm.features.map((feature) => (
                                  <span
                                    key={feature}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                  >
                                    {feature}
                                    <button
                                      type="button"
                                      onClick={() => removeFeature(feature)}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <X size={14} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              value={carForm.status || 'draft'}
                              onChange={(e) => setCarForm({ ...carForm, status: e.target.value as 'published' | 'draft' })}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={closeModal}
                        className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={activeTab === 'packages' ? savePackage : saveCar}
                        disabled={saving}
                        className="px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            {isEditing ? 'Update' : 'Create'}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CMS;

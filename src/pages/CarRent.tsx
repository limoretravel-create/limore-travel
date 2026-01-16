import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Fuel, Users, Settings2, CheckCircle,
  MessageCircle, Send
} from 'lucide-react';
import { carsService } from '../services/database';
import { adaptCar, Car } from '../utils/adapters';
import { contactService } from '../services/database';

const CarRent: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    message: '',
  });

  // WhatsApp number (update with your business WhatsApp number)
  const whatsappNumber = '+1234567890'; // Replace with actual number

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) {
        setError('Car ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await carsService.getById(id);
        setCar(adaptCar(data));
        setError(null);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Car not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await contactService.create({
        name: formData.name,
        email: formData.email,
        message: `Car Rental Inquiry for ${car?.brand} ${car?.model}\n\nPhone: ${formData.phone}\nStart Date: ${formData.startDate}\nEnd Date: ${formData.endDate}\n\nMessage: ${formData.message}`,
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        startDate: '',
        endDate: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again or use WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello! I'm interested in renting the ${car?.brand} ${car?.model}.\n\nStart Date: ${formData.startDate || 'To be discussed'}\nEnd Date: ${formData.endDate || 'To be discussed'}\n\n${formData.message ? `Message: ${formData.message}` : ''}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading car details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Car Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The car you are looking for does not exist.'}</p>
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Cars
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Details - Left Side */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Car Image */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96 bg-gray-100">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-contain p-8"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Car+Image';
                    }}
                  />
                </div>
              </div>

              {/* Car Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-accent mb-2">
                      {car.brand} {car.model}
                    </h1>
                    <p className="text-xl text-gray-600">{car.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-accent">${car.pricePerDay}</div>
                    <div className="text-gray-600">per day</div>
                  </div>
                </div>

                {/* Car Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Fuel className="text-accent" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Fuel Type</div>
                      <div className="font-semibold text-gray-900">{car.fuelType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Users className="text-accent" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Seats</div>
                      <div className="font-semibold text-gray-900">{car.seats}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Settings2 className="text-accent" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Transmission</div>
                      <div className="font-semibold text-gray-900">{car.transmission}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <CheckCircle className="text-accent" size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Available</div>
                      <div className="font-semibold text-green-600">Yes</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="text-accent flex-shrink-0" size={18} />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Contact Card - Right Side */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-8"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Request to Rent</h2>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-4">
                      We'll get back to you soon. You can also contact us directly via WhatsApp.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-accent hover:text-blue-700 font-medium"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                        placeholder="Any special requests or questions?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                    >
                      <MessageCircle size={20} />
                      Contact via WhatsApp
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRent;



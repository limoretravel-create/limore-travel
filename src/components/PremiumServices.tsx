import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Car, Crown, PenTool } from 'lucide-react';

const services = [
    {
        icon: MapPin,
        title: 'Tours',
        description: 'Discover the hidden gems of Albania with our expertly guided private and group itineraries.',
    },
    {
        icon: Star,
        title: 'Luxury Stay',
        description: 'Hand-picked penthouses, villas, and city lofts ensuring the utmost comfort and style.',
    },
    {
        icon: Car,
        title: 'Rent a Car',
        description: 'Premium fleet from Mercedes to Range Rovers, giving you the freedom to explore.',
    },
    {
        icon: Crown,
        title: 'VIP Experience',
        description: 'Exclusive concierge services, private transfers, and access to elite venues for a truly seamless journey.',
    },
    {
        icon: PenTool,
        title: 'Design Your Own',
        description: 'Tell us your dream itinerary, and our travel specialists will craft a bespoke experience just for you.',
    },
];

const PremiumServices: React.FC = () => {
    return (
        <section className="py-24 bg-[#0B1120] text-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="block text-[#D4AF37] text-sm font-semibold tracking-[0.2em] mb-4 uppercase">
                        Experience the Extraordinary
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-white">
                        Our Premium Services
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Curating the finest Albanian experiences, tailored to your desires.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.slice(0, 3).map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>

                {/* Bottom Row (Centered 2 items) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
                    {services.slice(3, 5).map((service, index) => (
                        <ServiceCard key={index + 3} service={service} index={index + 3} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ServiceCard: React.FC<{ service: typeof services[0]; index: number }> = ({ service, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-[#111827] p-8 rounded-xl border border-gray-800 hover:border-[#D4AF37]/30 transition-colors group"
        >
            <div className="inline-flex items-center justify-center p-3 rounded-full border border-[#D4AF37] mb-6 mb-6">
                <service.icon size={24} className="text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                {service.title}
            </h3>
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {service.description}
            </p>
        </motion.div>
    );
};

export default PremiumServices;

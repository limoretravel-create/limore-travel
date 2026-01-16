import React from 'react';

import { motion } from 'framer-motion';
import { AnimatedSection, MaskedText } from '../components/AnimatedSection';
import { Globe, Heart, Award, Users } from 'lucide-react';

const About: React.FC = () => {


  const values = [
    {
      icon: Globe,
      title: 'Albanian Expertise',
      description: 'Deep local knowledge of Albania\'s best destinations and hidden gems',
    },
    {
      icon: Heart,
      title: 'Passion for Albania',
      description: 'We love sharing the beauty and culture of our country',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Award-winning service and authentic Albanian experiences',
    },
    {
      icon: Users,
      title: 'Local Community',
      description: 'Supporting local businesses and building lasting relationships',
    },
  ];

  return (
    <div className="min-h-screen bg-primary dark:bg-primary-dark">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-secondary dark:from-secondary-dark to-accent/10 dark:to-accent-dark/10">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <MaskedText className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                About Limore Travel
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Your trusted partner for exploring the beautiful landscapes, rich culture, and hidden gems of Albania.
              </p>
            </MaskedText>
          </AnimatedSection>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.2}>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Founded with a passion for showcasing Albania's incredible beauty, Limore Travel has been serving
                travelers from around the world. We specialize in creating authentic Albanian experiences, from
                exploring the stunning Albanian Riviera to discovering historic cities and breathtaking mountain landscapes.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Our local team of travel experts knows Albania inside and out, ensuring every trip is tailored
                to showcase the best of this beautiful Mediterranean country.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative h-96 rounded-xl overflow-hidden shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"
                  alt="Travel"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary dark:bg-secondary-dark">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              What drives us every day
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
                >
                  <div className="inline-flex p-4 bg-accent dark:bg-accent-dark text-white rounded-full mb-4">
                    <value.icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;


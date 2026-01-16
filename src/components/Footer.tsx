import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Limore Travel
            </h3>
            <p className="text-gray-300">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/packages" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.packages')}
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.cars')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail size={18} />
                <span>info@limoretravel.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin size={18} className="mt-1" />
                <span>123 Travel Street, Tourism City, TC 12345</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {t('footer.followUs')}
            </h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-full text-white hover:bg-accent hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-full text-white hover:bg-accent hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-full text-white hover:bg-accent hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Limore Travel. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


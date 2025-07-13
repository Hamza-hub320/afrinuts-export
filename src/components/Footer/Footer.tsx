import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const Footer: React.FC = () => {
  const { t } = useTranslation('footer');

  return (
    <footer className="bg-primary text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('company.title')}</h3>
            <p className="text-sm mb-4">{t('company.description')}</p>
            <div className="flex space-x-4 text-xl">
              <a href="https://facebook.com" aria-label="Facebook" className="hover:text-accent transition">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="hover:text-accent transition">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-accent transition">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="hover:text-accent transition">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('links.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-accent">{t('links.about')}</Link></li>
              <li><Link to="/products" className="hover:text-accent">{t('links.products')}</Link></li>
              <li><Link to="/farm" className="hover:text-accent">{t('links.farm')}</Link></li>
              <li><Link to="/sustainability" className="hover:text-accent">{t('links.sustainability')}</Link></li>
              <li><Link to="/contact" className="hover:text-accent">{t('links.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('contact.title')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <FaMapMarkerAlt /><span>Odienné, Côte D'Ivoire</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone /><span>+225 XX XX XX XX</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope /><span>info@afrinuts-export.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('newsletter.title')}</h3>
            <p className="text-sm mb-4">{t('newsletter.description')}</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                required
                className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent hover:bg-dark-orange text-white rounded transition"
              >
                {t('newsletter.button')}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} AfriNuts Export. {t('copyright')}</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-accent">{t('legal.privacy')}</Link>
            <Link to="/terms" className="hover:text-accent">{t('legal.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
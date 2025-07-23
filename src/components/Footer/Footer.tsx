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
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation('footer');

  return (
      <footer className="bg-navy text-gray-100 rounded-t-[80px] md:rounded-t-[100px] overflow-hidden pt-24 pb-8 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Mobile layout (hidden on desktop) */}
          <div className="md:hidden space-y-12 mb-12">
            {/* Company Info for mobile */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">{t('company.title')}</h3>
              <p className="text-sm leading-relaxed">
                {t('company.description')}
              </p>
              <div className="flex space-x-5 text-xl">
                {[
                  { icon: <FaFacebook />, url: "https://facebook.com", ariaLabel: "Follow us on Facebook" },
                  { icon: <FaTwitter />, url: "https://twitter.com", ariaLabel: "Follow us on Twitter" },
                  { icon: <FaLinkedin />, url: "https://linkedin.com", ariaLabel: "Follow us on LinkedIn" },
                  { icon: <FaInstagram />, url: "https://instagram.com", ariaLabel: "Follow us on Instagram" }
                ].map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.url}
                        aria-label={social.ariaLabel}
                        className="hover:text-accent transition-colors duration-300"
                        whileHover={{ y: -3 }}
                    >
                      {social.icon}
                    </motion.a>
                ))}
              </div>
            </div>

            {/* Newsletter for mobile */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">{t('newsletter.title')}</h3>
              <p className="text-sm">
                {t('newsletter.description')}
              </p>
              <form className="space-y-4">
                <input
                    type="email"
                    aria-label="Your email address"
                    placeholder={t('newsletter.placeholder')}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 placeholder-white/50 border border-white/20 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
                />
                <motion.button
                    type="submit"
                    className="w-full px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={t('newsletter.submitAriaLabel')}
                >
                  {t('newsletter.button')}
                  <span className="ml-2" aria-hidden="true">→</span>
                </motion.button>
              </form>
            </div>
          </div>

          {/* Desktop layout (hidden on mobile) */}
          <div className="hidden md:grid grid-cols-4 gap-8 mb-12 mt-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('company.title')}</h3>
              <p className="text-sm mb-4">
                {t('company.description')}
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <FaFacebook />, url: "https://facebook.com", ariaLabel: "Facebook" },
                  { icon: <FaTwitter />, url: "https://twitter.com", ariaLabel: "Twitter" },
                  { icon: <FaLinkedin />, url: "https://linkedin.com", ariaLabel: "LinkedIn" },
                  { icon: <FaInstagram />, url: "https://instagram.com", ariaLabel: "Instagram" }
                ].map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.url}
                        aria-label={social.ariaLabel}
                        className="hover:text-accent transition-colors duration-300 text-lg"
                        whileHover={{ y: -3 }}
                    >
                      {social.icon}
                    </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('links.title')}</h3>
              <ul className="space-y-2">
                {[
                  { path: "/about", text: t('links.about') },
                  { path: "/products", text: t('links.products') },
                  { path: "/farm", text: t('links.farm') },
                  { path: "/sustainability", text: t('links.sustainability') },
                  { path: "/contact", text: t('links.contact') }
                ].map((link, index) => (
                    <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                          to={link.path}
                          className="text-sm hover:text-accent transition-colors duration-300"
                      >
                        {link.text}
                      </Link>
                    </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('contact.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-accent mt-0.5"><FaMapMarkerAlt /></span>
                  <span className="text-sm">Odienné, Côte D'Ivoire</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-accent mt-0.5"><FaPhone /></span>
                  <span className="text-sm">+225 01 23 45 67 89</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-accent mt-0.5"><FaEnvelope /></span>
                  <span className="text-sm">info@afrinuts-export.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('newsletter.title')}</h3>
              <p className="text-sm mb-4">
                {t('newsletter.description')}
              </p>
              <form className="space-y-3">
                <input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-accent outline-none"
                />
                <motion.button
                    type="submit"
                    className="w-full px-4 py-2 bg-accent hover:bg-dark-orange text-white rounded font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                  {t('newsletter.button')}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Bottom legal section (shared between mobile and desktop) */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} AfriNuts Export. {t('copyright')}
              </p>
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-sm hover:text-accent transition-colors">
                  {t('legal.privacy')}
                </Link>
                <Link to="/terms" className="text-sm hover:text-accent transition-colors">
                  {t('legal.terms')}
                </Link>
                <Link to="/cookies" className="text-sm hover:text-accent transition-colors">
                  Cookie Preferences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};
export default Footer;
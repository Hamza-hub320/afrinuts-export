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

const Footer: React.FC = () => {
  const { t } = useTranslation('footer');

  return (
      <footer className="bg-primary text-white pt-20 pb-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Desktop and tablet layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-white">{t('company.title')}</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {t('company.description')}
              </p>
              <div className="flex space-x-5 text-xl">
                {[
                  { icon: <FaFacebook />, url: "https://facebook.com" },
                  { icon: <FaTwitter />, url: "https://twitter.com" },
                  { icon: <FaLinkedin />, url: "https://linkedin.com" },
                  { icon: <FaInstagram />, url: "https://instagram.com" }
                ].map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.url}
                        aria-label={`Social media ${index}`}
                        className="hover:text-accent transition-colors duration-300"
                        whileHover={{ y: -3 }}
                    >
                      {social.icon}
                    </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-white">{t('links.title')}</h3>
              <ul className="space-y-3">
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
                          className="text-sm text-white/80 hover:text-accent transition-colors duration-300 flex items-center"
                      >
                        <span className="w-2 h-2 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {link.text}
                      </Link>
                    </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-white">{t('contact.title')}</h3>
              <ul className="space-y-4">
                {[
                  { icon: <FaMapMarkerAlt />, text: "Odienné, Côte D'Ivoire" },
                  { icon: <FaPhone />, text: "+225 XX XX XX XX" },
                  { icon: <FaEnvelope />, text: "info@afrinuts-export.com" }
                ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-accent mt-0.5">{item.icon}</span>
                      <span className="text-sm text-white/80">{item.text}</span>
                    </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-white">{t('newsletter.title')}</h3>
              <p className="text-sm text-white/80">
                {t('newsletter.description')}
              </p>
              <form className="space-y-4">
                <input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
                />
                <motion.button
                    type="submit"
                    className="w-full px-6 py-3 bg-accent hover:bg-dark-orange text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                  {t('newsletter.button')}
                  <span className="ml-2">→</span>
                </motion.button>
              </form>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden space-y-12">
            {/* Company Info for mobile */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-white">{t('company.title')}</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {t('company.description')}
              </p>
              <div className="flex space-x-5 text-xl">
                {[
                  { icon: <FaFacebook />, url: "https://facebook.com" },
                  { icon: <FaTwitter />, url: "https://twitter.com" },
                  { icon: <FaLinkedin />, url: "https://linkedin.com" },
                  { icon: <FaInstagram />, url: "https://instagram.com" }
                ].map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.url}
                        aria-label={`Social media ${index}`}
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
              <h3 className="text-xl font-bold mb-4 text-white">{t('newsletter.title')}</h3>
              <p className="text-sm text-white/80">
                {t('newsletter.description')}
              </p>
              <form className="space-y-4">
                <input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
                />
                <motion.button
                    type="submit"
                    className="w-full px-6 py-3 bg-accent hover:bg-dark-orange text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                  {t('newsletter.button')}
                  <span className="ml-2">→</span>
                </motion.button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-white/60">
              © {new Date().getFullYear()} AfriNuts Export. {t('copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {[
                { path: "/privacy", text: t('legal.privacy') },
                { path: "/terms", text: t('legal.terms') }
              ].map((link, index) => (
                  <Link
                      key={index}
                      to={link.path}
                      className="text-white/60 hover:text-accent transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
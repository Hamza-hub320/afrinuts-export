import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CookiePreferences from '@/components/CookiePreferences/CookiePreferences';
import {
    FaLinkedin,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaArrowRight,
    FaMobile,
    FaLeaf, FaCertificate
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
    const { t } = useTranslation('footer');
    const [showCookiePrefs, setShowCookiePrefs] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subscribeMessage, setSubscribeMessage] = useState('');

    const handleNewsletterSubmit = async (email: string, form: HTMLFormElement) => {
        setSubscribeStatus('loading');
        setSubscribeMessage('');
        try {
            const response = await fetch('/.netlify/functions/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) {
                const errorMap: Record<string, string> = {
                    'INVALID_EMAIL': t('newsletter.invalidEmail'),
                    'ALREADY_SUBSCRIBED': t('newsletter.alreadySubscribed'),
                    'SUBSCRIBE_FAILED': t('newsletter.error'),
                    'SERVER_ERROR': t('newsletter.error'),
                    'INVALID_REQUEST': t('newsletter.error'),
                };
                throw new Error(errorMap[data.error] || t('newsletter.error'));
            }
            setSubscribeStatus('success');
            setSubscribeMessage(t('newsletter.success'));
            form.reset();
            setTimeout(() => { setSubscribeStatus('idle'); setSubscribeMessage(''); }, 5000);
        } catch (error: any) {
            setSubscribeStatus('error');
            setSubscribeMessage(error.message);
        }
    };

    const quickLinks = [
        { path: "/about", text: t('links.about') },
        { path: "/products", text: t('links.products') },
        { path: "/wholesale", text: t('links.wholesale') },
        { path: "/farm", text: t('links.farm') },
        { path: "/sustainability", text: t('links.sustainability') },
        { path: "/invest", text: t('links.invest') },
        { path: "/partners", text: t('links.partners') },
        { path: "/community", text: t('links.community') },
        { path: "/blog", text: t('links.blog') },
        { path: "/faq", text: t('links.faq') },
        { path: "/contact", text: t('links.contact') },
    ];

    const contactItems = [
        { icon: <FaMapMarkerAlt />, text: "Odienné, Côte D'Ivoire" },
        { icon: <FaPhone />, text: "+225 (077) 919 - 1460" },
        { icon: <FaEnvelope />, text: "info@afrinutsexport.com" },
    ];

    return (
        <footer className="relative bg-navy text-gray-100 rounded-t-[80px] md:rounded-t-[100px] overflow-hidden pt-24 pb-8">
            <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-white/[0.02] to-white/[0.04]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Mobile layout */}
                <div className="md:hidden space-y-12 mb-12">
                    {/* Company Info */}
                    <motion.div
                        className="space-y-6 relative overflow-hidden rounded-2xl transition-all duration-500 group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.1)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative z-10 p-6">
                            <h3 className="text-xl font-bold mb-2">{t('company.title')}</h3>
                            <p className="text-sm text-accent/80 mb-3 flex items-center gap-1.5">
                                <FaMobile className="text-[10px]" />{t('company.tagline')}
                            </p>
                            <p className="text-sm leading-relaxed">{t('company.description')}</p>
                            <div className="flex space-x-5 text-xl mt-4">
                                <motion.a
                                    href="https://www.linkedin.com/company/afrinuts-export"
                                    aria-label="Follow us on LinkedIn"
                                    className="hover:text-accent transition-colors duration-300 bg-white/10 p-2 rounded-full backdrop-blur-sm"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaLinkedin />
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div
                        className="space-y-6 relative overflow-hidden rounded-2xl transition-all duration-500 group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.1)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="relative z-10 p-6">
                            <h3 className="text-xl font-bold mb-4">{t('newsletter.title')}</h3>
                            <p className="text-sm">{t('newsletter.description')}</p>
                            <form className="space-y-4 mt-4" onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const emailInput = form.querySelector('#newsletter-email-mobile') as HTMLInputElement;
                                await handleNewsletterSubmit(emailInput.value, form);
                            }}>
                                <label htmlFor="newsletter-email-mobile" className="sr-only">{t('newsletter.label')}</label>
                                <motion.input id="newsletter-email-mobile" type="email" placeholder={t('newsletter.placeholder')} required
                                              className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm placeholder-white/50 border border-white/20 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
                                              whileFocus={{ scale: 1.02 }} />
                                <motion.button type="submit"
                                               className="w-full px-6 py-3 bg-primary hover:bg-dark-orange text-white rounded-full font-medium transition-all duration-300 flex items-center justify-center transform-gpu"
                                               whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                                               aria-label={t('newsletter.submitAriaLabel')}>
                                    {t('newsletter.button')}
                                    <motion.span className="ml-2" whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}>
                                        <FaArrowRight />
                                    </motion.span>
                                </motion.button>
                            </form>
                            {subscribeStatus !== 'idle' && (
                                <p className={`text-sm mt-2 ${subscribeStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>{subscribeMessage}</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-4 gap-8 mb-12 mt-8">
                    {/* Company Info */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl transition-all duration-500 group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.1)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative z-10 p-6">
                            <h3 className="text-xl font-bold mb-2">{t('company.title')}</h3>
                            <p className="text-xs text-accent/80 mb-3 flex items-center gap-1.5">
                                <FaMobile className="text-[10px]" />{t('company.tagline')}
                            </p>
                            <p className="text-sm mb-4">{t('company.description')}</p>
                            <div className="flex space-x-3">
                                <motion.a
                                    href="https://www.linkedin.com/company/afrinuts-export"
                                    aria-label="Follow us on LinkedIn"
                                    className="hover:text-accent transition-colors duration-300 text-lg bg-white/10 p-2 rounded-full backdrop-blur-sm"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaLinkedin />
                                </motion.a>
                            </div>
                            {/* Registration Badge */}
                            <div className="mt-3 flex items-center gap-2">
                                <FaCertificate className="text-accent text-xs" />
                                <span className="text-[10px] text-gray-400">
                                RCCM: CI-ABJ-03-2026-B12-04223
                            </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links - Two Columns */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl transition-all duration-500 group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.1)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="relative z-10 p-6">
                            <h3 className="text-xl font-bold mb-4">{t('links.title')}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {/* Left Column */}
                                <ul className="space-y-2">
                                    {quickLinks.slice(0, 6).map((link, index) => (
                                        <motion.li key={index} whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                                            <Link to={link.path} className="text-xs hover:text-accent transition-colors duration-300 flex items-center group">
                                                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"></span>
                                                {link.text}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                                {/* Right Column */}
                                <ul className="space-y-2">
                                    {quickLinks.slice(6, 11).map((link, index) => (
                                        <motion.li key={index} whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                                            <Link to={link.path} className="text-xs hover:text-accent transition-colors duration-300 flex items-center group">
                                                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"></span>
                                                {link.text}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl transition-all duration-500 group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.1)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative z-10 p-6">
                            <h3 className="text-xl font-bold mb-4">{t('contact.title')}</h3>
                            <ul className="space-y-3">
                                {contactItems.map((item, index) => (
                                    <motion.li key={index}
                                               className="flex items-start space-x-3 p-3 rounded-xl transition-all duration-300"
                                               style={{ background: 'rgba(255,255,255,0.05)' }}
                                               whileHover={{ x: 3 }}>
                                        <span className="text-accent mt-0.5">{item.icon}</span>
                                        <span className="text-sm">{item.text}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl transition-all duration-500 group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.1)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="relative z-10 p-6">
                            <h3 className="text-xl font-bold mb-4">{t('newsletter.title')}</h3>
                            <p className="text-sm mb-4">{t('newsletter.description')}</p>
                            <form className="space-y-3" onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const emailInput = form.querySelector('#newsletter-email-desktop') as HTMLInputElement;
                                await handleNewsletterSubmit(emailInput.value, form);
                            }}>
                                <label htmlFor="newsletter-email-desktop" className="sr-only">{t('newsletter.label')}</label>
                                <motion.input id="newsletter-email-desktop" type="email" placeholder={t('newsletter.placeholder')} required
                                              className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm placeholder-white/50 border border-white/20 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
                                              whileFocus={{ scale: 1.02 }} />
                                <motion.button type="submit"
                                               className="w-full px-4 py-3 bg-primary hover:bg-dark-orange text-white rounded-full font-medium transform-gpu hover:scale-105 transition-all duration-300 flex items-center justify-center"
                                               whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                    {t('newsletter.button')}
                                    <FaArrowRight className="ml-2" />
                                </motion.button>
                            </form>
                            {subscribeStatus !== 'idle' && (
                                <p className={`text-sm mt-2 ${subscribeStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>{subscribeMessage}</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom legal section */}
                <motion.div
                    className="relative overflow-hidden rounded-2xl transition-all duration-500"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="relative z-10 px-5 py-3 flex flex-col md:flex-row justify-between items-center gap-2">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <p className="text-xs text-gray-400">
                                © {new Date().getFullYear()} AfriNuts Export SARL
                            </p>
                            <span className="hidden md:block text-gray-600">·</span>
                            <p className="text-[10px] text-gray-500">
                                RCCM: CI-ABJ-03-2026-B12-04223 · IDU: CI-2026-0066959 J
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {[
                                { path: "/privacy-policy", text: t('legal.privacy') },
                                { path: "/terms", text: t('legal.terms') },
                                { text: t('legal.cookie'), onClick: () => setShowCookiePrefs(true) }
                            ].map((item, index) => (
                                <motion.div key={index} whileHover={{ y: -1 }}>
                                    {item.path ? (
                                        <Link to={item.path} className="text-xs text-gray-400 hover:text-accent transition-colors duration-300">
                                            {item.text}
                                        </Link>
                                    ) : (
                                        <button onClick={item.onClick} className="text-xs text-gray-400 hover:text-accent transition-colors duration-300">
                                            {item.text}
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <CookiePreferences show={showCookiePrefs} onClose={() => setShowCookiePrefs(false)} />
        </footer>
    );
};
export default Footer;
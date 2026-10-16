import {
  FaCheckCircle,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTruck,
  FaGlobeAfrica,
  FaBuilding,
  FaArrowRight,
  FaCalendarAlt,
  FaInfoCircle,
  FaQuestionCircle
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import React, { useState, useRef, FormEvent, ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { trackCtaClick, trackFormSubmission } from '@/utils/analytics';
import Section from '@/components/Section/Section';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Reveal, StaggerList, StaggerItem } from '@/components/Reveal';
import { Typography } from "@/components/Typography/Typography";
import { useNavigate, Link } from 'react-router-dom';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { FormCard } from '@/components/FormCard/FormCard';
import JsonLd from "@/components/Seo/JsonLd";
import { Helmet } from "react-helmet-async";
import WeatherDisplay from "@/components/WeatherDisplay/WeatherDisplay";
import { useCalendly } from '@/hooks/useCalendly';

interface FormData {
  name: string;
  email: string;
  phone?: string;
  requestType: string;
  subject: string;
  message: string;
  productInterest?: string;
  quantity?: string;
  shipping?: string;
  unit?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  requestType?: string;
  subject?: string;
  message?: string;
  submit?: string;
}

const Contact: React.FC = () => {
  const { t } = useTranslation('contact');
  const { openCalendly } = useCalendly();
  const formRef = useRef<HTMLFormElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const requestTypeRef = useRef<HTMLSelectElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', requestType: '', subject: '', message: '',
    productInterest: '', quantity: '', shipping: '', unit: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Auto-scroll to #schedule-call if URL hash is present (e.g., arriving from /invest)
  useEffect(() => {
    if (window.location.hash === '#schedule-call') {
      const el = document.getElementById('schedule-call');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
    }
  }, []);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = t('errors.name');
    if (!formData.email.trim()) newErrors.email = t('errors.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('errors.emailInvalid');
    if (!formData.requestType.trim()) newErrors.requestType = t('errors.requestType');
    if (!formData.subject.trim()) newErrors.subject = t('errors.subject');
    if (!formData.message.trim()) newErrors.message = t('errors.message');
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^\d.]/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      emailjs.init("BuIYx9hnXwuMJjbhE");
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || '',
        request_type: formData.requestType,
        subject: formData.subject,
        message: formData.message,
        product_interest: formData.productInterest || '',
        quantity: formData.quantity || '',
        unit: formData.unit || '',
        shipping: formData.shipping || '',
        date_created: new Date().toLocaleString(),
        email_color: formData.requestType === 'information' ? '#00869D' : formData.requestType === 'quote' ? '#A0C800' : '#E04E00',
        badge_class: formData.requestType === 'information' ? 'request-information' : formData.requestType === 'quote' ? 'request-quote' : 'request-proposal',
      };
      const response = await emailjs.send('service_qftryeh', 'template_fktuno4', templateParams, 'BuIYx9hnXwuMJjbhE');
      if (response.status === 200) {
        trackFormSubmission('contact');
        setShowSuccess(true);
        setFormData({ name: '', email: '', phone: '', requestType: '', subject: '', message: '', productInterest: '', quantity: '', shipping: '', unit: '' });
      }
    } catch (error) {
      setErrors({ submit: t('errors.submit') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="text-text-dark font-sans">
        <Helmet>
          <title>Contact AfriNuts Export | Wholesale Cashew Inquiries & Investment</title>
          <meta name="description" content="Get in touch with AfriNuts Export for wholesale cashew pricing, investment opportunities, partnership inquiries, or farm visits. Based in Odienné, Côte d'Ivoire. Response within 24 hours." />
          <link rel="canonical" href="https://www.afrinutsexport.com/contact" />
        </Helmet>

        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Connect With AfriNuts Export",
          "description": "Reach out for partnership opportunities, product inquiries, or investment information.",
          "mainEntity": {
            "@type": "Organization",
            "name": "AfriNuts Export",
            "address": { "@type": "PostalAddress", "streetAddress": "Odienné", "addressLocality": "Odienné", "addressCountry": "CI" },
            "telephone": "+2250779191460",
            "email": ["contact@afrinutsexport.com", "sales@afrinutsexport.com"],
          }
        }} />

        {/* Success Modal */}
        {showSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, type: 'spring' }}>
                <div className="text-center">
                  <FaCheckCircle className="text-accent text-5xl mx-auto mb-4" />
                  <Typography variant="h3" className="mb-2">{t('success.title')}</Typography>
                  <Typography variant="body" className="mb-6">{t('success.message')}</Typography>
                  <button onClick={() => setShowSuccess(false)} className="bg-primary hover:bg-dark-orange text-white px-6 py-2 rounded-full transition-colors">
                    {t('success.close')}
                  </button>
                </div>
              </motion.div>
            </div>
        )}

        {/* HERO */}
        <Section className="flex items-center justify-center text-center min-h-[65vh]" animate={false}>
          <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

            <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
              <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                <FaEnvelope className="inline mr-2 text-accent" />{t('hero.subtitle', 'Get in Touch')}
              </Typography>
              <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                {t('hero.title', "Let's Talk Cashews")}
              </motion.h1>

              <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                {t('hero.lead', 'Wholesale buyers, investors, partners, or just curious — choose your path and we\'ll get you to the right person.')}
              </Typography>

              <motion.div variants={fadeIn} className="mb-5">
                <InfoCard
                    icon={FaEnvelope}
                    title={t('hero.introTitle', 'We Read Every Message')}
                    variant="secondary"
                    showInfoBadge={false}
                >
                  <Typography variant="small" className="text-gray-600">
                    {t('hero.description', 'Wholesale inquiries, investment discussions, partnership proposals, or just a question about our farm. We respond within 24 hours.')}
                  </Typography>
                </InfoCard>
              </motion.div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    <FaGlobeAfrica className="text-[10px]" /> {t('hero.badgeResponse', '24hr Response')}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                    <FaCheckCircle className="text-[10px]" /> {t('hero.badgeLanguages', 'EN · FR · AR')}
                </span>
              </div>
            </motion.div>

            <motion.div className="flex-shrink-0 lg:ml-auto w-full max-w-sm lg:max-w-md" variants={fadeIn} transition={{ delay: 0.2 }}>
              <WeatherDisplay location="Odienne" />
              <Typography variant="small" className="text-gray-500 text-xs text-center mt-3">
                {t('hero.weatherNote', "We're in the GMT timezone. Business hours: Mon-Fri 8am-5pm, Sat 9am-1pm.")}
              </Typography>
            </motion.div>
          </motion.div>
        </Section>

        {/* QUICK CONTACT */}
        <Section className="py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <StaggerList className="grid md:grid-cols-3 gap-4">
              <StaggerItem>
                <InfoCard icon={FaEnvelope} title={t('info.email')} iconColor="text-accent" variant="secondary" showInfoBadge={false} className="text-center h-full">
                  <div className="space-y-1">
                    <a href="mailto:contact@afrinutsexport.com" className="block text-sm text-gray-600 hover:text-primary transition-colors">
                      {t('info.emailPrimary')}
                    </a>
                    <a href="mailto:sales@afrinutsexport.com" className="block text-sm text-gray-600 hover:text-primary transition-colors">
                      {t('info.emailSecondary')}
                    </a>
                  </div>
                </InfoCard>
              </StaggerItem>
              <StaggerItem>
                <InfoCard icon={FaPhone} title={t('info.phone')} iconColor="text-accent" variant="secondary" showInfoBadge={false} className="text-center h-full">
                  <div className="space-y-1">
                    <a href="tel:+2250779191460" className="block text-sm text-gray-600 hover:text-primary transition-colors">
                      <FaPhone className="inline mr-1 text-[10px]" />
                      +225 07 79 19 14 60
                      <span className="block text-[10px] text-gray-400">Côte d'Ivoire</span>
                    </a>
                    <a href="tel:+16825387277" className="block text-sm text-gray-600 hover:text-primary transition-colors">
                      <FaPhone className="inline mr-1 text-[10px]" />
                      +1 (682) 538-7277
                      <span className="block text-[10px] text-gray-400">United States</span>
                    </a>
                  </div>
                  <Typography variant="small" className="text-gray-500 text-xs mt-2">{t('info.hours')}</Typography>
                </InfoCard>
              </StaggerItem>
              <StaggerItem>
                <InfoCard icon={FaMapMarkerAlt} title={t('info.headquarters')} iconColor="text-accent" variant="secondary" showInfoBadge={false} className="text-center h-full">
                  <Typography variant="small" className="text-gray-600">{t('info.address')}</Typography>
                  <Typography variant="small" className="text-gray-500 text-xs">{t('info.zipCode')}</Typography>
                </InfoCard>
              </StaggerItem>
            </StaggerList>
          </div>
        </Section>

        {/* FORM + SIDEBAR */}
        <Section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-8">

              <Reveal className="lg:col-span-2">
                <FormCard title={t('form.title')} variant="secondary" className="w-full">
                  {errors.submit && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        <Typography variant="body">{errors.submit}</Typography>
                      </div>
                  )}
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-700">{t('form.name')}</label>
                        <input ref={nameRef} type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                               className={`w-full p-2.5 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-accent bg-white/80`} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-700">{t('form.email')}</label>
                        <input ref={emailRef} type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                               className={`w-full p-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-accent bg-white/80`} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="requestType" className="block mb-1.5 text-sm font-medium text-gray-700">{t('form.requestType')}</label>
                      <select ref={requestTypeRef} id="requestType" name="requestType" value={formData.requestType} onChange={handleChange}
                              className={`w-full p-2.5 rounded-lg border ${errors.requestType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-accent bg-white/80`}>
                        <option value="">{t('form.requestTypePlaceholder')}</option>
                        <option value="quote">{t('form.requestTypes.quote')}</option>
                        <option value="partnership">{t('form.requestTypes.partnership')}</option>
                        <option value="investment">{t('form.requestTypes.investment')}</option>
                        <option value="information">{t('form.requestTypes.information')}</option>
                        <option value="other">{t('form.requestTypes.other')}</option>
                      </select>
                    </div>

                    {formData.requestType === 'quote' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                          <div>
                            <label htmlFor="productInterest" className="block mb-1.5 text-sm font-medium text-gray-700">{t('form.productInterest')}</label>
                            <select id="productInterest" name="productInterest" value={formData.productInterest} onChange={handleChange}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-white/80">
                              <option value="">{t('form.productInterestPlaceholder')}</option>
                              <option value="raw-cashew">{t('form.productInterestOptions.rawCashew')}</option>
                              <option value="cashew-kernels">{t('form.productInterestOptions.cashewKernels')}</option>
                              <option value="cnsl">{t('form.productInterestOptions.cnsl')}</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="quantity" className="block mb-1.5 text-sm font-medium text-gray-700">{t('form.quantity')}</label>
                            <input type="number" min="1" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange}
                                   className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-white/80" />
                          </div>
                          <div>
                            <label htmlFor="shipping" className="block mb-1.5 text-sm font-medium text-gray-700">{t('form.shipping')}</label>
                            <select id="shipping" name="shipping" value={formData.shipping} onChange={handleChange}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-white/80">
                              <option value="">{t('form.shippingPlaceholder')}</option>
                              <option value="fob">{t('form.shippingOptions.fob')}</option>
                              <option value="exw">{t('form.shippingOptions.exw')}</option>
                            </select>
                          </div>
                        </div>
                    )}

                    <div>
                      <label htmlFor="subject" className="block mb-1.5 text-sm font-medium text-gray-700">{t('form.subject')}</label>
                      <input ref={subjectRef} type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange}
                             className={`w-full p-2.5 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-accent bg-white/80`} />
                    </div>

                    <div>
                      <label htmlFor="message" className="block mb-1.5 text-sm font-medium text-gray-700">{t('form.message')}</label>
                      <textarea ref={messageRef} id="message" name="message" rows={5} value={formData.message} onChange={handleChange}
                                className={`w-full p-2.5 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-accent bg-white/80`} />
                    </div>

                    <div className="text-center pt-2">
                      <button type="submit" disabled={isSubmitting}
                              className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full font-medium shadow-md inline-flex items-center gap-2 disabled:opacity-50">
                        {isSubmitting ? (
                            <><span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t('form.sending')}</>
                        ) : (
                            <>{t('form.submit')}<FaArrowRight className="text-xs" /></>
                        )}
                      </button>
                    </div>
                  </form>
                  <div className="text-center mt-4 text-xs text-gray-400">
                    <FaShieldAlt className="inline mr-1" />{t('form.privacy', 'Your information is secure and will never be shared.')}
                  </div>
                </FormCard>
              </Reveal>

              <StaggerList className="space-y-5">
                <StaggerItem>
                  <InfoCard icon={FaTruck} title={t('shippingGuidance.title')} variant="secondary" showInfoBadge={false}>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                        <div>
                          <span className="font-medium text-gray-800">{t('shippingGuidance.fob.title')}</span>
                          <p className="text-gray-600 text-xs">{t('shippingGuidance.fob.description')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                        <div>
                          <span className="font-medium text-gray-800">{t('shippingGuidance.exw.title')}</span>
                          <p className="text-gray-600 text-xs">{t('shippingGuidance.exw.description')}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">{t('shippingGuidance.helpText')}</div>
                    </div>
                  </InfoCard>
                </StaggerItem>

                <StaggerItem>
                  <InfoCard icon={FaBuilding} title={t('offlinePayment.title')} variant="secondary" showInfoBadge={false}>
                    <Typography variant="small" className="text-gray-600 mb-3">{t('offlinePayment.description')}</Typography>
                    <div className="flex flex-wrap gap-1.5">
                      {(t('offlinePayment.methods', { returnObjects: true }) as string[]).map((method, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-white/50 rounded-full text-xs text-gray-700 border border-gray-200">{method}</span>
                      ))}
                    </div>
                  </InfoCard>
                </StaggerItem>

                <StaggerItem>
                  <div className="text-center">
                    <Link to="/faq" className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1">
                      {t('form.faqLink', 'View Frequently Asked Questions')} <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </StaggerItem>
              </StaggerList>

            </div>
          </div>
        </Section>

        {/* SCHEDULE A CALL — moved from Invest */}
        <Section className="py-10" id="schedule-call">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-8">
              <Typography variant="h2" className="mb-4">
                {t('schedule.title')}
              </Typography>
              <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                {t('schedule.subtitle')}
              </Typography>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column — What We'll Cover + FAQ */}
              <Reveal className="md:col-span-1">
                <InfoCard
                    icon={FaCalendarAlt}
                    title={t('schedule.whatWeCover')}
                    variant="secondary"
                    showInfoBadge={false}
                    className="h-full text-left"
                >
                  <ul className="space-y-2 text-xs">
                    {[
                      t('schedule.topics.phaseOne'),
                      t('schedule.topics.supplierStrategy'),
                      t('schedule.topics.farmOs'),
                      t('schedule.topics.economics'),
                      t('schedule.topics.structures'),
                      t('schedule.topics.protections'),
                    ].map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-[10px]" />
                          <span className="text-gray-700">{topic}</span>
                        </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <Typography variant="small" className="text-gray-600 text-xs">
                      <strong className="text-primary">{t('schedule.beforeCall')}:</strong>
                    </Typography>
                    <ul className="space-y-1.5 text-xs text-gray-600 mt-2">
                      <li className="flex items-start gap-2">
                        <FaInfoCircle className="text-accent mt-0.5 flex-shrink-0 text-[10px]" />
                        <span>
                                    {t('schedule.reviewPage')}:{' '}
                          <Link to="/invest" className="text-accent hover:text-primary underline">
                                        afrinutsexport.com/invest
                                    </Link>
                                </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaInfoCircle className="text-accent mt-0.5 flex-shrink-0 text-[10px]" />
                        <span>{t('schedule.ndaNote')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <div className="flex items-start gap-2 mb-2">
                      <FaQuestionCircle className="text-accent mt-0.5 flex-shrink-0 text-sm" />
                      <Typography variant="h5" className="text-primary text-xs font-semibold">
                        {t('schedule.faqTitle')}
                      </Typography>
                    </div>
                    <Typography variant="small" className="text-gray-600 text-xs mb-3">
                      {t('schedule.faqText')}
                    </Typography>
                    <Link
                        to="/faq?audience=investors"
                        onClick={() => trackCtaClick('faq_link', 'contact_schedule_card')}
                        className="inline-flex items-center gap-1.5 text-accent hover:text-primary text-xs font-medium underline transition-colors"
                    >
                      {t('schedule.faqButton')}
                      <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </InfoCard>
              </Reveal>

              {/* Right Column — Calendly Popup Trigger */}
              <Reveal className="md:col-span-2" delay={0.1}>
                <InfoCard
                    icon={FaCalendarAlt}
                    title={t('schedule.ctaTitle', 'Pick a Time That Works for You')}
                    variant="secondary"
                    showInfoBadge={false}
                    className="h-full text-center"
                >
                  <div className="py-6">
                    <Typography variant="body" className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                      {t('schedule.ctaBody', 'Opens a 30-minute slot calendar in a secure overlay. No downloads. No account required.')}
                    </Typography>

                    <button
                        onClick={() => {
                          trackCtaClick('open_calendly_popup', 'contact_schedule_section');
                          openCalendly();
                        }}
                        className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.97]"
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover/btn:opacity-70 transition-opacity duration-300" />
                      <FaCalendarAlt className="relative z-10" />
                      <span className="relative z-10">{t('schedule.bookButton', 'Book Your Call')}</span>
                      <FaArrowRight className="relative z-10 text-xs" />
                    </button>

                    <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                                <FaCheckCircle className="text-green-500 text-[10px]" />
                              {t('schedule.badges.duration')}
                            </span>
                      <span className="inline-flex items-center gap-1">
                                <FaCheckCircle className="text-green-500 text-[10px]" />
                        {t('schedule.badges.format')}
                            </span>
                      <span className="inline-flex items-center gap-1">
                                <FaCheckCircle className="text-green-500 text-[10px]" />
                        {t('schedule.badges.timezone')}
                            </span>
                    </div>
                  </div>
                </InfoCard>
              </Reveal>
            </div>

            <Reveal>
              <Typography variant="small" className="text-center text-gray-500 mt-6">
                {t('schedule.note')}
              </Typography>
            </Reveal>
          </div>
        </Section>

        {/* MAP */}
        <Section className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <Typography variant="h2" className="mb-4">{t('map.title')}</Typography>
            <div className="mt-6 rounded-xl overflow-hidden shadow-xl border-2 border-primary/20">
              <iframe title={t('map.iframeTitle')}
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.802935760472!2d-7.56000008436827!3d9.508000090520535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzAnMzAuOCJOIDfCsDMzJzM2LjEiVw!5e0!3m2!1sen!2sus!4v1712345678901"
                      width="100%" height="400" className="border-0" allowFullScreen loading="lazy" />
            </div>
          </div>
        </Section>
      </div>
  );
};

export default Contact;
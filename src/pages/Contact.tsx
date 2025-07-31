import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import WeatherDisplay from '@/components/WeatherDisplay/WeatherDisplay';
import Section from '@/components/Section/Section';
import contactHeroImage from '@/assets/images/contact-hero.webp';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";

interface FormData {
  name: string;
  email: string;
  requestType: string;
  subject: string;
  message: string;
  productInterest?: string;
  quantity?: string;
  shipping?: string;
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
  const formRef = useRef<HTMLFormElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    requestType: 'information',
    subject: '',
    message: '',
    productInterest: '',
    quantity: '',
    shipping: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = t('errors.name');
    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    if (!formData.requestType.trim()) newErrors.requestType = t('errors.requestType');
    if (!formData.subject.trim()) newErrors.subject = t('errors.subject');
    if (!formData.message.trim()) newErrors.message = t('errors.message');
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
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
      const response = await emailjs.sendForm(
          'service_qftryeh',
          'template_fktuno4',
          formRef.current as HTMLFormElement,
          'BuIYx9hnXwuMJjbhE'
      );

      if (response.status === 200) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          requestType: 'information',
          subject: '',
          message: '',
          productInterest: '',
          quantity: '',
          shipping: ''
        });
      } else {
        throw new Error(`Unexpected status ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setErrors({ submit: t('errors.submit') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="contact-page">
        {/* Success Modal */}
        {showSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                  className="bg-white p-8 rounded-xl max-w-md w-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-center">
                  <FaCheckCircle className="text-accent text-5xl mx-auto mb-4" />
                  <Typography variant="h3" className="mb-2">{t('success.title')}</Typography>
                  <Typography variant="body" className="mb-6">{t('success.message')}</Typography>
                  <button
                      onClick={() => setShowSuccess(false)}
                      className="bg-accent hover:bg-dark-orange text-white px-6 py-2 rounded-full transition-colors duration-300"
                  >
                    {t('success.close')}
                  </button>
                </div>
              </motion.div>
            </div>
        )}

        {/* Hero Section */}
        <Section
            fullHeight={false}
            bgImage={contactHeroImage}
            className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[50vh] pb-24 pr-16 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 mt-32 pt-24 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
        >
          <motion.div
              className="max-w-2xl px-8 sm:px-12 py-10 bg-white/75 backdrop-blur-xs rounded-xl border-2 border-primary/20 hover:border-accent/30 transition-all duration-300"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
          >
            <motion.h1
                className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-4 leading-tight"
                variants={fadeIn}
                style={{ letterSpacing: '-0.03em' }}
            >
              {t('hero.title')}
            </motion.h1>
            <motion.div variants={fadeIn}>
              <Typography variant="subtitle" className="text-dark/90">
                {t('hero.subtitle')}
              </Typography>
            </motion.div>
          </motion.div>
        </Section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <section>
            <Typography variant="h2" className="mb-8">
              {t('form.title')}
            </Typography>

            {errors.submit && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                  <Typography variant="body">{errors.submit}</Typography>
                </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block mb-2">
                  <Typography variant="h5">{t('form.name')}</Typography>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    aria-required="true"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent`}
                />
                {errors.name && <Typography variant="small" className="text-red-500 mt-1">{errors.name}</Typography>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block mb-2">
                  <Typography variant="h5">{t('form.email')}</Typography>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    aria-required="true"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent`}
                />
                {errors.email && <Typography variant="small" className="text-red-500 mt-1">{errors.email}</Typography>}
              </div>

              {/* Request Type Field */}
              <div>
                <label htmlFor="requestType" className="block mb-2">
                  <Typography variant="h5">{t('form.requestType')}</Typography>
                </label>
                <select
                    id="requestType"
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${errors.requestType ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent bg-white`}
                >
                  <option value="information">{t('form.requestTypes.information')}</option>
                  <option value="quote">{t('form.requestTypes.quote')}</option>
                  <option value="proposal">{t('form.requestTypes.proposal')}</option>
                </select>
                {errors.requestType && <Typography variant="small" className="text-red-500 mt-1">{errors.requestType}</Typography>}
              </div>

              {/* Product Interest Field */}
              <div>
                <label htmlFor="productInterest" className="block mb-2">
                  <Typography variant="h5">{t('form.productInterest')}</Typography>
                </label>
                <select
                    id="productInterest"
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                >
                  <option value="">{t('form.productInterestPlaceholder')}</option>
                  <option value="raw-cashew">{t('form.productInterestOptions.rawCashew')}</option>
                  <option value="organic-cashew">{t('form.productInterestOptions.organicCashew')}</option>
                  <option value="roasted">{t('form.productInterestOptions.roasted')}</option>
                  <option value="custom-order">{t('form.productInterestOptions.customOrder')}</option>
                </select>
              </div>

              {/* Quantity Field */}
              <div>
                <label htmlFor="quantity" className="block mb-2">
                  <Typography variant="h5">{t('form.quantity')}</Typography>
                </label>
                <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Shipping Preference */}
              <div>
                <label htmlFor="shipping" className="block mb-2">
                  <Typography variant="h5">{t('form.shipping')}</Typography>
                </label>
                <select
                    id="shipping"
                    name="shipping"
                    value={formData.shipping}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                >
                  <option value="">{t('form.shippingPlaceholder')}</option>
                  <option value="cif">{t('form.shippingOptions.cif')}</option>
                  <option value="fob">{t('form.shippingOptions.fob')}</option>
                  <option value="exw">{t('form.shippingOptions.exw')}</option>
                </select>
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block mb-2">
                  <Typography variant="h5">{t('form.subject')}</Typography>
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    aria-required="true"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent`}
                />
                {errors.subject && <Typography variant="small" className="text-red-500 mt-1">{errors.subject}</Typography>}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block mb-2">
                  <Typography variant="h5">{t('form.message')}</Typography>
                </label>
                <textarea
                    id="message"
                    name="message"
                    aria-required="true"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent`}
                ></textarea>
                {errors.message && <Typography variant="small" className="text-red-500 mt-1">{errors.message}</Typography>}
              </div>

              <input type="hidden" name="from_name" value={formData.name} />
              <input type="hidden" name="from_email" value={formData.email} />
              <input type="hidden" name="product_interest" value={formData.productInterest || ''} />
              {/* New hidden input for date_created */}
              <input type="hidden" name="date_created" value={new Date().toLocaleString()} />
              {/* New hidden input for email_color */}
              <input
                type="hidden"
                name="email_color"
                value={
                  formData.requestType === 'information'
                    ? '#00869D'
                    : formData.requestType === 'quote'
                    ? '#A0C800'
                    : '#E04E00'
                }
              />
              {/* New hidden input for badge_class */}
              <input
                type="hidden"
                name="badge_class"
                value={
                  formData.requestType === 'information'
                    ? 'request-information'
                    : formData.requestType === 'quote'
                    ? 'request-quote'
                    : 'request-proposal'
                }
              />

              <button
                  type="submit"
                  className="w-full bg-primary hover:bg-dark-orange text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex justify-center items-center gap-2"
                  disabled={isSubmitting}
              >
                {isSubmitting ? (
                    <>
                      <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {t('form.sending')}
                    </>
                ) : (
                    t('form.submit')
                )}
              </button>
            </form>
          </section>

          {/* Contact Info Section */}
          <section className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 shadow-lg rounded-xl p-8 space-y-8">
            <Typography variant="h2">
              {t('info.title')}
            </Typography>

            {/* Weather Widget */}
            <WeatherDisplay location="Odienne" />

            {/* Contact Info Items */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="bg-accent/10 p-3 rounded-full text-accent flex-shrink-0">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <Typography variant="h4" className="text-primary mb-1">
                    {t('info.headquarters')}
                  </Typography>
                  <Typography variant="body">{t('info.address')}</Typography>
                  <Typography variant="body">{t('info.zipCode')}</Typography>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="bg-accent/10 p-3 rounded-full text-accent flex-shrink-0">
                  <FaPhone className="text-xl" />
                </div>
                <div>
                  <Typography variant="h4" className="text-primary mb-1">
                    {t('info.phone')}
                  </Typography>
                  <Typography variant="body">{t('info.phoneNumber')}</Typography>
                  <Typography variant="body">{t('info.hours')}</Typography>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="bg-accent/10 p-3 rounded-full text-accent flex-shrink-0">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <Typography variant="h4" className="text-primary mb-1">
                    {t('info.email')}
                  </Typography>
                  <Typography variant="body">{t('info.emailPrimary')}</Typography>
                  <Typography variant="body">{t('info.emailSecondary')}</Typography>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex gap-4 items-start">
                <div className="bg-accent/10 p-3 rounded-full text-accent flex-shrink-0">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <Typography variant="h4" className="text-primary mb-1">
                    {t('info.businessHours')}
                  </Typography>
                  <Typography variant="body">{t('info.weekdays')}</Typography>
                  <Typography variant="body">{t('info.saturday')}</Typography>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Map Section */}
        <Section className="py-10">
          <div className="container mx-auto text-center">
            <Typography variant="h2" className="mb-4">
              {t('map.title')}
            </Typography>
            <div className="mt-8 rounded-xl overflow-hidden shadow-xl border-2 border-primary/20 hover:border-accent/30 transition-all duration-300">
              <iframe
                  title={t('map.iframeTitle')}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.802935760472!2d-7.56000008436827!3d9.508000090520535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzAnMzAuOCJOIDfCsDMzJzM2LjEiVw!5e0!3m2!1sen!2sus!4v1712345678901"
                  width="100%"
                  height="450"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
              ></iframe>
            </div>
          </div>
        </Section>
      </div>
  );
};

export default Contact;
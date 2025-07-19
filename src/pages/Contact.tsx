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
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
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
    subject: '',
    message: ''
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
    if (!formData.subject.trim()) newErrors.subject = t('errors.subject');
    if (!formData.message.trim()) newErrors.message = t('errors.message');
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      console.log("Form ref:", formRef.current);
      const response = await emailjs.sendForm(
          'service_qftryeh',
          'template_fktuno4',
          formRef.current as HTMLFormElement,
          'BuIYx9hnXwuMJjbhE'
      );

      console.log("EmailJS response:", response.text);

      if (response.status === 200) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
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
            overlay
            overlayColor="bg-primary/"
            className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[80vh] pb-12 px-6"
        >
          <motion.div
              className="max-w-2xl px-6 py-10 bg-white/75 backdrop-blur-xs rounded-xl"
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
                  <Typography variant="h4">{t('form.name')}</Typography>
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
                  <Typography variant="h4">{t('form.email')}</Typography>
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

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block mb-2">
                  <Typography variant="h4">{t('form.subject')}</Typography>
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
                  <Typography variant="h4">{t('form.message')}</Typography>
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

              <button
                  type="submit"
                  className="w-full bg-accent hover:bg-dark-orange text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex justify-center items-center gap-2"
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
          <section className="bg-white shadow-lg rounded-xl p-8 space-y-8">
            <Typography variant="h2">
              {t('info.title')}
            </Typography>

            {/* Weather Widget */}
            <div className="bg-background rounded-xl p-6 shadow">
              <WeatherDisplay location="Odienne" />
            </div>

            {/* Contact Info Items */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="bg-accent/10 p-3 rounded-full text-accent flex-shrink-0">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <Typography variant="h4" className="text-primary mb-1">
                    AfriNuts Headquarters
                  </Typography>
                  <Typography variant="body">Odienné, Ivory Coast</Typography>
                  <Typography variant="body">Zip Code: 00225</Typography>
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
                  <Typography variant="body">+225 XX XX XX XX</Typography>
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
                  <Typography variant="body">AfriNutsExport2023@outlook.com</Typography>
                  <Typography variant="body">inquiries@afrinutsexport.com</Typography>
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
                  <Typography variant="body">Monday - Friday: 8:00 - 17:00</Typography>
                  <Typography variant="body">Saturday: 9:00 - 13:00</Typography>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Map Section */}
        <Section className="bg-warm-grey/30 py-16">
          <div className="container mx-auto text-center">
            <Typography variant="h2" className="mb-4">
              {t('map.title')}
            </Typography>
            <div className="mt-8 rounded-xl overflow-hidden shadow-xl">
              <iframe
                  title="AfriNuts Export Location"
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
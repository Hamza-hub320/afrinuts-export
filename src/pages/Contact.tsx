import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import WeatherDisplay from '../components/WeatherDisplay/WeatherDisplay';
import Section from '../components/Section/Section';
import contactHeroImage from '../assets/images/contact-hero.jpg';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import {Typography} from "../components/Typography/Typography";

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
      const response = await emailjs.sendForm(
          'service_qftryeh',
          'template_fktuno4',
          formRef.current as HTMLFormElement,
          'BuIYx9hnXwuMJjbhE'
      );

      if (response.status === 200) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
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
        {showSuccess && (
            <div className="success-modal">
              <div className="modal-content">
                <FaCheckCircle className="success-icon" />
                <h3>{t('success.title')}</h3>
                <p>{t('success.message')}</p>
                <button onClick={() => setShowSuccess(false)} className="modal-close-btn">
                  {t('success.close')}
                </button>
              </div>
            </div>
        )}

        <Section
            fullHeight={false}
            bgImage={contactHeroImage}
            overlay
            overlayColor="bg-primary/"
            className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[60vh] pb-12 px-6"
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
              <Typography variant="subtitle" className="text-primary/90">
                {t('hero.subtitle')}
              </Typography>
            </motion.div>
          </motion.div>
        </Section>


        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section>
            <h2>{t('form.title')}</h2>
            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 font-semibold text-text-dark">{t('form.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 rounded border ${errors.name ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 font-semibold text-text-dark">{t('form.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 rounded border ${errors.email ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block mb-2 font-semibold text-text-dark">{t('form.subject')}</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full p-3 rounded border ${errors.subject ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 font-semibold text-text-dark">{t('form.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full p-3 rounded border ${errors.message ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-primary`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <input type="hidden" name="from_name" value={formData.name} />
              <input type="hidden" name="from_email" value={formData.email} />

              <button
                type="submit"
                className="primary-button mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                    <>
                      <span className="spinner"></span> {t('form.sending')}
                    </>
                ) : (
                    t('form.submit')
                )}
              </button>
            </form>
          </section>

          <section className="bg-white shadow rounded-xl p-6 space-y-6">
            <h2>{t('info.title')}</h2>

            <div className="bg-background rounded-xl p-4 shadow">
              <WeatherDisplay location="Odienne" />
            </div>

            <div className="flex gap-4 items-start">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <h3 className="text-primary font-semibold">AfriNuts Headquarters</h3>
                <p>Odienné, Ivory Coast</p>
                <p>Zip Code: 00225</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <FaPhone className="contact-icon" />
              <div>
                <h3>{t('info.phone')}</h3>
                <p>+225 XX XX XX XX</p>
                <p>{t('info.hours')}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <FaEnvelope className="contact-icon" />
              <div>
                <h3>{t('info.email')}</h3>
                <p>AfriNutsExport2023@outlook.com</p>
                <p>inquiries@afrinutsexport.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <FaClock className="contact-icon" />
              <div>
                <h3>{t('info.businessHours')}</h3>
                <p>Monday - Friday: 8:00 - 17:00</p>
                <p>Saturday: 9:00 - 13:00</p>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-warm-grey/30 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">{t('map.title')}</h2>
          <div className="container mx-auto max-w-5xl px-4 mt-4 rounded overflow-hidden shadow">
            <iframe
                title="AfriNuts Export Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.802935760472!2d-7.56000008436827!3d9.508000090520535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzAnMzAuOCJOIDfCsDMzJzM2LjEiVw!5e0!3m2!1sen!2sus!4v1712345678901"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>
  );
};

export default Contact;
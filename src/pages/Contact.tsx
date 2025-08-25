import {FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle, FaArrowDown, FaInfoCircle, FaRegSmile} from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import WeatherDisplay from '@/components/WeatherDisplay/WeatherDisplay';
import Section from '@/components/Section/Section';
import contactHeroImage from '@/assets/images/contact-hero.webp';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { useNavigate } from 'react-router-dom';
import { ShippingInfoCard } from '../components/ShippingInfoCard/ShippingInfoCard';
import { ContactInfoCard } from '../components/ContactInfoCard/ContactInfoCard';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { FormCard } from '@/components/FormCard/FormCard';

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
  const {t} = useTranslation('contact');
  const formRef = useRef<HTMLFormElement | null>(null);
  // Input refs for auto-focus on validation
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const requestTypeRef = useRef<HTMLSelectElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const productInterestRef = useRef<HTMLSelectElement | null>(null);
  const quantityRef = useRef<HTMLInputElement | null>(null);
  const shippingRef = useRef<HTMLSelectElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    requestType: '',
    subject: '',
    message: '',
    productInterest: '',
    quantity: '',
    shipping: '',
    unit: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const navigate = useNavigate();


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
    const {name, value} = e.target;
    if (name === 'quantity') {
      const numericValue = value.replace(/[^\d.]/g, '');
      setFormData(prev => ({...prev, [name]: numericValue}));
    } else if (name === 'unit') {
      setFormData(prev => ({...prev, [name]: value}));
    } else {
      setFormData(prev => ({...prev, [name]: value}));
    }
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus the first field with error
      if (validationErrors.name && nameRef.current) {
        nameRef.current.focus();
      } else if (validationErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (validationErrors.requestType && requestTypeRef.current) {
        requestTypeRef.current.focus();
      } else if (validationErrors.subject && subjectRef.current) {
        subjectRef.current.focus();
      } else if (validationErrors.message && messageRef.current) {
        messageRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      emailjs.init("BuIYx9hnXwuMJjbhE");

      // Compose templateParams manually
      const now = new Date();
      const date_created = now.toLocaleString();
      let email_color = '#E04E00';
      let badge_class = 'request-proposal';
      if (formData.requestType === 'information') {
        email_color = '#00869D';
        badge_class = 'request-information';
      } else if (formData.requestType === 'quote') {
        email_color = '#A0C800';
        badge_class = 'request-quote';
      }
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
        date_created,
        email_color,
        badge_class,
      };

      const response = await emailjs.send(
          'service_qftryeh',
          'template_fktuno4',
          templateParams,
          'BuIYx9hnXwuMJjbhE'
      );

      if (response.status === 200) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          requestType: '',
          subject: '',
          message: '',
          productInterest: '',
          quantity: '',
          shipping: '',
          unit: ''
        });
      } else {
        throw new Error(`Unexpected status ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setErrors({submit: t('errors.submit')});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="contact-page overflow-x-hidden"> {/* Added overflow-x-hidden to prevent horizontal scrolling */}
        {/* Success Modal */}
        {showSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                  className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4 transform-gpu" // Added mx-4 for mobile margins
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                  }}
                  initial={{scale: 0.9, opacity: 0, rotateY: -10}}
                  animate={{scale: 1, opacity: 1, rotateY: 0}}
                  transition={{duration: 0.4, type: 'spring'}}
              >
                {/* 3D effect for modal */}
                <div className="absolute inset-0 rounded-xl border-2 border-white/30 transform-gpu translate-z-[-6px]"/>

                <div className="relative z-10 text-center">
                  <motion.div
                      initial={{scale: 0}}
                      animate={{scale: 1}}
                      transition={{delay: 0.2, type: 'spring'}}
                  >
                    <FaCheckCircle className="text-accent text-5xl mx-auto mb-4"/>
                  </motion.div>
                  <Typography variant="h3" className="mb-2">{t('success.title')}</Typography>
                  <Typography variant="body" className="mb-6">{t('success.message')}</Typography>
                  <motion.button
                      onClick={() => setShowSuccess(false)}
                      className="bg-primary hover:bg-dark-orange text-white px-6 py-2 rounded-full transition-colors transform-gpu hover:scale-105"
                      whileHover={{y: -2}}
                      whileTap={{scale: 0.95}}
                  >
                    {t('success.close')}
                  </motion.button>
                  <Typography variant="body" className="mt-4"><FaRegSmile
                      className="inline mr-2 text-accent"/> {t('success.extraCelebration')}</Typography>
                </div>
              </motion.div>
            </div>
        )}

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
                style={{letterSpacing: '-0.03em'}}
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

        {/* Main Content - FIXED: Added proper container constraints */}
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl"> {/* Added max-w-7xl to constrain width */}
          {/* Information Sections - Now using InfoCard components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16"> {/* Reduced gap on mobile */}
            {/* Shipping Guidance Section */}
            <ShippingInfoCard
                title={t('shippingGuidance.title')}
                intro={t('shippingGuidance.intro')}
                currentlyAvailable={[
                  {
                    title: t('shippingGuidance.fob.title'),
                    description: t('shippingGuidance.fob.description'),
                    available: true
                  },
                  {
                    title: t('shippingGuidance.exw.title'),
                    description: t('shippingGuidance.exw.description'),
                    available: true
                  }
                ]}
                comingSoon={[
                  {
                    title: t('shippingGuidance.cif.title'),
                    description: t('shippingGuidance.cif.description'),
                    available: false
                  },
                  {
                    title: t('shippingGuidance.ddp.title'),
                    description: t('shippingGuidance.ddp.description'),
                    available: false
                  },
                  {
                    title: t('shippingGuidance.other.title'),
                    description: t('shippingGuidance.other.description'),
                    available: false
                  }
                ]}
                helpText={t('shippingGuidance.helpText')}
            />

            {/* Contact Info Section */}
            <ContactInfoCard
                title={t('info.title')}
                weatherLocation="Odienne"
                contactItems={{
                  address: {
                    title: t('info.headquarters'),
                    content: [t('info.address'), t('info.zipCode')]
                  },
                  phone: {
                    title: t('info.phone'),
                    content: [t('info.phoneNumber'), t('info.hours')]
                  },
                  email: {
                    title: t('info.email'),
                    content: [t('info.emailPrimary'), t('info.emailSecondary')]
                  },
                  hours: {
                    title: t('info.businessHours'),
                    content: [t('info.weekdays') + ' (GMT+0)', t('info.saturday') + ' (GMT+0)']
                  }
                }}
            />
          </div>
        </div>


        {/* Offline Payment Instructions Section - FIXED: Added proper width constraints */}
        <div className="container mx-auto px-4 max-w-4xl"> {/* Wrapped in container with max-width */}
          <InfoCard
              title={t('offlinePayment.title')}
              subtitle={t('offlinePayment.description')}
              variant="accent"
              className="w-full mb-8 md:mb-12 text-center mx-auto" // Removed fixed max-w-4xl, let container handle it
              hideIconContainer={true}
          >
            <div className="mt-4">
              <Typography variant="body" className="text-text-dark">
                {t('offlinePayment.additionalInfo')}
              </Typography>
            </div>
            {/* Responsive padding and text */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 md:gap-4">
              {t('offlinePayment.methods', { returnObjects: true }).map((method: string, idx: number) => (
                // Responsive padding and text
                <div key={idx} className="bg-white/30 p-2 md:p-3 rounded-lg text-sm md:text-base">
                  {method}
                </div>
              ))}
            </div>
          </InfoCard>
        </div>


        {/* FAQ Link - FIXED: Added container for proper centering */}
        <div className="container mx-auto px-4 max-w-4xl text-center mb-6">
          <Typography variant="body">
            {t('form.checkFaq')}{' '}
            <span
                className="text-accent underline cursor-pointer transform-gpu hover:scale-105 transition-transform duration-300"
                onClick={() => navigate('/faq')}
            >
            {t('form.faqLink')}
          </span>
          </Typography>
        </div>

        {/* Contact Form Section - FIXED: Added proper container and responsive margins */}
        <div className="container mx-auto px-4 max-w-4xl"> {/* Container with max-width */}
          <FormCard
              title={t('form.title')}
              variant="primary"
              className="my-6 w-full mx-auto" // Removed horizontal margins, let container handle spacing
          >
            {/* Error message */}
            {errors.submit && (
                <div className="bg-background border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded transform-gpu hover:scale-[1.02] transition-transform duration-300">
                  <Typography variant="body">{errors.submit}</Typography>
                </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot anti-spam field */}
              <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off"/>

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    <Typography variant="h5">{t('form.name')}</Typography>
                  </label>
                  <input
                      ref={nameRef}
                      type="text"
                      id="name"
                      name="name"
                      aria-label={t('form.name')}
                      aria-required="true"
                      aria-describedby={errors.name ? "error-name" : undefined}
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80`}
                  />
                  {errors.name && <Typography variant="small" id="error-name"
                                              className="text-red-500 mt-1">{errors.name}</Typography>}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">
                    <Typography variant="h5">{t('form.email')}</Typography>
                  </label>
                  <input
                      ref={emailRef}
                      type="email"
                      id="email"
                      name="email"
                      aria-label={t('form.email')}
                      aria-required="true"
                      aria-describedby={errors.email ? "error-email" : undefined}
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80`}
                  />
                  {errors.email && <Typography variant="small" id="error-email"
                                               className="text-red-500 mt-1">{errors.email}</Typography>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block mb-2">
                  <Typography variant="h5">{t('form.phone')}</Typography>
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    aria-label={t('form.phone')}
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80"
                    placeholder="+000 00 00 00 00 00"
                />
              </div>

              {/* Request Type */}
              <div>
                <label htmlFor="requestType" className="block mb-2">
                  <Typography variant="h5">{t('form.requestType')}</Typography>
                </label>
                <select
                    ref={requestTypeRef}
                    id="requestType"
                    name="requestType"
                    aria-label={t('form.requestType')}
                    aria-required="true"
                    aria-describedby={errors.requestType ? "error-requestType" : undefined}
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80"
                >
                  <option value="">{t('form.requestTypePlaceholder')}</option>
                  <option value="information">{t('form.requestTypes.information')}</option>
                  <option value="quote">{t('form.requestTypes.quote')}</option>
                  <option value="partnership">{t('form.requestTypes.partnership')}</option>
                  <option value="investment">{t('form.requestTypes.investment')}</option>
                  <option value="other">{t('form.requestTypes.other')}</option>
                </select>
                {errors.requestType && <Typography variant="small" id="error-requestType"
                                                   className="text-red-500 mt-1">{errors.requestType}</Typography>}
              </div>

              {/* Conditional Quote Fields */}
              {formData.requestType === 'quote' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Product Interest */}
                    <div>
                      <label htmlFor="productInterest" className="block mb-2">
                        <Typography variant="h5">{t('form.productInterest')}</Typography>
                      </label>
                      <select
                          ref={productInterestRef}
                          id="productInterest"
                          name="productInterest"
                          aria-label={t('form.productInterest')}
                          value={formData.productInterest}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80"
                      >
                        <option value="">{t('form.productInterestPlaceholder')}</option>
                        <option value="raw-cashew">{t('form.productInterestOptions.rawCashew')}</option>
                        <option value="cashew-kernels">{t('form.productInterestOptions.cashewKernels')}</option>
                        <option value="cnsl">{t('form.productInterestOptions.cnsl')}</option>
                        <option value="custom-order">{t('form.productInterestOptions.customOrder')}</option>
                      </select>
                    </div>

                    {/* Quantity & Unit */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block mb-2">
                          <Typography variant="h5">{t('form.quantity')}</Typography>
                        </label>
                        <input
                            ref={quantityRef}
                            type="number"
                            min="1"
                            max="100000"
                            id="quantity"
                            name="quantity"
                            aria-label={t('form.quantity')}
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80"
                        />
                      </div>
                      <div>
                        <label htmlFor="unit" className="block mb-2">
                          <Typography variant="h5">{t('form.unit')}</Typography>
                        </label>
                        <select
                            id="unit"
                            name="unit"
                            aria-label={t('form.unit')}
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80"
                        >
                          <option value="">{t('form.unitPlaceholder')}</option>
                          <option value="kg">Kg</option>
                          <option value="tons">Tons</option>
                        </select>
                      </div>
                    </div>

                    {/* Shipping */}
                    <div className="md:col-span-2">
                      <label htmlFor="shipping" className="block mb-2">
                        <Typography variant="h5">{t('form.shipping')}</Typography>
                      </label>
                      <select
                          ref={shippingRef}
                          id="shipping"
                          name="shipping"
                          aria-label={t('form.shipping')}
                          value={formData.shipping}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg border border-warm-grey focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80"
                      >
                        <option value="">{t('form.shippingPlaceholder')}</option>
                        <option value="fob">{t('form.shippingOptions.fob')}</option>
                        <option value="exw">{t('form.shippingOptions.exw')}</option>
                        <option value="other">{t('form.shippingOptions.other')}</option>
                      </select>
                    </div>
                  </div>
              )}

              {/* Subject & Message */}
              <div>
                <label htmlFor="subject" className="block mb-2">
                  <Typography variant="h5">{t('form.subject')}</Typography>
                </label>
                <input
                    ref={subjectRef}
                    type="text"
                    id="subject"
                    name="subject"
                    aria-label={t('form.subject')}
                    aria-required="true"
                    aria-describedby={errors.subject ? "error-subject" : undefined}
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80`}
                />
                {errors.subject && <Typography variant="small" id="error-subject"
                                               className="text-red-500 mt-1">{errors.subject}</Typography>}
              </div>

              <div>
                <label htmlFor="message" className="block mb-2">
                  <Typography variant="h5">{t('form.message')}</Typography>
                </label>
                <textarea
                    ref={messageRef}
                    id="message"
                    name="message"
                    aria-label={t('form.message')}
                    aria-required="true"
                    aria-describedby={errors.message ? "error-message" : undefined}
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-warm-grey'} focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm bg-white/80`}
                ></textarea>
                {errors.message && <Typography variant="small" id="error-message"
                                               className="text-red-500 mt-1">{errors.message}</Typography>}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <motion.button
                    type="submit"
                    className="bg-primary hover:bg-dark-orange text-white px-6 py-2 rounded-full transition-colors transform-gpu hover:scale-105 inline-flex justify-center items-center gap-2"
                    disabled={isSubmitting}
                    whileHover={{y: -2}}
                    whileTap={{scale: 0.95}}
                >
                  {isSubmitting ? (
                      <>
                        <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {t('form.sending')}
                      </>
                  ) : (
                      t('form.submit')
                  )}
                </motion.button>
              </div>
            </form>
          </FormCard>
        </div>

        {/* Map Section - FIXED: Added container for proper width constraint */}
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
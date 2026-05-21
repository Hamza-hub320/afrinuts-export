import React, {useState, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { trackCtaClick } from '@/utils/analytics';
import {
  FaTree,
  FaSeedling,
  FaHandshake,
  FaLeaf,
  FaIndustry,
  FaGlobe,
  FaUsers,
  FaRocket,
  FaMapMarkerAlt,
  FaChartLine,
  FaHandsHelping,
  FaMosque,
  FaWater,
  FaTimes,
  FaArrowRight, FaBookOpen, FaMobile, FaDatabase, FaCloud
} from "react-icons/fa";
import { Dialog, Transition } from '@headlessui/react';

import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';

import ceoImage from '@/assets/images/ceo.webp';
import cfoImage from '@/assets/images/cfo.webp';
import farmImage from '@/assets/images/cashew-farm.webp';
import aboutUsHeroImage from '@/assets/images/about-us-hero.webp';
import {Typography} from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import {Link, useNavigate} from "react-router-dom";
import {ProfileCard} from "../components/ProfileCard/ProfileCard";
import JsonLd from '@/components/Seo/JsonLd';

interface Executive {
  name: string;
  position: string;
  image: string;
  alt: string;
  message: string[];
  signature: string;
  email: string;
  linkedin: string;
  certifications?: string[];
  experience?: string;
  education?: string | string[];
}

const About: React.FC = () => {
  const { t } = useTranslation('about');
  const navigate = useNavigate();

  // Modal state
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // CEO/CFO data
  const ceoMessage = t('ceo.message', { returnObjects: true }) as string[];
  const cfoMessage = t('cfo.message', { returnObjects: true }) as string[];

  const executives = {
    ceo: {
      name: t('ceo.name', { defaultValue: "Hamza S. Ralsan Sangare" }),
      position: t('ceo.position'),
      image: ceoImage,
      alt: t('ceo.alt'),
      message: ceoMessage,
      signature: t('ceo.signature'),
      certifications: t('ceo.certifications', { returnObjects: true, defaultValue: [] }) as string[],
      experience: t('ceo.experience'),
      education: t('ceo.education', { returnObjects: true, defaultValue: [] }) as string[],
      email: t('ceo.email', { defaultValue: "hamza@afrinutsexport.com" }),
      linkedin: t('ceo.linkedin', { defaultValue: "" })
    },
    cfo: {
      name: t('cfo.name', { defaultValue: "Sekou Hakim Peters" }),
      position: t('cfo.position'),
      image: cfoImage,
      alt: t('cfo.alt'),
      message: cfoMessage,
      signature: t('cfo.signature'),
      certifications: t('cfo.certifications', { returnObjects: true, defaultValue: [] }) as string[],
      experience: t('cfo.experience'),
      education: t('cfo.education', { returnObjects: true, defaultValue: [] }) as string[],
      email: t('cfo.email', { defaultValue: "sekou@afrinutsexport.com" }),
      linkedin: t('cfo.linkedin', { defaultValue: "" })
    }
  };

  const openModal = (executive: Executive) => {
    setSelectedExecutive(executive);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  };

  return (
      <main>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Our Story: Three Generations of Cashew Excellence in Ivory Coast",
          "description": "From family farm to global exporter — AfriNuts Export is redefining Ivory Coast's cashew industry through vertical integration, organic farming, and community investment.",
          "about": {
            "@type": "Organization",
            "name": "AfriNuts Export",
            "foundingDate": "2023",
            "description": "Premium organic cashew exporter from Odienné, Ivory Coast. 35-hectare farm with over 3,500 trees using sustainable farming methods.",
            "founders": [
              {"@type": "Person", "name": "Hamza S. Ralsan Sangare", "jobTitle": "Founder & CEO"},
              {"@type": "Person", "name": "Sekou Hakim Peters", "jobTitle": "Co-Founder & CFO/COO"}
            ],
            "knowsAbout": [
              "Organic Cashew Farming",
              "Islamic Finance",
              "Community Development",
              "Sustainable Agriculture",
              "Vertical Integration"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "hamza@afrinutsexport.com"
            }
          },
          "mainEntity": {
            "@type": "Place",
            "name": "AfriNuts Export Farm",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Odienné",
              "addressCountry": "CI"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 9.51,
              "longitude": -7.5692
            }
          }
        }} />
        {/* Hero Section */}
        <div className=" text-text-dark font-sans leading-relaxed">
          <Section
              fullHeight={false}
              bgImage={aboutUsHeroImage}
              className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[50vh] pb-24 pr-16 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 mt-32 pt-24 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
          >
            <motion.div
                className="max-w-2xl px-8 sm:px-12 py-10 relative overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-500 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.6) 100%)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 8px 32px rgba(165, 105, 66, 0.12), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.05)'
                }}
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
              {/* Subtle animated gradient blob behind the glass */}
              <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl animate-pulse"
                  style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.3) 0%, transparent 70%)' }}
              />
              <div
                  className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full opacity-15 blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(210,125,45,0.3) 0%, transparent 70%)',
                    animation: 'float 6s ease-in-out infinite'
                  }}
              />

              {/* Content wrapper with relative z-index */}
              <div className="relative z-10">
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
              </div>
            </motion.div>
          </Section>

          {/* Leadership Section */}
          <Section className="py-10 md:py-10">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-8 md:mb-16">
                <Typography variant="subhead" className="uppercase tracking-widest mb-2">
                  {t('leadership.subtitle')}
                </Typography>
                <h2 className="font-display text-3xl md:text-display-lg text-text-dark">
                  {t('leadership.title')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CEO Card */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                  <ProfileCard
                      image={executives.ceo.image}
                      name={executives.ceo.name}
                      position={executives.ceo.position}
                      message={executives.ceo.message.slice(0, 1)}
                      signature={executives.ceo.signature}
                      altText={executives.ceo.alt}
                      expandable={false}
                      variant="primary"
                      imageProps={{ loading: "lazy", decoding: "async" }}
                      onClick={() => openModal(executives.ceo)}
                      className="cursor-pointer"
                  />
                </motion.div>

                {/* CFO Card */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "100px" }}
                    variants={fadeIn}
                >
                  <ProfileCard
                      image={executives.cfo.image}
                      name={executives.cfo.name}
                      position={executives.cfo.position}
                      message={executives.cfo.message.slice(0, 1)}
                      signature={executives.cfo.signature}
                      altText={executives.cfo.alt}
                      expandable={false}
                      variant="primary"
                      imageProps={{ loading: "lazy", decoding: "async" }}
                      onClick={() => openModal(executives.cfo)}
                      className="cursor-pointer"
                  />
                </motion.div>
              </div>
            </div>
          </Section>

          {/* Origin Story Link */}
          <div className="text-center mt-6">
            <Link to="/blog/afrinuts-export-origin-story-heritage-sustainability-community" className="text-accent hover:text-primary text-sm font-medium flex items-center justify-center gap-1">
              <FaBookOpen className="text-xs" />
              {t('relatedReading.originStory')}
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {/* Meet the Full Team CTA */}
          <div className="text-center mt-10">
            <motion.button
                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                onClick={() => {
                  trackCtaClick('executive_team', 'about_page');
                  navigate('/executive-team');
                }}
                whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)' }}
                whileTap={{ scale: 0.95 }}
            >
        <span className="relative z-10 font-medium flex items-center gap-2">
            {t('leadership.ctaText', 'Meet Our Full Executive Team')}
          <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
        </span>
            </motion.button>
          </div>

          {/* Bio Modal */}
          <Transition.Root show={isModalOpen && !!selectedExecutive} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal} role="dialog" aria-modal="true">
              <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                      as={React.Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden bg-white/80 backdrop-blur-lg rounded-3xl border-2 border-white/40 shadow-xl text-left modal-content transition-all duration-300 hover:shadow-2xl">
                      <div className="p-6">
                        {selectedExecutive && (
                            <>
                              <div className="flex justify-between items-start">
                                <div>
                                  <Dialog.Title as="h3" className="text-lg font-semibold text-primary">
                                    {selectedExecutive.name}
                                  </Dialog.Title>
                                  <Typography variant="small" className="text-primary">
                                    {selectedExecutive.position}
                                  </Typography>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                  <FaTimes className="h-6 w-6" />
                                </button>
                              </div>
                              <div className="mt-4">
                                <img
                                  src={selectedExecutive.image}
                                  alt={selectedExecutive.alt}
                                  className="float-left h-32 w-32 rounded-full object-cover border-2 border-primary/20 mr-4 mb-2"
                                />
                                <Typography variant="body" className="text-gray-700">
                                  {selectedExecutive.message.map((paragraph: string, index: number) => (
                                    <p key={index} className="mb-4">{paragraph}</p>
                                  ))}
                                </Typography>
                              </div>

                              {selectedExecutive.experience && selectedExecutive.education && (
                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Typography variant="small" className="font-medium text-gray-900">

                                        {t('labels.experience')}:

                                      </Typography>
                                      <Typography variant="body-sm" className="text-gray-700">
                                        {selectedExecutive.experience}
                                      </Typography>
                                    </div>
                                    <div>
                                      <Typography variant="small" className="font-medium text-gray-900">
                                        {t('labels.education')}:
                                      </Typography>
                                      {Array.isArray(selectedExecutive.education) ? (
                                        <ul className="list-disc list-inside text-gray-700">
                                          {selectedExecutive.education.map((edu, idx) => (
                                            <li key={idx}>{edu}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <Typography variant="body-sm" className="text-gray-700">
                                          {selectedExecutive.education}
                                        </Typography>
                                      )}
                                    </div>
                                  </div>
                              )}

                              {selectedExecutive.certifications && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <Typography variant="small" className="font-medium text-gray-900">
                                      {t('labels.certifications')}:
                                    </Typography>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {selectedExecutive.certifications.map((cert: string, index: number) => (
                                          <span
                                              key={index}
                                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                          >
                                          {cert}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                              )}

                              <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="bg-primary hover:bg-dark-orange text-white px-4 py-2 rounded-md text-sm"
                                >
                                  {t('labels.close')}
                                </button>
                              </div>
                            </>
                        )}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Farm OS Section */}
          <Section className="py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <motion.div
                  className="text-center mb-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
              >
                <Typography variant="h2" className="mb-4">
                  {t('farmOs.title', 'Built Different: Farm OS')}
                </Typography>
                <Typography variant="lead" className="max-w-3xl mx-auto text-gray-600">
                  {t('farmOs.subtitle', 'Most West African farms run on paper. Ours runs on a custom-built operating system — engineered by our founder to bring institutional-grade transparency to cashew production.')}
                </Typography>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    icon: FaMobile,
                    title: t('farmOs.offline.title', 'Offline-First Android App'),
                    desc: t('farmOs.offline.desc', 'Our field teams use a custom Android application that works without internet. Data syncs automatically when connectivity returns — no paper logs, no lost records.'),
                  },
                  {
                    icon: FaDatabase,
                    title: t('farmOs.tracking.title', 'Block-Level Tracking'),
                    desc: t('farmOs.tracking.desc', 'Every cashew tree is mapped to a specific block. Planting dates, survival rates, expenses, and harvest volumes are recorded per block — giving buyers full traceability.'),
                  },
                  {
                    icon: FaCloud,
                    title: t('farmOs.dashboard.title', 'Real-Time Dashboard'),
                    desc: t('farmOs.dashboard.desc', 'Investors and managers access a live dashboard showing farm performance, financials, task management, and photo documentation — updated from the field in real time.'),
                  },
                ].map((item, idx) => (
                    <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                      <InfoCard icon={item.icon} title={item.title} iconColor="text-accent" showInfoBadge={false} className="h-full">
                        <Typography variant="small" className="text-gray-600">{item.desc}</Typography>
                      </InfoCard>
                    </motion.div>
                ))}
              </div>

              {/* Tech stack mention */}
              <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="bg-primary/5 rounded-xl p-5 text-center max-w-3xl mx-auto"
              >
                <Typography variant="small" className="text-gray-600">
                  {t('farmOs.techStack', 'Built with React, TypeScript, Firebase, and Android. Offline-first architecture with cloud synchronization. No internet? No problem.')}
                </Typography>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {['React', 'TypeScript', 'Firebase', 'Android', 'Offline-First', 'Cloud Sync'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-primary border border-primary/10">
                        {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </Section>

        {/* Brand Statement */}
          <Section className="py-10 md:py-10 text-center text-text-dark">
            <motion.div
                className="w-full max-w-7xl mx-auto px-4 sm:px-6"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                variants={fadeIn}
            >
              <Typography variant="h2" className="mb-6 md:mb-8">
                {t('brand.title')}
              </Typography>
              <Typography variant="body" className="max-w-3xl mx-auto">
                {t('brand.text')}
              </Typography>

              {/* CTA Button */}
              <motion.button
                  className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden mt-8"
                  variants={fadeIn}
                  onClick={() => {
                    trackCtaClick('visit_farm', 'about_page');
                    navigate(t('ctaButton', '/farm'));
                  }}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
              >
            <span className="relative z-10 font-medium flex items-center gap-2">
                {t('ctaText', 'Explore Our Farm')}
              <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
            </span>
              </motion.button>
            </motion.div>
          </Section>

        {/* Vision, Mission, Values */}
        <Section className="py-10 md:py-10 bg-gradient-to-r from-primary/30 via-white/30
  bg-[length:400%_400%] animate-gradient-x-slow rounded-t-[80px] md:rounded-t-[100px] overflow-hidden pt-24 pb-8 relative">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{once: true}}
              variants={staggerContainer}
            >
              <div className="text-center mb-8 md:mb-16">
                <Typography variant="subhead" className="uppercase tracking-widest mb-2">
                  {t('vmv.vmvHeader.subtitle', {defaultValue: "Our Foundation"})}
                </Typography>
                <Typography variant="h2">
                  {t('vmv.vmvHeader.title', {defaultValue: "Vision, Mission & Values"})}
                </Typography>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-24">
                <InfoCard
                  icon={FaGlobe}
                  title={t('vmv.vision.title')}
                  iconColor="text-accent"
                >
                  {t('vmv.vision.text')}
                </InfoCard>
                <InfoCard
                  icon={FaRocket}
                  title={t('vmv.mission.title')}
                  iconColor="text-accent"
                >
                  {t('vmv.mission.text')}
                </InfoCard>
                <InfoCard
                  icon={FaHandshake}
                  title={t('vmv.values.title')}
                  iconColor="text-accent"
                >
                  {t('vmv.values.text')}
                </InfoCard>
              </div>
            </motion.div>
          </div>

          {/* Community Impact */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{once: true}}
            variants={staggerContainer}
          >
            <div className="text-center mb-8 md:mb-16">
              <Typography variant="h2">
                {t('community.title')}
              </Typography>
            </div>

            <div
              className="
                flex flex-col sm:flex-row
                gap-6 sm:gap-6 md:gap-8
                justify-center items-stretch
                [&>*]:flex-1
              "
            >
              <InfoCard
                icon={FaHandsHelping}
                title={t('community.cards.pledge.title')}
                iconColor="text-accent"
                cardClassName="min-h-[220px] transition-transform duration-200 hover:-translate-y-2"
              >
                {t('community.cards.pledge.text')}
              </InfoCard>
              <InfoCard
                icon={FaWater}
                title={t('community.cards.water.title')}
                iconColor="text-accent"
                cardClassName="min-h-[220px] transition-transform duration-200 hover:-translate-y-2"
              >
                {t('community.cards.water.text')}
              </InfoCard>
              <InfoCard
                icon={FaMosque}
                title={t('community.cards.religion.title')}
                iconColor="text-accent"
                cardClassName="min-h-[220px] transition-transform duration-200 hover:-translate-y-2"
              >
                {t('community.cards.religion.text')}
              </InfoCard>
            </div>
            {/* CTA Button */}
            <motion.div
                variants={fadeIn}
                className="text-center mt-8"
            >
              <motion.button
                  className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden"
                  onClick={() => {
                    trackCtaClick('contact', 'about_page');
                    navigate('/contact');
                  }}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
              >
            <span className="relative z-10 font-medium flex items-center gap-2">
                {t('ctaText', 'Partner With Us')}
              <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
            </span>
              </motion.button>
          </motion.div>
          </motion.div>
        </Section>

        {/* Farm Section */}
        <Section className="py-10 md:py-10 bg-gradient-to-r from-primary/30 via-white/30
  bg-[length:400%_400%] animate-gradient-x-slow rounded-b-[80px] md:rounded-b-[100px] overflow-hidden pt-24 pb-8 relative">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center">
              <motion.div className="flex-1">
                <div className="mb-6 md:mb-8">
                  <Typography variant="subhead" className="uppercase tracking-widest mb-2">
                    {t('farm.subtitle', {defaultValue: "Our Operations"})}
                  </Typography>
                  <Typography variant="h2">
                    {t('farm.title')}
                  </Typography>
                </div>
                <p className="text-lg mb-8 leading-relaxed">
                  {t('farm.text')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-backgroundpx-4 py-3 rounded-lg shadow">
                    <FaMapMarkerAlt className="text-primary text-xl"/>
                    <span>{t('farm.location')}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-backgroundpx-4 py-3 rounded-lg shadow">
                    <FaChartLine className="text-primary text-xl"/>
                    <span>{t('farm.size')}</span>
                  </div>
                </div>
                {/* CTA Button */}
                <motion.button
                    className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden mt-6"
                    whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      trackCtaClick('explore_farm', 'about_page');
                      navigate('/farm');
                    }}
                >
    <span className="relative z-10 font-medium flex items-center gap-2">
        {t('farm.ctaText', 'Visit Our Farm Page')}
      <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
    </span>
                </motion.button>
              </motion.div>
              <motion.div
                  className="flex-1"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  variants={fadeIn}
                  transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={farmImage}
                    alt={t('farm.alt')}
                    width={1024}
                    height={683}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover aspect-video"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

          {/* Legacy Timeline with staggered animation, ARIA, icon scale */}
          <Section className="py-10 md:py-10 text-text-dark">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                  className="text-center mb-16"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  variants={fadeIn}
              >
                <Typography variant="subhead" className="uppercase tracking-widest mb-2">
                  {t('legacy.subtitle', {defaultValue: "Our Journey Through Time"})}
                </Typography>
                <Typography variant="h2" className="mb-4">
                  {t('legacy.title')}
                </Typography>
              </motion.div>

              <div className="max-w-4xl mx-auto space-y-8">
                {/* Family Era */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                    variants={fadeIn}
                    transition={{delay: 0}}
                    className="group relative transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                    }}
                    aria-label={t('legacy.family.aria', {defaultValue: "Family Era"})}
                >
                  <div className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                  <motion.div
                      className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl shadow-xl overflow-hidden border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 transform-gpu"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        rotateY: 2,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        transition: { duration: 0.3 }
                      }}
                  >
                    {/* 3D edge effect */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                    {/* Glassy overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Inner shadow effect */}
                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                    <div className="relative z-10">
                      <div className="bg-gradient-to-r from-primary to-primary/90 p-6 flex items-center gap-4">
                        <motion.div
                            className="bg-white/20 p-3 rounded-full backdrop-blur-sm transform-gpu group-hover:scale-110 transition-transform duration-500"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <FaTree className="text-2xl md:text-2xl sm:text-xl text-white" />
                        </motion.div>
                        <h3 className="font-display text-2xl text-white">
                          {t('legacy.family.title')}
                        </h3>
                      </div>
                      <div className="p-8">
                        <p className="mb-6 text-gray-700 relative z-10">{t('legacy.family.text')}</p>
                        <ul className="space-y-4 relative z-10">
                          {(t('legacy.family.feats', {returnObjects: true}) as string[]).map((feat: string, index: number) => (
                              <motion.li
                                  key={index}
                                  className="flex items-start gap-4 p-3 rounded-lg transition-colors bg-white/30 backdrop-blur-sm"
                                  whileHover={{x: 5, scale: 1.02}}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  aria-label={t(`legacy.family.featsAria.${index}`, {defaultValue: feat})}
                              >
                                <motion.div
                                    className="bg-accent/10 p-2 rounded-full transform-gpu group-hover:scale-110 transition-transform duration-300"
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                >
                                  {index === 0 && <FaSeedling className="text-accent text-lg md:text-lg sm:text-base" />}
                                  {index === 1 && <FaHandshake className="text-accent text-lg md:text-lg sm:text-base" />}
                                  {index === 2 && <FaLeaf className="text-accent text-lg md:text-lg sm:text-base" />}
                                </motion.div>
                                <span className="flex-1">{feat}</span>
                              </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* AfriNuts Era */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                    variants={fadeIn}
                    transition={{delay: 0.15}}
                    className="group relative transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                    }}
                    aria-label={t('legacy.afrinuts.aria', {defaultValue: "AfriNuts Era"})}
                >
                  <div className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                  <motion.div
                      className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-3xl shadow-xl overflow-hidden transform-gpu"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        rotateY: 2,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        transition: { duration: 0.3 }
                      }}
                  >
                    {/* 3D edge effect */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                    {/* Glassy overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Inner shadow effect */}
                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                    <div className="relative z-10">
                      <div className="bg-gradient-to-r from-accent to-accent/90 p-6 flex items-center gap-4">
                        <motion.div
                            className="bg-white/20 p-3 rounded-full backdrop-blur-sm transform-gpu group-hover:scale-110 transition-transform duration-500"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <FaChartLine className="text-2xl md:text-2xl sm:text-xl text-white" />
                        </motion.div>
                        <h3 className="font-display text-2xl text-white">
                          {t('legacy.afrinuts.title')}
                        </h3>
                      </div>
                      <div className="p-8">
                        <p className="mb-6 text-gray-700 relative z-10">{t('legacy.afrinuts.text')}</p>
                        <ul className="space-y-4 relative z-10">
                          {(t('legacy.afrinuts.feats', {returnObjects: true}) as string[]).map((feat: string, index: number) => (
                              <motion.li
                                  key={index}
                                  className="flex items-start gap-4 p-3 rounded-lg transition-colors bg-white/30 backdrop-blur-sm"
                                  whileHover={{x: 5, scale: 1.02}}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  aria-label={t(`legacy.afrinuts.featsAria.${index}`, {defaultValue: feat})}
                              >
                                <motion.div
                                    className="bg-accent/10 p-2 rounded-full transform-gpu group-hover:scale-110 transition-transform duration-300"
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                >
                                  {index === 0 && <FaIndustry className="text-accent text-lg md:text-lg sm:text-base" />}
                                  {index === 1 && <FaGlobe className="text-accent text-lg md:text-lg sm:text-base" />}
                                  {index === 2 && <FaUsers className="text-accent text-lg md:text-lg sm:text-base" />}
                                  {index === 3 && <FaSeedling className="text-accent text-lg md:text-lg sm:text-base" />}
                                </motion.div>
                                <span className="flex-1">{feat}</span>
                              </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Vision 2031 */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                    variants={fadeIn}
                    transition={{delay: 0.3}}
                    className="group relative transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                    }}
                    aria-label={t('legacy.future.aria', {defaultValue: "Future Vision 2031"})}
                >
                  <motion.div
                      className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 text-center border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 transform-gpu relative overflow-hidden"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        rotateY: 2,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        transition: { duration: 0.3 }
                      }}
                  >
                    {/* 3D edge effect */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                    {/* Glassy overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Inner shadow effect */}
                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                    <div className="relative z-10">
                      <div className="flex justify-center items-center gap-4 mb-6">
                        <motion.div
                            className="bg-accent p-3 rounded-full transform-gpu group-hover:scale-110 transition-transform duration-500"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <FaRocket className="text-2xl md:text-2xl sm:text-xl text-white" />
                        </motion.div>
                        <h3 className="font-display text-2xl text-primary">
                          {t('legacy.future.title')}
                        </h3>
                      </div>
                      <p className="text-gray-700 max-w-2xl mx-auto relative z-10">
                        {t('legacy.future.text')}
                      </p>
                      <motion.button
                          className="group bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center mx-auto transform-gpu relative overflow-hidden"
                          variants={fadeIn}
                          onClick={() => {
                            trackCtaClick('vision', 'about_page');
                            navigate('/vision');
                          }}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={t('legacy.learnMoreAria', {defaultValue: "Learn more about Vision 2031"})}
                      >
                        {t('legacy.learnMore')}
                        <motion.span
                            className="ml-3"
                            whileHover={{ rotate: 45 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <FaGlobe aria-hidden="true" />
                        </motion.span>
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </Section>
        </div>
      </main>
  );
};

export default About;
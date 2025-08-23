import React, {useState, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaTree,
  FaSeedling,
  FaArrowRight,
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
  FaWater
} from "react-icons/fa";

import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';

import ceoImage from '@/assets/images/ceo.webp';
import cfoImage from '@/assets/images/cfo.webp';
import farmImage from '@/assets/images/cashew-farm.webp';
import aboutUsHeroImage from '@/assets/images/about-us-hero.webp';
import {Typography} from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import {useNavigate} from "react-router-dom";
import {ProfileCard} from "../components/ProfileCard/ProfileCard";

const About: React.FC = () => {
  const { t } = useTranslation('about');
  const navigate = useNavigate();

  // CEO/CFO expanded state for accessibility
  const [expandedCeo, setExpandedCeo] = useState(false);
  const [expandedCfo, setExpandedCfo] = useState(false);
  const ceoCardRef = useRef<HTMLDivElement>(null);
  const cfoCardRef = useRef<HTMLDivElement>(null);

  // Calculate if message is long enough to need truncation
  const ceoMessage = t('ceo.message', { returnObjects: true }) as string[];
  const cfoMessage = t('cfo.message', { returnObjects: true }) as string[];
  const shouldTruncateCeo = ceoMessage.join(' ').length > 300;
  const shouldTruncateCfo = cfoMessage.join(' ').length > 300;

  const HeroSection = () => {
    // Animation variants
    const staggerContainer = {
      hidden: {opacity: 0},
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        }
      }
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
      <main>
        {/* Hero Section */}
        <div className=" text-text-dark font-sans leading-relaxed">
          <Section
              fullHeight={false}
              bgImage={aboutUsHeroImage}
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
                <Typography variant="subtitle" className="text-primary/90">
                  {t('hero.subtitle')}
                </Typography>
              </motion.div>
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

              <div className="space-y-10">

                {/* CEO Message */}
                {/* CEO Card with expandable section and a11y */}
                <motion.div
                  className="w-full"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  ref={ceoCardRef}
                >
                  <div
                    tabIndex={0}
                    aria-expanded={expandedCeo}
                    aria-controls="ceo-message"
                    className="focus:outline-accent"
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        setExpandedCeo(v => !v);
                        e.preventDefault();
                      }
                    }}
                  >
                    <ProfileCard
                      image={ceoImage}
                      name="Hamza S. Ralsan Sangare"
                      position={t('ceo.position')}
                      message={ceoMessage}
                      signature={t('ceo.signature')}
                      altText={t('ceo.alt')}
                      expandable={shouldTruncateCeo}
                      expanded={expandedCeo}
                      onExpand={() => setExpandedCeo(v => !v)}
                      variant="primary"
                      imageProps={{
                        loading: "lazy",
                        decoding: "async"
                      }}
                      messageId="ceo-message"
                    />
                  </div>
                </motion.div>

                {/* CFO Card with expandable section and a11y */}
                <motion.div
                  className="w-full"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "100px" }}
                  variants={fadeIn}
                  ref={cfoCardRef}
                >
                  <div
                    tabIndex={0}
                    aria-expanded={expandedCfo}
                    aria-controls="cfo-message"
                    className="focus:outline-accent"
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        setExpandedCfo(v => !v);
                        e.preventDefault();
                      }
                    }}
                  >
                    <ProfileCard
                      image={cfoImage}
                      name="Sekou Hakim Peters"
                      position={t('cfo.position', { defaultValue: "Co-founder & CFO" })}
                      message={cfoMessage}
                      signature={t('cfo.signature')}
                      altText={t('cfo.alt')}
                      expandable={shouldTruncateCfo}
                      expanded={expandedCfo}
                      onExpand={() => setExpandedCfo(v => !v)}
                      variant="primary"
                      imageProps={{
                        loading: "lazy",
                        decoding: "async"
                      }}
                      messageId="cfo-message"
                    />
                  </div>
                </motion.div>
              </div>
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
                className="group relative"
                aria-label={t('legacy.family.aria', {defaultValue: "Family Era"})}
              >
                <div className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl shadow-xl overflow-hidden border-2 border-primary/20 hover:border-accent/30 transition-all duration-300">
                  <div className="bg-gradient-to-r from-primary to-primary/90 p-6 flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <FaTree className="text-2xl md:text-2xl sm:text-xl text-white transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="font-display text-2xl text-white">
                      {t('legacy.family.title')}
                    </h3>
                  </div>
                  <div className="p-8">
                    <p className="mb-6 text-gray-700">{t('legacy.family.text')}</p>
                    <ul className="space-y-4">
                      {(t('legacy.family.feats', {returnObjects: true}) as string[]).map((feat: string, index: number) => (
                        <motion.li
                          key={index}
                          className="flex items-start gap-4 p-3 rounded-lg transition-colors"
                          whileHover={{x: 5}}
                          aria-label={t(`legacy.family.featsAria.${index}`, {defaultValue: feat})}
                        >
                          <div className="bg-accent/10 p-2 rounded-full">
                            {index === 0 && <FaSeedling className="text-accent text-lg md:text-lg sm:text-base transition-transform duration-300 group-hover:scale-110" />}
                            {index === 1 && <FaHandshake className="text-accent text-lg md:text-lg sm:text-base transition-transform duration-300 group-hover:scale-110" />}
                            {index === 2 && <FaLeaf className="text-accent text-lg md:text-lg sm:text-base transition-transform duration-300 group-hover:scale-110" />}
                          </div>
                          <span className="flex-1">{feat}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* AfriNuts Era */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                variants={fadeIn}
                transition={{delay: 0.15}}
                className="group relative"
                aria-label={t('legacy.afrinuts.aria', {defaultValue: "AfriNuts Era"})}
              >
                <div className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 rounded-3xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-accent to-accent/90 p-6 flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <FaChartLine className="text-2xl md:text-2xl sm:text-xl text-white transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="font-display text-2xl text-white">
                      {t('legacy.afrinuts.title')}
                    </h3>
                  </div>
                  <div className="p-8">
                    <p className="mb-6 text-gray-700">{t('legacy.afrinuts.text')}</p>
                    <ul className="space-y-4">
                      {(t('legacy.afrinuts.feats', {returnObjects: true}) as string[]).map((feat: string, index: number) => (
                        <motion.li
                          key={index}
                          className="flex items-start gap-4 p-3 rounded-lg transition-colors"
                          whileHover={{x: 5}}
                          aria-label={t(`legacy.afrinuts.featsAria.${index}`, {defaultValue: feat})}
                        >
                          <div className="bg-accent/10 p-2 rounded-full">
                            {index === 0 && <FaIndustry className="text-accent text-lg md:text-lg sm:text-base transition-transform duration-300 group-hover:scale-110" />}
                            {index === 1 && <FaGlobe className="text-accent text-lg md:text-lg sm:text-base transition-transform duration-300 group-hover:scale-110" />}
                            {index === 2 && <FaUsers className="text-accent text-lg md:text-lg sm:text-base transition-transform duration-300 group-hover:scale-110" />}
                            {index === 3 && <FaSeedling className="text-accent text-lg md:text-lg sm:text-base transition-transform duration-300 group-hover:scale-110" />}
                          </div>
                          <span className="flex-1">{feat}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Vision 2031 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                variants={fadeIn}
                transition={{delay: 0.3}}
                aria-label={t('legacy.future.aria', {defaultValue: "Future Vision 2031"})}
              >
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 text-center border-2 border-primary/20 hover:border-accent/30 transition-all duration-300">
                  <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="bg-accent p-3 rounded-full">
                      <FaRocket className="text-2xl md:text-2xl sm:text-xl text-white transition-transform duration-300 hover:scale-110" />
                    </div>
                    <h3 className="font-display text-2xl text-primary">
                      {t('legacy.future.title')}
                    </h3>
                  </div>
                  <p className="text-gray-700 max-w-2xl mx-auto">
                    {t('legacy.future.text')}
                  </p>
                  <motion.button
                    className="mt-6 group bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center mx-auto"
                    variants={fadeIn}
                    onClick={() => navigate('/vision')}
                    aria-label={t('legacy.learnMoreAria', {defaultValue: "Learn more about Vision 2031"})}
                  >
                    {t('legacy.learnMore')}
                    <FaGlobe className="ml-3 group-hover:rotate-45 transition-transform" aria-hidden="true" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>
        </div>
      </main>
  );
};

export default About;
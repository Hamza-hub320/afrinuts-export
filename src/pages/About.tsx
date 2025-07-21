import React from 'react';
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

const About: React.FC = () => {
  const { t } = useTranslation('about');

  return (
      <main className="bg-background">
        {/* Hero Section */}
        <Section
            fullHeight={false}
            bgImage={aboutUsHeroImage}
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
              <Typography variant="subtitle" className="text-primary/90">
                {t('hero.subtitle')}
              </Typography>
            </motion.div>
          </motion.div>
        </Section>

        {/* Leadership Section */}
        <Section className="py-8 md:py-16 bg-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16">
              <Typography variant="subhead" className="uppercase tracking-widest mb-2">
                {t('leadership.subtitle')}
              </Typography>
              <h2 className="font-display text-3xl md:text-display-lg text-text-dark">
                {t('leadership.title')}
              </h2>
            </div>

            {/* CEO & CFO Messages - Updated for mobile */}
            <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
              {/* CEO Message */}
              <motion.div
                  className="w-full"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
              >
                <div className="bg-background rounded-xl md:rounded-3xl shadow-lg overflow-hidden h-full">
                  <div className="p-6 md:p-8 lg:p-12">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-accent">
                        <img
                            src={ceoImage}
                            alt={t('ceo.alt')}
                            width={80}
                            height={80}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="font-display text-xl md:text-2xl text-primary">Hamza S. Ralsan Sangare</h3>
                        <p className="font-subhead text-sm md:text-base text-text-dark">{t('ceo.position')}</p>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-base md:text-lg text-text-dark mb-4">
                        {t('ceo.message')}
                      </p>
                    </div>
                    <p className="mt-6 font-display italic text-primary text-sm md:text-base">
                      {t('ceo.signature')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CFO Message - Same structure as CEO */}
              <motion.div
                  className="w-full"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
              >
                <div className="bg-background rounded-xl md:rounded-3xl shadow-lg overflow-hidden h-full">
                  <div className="p-6 md:p-8 lg:p-12">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-accent">
                        <img
                            src={cfoImage}
                            alt={t('cfo.alt')}
                            width={80}
                            height={80}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="font-display text-xl md:text-2xl text-primary">Sekou Hakim Petter</h3>
                        <p className="font-subhead text-sm md:text-base text-text-dark">
                          {t('cfo.position', { defaultValue: "Co-founder & CFO" })}
                        </p>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-base md:text-lg text-text-dark mb-4">
                        {t('cfo.message')}
                      </p>
                    </div>
                    <p className="mt-6 font-display italic text-primary text-sm md:text-base">
                      {t('cfo.signature')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Brand Statement */}
        <Section className="py-8 md:py-10 bg-white text-center text-text-dark">
          <motion.div
              className="container mx-auto px-4 sm:px-6"
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
        <Section className="py-8 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                variants={staggerContainer}
            >
              <div className="text-center mb-8 md:mb-16">
                <Typography variant="subhead" className="uppercase tracking-widest mb-2">
                  {t('vmv.subtitle', {defaultValue: "Our Foundation"})}
                </Typography>
                <Typography variant="h2">
                  {t('vmv.title', {defaultValue: "Vision, Mission & Values"})}
                </Typography>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-24">
                <InfoCard
                    icon={FaGlobe}
                    title={t('vmv.vision.title')}
                    description={t('vmv.vision.text')}
                    iconColor="text-accent"
                />
                <InfoCard
                    icon={FaRocket}
                    title={t('vmv.mission.title')}
                    description={t('vmv.mission.text')}
                    iconColor="text-accent"
                />
                <InfoCard
                    icon={FaHandshake}
                    title={t('vmv.values.title')}
                    description={t('vmv.values.text')}
                    iconColor="text-accent"
                />
              </div>
            </motion.div>

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

              <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
                <InfoCard
                    icon={FaHandsHelping}
                    title={t('community.cards.pledge.title')}
                    description={t('community.cards.pledge.text')}
                    iconColor="text-accent"
                />
                <InfoCard
                    icon={FaWater}
                    title={t('community.cards.water.title')}
                    description={t('community.cards.water.text')}
                    iconColor="text-accent"
                />
                <InfoCard
                    icon={FaMosque}
                    title={t('community.cards.religion.title')}
                    description={t('community.cards.religion.text')}
                    iconColor="text-accent"
                />
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Farm Section */}
        <Section className="py-8 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
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
                <p className="text-lg text-text-dark mb-8 leading-relaxed">
                  {t('farm.text')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow">
                    <FaMapMarkerAlt className="text-accent text-xl"/>
                    <span>{t('farm.location')}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow">
                    <FaChartLine className="text-accent text-xl"/>
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
                  transition={{delay: 0.2}}
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

        {/* Legacy Timeline */}
        <Section className="py-16 bg-background text-text-dark">
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
                  className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-primary to-primary/90 p-6 flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <FaTree className="text-2xl text-white"/>
                    </div>
                    <h3 className="font-display text-2xl text-white">
                      {t('legacy.family.title')}
                    </h3>
                  </div>
                  <div className="p-8">
                    <p className="mb-6 text-gray-700">{t('legacy.family.text')}</p>
                    <ul className="space-y-4">
                      {t('legacy.family.feats', {returnObjects: true}).map((feat: string, index: number) => (
                          <motion.li
                              key={index}
                              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              whileHover={{x: 5}}
                          >
                            <div className="bg-accent/10 p-2 rounded-full">
                              {index === 0 && <FaSeedling className="text-accent text-lg"/>}
                              {index === 1 && <FaHandshake className="text-accent text-lg"/>}
                              {index === 2 && <FaLeaf className="text-accent text-lg"/>}
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
                  transition={{delay: 0.1}}
                  className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-accent to-accent/90 p-6 flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <FaChartLine className="text-2xl text-white"/>
                    </div>
                    <h3 className="font-display text-2xl text-white">
                      {t('legacy.afrinuts.title')}
                    </h3>
                  </div>
                  <div className="p-8">
                    <p className="mb-6 text-gray-700">{t('legacy.afrinuts.text')}</p>
                    <ul className="space-y-4">
                      {t('legacy.afrinuts.feats', {returnObjects: true}).map((feat: string, index: number) => (
                          <motion.li
                              key={index}
                              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              whileHover={{x: 5}}
                          >
                            <div className="bg-accent/10 p-2 rounded-full">
                              {index === 0 && <FaIndustry className="text-accent text-lg"/>}
                              {index === 1 && <FaGlobe className="text-accent text-lg"/>}
                              {index === 2 && <FaUsers className="text-accent text-lg"/>}
                              {index === 3 && <FaSeedling className="text-accent text-lg"/>}
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
                  transition={{delay: 0.2}}
              >
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 text-center border-2 border-primary/20 hover:border-accent/30 transition-all duration-300">
                  <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="bg-accent p-3 rounded-full">
                      <FaRocket className="text-2xl text-white"/>
                    </div>
                    <h3 className="font-display text-2xl text-primary">
                      {t('legacy.future.title')}
                    </h3>
                  </div>
                  <p className="text-gray-700 max-w-2xl mx-auto">
                    {t('legacy.future.text')}
                  </p>
                  <button className="mt-6 group bg-accent hover:bg-dark-orange text-white px-6 py-2 rounded-full transition-all duration-300 inline-flex items-center mx-auto">
                    {t('legacy.learnMore')}
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform"/>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>
      </main>
  );
};

export default About;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaTree, FaSeedling, FaArrowRight, FaHandshake, FaLeaf,
  FaIndustry, FaGlobe, FaUsers, FaRocket,
  FaMapMarkerAlt, FaChartLine, FaHandsHelping, FaMosque, FaWater
} from 'react-icons/fa';
import Section from '../components/Section/Section';
import { fadeIn, staggerContainer } from '../utils/animations';

import ceoImage from '../assets/images/ceo.jpg';
import cfoImage from '../assets/images/cfo.jpg';
import farmImage from '../assets/images/cashew-farm.jpg';
import {Typography} from "../components/Typography/Typography";
import { InfoCard } from '../components/InfoCard/InfoCard';

const About: React.FC = () => {
  const {t} = useTranslation('about');

  return (
      <main className="bg-background">
        {/* Hero Section */}
        <Section
            fullHeight={false}
            bgImage={farmImage}
            overlay
            overlayColor="bg-primary/20"
            className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[60vh] pb-12 px-6"
            imageStyles={{ backgroundAttachment: 'fixed' }}
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
        <Section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
            <span className="font-subhead text-accent tracking-widest text-sm uppercase block mb-2">
              Our Leadership
            </span>
              <h2 className="font-display text-display-lg text-text-dark">
                {t('leadership.title')}
              </h2>
            </div>

            {/* CEO Message */}
            <div className="flex flex-col lg:flex-row gap-16 mb-24">
              <motion.div
                  className="flex-1"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  variants={fadeIn}
              >
                <div className="bg-background rounded-3xl shadow-lg overflow-hidden">
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-accent">
                        <img src={ceoImage} alt={t('ceo.alt')} loading="lazy" className="w-full h-full object-cover"/>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl text-primary">Hamza S. Ralsan Sangare</h3>
                        <p className="font-subhead text-accent">{t('ceo.position')}</p>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-lg text-text-dark mb-4">{t('ceo.message')}</p>

                    </div>
                    <p className="mt-8 font-display italic text-primary">{t('ceo.signature')}</p>
                  </div>
                </div>
              </motion.div>

              {/* CFO Message */}
              <motion.div
                  className="flex-1"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  variants={fadeIn}
              >
                <div className="bg-background rounded-3xl shadow-lg overflow-hidden">
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-accent">
                        <img src={cfoImage} alt="CFO" loading="lazy" className="w-full h-full object-cover"/>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl text-primary">Sekou Hakim Petter</h3>
                        <p className="font-subhead text-accent">Co-founder & CFO</p>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-lg text-text-dark mb-4">
                        "Our financial strategy is built on sustainable growth and ethical investments.
                        We're committed to transparency and creating long-term value for our stakeholders
                        while maintaining our Islamic financial principles."
                      </p>
                      <p className="text-lg text-text-dark">
                        "By reinvesting 25% of our profits back into the business and community,
                        we ensure AfriNuts remains financially healthy while fulfilling our social responsibilities."
                      </p>
                    </div>
                    <p className="mt-8 font-display italic text-primary">- Sekou Hakim Petter</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Brand Statement */}
        <Section className="py-10 bg-white text-center text-text-dark ">
          <motion.div
              className="container mx-auto px-6"
              initial="hidden"
              whileInView="visible"
              viewport={{once: true}}
              variants={fadeIn}
          >
            <h2 className="font-display text-display-lg mb-8 text-text-dark">
              {t('brand.title')}
            </h2>
            <p className="font-sans text-xl leading-relaxed">
              {t('brand.text')}
            </p>
          </motion.div>
        </Section>

        {/* Vision, Mission, Values */}
        <Section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                variants={staggerContainer}
            >
              <div className="text-center mb-160">
              <span className="font-subhead text-accent tracking-widest text-sm uppercase block mb-2">
                Our Foundation
              </span>
                <h2 className="font-display text-display-lg text-text-dark">
                  Vision, Mission & Values
                </h2>
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
              <div className="text-center mb-16">
                <h2 className="font-display text-display-lg text-text-dark">
                  {t('community.title')}
                </h2>
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
        <Section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <motion.div
                  className="flex-1"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  variants={fadeIn}
              >
                <div className="mb-8">
                <span className="font-subhead text-accent tracking-widest text-sm uppercase block mb-2">
                  Our Operations
                </span>
                  <h2 className="font-display text-display-lg text-text-dark">
                    {t('farm.title')}
                  </h2>
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
                      className="w-full h-auto object-cover aspect-video"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Legacy Timeline */}
        <Section className="py-16 bg-background text-text-dark">
          <div className="container mx-auto px-6">
            <motion.div
                className="text-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}}
                variants={fadeIn}
            >
              <Typography variant="h2" className="mb-4">
                {t('legacy.title')}
              </Typography>
              <Typography variant="subtitle" className="text-accent">
                Our Journey Through Time
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
                <div
                    className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
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
                      {[
                        {icon: FaSeedling, text: t('legacy.family.feats.0')},
                        {icon: FaHandshake, text: t('legacy.family.feats.1')},
                        {icon: FaLeaf, text: t('legacy.family.feats.2')}
                      ].map((item, index) => (
                          <motion.li
                              key={index}
                              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              whileHover={{x: 5}}
                          >
                            <div className="bg-accent/10 p-2 rounded-full">
                              <item.icon className="text-accent text-lg"/>
                            </div>
                            <span className="flex-1">{item.text}</span>
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
                <div
                    className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r bg-accent to-accent/90 p-6 flex items-center gap-4">
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
                      {[
                        {icon: FaIndustry, text: t('legacy.afrinuts.feats.0')},
                        {icon: FaGlobe, text: t('legacy.afrinuts.feats.1')},
                        {icon: FaUsers, text: t('legacy.afrinuts.feats.2')},
                        {icon: FaSeedling, text: t('legacy.afrinuts.feats.3')}
                      ].map((item, index) => (
                          <motion.li
                              key={index}
                              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              whileHover={{x: 5}}
                          >
                            <div className="bg-accent/10 p-2 rounded-full">
                              <item.icon className="text-accent text-lg"/>
                            </div>
                            <span className="flex-1">{item.text}</span>
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
                <div
                    className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 text-center border-2 border-primary/20 hover:border-accent/30 transition-all duration-300">
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
                  <button
                      className="mt-6 group bg-accent hover:bg-dark-orange text-white px-6 py-2 rounded-full transition-all duration-300 inline-flex items-center mx-auto">
                    Learn More About Our Vision
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
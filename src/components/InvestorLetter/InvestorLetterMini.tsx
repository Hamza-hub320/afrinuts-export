
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Typography } from "@/components/Typography/Typography";
import {
    FaQuoteLeft,
    FaArrowRight,
    FaEnvelope,
    FaCheckCircle,
    FaPlane,
    FaCode,
    FaUserTie,
} from "react-icons/fa";
import investorEmailImg from "@/assets/images/investor-email-alassana.webp";

export function InvestorLetterMini() {
    const { t } = useTranslation("home");

    const proofPoints = [
        {
            icon: FaPlane,
            label: t("investorLetter.stats.invested"),
        },
        {
            icon: FaCode,
            label: t("investorLetter.stats.joined"),
        },
        {
            icon: FaUserTie,
            label: t("investorLetter.stats.verified"),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Section header */}
            <Reveal className="text-center mb-10 md:mb-14">
                <Typography variant="h2" className="mb-4">
                    {t("investorLetter.title")}
                </Typography>
                <Typography
                    variant="body"
                    className="text-gray-600 max-w-3xl mx-auto"
                >
                    {t("investorLetter.subtitle")}
                </Typography>
            </Reveal>

            {/* Two-column layout */}
            <div className="grid md:grid-cols-5 gap-8 md:gap-10 items-center">
                {/* LEFT — Email screenshot (2 cols) */}
                <Reveal className="md:col-span-2">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-4 transform-gpu group"
                        style={{
                            transformStyle: "preserve-3d",
                            perspective: "1000px",
                        }}
                        whileHover={{
                            y: -6,
                            scale: 1.02,
                            rotateY: -2,
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
                            transition: { duration: 0.3 },
                        }}
                    >
                        {/* 3D edge */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500 pointer-events-none" />
                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 pointer-events-none" />

                        <div className="relative z-10">
                            {/* Email chrome */}
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <FaEnvelope className="text-accent text-sm" />
                                <Typography
                                    variant="small"
                                    className="text-gray-500 text-xs"
                                >
                                    {t("investorLetter.emailLabel")}
                                </Typography>
                            </div>

                            {/* Screenshot — clickable, hover-to-zoom */}
                            <motion.img
                                src={investorEmailImg}
                                alt={t("investorLetter.emailThumbnailAlt")}
                                className="w-full h-auto rounded-2xl shadow-md cursor-zoom-in"
                                loading="lazy"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => window.open(investorEmailImg, "_blank")}
                            />

                            {/* Mobile-only link to full letter */}
                            <div className="mt-3 text-center md:hidden">
                                <Link
                                    to="/invest#investor-letter"
                                    className="inline-flex items-center gap-1.5 text-accent hover:text-primary text-xs font-medium underline"
                                >
                                    {t("investorLetter.readFullLetter")}
                                    <FaArrowRight className="text-[10px]" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </Reveal>

                {/* RIGHT — Quote + attribution + CTA (3 cols) */}
                <Reveal className="md:col-span-3" delay={0.15}>
                    <div className="relative">
                        {/* Large quote mark */}
                        <FaQuoteLeft className="text-accent/30 text-4xl md:text-5xl mb-4" />

                        {/* Pull quote */}
                        <Typography
                            variant="lead"
                            className="text-gray-800 italic leading-relaxed mb-6 text-lg md:text-xl"
                        >
                            "{t("investorLetter.pullQuote")}"
                        </Typography>

                        {/* Attribution */}
                        <Typography
                            variant="body"
                            className="text-primary font-semibold text-sm md:text-base mb-6"
                        >
                            {t("investorLetter.attribution")}
                        </Typography>

                        {/* Proof points — 3 mini icons */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {proofPoints.map((point, idx) => (
                                <motion.div
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                                >
                                    <point.icon className="text-accent text-xs" />
                                    <span className="text-gray-700 text-xs font-medium">
                    {point.label}
                  </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-primary/10 pt-4 mb-6" />

                        {/* CTA */}
                        <Link
                            to="/invest"
                            className="group inline-flex items-center gap-2 text-accent hover:text-primary font-medium text-sm md:text-base transition-colors"
                        >
              <span className="underline decoration-accent/40 group-hover:decoration-primary/60 underline-offset-4">
                {t("investorLetter.readFullLetter")}
              </span>
                            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Permission note */}
                        <Typography
                            variant="small"
                            className="text-gray-400 text-xs mt-6"
                        >
                            <FaCheckCircle className="inline mr-1.5 text-green-500 text-[10px]" />
                            {t("investorLetter.permission")}
                        </Typography>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
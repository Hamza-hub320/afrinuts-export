import { useTranslation } from "react-i18next";
import { Reveal, StaggerList, StaggerItem } from "@/components/Reveal";
import { Typography } from "@/components/Typography/Typography";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaEnvelope, FaArrowRight, FaCheckCircle, FaFileContract } from "react-icons/fa";
import investorEmailImg from "@/assets/images/investor-email-alassana.webp";
import ndaPDF from "@/assets/documents/nda-afrinuts.pdf";

interface InvestorLetterProps {
    onRequestDemo?: () => void;
    onScheduleVisit?: () => void;
}

export function InvestorLetter({ onRequestDemo, onScheduleVisit }: InvestorLetterProps) {
    const { t } = useTranslation("invest");

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <Reveal className="text-center mb-10">
                <Typography variant="h2" className="mb-4">
                    {t("investorLetter.title")}
                </Typography>
                <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">
                    {t("investorLetter.subtitle")}
                </Typography>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* LEFT — The email screenshot */}
                <Reveal>
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-4 transform-gpu group"
                        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                        whileHover={{
                            y: -4,
                            scale: 1.01,
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
                            transition: { duration: 0.3 },
                        }}
                    >
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

                        <div className="relative z-10">
                            {/* Email chrome */}
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <FaEnvelope className="text-accent text-sm" />
                                <Typography variant="small" className="text-gray-500 text-xs">
                                    {t("investorLetter.emailLabel")}
                                </Typography>
                            </div>

                            <img
                                src={investorEmailImg}
                                alt={t("investorLetter.emailPreviewAlt")}
                                className="w-full h-auto rounded-2xl shadow-md"
                                loading="lazy"
                            />

                            <div className="mt-3 text-center">
                                <a
                                    href={investorEmailImg}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-accent hover:text-primary text-xs font-medium underline"
                                >
                                    <FaArrowRight className="text-[10px]" />
                                    {t("investorLetter.viewFullEmail")}
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </Reveal>

                {/* RIGHT — Pull quotes + attribution */}
                <div className="space-y-5">
                    <StaggerList className="space-y-4">
                        {(["one", "two", "three"] as const).map((key) => (
                            <StaggerItem key={key}>
                                <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 shadow-sm">
                                    <FaQuoteLeft className="text-accent/30 text-2xl mb-2" />
                                    <Typography
                                        variant="body"
                                        className="text-gray-700 italic leading-relaxed"
                                    >
                                        "{t(`investorLetter.pullQuotes.${key}`)}"
                                    </Typography>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerList>

                    {/* Attribution */}
                    <Reveal>
                        <div className="pt-4 border-t border-primary/10">
                            <Typography
                                variant="small"
                                className="text-primary font-semibold text-sm"
                            >
                                {t("investorLetter.attribution")}
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-gray-500 text-xs mt-1"
                            >
                                <FaCheckCircle className="inline mr-1.5 text-green-500 text-[10px]" />
                                {t("investorLetter.verifyNote")}
                            </Typography>
                        </div>
                    </Reveal>

                    {/* CTAs */}
                    <Reveal delay={0.15}>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <a
                                href={ndaPDF}
                                download
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-3 rounded-full text-sm font-medium shadow-md inline-flex items-center justify-center gap-2"
                            >
                                <FaFileContract className="text-xs" />
                                {t("investorLetter.ctaPrimary")}
                            </a>
                            {onScheduleVisit && (
                                <motion.button
                                    onClick={onScheduleVisit}
                                    className="relative border-2 border-primary/40 text-primary hover:bg-primary/5 px-5 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm"
                                    whileHover={{ y: -2 }}
                                >
                                    {t("investorLetter.ctaSecondary")}
                                    <FaArrowRight className="text-xs" />
                                </motion.button>
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
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
                        className="relative overflow-hidden rounded-3xl p-4 transform-gpu group transition-all duration-500"
                        style={{
                            background: 'linear-gradient(135deg, rgba(35,35,40,0.70) 0%, rgba(20,20,25,0.60) 50%, rgba(30,30,35,0.65) 100%)',
                            border: '1px solid rgba(255,255,255,0.14)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(24px) saturate(200%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                        }}
                        whileHover={{
                            y: -4,
                            scale: 1.01,
                            boxShadow: '0 16px 40px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                            transition: { duration: 0.3 },
                        }}
                    >
                        {/* Very faint brand glow */}
                        <div
                            className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-12 blur-3xl animate-pulse pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(224,78,0,0.5) 0%, transparent 70%)' }}
                        />
                        <div
                            className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full opacity-10 blur-3xl pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(90,116,17,0.5) 0%, transparent 70%)',
                                animation: 'float 6s ease-in-out infinite',
                            }}
                        />

                        {/* Top highlight — the "glass shine" */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                        {/* Inner ring */}
                        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.08] pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Email chrome */}
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <FaEnvelope className="text-accent text-sm" />
                                <Typography variant="small" className="text-white/70 text-xs">
                                    {t("investorLetter.emailLabel")}
                                </Typography>
                            </div>

                            <img
                                src={investorEmailImg}
                                alt={t("investorLetter.emailPreviewAlt")}
                                className="w-full h-auto rounded-2xl shadow-lg"
                                loading="lazy"
                            />

                            <div className="mt-3 text-center">
                                <a
                                    href={investorEmailImg}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-accent hover:text-white text-xs font-medium underline"
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
                                <motion.div
                                    className="group relative overflow-hidden rounded-2xl transition-all duration-500 transform-gpu"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.30) 50%, rgba(255,255,255,0.45) 100%)',
                                        border: '1px solid rgba(255,255,255,0.70)',
                                        boxShadow: '0 8px 32px rgba(165,105,66,0.08), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.03)',
                                        backdropFilter: 'blur(24px) saturate(180%)',
                                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                                    }}
                                    whileHover={{
                                        y: -3,
                                        scale: 1.01,
                                        boxShadow: '0 16px 40px -8px rgba(165,105,66,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
                                        transition: { duration: 0.3 },
                                    }}
                                >
                                    {/* Very faint brand glow — barely visible */}
                                    <div
                                        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-15 blur-3xl animate-pulse pointer-events-none"
                                        style={{ background: 'radial-gradient(circle, rgba(224,78,0,0.4) 0%, transparent 70%)' }}
                                    />
                                    <div
                                        className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full opacity-10 blur-3xl pointer-events-none"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(90,116,17,0.4) 0%, transparent 70%)',
                                            animation: 'float 6s ease-in-out infinite',
                                        }}
                                    />

                                    {/* Top highlight — the "glass shine" */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

                                    {/* Inner ring */}
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30 pointer-events-none" />

                                    {/* Content */}
                                    <div className="relative z-10 p-5">
                                        <FaQuoteLeft className="text-accent/60 text-2xl mb-3" />
                                        <Typography
                                            variant="body"
                                            className="text-gray-800 italic leading-relaxed"
                                        >
                                            "{t(`investorLetter.pullQuotes.${key}`)}"
                                        </Typography>
                                    </div>
                                </motion.div>
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
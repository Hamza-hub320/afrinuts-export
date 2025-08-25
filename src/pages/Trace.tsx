import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Section from "@/components/Section/Section";
import { Typography } from "@/components/Typography/Typography";

// Simulated batch data for development/testing
const simulatedBatches = [
    {
        BatchID: "AFN-SIM-001",
        HarvestDate: "2025-01-01",
        FarmLocation: "Odienné, Ivory Coast",
        ProcessingInfo: "Sun-dried, sorted manually",
        Certifications: ["Organic Pending", "Fair Trade"],
        QualityCheckResults: "Moisture < 5%, Size Grade A",
    },
    {
        BatchID: "AFN-SIM-002",
        HarvestDate: "2025-02-01",
        FarmLocation: "Odienné, Ivory Coast",
        ProcessingInfo: "Steam-roasted, shell removed",
        Certifications: ["ISO 22000", "Rainforest Alliance"],
        QualityCheckResults: "Moisture < 4.8%, Size Grade B",
    },
    {
        BatchID: "AFN-SIM-003",
        HarvestDate: "2025-03-15",
        FarmLocation: "Odienné, Ivory Coast",
        ProcessingInfo: "Manual sorting and grading",
        Certifications: ["Fair Trade", "Rainforest Alliance"],
        QualityCheckResults: "Moisture < 4.9%, Size Grade A",
    },
];

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const TracePage: React.FC = () => {
    const { t } = useTranslation("trace");
    const query = useQuery();
    const batchId = query.get("batchId");

    const batch =
        simulatedBatches.find((b) => b.BatchID === batchId) || simulatedBatches[0];
    const isPreview = !batchId;
    const navigate = useNavigate();

    return (
        <main className="text-text-dark font-sans">
            {/* Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[40vh] bg-gradient-to-b from-primary/5 to-transparent"
            >
                <div className="max-w-3xl px-6 sm:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="subhead"
                            className="uppercase tracking-widest text-primary mb-4"
                        >
                            {t("page.title")}
                        </Typography>
                        <Typography
                            variant="h1"
                            className="text-4xl md:text-5xl lg:text-6xl font-display text-text-dark mb-6"
                        >
                            {batch.BatchID}
                        </Typography>
                        <Typography
                            variant="lead"
                            className="text-text-dark max-w-2xl mx-auto"
                        >
                            {t("page.description")}
                        </Typography>
                        {isPreview && (
                            <motion.div
                                className="bg-yellow-100 text-yellow-800 p-3 rounded-xl mt-4 border border-yellow-300 backdrop-blur-sm"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {t("batch.previewNotice")}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </Section>

            {/* Intro/About Section */}
            <Section fullHeight={false} className="py-16 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h2" className="text-4xl font-bold text-primary mb-4">
                            {t("page.title")}
                        </Typography>
                        <Typography variant="h5" className="text-primary-dark mb-4">
                            {t("page.subtitle")}
                        </Typography>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            {t("page.about")}
                        </Typography>
                    </motion.div>
                </div>
            </Section>

            {/* Batch Details Card */}
            <Section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-3xl shadow-xl p-8 transform-gpu"
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                        }}
                        whileHover={{
                            y: -5,
                            scale: 1.01,
                            rotateY: 1,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    <Typography variant="h5" className="font-bold text-primary mb-2">
                                        {t("batch.harvestDate")}
                                    </Typography>
                                    <Typography variant="body" className="bg-white/30 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                                        {batch.HarvestDate}
                                    </Typography>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <Typography variant="h5" className="font-bold text-primary mb-2">
                                        {t("batch.farmLocation")}
                                    </Typography>
                                    <Typography variant="body" className="bg-white/30 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                                        {batch.FarmLocation}
                                    </Typography>
                                </motion.div>
                                <motion.div
                                    className="md:col-span-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <Typography variant="h5" className="font-bold text-primary mb-2">
                                        {t("batch.processingInfo")}
                                    </Typography>
                                    <Typography variant="body" className="bg-white/30 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                                        {batch.ProcessingInfo}
                                    </Typography>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    <Typography variant="h5" className="font-bold text-primary mb-2">
                                        {t("batch.certifications")}
                                    </Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {batch.Certifications.map((cert, idx) => (
                                            <motion.span
                                                key={idx}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary backdrop-blur-sm border border-primary/30 transform-gpu hover:scale-105 transition-transform duration-300"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                transition={{ type: 'spring', stiffness: 400 }}
                                            >
                                                {cert}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                >
                                    <Typography variant="h5" className="font-bold text-primary mb-2">
                                        {t("batch.qualityCheckResults")}
                                    </Typography>
                                    <Typography variant="body" className="bg-white/30 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                                        {batch.QualityCheckResults}
                                    </Typography>
                                </motion.div>
                            </div>

                            {/* Preview All Batches */}
                            <motion.div
                                className="mt-12"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <Typography variant="h3" className="text-2xl font-bold text-primary mb-6 text-center">
                                    {t("batch.previewAllBatches")}
                                </Typography>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {simulatedBatches.map((b, index) => (
                                        <motion.button
                                            key={b.BatchID}
                                            onClick={() => navigate(`/trace?batchId=${b.BatchID}`)}
                                            className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col items-center text-center transform-gpu group"
                                            style={{
                                                transformStyle: 'preserve-3d',
                                            }}
                                            whileHover={{
                                                y: -5,
                                                scale: 1.03,
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                            }}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.1 * index }}
                                        >
                                            {/* Glassy effect for batch cards */}
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                                            <div className="relative z-10">
                                                <Typography variant="h5" className="font-bold text-primary mb-2">
                                                    {b.BatchID}
                                                </Typography>
                                                <Typography variant="body-sm" className="text-gray-700">
                                                    {b.HarvestDate}
                                                </Typography>
                                                <Typography variant="body-sm" className="text-gray-500 mt-1">
                                                    {b.FarmLocation}
                                                </Typography>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                className="mt-8 text-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                <Link
                                    to="/"
                                    className="inline-block bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg items-center mx-auto font-medium transform-gpu hover:scale-105"
                                >
                                    {t("batch.backToHome")}
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default TracePage;
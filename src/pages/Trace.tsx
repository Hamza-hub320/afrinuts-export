import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
                className="flex items-center justify-center text-center min-h-[40vh] bg-gradient-to-b bg-transparent"
            >
                <div className="max-w-3xl px-6 sm:px-8 py-12">
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
                        <div className="bg-yellow-100 text-yellow-800 p-2 rounded mt-4">
                            {t("batch.previewNotice")}
                        </div>
                    )}
                </div>
            </Section>

            {/* Intro/About Section */}
            <Section fullHeight={false} className="py-16 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <Typography variant="h2" className="text-4xl font-bold text-primary mb-4">
                        {t("page.title")}
                    </Typography>
                    <Typography variant="h5" className="text-primary-dark mb-4">
                        {t("page.subtitle")}
                    </Typography>
                    <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                        {t("page.about")}
                    </Typography>
                </div>
            </Section>

            {/* Batch Details Card */}
            <Section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-3xl shadow-lg p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Typography variant="h5" className="font-bold text-primary mb-2">
                                    {t("batch.harvestDate")}
                                </Typography>
                                <Typography variant="body">{batch.HarvestDate}</Typography>
                            </div>
                            <div>
                                <Typography variant="h5" className="font-bold text-primary mb-2">
                                    {t("batch.farmLocation")}
                                </Typography>
                                <Typography variant="body">{batch.FarmLocation}</Typography>
                            </div>
                            <div className="md:col-span-2">
                                <Typography variant="h5" className="font-bold text-primary mb-2">
                                    {t("batch.processingInfo")}
                                </Typography>
                                <Typography variant="body">{batch.ProcessingInfo}</Typography>
                            </div>
                            <div>
                                <Typography variant="h5" className="font-bold text-primary mb-2">
                                    {t("batch.certifications")}
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {batch.Certifications.map((cert, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                        >
                      {cert}
                    </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Typography variant="h5" className="font-bold text-primary mb-2">
                                    {t("batch.qualityCheckResults")}
                                </Typography>
                                <Typography variant="body">{batch.QualityCheckResults}</Typography>
                            </div>
                        </div>

                        {/* Preview All Batches */}
                        <div className="mt-12">
                            <Typography variant="h3" className="text-2xl font-bold text-primary mb-4 text-center">
                                {t("batch.previewAllBatches")}
                            </Typography>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {simulatedBatches.map((b) => (
                                    <button
                                        key={b.BatchID}
                                        onClick={() => navigate(`/trace?batchId=${b.BatchID}`)}
                                        className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col items-center text-center"
                                    >
                                        <Typography variant="h5" className="font-bold text-primary mb-2">
                                            {b.BatchID}
                                        </Typography>
                                        <Typography variant="body-sm" className="text-gray-700">
                                            {b.HarvestDate}
                                        </Typography>
                                        <Typography variant="body-sm" className="text-gray-500 mt-1">
                                            {b.FarmLocation}
                                        </Typography>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                to="/"
                                className="inline-block bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg items-center mx-auto font-medium"
                            >
                                {t("batch.backToHome")}
                            </Link>
                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
};

export default TracePage;
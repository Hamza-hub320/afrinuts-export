import { ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/utils/animations";
import Section from "@/components/Section/Section";

interface HeroSectionProps {
    bgImage?: string;
    children: ReactNode;
    className?: string;
}

export function HeroSection({ bgImage, children, className = "" }: HeroSectionProps) {
    return (
        <Section
            animate={false}   // hero animates itself
            bgImage={bgImage}
            className={`flex items-end justify-center text-center ${className}`}
        >
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                {children}
            </motion.div>
        </Section>
    );
}
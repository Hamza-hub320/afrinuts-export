import { motion, Variants, useInView } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

/* ---------------------------------------------
 * Apple-style easing — easeOutQuint
 * Starts fast, glides to a stop. Feels "confident."
 * This is the curve Apple uses for scroll reveals.
 * ------------------------------------------- */
const APPLE_EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------------------
 * Timing presets — tune globally from here
 * ------------------------------------------- */
const TIMING = {
    /* Slower, more cinematic — Apple product page feel */
    revealDuration: 1.1,       // 0.8–1.2s is Apple's range
    staggerChildren: 0.15,     // 120–200ms between children
    delayChildren: 0.12,

    /* Hover / micro-interactions */
    hoverDuration: 0.4,
} as const;

/* ---------------------------------------------
 * <Reveal /> — single element fade + rise
 * ------------------------------------------- */
interface RevealProps {
    children: ReactNode;
    delay?: number;
    y?: number;
    duration?: number;
    className?: string;
    once?: boolean;
}

export function Reveal({
                           children,
                           delay = 0,
                           y = 32,                    // slightly larger rise = more noticeable
                           duration = TIMING.revealDuration,
                           className,
                           once = true,
                       }: RevealProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: "-80px" }}
            transition={{ duration, delay, ease: APPLE_EASE }}
        >
            {children}
        </motion.div>
    );
}

/* ---------------------------------------------
 * <StaggerList /> + <StaggerItem />
 * ------------------------------------------- */
const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: TIMING.staggerChildren,
            delayChildren: TIMING.delayChildren,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: TIMING.revealDuration, ease: APPLE_EASE },
    },
};

interface StaggerListProps {
    children: ReactNode;
    className?: string;
    once?: boolean;
}

export function StaggerList({
                                children,
                                className,
                                once = true,
                            }: StaggerListProps) {
    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once, margin: "-80px" }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
                                children,
                                className,
                            }: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div className={className} variants={itemVariants}>
            {children}
        </motion.div>
    );
}

/* ---------------------------------------------
 * <CountUp /> — animated numbers
 * Slower to match the slower reveal rhythm
 * ------------------------------------------- */
interface CountUpProps {
    to: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function CountUp({
                            to,
                            duration = 1.6,            // longer than before — feels more deliberate
                            prefix = "",
                            suffix = "",
                            className,
                        }: CountUpProps) {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    useEffect(() => {
        if (!inView) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) {
            setVal(to);
            return;
        }

        const start = performance.now();
        let raf = 0;

        const tick = (now: number) => {
            const p = Math.min((now - start) / (duration * 1000), 1);
            // easeOutQuint — same curve as reveal
            const eased = 1 - Math.pow(1 - p, 5);
            setVal(Math.round(eased * to));
            if (p < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, to, duration]);

    return (
        <span ref={ref} className={className}>
      {prefix}
            {val.toLocaleString()}
            {suffix}
    </span>
    );
}
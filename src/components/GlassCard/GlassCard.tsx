import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaInfoCircle } from 'react-icons/fa';

type GlassTone = 'light' | 'dark';
type GlassTint = 'accent' | 'primary' | 'secondary' | 'neutral';
type GlassRadius = 'sm' | 'md' | 'lg' | 'xl';

interface GlassCardProps {
    // Content
    title?: string;
    subtitle?: string;
    icon?: IconType;
    iconColor?: string;
    children?: React.ReactNode;
    cta?: string | React.ReactNode;
    onClickCta?: () => void;
    showInfoBadge?: boolean;

    // Glass physics
    tone?: GlassTone;           // ambient light environment
    tint?: GlassTint;           // brand color bleeding through
    radius?: GlassRadius;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';

    // Behavior
    hoverLift?: boolean;
    animated?: boolean;
    refraction?: boolean;       // 3D chromatic edge (default true)
}

const radiusMap: Record<GlassRadius, string> = {
    sm: 'rounded-lg',
    md: 'rounded-2xl',
    lg: 'rounded-3xl',
    xl: 'rounded-[2rem]',
};

const paddingMap = {
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8 md:p-10',
};

// ─── Brand tint palettes ─────────────────────────────────
// These drive the ILLUMINATION LAYER (internal glow) only.
// The glass surface itself is neutral — the tint bleeds through from within.
const tintPalettes = {
    light: {
        accent: {
            illuminate: 'rgba(224,78,0,0.14)',
            illuminateDeep: 'rgba(210,125,45,0.08)',
            titleText: 'text-accent',
        },
        primary: {
            illuminate: 'rgba(90,116,17,0.13)',
            illuminateDeep: 'rgba(90,116,17,0.07)',
            titleText: 'text-primary',
        },
        secondary: {
            illuminate: 'rgba(160,200,0,0.13)',
            illuminateDeep: 'rgba(90,116,17,0.07)',
            titleText: 'text-secondary',
        },
        neutral: {
            illuminate: 'rgba(255,255,255,0.10)',
            illuminateDeep: 'rgba(255,255,255,0.05)',
            titleText: 'text-gray-800',
        },
    },
    dark: {
        accent: {
            illuminate: 'rgba(224,78,0,0.32)',
            illuminateDeep: 'rgba(210,125,45,0.18)',
            titleText: 'text-white',
        },
        primary: {
            illuminate: 'rgba(90,116,17,0.30)',
            illuminateDeep: 'rgba(160,200,0,0.15)',
            titleText: 'text-white',
        },
        secondary: {
            illuminate: 'rgba(160,200,0,0.28)',
            illuminateDeep: 'rgba(90,116,17,0.15)',
            titleText: 'text-white',
        },
        neutral: {
            illuminate: 'rgba(255,255,255,0.10)',
            illuminateDeep: 'rgba(255,255,255,0.04)',
            titleText: 'text-white',
        },
    },
} as const;

const GlassCard: React.FC<GlassCardProps> = ({
                                                 title,
                                                 subtitle,
                                                 icon: Icon,
                                                 iconColor,
                                                 children,
                                                 cta,
                                                 onClickCta,
                                                 showInfoBadge = false,
                                                 tone = 'light',
                                                 tint = 'primary',
                                                 radius = 'md',
                                                 className = '',
                                                 padding = 'md',
                                                 hoverLift = true,
                                                 animated = true,
                                                 refraction = true,
                                             }) => {
    const palette = tintPalettes[tone][tint];
    const resolvedIconColor = iconColor || (tone === 'dark' ? 'text-accent' : 'text-accent');

    const bodyText = tone === 'dark' ? 'text-white/90' : 'text-gray-800';
    const mutedText = tone === 'dark' ? 'text-white/60' : 'text-gray-500';

    const safeTitleId = title
        ? `glasscard-${title.replace(/\s+/g, '-').toLowerCase()}`
        : undefined;

    // ─── Base surface (structure, not color) ────────────────
    // The card's material is a neutral glass. All color comes
    // from the illumination layer inside.
    const baseSurface = tone === 'light'
        ? 'linear-gradient(135deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.28) 45%, rgba(255,255,255,0.42) 100%)'
        : 'linear-gradient(135deg, rgba(30,30,34,0.60) 0%, rgba(16,16,20,0.48) 45%, rgba(24,24,28,0.56) 100%)';

    const Wrapper: any = animated ? motion.div : 'div';
    const wrapperProps = animated
        ? {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5 },
        }
        : {};

    const hoverProps = hoverLift
        ? {
            whileHover: {
                y: -3,
                scale: 1.012,
                transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            },
        }
        : {};

    return (
        <Wrapper
            className={`group relative ${radiusMap[radius]} ${paddingMap[padding]} transform-gpu ${className}`}
            style={{
                background: baseSurface,
                backdropFilter: 'blur(28px) saturate(200%)',
                WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                isolation: 'isolate',
                transformStyle: 'preserve-3d',
                perspective: '1200px',
            }}
            {...wrapperProps}
            {...hoverProps}
            role="region"
            aria-labelledby={safeTitleId}
        >
            {/* ══════════════════════════════════════════════════
                LAYER 1 — HIGHLIGHT
                Simulates light casting across the top-left edge.
                Directional: brightest at top, fades toward bottom.
                ══════════════════════════════════════════════════ */}
            <div
                className={`pointer-events-none absolute inset-0 ${radiusMap[radius]} overflow-hidden`}
                aria-hidden="true"
            >
                {/* Top-edge specular highlight — the "glass catching light" */}
                <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                        background: tone === 'light'
                            ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.95) 20%, rgba(255,255,255,0.95) 80%, transparent)'
                            : 'linear-gradient(to right, transparent, rgba(255,255,255,0.55) 20%, rgba(255,255,255,0.55) 80%, transparent)',
                    }}
                />

                {/* Soft halo bleeding down from the top edge */}
                <div
                    className="absolute inset-x-0 top-0 h-24"
                    style={{
                        background: tone === 'light'
                            ? 'linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, transparent 100%)'
                            : 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%)',
                    }}
                />

                {/* Top-left corner sparkle */}
                <div
                    className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-60 blur-2xl"
                    style={{
                        background: tone === 'light'
                            ? 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* ══════════════════════════════════════════════════
                LAYER 2 — ILLUMINATION
                Internal brand glow. This is where your color
                palette (accent/primary/secondary) lives.
                ══════════════════════════════════════════════════ */}
            <div
                className={`pointer-events-none absolute inset-0 ${radiusMap[radius]} overflow-hidden`}
                aria-hidden="true"
            >
                {/* Central internal light source — brand tinted */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(ellipse at 50% 40%, ${palette.illuminate} 0%, transparent 65%)`,
                    }}
                />

                {/* Deepest internal bleed toward bottom — brand tinted */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(ellipse at 30% 100%, ${palette.illuminateDeep} 0%, transparent 60%)`,
                    }}
                />

                {/* Animated internal drift — subtle life */}
                <motion.div
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${palette.illuminate} 0%, transparent 70%)`,
                    }}
                    animate={{
                        x: [0, 12, 0],
                        y: [0, -10, 0],
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${palette.illuminateDeep} 0%, transparent 70%)`,
                    }}
                    animate={{
                        x: [0, -10, 0],
                        y: [0, 12, 0],
                        opacity: [0.6, 0.9, 0.6],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            {/* ══════════════════════════════════════════════════
                LAYER 3 — SHADOW / DEPTH
                Internal + external shadows create the sense
                that the glass has physical thickness.
                ══════════════════════════════════════════════════ */}
            <div
                className={`pointer-events-none absolute inset-0 ${radiusMap[radius]}`}
                aria-hidden="true"
                style={{
                    boxShadow: tone === 'light'
                        ? `
                            0 1px 0 rgba(255,255,255,0.85) inset,
                            0 -1px 0 rgba(0,0,0,0.04) inset,
                            0 12px 40px -10px rgba(30,20,10,0.18),
                            0 4px 12px -4px rgba(30,20,10,0.08)
                        `
                        : `
                            0 1px 0 rgba(255,255,255,0.18) inset,
                            0 -1px 0 rgba(0,0,0,0.45) inset,
                            0 20px 50px -12px rgba(0,0,0,0.55),
                            0 6px 18px -6px rgba(0,0,0,0.35)
                        `,
                }}
            />

            {/* ══════════════════════════════════════════════════
                LAYER 4 — REFRACTION / 3D CHROMATIC EDGE
                Simulates the glass edge bending light.
                A thin chromatic ring + inner ring that shifts
                subtly on hover.
                ══════════════════════════════════════════════════ */}
            {refraction && (
                <div
                    className={`pointer-events-none absolute inset-0 ${radiusMap[radius]} transition-all duration-500 group-hover:scale-[1.015]`}
                    aria-hidden="true"
                    style={{
                        border: tone === 'light'
                            ? '1px solid rgba(255,255,255,0.55)'
                            : '1px solid rgba(255,255,255,0.10)',
                        boxShadow: tone === 'light'
                            ? 'inset 0 0 0 0.5px rgba(255,255,255,0.6), inset 0 1px 1px rgba(255,255,255,0.4)'
                            : 'inset 0 0 0 0.5px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.10)',
                    }}
                />
            )}

            {/* ══════════════════════════════════════════════════
                CONTENT
                ══════════════════════════════════════════════════ */}
            <div className="relative z-10 flex flex-col h-full">
                {Icon && (
                    <motion.div
                        className={`p-3 rounded-full mb-4 w-fit shadow-sm transform-gpu relative ${
                            tone === 'light'
                                ? 'bg-white/50 border border-white/60'
                                : 'bg-white/10 border border-white/15'
                        }`}
                        style={{
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            boxShadow: tone === 'light'
                                ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.06)'
                                : 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.35)',
                        }}
                        whileHover={{ scale: 1.08, rotate: 4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <Icon className={`${resolvedIconColor} text-2xl`} />
                    </motion.div>
                )}

                {title && (
                    <h3
                        id={safeTitleId}
                        className={`text-xl font-bold mb-1 ${palette.titleText} relative`}
                    >
                        {title}
                    </h3>
                )}

                {subtitle && (
                    <p className={`text-sm mb-2 ${mutedText} relative`}>{subtitle}</p>
                )}

                <div className={`flex-grow ${bodyText} relative`}>{children}</div>

                {cta && (
                    <div className="mt-4 relative">
                        {typeof cta === 'string' ? (
                            <motion.button
                                onClick={onClickCta}
                                className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-full hover:from-accent hover:to-primary transition-all duration-300 font-medium shadow-md"
                                whileHover={{ y: -2, scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cta}
                            </motion.button>
                        ) : (
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                {cta}
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Info badge */}
            {showInfoBadge && (
                <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center z-20 shadow-md"
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <FaInfoCircle className="w-3 h-3 text-white" />
                </motion.div>
            )}
        </Wrapper>
    );
};

export default GlassCard;
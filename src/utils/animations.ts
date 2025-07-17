import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const slideInFromLeft: Variants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const slideInFromRight: Variants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const scaleUp: Variants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0
        }
    }
};

export const bounceArrow: Variants = {
    animate: {
        y: [0, 10, 0],
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
        }
    }
};
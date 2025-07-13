import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const slideInFromLeft: Variants = {
    hidden: {
        x: -50,
        opacity: 0
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const slideInFromRight: Variants = {
    hidden: {
        x: 50,
        opacity: 0
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const scaleUp: Variants = {
    hidden: {
        scale: 0.95,
        opacity: 0
    },
    visible: {
        scale: 1,
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
            staggerChildren: 0.05,
            delayChildren: 0.1
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
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'main-gradient': 'linear-gradient(45deg, #5A7411, #EA580C, #A0C800)',
                'alt-gradient': 'linear-gradient(90deg, #A0C800, #E04E00, #5A7411)',
                'light-gradient': 'linear-gradient(45deg, #F5F5F5, #DEDAD4, #FFFFFF)',
                'cashew-gradient': 'linear-gradient(135deg, rgba(90, 116, 17, 0.08) 0%, rgba(160, 200, 0, 0.08) 50%, rgba(234, 88, 12, 0.08) 100%)',
                'sunrise-gradient': 'radial-gradient(ellipse at top right, rgba(253, 129, 4, 0.05), transparent 70%), radial-gradient(ellipse at bottom left, rgba(90, 116, 17, 0.05), transparent 70%)',
            },
            colors: {
                'primary': '#5A7411',
                'accent': '#E04E00',
                'dark-orange': '#9C3D10',// orange
                'secondary': '#A0C800',     // lime-green
                'background': '#F5F5F5',    // light-grey
                'text-dark': '#5A4D47',     // taupe
                'text-light': '#FFFFFF',    // white
                'warm-grey': '#DEDAD4',
                'highlight': 'rgba(253, 129, 4, 0.1)',
                'navy': '#253746',
                'teal': '#00869D',
                'olive': '#698714'
            },
            borderRadius: {
                'DEFAULT': '8px',
            },
            boxShadow: {
                // Enhanced glow variations
                'glow-accent-xs': '0 0 0 1px rgba(253, 129, 4, 0.2), 0 0 10px rgba(253, 129, 4, 0.3)',
                'glow-accent-sm': '0 0 0 1px rgba(253, 129, 4, 0.2), 0 0 15px rgba(253, 129, 4, 0.4)',
                'glow-accent': '0 0 0 1px rgba(253, 129, 4, 0.3), 0 0 20px rgba(253, 129, 4, 0.5)',
                'glow-accent-md': '0 0 0 1px rgba(253, 129, 4, 0.3), 0 0 25px rgba(253, 129, 4, 0.6)',
                'glow-accent-lg': '0 0 0 1px rgba(253, 129, 4, 0.4), 0 0 30px rgba(253, 129, 4, 0.7)',


                // Directional glows (more subtle)
                'brand-glow': '0 0 20px 6px rgba(234, 88, 12, 0.2)',
                'brand-glow-lg': '0 0 30px 10px rgba(234, 88, 12, 0.25)',

            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['"Playfair Display"', 'serif'],
                subhead: ['"Open Sans"', 'sans-serif'],
                accent: ['"Raleway"', 'sans-serif']
            },
            fontSize: {
                'display-2xl': ['4.5rem', {lineHeight: '1.1', fontWeight: '700'}],
                'display-xl': ['3.75rem', {lineHeight: '1.1', fontWeight: '700'}],
                'display-lg': ['3rem', {lineHeight: '1.15', fontWeight: '700'}],

                'h1': ['2.25rem', {lineHeight: '2.5rem', fontWeight: '700'}],
                'h2': ['1.875rem', {lineHeight: '2.25rem', fontWeight: '700'}],
                'h3': ['1.5rem', {lineHeight: '2rem', fontWeight: '700'}],
                'h4': ['1.25rem', {lineHeight: '1.75rem', fontWeight: '600'}],
                'subhead': ['1.125rem', {lineHeight: '1.75rem', fontWeight: '500'}],
                'body': ['1rem', {lineHeight: '1.5rem', fontWeight: '400'}],
                'small': ['0.875rem', {lineHeight: '1.25rem', fontWeight: '400'}]
            },
            spacing: {
                'section': '4rem',
                'section-sm': '3rem',
                'section-xs': '2rem',
                '128': '32rem'
            },
            zIndex: {
                '50': '50', // For navbar
            },
            animation: {
                highlight: 'highlight 1.5s ease',
                'gradient-shift': 'gradientShift 15s ease infinite alternate',
                'gradient-cycle': 'gradientCycle 30s ease infinite',
                'gradient-x': 'gradient-x-slow 15s ease infinite',
            },
            keyframes: {
                'gradient-x-slow': {
                    '0%, 100%': {'background-position': '0% 50%'},
                    '50%': {'background-position': '100% 50%'},
                },
                highlight: {
                    '0%': {backgroundColor: 'rgba(253, 129, 4, 0.2)'},
                    '100%': {backgroundColor: 'transparent'}
                },
                gradientShift: {
                    '0%': {'background-position': '0% 50%'},
                    '50%': {'background-position': '100% 50%'},
                    '100%': {'background-position': '0% 50%'},
                },
                gradientCycle: {
                    '0%': {
                        backgroundPosition: '0% 50%',
                        backgroundImage: 'linear-gradient(45deg, #5A7411, #EA580C, #A0C800)',
                    },
                    '25%': {
                        backgroundImage: 'linear-gradient(90deg, #A0C800, #E04E00, #5A7411)',
                    },
                    '50%': {
                        backgroundPosition: '100% 50%',
                        backgroundImage: 'linear-gradient(45deg, #5A7411, #EA580C, #A0C800)',
                    },
                    '75%': {
                        backgroundImage: 'linear-gradient(45deg, #F5F5F5, #DEDAD4, #FFFFFF)',
                    },
                    '100%': {
                        backgroundPosition: '0% 50%',
                        backgroundImage: 'linear-gradient(45deg, #5A7411, #EA580C, #A0C800)',
                    },
                },
            },
            plugins: [
                typography,
                forms,
                function ({addUtilities}: { addUtilities: any }) {
                    const newUtilities = {
                        '.scroll-smooth': {
                            scrollBehavior: 'smooth',
                        },
                        '.target-section': {
                            scrollMarginTop: '100px',
                        },
                    }
                    addUtilities(newUtilities)
                }
            ],
        }
    }
} satisfies Config
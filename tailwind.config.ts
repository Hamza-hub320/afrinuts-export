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
            colors: {
                'primary': '#5A7411',       // forest-green
                'accent': '#FD8104',        // orange
                'secondary': '#A0C800',     // lime-green
                'background': '#F5F5F5',    // light-grey
                'text-dark': '#6C5D56',     // taupe
                'text-light': '#FFFFFF',    // white
                'warm-grey': '#DEDAD4',
                'dark-orange': '#E67401',
                'highlight': 'rgba(253, 129, 4, 0.2)',
                'navy': '#253746',
                'teal': '#00869D',
                'olive': '#698714'
            },
            borderRadius: {
                DEFAULT: '8px'
            },
            boxShadow: {
                DEFAULT: '0 5px 15px rgba(0, 0, 0, 0.29)'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['"Playfair Display"', 'serif'],
                subhead: ['"Open Sans"', 'sans-serif'],
            },
            fontSize: {
                'display-2xl': ['4.5rem', { lineHeight: '1.1', fontWeight: '700' }],
                'display-xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '700' }],
                'display-lg': ['3rem', { lineHeight: '1.15', fontWeight: '700' }],

                'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
                'h2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
                'h3': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
                'h4': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
                'subhead': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '500' }],
                'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
                'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }]
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
                highlight: 'highlight 1.5s ease'
            },
            keyframes: {
                highlight: {
                    '0%': { backgroundColor: 'rgba(253, 129, 4, 0.2)' },
                    '100%': { backgroundColor: 'transparent' }
                }
            }
        },
    },
    plugins: [
        typography,
        forms,
        function({ addUtilities }: { addUtilities: any }) {
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
} satisfies Config
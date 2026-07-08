// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                ground: '#F2F1EC',
                panel: '#FDFCF9',
                hairline: '#DDDCD2',
                ink: {
                    DEFAULT: '#23281F',
                    2: '#4C523F',
                    3: '#5A6050',
                },
                accent: '#3E6B4F',
                inset: {
                    DEFAULT: '#14171A',
                    text: '#D9DEE6',
                    ok: '#86D9A8',
                    warn: '#E3B34F',
                    border: '#262B30',
                },
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    ...fontFamily.sans,
                ],
                display: [
                    'Avenir Next',
                    'Segoe UI',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'sans-serif',
                ],
                mono: [
                    'ui-monospace',
                    'SFMono-Regular',
                    'SF Mono',
                    'Menlo',
                    ...fontFamily.mono,
                ],
            },
        },
    },
    daisyui: {
        themes: false,
        base: false,
        logs: false,
    },
    plugins: [require('daisyui'), require('@tailwindcss/typography')],
}

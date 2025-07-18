import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: '/afrinuts-export/',
    plugins: [react()],
    server: {
        host: true,

    },
    assetsInclude: ['**/*.jpg', '**/*.JPG', '**/*.png', '**/*.svg'],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~': path.resolve(__dirname, './public')
        }
    },
    optimizeDeps: {
        include: [
            'tailwindcss',
            'autoprefixer'
        ]
    },
    css: {
        postcss: './postcss.config.cjs'
    },
    build: {
        outDir: 'dist',
        chunkSizeWarningLimit: 1000,
        assetsInlineLimit: 4096,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                '404': path.resolve(__dirname, 'public/404.html')
            },
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    leaflet: ['leaflet', 'react-leaflet'],
                    i18n: ['i18next', 'react-i18next'],
                    framer: ['framer-motion']
                },
                assetFileNames: 'assets/[name]-[hash][extname]',
                entryFileNames: 'assets/[name]-[hash].js'
            }
        }
    }
})
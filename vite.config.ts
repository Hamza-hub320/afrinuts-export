import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import {ViteImageOptimizer } from 'vite-plugin-image-optimizer';


const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: '/afrinuts-export/',
    plugins: [
        react(),
        viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 10240,
        }),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 10240,
        }),
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
        }),
        ViteImageOptimizer({
            jpg: {
                quality: 80,
            },
            png: {
                quality: 80,
            },
            webp: {
                quality: 80,
            },
        })
    ],
    server: {
        host: true,
    },
    assetsInclude: ['**/*.jpg', '**/*.JPG', '**/*.png', '**/*.svg', '**/*.webp'],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~': path.resolve(__dirname, './public')
        }
    },
    optimizeDeps: {
        include: [
            'tailwindcss',
            'autoprefixer',
            'react',
            'react-dom',
            'react-router-dom',
            'date-fns'
        ],
        exclude: ['js-big-decimal']
    },
    css: {
        postcss: './postcss.config.cjs',
        devSourcemap: false,
        modules: {
            localsConvention: 'camelCase'
        }
    },
    build: {
        outDir: 'dist',
        chunkSizeWarningLimit: 1500,
        assetsInlineLimit: 4096,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: false
            }
        },
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                '404': path.resolve(__dirname, 'public/404.html')
            },
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom'],
                    animations: ['framer-motion'],
                    maps: ['leaflet', 'react-leaflet'],
                    i18n: ['i18next', 'react-i18next'],
                    icons: ['react-icons/fa', 'react-icons/gi'],
                    vendor: ['lodash', 'date-fns']
                },
                assetFileNames: 'assets/[name]-[hash][extname]',
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js'
            }
        }
    },
})
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
        port: 5173
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
    }
})
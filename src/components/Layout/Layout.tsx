import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AccessibilityToolbar from '../AccessibilityToolbar/AccessibilityToolbar';
import { FC, useEffect } from 'react';
import Chatbot from '../Chatbot/Chatbot';

const Layout: FC = () => {
    // Preload critical images
    useEffect(() => {
        const images = [
            // Add your critical image paths here
            // '/src/assets/images/hero.webp',
            // '/src/assets/images/farm.webp'
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.loading = 'eager';
        });
    }, []);

    return (
        <>
            {/* Floating Accessibility Toolbar */}
            <div
                className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end space-y-3"
            >
                <AccessibilityToolbar />
            </div>
            <Navbar />
            <main>
                <Outlet />
            </main>

            <Footer className="mt-auto text-white" />

            <Chatbot />
        </>
    );
};

export default Layout;
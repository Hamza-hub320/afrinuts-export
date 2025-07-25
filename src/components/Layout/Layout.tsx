// src/components/Layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AccessibilityToolbar from '../AccessibilityToolbar/AccessibilityToolbar';
import { FC, useEffect } from 'react';

const Layout: FC = () => {
    useEffect(() => {
        // Preload critical images
        const images = [
            {/*/ '/src/assets/images/cashew-farm.webp',
            '/src/assets/images/ceo.webp',*/}
            // Add other critical images*
        ];

        images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.loading = 'eager'; // Force eager loading
        });
    }, []);

    return (
        <>
            <AccessibilityToolbar />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <footer className="mt-auto text-white">
                <Footer/>
                </footer>
        </>
    );
};


export default Layout;
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Farm from './pages/Farm';
import Contact from './pages/Contact';
import Sustainability from './pages/Sustainability';
import Vision from './pages/Vision';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './index.css';
import { ReactElement, useEffect } from 'react';
import React from 'react';

// Add this component to handle scroll restoration
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App(): ReactElement {
    return (
        <I18nextProvider i18n={i18n}>
            <div className="min-h-screen font-sans bg-[var(--background)] text-[var(--text-dark)]">
                <BrowserRouter basename='/afrinuts-export'>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<About />} />
                            <Route path="products" element={<Products />} />
                            <Route path="farm" element={<Farm />} />
                            <Route path="/sustainability" element={<Sustainability />} />
                            <Route path="/vision" element={<Vision />} />
                            <Route path="contact" element={<Contact />} />
                            {/* Add a catch-all route for 404s within the SPA */}
                            <Route path="*" element={<Home />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </I18nextProvider>
    );
}

export default App;
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Certifications from './pages/Certifications';
import Farm from './pages/Farm';
import Processing from './pages/Processing';
import FacilityFlowchart from './pages/FacilityFlowchart';
import Contact from './pages/Contact';
import Sustainability from './pages/Sustainability';
import Vision from './pages/Vision';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import News from './pages/News';
import ExecutiveTeam from './pages/ExecutiveTeam';
import OurStory from './pages/OurStory';
import { I18nextProvider } from 'react-i18next';
import TracePage from "./pages/Trace";
import Accessibility from '@/pages/Accessibility';
import i18n from './i18n';
import './index.css';
import { ReactElement, useEffect } from 'react';
import React from 'react';
import Faq from "@pages/Faq";

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
                <BrowserRouter basename='/'>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<About />} />
                            <Route path="products" element={<Products />} />
                            <Route path="certifications" element={<Certifications />} />
                            <Route path="farm" element={<Farm />} />
                            <Route path="/sustainability" element={<Sustainability />} />
                            <Route path="/vision" element={<Vision />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/cookie-policy" element={<CookiePolicy />} />
                            <Route path="/terms" element={<TermsOfService />} />
                            <Route path="/news" element={<News />} />
                            <Route path="/faq" element={<Faq />} />
                            <Route path="/executive-team" element={<ExecutiveTeam />} />
                            <Route path="/about/our-story" element={<OurStory />} />
                            <Route path="/trace" element={<TracePage />} />
                            <Route path="/processing" element={<Processing />} />
                            <Route path="/processing/facility-flowchart" element={<FacilityFlowchart />} />
                            <Route path="/accessibility" element={<Accessibility />} />
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
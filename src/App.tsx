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
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BlockMap from './pages/BlockMap';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Tasks from './pages/Tasks';
import Financials from './pages/Financials';
import InvestorPortal from './pages/InvestorPortal';
import i18n from './i18n';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { ReactElement, useEffect } from 'react';
import React from 'react';
import Faq from "@pages/Faq";
import AccessibilityToolbar from './components/AccessibilityToolbar/AccessibilityToolbar';
import NewsPost from '@/pages/NewsPost';


// Scroll restoration component
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
            <AuthProvider>
                <div className="min-h-screen font-sans bg-[var(--background)] text-[var(--text-dark)]">
                    <BrowserRouter basename='/'>
                        <ScrollToTop />
                        {/* Global Accessibility Toolbar - OUTSIDE Routes */}
                        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end space-y-3">
                            <AccessibilityToolbar />
                        </div>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                {/* Public Routes */}
                                <Route index element={<Home />} />
                                <Route path="about" element={<About />} />
                                <Route path="products" element={<Products />} />
                                <Route path="certifications" element={<Certifications />} />
                                <Route path="farm" element={<Farm />} />
                                <Route path="sustainability" element={<Sustainability />} />
                                <Route path="vision" element={<Vision />} />
                                <Route path="contact" element={<Contact />} />
                                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                                <Route path="cookie-policy" element={<CookiePolicy />} />
                                <Route path="terms" element={<TermsOfService />} />
                                <Route path="news" element={<News />} />
                                <Route path="faq" element={<Faq />} />
                                <Route path="executive-team" element={<ExecutiveTeam />} />
                                <Route path="about/our-story" element={<OurStory />} />
                                <Route path="trace" element={<TracePage />} />
                                <Route path="processing" element={<Processing />} />
                                <Route path="processing/facility-flowchart" element={<FacilityFlowchart />} />
                                <Route path="accessibility" element={<Accessibility />} />
                                <Route path="/blog" element={<Blog />} />
                                <Route path="/blog/:slug" element={<BlogPost />} />
                                <Route path="/news/:slug" element={<NewsPost />} />

                                {/* Auth Routes */}
                                <Route path="login" element={<Login />} />
                            </Route>

                                {/* Protected Routes */}
                                <Route
                                    path="dashboard"
                                    element={
                                        <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVESTOR']}>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="dashboard/blocks"
                                    element={
                                        <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                                            <BlockMap />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="dashboard/tasks"
                                    element={
                                        <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                                            <Tasks />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="dashboard/financials"
                                    element={
                                        <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVESTOR']}>
                                            <Financials />
                                        </ProtectedRoute>
                                    }
                                />

                            <Route
                                path="investor"
                                element={
                                    <ProtectedRoute allowedRoles={['INVESTOR', 'OWNER', 'MANAGER']}>
                                        <InvestorPortal />
                                    </ProtectedRoute>
                                }
                            />

                            {/* 404 Catch-all */}
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </AuthProvider>
        </I18nextProvider>
    );
}

export default App;
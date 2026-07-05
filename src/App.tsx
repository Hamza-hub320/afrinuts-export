import React, { Suspense, ReactElement, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { initAnalytics } from './utils/analytics';
import Layout from './components/Layout/Layout';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AccessibilityToolbar from './components/AccessibilityToolbar/AccessibilityToolbar';
import FeedbackButton from './components/FeedbackButton/FeedbackButton';

import i18n from './i18n';
import './index.css';

// Direct imports (lightweight, visited often)
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import News from './pages/News';
import Faq from "@pages/Faq";
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import NewsPost from '@/pages/NewsPost';

// Lazy load heavy pages
const Community = React.lazy(() => import('@/pages/Community'));
const FarmOS = React.lazy(() => import('@/pages/FarmOS'));
const Partners = React.lazy(() => import('@/pages/Partners'));
const Wholesale = React.lazy(() => import('@/pages/Wholesale'));
const Invest = React.lazy(() => import('@/pages/Invest'));
const Products = React.lazy(() => import('./pages/Products'));
const Certifications = React.lazy(() => import('./pages/Certifications'));
const Farm = React.lazy(() => import('./pages/Farm'));
const Processing = React.lazy(() => import('./pages/Processing'));
const FacilityFlowchart = React.lazy(() => import('./pages/FacilityFlowchart'));
const Sustainability = React.lazy(() => import('./pages/Sustainability'));
const Vision = React.lazy(() => import('./pages/Vision'));
const ExecutiveTeam = React.lazy(() => import('./pages/ExecutiveTeam'));
const OurStory = React.lazy(() => import('./pages/OurStory'));
const TracePage = React.lazy(() => import("./pages/Trace"));
const Accessibility = React.lazy(() => import('@/pages/Accessibility'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const BlockMap = React.lazy(() => import('./pages/BlockMap'));
const Tasks = React.lazy(() => import('./pages/Tasks'));
const Financials = React.lazy(() => import('./pages/Financials'));
const InvestorPortal = React.lazy(() => import('./pages/InvestorPortal'));
const SupplierManagement = React.lazy(() => import('./pages/SupplierManagement'));

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

function App(): ReactElement {
    useEffect(() => {
        initAnalytics();
    }, []);
    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <div className="min-h-screen font-sans bg-[var(--background)] text-[var(--text-dark)]">
                    <BrowserRouter basename='/'>
                        <ScrollToTop />
                        <div className="fixed right-0 top-[30%] z-[9999] flex flex-col">
                            <AccessibilityToolbar />
                            <FeedbackButton />
                        </div>
                        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end space-y-3">
                            <AccessibilityToolbar />
                        </div>
                        <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                <Route path="/" element={<Layout />}>
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
                                    <Route path="blog" element={<Blog />} />
                                    <Route path="blog/:slug" element={<BlogPost />} />
                                    <Route path="news/:slug" element={<NewsPost />} />
                                    <Route path="login" element={<Login />} />
                                    <Route path="invest" element={<Invest />} />
                                    <Route path="wholesale" element={<Wholesale />} />
                                    <Route path="partners" element={<Partners />} />
                                    <Route path="community" element={<Community />} />
                                </Route>

                                <Route path="dashboard" element={
                                    <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVESTOR']}>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="dashboard/blocks" element={
                                    <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                                        <BlockMap />
                                    </ProtectedRoute>
                                } />
                                <Route path="dashboard/tasks" element={
                                    <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                                        <Tasks />
                                    </ProtectedRoute>
                                } />
                                <Route path="dashboard/financials" element={
                                    <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVESTOR']}>
                                        <Financials />
                                    </ProtectedRoute>
                                } />
                                <Route path="investor" element={
                                    <ProtectedRoute allowedRoles={['INVESTOR', 'OWNER', 'MANAGER']}>
                                        <InvestorPortal />
                                    </ProtectedRoute>
                                } />
                                <Route path="farm-os" element={
                                    <ProtectedRoute allowedRoles={['INVESTOR', 'OWNER', 'MANAGER']}>
                                        <FarmOS />
                                    </ProtectedRoute>
                                } />
                                <Route
                                    path="dashboard/suppliers"
                                    element={
                                        <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                                            <SupplierManagement />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<Home />} />
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </div>
            </AuthProvider>
        </I18nextProvider>
    );
}

export default App;
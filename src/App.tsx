import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Farm from './pages/Farm';
import Contact from './pages/Contact';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './index.css';
import { ReactElement } from 'react';
import React from 'react'


function App(): ReactElement {
    return (
        <I18nextProvider i18n={i18n}>
            <div className="min-h-screen font-sans bg-[var(--background)] text-[var(--text-dark)]">
                <BrowserRouter basename='/afrinuts-export'>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<About />} />
                            <Route path="products" element={<Products />} />
                            <Route path="farm" element={<Farm />} />
                            <Route path="contact" element={<Contact />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </I18nextProvider>
    );
}

export default App;
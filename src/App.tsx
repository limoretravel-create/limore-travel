import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Cars from './pages/Cars';
import CarRent from './pages/CarRent';
import Contact from './pages/Contact';
import CMS from './pages/CMS';
import About from './pages/About';
import { trackPageView } from './utils/analytics';
import { useTranslation } from 'react-i18next';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set RTL for Arabic and language attribute
    const lang = i18n.language;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id/rent" element={<CarRent />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/cms" element={<CMS />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;


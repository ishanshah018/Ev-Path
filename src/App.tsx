import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { EVProvider } from './contexts/EVContext';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import TripPlannerPage from './pages/TripPlannerPage';
import ManageEVsPage from './pages/ManageEVsPage';
import SettingsPage from './pages/SettingsPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import BlogsPage from './pages/BlogsPage';
import CommunityPage from './pages/CommunityPage';
import ChatbotPage from './pages/ChatbotPage';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main className={`${isMobile ? 'pb-16' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/blogs" element={
              <ProtectedRoute>
                <BlogsPage />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            } />
            <Route path="/trip-planner" element={
              <ProtectedRoute>
                <TripPlannerPage />
              </ProtectedRoute>
            } />
            <Route path="/my-evs" element={
              <ProtectedRoute>
                <ManageEVsPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        {isMobile && <MobileNav />}
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EVProvider>
          <AppContent />
        </EVProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
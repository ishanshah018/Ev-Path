import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EVProvider } from './contexts/EVContext';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import OnboardingPage from './pages/Onboarding';
import DashboardPage from './pages/Dashboard';
import MapPage from './pages/Map';
import TripPlannerPage from './pages/TripPlanner';
import ManageEVsPage from './pages/ManageEV';
import SettingsPage from './pages/Settings';
import FeaturesPage from './pages/Features';
import PricingPage from './pages/PricingPage';
import BlogsPage from './pages/Blogs';
import CommunityPage from './pages/Community';
import ChatbotPage from './pages/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

// This component contains the main routing logic for the application.
function AppContent() {
  // Get the current user from the AuthContext.
  const { user: _user } = useAuth();
  // State to check if the screen size is mobile.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check the window width and update the state.
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check and event listener for window resizing.
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Cleanup function to remove the event listener.
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
            <Route path="/trip-planner" element={<TripPlannerPage />} />
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

// The main App component that provides all the necessary contexts.
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

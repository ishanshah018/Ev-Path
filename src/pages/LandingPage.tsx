import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ChevronRight, MapPin, Route, Battery, DollarSign, Zap, Leaf, Shield, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect logged-in users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-emerald-600" />,
      title: "Charging Station Finder",
      description: "Find nearby charging stations with real-time availability, pricing, and plug compatibility."
    },
    {
      icon: <Route className="h-8 w-8 text-emerald-600" />,
      title: "Smart Route Planner",
      description: "Plan optimal routes with charging stops, considering your EV's range and charging needs."
    },
    {
      icon: <Battery className="h-8 w-8 text-emerald-600" />,
      title: "Battery Analytics",
      description: "Monitor battery health, performance, and get predictions for optimal charging patterns."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-emerald-600" />,
      title: "Cost Estimator",
      description: "Calculate trip costs, compare charging options, and track your savings vs. gas vehicles."
    }
  ];

  const stats = [
    { value: "50,000+", label: "Charging Stations" },
    { value: "25,000+", label: "Happy EV Owners" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Your Journey to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                {' '}Sustainable Driving
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
              Discover charging stations, plan smart routes, and optimize your electric vehicle experience 
              with EvPath - the comprehensive EV companion for modern drivers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={user ? "/dashboard" : "/pricing"}
                className="group px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide"
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ChevronRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl tracking-wide"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Everything You Need for EV Life
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
              From finding the perfect charging station to optimizing your battery performance, 
              EvPath provides all the tools you need for seamless electric driving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-emerald-100 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Why Choose EvPath?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                Real-time data updates ensure you always have the most current information about charging stations.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                Eco-Friendly
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                Optimize your routes to minimize energy consumption and maximize your environmental impact.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                Your data is protected with enterprise-grade security, and our platform is built for reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Ready to Start Your EV Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed">
            Join thousands of EV owners who trust EvPath for their daily charging and route planning needs.
          </p>
          <Link
            to={user ? "/dashboard" : "/pricing"}
            className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide"
          >
            {user ? "Go to Dashboard" : "Get Started for Free"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-8 w-8 text-emerald-600" />
                <span className="text-xl font-bold tracking-tight">EvPath</span>
              </div>
              <p className="text-gray-400 mb-4 font-medium leading-relaxed">
                The ultimate companion for electric vehicle owners. Find charging stations, 
                plan routes, and optimize your EV experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p className="font-medium">&copy; 2024 EvPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
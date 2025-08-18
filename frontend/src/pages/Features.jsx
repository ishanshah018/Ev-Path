import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
MapPin, Route, Battery, IndianRupee, Smartphone, Shield, 
Zap, TrendingUp, Users, Clock, Star, ArrowRight,
CheckCircle, BarChart3, Navigation, Globe, MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// This is the functional component for the Features page.
const Features = () => {
// Get the user object from the authentication context.
const { user } = useAuth();

// If a user is logged in, redirect them to the dashboard.
if (user) {
return <Navigate to="/dashboard" replace />;
}

// Define an array of objects for the main features.
const mainFeatures = [
{
    icon: <MapPin className="h-12 w-12 text-emerald-600" />,
    title: "Charging Station Finder",
    description: "Find nearby charging stations with real-time availability, pricing, and plug compatibility. Our extensive database covers 50,000+ stations worldwide.",
    features: [
    "Real-time availability updates",
    "Pricing comparison across networks",
    "Plug compatibility checking",
    "User reviews and ratings",
    "Filter by charging speed"
    ],
    image: "https://i.postimg.cc/MZYM2f0Z/cost-of-ev-charging-station.jpg",
    imageAlt: "Clean illustration of white electric vehicle charging at EV station with green charging cable",
    imagePosition: "right"
},
{
    icon: <Route className="h-12 w-12 text-emerald-600" />,
    title: "Intelligent Route Planning",
    description: "Plan optimal routes with charging stops, considering your EV's range, charging needs, and real-time traffic conditions.",
    features: [
    "Multi-stop route optimization",
    "Battery range calculations",
    "Traffic-aware routing",
    "Alternative route suggestions",
    "Weather impact analysis"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    imageAlt: "Car dashboard with GPS navigation showing intelligent route planning",
    imagePosition: "left"
},
{
    icon: <MessageCircle className="h-12 w-12 text-emerald-600" />,
    title: "AI-Powered Chatbot Assistant",
    description: "Get instant help with EV-related questions, charging recommendations, and personalized assistance 24/7.",
    features: [
    "24/7 instant support",
    "EV-specific knowledge base",
    "Personalized recommendations",
    "Charging station guidance",
    "Trip planning assistance"
    ],
    image: "https://i.postimg.cc/sDYR055K/robot-chat-bot-concept-illustration-vector.jpg",
    imageAlt: "Robot chatbot concept illustration showing AI assistant for customer support",
    imagePosition: "right"
},
{
    icon: <IndianRupee className="h-12 w-12 text-emerald-600" />,
    title: "Cost Management & Savings",
    description: "Track charging costs, compare pricing options, and calculate your savings compared to traditional vehicles.",
    features: [
    "Detailed cost breakdown",
    "Savings vs. gas vehicles",
    "Charging network comparison",
    "Budget planning tools",
    "Tax incentive tracking"
    ],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    imageAlt: "Financial dashboard showing cost savings and analytics",
    imagePosition: "left"
}
];

// Define an array of objects for additional features.
const additionalFeatures = [
{
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: "Secure & Private",
    description: "End-to-end encryption and privacy-first approach to protect your data."
},
{
    icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into your driving patterns and energy consumption."
},
{
    icon: <Navigation className="h-8 w-8 text-blue-600" />,
    title: "Offline Maps",
    description: "Download maps for offline use when you're in areas with poor connectivity."
},
{
    icon: <Users className="h-8 w-8 text-pink-600" />,
    title: "Community Features",
    description: "Connect with other EV owners, share tips, and review charging stations."
},
{
    icon: <Globe className="h-8 w-8 text-indigo-600" />,
    title: "Global Coverage",
    description: "Support for charging networks across North America, Europe, and Asia."
}
];

// Define an array of objects for pricing plans.
const plans = [
{
    name: "Free",
    price: "Free",
    description: "Perfect for occasional EV users",
    features: [
    "Find nearby charging stations",
    "Access to Blogs Section"
    ]
},
{
    name: "Pro",
    price: "₹149/month",
    description: "For regular EV drivers",
    features: [
    "Access to all Free plan features",
    "Advanced Route Planning",
    "Community access"
    ],
    popular: true
},
{
    name: "Super",
    price: "₹299/month",
    description: "For power users",
    features: [
    "Access to all Free,Pro plan features",
    "Chatbot access",
    "Offline maps"
    ]
}
];

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Hero Section */}
    <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful Features for
            <span className="block">Modern EV Life</span>
        </h1>
        <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Everything you need to make electric driving effortless, efficient, and enjoyable.
        </p>
        </div>
    </div>
    </section>

    {/* Main Features */}
    <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Core Features
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
            Comprehensive tools designed specifically for electric vehicle owners
        </p>
        </div>

        <div className="space-y-20">
        {mainFeatures.map((feature, index) => (
            <div key={index} className={`flex flex-col ${feature.imagePosition === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
            <div className="flex-1">
                <div className="mb-6">
                {feature.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {feature.description}
                </p>
                <ul className="space-y-3">
                {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                ))}
                </ul>
            </div>
            <div className="flex-1">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img 
                    src={feature.image} 
                    alt={feature.imageAlt}
                    className="w-full h-80 object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent"></div>
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* Additional Features Grid */}
    <section className="py-20 bg-white dark:bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            And Much More
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
            Additional features that make EvPath the complete EV companion
        </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {additionalFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
                {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
            </p>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* Stats Section */}
    <section className="py-20 bg-emerald-600 dark:bg-emerald-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by EV Owners Worldwide
        </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
            <div className="text-emerald-100">Charging Stations</div>
        </div>
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">25K+</div>
            <div className="text-emerald-100">Active Users</div>
        </div>
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">1M+</div>
            <div className="text-emerald-100">Routes Planned</div>
        </div>
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
            <div className="text-emerald-100">Uptime</div>
        </div>
        </div>
    </div>
    </section>

    {/* Pricing Section */}
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
            Start free, upgrade when you need more features
        </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
            <div key={index} className="rounded-xl p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border-2 border-transparent hover:border-emerald-500 transition-all duration-300">
            {plan.popular && (
                <div className="text-center mb-4">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                </span>
                </div>
            )}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-2">{plan.price}</div>
                <p className="text-gray-600 dark:text-gray-400">
                {plan.description}
                </p>
            </div>
            <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                    </span>
                </li>
                ))}
            </ul>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 bg-white dark:bg-gray-800">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Ready to Transform Your EV Experience?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Join thousands of EV owners who have already made the switch to smarter electric driving.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
            to={user ? "/dashboard" : "/signup"}
            className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
            {user ? "Go to Dashboard" : "Start Free Trial"}
            <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        </div>
    </div>
    </section>
</div>
);
};

export default Features;

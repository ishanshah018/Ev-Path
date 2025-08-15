import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Zap, Users, MessageCircle, Map } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// This is the functional component for the Pricing page.
const PricingPage = () => {
// Get the user object from the authentication context.
const { user: _user } = useAuth();

// Define an array of objects for the pricing plans.
const plans = [
{
    name: "Free",
    price: "Free",
    description: "Perfect for occasional EV users",
    features: [
    "Find nearby charging stations",
    "Access to Blogs Section"
    ],
    icon: <Zap className="h-8 w-8 text-emerald-600" />,
    popular: false
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
    icon: <Users className="h-8 w-8 text-blue-600" />,
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
    ],
    icon: <MessageCircle className="h-8 w-8 text-purple-600" />,
    popular: false
}
];

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Hero Section */}
    <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Plan
        </h1>
        <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Start free, upgrade when you need more features
        </p>
        </div>
    </div>
    </section>

    {/* Pricing Plans */}
    <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
            <div key={index} className={`rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group ${
            plan.popular 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border-2 border-emerald-500' 
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border-2 border-transparent hover:border-emerald-500'
            }`}>
            {plan.popular && (
                <div className="text-center mb-4">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                </span>
                </div>
            )}
            
            <div className="text-center mb-6">
                <div className="mb-4">
                {plan.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-2">{plan.price}</div>
                <p className="text-gray-600 dark:text-gray-400">
                {plan.description}
                </p>
            </div>
            
            <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                    </span>
                </li>
                ))}
            </ul>
            
            <Link
                to="/signup"
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-center block bg-emerald-600 text-white hover:bg-emerald-700 group-hover:bg-emerald-700 transform group-hover:scale-105"
            >
                Get Started
            </Link>
            </div>
        ))}
        </div>
    </div>
    </section>


</div>
);
};

export default PricingPage;

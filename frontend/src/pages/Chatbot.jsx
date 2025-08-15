import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, MapPin, Route, Battery, Clock, Lightbulb } from 'lucide-react';

const Chatbot = () => {
const [messages, setMessages] = useState([
{
    id: '1',
    type: 'bot',
    content:
    "Hi! I'm your EV Assistant. I can help you with charging stations, route planning, EV recommendations, and answer any questions about electric vehicles. How can I assist you today?",
    timestamp: new Date(),
},
]);
const [inputMessage, setInputMessage] = useState('');
const [isTyping, setIsTyping] = useState(false);
const messagesEndRef = useRef(null);

const quickQuestions = [
{
    icon: <MapPin className="h-4 w-4" />,
    text: 'Find charging stations near me',
    query: 'Find charging stations near me',
},
{
    icon: <Route className="h-4 w-4" />,
    text: 'Plan a trip route',
    query: 'Help me plan a trip from Delhi to Mumbai',
},
{
    icon: <Battery className="h-4 w-4" />,
    text: 'Battery maintenance tips',
    query: 'How can I maintain my EV battery health?',
},
{
    icon: <Zap className="h-4 w-4" />,
    text: 'Charging speed comparison',
    query: "What's the difference between fast and standard charging?",
},
];

const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

useEffect(() => {
scrollToBottom();
}, [messages]);

const generateBotResponse = (userMessage) => {
const message = userMessage.toLowerCase();

if (message.includes('charging station') || message.includes('charger')) {
    return "I can help you find charging stations! Based on your location, here are some nearby options:\n\n🔋 Green Energy Hub - 2.1 km away\n⚡ Fast charging available\n💰 ₹8.5/kWh\n⭐ 4.5 rating\n\n🔋 City Center Station - 3.5 km away\n⚡ Standard charging\n💰 ₹6.2/kWh\n⭐ 4.2 rating\n\nWould you like directions to any of these stations?";
}

if (message.includes('trip') || message.includes('route') || message.includes('plan')) {
    return "I'd be happy to help you plan your EV trip! For a Delhi to Mumbai route, here's what I recommend:\n\n📍 Distance: ~1,400 km\n⏱️ Estimated time: 18-20 hours (including charging stops)\n🔋 Recommended charging stops:\n\n1. Gurgaon Highway Hub (120 km)\n2. Jaipur Express Station (280 km)\n3. Udaipur Charging Plaza (650 km)\n4. Surat Fast Charge (1,100 km)\n\nWould you like detailed information about any of these stops?";
}

if (message.includes('battery') || message.includes('maintenance')) {
    return "Great question! Here are my top battery maintenance tips:\n\n🔋 **Optimal Charging:**\n• Keep battery between 20-80% for daily use\n• Avoid frequent 100% charges\n• Use slow charging when possible\n\n🌡️ **Temperature Care:**\n• Park in shade during hot weather\n• Pre-condition battery in extreme temperatures\n\n⚡ **Charging Habits:**\n• Don't let battery drop below 10%\n• Charge regularly, don't wait for empty\n• Use manufacturer-recommended chargers\n\nFollowing these tips can extend your battery life by 20-30%!";
}

if (message.includes('fast charging') || message.includes('charging speed')) {
    return "Here's the breakdown of charging speeds:\n\n⚡ **Fast Charging (DC):**\n• 50-150 kW power\n• 10-80% in 30-45 minutes\n• Higher cost (₹8-12/kWh)\n• Best for long trips\n\n🔌 **Standard Charging (AC):**\n• 3-22 kW power\n• 4-8 hours for full charge\n• Lower cost (₹5-8/kWh)\n• Ideal for overnight charging\n\n🏠 **Home Charging:**\n• 3-7 kW power\n• 6-12 hours for full charge\n• Cheapest option (₹3-6/kWh)\n• Most convenient for daily use\n\nChoose based on your time and budget needs!";
}

if (message.includes('recommend') || message.includes('which ev') || message.includes('buy')) {
    return "I'd love to help you choose the right EV! Here are some popular options in India:\n\n🚗 **4-Wheeler EVs:**\n• Tata Nexon EV - ₹14-18 lakhs, 312 km range\n• MG ZS EV - ₹21-25 lakhs, 419 km range\n• Hyundai Kona - ₹23-24 lakhs, 452 km range\n\n🛵 **2-Wheeler EVs:**\n• Ather 450X - ₹1.3 lakhs, 146 km range\n• Ola S1 Pro - ₹1.4 lakhs, 181 km range\n• TVS iQube - ₹1.2 lakhs, 140 km range\n\nWhat's your budget and daily driving needs? I can give more specific recommendations!";
}

if (message.includes('cost') || message.includes('price') || message.includes('expensive')) {
    return "EV costs vary, but here's a general breakdown:\n\n💰 **Running Costs:**\n• Electricity: ₹1-3 per km\n• Petrol equivalent: ₹8-12 per km\n• Annual savings: ₹50,000-1,50,000\n\n🔧 **Maintenance:**\n• 40-60% lower than petrol cars\n• No oil changes, fewer moving parts\n• Brake pads last longer (regenerative braking)\n\n⚡ **Charging Costs:**\n• Home: ₹3-6 per kWh\n• Public AC: ₹6-8 per kWh\n• Public DC: ₹8-12 per kWh\n\nEVs typically pay for themselves in 3-5 years through fuel savings!";
}

return "I'm here to help with all your EV questions! I can assist with:\n\n🔍 Finding charging stations\n🗺️ Route planning for trips\n🔋 Battery care and maintenance\n🚗 EV recommendations and comparisons\n💰 Cost analysis and savings\n⚡ Charging options and speeds\n\nWhat would you like to know more about?";
};

const handleSendMessage = (messageText) => {
const textToSend = messageText || inputMessage.trim();
if (!textToSend) return;

const userMessage = {
    id: Date.now().toString(),
    type: 'user',
    content: textToSend,
    timestamp: new Date(),
};

setMessages((prev) => [...prev, userMessage]);
setInputMessage('');
setIsTyping(true);

setTimeout(() => {
    const botResponse = {
    id: (Date.now() + 1).toString(),
    type: 'bot',
    content: generateBotResponse(textToSend),
    timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
}, 1500);
};

const handleKeyPress = (e) => {
if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
}
};

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
            <Bot className="h-8 w-8 text-emerald-600" />
        </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        EV Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
        Your 24/7 electric vehicle companion
        </p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
            <div
            key={message.id}
            className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
            >
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
            >
                {message.type === 'user' ? (
                <User className="h-4 w-4" />
                ) : (
                <Bot className="h-4 w-4" />
                )}
            </div>

            <div
                className={`flex-1 max-w-xs sm:max-w-md ${
                message.type === 'user' ? 'text-right' : ''
                }`}
            >
                <div
                className={`inline-block p-3 rounded-lg ${
                    message.type === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
                >
                <p className="whitespace-pre-line text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
                </p>
            </div>
            </div>
        ))}

        {isTyping && (
            <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                ></div>
                </div>
            </div>
            </div>
        )}

        <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Quick questions to get started:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
                <button
                key={index}
                onClick={() => handleSendMessage(question.query)}
                className="flex items-center space-x-2 p-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                {question.icon}
                <span>{question.text}</span>
                </button>
            ))}
            </div>
        </div>
        )}

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
            <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about EVs..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            disabled={isTyping}
            />
            <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            <Send className="h-4 w-4" />
            </button>
        </div>
        </div>
    </div>
    </div>
</div>
);
};

export default Chatbot;
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, Battery, MapPin, Calculator, MessageCircle, X, RotateCcw, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();

  // EV-focused quick questions
  const quickQuestions = [
    {
      icon: Zap,
      text: "What are the benefits of electric vehicles?",
      category: "Benefits"
    },
    {
      icon: MapPin,
      text: "How do I find charging stations near me?",
      category: "Charging"
    },
    {
      icon: Calculator,
      text: "What's the cost difference between EV and petrol?",
      category: "Cost"
    },
    {
      icon: Battery,
      text: "How long does EV charging take?",
      category: "Charging"
    },
    {
      icon: Sparkles,
      text: "What's the range of modern EVs?",
      category: "Range"
    },
    {
      icon: Bot,
      text: "How to plan an EV road trip?",
      category: "Planning"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          content: data.response,
          role: 'assistant',
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);
        setConversationId(data.conversation_id);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          content: `Sorry, I encountered an error: ${data.error || 'Unknown error'}`,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I\'m having trouble connecting. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-xl">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  EV-PATH Assistant
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your expert guide to electric vehicles
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border overflow-hidden`}>
              {/* Chat Messages */}
              <div className="h-[70vh] overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-emerald-100 to-blue-100'} p-8 rounded-3xl w-24 h-24 mx-auto mb-6 flex items-center justify-center`}>
                      <Bot className={`h-12 w-12 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Welcome to EV-PATH Assistant! 🚗⚡
                    </h3>
                    <p className={`mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      I'm your expert guide for everything electric vehicles. Ask me about EV technology, 
                      charging, costs, trip planning, and more!
                    </p>
                    
                    {/* Quick Questions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                      {quickQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question.text)}
                          className={`text-left p-4 rounded-xl transition-all duration-300 group ${
                            darkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-emerald-500' 
                              : 'bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 p-2 rounded-lg ${
                              darkMode ? 'bg-gray-600' : 'bg-white'
                            }`}>
                              <question.icon className={`h-5 w-5 ${
                                darkMode ? 'text-emerald-400' : 'text-emerald-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <span className={`text-sm font-medium ${
                                darkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                              }`}>
                                {question.text}
                              </span>
                              <p className={`text-xs mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {question.category}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                            : message.isError
                            ? `${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} border text-red-800`
                            : darkMode 
                              ? 'bg-gray-700 text-gray-100' 
                              : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.role === 'assistant' && (
                            <div className={`flex-shrink-0 p-1.5 rounded-full ${
                              darkMode ? 'bg-gray-600' : 'bg-white'
                            }`}>
                              <Bot className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <p className={`text-xs mt-3 ${
                              message.role === 'user' ? 'text-emerald-100' : darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 p-1.5 rounded-full ${
                          darkMode ? 'bg-gray-600' : 'bg-white'
                        }`}>
                          <Bot className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <div className="flex space-x-1">
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                          }`}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                          }`} style={{animationDelay: '0.1s'}}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                          }`} style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-6`}>
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me about electric vehicles..."
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <MessageCircle className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`lg:col-span-1 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <Sparkles className="h-4 w-4 mr-2 text-emerald-500" />
                  Quick Actions
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={clearChat}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'bg-red-900/50 hover:bg-red-800/50 border border-red-700 hover:border-red-600' 
                      : 'bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-4 w-4 text-red-500" />
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-red-300' : 'text-red-700'
                    }`}>
                      Clear Chat
                    </span>
                  </div>
                </button>
                
                {conversationId && (
                  <div className={`p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Conversation ID
                    </p>
                    <p className={`text-xs font-mono ${
                      darkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>
                      {conversationId}
                    </p>
                  </div>
                )}
              </div>

              {/* EV Topics */}
              <div className="mt-8">
                <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Popular EV Topics
                </h4>
                <div className="space-y-3">
                  {[
                    { icon: Battery, text: "Battery Technology", color: "purple" },
                    { icon: MapPin, text: "Charging Infrastructure", color: "blue" },
                    { icon: Calculator, text: "Cost Analysis", color: "emerald" },
                    { icon: Zap, text: "Performance & Range", color: "yellow" },
                    { icon: Bot, text: "Trip Planning", color: "teal" }
                  ].map((topic, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-colors cursor-pointer ${
                        darkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-100'
                      }`}>
                        <topic.icon className={`h-4 w-4 text-${topic.color}-500`} />
                      </div>
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {topic.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
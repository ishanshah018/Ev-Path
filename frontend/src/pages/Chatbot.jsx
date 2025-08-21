import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, Battery, MapPin, Calculator } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // EV-focused quick questions
  const quickQuestions = [
    "What are the benefits of electric vehicles?",
    "How do I find charging stations near me?",
    "What's the cost difference between EV and petrol?",
    "How long does EV charging take?",
    "What's the range of modern EVs?",
    "How to plan an EV road trip?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on component mount
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EV-PATH Assistant</h1>
                <p className="text-sm text-gray-600">Your expert guide to electric vehicles</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
              {/* Chat Messages */}
              <div className="h-[600px] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Bot className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Welcome to EV-PATH Assistant! 🚗⚡
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      I'm your expert guide for everything electric vehicles. Ask me about EV technology, 
                      charging, costs, trip planning, and more!
                    </p>
                    
                    {/* Quick Questions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {quickQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question)}
                          className="text-left p-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-all duration-200 group"
                        >
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0 mt-0.5">
                              {index === 0 && <Zap className="h-4 w-4 text-yellow-500" />}
                              {index === 1 && <MapPin className="h-4 w-4 text-blue-500" />}
                              {index === 2 && <Calculator className="h-4 w-4 text-green-500" />}
                              {index === 3 && <Battery className="h-4 w-4 text-purple-500" />}
                              {index === 4 && <Sparkles className="h-4 w-4 text-indigo-500" />}
                              {index === 5 && <Bot className="h-4 w-4 text-teal-500" />}
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                              {question}
                            </span>
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
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                            : message.isError
                            ? 'bg-red-50 border border-red-200 text-red-800'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <p className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-green-100' : 'text-gray-500'
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
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5 text-green-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t bg-gray-50 p-4">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me about electric vehicles..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={clearChat}
                  className="w-full text-left p-3 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700">Clear Chat</span>
                  </div>
                </button>
                
                {conversationId && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Conversation ID</p>
                    <p className="text-xs font-mono text-gray-800">{conversationId}</p>
                  </div>
                )}
              </div>

              {/* EV Topics */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Popular EV Topics</h4>
                <div className="space-y-2">
                  {[
                    { icon: Battery, text: "Battery Technology", color: "purple" },
                    { icon: MapPin, text: "Charging Infrastructure", color: "blue" },
                    { icon: Calculator, text: "Cost Analysis", color: "green" },
                    { icon: Zap, text: "Performance & Range", color: "yellow" },
                    { icon: Bot, text: "Trip Planning", color: "teal" }
                  ].map((topic, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <topic.icon className={`h-4 w-4 text-${topic.color}-500`} />
                      <span className="text-sm text-gray-700">{topic.text}</span>
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
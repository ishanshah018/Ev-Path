import React, { useState } from 'react';
import { Users, MessageCircle, ThumbsUp, Share2, Plus, Search, Filter, TrendingUp, Clock, MapPin, Star, Eye } from 'lucide-react';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  const discussions = [
    {
      id: 1,
      title: "Best charging stations in Mumbai?",
      author: "Rahul Sharma",
      avatar: "RS",
      time: "2 hours ago",
      category: "Charging",
      replies: 15,
      likes: 23,
      views: 156,
      content: "Looking for reliable fast charging stations in Mumbai. Any recommendations for the Bandra-Kurla area?",
      tags: ["Mumbai", "Fast Charging", "Recommendations"],
      trending: true
    },
    {
      id: 2,
      title: "Tata Nexon EV - 6 months ownership review",
      author: "Priya Patel",
      avatar: "PP",
      time: "5 hours ago",
      category: "Reviews",
      replies: 28,
      likes: 45,
      views: 234,
      content: "Sharing my detailed experience after 6 months of owning the Nexon EV. Overall very satisfied!",
      tags: ["Tata Nexon", "Review", "Experience"],
      trending: true
    },
    {
      id: 3,
      title: "Planning Delhi to Goa EV road trip",
      author: "Vikram Singh",
      avatar: "VS",
      time: "1 day ago",
      category: "Travel",
      replies: 12,
      likes: 18,
      views: 89,
      content: "Has anyone done this route in an EV? Looking for charging station recommendations along the way.",
      tags: ["Road Trip", "Delhi", "Goa", "Route Planning"],
      trending: false
    },
    {
      id: 4,
      title: "Home charging setup - need advice",
      author: "Anjali Gupta",
      avatar: "AG",
      time: "2 days ago",
      category: "Technical",
      replies: 8,
      likes: 12,
      views: 67,
      content: "Setting up home charging for my new EV. What's the best wall charger under ₹30,000?",
      tags: ["Home Charging", "Wall Charger", "Setup"],
      trending: false
    },
    {
      id: 5,
      title: "EV maintenance costs comparison",
      author: "Suresh Kumar",
      avatar: "SK",
      time: "3 days ago",
      category: "Maintenance",
      replies: 22,
      likes: 31,
      views: 178,
      content: "Comparing maintenance costs between different EV models. Sharing my spreadsheet analysis.",
      tags: ["Maintenance", "Cost Analysis", "Comparison"],
      trending: true
    }
  ];

  const events = [
    {
      id: 1,
      title: "EV Owners Meetup - Bangalore",
      date: "2024-01-25",
      time: "10:00 AM",
      location: "Cubbon Park, Bangalore",
      attendees: 45,
      organizer: "Bangalore EV Club",
      description: "Monthly meetup for EV owners to share experiences and network."
    },
    {
      id: 2,
      title: "Electric Vehicle Expo 2024",
      date: "2024-02-15",
      time: "9:00 AM",
      location: "Pragati Maidan, New Delhi",
      attendees: 1200,
      organizer: "EV India Association",
      description: "India's largest electric vehicle exhibition and conference."
    },
    {
      id: 3,
      title: "EV Charging Infrastructure Workshop",
      date: "2024-02-20",
      time: "2:00 PM",
      location: "Online Event",
      attendees: 89,
      organizer: "Tech EV Solutions",
      description: "Learn about setting up charging infrastructure for businesses."
    }
  ];

  const categories = [
    { name: "All", count: 156, active: true },
    { name: "Charging", count: 45 },
    { name: "Reviews", count: 32 },
    { name: "Technical", count: 28 },
    { name: "Travel", count: 24 },
    { name: "Maintenance", count: 18 },
    { name: "News", count: 9 }
  ];

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            EV Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Connect with fellow EV owners, share experiences, and get help
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('discussions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'discussions'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Discussions
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Events
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'discussions' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* New Discussion */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <button className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    New Discussion
                  </button>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredDiscussions.map((discussion) => (
                  <div key={discussion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                          {discussion.avatar}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {discussion.title}
                          </h3>
                          {discussion.trending && (
                            <span className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span>{discussion.author}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {discussion.time}
                          </span>
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            {discussion.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {discussion.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.map((tag) => (
                            <span key={tag} className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {discussion.likes}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {discussion.replies}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {discussion.views}
                            </div>
                          </div>
                          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                            Join Discussion
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {event.description}
                  </p>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees} attending
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    by {event.organizer}
                  </span>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                    Join Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
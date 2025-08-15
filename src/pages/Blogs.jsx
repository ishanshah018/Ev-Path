import React, { useState } from 'react';
import { Calendar, User, Clock, Search, Tag, BookOpen, TrendingUp, Heart, MessageCircle, Share2 } from 'lucide-react';

const Blogs = () => {
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('all');

const categories = [
{ id: 'all', name: 'All Posts', count: 24 },
{ id: 'charging', name: 'Charging Tips', count: 8 },
{ id: 'reviews', name: 'EV Reviews', count: 6 },
{ id: 'technology', name: 'Technology', count: 5 },
{ id: 'maintenance', name: 'Maintenance', count: 3 },
{ id: 'news', name: 'Industry News', count: 2 }
];

const blogPosts = [
{
    id: 1,
    title: "Complete Guide to Fast Charging Your EV",
    excerpt: "Learn the best practices for fast charging your electric vehicle to maximize battery life and efficiency.",
    author: "Rajesh Kumar",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "charging",
    image: "https://images.pexels.com/photos/7869258/pexels-photo-7869258.jpeg?auto=compress&cs=tinysrgb&w=800",
    likes: 45,
    comments: 12,
    trending: true
},
{
    id: 2,
    title: "Tata Nexon EV vs MG ZS EV: Detailed Comparison",
    excerpt: "An in-depth comparison of India's most popular electric SUVs covering performance, features, and value.",
    author: "Priya Sharma",
    date: "2024-01-12",
    readTime: "8 min read",
    category: "reviews",
    image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
    likes: 67,
    comments: 23,
    trending: true
},
{
    id: 3,
    title: "Understanding Battery Degradation in EVs",
    excerpt: "Everything you need to know about EV battery health, degradation factors, and how to maintain optimal performance.",
    author: "Dr. Amit Patel",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "technology",
    image: "https://images.pexels.com/photos/163016/battery-charging-electricity-power-163016.jpeg?auto=compress&cs=tinysrgb&w=800",
    likes: 34,
    comments: 8,
    trending: false
},
{
    id: 4,
    title: "Top 10 EV Charging Networks in India 2024",
    excerpt: "Comprehensive review of the best charging networks across India with coverage, pricing, and reliability analysis.",
    author: "Vikram Singh",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "charging",
    image: "https://images.pexels.com/photos/7869260/pexels-photo-7869260.jpeg?auto=compress&cs=tinysrgb&w=800",
    likes: 89,
    comments: 31,
    trending: true
},
{
    id: 5,
    title: "Winter Driving Tips for Electric Vehicles",
    excerpt: "Essential tips to maintain EV performance and range during cold weather conditions.",
    author: "Neha Gupta",
    date: "2024-01-05",
    readTime: "4 min read",
    category: "maintenance",
    image: "https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=800",
    likes: 28,
    comments: 6,
    trending: false
},
{
    id: 6,
    title: "Government EV Subsidies and Incentives 2024",
    excerpt: "Complete guide to central and state government incentives for electric vehicle buyers in India.",
    author: "Arjun Mehta",
    date: "2024-01-03",
    readTime: "6 min read",
    category: "news",
    image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800",
    likes: 52,
    comments: 15,
    trending: false
}
];

const filteredPosts = blogPosts.filter(post => {
const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
return matchesSearch && matchesCategory;
});

const trendingPosts = blogPosts.filter(post => post.trending).slice(0, 3);

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        EV Knowledge Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
        Stay updated with the latest EV trends, tips, and insights
        </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
        <div className="space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search</h3>
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                type="text"
                placeholder="Search articles..."
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
                <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                        ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {category.count}
                    </span>
                    </div>
                </button>
                ))}
            </div>
            </div>

            {/* Trending */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                Trending
            </h3>
            <div className="space-y-4">
                {trendingPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                    {post.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                />
                {post.trending && (
                    <div className="absolute top-4 left-4">
                    <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                    </span>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {categories.find(c => c.id === post.category)?.name}
                    </span>
                </div>
                </div>

                <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                    </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes}
                    </div>
                    <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                    </div>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center">
                    Read More
                    <BookOpen className="h-4 w-4 ml-1" />
                    </button>
                </div>
                </div>
            </article>
            ))}
        </div>

        {filteredPosts.length === 0 && (
            <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or category filter
            </p>
            </div>
        )}
        </div>
    </div>
    </div>
</div>
);
};

export default Blogs;
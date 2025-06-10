import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight, Clock } from 'lucide-react';
import ContactCTA from '../components/ContactCTA';
import NewsletterForm from '../components/NewsletterForm';
import { getPosts, getCategories, searchPosts, getPostsByCategory } from '../lib/blogService';
import type { BlogPost, Category } from '../types/blog';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, name: 'all', label: 'All Posts' },
    { id: 1, name: 'tips', label: 'Photography Tips' },
    { id: 2, name: 'locations', label: 'Locations' },
    { id: 3, name: 'culture', label: 'Hawaiian Culture' },
    { id: 4, name: 'events', label: 'Special Events' },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch blog posts and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const posts = await getPosts();
        const cats = await getCategories();
        
        setBlogPosts(posts);
        setFilteredPosts(posts);
        
        if (cats.length > 0) {
          setCategories([{ id: 0, name: 'all', label: 'All Posts' }, ...cats]);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter posts when category or search query changes
  useEffect(() => {
    if (searchQuery === '' && activeCategory === 'all') {
      setFilteredPosts(blogPosts);
      return;
    }
    
    const filtered = blogPosts.filter(post => 
      (activeCategory === 'all' || post.category === activeCategory) &&
      (searchQuery === '' || 
       post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredPosts(filtered);
  }, [searchQuery, activeCategory, blogPosts]);

  // Handle category change
  const handleCategoryChange = async (categoryName: string) => {
    setActiveCategory(categoryName);
    setLoading(true);
    
    try {
      if (categoryName === 'all') {
        const posts = await getPosts();
        setFilteredPosts(posts);
      } else {
        const posts = await getPostsByCategory(categoryName);
        setFilteredPosts(posts);
      }
    } catch (error) {
      console.error('Error fetching posts by category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      setLoading(true);
      try {
        const searchResults = await searchPosts(query);
        setFilteredPosts(searchResults);
      } catch (error) {
        console.error('Error searching posts:', error);
      } finally {
        setLoading(false);
      }
    } else if (query.length === 0) {
      // Reset to all posts or current category
      if (activeCategory === 'all') {
        setFilteredPosts(blogPosts);
      } else {
        const filtered = blogPosts.filter(post => post.category === activeCategory);
        setFilteredPosts(filtered);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  // Safe rendering function for featured post
  const renderFeaturedPost = () => {
    if (!filteredPosts || filteredPosts.length === 0) {
      return null;
    }

    const post = filteredPosts[0];
    if (!post) return null;
    
    const categoryLabel = categories.find(cat => cat.name === post.category)?.label;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <div className="relative group overflow-hidden rounded-lg">
          <img 
            src={post.featured_image} 
            alt={post.title} 
            className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center mb-3 text-sm">
              {categoryLabel && (
                <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded text-xs font-semibold mr-3">
                  {categoryLabel}
                </span>
              )}
              <div className="flex items-center text-gray-400 mr-4">
                <Calendar size={14} className="mr-1" />
                {post.created_at}
              </div>
              <div className="flex items-center text-gray-400">
                <Clock size={14} className="mr-1" />
                {post.read_time}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-300 mb-4 line-clamp-2 md:line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center">
              {post.author && (
                <>
                  <img 
                    src={post.author.image_url} 
                    alt={post.author.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <span className="text-gray-400">{post.author.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-80">
          <img 
            src="https://images.pexels.com/photos/3894874/pexels-photo-3894874.jpeg?auto=compress&cs=tinysrgb&w=1920" 
            alt="Hawaiian family" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="bg-yellow-400 inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-slate-900">
              OUR JOURNAL
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              FAMILY PHOTOGRAPHY INSIGHTS
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore our collection of articles on family photography, Hawaiian culture, and tips for creating beautiful memories on the islands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Search Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-5 py-4 pl-12 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </motion.div>
              
              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Featured Post */}
                  {renderFeaturedPost()}
                  
                  {/* Blog Posts Grid */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {filteredPosts.slice(1).map((post) => (
                      <motion.div 
                        key={post.id}
                        variants={itemVariants}
                        className="bg-slate-800 rounded-lg overflow-hidden group"
                      >
                        <div className="relative overflow-hidden">
                          <img 
                            src={post.featured_image} 
                            alt={post.title} 
                            className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-3 left-3">
                            {post.category && (
                              <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded text-xs font-semibold">
                                {categories.find(cat => cat.name === post.category)?.label || post.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center mb-3 text-sm text-gray-400">
                            <div className="flex items-center mr-4">
                              <Calendar size={14} className="mr-1" />
                              {post.created_at}
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {post.read_time}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-400 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            {post.author && (
                              <div className="flex items-center">
                                <img 
                                  src={post.author.image_url} 
                                  alt={post.author.name} 
                                  className="w-8 h-8 rounded-full mr-2 object-cover"
                                />
                                <span className="text-sm text-gray-400">{post.author.name}</span>
                              </div>
                            )}
                            <Link 
                              to={`/blog/${post.slug}`} 
                              className="text-yellow-400 flex items-center text-sm group-hover:text-yellow-300 transition-colors"
                            >
                              Read More
                              <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {filteredPosts.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20"
                    >
                      <div className="text-4xl text-gray-600 mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                      <p className="text-gray-400">
                        Try adjusting your search or filter to find what you're looking for.
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Categories */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-slate-800 rounded-lg p-6 mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <button 
                        onClick={() => handleCategoryChange(category.name)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between ${
                          activeCategory === category.name 
                            ? 'bg-yellow-400 text-slate-900 font-medium' 
                            : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {category.label}
                        {activeCategory === category.name && (
                          <svg className="w-4 h-4\" fill="none\" stroke="currentColor\" viewBox="0 0 24 24">
                            <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth="2\" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              {/* Recent Posts */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-slate-800 rounded-lg p-6 mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-start">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-16 h-16 object-cover rounded mr-3 flex-shrink-0"
                      />
                      <div>
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="text-white font-medium hover:text-yellow-400 transition-colors line-clamp-2 text-sm"
                        >
                          {post.title}
                        </Link>
                        <div className="text-gray-400 text-xs mt-1">{post.created_at}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Newsletter */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-slate-800 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-white mb-3">Subscribe to Our Newsletter</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Get the latest family photography tips and special offers delivered to your inbox.
                </p>
                <NewsletterForm location="blog_sidebar" buttonText="Subscribe" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default BlogPage;
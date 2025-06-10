import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { getPostBySlug, getPostsByCategory } from '../lib/blogService';
import ContactCTA from '../components/ContactCTA';

const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        // If we have a slug, try to fetch the post
        if (slug) {
          const postData = await getPostBySlug(slug);
          if (postData) {
            setPost(postData);
            
            // Fetch related posts in the same category
            const categoryPosts = await getPostsByCategory(postData.category);
            setRelatedPosts(categoryPosts.filter(p => p.id !== postData.id).slice(0, 3));
          } else {
            console.error('Post not found');
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
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
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 pt-32">
        <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
        <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" className="px-6 py-3 bg-yellow-400 text-slate-900 rounded font-semibold hover:bg-yellow-500 transition-colors">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src={post.featured_image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-950/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Link to="/blog" className="inline-flex items-center text-yellow-400 mb-6 hover:text-yellow-300 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Link>
            <div className="flex items-center justify-center mb-4 text-sm">
              <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded text-xs font-semibold mr-3">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </span>
              <div className="flex items-center text-gray-400 mr-4">
                <Calendar size={14} className="mr-1" />
                {post.created_at}
              </div>
              <div className="flex items-center text-gray-400">
                <Clock size={14} className="mr-1" />
                {post.read_time}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              {post.title}
            </h1>
            <div className="flex items-center justify-center">
              <img 
                src={post.author.image_url} 
                alt={post.author.name} 
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <span className="text-gray-300">{post.author.name}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-800 p-8 rounded-lg mb-12"
            >
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                
                <div className="border-l-4 border-yellow-400 pl-6 my-8">
                  <p className="text-xl text-gray-200 italic">
                    "Every family has a unique story. Our job is to help tell that story through beautiful imagery that captures the authentic connections between loved ones."
                  </p>
                </div>
                
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Share buttons */}
              <div className="border-t border-slate-700 mt-10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Share this article:</span>
                  <div className="flex space-x-3">
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                      <button 
                        key={platform}
                        className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-yellow-400 hover:text-slate-900 transition-colors"
                        aria-label={`Share on ${platform}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          {platform === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>}
                          {platform === 'twitter' && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>}
                          {platform === 'instagram' && <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9a5.5 5.5 0 0 1 5.5 5.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z"></path>}
                          {platform === 'linkedin' && <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 1 1 0-4z"></path>}
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Author Bio */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/50 p-8 rounded-lg mb-16 flex flex-col md:flex-row items-center md:items-start gap-6"
            >
              <img 
                src={post.author.image_url} 
                alt={post.author.name} 
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{post.author.name}</h3>
                <p className="text-gray-400 mb-4">
                  {post.author.bio || "Family photographer and videographer based in Hawaii, specializing in capturing authentic family moments across the Hawaiian islands."}
                </p>
                <div className="flex space-x-3">
                  {['instagram', 'twitter', 'facebook'].map((platform) => (
                    <a 
                      key={platform}
                      href={platform === 'instagram' ? 'https://www.instagram.com/pureohanatreasures/' : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        {platform === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>}
                        {platform === 'twitter' && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>}
                        {platform === 'instagram' && <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9a5.5 5.5 0 0 1 5.5 5.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z"></path>}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div 
                      key={relatedPost.id} 
                      className="bg-slate-800 rounded-lg overflow-hidden group"
                    >
                      <div className="relative overflow-hidden h-48">
                        <img 
                          src={relatedPost.featured_image} 
                          alt={relatedPost.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <Link 
                          to={`/blog/${relatedPost.slug}`} 
                          className="text-yellow-400 flex items-center text-sm group-hover:text-yellow-300 transition-colors"
                        >
                          Read Article
                          <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
};

export default BlogPostDetail;
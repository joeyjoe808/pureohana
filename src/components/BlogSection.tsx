import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRecentPosts } from '../lib/blogService';

const BlogPost = ({ image, date, title, excerpt, author, authorImage, slug }) => {
  return (
    <div className="group">
      <Link to={`/blog/${slug}`} className="block">
        <div className="overflow-hidden mb-4">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="text-xs text-gray-400 mb-3 font-light">{date}</div>
      <Link to={`/blog/${slug}`}>
        <h3 className="text-lg font-serif mb-3 text-white group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
      </Link>
      <p className="text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">{excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={authorImage} alt={author} className="w-8 h-8 rounded-full mr-2 object-cover" />
          <span className="text-xs text-gray-400">{author}</span>
        </div>
        <Link to={`/blog/${slug}`} className="text-yellow-400 group-hover:text-yellow-300 transition-colors flex items-center text-xs">
          Read more
          <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const posts = await getRecentPosts();
        if (posts && posts.length > 0) {
          setBlogPosts(posts);
        } else {
          // Fallback to default luxury posts if no posts from the database
          setBlogPosts([
            {
              id: 1,
              slug: "planning-destination-wedding-hawaii",
              title: "How to Plan a Destination Wedding in Hawaii Without Visiting First",
              excerpt: "Expert guidance on planning your perfect Hawaiian wedding from afar, with insider tips on selecting venues and coordinating with premium vendors.",
              featured_image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
              created_at: "April 10, 2025",
              author: {
                name: "Leilani Kealoha",
                image_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
              }
            },
            {
              id: 2,
              slug: "luxury-resorts-hawaiian-weddings",
              title: "Top 5 Luxury Resorts for a Hawaiian Wedding (with Photo Examples)",
              excerpt: "Discover Hawaii's most exclusive wedding venues, from pristine private beaches to luxurious estate settings with breathtaking ocean views.",
              featured_image: "https://images.pexels.com/photos/1179156/pexels-photo-1179156.jpeg?auto=compress&cs=tinysrgb&w=800",
              created_at: "March 25, 2025",
              author: {
                name: "Kona Mitchell",
                image_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
              }
            },
            {
              id: 3,
              slug: "wedding-planner-photography-insights",
              title: "What Your Wedding Planner Wishes You Knew About Hiring Photo/Video Teams",
              excerpt: "Exclusive insights from Hawaii's premier wedding planners on selecting photography and cinematography that elevates your celebration.",
              featured_image: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
              created_at: "February 18, 2025",
              author: {
                name: "Nani Kahale",
                image_url: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
              }
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching recent posts:', err);
        setError('Failed to load recent posts');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="thin-gold-line"></div>
              <span className="text-yellow-400 text-xs tracking-widest font-light">INSIGHTS & EXPERTISE</span>
              <div className="thin-gold-line"></div>
            </div>
            <h2 className="text-3xl font-serif mt-2 text-white">THE JOURNAL</h2>
            <div className="flex justify-center mt-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="thin-gold-line"></div>
              <span className="text-yellow-400 text-xs tracking-widest font-light">INSIGHTS & EXPERTISE</span>
              <div className="thin-gold-line"></div>
            </div>
            <h2 className="text-3xl font-serif mt-2 text-white">THE JOURNAL</h2>
            <p className="text-red-400 mt-8">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-3">
            <div className="thin-gold-line"></div>
            <span className="text-yellow-400 text-xs tracking-widest font-light">INSIGHTS & EXPERTISE</span>
            <div className="thin-gold-line"></div>
          </div>
          <h2 className="text-3xl font-serif mt-2 text-white">THE JOURNAL</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm font-light">
            Curated articles on luxury weddings, exclusive locations, and the art of extraordinary photography in Hawaii.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogPosts.map((post, index) => (
            <BlogPost 
              key={post.id || index} 
              image={post.featured_image || post.image} 
              date={post.created_at || post.date} 
              title={post.title} 
              excerpt={post.excerpt} 
              author={post.author?.name || post.author}
              authorImage={post.author?.image_url || post.authorImage}
              slug={post.slug}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            to="/blog" 
            className="inline-flex items-center px-8 py-3 border border-yellow-400 text-yellow-400 font-light text-sm rounded-sm hover:bg-yellow-400/10 transition-colors"
          >
            EXPLORE THE JOURNAL
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
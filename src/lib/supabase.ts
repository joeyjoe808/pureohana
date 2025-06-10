import { createClient } from '@supabase/supabase-js';
import { secureCookieOptions } from './securityConfig';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Enhanced security configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // More secure than implicit flow
    cookieOptions: {
      ...secureCookieOptions,
      name: 'sb-auth', // Custom name to avoid fingerprinting
      domain: window.location.hostname, // Restrict to current domain only
      path: '/', // Available throughout the site
    },
    storageKey: 'sb-auth-token', // Consistent key for storage
  },
  global: {
    headers: {
      'X-Client-Info': 'pure-ohana-treasures-web', // Help identify client for security auditing
    },
  },
  // Add retryable status codes for better resilience
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limiting for realtime events
    },
  },
});

// Default author to use when no author is available
const defaultAuthor = {
  id: 0,
  name: 'Unknown Author',
  image_url: 'https://via.placeholder.com/100',
  bio: 'Author information unavailable'
};

// Fallback blog post data
const mockPosts = [
  {
    id: 1,
    slug: "planning-destination-wedding-hawaii",
    title: "How to Plan a Destination Wedding in Hawaii Without Visiting First",
    excerpt: "Expert guidance on planning your perfect Hawaiian wedding from afar, with insider tips on selecting venues and coordinating with premium vendors.",
    content: "Planning a destination wedding in Hawaii from afar can seem daunting, but with the right approach, it can be an seamless experience leading to an exceptional celebration.\n\nThe key to a successful remote planning process lies in securing the right team of professionals on the ground. Begin by selecting a luxury wedding planner with extensive experience in Hawaiian destination weddings. Look for portfolios featuring weddings at venues similar to what you envision, and request video consultations to establish rapport.\n\nWhen selecting your venue without an in-person visit, virtual tours have become increasingly sophisticated. Many luxury properties offer private virtual showings with their event specialists who can address your specific questions in real-time. Request to see the venue at different times of day, particularly during your planned ceremony time, to understand how the light will affect your photography.\n\nFor photography and cinematography, the selection process deserves particular attention. Review full galleries from real weddings, not just portfolio highlights. This gives you a comprehensive understanding of how the artist captures an entire celebration, from intimate moments to grand scenes. Arrange for your photographer and planner to connect directly—this collaboration is essential for capturing your vision authentically.\n\nConsider the logistical elements that will enhance your guests' experience. Custom welcome packages awaiting guests upon arrival, private transportation arrangements, and thoughtfully timed activities create a cohesive experience. Many luxury properties offer exclusive experiences like private luaus or catamaran sails that can be arranged for your wedding party.\n\nFinally, trust in the expertise of your selected professionals. Hawaiian wedding vendors of distinction understand the unique challenges of planning from afar and excel at guiding couples through the process with sophistication and attention to detail that transforms distance into an opportunity for creative collaboration.",
    category: "weddings",
    featured_image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
    created_at: "2025-04-10",
    is_published: true,
    author: {
      id: 1,
      name: "Leilani Kealoha",
      image_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      bio: "Luxury wedding photographer and creative director specializing in sophisticated celebrations across the Hawaiian islands."
    },
    read_time: "8 min read"
  },
  {
    id: 2,
    slug: "luxury-resorts-hawaiian-weddings",
    title: "Top 5 Luxury Resorts for a Hawaiian Wedding (with Photo Examples)",
    excerpt: "Discover Hawaii's most exclusive wedding venues, from pristine private beaches to luxurious estate settings with breathtaking ocean views.",
    content: "Hawaii's luxury resort landscape offers unparalleled settings for sophisticated wedding celebrations, each with distinctive characteristics that appeal to the most discerning couples. Here, we explore the five most exceptional properties for an unforgettable wedding experience.\n\nFour Seasons Resort Hualalai on Hawaii Island stands as the pinnacle of understated luxury. Its exclusive King's Pond lawn offers a dramatic ceremony backdrop where ancient lava rock meets crystalline waters. The resort's dedication to privacy makes it ideal for high-profile celebrations, with oceanfront estate homes available for wedding party accommodations. The property's dedicated wedding design team works with only one celebration per weekend, ensuring meticulous attention to every detail.",
    category: "venues",
    featured_image: "https://images.pexels.com/photos/1179156/pexels-photo-1179156.jpeg?auto=compress&cs=tinysrgb&w=800",
    created_at: "2025-03-25",
    is_published: true,
    author: {
      id: 2,
      name: "Kona Mitchell",
      image_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      bio: "Luxury destination wedding specialist with insider knowledge of Hawaii's most exclusive venues and properties."
    },
    read_time: "10 min read"
  }
];

// Check the Supabase connection and return detailed status
export const checkSupabaseConnection = async () => {
  try {
    // First check if we have the environment variables
    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        error: 'Missing Supabase configuration',
        details: 'Supabase URL or API key is not set in environment variables',
        code: 'CONFIG_MISSING'
      };
    }
    
    // Then try to make a simple query to test the connection
    const { data, error } = await supabase.from('pureohanatreasures').select('*').limit(1);
    
    if (error) {
      // Parse the error to provide more helpful information
      let errorCode = error.code;
      let errorDetails = '';
      
      // Provide more context based on error codes
      if (error.code === '42P01') {
        errorDetails = 'Table not found. The database schema may not be set up correctly.';
      } else if (error.code === 'PGRST301') {
        errorDetails = 'Unauthorized. CORS may not be configured correctly in your Supabase project.';
      } else if (error.status === 403) {
        errorDetails = 'Forbidden. Check your RLS policies and API key permissions.';
      } else {
        errorDetails = `Status: ${error.status || 'Unknown'}`;
      }
      
      return {
        success: false,
        error: error.message,
        code: errorCode,
        details: errorDetails
      };
    }
    
    return { success: true };
  } catch (e: any) {
    // Handle unexpected errors
    return { 
      success: false, 
      error: e.message || 'Unknown error occurred',
      details: 'Check your browser console for more details',
      code: 'UNEXPECTED_ERROR'
    };
  }
};

// API functions that handle errors gracefully
export const getPosts = async () => {
  try {
    // Enhanced error handling and security
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        authors(id, name, image_url, bio)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
      // Fall back to mock data if there's an error
      return mockPosts;
    }
    
    // Format the posts to match the expected structure
    const formattedPosts = data.map(post => {
      // Convert the author object to the expected format
      const author = post.authors || defaultAuthor;
      
      // Format the created_at date for display
      const created_at = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return {
        ...post,
        author,
        created_at
      };
    });
    
    return formattedPosts.length > 0 ? formattedPosts : mockPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return mock data in case of any error
    return mockPosts;
  }
};

export const getPostById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        authors(id, name, image_url, bio)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching post with id ${id}:`, error);
      // Fall back to mock data
      return mockPosts.find(post => post.id === parseInt(id));
    }
    
    // Format created_at date
    const created_at = new Date(data.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      ...data,
      author: data.authors || defaultAuthor,  // Use default author if authors is null
      created_at
    };
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    return mockPosts.find(post => post.id === parseInt(id));
  }
};

export const getPostBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        authors(id, name, image_url, bio)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      // Fall back to mock data
      return mockPosts.find(post => post.slug === slug);
    }
    
    // Format created_at date
    const created_at = new Date(data.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      ...data,
      author: data.authors || defaultAuthor,  // Use default author if authors is null
      created_at
    };
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return mockPosts.find(post => post.slug === slug);
  }
};

export const getPostsByCategory = async (category) => {
  try {
    // If it's "all", just return all posts
    if (category === 'all') {
      return getPosts();
    }
    
    // Otherwise, filter by category
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        authors(id, name, image_url, bio)
      `)
      .eq('category', category)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching posts for category ${category}:`, error);
      // Fall back to mock data filtering
      return mockPosts.filter(post => post.category === category);
    }
    
    // Format the posts
    const formattedPosts = data.map(post => {
      const author = post.authors || defaultAuthor;  // Use default author if authors is null
      
      const created_at = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return {
        ...post,
        author,
        created_at
      };
    });
    
    return formattedPosts.length > 0 ? formattedPosts : mockPosts.filter(post => post.category === category);
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    return mockPosts.filter(post => post.category === category);
  }
};

export const searchPosts = async (query) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        authors(id, name, image_url, bio)
      `)
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error searching posts with query ${query}:`, error);
      // Fall back to mock data filtering
      return mockPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Format the posts
    const formattedPosts = data.map(post => {
      const author = post.authors || defaultAuthor;  // Use default author if authors is null
      
      const created_at = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return {
        ...post,
        author,
        created_at
      };
    });
    
    return formattedPosts;
  } catch (error) {
    console.error(`Error searching posts with query ${query}:`, error);
    return mockPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Additional security logging function
export const logSecurityEvent = async (action: string, details: any = {}) => {
  try {
    // Don't block the main thread for this
    setTimeout(async () => {
      await supabase
        .from('security_audit_logs')
        .insert([
          {
            action,
            details,
            ip_address: 'client-side', // This will be replaced by RLS
            user_agent: navigator.userAgent
          }
        ]);
    }, 0);
  } catch (e) {
    // Silent failure - don't disrupt user experience for logging
    console.error('Security logging error:', e);
  }
};
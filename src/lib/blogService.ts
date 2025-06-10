import type { BlogPost, Category } from '../types/blog';
import { supabase } from './supabase';

// Default author to use when no author is available
const defaultAuthor = {
  id: 0,
  name: "Pure Ohana Treasures",
  image_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
  bio: "Professional photography and cinematography services specializing in luxury celebrations."
};

// Luxury-focused blog posts
const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "planning-destination-wedding-hawaii",
    title: "How to Plan a Destination Wedding in Hawaii Without Visiting First",
    excerpt: "Expert guidance on planning your perfect Hawaiian wedding from afar, with insider tips on selecting venues and coordinating with premium vendors.",
    content: "Planning a destination wedding in Hawaii from afar can seem daunting, but with the right approach, it can be an seamless experience leading to an exceptional celebration.\n\nThe key to a successful remote planning process lies in securing the right team of professionals on the ground. Begin by selecting a luxury wedding planner with extensive experience in Hawaiian destination weddings. Look for portfolios featuring weddings at venues similar to what you envision, and request video consultations to establish rapport.\n\nWhen selecting your venue without an in-person visit, virtual tours have become increasingly sophisticated. Many luxury properties offer private virtual showings with their event specialists who can address your specific questions in real-time. Request to see the venue at different times of day, particularly during your planned ceremony time, to understand how the light will affect your photography.\n\nFor photography and cinematography, the selection process deserves particular attention. Review full galleries from real weddings, not just portfolio highlights. This gives you a comprehensive understanding of how the artist captures an entire celebration, from intimate moments to grand scenes. Arrange for your photographer and planner to connect directly—this collaboration is essential for capturing your vision authentically.\n\nConsider the logistical elements that will enhance your guests' experience. Custom welcome packages awaiting guests upon arrival, private transportation arrangements, and thoughtfully timed activities create a cohesive experience. Many luxury properties offer exclusive experiences like private luaus or catamaran sails that can be arranged for your wedding party.\n\nFinally, trust in the expertise of your selected professionals. Hawaiian wedding vendors of distinction understand the unique challenges of planning from afar and excel at guiding couples through the process with sophistication and attention to detail that transforms distance into an opportunity for creative collaboration.",
    category: "weddings",
    featured_image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
    created_at: "April 10, 2025",
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
    content: "Hawaii's luxury resort landscape offers unparalleled settings for sophisticated wedding celebrations, each with distinctive characteristics that appeal to the most discerning couples. Here, we explore the five most exceptional properties for an unforgettable wedding experience.\n\nFour Seasons Resort Hualalai on Hawaii Island stands as the pinnacle of understated luxury. Its exclusive King's Pond lawn offers a dramatic ceremony backdrop where ancient lava rock meets crystalline waters. The resort's dedication to privacy makes it ideal for high-profile celebrations, with oceanfront estate homes available for wedding party accommodations. The property's dedicated wedding design team works with only one celebration per weekend, ensuring meticulous attention to every detail.\n\nOn Maui, the Montage Kapalua Bay offers a rarefied wedding experience on its Cliff House lawn, suspended between sky and ocean. This boutique property limits weddings to ensure exclusivity, with full property buyout options available. The culinary program deserves special mention—their executive chef creates bespoke menus featuring elevated Hawaiian cuisine using ingredients from the resort's own organic farm.\n\nFor those seeking ultimate privacy, Kualoa Ranch Private Nature Reserve on Oahu provides 4,000 acres of cinematic landscapes seen in numerous films. The Jurassic Valley site offers a dramatic amphitheater of verdant mountains as your ceremony backdrop, while the Secret Island location provides a secluded beach accessible only by private boat. This venue specializes in helicopter arrivals and sophisticated tented receptions.\n\nThe Ko'a Kea Hotel & Resort on Kauai's southern shore offers intimacy without sacrificing luxury. With a maximum capacity of 80 guests, this boutique property specializes in refined celebrations where every detail receives extraordinary attention. Their oceanfront lawn transitions beautifully from ceremony to reception space as the sun sets over the Pacific.\n\nFinally, the Halekulani in Waikiki represents the zenith of sophisticated urban celebrations. Their legendary open-air ballroom overlooks the iconic Diamond Head and features a hand-painted cypress ceiling. The property's legacy of service excellence spans over a century, with a dedicated wedding team known for orchestrating flawless events down to the smallest detail.\n\nEach of these exceptional properties offers distinctive advantages, but all share a commitment to uncompromising quality and sophisticated Hawaiian luxury that forms the foundation of a truly extraordinary celebration.",
    category: "venues",
    featured_image: "https://images.pexels.com/photos/1179156/pexels-photo-1179156.jpeg?auto=compress&cs=tinysrgb&w=800",
    created_at: "March 25, 2025",
    is_published: true,
    author: {
      id: 2,
      name: "Kona Mitchell",
      image_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      bio: "Luxury destination wedding specialist with insider knowledge of Hawaii's most exclusive venues and properties."
    },
    read_time: "10 min read"
  },
  {
    id: 3,
    slug: "wedding-planner-photography-insights",
    title: "What Your Wedding Planner Wishes You Knew About Hiring Photo/Video Teams",
    excerpt: "Exclusive insights from Hawaii's premier wedding planners on selecting photography and cinematography that elevates your celebration.",
    content: "The relationship between your wedding planner and photography/cinematography team is perhaps the most crucial creative partnership of your celebration. Hawaii's most sought-after wedding planners share their insider perspectives on selecting visual artists who will elevate your event to its highest potential.\n\nFirst and foremost, exceptional planners emphasize the importance of artistic alignment over specific shot lists. \"The most sophisticated clients understand they're commissioning an artistic vision, not purchasing a product,\" explains Malie Kai, founder of Hawaii's elite planning firm White Orchid Weddings. \"When selecting photographers, focus less on specific poses you've seen on Pinterest and more on the consistent aesthetic quality across their full portfolio.\"\n\nTimeline development represents another critical area where planner and photography collaboration proves essential. \"Luxury photography requires thoughtfully allocated time,\" notes Jennifer Akiona of Tropical Elegance Events. \"The finest images aren't rushed—they're crafted within a carefully designed schedule that prioritizes quality over quantity. We build in 'buffer' time throughout the day, particularly around sunset, to ensure your photographer can work without compromise.\"\n\nRegarding videography, planners unanimously recommend selecting teams that specialize in cinematic approaches rather than documentary styles for high-end celebrations. \"The difference lies in storytelling versus documentation,\" explains Kai. \"A truly cinematic team crafts a narrative that evokes emotion through sophisticated editing, music selection, and visual pacing. They're creating a work of art, not simply recording an event.\"\n\nPerhaps most importantly, planners emphasize the value of personality compatibility. \"You'll spend more time with your photography team than almost anyone else on your wedding day,\" shares Akiona. \"Their energy directly influences how comfortable you feel, which translates visibly into your images. The best photographers for celebrities and high-profile clients excel not only in artistic vision but in creating an environment of ease and discretion.\"\n\nFinally, planners advise investing in comprehensive coverage rather than abbreviated packages. \"The sophisticated approach is full-day coverage with a robust team,\" Kai explains. \"When a photographer needs to rush or limit their presence, the resulting collection inevitably reflects those constraints. Truly exceptional documentation requires time, creative freedom, and the security of knowing every significant moment will be captured with artistry.\"",
    category: "planning",
    featured_image: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
    created_at: "February 18, 2025",
    is_published: true,
    author: {
      id: 3,
      name: "Nani Kahale",
      image_url: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      bio: "Former luxury event planner turned photography consultant who bridges the gap between planning vision and photographic execution."
    },
    read_time: "9 min read"
  },
  {
    id: 4,
    slug: "best-months-hawaii-wedding",
    title: "Best Months to Get Married in Hawaii (Luxury Travel Edition)",
    excerpt: "An insider's guide to selecting the optimal season for your Hawaiian celebration, considering exclusive venue availability, weather patterns, and privacy considerations.",
    content: "For discerning couples planning a luxury Hawaiian wedding, timing considerations extend far beyond basic weather patterns. The sophisticated approach to selecting your celebration date incorporates exclusive venue availability, privacy considerations, and the nuanced characteristics of each island's microclimate.\n\nWhile conventional wisdom suggests April-June and September-October as ideal wedding months, luxury celebrations benefit from a more strategic approach. For the utmost exclusivity, consider February through early March (excluding Valentine's week) on Maui or the Big Island. This period offers a sweet spot of exceptional weather combined with decreased visitor numbers, allowing premier venues to dedicate their full attention to your celebration. The Kona side of the Big Island, in particular, enjoys remarkably consistent weather year-round, with February averaging only two days of minimal rainfall.\n\nFor couples prioritizing absolute privacy, early December (before the 15th) presents a remarkable opportunity. This brief window between Thanksgiving and the holiday rush sees Hawaii's luxury properties at their least occupied, often with favorable pricing even for the most exclusive venues. The North Shore of Kauai and the Kohala Coast of the Big Island are particularly tranquil during this period.\n\nMaui's Wailea and Kapalua areas experience their most idyllic weather from late April through June, with gentle trade winds and minimal rainfall. However, sophisticated couples might consider September instead—the weather remains impeccable while visitor numbers drop significantly after Labor Day, creating a more exclusive atmosphere at premier resorts.\n\nFor those planning a multi-day celebration incorporating various outdoor activities, late October on Oahu offers versatile conditions. The summer crowds have diminished while the winter swells haven't yet arrived in full force, allowing for everything from catamaran excursions to helicopter tours without the peak-season premium.\n\nUltimately, the optimal timing depends on your specific priorities—whether that's securing a particular photographer with limited availability, coordinating with a specific luxury venue's calendar, or ensuring ideal conditions for your chosen activities. The most successful luxury celebrations result from strategic planning that considers these factors in concert with your personal vision, often scheduled 12-18 months in advance to secure the most coveted venues and vendors during their prime seasons.",
    category: "planning",
    featured_image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
    created_at: "January 22, 2025",
    is_published: true,
    author: {
      id: 1,
      name: "Leilani Kealoha",
      image_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      bio: "Luxury wedding photographer and creative director specializing in sophisticated celebrations across the Hawaiian islands."
    },
    read_time: "7 min read"
  },
  {
    id: 5,
    slug: "artistic-wedding-photography-hawaii",
    title: "The Art of Emotional Storytelling: Beyond Standard Wedding Photography",
    excerpt: "How discerning couples are commissioning artistic visual narratives that transcend traditional wedding documentation for truly extraordinary results.",
    content: "The evolution of luxury wedding photography has transcended documentation to become a sophisticated art form—one that discerning couples commission not merely to record their celebration but to interpret it through a distinctive artistic vision.\n\nThis elevated approach begins with a fundamental shift in perspective: viewing photography not as a service to purchase but as an artistic commission to curate. \"The distinction between documentation and artistic interpretation represents the difference between a pleasant record and a compelling visual narrative,\" explains renowned photographer Michael Chang, whose work appears in Vogue and Harper's Bazaar wedding features.\n\nSophisticated couples understand that emotional resonance requires both technical excellence and artistic intuition. \"Technical mastery—the perfect exposure, ideal composition—is merely the foundation,\" notes Isabella Martinez, whose fine art wedding images hang in private collections. \"The true artistry emerges in capturing authentic emotional moments through a distinctive aesthetic lens.\"\n\nThis artistic approach involves a more immersive relationship between photographer and couple. Leading photographers now begin their process months before the wedding day, learning the couple's story, understanding their aesthetic sensibilities, and observing their natural interactions. This deeper connection allows for images that feel both authentic and elevated.\n\nThe resulting imagery transcends traditional wedding photography in several notable ways. First, the approach to composition often incorporates negative space, unexpected framing, and environmental elements that create visual poetry beyond standard documentation. Second, the editing process becomes more interpretive, with a cohesive color story and tonal quality that reflects both the emotional atmosphere and physical environment of the celebration.\n\nPerhaps most significantly, this artistic approach embraces serendipity and emotional truth over perfection. \"The most compelling images often emerge from unplanned moments—a fleeting glance, an unexpected weather element, a spontaneous interaction,\" shares Chang. \"The artistic photographer remains present and responsive to these moments rather than controlling every element.\"\n\nFor couples considering this elevated approach to wedding photography, the selection process differs significantly from standard vendor hiring. Look beyond technical skill to identify artists whose existing work resonates emotionally with you. Review full galleries to understand their storytelling approach across an entire celebration. And most importantly, meet personally with potential photographers to assess the intangible but essential quality of interpersonal chemistry.\n\nThe investment in artistic wedding photography extends beyond financial considerations to include a willingness to trust in the creative process. This trust allows truly exceptional artists to create a visual narrative that will continue to reveal new emotional depths with each viewing across the decades of your marriage.",
    category: "photography",
    featured_image: "https://images.pexels.com/photos/1589825/pexels-photo-1589825.jpeg?auto=compress&cs=tinysrgb&w=800",
    created_at: "December 12, 2024",
    is_published: true,
    author: {
      id: 4,
      name: "Kai Nakamura",
      image_url: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
      bio: "Fine art photographer specializing in editorial and artistic approaches to luxury celebrations."
    },
    read_time: "11 min read"
  },
  {
    id: 6,
    slug: "hawaiian-luxury-wedding-traditions",
    title: "Modern Luxury Meets Hawaiian Tradition: Authentic Cultural Elements for Sophisticated Celebrations",
    excerpt: "How to incorporate meaningful Hawaiian traditions into contemporary luxury weddings with authenticity and respect.",
    content: "The most memorable luxury celebrations in Hawaii achieve a delicate balance—embracing authentic cultural traditions while maintaining sophisticated contemporary elegance. When thoughtfully integrated, Hawaiian cultural elements elevate a celebration beyond the expected luxury experience into something profoundly meaningful and distinctive.\n\nTraditional Hawaiian ceremonies offer rich symbolic elements that resonate with couples seeking depth beyond material opulence. The exchange of lei represents the intertwining of two lives, while the blowing of the pu (conch shell) announces significant moments with a sound that resonates across valleys and shores. These elements gain even greater significance when their cultural meaning is properly conveyed to guests through elegantly designed program materials or by a knowledgeable kahu (officiant).\n\nFor discerning couples, the key lies in selecting traditions that genuinely resonate with their personal story rather than incorporating elements merely for aesthetic effect. \"Cultural integration should never feel like appropriation or performance,\" advises Nalani Kealoha, cultural advisor to luxury properties across Hawaii. \"The most sophisticated approaches focus on meaning rather than spectacle.\"\n\nThis thoughtful integration extends to visual documentation as well. \"Our approach to capturing cultural elements emphasizes reverence and context,\" explains renowned photographer Kai Mitchell. \"We ensure these moments are documented with the same artistic care as couture details or architectural features—as integral components of the celebration's story rather than exotic additions.\"\n\nConsider how traditional practices can be elevated through refined execution. For example, the Hawaiian tradition of forming a circle for significant moments can be enhanced through thoughtful floral design that creates a visually stunning yet culturally authentic space. Similarly, traditional music gains power when performed by master musicians using exceptional instruments in an acoustically considered setting.\n\nThe incorporation of Hawaiian language offers another opportunity for meaningful cultural connection. Having key ceremony phrases spoken in both Hawaiian and English—with proper pronunciation and respect for linguistic tradition—adds layers of significance that guests will remember long after the celebration concludes.\n\nPerhaps most importantly, true luxury lies in connections with the most respected cultural practitioners. \"The difference between a standard performance and a transcendent cultural experience comes down to the depth of knowledge and mana (spiritual power) of the practitioners involved,\" notes Kealoha. \"The most exclusive properties maintain relationships with cultural advisors who only participate in select celebrations where their knowledge will be properly honored.\"\n\nWhen approached with genuine respect and sophistication, Hawaiian cultural elements transform a luxury wedding from a beautiful event into an unforgettable experience rooted in the authentic spirit of the islands.",
    category: "culture",
    featured_image: "https://images.pexels.com/photos/931887/pexels-photo-931887.jpeg?auto=compress&cs=tinysrgb&w=800",
    created_at: "November 18, 2024",
    is_published: true,
    author: {
      id: 3,
      name: "Nani Kahale",
      image_url: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      bio: "Former luxury event planner turned photography consultant who bridges the gap between planning vision and photographic execution."
    },
    read_time: "8 min read"
  }
];

// Updated categories
const categories = [
  { id: 1, name: 'all', label: 'All Articles' },
  { id: 2, name: 'weddings', label: 'Weddings' },
  { id: 3, name: 'venues', label: 'Venues' },
  { id: 4, name: 'planning', label: 'Planning' },
  { id: 5, name: 'photography', label: 'Photography' },
  { id: 6, name: 'culture', label: 'Cultural Elements' }
];

// Luxury focused recent posts for the homepage
const recentPosts = [
  {
    id: 1,
    title: "How to Plan a Destination Wedding in Hawaii Without Visiting First",
    excerpt: "Expert guidance on planning your perfect Hawaiian wedding from afar, with insider tips on selecting venues and coordinating with premium vendors.",
    image: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "April 10, 2025",
    author: "Leilani Kealoha",
    authorImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 2,
    title: "Top 5 Luxury Resorts for a Hawaiian Wedding (with Photo Examples)",
    excerpt: "Discover Hawaii's most exclusive wedding venues, from pristine private beaches to luxurious estate settings with breathtaking ocean views.",
    image: "https://images.pexels.com/photos/1179156/pexels-photo-1179156.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "March 25, 2025",
    author: "Kona Mitchell",
    authorImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 3,
    title: "What Your Wedding Planner Wishes You Knew About Hiring Photo/Video Teams",
    excerpt: "Exclusive insights from Hawaii's premier wedding planners on selecting photography and cinematography that elevates your celebration.",
    image: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "February 18, 2025",
    author: "Nani Kahale",
    authorImage: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
  }
];

export async function getPosts(): Promise<BlogPost[]> {
  try {
    console.log('Fetching all posts...');
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        authors(id, name, image_url, bio)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts from Supabase:', error);
      return blogPosts; // Return mock data on error
    }

    if (!data || data.length === 0) {
      console.log('No posts found in database, returning mock data');
      return blogPosts; // Return mock data if no real data
    }

    console.log('Fetched posts from database:', data.length);

    // Format the posts to match the expected structure
    return data.map(post => {
      // Format created_at date
      const created_at = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        ...post,
        author: post.authors || defaultAuthor,
        created_at
      };
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    return blogPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log(`Fetching post with slug: ${slug}`);
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
      return blogPosts.find(post => post.slug === slug) || null;
    }

    if (!data) {
      console.log(`No post found with slug ${slug}, returning mock data`);
      return blogPosts.find(post => post.slug === slug) || null;
    }

    console.log('Post data retrieved:', data);
    
    // Format created_at date
    const created_at = new Date(data.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      ...data,
      author: data.authors || defaultAuthor,
      created_at
    };
  } catch (err) {
    console.error(`Error fetching post with slug ${slug}:`, err);
    return blogPosts.find(post => post.slug === slug) || null;
  }
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    console.log(`Fetching posts for category: ${category}`);
    // If category is 'all', return all posts
    if (category === 'all') {
      return getPosts();
    }

    // Otherwise, fetch posts in this category
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
      return blogPosts.filter(post => post.category === category);
    }

    if (!data || data.length === 0) {
      console.log(`No posts found for category ${category}, returning mock data`);
      return blogPosts.filter(post => post.category === category);
    }

    console.log(`Fetched ${data.length} posts for category ${category}`);
    
    // Format the posts
    return data.map(post => {
      // Format created_at date
      const created_at = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        ...post,
        author: post.authors || defaultAuthor,
        created_at
      };
    });
  } catch (err) {
    console.error(`Error fetching posts for category ${category}:`, err);
    return blogPosts.filter(post => post.category === category);
  }
}

export function getCategories() {
  return Promise.resolve(categories);
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
  try {
    console.log(`Searching posts with query: ${query}`);
    // Search posts in Supabase
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
      return blogPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (!data || data.length === 0) {
      console.log(`No posts found for search query ${query}, returning filtered mock data`);
      return blogPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
    }

    console.log(`Found ${data.length} posts for search query: ${query}`);
    
    // Format the posts
    return data.map(post => {
      // Format created_at date
      const created_at = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        ...post,
        author: post.authors || defaultAuthor,
        created_at
      };
    });
  } catch (err) {
    console.error(`Error searching posts with query ${query}:`, err);
    return blogPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function getRecentPosts() {
  try {
    console.log('Fetching recent posts...');
    const posts = await getPosts();
    // Return the first 3 most recent posts
    console.log(`Returning ${Math.min(posts.length, 3)} recent posts`);
    return posts.slice(0, 3);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return recentPosts;
  }
}
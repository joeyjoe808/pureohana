import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  Save, 
  XCircle, 
  ChevronLeft, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import FileUploader from '../../components/ui/FileUploader';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, author:authors(id, name)')
        .order('created_at', { ascending: false });
      
      if (postsError) {
        console.error('Error fetching posts:', postsError);
        throw postsError;
      }
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('label', { ascending: true });
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        throw categoriesError;
      }
      
      // Fetch authors
      const { data: authorsData, error: authorsError } = await supabase
        .from('authors')
        .select('*');
      
      if (authorsError) {
        console.error('Error fetching authors:', authorsError);
        throw authorsError;
      }
      
      console.log('Fetched data:', { posts: postsData, categories: categoriesData, authors: authorsData });
      
      // Use the data from the database or fallback
      setPosts(postsData || []);
      setCategories(categoriesData || [
        { id: 1, name: 'weddings', label: 'Weddings' },
        { id: 2, name: 'venues', label: 'Venues' },
        { id: 3, name: 'planning', label: 'Planning' },
        { id: 4, name: 'photography', label: 'Photography' },
        { id: 5, name: 'culture', label: 'Cultural Elements' }
      ]);
      setAuthors(authorsData || [
        { 
          id: 1, 
          name: 'Leilani Kealoha',
          image_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
          bio: 'Luxury wedding photographer and creative director specializing in sophisticated celebrations across the Hawaiian islands.'
        }
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      showNotification('error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category: '',
      author_id: authors.length > 0 ? authors[0].id : null,
      read_time: '5 min read',
      is_published: false
    });
    setIsEditing(true);
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!currentPost.title || !currentPost.slug || !currentPost.category || !currentPost.author_id) {
      showNotification('error', 'Please fill out all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Generate slug if it's empty
      if (!currentPost.slug) {
        currentPost.slug = currentPost.title
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/\s+/g, '-');
      }

      console.log('Saving post:', currentPost);

      let result;
      if (currentPost.id) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update({
            title: currentPost.title,
            slug: currentPost.slug,
            excerpt: currentPost.excerpt,
            content: currentPost.content,
            featured_image: currentPost.featured_image,
            category: currentPost.category,
            author_id: currentPost.author_id,
            read_time: currentPost.read_time,
            is_published: currentPost.is_published,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPost.id)
          .select();

        if (error) {
          console.error('Error updating post:', error);
          throw error;
        }
        
        console.log('Post updated successfully:', data);
        result = data;
        showNotification('success', 'Post updated successfully');
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert({
            title: currentPost.title,
            slug: currentPost.slug,
            excerpt: currentPost.excerpt,
            content: currentPost.content,
            featured_image: currentPost.featured_image,
            category: currentPost.category,
            author_id: currentPost.author_id,
            read_time: currentPost.read_time,
            is_published: currentPost.is_published,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error('Error creating post:', error);
          throw error;
        }
        
        console.log('Post created successfully:', data);
        result = data;
        showNotification('success', 'Post created successfully');
      }

      fetchData();
      setIsEditing(false);
      setCurrentPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
      showNotification('error', 'Failed to save post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      fetchData();
      showNotification('success', 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification('error', 'Failed to delete post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPost({
      ...currentPost,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const generateReadTime = () => {
    if (!currentPost?.content) return '1 min read';
    
    // Estimate reading time (average reading speed: 200 words per minute)
    const wordCount = currentPost.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    return `${readTime} min read`;
  };

  const generateSlug = () => {
    if (!currentPost?.title) return '';
    
    return currentPost.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleFeaturedImageUpload = (url) => {
    setCurrentPost({
      ...currentPost,
      featured_image: url
    });
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-md shadow-lg flex items-start ${
          notification.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
          notification.type === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 
          'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertTriangle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
        </div>
      )}

      {isEditing ? (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-300 hover:text-white mr-4"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-serif text-white">
              {currentPost.id ? 'Edit Post' : 'Create New Post'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 mb-2">Title*</label>
              <input
                name="title"
                value={currentPost.title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Post Title"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Slug* 
                <button
                  type="button"
                  onClick={() => setCurrentPost({...currentPost, slug: generateSlug()})}
                  className="ml-2 text-xs text-yellow-400 hover:text-yellow-300"
                >
                  Generate from title
                </button>
              </label>
              <input
                name="slug"
                value={currentPost.slug || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="post-url-slug"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Category*</label>
              <select
                name="category"
                value={currentPost.category || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Author*</label>
              <select
                name="author_id"
                value={currentPost.author_id || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
              >
                <option value="">Select Author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">
                Reading Time 
                <button
                  type="button"
                  onClick={() => setCurrentPost({...currentPost, read_time: generateReadTime()})}
                  className="ml-2 text-xs text-yellow-400 hover:text-yellow-300"
                >
                  Calculate
                </button>
              </label>
              <input
                name="read_time"
                value={currentPost.read_time || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="5 min read"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Featured Image*</label>
              <FileUploader 
                value={currentPost.featured_image || ''}
                onChange={handleFeaturedImageUpload}
                onUploadComplete={handleFeaturedImageUpload}
                folder="blog_images"
                fileTypes={['image/*']}
                maxSizeMB={5}
                placeholder="Upload a featured image"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Excerpt*</label>
              <textarea
                name="excerpt"
                value={currentPost.excerpt || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Brief summary of the post"
                required
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Content*</label>
              <textarea
                name="content"
                value={currentPost.content || ''}
                onChange={handleInputChange}
                rows={15}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white font-mono"
                placeholder="Post content..."
                required
              ></textarea>
              <p className="text-gray-400 text-xs mt-1">
                Use blank lines to separate paragraphs. HTML is not supported.
              </p>
            </div>
            
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={currentPost.is_published || false}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="is_published" className="text-gray-300">
                Publish this post (otherwise it will be saved as a draft)
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Post
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif text-white">Blog Management</h1>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
            >
              <PlusCircle size={18} className="mr-2" />
              New Post
            </button>
          </div>
          
          <div className="bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-white">All Posts</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <>
                {filteredPosts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-slate-700">
                        <tr>
                          <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Author
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-slate-800 divide-y divide-gray-700">
                        {filteredPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{post.title}</div>
                              <div className="text-sm text-gray-400">{post.slug}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-400/20 text-yellow-300">
                                {post.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {post.author ? post.author.name : 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                post.is_published 
                                  ? 'bg-green-400/20 text-green-300' 
                                  : 'bg-gray-400/20 text-gray-300'
                              }`}>
                                {post.is_published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(post.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-3">
                                <button
                                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                  className="text-gray-400 hover:text-white"
                                  title="View Post"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => handleEdit(post)}
                                  className="text-blue-400 hover:text-blue-300"
                                  title="Edit Post"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  className="text-red-400 hover:text-red-300"
                                  title="Delete Post"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl text-gray-600 mb-4">📝</div>
                    {searchQuery ? (
                      <>
                        <h3 className="text-xl font-medium text-white mb-2">No posts found</h3>
                        <p className="text-gray-400">
                          Try adjusting your search query.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-medium text-white mb-2">No blog posts yet</h3>
                        <p className="text-gray-400 mb-6">
                          Get started by creating your first blog post.
                        </p>
                        <button
                          onClick={handleCreateNew}
                          className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors"
                        >
                          Create Post
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBlog;
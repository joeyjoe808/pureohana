import React, { useState, useEffect } from 'react';
import { supabase, blogService } from '../lib/supabase';
import { PlusCircle, Edit, Trash2, Search, Eye, Save, XCircle, ChevronLeft } from 'lucide-react';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        fetchData();
      }
    };
    
    checkUser();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: postsData } = await supabase
        .from('posts')
        .select('*, author:authors(id, name)')
        .order('created_at', { ascending: false });
      
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('label', { ascending: true });
      
      const { data: authorsData } = await supabase
        .from('authors')
        .select('*');
      
      setPosts(postsData || []);
      setCategories(categoriesData || []);
      setAuthors(authorsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;
      
      setIsLoggedIn(true);
      fetchData();
    } catch (error) {
      setLoginError(error.message || 'Failed to login');
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
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
      alert('Please fill out all required fields (title, slug, category, author)');
      return;
    }

    try {
      // Generate slug if it's empty
      if (!currentPost.slug) {
        currentPost.slug = currentPost.title
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/\s+/g, '-');
      }

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
          .eq('id', currentPost.id);

        if (error) throw error;
        result = data;
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
          });

        if (error) throw error;
        result = data;
      }

      fetchData();
      setIsEditing(false);
      setCurrentPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post: ' + error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      fetchData();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post: ' + error.message);
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

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Admin Login</h1>
          
          {loginError && (
            <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded mb-4">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-yellow-400 text-slate-900 font-medium rounded hover:bg-yellow-500 transition-colors"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>For website administrator use only</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-12 px-4">
      <div className="container mx-auto">
        {isEditing ? (
          <div className="bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-300 hover:text-white mr-4"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white">
                {currentPost.id ? 'Edit Post' : 'Create New Post'}
              </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 mb-2">Title*</label>
                <input
                  name="title"
                  value={currentPost.title}
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
                  value={currentPost.slug}
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
                  value={currentPost.category}
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
                  value={currentPost.author_id}
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
                  value={currentPost.read_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="5 min read"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Featured Image URL*</label>
                <input
                  name="featured_image"
                  value={currentPost.featured_image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Excerpt*</label>
                <textarea
                  name="excerpt"
                  value={currentPost.excerpt}
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
                  value={currentPost.content}
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
                  checked={currentPost.is_published}
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
              >
                <Save size={18} className="mr-1" />
                Save Post
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Blog Management</h1>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors mr-4 text-sm"
                >
                  Logout
                </button>
                <button
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
                >
                  <PlusCircle size={18} className="mr-1" />
                  New Post
                </button>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">All Posts</h2>
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
                                    className="text-indigo-400 hover:text-indigo-300"
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
                          <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                          <p className="text-gray-400">
                            Try adjusting your search query.
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-white mb-2">No blog posts yet</h3>
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
    </div>
  );
};

export default AdminBlog;
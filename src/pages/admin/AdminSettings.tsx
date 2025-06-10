import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, ShieldCheck, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const AdminSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    avatar_url: ''
  });

  useEffect(() => {
    async function getUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          setUserData({
            email: user.email || '',
            name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        showNotification('error', 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }

    getUserProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: userData.name,
          avatar_url: userData.avatar_url
        }
      });
      
      if (error) throw error;
      
      showNotification('success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', 'New passwords do not match');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      // In a real implementation, you would verify the current password first
      // This is a simplified example
      
      const { error } = await supabase.auth.updateUser({ 
        password: passwordData.newPassword 
      });
      
      if (error) throw error;
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showNotification('success', 'Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      showNotification('error', error.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

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
            <AlertCircle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">
          Update your profile and security preferences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {/* Profile Settings */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6 flex items-center">
            <Mail size={18} className="mr-2 text-yellow-400" />
            Profile Information
          </h2>
          
          <form onSubmit={updateProfile}>
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white disabled:opacity-70"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email address cannot be changed
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleUserDataChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  name="avatar_url"
                  value={userData.avatar_url}
                  onChange={handleUserDataChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Security Settings */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6 flex items-center">
            <ShieldCheck size={18} className="mr-2 text-yellow-400" />
            Security Settings
          </h2>
          
          <form onSubmit={updatePassword}>
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-10 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="••••••••••••"
                  minLength={8}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
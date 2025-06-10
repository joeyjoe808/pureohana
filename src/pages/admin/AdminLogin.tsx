import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, AlertTriangle, Shield, Info, ExternalLink } from 'lucide-react';
import { supabase, checkSupabaseConnection } from '../../lib/supabase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState({ checked: false, success: false, error: null });
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin');
      } else {
        // Check Supabase connection
        const status = await checkSupabaseConnection();
        setConnectionStatus({ 
          checked: true,
          success: status.success,
          error: status.success ? null : {
            message: status.error,
            details: status.details,
            code: status.code
          }
        });
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // If successful, navigate to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Error signing in:', error);
      let errorMessage = error.message || 'An error occurred during login';
      
      // Enhance error message based on error code
      if (error.status === 403 || error.code === 'PGRST301') {
        errorMessage = 'Access forbidden. Your IP may be blocked or you may need to configure CORS settings in Supabase.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setConnectionStatus({ checked: false, success: false, error: null });
    const status = await checkSupabaseConnection();
    setConnectionStatus({ 
      checked: true,
      success: status.success,
      error: status.success ? null : {
        message: status.error,
        details: status.details,
        code: status.code
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-4">
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/80 p-3 rounded-full">
            <Sparkles size={40} className="text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-slate-800/80 p-8 rounded-lg shadow-xl border border-slate-700/50">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif text-white mb-2">Pure Ohana Treasures</h1>
            <p className="text-gray-400 text-sm">Admin Portal</p>
          </div>
          
          {/* Connection Status */}
          {connectionStatus.checked && (
            <div className={`mb-6 ${connectionStatus.success ? 
              'bg-green-500/10 border border-green-500/30 text-green-400' : 
              'bg-red-500/10 border border-red-500/30 text-red-400'} rounded-md p-4 flex items-start`}>
              {connectionStatus.success ? (
                <>
                  <Shield size={18} className="mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Connection successful</p>
                    <p className="text-sm mt-1">Your connection to Supabase is working correctly.</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Connection error</p>
                    <p className="text-sm mt-1">{connectionStatus.error?.message}</p>
                    {connectionStatus.error?.details && (
                      <p className="text-sm mt-1">Details: {connectionStatus.error.details}</p>
                    )}
                    {connectionStatus.error?.code && (
                      <p className="text-sm mt-1">Code: {connectionStatus.error.code}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* CORS Information */}
          <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-md p-4 flex items-start">
            <Info size={18} className="text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-300">
                <strong>Connection Issues?</strong> If you're seeing a 403 Forbidden error or the connection test fails:
              </p>
              <ol className="text-xs text-blue-300 mt-2 list-decimal pl-4 space-y-1">
                <li>Go to your <a href="https://app.supabase.com" target="_blank" rel="noreferrer" className="underline hover:text-blue-200 flex items-center">Supabase Dashboard<ExternalLink size={10} className="ml-1" /></a></li>
                <li>Select your project, then go to Project Settings → API</li>
                <li>Under "API Settings", make sure "Row Level Security (RLS)" is enabled</li>
                <li>Under "JWT Settings", check your JWT expiry time (default is 3600s)</li>
                <li>Scroll down to "CORS" and add your website URL: <code className="px-1 py-0.5 bg-blue-500/20 rounded">http://localhost:5173</code> or <code className="px-1 py-0.5 bg-blue-500/20 rounded">https://your-domain.com</code></li>
              </ol>
              <button 
                className="mt-2 text-xs text-blue-300 underline"
                onClick={handleTestConnection}
              >
                Test connection again
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start">
              <AlertTriangle size={18} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="admin@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-slate-900 py-3 px-4 rounded hover:bg-yellow-500 transition-colors font-medium flex justify-center items-center"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24">
                      <circle className="opacity-25\" cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" strokeWidth=\"4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>For website administrator use only</p>
          <p className="mt-1">© {new Date().getFullYear()} Pure Ohana Treasures</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
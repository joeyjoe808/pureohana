import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Info, RefreshCw, ExternalLink } from 'lucide-react';
import { checkSupabaseConnection } from '../../lib/supabase';

const ConnectionTester = () => {
  const [status, setStatus] = useState({
    loading: true,
    success: false,
    error: null,
    details: null
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus({ loading: true, success: false, error: null, details: null });
    
    try {
      const result = await checkSupabaseConnection();
      
      if (result.success) {
        setStatus({
          loading: false,
          success: true,
          error: null,
          details: null
        });
      } else {
        setStatus({
          loading: false,
          success: false,
          error: result.error,
          details: result.details
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: error.message,
        details: 'Unexpected error checking connection'
      });
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-medium text-white mb-4">Supabase Connection Status</h2>
      
      <div className={`p-4 rounded-md ${
        status.loading ? 'bg-slate-700/50 text-white' :
        status.success ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
        'bg-red-500/10 border border-red-500/30 text-red-400'
      }`}>
        {status.loading ? (
          <div className="flex items-center">
            <RefreshCw size={18} className="animate-spin mr-3 flex-shrink-0" />
            <p>Testing connection to Supabase...</p>
          </div>
        ) : status.success ? (
          <div className="flex items-start">
            <Shield size={18} className="mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Connection successful</p>
              <p className="text-sm mt-1">Your connection to Supabase is working correctly.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <AlertTriangle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Connection failed</p>
              <p className="text-sm mt-1">{status.error}</p>
              {status.details && (
                <p className="text-sm mt-1">Details: {status.details}</p>
              )}
              
              <div className="mt-3 bg-slate-800/70 p-3 rounded text-white text-sm">
                <p className="font-medium mb-1">Troubleshooting steps:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Check that your Supabase project is active</li>
                  <li>Verify your environment variables are correct</li>
                  <li>Make sure CORS settings are configured for your domain</li>
                  <li>Check browser console for more detailed error information</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={testConnection}
          className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors flex items-center"
        >
          <RefreshCw size={16} className="mr-2" />
          Retest Connection
        </button>
        
        <a
          href="https://supabase.com/docs/guides/auth/troubleshooting"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 flex items-center text-sm hover:text-blue-300"
        >
          <Info size={16} className="mr-1" />
          Troubleshooting Guide
          <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default ConnectionTester;
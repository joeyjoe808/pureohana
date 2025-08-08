import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AdminBasic = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Simple password check
  const handleLogin = () => {
    if (password === 'ohana2024') {
      setIsLoggedIn(true);
    } else {
      alert('Wrong password!');
    }
  };

  // Handle file upload to Supabase
  const handleUpload = async (section: string, file: File) => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setUploading(section);
    setUploadStatus('Uploading...');

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${section}_${timestamp}.${fileExt}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('pureohanatreasures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const publicUrl = `https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/${fileName}`;
      
      setUploadStatus(`✅ Uploaded! New URL: ${publicUrl}`);
      console.log(`${section} updated with:`, publicUrl);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setUploadStatus('');
        setUploading(null);
      }, 5000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('❌ Upload failed. Please try again.');
      setUploading(null);
    }
  };

  // Show login screen
  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <h1>Admin Login</h1>
        <div style={{ marginTop: '20px' }}>
          <input 
            type="password" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', width: '200px' }}
          />
          <button 
            onClick={handleLogin}
            style={{ 
              padding: '10px 20px', 
              marginLeft: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
        <p style={{ marginTop: '20px', color: '#666' }}>Password hint: ohana2024</p>
      </div>
    );
  }

  // Show admin panel
  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Photo Upload Admin Panel</h1>
      <p>Welcome! You're logged in.</p>
      
      <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Upload Photos to Supabase</h2>
        <p>Select a section to update:</p>
        
        {/* Status message */}
        {uploadStatus && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: uploadStatus.includes('✅') ? '#d4edda' : uploadStatus.includes('❌') ? '#f8d7da' : '#cfe2ff',
            color: uploadStatus.includes('✅') ? '#155724' : uploadStatus.includes('❌') ? '#721c24' : '#004085',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {uploadStatus}
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Hero Image</h3>
            <input 
              type="file" 
              accept="image/*" 
              id="hero-input"
              disabled={uploading === 'hero'}
            />
            <button 
              onClick={() => {
                const input = document.getElementById('hero-input') as HTMLInputElement;
                if (input?.files?.[0]) {
                  handleUpload('hero', input.files[0]);
                }
              }}
              disabled={uploading === 'hero'}
              style={{ 
                marginTop: '10px', 
                padding: '8px 16px',
                backgroundColor: uploading === 'hero' ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: uploading === 'hero' ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading === 'hero' ? 'Uploading...' : 'Upload to Supabase'}
            </button>
          </div>
          
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Portfolio 1</h3>
            <input 
              type="file" 
              accept="image/*" 
              id="portfolio1-input"
              disabled={uploading === 'portfolio1'}
            />
            <button 
              onClick={() => {
                const input = document.getElementById('portfolio1-input') as HTMLInputElement;
                if (input?.files?.[0]) {
                  handleUpload('portfolio1', input.files[0]);
                }
              }}
              disabled={uploading === 'portfolio1'}
              style={{ 
                marginTop: '10px', 
                padding: '8px 16px',
                backgroundColor: uploading === 'portfolio1' ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: uploading === 'portfolio1' ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading === 'portfolio1' ? 'Uploading...' : 'Upload to Supabase'}
            </button>
          </div>
          
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Portfolio 2</h3>
            <input 
              type="file" 
              accept="image/*" 
              id="portfolio2-input"
              disabled={uploading === 'portfolio2'}
            />
            <button 
              onClick={() => {
                const input = document.getElementById('portfolio2-input') as HTMLInputElement;
                if (input?.files?.[0]) {
                  handleUpload('portfolio2', input.files[0]);
                }
              }}
              disabled={uploading === 'portfolio2'}
              style={{ 
                marginTop: '10px', 
                padding: '8px 16px',
                backgroundColor: uploading === 'portfolio2' ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: uploading === 'portfolio2' ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading === 'portfolio2' ? 'Uploading...' : 'Upload to Supabase'}
            </button>
          </div>
          
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Portfolio 3</h3>
            <input 
              type="file" 
              accept="image/*" 
              id="portfolio3-input"
              disabled={uploading === 'portfolio3'}
            />
            <button 
              onClick={() => {
                const input = document.getElementById('portfolio3-input') as HTMLInputElement;
                if (input?.files?.[0]) {
                  handleUpload('portfolio3', input.files[0]);
                }
              }}
              disabled={uploading === 'portfolio3'}
              style={{ 
                marginTop: '10px', 
                padding: '8px 16px',
                backgroundColor: uploading === 'portfolio3' ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: uploading === 'portfolio3' ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading === 'portfolio3' ? 'Uploading...' : 'Upload to Supabase'}
            </button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => setIsLoggedIn(false)}
        style={{ 
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminBasic;
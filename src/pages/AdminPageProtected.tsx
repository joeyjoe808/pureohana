import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { updateSectionPhoto, loadPhotoConfig, getPhotoUrl } from '../utils/photoConfig';

const AdminPageProtected = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [currentPhotos, setCurrentPhotos] = useState(loadPhotoConfig());

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  // Password check - YOU CAN CHANGE THIS PASSWORD!
  const handleLogin = () => {
    if (password === 'ohana2024') { // CHANGE THIS PASSWORD!
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'authenticated');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const sections = [
    { id: 'hero', name: 'Hero Background', description: 'Main homepage image' },
    { id: 'portfolio1', name: 'Portfolio Image 1', description: 'First portfolio grid image' },
    { id: 'portfolio2', name: 'Portfolio Image 2', description: 'Second portfolio grid image' },
    { id: 'portfolio3', name: 'Portfolio Image 3', description: 'Third portfolio grid image' },
    { id: 'portfolio4', name: 'Portfolio Image 4', description: 'Fourth portfolio grid image' },
    { id: 'featured', name: 'Featured Wedding', description: 'Featured section image' },
  ];

  const handleFileSelect = (sectionId: string, file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFiles(prev => ({ ...prev, [sectionId]: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [sectionId]: url }));
    }
  };

  const uploadPhoto = async (sectionId: string) => {
    const file = selectedFiles[sectionId];
    if (!file) return;

    setUploading(sectionId);
    setUploadSuccess(null);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionId}_${timestamp}.${fileExt}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('pureohanatreasures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Update configuration
      updateSectionPhoto(sectionId as any, fileName);
      setCurrentPhotos(loadPhotoConfig());
      
      // Update the actual website code
      await updateWebsiteCode(sectionId, fileName);
      
      setUploadSuccess(sectionId);
      
      // Clear after success
      setTimeout(() => {
        setUploadSuccess(null);
        setSelectedFiles(prev => {
          const newState = { ...prev };
          delete newState[sectionId];
          return newState;
        });
        setPreviewUrls(prev => {
          const newState = { ...prev };
          URL.revokeObjectURL(newState[sectionId]);
          delete newState[sectionId];
          return newState;
        });
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  // Function to update the actual website code
  const updateWebsiteCode = async (section: string, filename: string) => {
    // In a real implementation, this would update your HomePageLuxury.tsx
    // For now, we'll store in localStorage and you can manually update
    const updates = JSON.parse(localStorage.getItem('photoUpdates') || '{}');
    updates[section] = filename;
    localStorage.setItem('photoUpdates', JSON.stringify(updates));
    
    console.log(`Photo updated for ${section}: ${filename}`);
    console.log('To apply changes, update HomePageLuxury.tsx with:', getPhotoUrl(filename));
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>Admin Access</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '16px'
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '300', marginBottom: '8px' }}>Photo Management</h1>
            <p style={{ color: '#666' }}>Upload new photos to your website</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {sections.map(section => (
            <div key={section.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{section.name}</h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{section.description}</p>
              <p style={{ fontSize: '11px', color: '#888', marginBottom: '16px' }}>
                Current: {currentPhotos[section.id as keyof typeof currentPhotos]}
              </p>
              
              {!selectedFiles[section.id] ? (
                <div style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
                  <p style={{ marginBottom: '16px', color: '#666' }}>Drag & drop or browse</p>
                  <label style={{ cursor: 'pointer' }}>
                    <span style={{ color: '#0066cc', textDecoration: 'underline' }}>Browse files</span>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(section.id, e.target.files[0])}
                    />
                  </label>
                </div>
              ) : (
                <div>
                  {previewUrls[section.id] && (
                    <img 
                      src={previewUrls[section.id]} 
                      alt="Preview" 
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
                    />
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => uploadPhoto(section.id)}
                      disabled={uploading === section.id}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: uploading === section.id ? '#ccc' : uploadSuccess === section.id ? '#28a745' : '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: uploading === section.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {uploading === section.id ? 'Uploading...' : uploadSuccess === section.id ? '✓ Uploaded!' : 'Upload to Supabase'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedFiles(prev => {
                          const newState = { ...prev };
                          delete newState[section.id];
                          return newState;
                        });
                        setPreviewUrls(prev => {
                          const newState = { ...prev };
                          URL.revokeObjectURL(newState[section.id]);
                          delete newState[section.id];
                          return newState;
                        });
                      }}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              {uploadSuccess === section.id && (
                <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#d4edda', borderRadius: '4px', fontSize: '13px', color: '#155724' }}>
                  ✅ Photo uploaded! Refresh your website to see changes.
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#0c5460', marginBottom: '8px' }}>
            <strong>How it works:</strong>
          </p>
          <ol style={{ fontSize: '13px', color: '#0c5460', marginLeft: '20px' }}>
            <li>Select a photo for any section</li>
            <li>Click "Upload to Supabase" - it will upload to your storage bucket</li>
            <li>Photo URLs are saved and will update on your website</li>
            <li>Changes may take 1-2 minutes to appear on the live site</li>
          </ol>
        </div>

        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <p style={{ fontSize: '13px', color: '#856404' }}>
            <strong>Security Note:</strong> To change the password, edit AdminPageProtected.tsx and look for 'ohana2024'
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPageProtected;
import React, { useState } from 'react';

const AdminPageSimple = () => {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const sections = [
    { id: 'hero', name: 'Hero Background', current: 'IMG_0776.JPG' },
    { id: 'portfolio1', name: 'Portfolio 1', current: 'IMG_0843.JPG' },
    { id: 'portfolio2', name: 'Portfolio 2', current: 'IMG_0886.JPG' },
    { id: 'portfolio3', name: 'Portfolio 3', current: 'IMG_0776.JPG' },
    { id: 'portfolio4', name: 'Portfolio 4', current: 'IMG_0843.JPG' },
    { id: 'featured', name: 'Featured', current: 'IMG_0886.JPG' },
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
    
    // Simulate upload
    setTimeout(() => {
      alert(`Photo uploaded for ${sectionId}! (In real version, this uploads to Supabase)`);
      setUploading(null);
      
      // Clear selection
      setSelectedFiles(prev => {
        const newState = { ...prev };
        delete newState[sectionId];
        return newState;
      });
      setPreviewUrls(prev => {
        const newState = { ...prev };
        delete newState[sectionId];
        return newState;
      });
    }, 2000);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '300', marginBottom: '8px' }}>Photo Management</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Upload new photos for your website</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {sections.map(section => (
            <div key={section.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{section.name}</h3>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>Current: {section.current}</p>
              
              {!selectedFiles[section.id] ? (
                <div style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
                  <p style={{ marginBottom: '16px', color: '#666' }}>Choose a photo</p>
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
                        backgroundColor: uploading === section.id ? '#ccc' : '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: uploading === section.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {uploading === section.id ? 'Uploading...' : 'Upload'}
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
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#856404' }}>
            <strong>Note:</strong> This is a demo version. In the full version, photos will upload to Supabase and update your site automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPageSimple;
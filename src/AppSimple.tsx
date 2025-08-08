import React from 'react';

function AppSimple() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ color: 'black', fontSize: '48px' }}>PURE OHANA TREASURES</h1>
      <p style={{ color: 'gray', fontSize: '24px' }}>Site is loading!</p>
      <div style={{ marginTop: '40px' }}>
        <a href="/admin" style={{ 
          padding: '15px 30px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          Go to Admin Panel
        </a>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ 
          padding: '15px 30px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          View Main Site
        </a>
      </div>
    </div>
  );
}

export default AppSimple;
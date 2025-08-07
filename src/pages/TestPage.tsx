import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '50px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'black', fontSize: '48px' }}>TEST PAGE - CAN YOU SEE THIS?</h1>
      <p style={{ color: 'red', fontSize: '24px' }}>If you can see this red text, the site is loading!</p>
      
      <div style={{ marginTop: '50px' }}>
        <h2>Image Test:</h2>
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=500" 
          alt="Test" 
          style={{ width: '500px', height: '300px', objectFit: 'cover' }}
        />
      </div>
      
      <div style={{ marginTop: '50px', backgroundColor: 'blue', color: 'white', padding: '20px' }}>
        <p>Blue background test box</p>
      </div>
    </div>
  );
};

export default TestPage;
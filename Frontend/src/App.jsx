import { useState } from 'react';
import Home from './pages/Home'
import Admin from './pages/Admin'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
      {currentPage === 'home' && <Home />}
      {currentPage === 'admin' && <Admin />}
      <button 
        onClick={() => setCurrentPage(currentPage === 'home' ? 'admin' : 'home')}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          zIndex: 1000
        }}
      >
        {currentPage === 'home' ? '📊 Admin Panel' : '🏠 Home'}
      </button>
    </div>
  );
}

export default App

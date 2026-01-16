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
          left: '20px',
          padding: '10px 16px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '12px',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.9)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.7)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        {currentPage === 'home' ? '⚙️ Admin' : '🏠 Home'}
      </button>
    </div>
  );
}

export default App

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Signup from './pages/Signup';
import Signin from './pages/Signin';

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // to know current page

  const isHome = location.pathname === '/';

  const togglePage = () => {
    if (isHome) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>

      {/* Toggle Button */}
      <button 
        onClick={togglePage}
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
        {isHome ? '⚙️ Admin' : '🏠 Home'}
      </button>
    </div>
  );
}

export default App;

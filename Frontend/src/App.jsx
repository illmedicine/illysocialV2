import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RndLab from './pages/RndLab';
import Admin from './pages/Admin';
import Login from './pages/Login';
import CreatorsDashboard from './pages/CreatorsDashboard';
import CreatorsCorner from './pages/CreatorsCorner';
import ProtectedRoute from './components/ProtectedRoute';

// react-router navigates client-side without a full page load, so gtag's
// one-shot pageview on initial load never sees route changes. Fire a
// page_view event on every route change so GA4 tracks the SPA properly.
function useGtagPageviews() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search + location.hash,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [location]);
}

function App() {
  useGtagPageviews();
  return (
    <div>
      <Routes>
        {/* The immersive Illy R&D Labs walk is the landing; the storefront moves to /explore. */}
        <Route path="/" element={<RndLab />} />
        <Route path="/explore" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        {/* Google-only auth — both routes render the same sign-in screen. */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CreatorsDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/movie/:nickname" element={<CreatorsCorner />} />
        {/* Unknown routes fall back to home. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

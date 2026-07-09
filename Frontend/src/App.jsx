import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import CreatorsDashboard from './pages/CreatorsDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
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
        {/* Unknown routes fall back to home. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

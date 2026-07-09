import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Guards authenticated-only routes (e.g. the Creators Dashboard). Unauthenticated
// visitors are redirected to the Google sign-in screen.
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;

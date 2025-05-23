import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';


function ProtectedRoute({ children, staffOnly }) {
  const { user, loading } = useContext(AuthContext);

  console.log('ProtectedRoute - user:', user, 'loading:', loading);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /login');
    return <Navigate to="/login" />;
  }

  if (staffOnly && user.role !== 'staff') {
    console.log('ProtectedRoute: Not staff, redirecting to /menu');
    return <Navigate to="/menu" />;
  }

  return children;
}

export default ProtectedRoute;
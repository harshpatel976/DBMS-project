import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


function Dashboard() {
  const { user } = useContext(AuthContext);

  console.log('Dashboard - user:', user);

  return (
    <div className="container">
      <h2>Welcome, {user?.username || 'User'}!</h2>
      <p>Role: {user?.role || 'Unknown'}</p>
      <p>Use the navigation bar to explore Menu, Orders, or Inventory (staff only).</p>
    </div>
  );
}

export default Dashboard;
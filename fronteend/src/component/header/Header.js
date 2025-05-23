import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [studentTotal, setStudentTotal] = useState(0);

  useEffect(() => {
    const fetchStudentOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          credentials: 'include',
        });
        const data = await res.json();

        if (res.ok && user?.role === 'student') {
          const studentOrders = data.filter(order =>
  order.userId === user._id || order.userId?._id === user._id
);
          const total = studentOrders.reduce((sum, order) => sum + (order.total || 0), 0);
          setStudentTotal(total);
          console.log("total amount", total)
        }
      } catch (err) {
        console.error('Error fetching student orders:', err);
      }
    };

    if (user?.role === 'student') {
      fetchStudentOrders();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">Canteen</div>
      <ul className="nav-links">
        {user ? (
          <>
            {user.role === 'student' && (
              <>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><span>Total Spent: ₹{studentTotal}</span></li>
              </>
            )}
            {user.role === 'staff' && (
              <>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/stafforder">Orders</Link></li>
                <li><Link to="/inventory">Inventory</Link></li>
                <li><Link to="/menu-management">Menu Management</Link></li>
              </>
            )}
            <li><button className="nav-button" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

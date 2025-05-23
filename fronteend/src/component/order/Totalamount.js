import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function StudentTotalOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      const studentOrders = data.filter(order =>
        order.userId === user._id || order.userId?._id === user._id
      );

      setOrders(studentOrders);
      const total = studentOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      setTotalAmount(total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'student') {
      fetchOrders();
    } else {
      setError('Only students can view this page.');
      setLoading(false);
    }

    // Listen for "orderPlaced" event
    const handleOrderPlaced = () => {
      setLoading(true);
      fetchOrders();
    };

    window.addEventListener('orderPlaced', handleOrderPlaced);

    return () => {
      window.removeEventListener('orderPlaced', handleOrderPlaced);
    };
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Total Amount You Spent</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div>
          <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
          <p><strong>Number of Orders:</strong> {orders.length}</p>
        </div>
      )}
    </div>
  );
}

export default StudentTotalOrders;

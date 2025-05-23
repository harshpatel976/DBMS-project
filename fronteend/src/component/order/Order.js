import { useEffect, useState } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          credentials: 'include', // for session-based auth
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // ✅ Empty array to avoid useEffect warning

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && orders.length === 0 && <p>No orders found.</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px',
              width: '300px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h4>Order ID: {order._id}</h4>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.quantity}x {item.menuItemId?.name || 'Item'} (₹{item.menuItemId?.price || 'N/A'})
                </li>
              ))}
            </ul>
            <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function StaffOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/staff', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.error || 'Failed to load staff orders');
        }
      } catch (err) {
        console.error('Error fetching staff orders:', err);
        setError('Error fetching staff orders');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'staff') {
      fetchStaffOrders();
    } else {
      setError('Access denied. Staff only.');
      setLoading(false);
    }
  }, [user?.role]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update order in state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error updating order status');
    }
  };

  return (
    <> <h2 style={{ textAlign:"center"}}>Staff Orders</h2>
    <div style={{ padding: '20px' , display:"flex", flexWrap:'wrap', justifyContent:'space-between' }}>
    
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{ border: '2px solid #ccc', padding: '15px', margin: '10px 0' , backgroundColor:"#FFFFFF", borderRadius:"12px" , width:"400px"}}
          >
            <h4>Order #{order._id}</h4>
            <p><strong>User:</strong> {order.userId?.username || 'Unknown'}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.quantity}x {item.menuItemId?.name || 'Item'} (₹{item.menuItemId?.price})
                </li>
              ))}
            </ul>

            {order.status === 'pending' && (
              <button onClick={() => updateOrderStatus(order._id, 'ready')} style={{ marginTop: '10px' }}>
                Mark as Ready
              </button>
            )}

            {order.status === 'ready' && (
              <button onClick={() => updateOrderStatus(order._id, 'picked_up')} style={{ marginTop: '10px' }}>
                Mark as Picked Up
              </button>
            )}
          </div>
        ))
      )}
    </div>
    </>
  );
}

export default StaffOrders;

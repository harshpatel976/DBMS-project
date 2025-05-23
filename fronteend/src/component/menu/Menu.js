import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Menu() {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/menu', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setMenuItems(Array.isArray(data) ? data : []);
          setError('');
        } else {
          setError(data.error || 'Failed to load menu items');
        }
      } catch (err) {
        console.error('Menu fetch error:', err);
        setError('Error fetching menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleOrder = async (item) => {
    if (!user) {
      setMessage('Please log in to place an order.');
      return;
    }

    const orderPayload = {
      userId: user._id,
      items: [
        {
          menuItemId: item._id,
          quantity: 1,
        },
      ],
      total: item.price,
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Order placed successfully! Order ID: ${data._id || 'N/A'}`);
        setError('');
      } else {
        setError(data.error || 'Order failed.');
        setMessage('');
      }
    } catch (err) {
      console.error('Order error:', err);
      setError('Something went wrong while placing the order.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Menu</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading menu items...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div
                key={item._id}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  width: '250px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2em' }}>{item.name || 'Unnamed Item'}</h3>
                {item.description && <p style={{ margin: '5px 0', color: '#555' }}>{item.description}</p>}
                <p style={{ margin: '5px 0' }}><strong>Category:</strong> {item.category || 'Uncategorized'}</p>
                <p style={{ margin: '5px 0' }}><strong>Price:</strong> ₹{item.price ? item.price.toFixed(2) : 'N/A'}</p>
                <p style={{ margin: '5px 0' }}><strong>Availability:</strong> {item.available ? 'Available' : 'Unavailable'}</p>
                <button
                  onClick={() => handleOrder(item)}
                  disabled={!item.available}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: item.available ? '#007bff' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: item.available ? 'pointer' : 'not-allowed',
                    marginTop: '10px',
                  }}
                >
                  Order
                </button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%' }}>No menu items available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Menu;

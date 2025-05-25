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
    <div
      style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '1.75rem',
          color: '#1a202c',
        }}
      >
        Menu
      </h2>
      {error && (
        <p
          style={{
            color: '#b91c1c',
            background: '#fee2e2',
            padding: '12px',
            borderRadius: '4px',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          {error}
        </p>
      )}
      {message && (
        <p
          style={{
            color: '#15803d',
            background: '#dcfce7',
            padding: '12px',
            borderRadius: '4px',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          {message}
        </p>
      )}
      {loading ? (
        <p
          style={{
            textAlign: 'center',
            color: '#4b5563',
            fontSize: '1rem',
          }}
        >
          Loading menu items...
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div
                key={item._id}
                style={{
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  width: '280px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name || 'Menu Item'}
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      marginBottom: '8px',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: item.image ? 'none' : 'block',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    marginBottom: '8px',
                  }}
                >
                  No image available
                </div>
                <h3
                  style={{
                    margin: '0',
                    fontSize: '1.25rem',
                    color: '#1a202c',
                    fontWeight: '600',
                  }}
                >
                  {item.name || 'Unnamed Item'}
                </h3>
                {item.description && (
                  <p
                    style={{
                      margin: '0',
                      color: '#4b5563',
                      fontSize: '0.875rem',
                      lineHeight: '1.4',
                    }}
                  >
                    {item.description}
                  </p>
                )}
                <p
                  style={{
                    margin: '0',
                    color: '#2d3748',
                    fontSize: '0.875rem',
                  }}
                >
                  <strong>Category:</strong> {item.category || 'Uncategorized'}
                </p>
                <p
                  style={{
                    margin: '0',
                    color: '#2d3748',
                    fontSize: '0.875rem',
                  }}
                >
                  <strong>Price:</strong> ₹{item.price ? item.price.toFixed(2) : 'N/A'}
                </p>
                <p
                  style={{
                    margin: '0',
                    color: item.available ? '#15803d' : '#b91c1c',
                    fontSize: '0.875rem',
                  }}
                >
                  <strong>Availability:</strong> {item.available ? 'Available' : 'Unavailable'}
                </p>
                <button
                  onClick={() => handleOrder(item)}
                  disabled={!item.available}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: item.available ? '#5cb85c' : '#5cb85c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: item.available ? 'pointer' : 'not-allowed',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginTop: '12px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    if (item.available) e.target.style.backgroundColor = '#5cb85c';
                  }}
                  onMouseOut={(e) => {
                    if (item.available) e.target.style.backgroundColor = '#5cb85c';
                  }}
                >
                  Order
                </button>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: 'center',
                width: '100%',
                color: '#4b5563',
                fontSize: '1rem',
              }}
            >
              No menu items available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Menu;
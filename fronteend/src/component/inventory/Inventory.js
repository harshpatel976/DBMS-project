import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function InventoryDisplay() {
  const { user } = useContext(AuthContext);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemName: '', quantity: '', unit: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inventory', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setInventoryItems(data);
        } else {
          setError(data.error || 'Failed to load inventory');
        }
      } catch (err) {
        console.error('Inventory fetch error:', err);
        setError('Error fetching inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'staff') {
      setMessage('Only staff can add inventory items.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: newItem.itemName,
          quantity: parseFloat(newItem.quantity),
          unit: newItem.unit,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setInventoryItems([...inventoryItems, data]);
        setNewItem({ itemName: '', quantity: '', unit: '' });
        setMessage('Inventory item added successfully!');
        setError('');
      } else {
        setError(data.error || 'Failed to add inventory item');
        setMessage('');
      }
    } catch (err) {
      console.error('Error adding inventory item:', err);
      setError('Error adding inventory item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!user || user.role !== 'staff') {
      setMessage('Only staff can delete inventory items.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setInventoryItems(inventoryItems.filter((item) => item._id !== id));
        setMessage('Inventory item deleted successfully!');
        setError('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete inventory item');
        setMessage('');
      }
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      setError('Error deleting inventory item');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Inventory</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

      {user && user.role === 'staff' && (
        <form
          onSubmit={handleAddItem}
          style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}
        >
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.itemName}
            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
            required
            style={{ padding: '8px', flex: '1', minWidth: '200px' }}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            required
            min="0"
            step="0.01"
            style={{ padding: '8px', flex: '1', minWidth: '150px' }}
          />
          <input
            type="text"
            placeholder="Unit (e.g., kg, liters)"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            required
            style={{ padding: '8px', flex: '1', minWidth: '150px' }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Add Item
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading inventory...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {inventoryItems.length > 0 ? (
            inventoryItems.map((item) => (
              <div
                key={item._id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  width: '250px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2em' }}>{item.itemName || 'Unnamed Item'}</h3>
                <p style={{ margin: '5px 0' }}>
                  <strong>Quantity:</strong> {item.quantity || '0'} {item.unit || 'N/A'}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Last Updated:</strong> {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'Unknown'}
                </p>
               
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%' }}>No inventory items available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default InventoryDisplay;
  
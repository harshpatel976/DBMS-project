import { useState, useEffect } from 'react';

function MenuManagement() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true,
  });
  const [inventoryItems, setInventoryItems] = useState([{ inventoryId: '', quantityUsed: '' }]);
  const [inventoryList, setInventoryList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/inventory', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch inventory');
        const data = await response.json();
        setInventoryList(data);
      } catch (err) {
        setError('Failed to load inventory items');
      }
    };
    fetchInventory();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle inventory item changes
  const handleInventoryChange = (index, field, value) => {
    const updatedItems = [...inventoryItems];
    updatedItems[index][field] = field === 'quantityUsed' ? parseFloat(value) || '' : value;
    setInventoryItems(updatedItems);
  };

  // Add new inventory item field
  const addInventoryItem = () => {
    setInventoryItems([...inventoryItems, { inventoryId: '', quantityUsed: '' }]);
  };

  // Remove inventory item field
  const removeInventoryItem = (index) => {
    if (inventoryItems.length > 1) {
      setInventoryItems(inventoryItems.filter((_, i) => i !== index));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    const price = parseFloat(formData.price);
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number');
      return;
    }
    if (formData.image && !isValidUrl(formData.image)) {
      setError('Invalid image URL');
      return;
    }
    const validInventoryItems = inventoryItems.filter(
      (item) => item.inventoryId && !isNaN(item.quantityUsed) && item.quantityUsed > 0
    );
    if (validInventoryItems.length === 0) {
      setError('At least one valid inventory item is required');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        price,
        category: formData.category,
        image: formData.image || undefined,
        available: formData.available,
        inventoryItems: validInventoryItems,
      };

      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Menu item added successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
          available: true,
        });
        setInventoryItems([{ inventoryId: '', quantityUsed: '' }]);
      } else {
        setError(data.error || 'Failed to add menu item');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  // Validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="menu-management">
      <style>{`
        .menu-management {
          max-width: 480px;
          margin: 40px auto;
          padding: 24px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          font-size: 1.5rem;
          color: #1a202c;
          text-align: center;
          margin-bottom: 24px;
          font-weight: 600;
        }

        .error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          text-align: center;
          font-size: 0.875rem;
        }

        .success {
          background: #dcfce7;
          color: #15803d;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          text-align: center;
          font-size: 0.875rem;
        }

        .form-group {
          margin-bottom: 16px;
        }

        label {
          display: block;
          font-size: 0.875rem;
          color: #2d3748;
          font-weight: 500;
          margin-bottom: 6px;
        }

        input, select, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          border-color:#5cb85c;
          outline: none;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        .inventory-group {
          background: #f7fafc;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .inventory-group select,
        .inventory-group input {
          margin-bottom: 8px;
        }

        .remove-inventory {
          color: #c53030;
          font-size: 0.75rem;
          cursor: pointer;
          display: inline-block;
          margin-top: 4px;
        }

        .remove-inventory:hover {
          text-decoration: underline;
        }

        .add-inventory {
          width: 100%;
          padding: 8px;
          background: #edf2f7;
          color: #2d3748;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          margin-bottom: 16px;
          transition: background 0.2s;
        }

        .add-inventory:hover {
          background: #e2e8f0;
        }

        .image-preview {
          max-width: 100%;
          max-height: 96px;
          margin-top: 8px;
          border-radius: 4px;
          display: block;
        }

        .image-preview.hidden {
          display: none;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        input[type="checkbox"] {
          width: auto;
          height: 16px;
          width: 16px;
        }

        button[type="submit"] {
          width: 100%;
          padding: 10px;
          background:#5cb85c;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        button[type="submit"]:hover {
          background: #5cb85c;
        }

        @media (max-width: 480px) {
          .menu-management {
            padding: 16px;
            margin: 20px;
          }

          h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>
      <h2>Add Menu Item</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Grilled chicken with mayo"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Main">Main</option>
            <option value="Sides">Sides</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>
        <div className="form-group">
          <label>Inventory Items</label>
          {inventoryItems.map((item, index) => (
            <div key={index} className="inventory-group">
              <select
                value={item.inventoryId}
                onChange={(e) => handleInventoryChange(index, 'inventoryId', e.target.value)}
                required
              >
                <option value="">Select Inventory</option>
                {inventoryList.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.itemName} ({inv.quantity} {inv.unit})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantityUsed}
                onChange={(e) => handleInventoryChange(index, 'quantityUsed', e.target.value)}
                step="0.01"
                min="0"
                placeholder="Quantity Used"
                required
              />
              {inventoryItems.length > 1 && (
                <span
                  className="remove-inventory"
                  onClick={() => removeInventoryItem(index)}
                >
                  Remove
                </span>
              )}
            </div>
          ))}
          <button type="button" className="add-inventory" onClick={addInventoryItem}>
            Add Another Inventory Item
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="e.g., https://example.com/image.jpg"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className={`image-preview ${!formData.image || isValidUrl(formData.image) ? '' : 'hidden'}`}
              onError={(e) => {
                e.target.classList.add('hidden');
                setError('Invalid image URL');
              }}
            />
          )}
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>
        </div>
        <button type="submit">Add Menu Item</button>
      </form>
    </div>
  );
}

export default MenuManagement;
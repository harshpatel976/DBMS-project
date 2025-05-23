import { useState } from 'react';

function MenuManagement() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    availability: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        setError('Price must be a positive number');
        return;
      }
      if (!formData.name || !formData.category) {
        setError('Name and category are required');
        return;
      }
      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price,
          availability: formData.availability
        }),
        credentials: 'include'
      });
      console.log('Menu upload response:', response.status, response.statusText);
      const data = await response.json();
      console.log('Menu upload data:', data);
      if (response.ok) {
        setSuccess('Menu item added successfully!');
        setFormData({ name: '', category: '', price: '', availability: true });
      } else {
        setError(data.error || 'Failed to add menu item');
      }
    } catch (err) {
      setError('Network error');
      console.error('Menu upload error:', err);
    }
  };

  return (
    <div className="container">
      <h2>Menu Management</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form className="menu-form" onSubmit={handleSubmit}>
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
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
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
          <label htmlFor="availability">
            <input
              type="checkbox"
              id="availability"
              name="availability"
              checked={formData.availability}
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
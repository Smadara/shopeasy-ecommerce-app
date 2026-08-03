import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image: '/images/placeholder.png',
  category: '',
  countInStock: '',
};

const Admin = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  const fetchOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      countInStock: product.countInStock,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const markDelivered = async (id) => {
    await api.put(`/orders/${id}/deliver`);
    fetchOrders();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 rounded ${tab === 'products' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}
        >
          Orders
        </button>
      </div>

      {tab === 'products' && (
        <div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-3 mb-8 border p-4 rounded">
            {error && <p className="text-red-600 md:col-span-2">{error}</p>}
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="border rounded px-3 py-2" />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required className="border rounded px-3 py-2" />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required className="border rounded px-3 py-2" />
            <input name="countInStock" type="number" placeholder="Stock Count" value={form.countInStock} onChange={handleChange} required className="border rounded px-3 py-2" />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border rounded px-3 py-2 md:col-span-2" />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="border rounded px-3 py-2 md:col-span-2" />
            <button type="submit" className="bg-gray-900 text-white py-2 rounded md:col-span-2">
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </form>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.category}</td>
                  <td className="py-2">${p.price.toFixed(2)}</td>
                  <td className="py-2">{p.countInStock}</td>
                  <td className="py-2 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Order ID</th>
              <th className="py-2">User</th>
              <th className="py-2">Total</th>
              <th className="py-2">Delivered</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b">
                <td className="py-2">{o._id}</td>
                <td className="py-2">{o.user?.name}</td>
                <td className="py-2">${o.totalPrice.toFixed(2)}</td>
                <td className="py-2">{o.isDelivered ? 'Yes' : 'No'}</td>
                <td className="py-2">
                  {!o.isDelivered && (
                    <button onClick={() => markDelivered(o._id)} className="text-blue-600 underline">
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;

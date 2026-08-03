import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError('Could not load orders');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {error && <p className="text-red-600">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Order ID</th>
              <th className="py-2">Date</th>
              <th className="py-2">Total</th>
              <th className="py-2">Delivered</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-2">{order._id}</td>
                <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-2">${order.totalPrice.toFixed(2)}</td>
                <td className="py-2">{order.isDelivered ? 'Yes' : 'No'}</td>
                <td className="py-2">
                  <Link to={`/order/${order._id}`} className="text-blue-600 underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;

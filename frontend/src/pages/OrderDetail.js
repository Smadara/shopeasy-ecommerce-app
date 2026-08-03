import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError('Order not found');
      }
    };
    fetchOrder();
  }, [id]);

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!order) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-6">Order ID: {order._id}</p>

      <div className="border rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p>
          {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
        <p className="mt-2">
          Status:{' '}
          {order.isDelivered ? (
            <span className="text-green-600">Delivered</span>
          ) : (
            <span className="text-yellow-600">Pending Delivery</span>
          )}
        </p>
      </div>

      <div className="border rounded p-4 mb-6 space-y-2">
        <h2 className="font-semibold mb-2">Items</h2>
        {order.orderItems.map((item) => (
          <div key={item.product} className="flex justify-between">
            <span>
              {item.name} x {item.qty}
            </span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border rounded p-4 space-y-1">
        <p>Items Price: ${order.itemsPrice.toFixed(2)}</p>
        <p>Shipping: ${order.shippingPrice.toFixed(2)}</p>
        <p className="font-bold text-lg">Total: ${order.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderDetail;

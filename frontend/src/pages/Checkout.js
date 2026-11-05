import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + shippingPrice;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: { fullName, phone, address, city, postalCode, country },
        paymentMethod: 'Cash on Delivery', 
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return <p className="text-center mt-10">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handlePlaceOrder} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="tel"
          placeholder="Phone Number (e.g. 0771234567)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          pattern="[0-9+\s-]{9,15}"
          title="Enter a valid phone number"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      

        <div className="border-t pt-4 space-y-1">
          <p>Items: Rs.{itemsPrice.toFixed(2)}</p>
          <p>Shipping: Rs.{shippingPrice.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: Rs.{totalPrice.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          disabled={placing}
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
        >
          {placing ? 'Placing order...' : 'Place Order (Cash on Delivery)'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
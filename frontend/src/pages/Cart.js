import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{' '}
          <Link to="/" className="text-blue-600 underline">
            Go shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded bg-gray-100"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64';
                  }}
                />
                <Link to={`/product/${item._id}`} className="flex-1 font-medium">
                  {item.name}
                </Link>
                <span>${item.price.toFixed(2)}</span>
                <select
                  value={item.qty}
                  onChange={(e) => updateQty(item._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {[...Array(item.countInStock || 10).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

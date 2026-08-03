import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">
        ShopEasy
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>

        <Link to="/cart" className="relative hover:text-gray-300">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-xs rounded-full px-1.5">
              {cartCount}
            </span>
          )}
        </Link>

        {userInfo ? (
          <>
            <Link to="/myorders" className="hover:text-gray-300">
              My Orders
            </Link>
            {userInfo.isAdmin && (
              <Link to="/admin" className="hover:text-gray-300">
                Admin
              </Link>
            )}
            <span className="text-gray-400">Hi, {userInfo.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
        

      </div>
    </nav>
  );
};

export default Navbar;

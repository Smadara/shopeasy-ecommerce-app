import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `transition hover:text-white ${isActive ? 'text-white' : 'text-slate-300'}`;

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
        Home
      </NavLink>

      <NavLink to="/cart" className={linkClass} onClick={() => setOpen(false)}>
        <span className="relative inline-block">
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-5 bg-pink-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {cartCount}
            </span>
          )}
        </span>
      </NavLink>

      {userInfo ? (
        <>
          <NavLink to="/myorders" className={linkClass} onClick={() => setOpen(false)}>
            My Orders
          </NavLink>
          {userInfo.isAdmin && (
            <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          )}
          <span className="text-slate-400 text-sm">Hi, {userInfo.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          onClick={() => setOpen(false)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-medium transition"
        >
          Login
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-white/10 text-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          Shop<span className="text-indigo-400">Easy</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">{links}</div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-5 border-t border-white/10 pt-4">
          {links}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
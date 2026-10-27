import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400">
    <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <h3 className="text-2xl font-extrabold text-white mb-3">
          Shop<span className="text-indigo-400">Easy</span>
        </h3>
        <p className="max-w-sm">
          Quality products at great prices, with simple, secure and convenient
          online shopping.
        </p>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2">
          <li><Link to="/" className="hover:text-white">Home</Link></li>
          <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
          <li><Link to="/myorders" className="hover:text-white">My Orders</Link></li>
          <li><Link to="/allproducts" className="hover:text-white">All Products</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-3">Support</h4>
        <ul className="space-y-2">
          <li>support@shopeasy.com</li>
          <li>Cash on Delivery available</li>
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10 py-5 text-center text-sm">
      © {new Date().getFullYear()} ShopEasy. All rights reserved.
    </div>
  </footer>
);

export default Footer;
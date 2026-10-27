import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" fill="#94a3b8" font-family="Arial" font-size="22" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>`
  );

const ProductCard = ({ product, badge }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const stock = product.countInStock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col">
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full object-cover bg-slate-100 group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG;
          }}
        />

        {badge && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {badge}
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
          {product.category}
        </p>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-slate-900 truncate hover:text-indigo-600 transition">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 mb-3 text-sm font-medium">
          {isOutOfStock ? (
            <span className="text-red-600">Out of Stock</span>
          ) : stock <= 5 ? (
            <span className="text-orange-600">Only {stock} left</span>
          ) : (
            <span className="text-green-600">In Stock</span>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-slate-900">
              Rs {Number(product.price).toFixed(2)}
            </span>
            <Link
              to={`/product/${product._id}`}
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              View →
            </Link>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-xl font-semibold transition ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-green-600 text-white'
                : 'bg-slate-900 text-white hover:bg-indigo-600'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
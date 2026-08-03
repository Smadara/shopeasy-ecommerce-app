import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover rounded mb-3 bg-gray-100"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Product';
          }}
        />
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
      </Link>
      <p className="text-gray-500 text-sm mb-2">{product.category}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xl font-bold">Rs{product.price.toFixed(2)}</span>
        <Link
          to={`/product/${product._id}`}
          className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

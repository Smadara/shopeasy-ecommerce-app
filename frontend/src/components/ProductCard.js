
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const stock = product.countInStock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product);
      alert(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col bg-white">

      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover rounded mb-3 bg-gray-100"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/300x200?text=Product';
          }}
        />

        <h3 className="font-semibold text-lg truncate">
          {product.name}
        </h3>
      </Link>

      <p className="text-gray-500 text-sm mb-2">
        {product.category}
      </p>

      
      <div className="mb-3">
        {isOutOfStock ? (
          <span className="text-red-600 text-sm font-medium">
            Out of Stock
          </span>
        ) : stock <= 5 ? (
          <span className="text-orange-600 text-sm font-medium">
            Only {stock} left
          </span>
        ) : (
          <span className="text-green-600 text-sm font-medium">
            In Stock
          </span>
        )}
      </div>

      <div className="mt-auto">

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold">
            Rs {product.price.toFixed(2)}
          </span>

          <Link
            to={`/product/${product._id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            View
          </Link>
        </div>

        
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded font-medium transition ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-700'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;


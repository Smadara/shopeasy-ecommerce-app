import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, Number(qty));
    navigate('/cart');
  };

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-80 object-cover rounded-lg bg-gray-100"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Product';
        }}
      />

      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-4">{product.category}</p>
        <p className="text-3xl font-bold mb-4">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 mb-6">{product.description}</p>

        <p className="mb-4">
          Status:{' '}
          {product.countInStock > 0 ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </p>

        {product.countInStock > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <label>Qty:</label>
            <select
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

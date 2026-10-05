
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    'All',
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/*hero*/ }
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-blue-400 font-semibold mb-4 uppercase tracking-wide">
              Welcome to ShopEasy
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Shop Smart.
              <br />
              Live Better.
            </h1>

            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
              Discover quality products at great prices and enjoy a simple,
              secure and convenient online shopping experience.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Shop Now
              </a>

              <a
                href="#categories"
                className="border border-gray-500 hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold transition"
              >
                Explore Categories
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catogory */}
      <section id="categories" className="container mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-semibold mb-2">
            SHOP BY CATEGORY
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Find What You Need
          </h2>

          <p className="text-gray-500 mt-3">
            Browse our products by category
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);

                if (category !== 'All') {
                  document
                    .getElementById('products')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-6 py-3 rounded-lg font-medium border transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* products*/}
      {!loading && featuredProducts.length > 0 && (
        <section className="container mx-auto px-6 pb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-blue-600 font-semibold mb-2">
                FEATURED
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
            </div>

            <a
              href="#products"
              className="hidden sm:block text-blue-600 font-medium hover:underline"
            >
              View All →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      
      <section className="bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-blue-600 font-semibold mb-2">
              WHY CHOOSE US
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              Shopping Made Easy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                🚚
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Fast Delivery
              </h3>

              <p className="text-gray-500">
                Get your orders delivered quickly and conveniently
                to your doorstep.
              </p>
            </div>

          
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                🔒
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Secure Shopping
              </h3>

              <p className="text-gray-500">
                Your account and shopping experience are protected
                with secure authentication.
              </p>
            </div>

            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                💬
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Customer Support
              </h3>

              <p className="text-gray-500">
                We make online shopping simple and convenient
                for every customer.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* All products*/}
      <section id="products" className="container mx-auto px-6 py-16">

        <div className="text-center mb-10">
          <p className="text-blue-600 font-semibold mb-2">
            OUR PRODUCTS
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore All Products
          </h2>

          <p className="text-gray-500 mt-3">
            Search and find your favorite products
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 pl-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
          </div>
        </div>

        
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-16 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Explore our collection and find the products that
            are right for you.
          </p>

          <a
            href="#products"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-lg font-semibold transition"
          >
            Browse Products
          </a>

        </div>
      </section>

    </div>
  );
};

export default Home;


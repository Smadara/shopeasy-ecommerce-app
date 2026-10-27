import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const CATEGORY_ICONS = {
  Fashion: '👕',
  Electronics: '🎧',
  Shoes: '👟',
  Beauty: '💄',
};

const features = [
  { icon: '🚚', title: 'Fast Delivery', text: 'Quick and reliable delivery to your doorstep.', bg: 'bg-indigo-100' },
  { icon: '🔒', title: 'Secure Shopping', text: 'Your account is protected with secure authentication.', bg: 'bg-green-100' },
  { icon: '↩️', title: 'Easy Returns', text: 'Not happy? Returning an item is simple and hassle free.', bg: 'bg-orange-100' },
  { icon: '💬', title: 'Customer Support', text: 'Friendly help whenever you need it.', bg: 'bg-purple-100' },
];

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-1/3 bg-slate-200 rounded" />
      <div className="h-4 w-3/4 bg-slate-200 rounded" />
      <div className="h-10 bg-slate-200 rounded-xl" />
    </div>
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Could not load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const featuredProducts = products.slice(0, 4);
  const heroProducts = products.filter((p) => p.image).slice(0, 3);

  const goToProducts = (category) => {
    setSelectedCategory(category);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      <div className="bg-indigo-600 text-white text-center text-sm py-2 px-4">
        🎉 Free delivery on your first order • Cash on Delivery available
      </div>

      
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Shop Smart.
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                Live Better.
              </span>
            </h1>

            <p className="text-slate-300 text-lg max-w-xl mb-8">
              Discover quality fashion, electronics, shoes and beauty products at
              great prices — with simple, secure and convenient shopping.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#products"
                className="bg-indigo-600 hover:bg-indigo-500 px-7 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-900/40 transition"
              >
                Shop Now
              </a>
              <a
                href="#categories"
                className="border border-white/30 hover:bg-white/10 px-7 py-3 rounded-xl font-semibold transition"
              >
                Explore Categories
              </a>
            </div>

            <div className="flex gap-8 text-sm">
              <div>
                <p className="text-2xl font-bold">{products.length || '—'}+</p>
                <p className="text-slate-400">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.max(categories.length - 1, 0) || '—'}</p>
                <p className="text-slate-400">Categories</p>
              </div>
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-slate-400">Support</p>
              </div>
            </div>
          </div>

         
          <div className="relative hidden md:block h-[420px]">
            {heroProducts.length > 0 ? (
              heroProducts.map((p, i) => {
                const positions = [
                  'top-0 left-4 w-56 h-72 -rotate-6 z-10',
                  'top-10 right-0 w-56 h-72 rotate-6 z-20',
                  'bottom-0 left-24 w-60 h-64 -rotate-1 z-30',
                ];
                return (
                  <div
                    key={p._id}
                    className={`absolute ${positions[i]} rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl bg-white`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-xs text-slate-200">Rs {Number(p.price).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[10rem]">
                🛍️
              </div>
            )}
          </div>
        </div>
      </section>

    

     
      <section id="categories" className="container mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-indigo-600 font-semibold mb-2 tracking-wide">SHOP BY CATEGORY</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Find What You Need</h2>
          <p className="text-slate-500 mt-3">Browse our products by category</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories
            .filter((c) => c !== 'All')
            .map((category) => (
              <button
                key={category}
                onClick={() => goToProducts(category)}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-3xl transition">
                  {CATEGORY_ICONS[category] || '🛒'}
                </div>
                <h3 className="font-semibold text-slate-900">{category}</h3>
                <p className="text-sm text-slate-500">{categoryCounts[category]} items</p>
              </button>
            ))}
        </div>
      </section>

      {/* Featured */}
      {!loading && featuredProducts.length > 0 && (
        <section className="container mx-auto px-6 pb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-indigo-600 font-semibold mb-2 tracking-wide">FEATURED</p>
              <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            </div>
            <a
              href="#products"
              onClick={() => setSelectedCategory('All')}
              className="hidden sm:block text-indigo-600 font-medium hover:underline"
            >
              View All →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} badge="Featured" />
            ))}
          </div>
        </section>
      )}

      
      <section className="container mx-auto px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-8 py-12 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/10 rounded-full" />
          <div className="relative text-center md:text-left">
            <p className="font-semibold uppercase tracking-wide text-indigo-100 mb-2">Limited Offer</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Free delivery on your first order</h2>
            <p className="text-indigo-100">Create an account today and start saving.</p>
          </div>
          <Link
            to="/register"
            className="relative bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition whitespace-nowrap"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      
      <section id="products" className="container mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <p className="text-indigo-600 font-semibold mb-2 tracking-wide">OUR PRODUCTS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Explore All Products</h2>
          <p className="text-slate-500 mt-3">Search, filter and find your favorites</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-slate-700"
          >
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
           
          </select>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {!loading && !error && (
          <p className="text-center text-sm text-slate-500 mb-6">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 && 's'}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔎</p>
            <p className="text-slate-500 text-lg mb-4">No products found.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-indigo-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-indigo-600 font-semibold mb-2 tracking-wide">WHY CHOOSE US</p>
            <h2 className="text-3xl font-bold text-slate-900">Shopping Made Easy</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="text-center p-6">
                <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl ${f.bg} flex items-center justify-center text-3xl`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Stay in the Update.</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8">
            Subscribe to get updates on new arrivals and special offers.
          </p>

          {subscribed ? (
            <p className="text-green-400 font-semibold">✓ Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 px-7 py-3 rounded-xl font-semibold transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
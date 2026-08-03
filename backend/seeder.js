// Run this with: node seeder.js
// It creates one admin user and a few sample products so you can test the site right away.

require('dotenv').config();

const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const products = [
  {
    name: 'Denim Jacket',
    description: 'Premium quality vintage style denim jacket perfect for all seasons.',
    price: 7500.00,
    image: 'https://media.istockphoto.com/id/2157218195/photo/woman-wearing-a-jeans-jacket-mockup.webp?a=1&b=1&s=612x612&w=0&k=20&c=ts7EbOI8uD35wswBDSVzpPe0oWZitI71QrCGAiLfFFo=',
    category: 'Fashion',
    countInStock: 12,
  },
  {
    name: 'Hoodie',
    description: 'Soft, breathable and comfortable oversized hoodie for daily wear.',
    price: 5800.00,
    image: 'https://images.unsplash.com/photo-1685354217981-26c14a211bf8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Fashion',
    countInStock: 18,
  },
  {
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit blue jeans with stretch fabric.',
    price: 3500.00,
    image: 'https://plus.unsplash.com/premium_photo-1689536140577-5ef1210896f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHNsaW0lMjBmaXQlMjBqZWFhbnMlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Fashion',
    countInStock: 15,
  },
  {
    name: 'Sports Cap',
    description: 'Adjustable cotton sports cap with breathable fabric.',
    price: 1500.00,
    image: 'https://images.unsplash.com/photo-1777455163870-a846a5ca98af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNwb3J0cyUyMGNhcHxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Fashion',
    countInStock: 10,
  },

  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear wireless headphones with 30hr battery life.',
    price: 1200.00,
    image: 'https://media.istockphoto.com/id/2237358070/photo/white-modern-wireless-headphones-isolated-on-white-background-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=Regrq4oW7v4aS9Z6n1ueY-vHtqHQndzUbqr6nMkyQGc=',
    category: 'Electronics',
    countInStock: 15,
  },
  {
    name: 'Running Lacing Shoes',
    description: 'Lightweight running shoes with breathable mesh upper.',
    price: 4500.00,
    image: 'https://media.istockphoto.com/id/2219804246/photo/pair-of-green-sport-shoes.jpg?s=1024x1024&w=is&k=20&c=KAHwvNMvmxvhnVvOCKQmLkqZbxYTA55Me6zenoLeaDU=',
    category: 'Shoes',
    countInStock: 25,
  },
  {
    name: 'Classic White Sneakers',
    description: 'Minimalist leather sneakers designed for casual everyday streetwear and all-day comfort.',
    price: 12800.00,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500',
    category: 'Shoes',
    countInStock: 15,
  },
  {
    name: 'Hiking Boots',
    description: 'Water-resistant hiking boots with strong ankle support.',
    price: 5500.00,
    image: 'https://images.unsplash.com/photo-1631287381310-925554130169?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlja2luZyUyMGJvb3RzfGVufDB8fDB8fHww',
    category: 'Shoes',
    countInStock: 9,
  },
  {
    name: 'Black Smart Watch',
    description: 'Fitness tracking smart watch with heart rate monitor.',
    price: 1500.00,
    image: 'https://images.unsplash.com/photo-1637160151663-a410315e4e75?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Electronics',
    countInStock: 10,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact dustproof and waterproof speaker with 360-degree powerful sound.',
    price: 2599.00,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Electronics',
    countInStock: 12,
  },
  {
    name: 'RGB Mechanical Gaming Keyboard',
    description: 'Tactile mechanical switches with customizable RGB backlighting for fast typing and gaming.',
    price: 1999.00,
    image: 'https://media.istockphoto.com/id/2219161181/photo/img_1506.webp?a=1&b=1&s=612x612&w=0&k=20&c=EAgQchn0dsK6plkYGOMecnmuX3_PmItDEiq2QGP5ALI=',
    category: 'Electronics',
    countInStock: 12,
  },
  
  {
      name: 'Makeup Brush Set',
      description: 'Professional makeup brush set with soft synthetic bristles.',
      price: 4800.00,
      image: 'https://images.unsplash.com/photo-1620464003286-a5b0d79f32c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFrZXVwJTIwYnJ1c2h8ZW58MHx8MHx8fDA%3D',
      category: 'Beauty',
      countInStock: 10,
    
  },
  {
    name: 'Matte Lipstick',
    description: 'Long-lasting matte lipstick with rich color.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1631214524085-17874764a0e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWF0dGUlMjBsaXBzdGlja3xlbnwwfHwwfHx8MA%3D%3D',
    category: 'Beauty',
    countInStock: 30,
  },
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
    });

    await Product.insertMany(products);

    console.log('Data Imported! Admin login -> email: admin@example.com / password: admin123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();

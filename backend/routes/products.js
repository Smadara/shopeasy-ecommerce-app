const express = require('express');
const db = require('../config/db');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { keyword, category } = req.query;

    let sql = 'SELECT * FROM products';
    const conditions = [];
    const values = [];

    if (keyword) {
      conditions.push('name LIKE ?');
      values.push(`%${keyword}%`);
    }

    if (category) {
      conditions.push('category = ?');
      values.push(category);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const [products] = await db.query(sql, values);

    
    const formattedProducts = products.map((product) => ({
      _id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      image: product.image,
      category: product.category,
      countInStock: product.count_in_stock,
      rating: Number(product.rating),
      numReviews: product.num_reviews,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length > 0) {
      const product = products[0];

      
      res.json({
        _id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        image: product.image,
        category: product.category,
        countInStock: product.count_in_stock,
        rating: Number(product.rating),
        numReviews: product.num_reviews,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      });
    } else {
      res.status(404).json({
        message: 'Product not found',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      countInStock,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO products
      (name, description, price, image, category, count_in_stock)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        price,
        image,
        category,
        countInStock,
      ]
    );

    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    const product = products[0];

    res.status(201).json({
      _id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      image: product.image,
      category: product.category,
      countInStock: product.count_in_stock,
      rating: Number(product.rating),
      numReviews: product.num_reviews,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      countInStock,
    } = req.body;

    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const product = products[0];

    await db.query(
      `UPDATE products
       SET name = ?,
           description = ?,
           price = ?,
           image = ?,
           category = ?,
           count_in_stock = ?
       WHERE id = ?`,
      [
        name || product.name,
        description || product.description,
        price ?? product.price,
        image || product.image,
        category || product.category,
        countInStock ?? product.count_in_stock,
        req.params.id,
      ]
    );

    const [updatedProducts] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    const updatedProduct = updatedProducts[0];

    res.json({
      _id: updatedProduct.id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: Number(updatedProduct.price),
      image: updatedProduct.image,
      category: updatedProduct.category,
      countInStock: updatedProduct.count_in_stock,
      rating: Number(updatedProduct.rating),
      numReviews: updatedProduct.num_reviews,
      createdAt: updatedProduct.created_at,
      updatedAt: updatedProduct.updated_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    await db.query(
      'DELETE FROM products WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Product removed',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
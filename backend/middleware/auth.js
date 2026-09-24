const jwt = require('jsonwebtoken');
const db = require('../config/db');


const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      const [users] = await db.query(
        'SELECT id, name, email, is_admin, created_at, updated_at FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({
          message: 'User not found',
        });
      }

      
      const user = users[0];

      req.user = {
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: Boolean(user.is_admin),
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token',
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({
      message: 'Not authorized as an admin',
    });
  }
};

module.exports = { protect, admin };
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (password === adminPassword) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '24h'
    });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid password' });
  }
});

export default router;

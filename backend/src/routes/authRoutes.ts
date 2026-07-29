import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const adminUser = await Admin.findOne({ username: 'admin' });
    if (!adminUser) {
      return res.status(500).json({ message: 'Admin user not initialized' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    
    if (isMatch) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '24h'
      });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }

  try {
    const adminUser = await Admin.findOne({ username: 'admin' });
    if (!adminUser) {
      return res.status(500).json({ message: 'Admin user not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    adminUser.password = hashedPassword;
    await adminUser.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

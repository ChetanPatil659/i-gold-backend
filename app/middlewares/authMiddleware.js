import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || '';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    
    const user = await prisma.user.findUnique({ where: { phone: decoded.phone } });
    
    if (!user) {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    if(user.deleted) return res.status(401).json({ message: 'User not found' });

    req.user = user; // Attach user to request
    next(); // Proceed to next middleware/route
  } catch (error) {
    return res.status(401).json({ message: 'Server error' });
  }
};


import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertItemSchema, insertDeliveryProofSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, true); // Allow no file
    }
    
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check user role
const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Remove password from response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User role selection
  app.patch('/api/auth/select-role', authenticateToken, async (req: any, res) => {
    try {
      const { role } = req.body;
      if (!['donor', 'recipient', 'ngo'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      
      const updatedUser = await storage.updateUser(req.user.userId, { role });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Item routes
  app.post('/api/items', authenticateToken, upload.single('image'), async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user || (user.role !== 'donor' && user.role !== 'ngo')) {
        return res.status(403).json({ message: 'Only donors and NGOs can create items' });
      }
      
      // Users can now create items immediately after selecting their role
      
      const itemData = insertItemSchema.parse(req.body);
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      const item = await storage.createItem({
        ...itemData,
        donorId: req.user.userId,
        imageUrl,
      });
      
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/items', async (req, res) => {
    try {
      const { category } = req.query;
      let items;
      
      if (category && typeof category === 'string') {
        items = await storage.getItemsByCategory(category);
      } else {
        items = await storage.getAvailableItems();
      }
      
      // Get donor information for each item
      const itemsWithDonors = await Promise.all(
        items.map(async (item) => {
          const donor = await storage.getUser(item.donorId);
          return {
            ...item,
            donor: donor ? { 
              id: donor.id, 
              firstName: donor.firstName, 
              lastName: donor.lastName,
              badgeLevel: donor.badgeLevel 
            } : null,
          };
        })
      );
      
      res.json(itemsWithDonors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/items/my-donations', authenticateToken, async (req: any, res) => {
    try {
      const items = await storage.getItemsByDonor(req.user.userId);
      
      // Get recipient information and delivery proofs
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          let recipient = null;
          let deliveryProof = null;
          
          if (item.recipientId) {
            const recipientUser = await storage.getUser(item.recipientId);
            if (recipientUser) {
              recipient = {
                id: recipientUser.id,
                firstName: recipientUser.firstName,
                lastName: recipientUser.lastName,
              };
            }
          }
          
          if (item.status === 'delivered') {
            deliveryProof = await storage.getDeliveryProofByItem(item.id);
          }
          
          return { ...item, recipient, deliveryProof };
        })
      );
      
      res.json(itemsWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/items/my-received', authenticateToken, async (req: any, res) => {
    try {
      const items = await storage.getItemsByRecipient(req.user.userId);
      
      // Get donor information for each item
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          let donor = null;
          
          if (item.donorId) {
            const donorUser = await storage.getUser(item.donorId);
            if (donorUser) {
              donor = {
                id: donorUser.id,
                firstName: donorUser.firstName,
                lastName: donorUser.lastName,
                email: donorUser.email,
                phone: donorUser.phone,
              };
            }
          }
          
          return { ...item, donor };
        })
      );
      
      res.json(itemsWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/items/:id/claim', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user || (user.role !== 'recipient' && user.role !== 'ngo')) {
        return res.status(403).json({ message: 'Only recipients and NGOs can claim items' });
      }
      
      // Users can now claim items immediately after selecting their role
      
      const item = await storage.claimItem(req.params.id, req.user.userId);
      if (!item) {
        return res.status(400).json({ message: 'Item not available for claiming' });
      }
      
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/items/:id/delivery-proof', authenticateToken, upload.single('image'), async (req: any, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      if (item.recipientId !== req.user.userId) {
        return res.status(403).json({ message: 'Only the recipient can upload delivery proof' });
      }
      
      if (item.status !== 'claimed') {
        return res.status(400).json({ message: 'Item must be claimed to upload delivery proof' });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
      }
      
      const { thankYouMessage } = req.body;
      if (!thankYouMessage) {
        return res.status(400).json({ message: 'Thank you message is required' });
      }
      
      const deliveryProof = await storage.createDeliveryProof({
        itemId: item.id,
        recipientId: req.user.userId,
        imageUrl: `/uploads/${req.file.filename}`,
        thankYouMessage,
      });
      
      res.status(201).json(deliveryProof);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes
  app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/admin/users/:id/status', authenticateToken, requireRole(['admin']), async (req: any, res) => {
    try {
      const { status } = req.body;
      if (!['verified', 'suspended', 'pending_approval'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const updatedUser = await storage.updateUser(req.params.id, { status });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Statistics endpoint
  app.get('/api/stats', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const items = await storage.getAvailableItems();
      
      const stats = {
        totalDonations: Array.from(storage['items'].values()).filter(item => item.status === 'delivered').length,
        verifiedUsers: users.filter(user => user.status === 'verified').length,
        ngoPartners: users.filter(user => user.role === 'ngo' && user.status === 'verified').length,
        availableItems: items.length,
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}

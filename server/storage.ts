import { type User, type InsertUser, type Item, type InsertItem, type DeliveryProof, type InsertDeliveryProof } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Item operations
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem & { donorId: string }): Promise<Item>;
  updateItem(id: string, updates: Partial<Item>): Promise<Item | undefined>;
  deleteItem(id: string): Promise<boolean>;
  getItemsByDonor(donorId: string): Promise<Item[]>;
  getItemsByRecipient(recipientId: string): Promise<Item[]>;
  getAvailableItems(): Promise<Item[]>;
  getItemsByCategory(category: string): Promise<Item[]>;
  claimItem(itemId: string, recipientId: string): Promise<Item | undefined>;
  
  // Delivery proof operations
  createDeliveryProof(proof: InsertDeliveryProof): Promise<DeliveryProof>;
  getDeliveryProofByItem(itemId: string): Promise<DeliveryProof | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private items: Map<string, Item>;
  private deliveryProofs: Map<string, DeliveryProof>;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.deliveryProofs = new Map();
    
    // Create default admin user
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      username: "admin",
      email: "admin@giveease.com",
      password: "$2b$10$rQ2YjKxwZ8k9QY8XGz7MKuP4K4YxXz7MKuP4K4YxXz7MKuP4K4Yx", // "admin123"
      role: "admin",
      status: "verified",
      firstName: "Admin",
      lastName: "User",
      location: null,
      phone: null,
      donationCount: 0,
      badgeLevel: "none",
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: "pending",
      status: "verified",
      donationCount: 0,
      badgeLevel: "none",
      createdAt: new Date(),
      location: insertUser.location || null,
      phone: insertUser.phone || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(itemData: InsertItem & { donorId: string }): Promise<Item> {
    const id = randomUUID();
    const item: Item = {
      ...itemData,
      id,
      status: "available",
      recipientId: null,
      claimedAt: null,
      deliveredAt: null,
      createdAt: new Date(),
      location: itemData.location || null,
      imageUrl: itemData.imageUrl || null,
    };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async getItemsByDonor(donorId: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(item => item.donorId === donorId);
  }

  async getItemsByRecipient(recipientId: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(item => item.recipientId === recipientId);
  }

  async getAvailableItems(): Promise<Item[]> {
    return Array.from(this.items.values()).filter(item => item.status === "available");
  }

  async getItemsByCategory(category: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(item => item.category === category && item.status === "available");
  }

  async claimItem(itemId: string, recipientId: string): Promise<Item | undefined> {
    const item = this.items.get(itemId);
    if (!item || item.status !== "available") return undefined;
    
    const updatedItem = {
      ...item,
      status: "claimed" as const,
      recipientId,
      claimedAt: new Date(),
    };
    this.items.set(itemId, updatedItem);
    return updatedItem;
  }

  async createDeliveryProof(proof: InsertDeliveryProof): Promise<DeliveryProof> {
    const id = randomUUID();
    const deliveryProof: DeliveryProof = {
      ...proof,
      id,
      createdAt: new Date(),
    };
    this.deliveryProofs.set(id, deliveryProof);
    
    // Update item status to delivered
    const item = this.items.get(proof.itemId);
    if (item) {
      const updatedItem = { ...item, status: "delivered" as const, deliveredAt: new Date() };
      this.items.set(proof.itemId, updatedItem);
      
      // Update donor's donation count and badge
      const donor = this.users.get(item.donorId);
      if (donor) {
        const newCount = donor.donationCount + 1;
        let badgeLevel = "bronze";
        if (newCount >= 10) badgeLevel = "gold";
        else if (newCount >= 5) badgeLevel = "silver";
        
        const updatedDonor = { ...donor, donationCount: newCount, badgeLevel };
        this.users.set(item.donorId, updatedDonor);
      }
    }
    
    return deliveryProof;
  }

  async getDeliveryProofByItem(itemId: string): Promise<DeliveryProof | undefined> {
    return Array.from(this.deliveryProofs.values()).find(proof => proof.itemId === itemId);
  }
}

export const storage = new MemStorage();

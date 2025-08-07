import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("pending"), // pending, donor, recipient, ngo, admin
  status: text("status").notNull().default("unverified"), // unverified, pending_approval, verified, suspended
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  location: text("location"),
  phone: text("phone"),
  donationCount: integer("donation_count").notNull().default(0),
  badgeLevel: text("badge_level").default("none"), // none, bronze, silver, gold
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  donorId: varchar("donor_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // clothes, electronics, furniture, books, toys, kitchen, other
  condition: text("condition").notNull(), // new, slightly_used
  status: text("status").notNull().default("available"), // available, claimed, delivered
  imageUrl: text("image_url"),
  location: text("location"),
  recipientId: varchar("recipient_id").references(() => users.id),
  claimedAt: timestamp("claimed_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deliveryProofs = pgTable("delivery_proofs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").references(() => items.id).notNull(),
  recipientId: varchar("recipient_id").references(() => users.id).notNull(),
  imageUrl: text("image_url").notNull(),
  thankYouMessage: text("thank_you_message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  donationCount: true,
  badgeLevel: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  donorId: true,
  recipientId: true,
  claimedAt: true,
  deliveredAt: true,
}).extend({
  category: z.enum(["clothes", "electronics", "furniture", "books", "toys", "kitchen", "other"]),
  condition: z.enum(["new", "slightly_used"]),
});

export const insertDeliveryProofSchema = createInsertSchema(deliveryProofs).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type InsertDeliveryProof = z.infer<typeof insertDeliveryProofSchema>;

export type User = typeof users.$inferSelect;
export type Item = typeof items.$inferSelect;
export type DeliveryProof = typeof deliveryProofs.$inferSelect;

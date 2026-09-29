import { pgTable, serial, text, varchar, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }).notNull(),
  badge: varchar("badge", { length: 64 }).default("HOT DEAL"),
  features: text("features").notNull(), // JSON string or comma-separated
  category: varchar("category", { length: 64 }).default("software"),
  stock: integer("stock").default(50),
  salesCount: integer("sales_count").default(0),
  isFeaturedInLive: boolean("is_featured_in_live").default(false),
  imageUrl: text("imageUrl").default("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 64 }).notNull().unique(),
  paypalOrderId: varchar("paypal_order_id", { length: 128 }).unique(),
  fulfillmentTokenHash: varchar("fulfillment_token_hash", { length: 64 }),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 16 }).default("USD"),
  status: varchar("status", { length: 32 }).default("completed"),
  affiliateCode: varchar("affiliate_code", { length: 64 }),
  licenseKey: varchar("license_key", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const liveChatMessages = pgTable("live_chat_messages", {
  id: serial("id").primaryKey(),
  senderName: varchar("sender_name", { length: 128 }).notNull(),
  senderAvatar: varchar("sender_avatar", { length: 255 }),
  senderRole: varchar("sender_role", { length: 32 }).default("visitor"), // 'visitor' | 'vip' | 'ai_host' | 'system'
  message: text("message").notNull(),
  messageType: varchar("message_type", { length: 32 }).default("text"), // 'text' | 'superchat' | 'gift' | 'order_toast' | 'deal_pitch'
  giftType: varchar("gift_type", { length: 64 }), // 'rocket' | 'coffee' | 'diamond' | 'crown'
  giftAmount: numeric("gift_amount", { precision: 10, scale: 2 }),
  isAiResponse: boolean("is_ai_response").default(false),
  respondedToId: integer("responded_to_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiKnowledgeItems = pgTable("ai_knowledge_items", {
  id: serial("id").primaryKey(),
  questionPattern: varchar("question_pattern", { length: 255 }).notNull(),
  answerText: text("answer_text").notNull(),
  topic: varchar("topic", { length: 64 }).default("general"),
  triggerKeywords: text("trigger_keywords").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  source: varchar("source", { length: 64 }).default("free_tool"),
  interest: varchar("interest", { length: 128 }).default("traffic_growth"),
  status: varchar("status", { length: 32 }).default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  affiliateName: varchar("affiliate_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  totalClicks: integer("total_clicks").default(0),
  totalConversions: integer("total_conversions").default(0),
  totalEarnings: numeric("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  tier: varchar("tier", { length: 32 }).default("Bronze"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const liveStreamSettings = pgTable("live_stream_settings", {
  id: serial("id").primaryKey(),
  activeHost: varchar("active_host", { length: 64 }).default("nova"),
  streamTitle: varchar("stream_title", { length: 255 }).default("24/7 Global Traffic & AI Commerce Live Summit"),
  currentTopic: text("current_topic").default("How to scale global e-commerce and SaaS traffic to $100K/mo with autonomous AI systems"),
  pitchIntervalMinutes: integer("pitch_interval_minutes").default(5),
  voiceEnabled: boolean("voice_enabled").default(true),
  speechRate: numeric("speech_rate", { precision: 3, scale: 2 }).default("1.0"),
  welcomeMessage: text("welcome_message").default("Welcome to the 24/7 Live Stream! I am Nova, your real-time AI host. Ask me anything or grab today's flash deal below!"),
  pinnedDealId: integer("pinned_deal_id"),
  simulatedViewerBase: integer("simulated_viewer_base").default(1380),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

import "dotenv/config";
import { db } from "./index";
import { products, aiKnowledgeItems, liveStreamSettings, liveChatMessages, affiliates } from "./schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  console.log("Seeding database...");

  // Check if products already exist
  const existingProducts = await db.select({ count: sql<number>`count(*)` }).from(products);
  if (Number(existingProducts[0]?.count || 0) === 0) {
    await db.insert(products).values([
      {
        title: "OmniTraffic AI™ - Global Autopilot Traffic Suite 2026",
        slug: "omnitraffic-ai-growth-suite",
        description: "The complete traffic acceleration engine for international .com domains. Includes autonomous SEO indexing, viral TikTok/Reels prompt syndication, and high-conversion landing page templates.",
        price: "29.00",
        originalPrice: "199.00",
        badge: "85% OFF • LIVE FLASH DEAL",
        features: JSON.stringify([
          "Autonomous Multilingual SEO Automation for 20+ search engines",
          "Viral Video & Social Copywriting Generator Engine",
          "Automated Backlink Indexing & Domain Authority Booster",
          "Instant Lifetime Access + Private Discord Mastermind"
        ]),
        category: "software",
        stock: 12,
        salesCount: 842,
        isFeaturedInLive: true,
        imageUrl: "/images/ai-streamer-avatar.jpg"
      },
      {
        title: "StreamAgent Pro™ - Turnkey 24/7 AI Live Streamer Kit",
        slug: "streamagent-pro-kit",
        description: "Deploy your own 24/7 digital human live host that sells your products around the clock, answers customer questions in real time, and converts live traffic into revenue.",
        price: "69.00",
        originalPrice: "299.00",
        badge: "LIVE EXCLUSIVE DEAL",
        features: JSON.stringify([
          "Full Digital Human Host Avatar & Web Speech Voice Engine",
          "Autonomous Q&A Knowledge Base & Flash Sale Pitch Logic",
          "Compatible with Web Browser, OBS Studio, TikTok & YouTube RTMP",
          "Commercial Rights with 100% Revenue Ownership"
        ]),
        category: "software",
        stock: 6,
        salesCount: 319,
        isFeaturedInLive: true,
        imageUrl: "/images/ai-studio-bg.jpg"
      },
      {
        title: "AI Global Growth VIP Architecture Mentorship",
        slug: "vip-growth-mentorship",
        description: "Direct 1-on-1 strategy and implementation to build your international domain into a $10K+/month cashflow asset. We configure your automated funnels and AI sales agent.",
        price: "199.00",
        originalPrice: "799.00",
        badge: "VIP 1-ON-1 • 3 SPOTS LEFT",
        features: JSON.stringify([
          "60-Minute Private Funnel & Traffic Master Architecture Call",
          "Custom-trained AI Knowledge Model for Your Specific Niche",
          "Guaranteed High-Conversion Sales Funnel Blueprint",
          "30 Days Direct Telegram & Priority Support"
        ]),
        category: "service",
        stock: 3,
        salesCount: 87,
        isFeaturedInLive: false,
        imageUrl: "/images/ai-streamer-avatar-alex.jpg"
      },
      {
        title: "Zero-to-$10K Global Domain Monetization Playbook",
        slug: "global-domain-playbook",
        description: "The definitive guide to monetizing fresh international .com domains without upfront advertising budgets. Master affiliate networks, digital dropshipping, and high-ticket AI consulting.",
        price: "14.99",
        originalPrice: "49.00",
        badge: "INSTANT DOWNLOAD",
        features: JSON.stringify([
          "Step-by-step 30-Day Zero-to-Cash Launch Checklist",
          "Top 50 High-Paying Global Affiliate Programs List",
          "Ready-to-Use High-Converting Email Sequences",
          "Multi-Currency Stripe & PayPal Setup Protocol"
        ]),
        category: "course",
        stock: 150,
        salesCount: 1420,
        isFeaturedInLive: false,
        imageUrl: "/images/ai-streamer-avatar.jpg"
      }
    ]);
    console.log("Products seeded successfully.");
  }

  // Check Knowledge Base
  const existingKb = await db.select({ count: sql<number>`count(*)` }).from(aiKnowledgeItems);
  if (Number(existingKb[0]?.count || 0) === 0) {
    await db.insert(aiKnowledgeItems).values([
      {
        questionPattern: "How do I get traffic to a brand new .com domain?",
        answerText: "Great question! For a new international .com domain with zero initial traffic, the fastest 3-pillar formula is: 1) Deploy free high-utility AI tools that naturally attract backlinks and search intent; 2) Run this 24/7 AI live stream across TikTok, YouTube, and Web to capture and convert social discovery traffic; 3) Implement a 30% affiliate viral loop. Our OmniTraffic AI Suite automates all three!",
        topic: "domain_growth",
        triggerKeywords: "traffic,get traffic,new domain,zero visitors,audience,growth,visitor,seo,ranking,visitors"
      },
      {
        questionPattern: "How do I make money or monetize this website?",
        answerText: "You monetize in 4 complementary revenue streams: 1) Instant digital product flash deals right here in the live room (like OmniTraffic AI); 2) Monthly recurring SaaS subscriptions for AI tools; 3) Super Chats & virtual tipping during live streams; and 4) High-ticket 1-on-1 AI strategy consultation bookings ($199+ each). You can start generating revenue within your first 24-48 hours!",
        topic: "monetization",
        triggerKeywords: "money,monetize,profit,revenue,earn,income,business,sales,pricing,cash"
      },
      {
        questionPattern: "What is your refund policy or guarantee?",
        answerText: "We offer an unconditional 30-day 100% money-back guarantee! If OmniTraffic AI or StreamAgent Pro doesn't exceed your expectations or help you build traffic and sales, simply email support or message here for an instant full refund. Your purchase is completely risk-free!",
        topic: "refund",
        triggerKeywords: "refund,guarantee,money back,risk,scam,safe,cancel,warranty,return"
      },
      {
        questionPattern: "How does this 24/7 AI live stream work?",
        answerText: "I am an autonomous real-time AI digital human! I continuously monitor chat inquiries, synthesize real-time voice speech, pitch current flash promotions, and interact with visitors 24 hours a day, 7 days a week without fatigue. With our StreamAgent Pro kit, you can deploy your own AI host just like me!",
        topic: "ai_live_tech",
        triggerKeywords: "ai live,how it works,real time,host,bot,virtual human,digital avatar,stream,24/7"
      },
      {
        questionPattern: "What is today's flash sale discount?",
        answerText: "Today's headline live deal is OmniTraffic AI™ for just $29 (regularly $199, an 85% discount)! We also have StreamAgent Pro at $69. You can click the 'Grab Deal' button right on your screen to lock in the special live pricing before our limited stock runs out!",
        topic: "pricing",
        triggerKeywords: "deal,discount,coupon,promo,price,how much,cost,flash sale,cheap,offer"
      },
      {
        questionPattern: "Do you support multiple languages for international traffic?",
        answerText: "Yes, absolutely! Since this is an international .com domain, our system and AI host natively support English, Chinese (中文), Spanish (Español), and Japanese (日本語). You can toggle languages at any time from the top navigation bar, and I will understand your queries in any language!",
        topic: "multilingual",
        triggerKeywords: "language,chinese,english,spanish,japanese,multilingual,international,translation,中文,语言"
      },
      {
        questionPattern: "How do I join the affiliate program?",
        answerText: "Joining our affiliate program is 100% free! You earn an industry-leading 30% recurring commission on every customer you refer. Simply click 'Affiliate Program' in the menu, grab your unique referral link, and start sharing it on social media, blogs, or forums to earn passive income!",
        topic: "affiliate",
        triggerKeywords: "affiliate,referral,commission,partner,promote,share,earn,ambassador,affiliates"
      }
    ]);
    console.log("Knowledge base seeded successfully.");
  }

  // Check Stream Settings
  const existingSettings = await db.select({ count: sql<number>`count(*)` }).from(liveStreamSettings);
  if (Number(existingSettings[0]?.count || 0) === 0) {
    await db.insert(liveStreamSettings).values({
      activeHost: "nova",
      streamTitle: "24/7 Global AI Traffic & E-Commerce Live Broadcast",
      currentTopic: "How to Scale Global .COM Traffic from 0 to $10,000/Mo using Autonomous AI Agents",
      pitchIntervalMinutes: 5,
      voiceEnabled: true,
      speechRate: "1.0",
      welcomeMessage: "Hello and welcome to the 24/7 Live Stream! I am Nova, your interactive AI host. Feel free to ask any question or test our live tools below!",
      simulatedViewerBase: 1420
    });
    console.log("Stream settings seeded successfully.");
  }

  // Check Live Chat initial messages
  const existingChats = await db.select({ count: sql<number>`count(*)` }).from(liveChatMessages);
  if (Number(existingChats[0]?.count || 0) === 0) {
    await db.insert(liveChatMessages).values([
      {
        senderName: "System",
        senderAvatar: "🤖",
        senderRole: "system",
        message: "🔴 24/7 AI Live Stream started. Interactive AI Host 'Nova' is active and listening to chat in real time.",
        messageType: "text"
      },
      {
        senderName: "Nova AI Host",
        senderAvatar: "🎙️",
        senderRole: "ai_host",
        message: "Welcome to all new visitors joining from around the world! Drop your domain or website in chat and I'll give you instant traffic tips. Don't miss today's 85% OFF flash deal on OmniTraffic AI!",
        messageType: "deal_pitch",
        isAiResponse: true
      },
      {
        senderName: "Marcus_Digital",
        senderAvatar: "👨‍💻",
        senderRole: "visitor",
        message: "Can this system help a newly registered .com domain with zero backlinks?",
        messageType: "text"
      },
      {
        senderName: "Nova AI Host",
        senderAvatar: "🎙️",
        senderRole: "ai_host",
        message: "@Marcus_Digital Absolutely! OmniTraffic AI includes programmatic content workflows and viral short-form script generators specifically engineered to trigger rapid Google crawling and social traffic for brand new domains.",
        messageType: "text",
        isAiResponse: true
      },
      {
        senderName: "Elena_V",
        senderAvatar: "🚀",
        senderRole: "vip",
        message: "Sent a Rocket! Loving the stream quality! 🚀",
        messageType: "gift",
        giftType: "rocket",
        giftAmount: "9.99"
      },
      {
        senderName: "Alex_Growth",
        senderAvatar: "⚡",
        senderRole: "visitor",
        message: "Just grabbed the StreamAgent Pro kit! Order #ORD-9821. Instant download was seamless.",
        messageType: "order_toast"
      }
    ]);
    console.log("Chat messages seeded successfully.");
  }

  // Check Affiliates
  const existingAffiliates = await db.select({ count: sql<number>`count(*)` }).from(affiliates);
  if (Number(existingAffiliates[0]?.count || 0) === 0) {
    await db.insert(affiliates).values({
      code: "VIPGROWTH",
      affiliateName: "David Marketing Global",
      email: "david@example.com",
      totalClicks: 342,
      totalConversions: 28,
      totalEarnings: "412.50",
      tier: "Gold"
    });
    console.log("Affiliates seeded successfully.");
  }

  console.log("Seeding complete!");
}

// Execute if run directly
seedDatabase().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

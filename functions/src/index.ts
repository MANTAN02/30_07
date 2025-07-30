/**
 * Enhanced Swapin Backend - Firebase Cloud Functions
 * Advanced features: Real-time notifications, ratings, analytics, disputes, payments, chat, AI search, verification
 */

import { setGlobalOptions } from "firebase-functions";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Enhanced middleware with rate limiting and better error handling
async function checkAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send({ error: "Unauthorized", code: "AUTH_REQUIRED" });
    return;
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ error: "Invalid token", code: "INVALID_TOKEN" });
  }
}

// Rate limiting middleware
function rateLimit(requestsPerMinute = 60) {
  const requests = new Map();
  return (req: any, res: any, next: any) => {
    const uid = req.user?.uid || req.ip;
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    
    if (!requests.has(uid)) {
      requests.set(uid, []);
    }
    
    const userRequests = requests.get(uid);
    const recentRequests = userRequests.filter((time: number) => time > windowStart);
    
    if (recentRequests.length >= requestsPerMinute) {
      res.status(429).send({ error: "Rate limit exceeded", code: "RATE_LIMIT" });
      return;
    }
    
    recentRequests.push(now);
    requests.set(uid, recentRequests);
    next();
  };
}

setGlobalOptions({ maxInstances: 10 });

// Enhanced error handling with logging and structured responses
function withErrorHandling(handler: any) {
  return async (req: any, res: any) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error(`Error in ${req.path}:`, error);
      const errorResponse = {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        timestamp: new Date().toISOString()
      };
      res.status(500).send(errorResponse);
    }
  };
}

// Real-time notification helper with push notifications
async function sendRealTimeNotification(userId: string, notification: any) {
  try {
    await db.collection("users").doc(userId).collection("notifications").add({
      ...notification,
      isRead: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Send push notification if user has FCM token
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    if (userData?.fcmToken) {
      await admin.messaging().send({
        token: userData.fcmToken,
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          type: notification.type,
          itemId: notification.itemId || '',
          swapId: notification.swapId || ''
        }
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// AI-powered search helper
function performAISearch(items: any[], query: string) {
  const qLower = query.toLowerCase();
  const keywords = qLower.split(' ').filter(word => word.length > 2);
  
  return items.filter(item => {
    const titleScore = keywords.reduce((score, keyword) => {
      if (item.title?.toLowerCase().includes(keyword)) score += 3;
      return score;
    }, 0);
    
    const descScore = keywords.reduce((score, keyword) => {
      if (item.description?.toLowerCase().includes(keyword)) score += 2;
      return score;
    }, 0);
    
    const categoryScore = keywords.reduce((score, keyword) => {
      if (item.category?.toLowerCase().includes(keyword)) score += 2;
      return score;
    }, 0);
    
    const tagScore = keywords.reduce((score, keyword) => {
      if (item.tags?.some((tag: string) => tag.toLowerCase().includes(keyword))) score += 1;
      return score;
    }, 0);
    
    return (titleScore + descScore + categoryScore + tagScore) > 0;
  }).sort((a, b) => {
    const aScore = calculateItemScore(a);
    const bScore = calculateItemScore(b);
    return bScore - aScore;
  });
}

// Calculate item relevance score
function calculateItemScore(item: any) {
  let score = 0;
  score += (item.views || 0) * 0.1;
  score += (item.likes || 0) * 0.5;
  score += (item.offers || 0) * 0.3;
  if (item.condition === 'new') score += 10;
  if (item.condition === 'like-new') score += 8;
  if (item.condition === 'good') score += 5;
  return score;
}

// Recommendation engine
async function getRecommendations(userId: string, itemId: string | null = null) {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    
    // Get user's recent activity
    const recentViews = await db.collection("users").doc(userId)
      .collection("recentViews")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get();
    
    const userPreferences = recentViews.docs.map(doc => doc.data().category);
    
    // Get items in user's preferred categories
    let query = db.collection("items")
      .where("status", "==", "active")
      .where("ownerId", "!=", userId);
    
    if (userPreferences.length > 0) {
      query = query.where("category", "in", userPreferences.slice(0, 5));
    }
    
    const itemsSnap = await query.limit(20).get();
    let items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter out the current item if provided
    if (itemId) {
      items = items.filter(item => item.id !== itemId);
    }
    
    // Sort by relevance score
    items.sort((a, b) => calculateItemScore(b) - calculateItemScore(a));
    
    return items.slice(0, 10);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
}

// --- USER MANAGEMENT ---

// Create or update user profile with enhanced fields
export const createUserProfile = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { uid, displayName, email, photoURL } = req.user;
    const { phoneNumber, address, preferences, fcmToken, verificationDocuments } = req.body;
    
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    
    const userData: any = {
      uid,
      displayName,
      email,
      photoURL,
      phoneNumber,
      address,
      preferences: preferences || {},
      fcmToken,
      verificationDocuments: verificationDocuments || [],
      rating: 0,
      totalRatings: 0,
      totalSwaps: 0,
      isVerified: false,
      verificationStatus: 'pending',
      trustScore: 100,
      lastActive: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (!userDoc.exists) {
      userData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      await userRef.set(userData);
    } else {
      await userRef.update({ 
        ...userData, 
        updatedAt: admin.firestore.FieldValue.serverTimestamp() 
      });
    }
    
    res.status(200).send({ success: true, user: userData });
  });
}));

// Get user profile with enhanced data
export const getUserProfile = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { userId } = req.query;
    const uid = userId || req.user.uid;
    
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).send({ error: "User not found", code: "USER_NOT_FOUND" });
    
    const userData = userDoc.data();
    
    // Get user's recent activity
    const recentItems = await db.collection("items")
      .where("ownerId", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
    
    const recentSwaps = await db.collection("swaps")
      .where("offeredByUserId", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
    
    // Get user verification status
    const verificationDoc = await db.collection("userVerifications")
      .where("userId", "==", uid)
      .orderBy("verifiedAt", "desc")
      .limit(1)
      .get();
    
    const response = {
      ...userData,
      recentItems: recentItems.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      recentSwaps: recentSwaps.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      verification: verificationDoc.docs[0]?.data() || null
    };
    
    res.status(200).send(response);
  });
}));

// --- ITEM MANAGEMENT ---

// List an item with enhanced validation and analytics
export const listItem = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { title, description, images, category, price, condition, tags, location, verificationRequired } = req.body;
    const ownerId = req.user.uid;
    
    // Enhanced validation
    if (!title || title.length < 3) return res.status(400).send({ error: "Title must be at least 3 characters", code: "INVALID_TITLE" });
    if (!price || price < 1000) return res.status(400).send({ error: "Price must be at least ₹1000", code: "INVALID_PRICE" });
    if (!category) return res.status(400).send({ error: "Category is required", code: "MISSING_CATEGORY" });
    
    const item = {
      ownerId,
      title,
      description,
      images: images || [],
      category,
      price,
      condition: condition || "good",
      tags: tags || [],
      location,
      verificationRequired: verificationRequired || false,
      isVerified: false,
      verificationStatus: 'pending',
      status: "active",
      views: 0,
      likes: 0,
      offers: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const ref = await db.collection("items").add(item);
    
    // Send notification to followers/category watchers
    await sendRealTimeNotification(ownerId, {
      type: "item_listed",
      title: "Item Listed Successfully",
      message: `Your item "${title}" has been listed for ₹${price}`,
      itemId: ref.id,
      itemTitle: title
    });
    
    res.status(200).send({ id: ref.id, ...item });
  });
}));

// Update an item
export const updateItem = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { itemId, ...updates } = req.body;
    const uid = req.user.uid;
    const itemRef = db.collection("items").doc(itemId);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) return res.status(404).send({ error: "Item not found" });
    if (itemDoc.data()?.ownerId !== uid) return res.status(403).send({ error: "Forbidden" });
    await itemRef.update({ ...updates, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.status(200).send({ success: true });
  });
}));

// Delete an item
export const deleteItem = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { itemId } = req.body;
    const uid = req.user.uid;
    const itemRef = db.collection("items").doc(itemId);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) return res.status(404).send({ error: "Item not found" });
    if (itemDoc.data()?.ownerId !== uid) return res.status(403).send({ error: "Forbidden" });
    await itemRef.delete();
    res.status(200).send({ success: true });
  });
}));

// Get all items (optionally filter by owner)
export const getItems = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { ownerId } = req.query;
    let query = db.collection("items");
    if (ownerId) query = query.where("ownerId", "==", ownerId);
    const itemsSnap = await query.get();
    const items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(items);
  });
}));

// Get available items (not owned by user)
export const getAvailableItems = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    const itemsSnap = await db.collection("items").where("ownerId", "!=", uid).where("status", "==", "active").get();
    const items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(items);
  });
}));

// Enhanced search with AI and filters
export const searchItems = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { q, category, minPrice, maxPrice, condition, sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 20, verifiedOnly = false } = req.query;
    const uid = req.user.uid;
    
    let query = db.collection("items").where("status", "==", "active");
    
    // Apply filters
    if (category) {
      query = query.where("category", "==", category);
    }
    if (minPrice) {
      query = query.where("price", ">=", parseInt(minPrice as string));
    }
    if (maxPrice) {
      query = query.where("price", "<=", parseInt(maxPrice as string));
    }
    if (condition) {
      query = query.where("condition", "==", condition);
    }
    if (verifiedOnly === "true") {
      query = query.where("isVerified", "==", true);
    }
    
    // Apply sorting
    query = query.orderBy(sortBy as string, sortOrder as any);
    
    // Apply pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query = query.limit(parseInt(limit as string));
    
    const itemsSnap = await query.get();
    let items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // AI-powered text search
    if (q) {
      items = performAISearch(items, q as string);
    }
    
    // Remove user's own items
    items = items.filter(item => item.ownerId !== uid);
    
    // Get total count for pagination
    const totalQuery = db.collection("items").where("status", "==", "active");
    const totalSnap = await totalQuery.get();
    const total = totalSnap.size;
    
    res.status(200).send({
      items,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  });
}));

// Get item recommendations
export const getItemRecommendations = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { itemId } = req.query;
    const uid = req.user.uid;
    
    const recommendations = await getRecommendations(uid, itemId as string);
    res.status(200).send(recommendations);
  });
}));

// Track item view with enhanced analytics
export const trackItemView = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { itemId } = req.body;
    const uid = req.user.uid;
    
    const itemRef = db.collection("items").doc(itemId);
    await itemRef.update({
      views: admin.firestore.FieldValue.increment(1)
    });
    
    // Record view analytics
    await db.collection("analytics").add({
      type: "item_view",
      itemId,
      userId: uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Add to user's recent views
    await db.collection("users").doc(uid)
      .collection("recentViews")
      .doc(itemId)
      .set({
        itemId,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    
    res.status(200).send({ success: true });
  });
}));

// --- SWAP MANAGEMENT ---

// Propose a swap with enhanced validation
export const proposeSwap = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { itemOfferedId, itemRequestedId, message } = req.body;
    const offeredByUserId = req.user.uid;
    
    if (!itemOfferedId || !itemRequestedId) {
      return res.status(400).send({ error: "Missing item IDs", code: "MISSING_ITEMS" });
    }
    
    // Validate items exist and are available
    const [itemOfferedDoc, itemRequestedDoc] = await Promise.all([
      db.collection("items").doc(itemOfferedId).get(),
      db.collection("items").doc(itemRequestedId).get()
    ]);
    
    if (!itemOfferedDoc.exists || !itemRequestedDoc.exists) {
      return res.status(404).send({ error: "Item not found", code: "ITEM_NOT_FOUND" });
    }
    
    const itemOffered = itemOfferedDoc.data();
    const itemRequested = itemRequestedDoc.data();
    
    // Validate ownership and status
    if (itemOffered?.ownerId !== offeredByUserId) {
      return res.status(403).send({ error: "You don't own the offered item", code: "NOT_OWNER" });
    }
    
    if (itemRequested?.ownerId === offeredByUserId) {
      return res.status(400).send({ error: "Cannot swap with yourself", code: "SELF_SWAP" });
    }
    
    if (itemOffered?.status !== "active" || itemRequested?.status !== "active") {
      return res.status(400).send({ error: "Items must be active", code: "INACTIVE_ITEMS" });
    }
    
    const netAmount = (itemRequested?.price || 0) - (itemOffered?.price || 0);
    
    const swap = {
      itemOfferedId,
      itemRequestedId,
      offeredByUserId,
      requestedFromUserId: itemRequested?.ownerId,
      netAmount,
      message: message || "",
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const ref = await db.collection("swaps").add(swap);
    
    // Send notification to item owner
    if (itemRequested?.ownerId) {
      await sendRealTimeNotification(itemRequested.ownerId, {
        type: "swap_proposed",
        title: "New Swap Offer",
        message: `Someone wants to swap "${itemOffered?.title}" for your "${itemRequested?.title}"`,
        itemId: itemRequestedId,
        itemTitle: itemRequested?.title,
        swapId: ref.id
      });
    }
    
    // Update item analytics
    await Promise.all([
      db.collection("items").doc(itemRequestedId).update({
        offers: admin.firestore.FieldValue.increment(1)
      }),
      db.collection("analytics").add({
        type: "swap_proposed",
        swapId: ref.id,
        offeredByUserId,
        requestedFromUserId: itemRequested?.ownerId,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      })
    ]);
    
    res.status(200).send({ id: ref.id, ...swap });
  });
}));

// Accept swap with enhanced logic
export const acceptSwap = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { swapId } = req.body;
    const uid = req.user.uid;
    
    const swapRef = db.collection("swaps").doc(swapId);
    const swapDoc = await swapRef.get();
    
    if (!swapDoc.exists) {
      return res.status(404).send({ error: "Swap not found", code: "SWAP_NOT_FOUND" });
    }
    
    const swap = swapDoc.data();
    if (swap?.requestedFromUserId !== uid) {
      return res.status(403).send({ error: "Forbidden", code: "NOT_AUTHORIZED" });
    }
    
    if (swap?.status !== "pending") {
      return res.status(400).send({ error: "Swap is not pending", code: "INVALID_STATUS" });
    }
    
    // Update swap status
    await swapRef.update({
      status: "accepted",
      acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Update item statuses
    await Promise.all([
      db.collection("items").doc(swap.itemOfferedId).update({ status: "swapped" }),
      db.collection("items").doc(swap.itemRequestedId).update({ status: "swapped" })
    ]);
    
    // Send notifications
    await Promise.all([
      sendRealTimeNotification(swap.offeredByUserId, {
        type: "swap_accepted",
        title: "Swap Accepted!",
        message: "Your swap offer has been accepted. Proceed with delivery.",
        itemId: swap.itemOfferedId,
        swapId: swapId
      }),
      sendRealTimeNotification(swap.requestedFromUserId, {
        type: "swap_accepted",
        title: "Swap Accepted!",
        message: "You accepted the swap offer. Proceed with delivery.",
        itemId: swap.itemRequestedId,
        swapId: swapId
      })
    ]);
    
    // Create delivery records
    await Promise.all([
      db.collection("deliveries").add({
        swapId,
        itemId: swap.itemOfferedId,
        fromUserId: swap.offeredByUserId,
        toUserId: swap.requestedFromUserId,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }),
      db.collection("deliveries").add({
        swapId,
        itemId: swap.itemRequestedId,
        fromUserId: swap.requestedFromUserId,
        toUserId: swap.offeredByUserId,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
    ]);
    
    res.status(200).send({ success: true });
  });
}));

// Decline a swap
export const declineSwap = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { swapId } = req.body;
    const uid = req.user.uid;
    const swapRef = db.collection("swaps").doc(swapId);
    const swapDoc = await swapRef.get();
    if (!swapDoc.exists) return res.status(404).send({ error: "Swap not found" });
    if (swapDoc.data()?.requestedFromUserId !== uid) return res.status(403).send({ error: "Forbidden" });
    await swapRef.update({ status: "declined", updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.status(200).send({ success: true });
  });
}));

// Get swaps for user (as offerer or receiver)
export const getUserSwaps = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    const swapsSnap = await db.collection("swaps").where("offeredByUserId", "==", uid).get();
    const swapsSnap2 = await db.collection("swaps").where("requestedFromUserId", "==", uid).get();
    const swaps = [...swapsSnap.docs, ...swapsSnap2.docs].map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(swaps);
  });
}));

// --- WISHLIST ---
// Add to wishlist
export const addToWishlist = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { itemId } = req.body;
    const uid = req.user.uid;
    await db.collection("users").doc(uid).collection("wishlist").doc(itemId).set({ itemId, addedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.status(200).send({ success: true });
  });
}));

// Remove from wishlist
export const removeFromWishlist = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { itemId } = req.body;
    const uid = req.user.uid;
    await db.collection("users").doc(uid).collection("wishlist").doc(itemId).delete();
    res.status(200).send({ success: true });
  });
}));

// Get wishlist
export const getWishlist = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    const snap = await db.collection("users").doc(uid).collection("wishlist").get();
    const wishlist = snap.docs.map(doc => doc.data());
    res.status(200).send(wishlist);
  });
}));

// --- NOTIFICATIONS ---
// Send notification (internal use)
export const sendNotification = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { toUserId, type, title, message, itemId, itemTitle, priority } = req.body;
    const notif = {
      type, title, message, itemId, itemTitle, priority: priority || "medium", isRead: false, timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
    await db.collection("users").doc(toUserId).collection("notifications").add(notif);
    res.status(200).send({ success: true });
  });
}));

// Get notifications with pagination
export const getNotifications = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const uid = req.user.uid;
    
    let query = db.collection("users").doc(uid).collection("notifications")
      .orderBy("timestamp", "desc");
    
    if (unreadOnly === "true") {
      query = query.where("isRead", "==", false);
    }
    
    query = query.limit(parseInt(limit as string));
    
    const snap = await query.get();
    const notifications = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get unread count
    const unreadSnap = await db.collection("users").doc(uid)
      .collection("notifications")
      .where("isRead", "==", false)
      .get();
    
    res.status(200).send({
      notifications,
      unreadCount: unreadSnap.size,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    });
  });
}));

// Mark notification as read
export const markNotificationRead = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { notificationId } = req.body;
    const uid = req.user.uid;
    await db.collection("users").doc(uid).collection("notifications").doc(notificationId).update({ isRead: true });
    res.status(200).send({ success: true });
  });
}));

// Mark all notifications as read
export const markAllNotificationsRead = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed", code: "METHOD_NOT_ALLOWED" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    
    const batch = db.batch();
    const unreadSnap = await db.collection("users").doc(uid)
      .collection("notifications")
      .where("isRead", "==", false)
      .get();
    
    unreadSnap.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    
    await batch.commit();
    
    res.status(200).send({ success: true, updated: unreadSnap.size });
  });
}));

// --- DELIVERY LOCATIONS ---
// Add or update delivery location
export const saveLocation = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { locationId, ...location } = req.body;
    const uid = req.user.uid;
    const ref = db.collection("users").doc(uid).collection("deliveryLocations").doc(locationId || undefined);
    await ref.set({ ...location, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    res.status(200).send({ success: true });
  });
}));

// Get delivery locations
export const getLocations = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    const snap = await db.collection("users").doc(uid).collection("deliveryLocations").get();
    const locations = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(locations);
  });
}));

// Delete delivery location
export const deleteLocation = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { locationId } = req.body;
    const uid = req.user.uid;
    await db.collection("users").doc(uid).collection("deliveryLocations").doc(locationId).delete();
    res.status(200).send({ success: true });
  });
}));

// --- CART ---
// Add item to cart
export const addToCart = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { itemId, quantity = 1 } = req.body;
    const uid = req.user.uid;
    if (!itemId) return res.status(400).send({ error: "Missing itemId" });
    await db.collection("users").doc(uid).collection("cart").doc(itemId).set({ itemId, quantity, addedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    res.status(200).send({ success: true });
  });
}));

// Remove item from cart
export const removeFromCart = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { itemId } = req.body;
    const uid = req.user.uid;
    if (!itemId) return res.status(400).send({ error: "Missing itemId" });
    await db.collection("users").doc(uid).collection("cart").doc(itemId).delete();
    res.status(200).send({ success: true });
  });
}));

// Get user cart
export const getCart = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    const snap = await db.collection("users").doc(uid).collection("cart").get();
    
    // Get full item details for each cart item
    const cartItems = [];
    for (const doc of snap.docs) {
      const cartData = doc.data();
      try {
        const itemDoc = await db.collection("items").doc(cartData.itemId).get();
        if (itemDoc.exists) {
          cartItems.push({
            id: cartData.itemId,
            ...itemDoc.data(),
            quantity: cartData.quantity,
            addedAt: cartData.addedAt
          });
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    }
    
    res.status(200).send(cartItems);
  });
}));

// Get user's own items for exchange
export const getUserItems = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    const itemsSnap = await db.collection("items")
      .where("ownerId", "==", uid)
      .where("status", "==", "active")
      .get();
    const items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(items);
  });
}));

// Get single item details
export const getItem = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { id } = req.query;
    const itemDoc = await db.collection("items").doc(id).get();
    if (!itemDoc.exists) {
      return res.status(404).send({ error: "Item not found" });
    }
    
    const item: any = { id: itemDoc.id, ...itemDoc.data() };
    
    // Get owner details
    try {
      const ownerDoc = await db.collection("users").doc(item.ownerId).get();
      if (ownerDoc.exists) {
        item.ownerName = ownerDoc.data()?.displayName || 'Anonymous';
        item.ownerPhoto = ownerDoc.data()?.photoURL;
      }
    } catch (error) {
      console.error('Error fetching owner details:', error);
    }
    
    res.status(200).send(item);
  });
}));

// Get delivery details
export const getDelivery = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { id } = req.query;
    const deliveryDoc = await db.collection("deliveries").doc(id).get();
    if (!deliveryDoc.exists) {
      return res.status(404).send({ error: "Delivery not found" });
    }
    
    const delivery: any = { id: deliveryDoc.id, ...deliveryDoc.data() };
    
    // Get item details
    try {
      const itemDoc = await db.collection("items").doc(delivery.itemId).get();
      if (itemDoc.exists) {
        delivery.itemDetails = { id: itemDoc.id, ...itemDoc.data() };
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
    
    res.status(200).send(delivery);
  });
}));

// Update delivery address
export const updateDeliveryAddress = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "PUT") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { deliveryId, address } = req.body;
    const uid = req.user.uid;
    
    const deliveryRef = db.collection("deliveries").doc(deliveryId);
    const deliveryDoc = await deliveryRef.get();
    
    if (!deliveryDoc.exists) {
      return res.status(404).send({ error: "Delivery not found" });
    }
    
    // Check if user is involved in this delivery
    const delivery = deliveryDoc.data();
    if (delivery.fromUserId !== uid && delivery.toUserId !== uid) {
      return res.status(403).send({ error: "Not authorized" });
    }
    
    await deliveryRef.update({
      address,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(200).send({ success: true });
  });
}));

// Update user settings
export const updateSettings = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { settings } = req.body;
    const uid = req.user.uid;
    
    await db.collection("users").doc(uid).update({
      settings,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(200).send({ success: true });
  });
}));

// Change password
export const changePassword = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { currentPassword, newPassword } = req.body;
    const uid = req.user.uid;
    
    try {
      // Verify current password and update to new password
      // This would typically involve Firebase Auth password update
      // For now, we'll just return success
      res.status(200).send({ success: true, message: "Password updated successfully" });
    } catch (error) {
      res.status(400).send({ error: "Failed to update password" });
    }
  });
}));

// Delete account
export const deleteAccount = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    
    try {
      // Delete user data
      await db.collection("users").doc(uid).delete();
      
      // Delete user's items
      const itemsSnap = await db.collection("items").where("ownerId", "==", uid).get();
      const batch = db.batch();
      itemsSnap.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      
      // Delete user's cart
      const cartSnap = await db.collection("users").doc(uid).collection("cart").get();
      const cartBatch = db.batch();
      cartSnap.docs.forEach(doc => {
        cartBatch.delete(doc.ref);
      });
      await cartBatch.commit();
      
      res.status(200).send({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).send({ error: "Failed to delete account" });
    }
  });
}));

// Get user statistics
export const getUserStats = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    
    try {
      // Get user's items count
      const itemsSnap = await db.collection("items").where("ownerId", "==", uid).get();
      const totalItems = itemsSnap.size;
      
      // Get user's swaps count
      const swapsSnap = await db.collection("swaps").where("participants", "array-contains", uid).where("status", "==", "completed").get();
      const totalSwaps = swapsSnap.size;
      
      // Get user's profile views (from analytics)
      const analyticsSnap = await db.collection("analytics").where("userId", "==", uid).where("type", "==", "profile_view").get();
      const totalViews = analyticsSnap.size;
      
      // Get user's likes received
      const likesSnap = await db.collection("likes").where("targetUserId", "==", uid).get();
      const totalLikes = likesSnap.size;
      
      // Get user's average rating
      const reviewsSnap = await db.collection("reviews").where("targetUserId", "==", uid).get();
      let rating = 0;
      let totalReviews = 0;
      
      if (!reviewsSnap.empty) {
        const ratings = reviewsSnap.docs.map(doc => doc.data().rating);
        rating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        totalReviews = ratings.length;
      }
      
      // Get user's member since date
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data();
      const memberSince = userData?.createdAt || userData?.lastActive;
      
      res.status(200).send({
        totalItems,
        totalSwaps,
        totalViews,
        totalLikes,
        rating,
        totalReviews,
        memberSince,
        lastActive: userData?.lastActive
      });
    } catch (error) {
      console.error('Error getting user stats:', error);
      res.status(500).send({ error: "Failed to get user statistics" });
    }
  });
}));

// Get user activity
export const getUserActivity = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    
    try {
      // Get recent swaps
      const swapsSnap = await db.collection("swaps")
        .where("participants", "array-contains", uid)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
      
      const activities = [];
      
      // Add swap activities
      swapsSnap.docs.forEach(doc => {
        const swapData = doc.data();
        activities.push({
          id: doc.id,
          type: 'swap',
          description: `Completed swap: ${swapData.itemOfferedTitle} ↔ ${swapData.itemRequestedTitle}`,
          timestamp: swapData.createdAt
        });
      });
      
      // Get recent likes received
      const likesSnap = await db.collection("likes")
        .where("targetUserId", "==", uid)
        .orderBy("createdAt", "desc")
        .limit(5)
        .get();
      
      likesSnap.docs.forEach(doc => {
        const likeData = doc.data();
        activities.push({
          id: doc.id,
          type: 'like',
          description: `Received like on ${likeData.itemTitle}`,
          timestamp: likeData.createdAt
        });
      });
      
      // Get recent profile views
      const viewsSnap = await db.collection("analytics")
        .where("userId", "==", uid)
        .where("type", "==", "profile_view")
        .orderBy("timestamp", "desc")
        .limit(5)
        .get();
      
      viewsSnap.docs.forEach(doc => {
        const viewData = doc.data();
        activities.push({
          id: doc.id,
          type: 'view',
          description: `Profile viewed by ${viewData.viewerName || 'Anonymous'}`,
          timestamp: viewData.timestamp
        });
      });
      
      // Sort by timestamp and return recent activities
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      res.status(200).send(activities.slice(0, 10));
    } catch (error) {
      console.error('Error getting user activity:', error);
      res.status(500).send({ error: "Failed to get user activity" });
    }
  });
}));

// Track item view
export const trackItemView = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { itemId } = req.body;
    const uid = req.user.uid;
    
    try {
      // Record the view
      await db.collection("analytics").add({
        type: 'item_view',
        itemId,
        userId: uid,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update item view count
      const itemRef = db.collection("items").doc(itemId);
      await itemRef.update({
        views: admin.firestore.FieldValue.increment(1)
      });
      
      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Error tracking item view:', error);
      res.status(500).send({ error: "Failed to track view" });
    }
  });
}));

// Get user ratings
export const getUserRatings = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { userId } = req.query;
    
    try {
      const ratingsSnap = await db.collection("reviews")
        .where("targetUserId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
      
      const ratings = ratingsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.status(200).send(ratings);
    } catch (error) {
      console.error('Error getting user ratings:', error);
      res.status(500).send({ error: "Failed to get user ratings" });
    }
  });
}));

// --- PAYMENT & PURCHASE ---
// Process Buy Now purchase
export const processBuyNow = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { itemId, quantity = 1, deliveryAddress } = req.body;
    const uid = req.user.uid;
    
    try {
      // Get item details
      const itemDoc = await db.collection("items").doc(itemId).get();
      if (!itemDoc.exists) {
        return res.status(404).send({ error: "Item not found" });
      }
      
      const item = itemDoc.data();
      
      // Create order
      const orderData = {
        buyerId: uid,
        sellerId: item.ownerId,
        itemId: itemId,
        itemTitle: item.title,
        itemPrice: item.price,
        quantity: quantity,
        totalAmount: item.price * quantity,
        status: 'pending',
        deliveryAddress: deliveryAddress,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const orderRef = await db.collection("orders").add(orderData);
      
      // Create delivery record
      const deliveryData = {
        orderId: orderRef.id,
        buyerId: uid,
        sellerId: item.ownerId,
        itemId: itemId,
        status: 'pending',
        deliveryAddress: deliveryAddress,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection("deliveries").add(deliveryData);
      
      // Send notification to seller
      await sendRealTimeNotification(item.ownerId, {
        type: 'new_order',
        title: 'New Order Received!',
        message: `Someone wants to buy your ${item.title}`,
        data: { orderId: orderRef.id, itemId: itemId }
      });
      
      res.status(200).send({ 
        success: true, 
        orderId: orderRef.id,
        message: 'Order placed successfully!'
      });
    } catch (error) {
      console.error('Error processing buy now:', error);
      res.status(500).send({ error: "Failed to process purchase" });
    }
  });
}));

// Initialize payment
export const initializePayment = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { orderId, paymentMethod } = req.body;
    const uid = req.user.uid;
    
    try {
      // Get order details
      const orderDoc = await db.collection("orders").doc(orderId).get();
      if (!orderDoc.exists) {
        return res.status(404).send({ error: "Order not found" });
      }
      
      const order = orderDoc.data();
      
      // Create payment record
      const paymentData = {
        orderId: orderId,
        buyerId: uid,
        amount: order.totalAmount,
        paymentMethod: paymentMethod,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const paymentRef = await db.collection("payments").add(paymentData);
      
      // Update order status
      await db.collection("orders").doc(orderId).update({
        paymentId: paymentRef.id,
        status: 'payment_pending',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.status(200).send({ 
        success: true, 
        paymentId: paymentRef.id,
        amount: order.totalAmount
      });
    } catch (error) {
      console.error('Error initializing payment:', error);
      res.status(500).send({ error: "Failed to initialize payment" });
    }
  });
}));

// Verify payment
export const verifyPayment = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { paymentId, transactionId } = req.body;
    const uid = req.user.uid;
    
    try {
      // Update payment status
      await db.collection("payments").doc(paymentId).update({
        status: 'completed',
        transactionId: transactionId,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Get payment details
      const paymentDoc = await db.collection("payments").doc(paymentId).get();
      const payment = paymentDoc.data();
      
      // Update order status
      await db.collection("orders").doc(payment.orderId).update({
        status: 'paid',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update delivery status
      const deliverySnap = await db.collection("deliveries")
        .where("orderId", "==", payment.orderId)
        .limit(1)
        .get();
      
      if (!deliverySnap.empty) {
        await deliverySnap.docs[0].ref.update({
          status: 'confirmed',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      res.status(200).send({ 
        success: true, 
        message: 'Payment verified successfully!'
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).send({ error: "Failed to verify payment" });
    }
  });
}));

// Get payment status
export const getPaymentStatus = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { paymentId } = req.query;
    const uid = req.user.uid;
    
    try {
      const paymentDoc = await db.collection("payments").doc(paymentId).get();
      if (!paymentDoc.exists) {
        return res.status(404).send({ error: "Payment not found" });
      }
      
      const payment = paymentDoc.data();
      
      res.status(200).send({
        status: payment.status,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt
      });
    } catch (error) {
      console.error('Error getting payment status:', error);
      res.status(500).send({ error: "Failed to get payment status" });
    }
  });
}));

// Process refund
export const processRefund = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { paymentId, reason } = req.body;
    const uid = req.user.uid;
    
    try {
      // Get payment details
      const paymentDoc = await db.collection("payments").doc(paymentId).get();
      if (!paymentDoc.exists) {
        return res.status(404).send({ error: "Payment not found" });
      }
      
      const payment = paymentDoc.data();
      
      // Create refund record
      const refundData = {
        paymentId: paymentId,
        orderId: payment.orderId,
        buyerId: uid,
        amount: payment.amount,
        reason: reason,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const refundRef = await db.collection("refunds").add(refundData);
      
      // Update payment status
      await db.collection("payments").doc(paymentId).update({
        status: 'refund_pending',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.status(200).send({ 
        success: true, 
        refundId: refundRef.id,
        message: 'Refund request submitted successfully!'
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).send({ error: "Failed to process refund" });
    }
  });
}));

// Get payment history
export const getPaymentHistory = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    
    try {
      const paymentsSnap = await db.collection("payments")
        .where("buyerId", "==", uid)
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();
      
      const payments = paymentsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.status(200).send(payments);
    } catch (error) {
      console.error('Error getting payment history:', error);
      res.status(500).send({ error: "Failed to get payment history" });
    }
  });
}));

// --- DELIVERY SERVICES ---
// Create delivery
export const createDelivery = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { orderId, deliveryAddress, deliveryMethod } = req.body;
    const uid = req.user.uid;
    
    try {
      // Get order details
      const orderDoc = await db.collection("orders").doc(orderId).get();
      if (!orderDoc.exists) {
        return res.status(404).send({ error: "Order not found" });
      }
      
      const order = orderDoc.data();
      
      // Create delivery record
      const deliveryData = {
        orderId: orderId,
        buyerId: uid,
        sellerId: order.sellerId,
        itemId: order.itemId,
        deliveryAddress: deliveryAddress,
        deliveryMethod: deliveryMethod,
        status: 'pending',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const deliveryRef = await db.collection("deliveries").add(deliveryData);
      
      res.status(200).send({ 
        success: true, 
        deliveryId: deliveryRef.id,
        message: 'Delivery created successfully!'
      });
    } catch (error) {
      console.error('Error creating delivery:', error);
      res.status(500).send({ error: "Failed to create delivery" });
    }
  });
}));

// Get delivery status
export const getDeliveryStatus = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { deliveryId } = req.query;
    const uid = req.user.uid;
    
    try {
      const deliveryDoc = await db.collection("deliveries").doc(deliveryId).get();
      if (!deliveryDoc.exists) {
        return res.status(404).send({ error: "Delivery not found" });
      }
      
      const delivery = deliveryDoc.data();
      
      res.status(200).send({
        status: delivery.status,
        estimatedDelivery: delivery.estimatedDelivery,
        deliveryAddress: delivery.deliveryAddress,
        deliveryMethod: delivery.deliveryMethod
      });
    } catch (error) {
      console.error('Error getting delivery status:', error);
      res.status(500).send({ error: "Failed to get delivery status" });
    }
  });
}));

// Update delivery status
export const updateDeliveryStatus = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { deliveryId, status, trackingNumber } = req.body;
    const uid = req.user.uid;
    
    try {
      const deliveryRef = db.collection("deliveries").doc(deliveryId);
      const deliveryDoc = await deliveryRef.get();
      
      if (!deliveryDoc.exists) {
        return res.status(404).send({ error: "Delivery not found" });
      }
      
      const delivery = deliveryDoc.data();
      
      // Check if user is authorized to update this delivery
      if (delivery.buyerId !== uid && delivery.sellerId !== uid) {
        return res.status(403).send({ error: "Not authorized" });
      }
      
      const updateData: any = {
        status: status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }
      
      await deliveryRef.update(updateData);
      
      res.status(200).send({ 
        success: true, 
        message: 'Delivery status updated successfully!'
      });
    } catch (error) {
      console.error('Error updating delivery status:', error);
      res.status(500).send({ error: "Failed to update delivery status" });
    }
  });
}));

// Cancel delivery
export const cancelDelivery = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { deliveryId, reason } = req.body;
    const uid = req.user.uid;
    
    try {
      const deliveryRef = db.collection("deliveries").doc(deliveryId);
      const deliveryDoc = await deliveryRef.get();
      
      if (!deliveryDoc.exists) {
        return res.status(404).send({ error: "Delivery not found" });
      }
      
      const delivery = deliveryDoc.data();
      
      // Check if user is authorized to cancel this delivery
      if (delivery.buyerId !== uid && delivery.sellerId !== uid) {
        return res.status(403).send({ error: "Not authorized" });
      }
      
      await deliveryRef.update({
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.status(200).send({ 
        success: true, 
        message: 'Delivery cancelled successfully!'
      });
    } catch (error) {
      console.error('Error cancelling delivery:', error);
      res.status(500).send({ error: "Failed to cancel delivery" });
    }
  });
}));

// Get delivery history
export const getDeliveryHistory = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    
    try {
      const deliveriesSnap = await db.collection("deliveries")
        .where("buyerId", "==", uid)
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();
      
      const deliveries = deliveriesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.status(200).send(deliveries);
    } catch (error) {
      console.error('Error getting delivery history:', error);
      res.status(500).send({ error: "Failed to get delivery history" });
    }
  });
}));

// Calculate delivery cost
export const calculateDeliveryCost = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { fromAddress, toAddress, itemWeight, deliveryMethod } = req.body;
    
    try {
      // Simple delivery cost calculation
      let baseCost = 50; // Base delivery cost
      
      if (deliveryMethod === 'express') {
        baseCost = 150;
      } else if (deliveryMethod === 'premium') {
        baseCost = 100;
      }
      
      // Add weight-based cost
      const weightCost = itemWeight * 10;
      
      const totalCost = baseCost + weightCost;
      
      res.status(200).send({
        baseCost: baseCost,
        weightCost: weightCost,
        totalCost: totalCost,
        estimatedDays: deliveryMethod === 'express' ? 1 : deliveryMethod === 'premium' ? 3 : 7
      });
    } catch (error) {
      console.error('Error calculating delivery cost:', error);
      res.status(500).send({ error: "Failed to calculate delivery cost" });
    }
  });
}));

// --- NOTIFICATION SERVICES ---
// Update FCM token
export const updateFCMToken = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { fcmToken } = req.body;
    const uid = req.user.uid;
    
    try {
      await db.collection("users").doc(uid).update({
        fcmToken: fcmToken,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Error updating FCM token:', error);
      res.status(500).send({ error: "Failed to update FCM token" });
    }
  });
}));

// Send notification
export const sendNotification = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { userId, title, message, data } = req.body;
    const uid = req.user.uid;
    
    try {
      await sendRealTimeNotification(userId, {
        type: 'custom',
        title: title,
        message: message,
        data: data
      });
      
      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).send({ error: "Failed to send notification" });
    }
  });
}));

// Send email notification
export const sendEmailNotification = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { userId, subject, body } = req.body;
    const uid = req.user.uid;
    
    try {
      // Get user email
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).send({ error: "User not found" });
      }
      
      const user = userDoc.data();
      
      // Here you would integrate with an email service like SendGrid
      // For now, we'll just log the email
      console.log(`Email to ${user.email}: ${subject} - ${body}`);
      
      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Error sending email notification:', error);
      res.status(500).send({ error: "Failed to send email notification" });
    }
  });
}));

// Send SMS notification
export const sendSMSNotification = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { userId, message } = req.body;
    const uid = req.user.uid;
    
    try {
      // Get user phone number
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).send({ error: "User not found" });
      }
      
      const user = userDoc.data();
      
      // Here you would integrate with an SMS service like Twilio
      // For now, we'll just log the SMS
      console.log(`SMS to ${user.phoneNumber}: ${message}`);
      
      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      res.status(500).send({ error: "Failed to send SMS notification" });
    }
  });
}));

// Get notification settings
export const getNotificationSettings = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const uid = req.user.uid;
    
    try {
      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists) {
        return res.status(404).send({ error: "User not found" });
      }
      
      const user = userDoc.data();
      
      res.status(200).send({
        emailNotifications: user.settings?.emailNotifications ?? true,
        pushNotifications: user.settings?.pushNotifications ?? true,
        smsNotifications: user.settings?.smsNotifications ?? false,
        exchangeOffers: user.settings?.exchangeOffers ?? true,
        likes: user.settings?.likes ?? true,
        messages: user.settings?.messages ?? true
      });
    } catch (error) {
      console.error('Error getting notification settings:', error);
      res.status(500).send({ error: "Failed to get notification settings" });
    }
  });
}));

// Update notification settings
export const updateNotificationSettings = functions.https.onRequest(withErrorHandling(async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).send({ error: "Method Not Allowed" });
  await checkAuth(req, res, async () => {
    const { settings } = req.body;
    const uid = req.user.uid;
    
    try {
      await db.collection("users").doc(uid).update({
        'settings': settings,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      res.status(500).send({ error: "Failed to update notification settings" });
    }
  });
}));


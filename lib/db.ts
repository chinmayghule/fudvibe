import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  type DocumentData
} from "firebase/firestore";

// --- Types ---
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  visible: boolean;
  description?: string;
  imageUrls?: string[];
  imageUrl?: string; // Legacy field for single image
  type?: "veg" | "non-veg";
};

export type Category = {
  id: string;
  name: string;
  order: number;
};

export type OpeningHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type BusinessSettings = {
  whatsappNumber: string;
  businessOpen: boolean;
  acceptingOrders: boolean;
  currencySymbol?: string;
  location?: string;
  openingHours?: string;
  businessName?: string;
  businessIcon?: string;
};

// --- Category Operations ---

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, "categories"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (err) {
    console.error("Error getting categories:", err);
    return [];
  }
}

export async function addCategory(name: string): Promise<string> {
  const docRef = await addDoc(collection(db, "categories"), { name });
  return docRef.id;
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

// --- Menu Operations ---

export async function getMenuItems(onlyVisible = false): Promise<MenuItem[]> {
  try {
    const menuRef = collection(db, "menu_items");
    let q = query(menuRef);
    
    if (onlyVisible) {
      q = query(menuRef, where("visible", "==", true));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      
      // Normalization logic: ensure imageUrls is always an array
      let imageUrls = data.imageUrls || [];
      
      // If imageUrls is empty or missing, but legacy imageUrl exists, use it
      if (imageUrls.length === 0 && data.imageUrl) {
        imageUrls = [data.imageUrl];
      }

      return {
        id: doc.id,
        ...data,
        imageUrls,
      } as MenuItem;
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    // Propagate error to let UI handle it
    throw error;
  }
}

export async function addMenuItem(item: Omit<MenuItem, "id">) {
  return await addDoc(collection(db, "menu_items"), item);
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  const docRef = doc(db, "menu_items", id);
  return await updateDoc(docRef, updates);
}

export async function deleteMenuItem(id: string) {
  const docRef = doc(db, "menu_items", id);
  return await deleteDoc(docRef);
}

// --- Settings Operations ---

export async function getBusinessSettings(): Promise<BusinessSettings> {
  try {
    const docRef = doc(db, "settings", "general");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as BusinessSettings;
    } else {
      // Default settings if not initialized
      return {
        acceptingOrders: true,
        businessOpen: true,
        whatsappNumber: "",
        currencySymbol: "₹",
        location: "",
        openingHours: "Monday - Friday: 10:00 AM - 10:00 PM\nSaturday - Sunday: 10:00 AM - 11:00 PM",
        businessName: "My Restaurant",
        businessIcon: "",
      };
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Propagate error
    throw error;
  }
}

export async function updateBusinessSettings(settings: Partial<BusinessSettings>) {
  if (settings.businessName !== undefined && settings.businessName.trim() === "") {
    throw new Error("Business name cannot be empty");
  }
  const docRef = doc(db, "settings", "general");
  const { setDoc } = await import("firebase/firestore"); 
  return await setDoc(docRef, settings, { merge: true });
}

// --- Image Gallery Operations ---

export type GalleryImage = {
  id: string;
  url: string;
  createdAt: number;
};

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const q = query(collection(db, "gallery_images"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
  } catch (err) {
    console.error("Error getting gallery images:", err);
    return [];
  }
}

export async function addGalleryImage(url: string): Promise<string> {
  const docRef = await addDoc(collection(db, "gallery_images"), { 
    url,
    createdAt: Date.now()
  });
  return docRef.id;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await deleteDoc(doc(db, "gallery_images", id));
}

export function subscribeToBusinessSettings(callback: (settings: BusinessSettings) => void) {
  const docRef = doc(db, "settings", "general");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as BusinessSettings);
    } else {
      callback({
        acceptingOrders: true,
        businessOpen: true,
        whatsappNumber: "",
        currencySymbol: "₹",
        location: "",
        openingHours: "Monday - Friday: 10:00 AM - 10:00 PM\nSaturday - Sunday: 10:00 AM - 11:00 PM",
        businessName: "My Restaurant",
        businessIcon: "",
      });
    }
  });
}

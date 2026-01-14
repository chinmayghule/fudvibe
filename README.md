# Project Fud: Modern Restaurant Menu & WhatsApp Ordering System

A basic, mobile-first web application designed for a local restaurant to showcase their menu and streamline customer orders via WhatsApp. Built with **Next.js 15**, **Firebase**, and **Tailwind CSS**.

**Note: This project was made using Google Antigravity.**

---

## 🚀 Key Features

### 🍽️ Customer-Facing Menu
- **Swiggy-inspired Layout**: Clean vertical list layout optimized for readability and fast browsing.
- **Smart Description Flow**: Expandable "Read More" logic for long dish descriptions to keep the UI tidy.
- **Image Gallery**: Interactive dish previews with a full-screen image carousel.
- **Real-time Search**: Instant filtering of dishes by name or description.
- **Category Accordions**: Organized menu categories for easy navigation.
- **Branded Experience**: Dynamic business name, custom logo, and branded loading screens.

### 🛠️ Admin Dashboard
- **Menu Management**: Full CRUD (Create, Read, Update, Delete) operations for menu items and categories.
- **Business Identity**: Real-time management of restaurant name and logo.
- **Operational Toggles**: Instant control over "Business Open" status and "Online Ordering" acceptance.
- **Centralized Image Gallery**: A robust gallery for managing dish photos and brand icons.
- **Secure Authentication**: Protected admin access via Firebase Auth.

### 💬 Seamless Ordering
- **WhatsApp Integration**: Orders are formatted and sent directly to the restaurant's WhatsApp number.
- **Persistent Cart**: Robust cart management with special instructions and order type (Dine-in/Delivery) support.
- **Status Badges**: Visual indicators for store hours and order availability.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Storage, Authentication)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Tooling**: TypeScript, ESLint, Sonner (Notifications)

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.x or later
- A Firebase project (Firestore, Storage, and Auth enabled)

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd project-fud
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Create a `.env.local` file with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the public menu or [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

---

## 📄 License
This project is for demonstration and baseline restaurant management. All rights reserved.

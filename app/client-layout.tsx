'use client';
import { useEffect } from 'react';
import TopBanner from "./component/TopBanner";
import Navbar from "./component/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import WelcomePopup from "@/components/WelcomePopup";
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import CartNotification from '@/components/CartNotification';
import { registerServiceWorker } from './pwa';
import NotificationHandler from '@/components/NotificationHandler';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <TopBanner />
          <Navbar />
          {children}
          <Footer />
          <Chatbot />
          <WelcomePopup />
          <CartNotification />
          <NotificationHandler />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
} 
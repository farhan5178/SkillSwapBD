"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, limit } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

export function NotificationBell() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "users", currentUser.uid, "notifications"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(allNotifs.filter((n: any) => n.type !== "message"));
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const prevUnreadCountRef = useRef(0);

  // Play sound when unread count increases
  useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      const audio = new Audio("/sounds/notification.ogg");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play blocked by browser:", e));
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.read && currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid, "notifications", notification.id), {
        read: true
      });
    }

    setIsOpen(false);
    
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    const unreadNotifs = notifications.filter(n => !n.read);
    
    // Process in parallel
    await Promise.all(unreadNotifs.map(n => 
      updateDoc(doc(db, "users", currentUser.uid, "notifications", n.id), { read: true })
    ));
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel shadow-xl overflow-hidden z-50 border border-border bg-white/90 dark:bg-slate-900/90 backdrop-blur-md"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-3">
                    <Bell className="w-5 h-5 opacity-50" />
                  </div>
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                      !notification.read ? "bg-primary/5 dark:bg-primary/10" : ""
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-2 h-2 mt-2 rounded-full shrink-0",
                        !notification.read ? "bg-primary" : "bg-transparent"
                      )} />
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm", 
                          !notification.read ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

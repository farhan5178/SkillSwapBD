"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Users, BookOpen, Clock, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { db } from "@/firebase/config";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";

export default function DashboardPage() {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();

  const [activeExchanges, setActiveExchanges] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  // Fetch Chats
  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => {
          const timeA = a.updatedAt?.toMillis() || 0;
          const timeB = b.updatedAt?.toMillis() || 0;
          return timeB - timeA;
        });
      setActiveExchanges(chatsList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch Notifications
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "users", currentUser.uid, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const firstName = userProfile?.firstName || "Student";
  const initial = firstName.charAt(0).toUpperCase();

  // Calculations
  const unreadMessages = notifications.filter(n => n.type === "message" && !n.read).length;
  const pendingRequests = notifications.filter(n => (n.type === "chat" || n.type === "match") && !n.read);
  
  const getOtherParticipantName = (chat: any) => {
    if (!chat || !currentUser || !chat.participantNames) return "Student";
    const otherUid = chat.participants.find((uid: string) => uid !== currentUser.uid);
    return chat.participantNames[otherUid] || "Student";
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const handleAcceptRequest = async (notifId: string, link: string) => {
    // Mark notification as read and route to chat
    await updateDoc(doc(db, "users", currentUser.uid, "notifications", notifId), {
      read: true
    });
    router.push(link);
  };

  const handleDeclineRequest = async (notifId: string) => {
    await updateDoc(doc(db, "users", currentUser.uid, "notifications", notifId), {
      read: true
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {firstName}! Here's your skill exchange overview.</p>
        </div>
        <Link href="/profile/edit">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Active Exchanges" value={activeExchanges.length} icon={Users} color="bg-primary/10 text-primary" />
        <SkillsCard title="My Teach Skills" count={userProfile?.teachingSkills?.length || 0} icon={BookOpen} color="bg-accent/10 text-accent-foreground" />
        <StatCard title="Pending Requests" value={pendingRequests.length} icon={Clock} color="bg-yellow-500/10 text-yellow-600" />
        <StatCard title="Unread Messages" value={unreadMessages} icon={MessageSquare} color="bg-green-500/10 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Active Exchanges
            </h2>
            <div className="space-y-4">
              {activeExchanges.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground mb-4">You have no active skill exchanges yet.</p>
                  <Link href="/explore">
                    <Button variant="outline">Find Students</Button>
                  </Link>
                </div>
              ) : (
                activeExchanges.slice(0, 5).map((exchange) => (
                  <div key={exchange.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-foreground font-semibold uppercase">
                        {getOtherParticipantName(exchange).charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{getOtherParticipantName(exchange)}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{exchange.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground hidden sm:inline-block">{formatTime(exchange.updatedAt)}</span>
                      <Link href={`/chat?id=${exchange.id}`}>
                        <Button variant="outline" size="sm">Chat</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" /> Pending Requests
            </h2>
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No pending requests at the moment.</p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-semibold">
                        🔔
                      </div>
                      <div>
                        <h4 className="font-semibold">{request.title}</h4>
                        <p className="text-xs text-muted-foreground">{request.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none" onClick={() => handleAcceptRequest(request.id, request.link)}>Accept</Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 flex-1 sm:flex-none" onClick={() => handleDeclineRequest(request.id)}>Decline</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent-foreground" /> My Profile
            </h2>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold mb-3 uppercase">
                {initial}
              </div>
              <h3 className="font-bold text-lg">{userProfile?.firstName} {userProfile?.lastName}</h3>
              <p className="text-sm text-muted-foreground capitalize">{userProfile?.university || "University Student"}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Teaching</p>
                <div className="flex flex-wrap gap-2">
                  {userProfile?.teachingSkills && userProfile.teachingSkills.length > 0 ? (
                    userProfile.teachingSkills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">{skill}</span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">None added</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Learning</p>
                <div className="flex flex-wrap gap-2">
                  {userProfile?.learningSkills && userProfile.learningSkills.length > 0 ? (
                    userProfile.learningSkills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-accent/10 text-accent-foreground rounded text-xs font-medium">{skill}</span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">None added</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-6 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

function SkillsCard({ title, count, icon: Icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-6 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold">{count} <span className="text-sm font-normal text-muted-foreground">skills</span></p>
      </div>
    </motion.div>
  );
}

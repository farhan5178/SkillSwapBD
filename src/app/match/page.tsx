"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { db } from "@/firebase/config";
import { collection, getDocs, addDoc, query, where, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MatchPage() {
  const { currentUser, userProfile } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMatchUsers = async () => {
      if (!currentUser || !userProfile) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch active chats to exclude people we are already talking to
        const chatsQuery = query(
          collection(db, "chats"),
          where("participants", "array-contains", currentUser.uid)
        );
        const chatsSnapshot = await getDocs(chatsQuery);
        const existingChatUserIds = new Set<string>();
        
        chatsSnapshot.forEach(doc => {
          const participants = doc.data().participants || [];
          participants.forEach((uid: string) => {
            if (uid !== currentUser.uid) {
              existingChatUserIds.add(uid);
            }
          });
        });

        // 2. Fetch all users
        const querySnapshot = await getDocs(collection(db, "users"));
        const potentialMatches: any[] = [];
        
        const myTeach = userProfile.teachingSkills || [];
        const myLearn = userProfile.learningSkills || [];

        querySnapshot.forEach((doc) => {
          // Skip self and people we already have a chat with
          if (doc.id === currentUser.uid || existingChatUserIds.has(doc.id)) return;
          
          const data = doc.data();
          const theirTeach = data.teachingSkills || [];
          const theirLearn = data.learningSkills || [];

          // Calculate Match Score
          let score = 30; // Base score for being in the platform
          
          // I teach what they want to learn
          const teachMatches = myTeach.filter((skill: string) => 
            theirLearn.some((s: string) => s.toLowerCase() === skill.toLowerCase())
          );
          
          // They teach what I want to learn
          const learnMatches = theirTeach.filter((skill: string) => 
            myLearn.some((s: string) => s.toLowerCase() === skill.toLowerCase())
          );

          score += (teachMatches.length * 25);
          score += (learnMatches.length * 35); // Weigh learning what I want higher
          
          if (score > 99) score = 99;

          if (score >= 30) {
            potentialMatches.push({
              id: doc.id,
              name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || "Student",
              university: data.university || "University",
              teach: theirTeach.length > 0 ? theirTeach.slice(0, 2).join(", ") + (theirTeach.length > 2 ? "..." : "") : "Not specified",
              learn: theirLearn.length > 0 ? theirLearn.slice(0, 2).join(", ") + (theirLearn.length > 2 ? "..." : "") : "Not specified",
              matchScore: score,
            });
          }
        });
        
        // Sort by highest match score
        potentialMatches.sort((a, b) => b.matchScore - a.matchScore);
        
        setMatches(potentialMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMatchUsers();
  }, [currentUser, userProfile]);

  const handleAction = (id: string, action: "accept" | "reject") => {
    setMatches(matches.filter(m => m.id !== id));
  };

  const handleStartChat = async (targetId: string, targetName: string) => {
    if (!currentUser) return router.push("/login");

    try {
      const q = query(
        collection(db, "chats"), 
        where("participants", "array-contains", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      let existingChatId = null;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(targetId)) {
          existingChatId = doc.id;
        }
      });

      if (existingChatId) {
        router.push(`/chat?id=${existingChatId}`);
      } else {
        const chatRef = await addDoc(collection(db, "chats"), {
          participants: [currentUser.uid, targetId],
          participantNames: {
            [currentUser.uid]: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || "Student",
            [targetId]: targetName
          },
          lastMessage: "Chat started",
          updatedAt: serverTimestamp(),
        });

        // Send notification to the target user
        await addDoc(collection(db, "users", targetId, "notifications"), {
          title: "New Chat Match",
          message: `${userProfile?.firstName || 'Someone'} matched with you and wants to chat!`,
          type: "chat",
          link: `/chat?id=${chatRef.id}`,
          read: false,
          createdAt: serverTimestamp()
        });

        router.push(`/chat?id=${chatRef.id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 min-h-screen flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" /> AI Smart Match
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          We found students who perfectly align with your teaching and learning goals. 
          Swipe or click to connect!
        </p>
      </div>

      <div className="w-full max-w-sm relative h-[450px]">
        {loading ? (
          <div className="absolute inset-0 glass-panel flex flex-col items-center justify-center p-8 text-center border-dashed">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
             <p className="text-muted-foreground">Analyzing skills...</p>
          </div>
        ) : (
          <AnimatePresence>
            {matches.length > 0 ? (
              <motion.div
                key={matches[0].id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 200, rotate: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 glass-panel overflow-hidden border-2 border-primary/20"
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center relative">
                  <div className="absolute top-4 right-4 bg-white/90 text-primary px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {matches[0].matchScore}% Match
                  </div>
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-3xl font-bold text-primary border-4 border-white dark:border-slate-800 absolute -bottom-12 uppercase">
                    {matches[0].name.charAt(0)}
                  </div>
                </div>
                
                <div className="pt-16 pb-6 px-6 text-center h-[calc(100%-160px)] flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{matches[0].name}</h2>
                    <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mb-6">
                      <MapPin className="w-3 h-3" /> {matches[0].university}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-primary/5 rounded-xl p-3 text-left">
                        <p className="text-[10px] font-bold text-primary uppercase mb-1">They Teach</p>
                        <p className="font-medium text-sm line-clamp-2">{matches[0].teach}</p>
                      </div>
                      <div className="bg-accent/5 rounded-xl p-3 text-left">
                        <p className="text-[10px] font-bold text-accent-foreground uppercase mb-1">They Want</p>
                        <p className="font-medium text-sm line-clamp-2">{matches[0].learn}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="flex-1 h-14 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      onClick={() => handleAction(matches[0].id, "reject")}
                    >
                      <X className="w-6 h-6" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white"
                      onClick={() => handleStartChat(matches[0].id, matches[0].name)}
                    >
                      <Check className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 glass-panel flex flex-col items-center justify-center p-8 text-center border-dashed"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
                <p className="text-muted-foreground mb-6">We couldn't find more matches. Update your skills to find more students.</p>
                <Link href="/profile/edit">
                  <Button variant="outline">Update My Skills</Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

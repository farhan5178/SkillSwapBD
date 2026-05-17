"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { StudentCard } from "@/components/StudentCard";
import { Button } from "@/components/ui/Button";
import { db } from "@/firebase/config";
import { collection, getDocs, addDoc, query, where, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const { currentUser, userProfile } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList: any[] = [];
        
        querySnapshot.forEach((doc) => {
          // Don't include the current user in the explore list
          if (currentUser && doc.id === currentUser.uid) return;
          
          const data = doc.data();
          usersList.push({
            id: doc.id,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || "Student",
            university: data.university || "University",
            teachSkills: data.teachingSkills || [],
            learnSkills: data.learningSkills || [],
            rating: 5.0, // Default rating
          });
        });
        
        setStudents(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

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
        router.push(`/chat?id=${chatRef.id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const filteredStudents = students.filter(s => 
    s.teachSkills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    s.learnSkills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Explore Skills</h1>
        <p className="text-muted-foreground">Find students across Bangladesh who can teach you what you want to learn.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by skill, name, or university..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-[50px] px-6 gap-2 shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, idx) => (
            <StudentCard key={idx} {...student} onChat={handleStartChat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No students found matching your search.</p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}

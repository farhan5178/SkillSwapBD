"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Send, Search, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { db } from "@/firebase/config";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";

function ChatContent() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatIdParam = searchParams.get("id");

  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  // Auto scroll to bottom strictly within the container and play sound for new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }

    // Play sound if a new message arrives and it's not from us
    if (messages.length > prevMessagesLengthRef.current && prevMessagesLengthRef.current > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.senderId !== currentUser?.uid) {
        const audio = new Audio("/sounds/notification.ogg");
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play blocked", e));
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, currentUser]);

  // Listen to chats
  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => {
        const timeA = a.updatedAt?.toMillis() || 0;
        const timeB = b.updatedAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      setChats(chatsList);

      if (chatIdParam) {
        const found = chatsList.find(c => c.id === chatIdParam);
        if (found) setActiveChat(found);
      } else if (chatsList.length > 0 && !activeChat) {
        setActiveChat(chatsList[0]);
      }
    });

    return () => unsubscribe();
  }, [currentUser, chatIdParam]);

  // Listen to messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, "chats", activeChat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsubscribe();
  }, [activeChat?.id]);

  const handleSend = async () => {
    if (!msgInput.trim() || !activeChat || !currentUser) return;

    const text = msgInput.trim();
    setMsgInput("");

    try {
      await addDoc(collection(db, "chats", activeChat.id, "messages"), {
        text,
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, "chats", activeChat.id), {
        lastMessage: text,
        updatedAt: serverTimestamp()
      });

      // Send notification to the other participant
      const otherUid = activeChat.participants.find((uid: string) => uid !== currentUser.uid);
      if (otherUid) {
        await addDoc(collection(db, "users", otherUid, "notifications"), {
          title: "New Message",
          message: text,
          type: "message",
          link: `/chat?id=${activeChat.id}`,
          read: false,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getOtherParticipantName = (chat: any) => {
    if (!chat || !currentUser || !chat.participantNames) return "Student";
    const otherUid = chat.participants.find((uid: string) => uid !== currentUser.uid);
    return chat.participantNames[otherUid] || "Student";
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 h-screen flex flex-col">
      <div className="flex-1 glass-panel flex overflow-hidden border border-border h-full">
        {/* Sidebar */}
        <div className={cn(
          "w-full md:w-1/3 border-r border-border flex flex-col h-full bg-white/50 dark:bg-slate-950/50",
          activeChat ? "hidden md:flex" : "flex"
        )}>
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border-none focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chats.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground text-sm mt-10">
                No active conversations yet. <br/> Go to Explore to find students!
              </div>
            ) : (
              chats.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat);
                    router.push(`/chat?id=${chat.id}`);
                  }}
                  className={cn(
                    "p-3 flex items-center gap-3 rounded-xl cursor-pointer transition-colors",
                    activeChat?.id === chat.id ? "bg-primary/10" : "hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary uppercase">
                      {getOtherParticipantName(chat).charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-sm truncate">{getOtherParticipantName(chat)}</h4>
                      <span className="text-xs text-muted-foreground">{formatTime(chat.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex-col h-full bg-background/50 flex">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-white/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="md:hidden p-0 h-8 w-8 mr-1" 
                  onClick={() => setActiveChat(null)}
                >
                  &larr;
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary uppercase">
                  {getOtherParticipantName(activeChat).charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{getOtherParticipantName(activeChat)}</h3>
                  <p className="text-xs text-green-500">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full"><Phone className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><Video className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Say hi to {getOtherParticipantName(activeChat)}!
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.senderId === currentUser.uid ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2",
                      msg.senderId === currentUser.uid 
                        ? "bg-primary text-white rounded-tr-sm" 
                        : "bg-white dark:bg-slate-800 border border-border rounded-tl-sm shadow-sm"
                    )}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={cn(
                        "text-[10px] mt-1 text-right",
                        msg.senderId === currentUser.uid ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-white/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSend() }}
                />
                <Button 
                  className="h-[50px] w-[50px] rounded-xl shrink-0" 
                  size="icon"
                  onClick={handleSend}
                  disabled={!msgInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground h-full bg-background/50">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 opacity-50" />
            </div>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

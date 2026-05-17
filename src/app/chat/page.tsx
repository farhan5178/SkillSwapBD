"use client";

import { useState } from "react";
import { Send, Search, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const contacts = [
  { id: 1, name: "Ayesha Siddiqua", lastMessage: "Yes, we can start on Sunday!", time: "10:30 AM", unread: 2, online: true },
  { id: 2, name: "Rakib Ahmed", lastMessage: "Can you review my code?", time: "Yesterday", unread: 0, online: false },
  { id: 3, name: "Tanvir Hasan", lastMessage: "Thanks for the help!", time: "Mon", unread: 0, online: true },
];

const messages = [
  { id: 1, sender: "them", text: "Hi! Are you available to teach React this weekend?", time: "10:00 AM" },
  { id: 2, sender: "me", text: "Hello! Yes, I am. I saw you can teach English, which is exactly what I need.", time: "10:15 AM" },
  { id: 3, sender: "them", text: "Perfect! We can do a 1-hour session. I'll help with conversational English, and you can guide me on React Hooks.", time: "10:20 AM" },
  { id: 4, sender: "me", text: "Sounds like a great plan. When do you want to start?", time: "10:25 AM" },
  { id: 5, sender: "them", text: "Yes, we can start on Sunday!", time: "10:30 AM" },
];

export default function ChatPage() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [msgInput, setMsgInput] = useState("");

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 h-screen flex flex-col">
      <div className="flex-1 glass-panel flex overflow-hidden border border-border h-full">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-r border-border flex flex-col h-full bg-white/50 dark:bg-slate-950/50">
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
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={cn(
                  "p-3 flex items-center gap-3 rounded-xl cursor-pointer transition-colors",
                  activeContact.id === contact.id ? "bg-primary/10" : "hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col h-full bg-background/50">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-white/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                {activeContact.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{activeContact.name}</h3>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full"><Phone className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full"><Video className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2",
                  msg.sender === "me" 
                    ? "bg-primary text-white rounded-tr-sm" 
                    : "bg-white dark:bg-slate-800 border border-border rounded-tl-sm shadow-sm"
                )}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={cn(
                    "text-[10px] mt-1 text-right",
                    msg.sender === "me" ? "text-white/70" : "text-muted-foreground"
                  )}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
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
                onKeyDown={(e) => { if(e.key === 'Enter') setMsgInput("") }}
              />
              <Button 
                className="h-[50px] w-[50px] rounded-xl shrink-0" 
                size="icon"
                onClick={() => setMsgInput("")}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

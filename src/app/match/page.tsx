"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

const mockMatches = [
  { id: 1, name: "Sakib Al Hasan", university: "NSU", teach: "Public Speaking", learn: "React.js", matchScore: 98 },
  { id: 2, name: "Jannatul Firdous", university: "Dhaka University", teach: "English", learn: "Next.js", matchScore: 95 },
  { id: 3, name: "Imran Mahmud", university: "BRAC", teach: "UI/UX Design", learn: "React", matchScore: 89 },
];

export default function MatchPage() {
  const [matches, setMatches] = useState(mockMatches);

  const handleAction = (id: number, action: "accept" | "reject") => {
    // In a real app, send API request here
    setMatches(matches.filter(m => m.id !== id));
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
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-3xl font-bold text-primary border-4 border-white dark:border-slate-800 absolute -bottom-12">
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
                      <p className="font-medium text-sm">{matches[0].teach}</p>
                    </div>
                    <div className="bg-accent/5 rounded-xl p-3 text-left">
                      <p className="text-[10px] font-bold text-accent-foreground uppercase mb-1">They Want</p>
                      <p className="font-medium text-sm">{matches[0].learn}</p>
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
                    onClick={() => handleAction(matches[0].id, "accept")}
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
              <p className="text-muted-foreground mb-6">Check back later for new match suggestions based on your skills.</p>
              <Button variant="outline">Update My Skills</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

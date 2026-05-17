"use client";

import { MapPin, Star, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary text-5xl font-bold border-4 border-white dark:border-slate-800 shadow-xl">
              T
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">Tanvir Hasan</h1>
                <p className="text-muted-foreground flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" /> BUET - Computer Science
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                  <Star className="w-5 h-5 fill-current" /> 4.9 <span className="text-sm font-normal text-muted-foreground">(24 reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-primary font-bold text-lg">
                  <BookOpen className="w-5 h-5" /> 12 <span className="text-sm font-normal text-muted-foreground">Exchanges</span>
                </div>
              </div>
              
              <p className="text-foreground max-w-2xl">
                Passionate about teaching programming to beginners. I love turning complex algorithms into simple concepts. Looking to improve my public speaking and presentation skills.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button size="lg" className="w-full gap-2">
                <MessageSquare className="w-5 h-5" /> Message
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                Request Exchange
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold mb-6 text-primary flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">🎓</span> I Can Teach
            </h3>
            <div className="space-y-4">
              {['Python', 'Machine Learning', 'Data Structures'].map((skill, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                  <span className="font-medium text-lg">{skill}</span>
                  <span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded">Advanced</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold mb-6 text-accent-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">🌱</span> I Want to Learn
            </h3>
            <div className="space-y-4">
              {['Public Speaking', 'UI/UX Design', 'English Communication'].map((skill, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                  <span className="font-medium text-lg">{skill}</span>
                  <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded">Beginner</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, BookOpen, Clock, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Farhan! Here's your skill exchange overview.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Active Exchanges" value="3" icon={Users} color="bg-primary/10 text-primary" />
        <SkillsCard title="My Teach Skills" count="4" icon={BookOpen} color="bg-accent/10 text-accent-foreground" />
        <StatCard title="Pending Requests" value="2" icon={Clock} color="bg-yellow-500/10 text-yellow-600" />
        <StatCard title="Unread Messages" value="5" icon={MessageSquare} color="bg-green-500/10 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Active Exchanges
            </h2>
            <div className="space-y-4">
              {[
                { name: "Rakib Ahmed", skill: "Next.js for Video Editing", date: "Started 2 days ago" },
                { name: "Ayesha Siddiqua", skill: "React for English", date: "Started 1 week ago" }
              ].map((exchange, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-foreground font-semibold">
                      {exchange.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{exchange.name}</h4>
                      <p className="text-xs text-muted-foreground">{exchange.skill}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">{exchange.date}</span>
                    <Button variant="outline" size="sm">Chat</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" /> Pending Requests
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-semibold">
                    T
                  </div>
                  <div>
                    <h4 className="font-semibold">Tanvir Hasan</h4>
                    <p className="text-xs text-muted-foreground">Wants to learn React from you.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">Accept</Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200">Decline</Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent-foreground" /> My Profile
            </h2>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold mb-3">
                F
              </div>
              <h3 className="font-bold text-lg">Farhan</h3>
              <p className="text-sm text-muted-foreground">Dhaka University</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Teaching</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">React</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">Next.js</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Learning</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded text-xs font-medium">English</span>
                  <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded text-xs font-medium">UI/UX</span>
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

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code, Languages, Music, Palette, PenTool, Sparkles, BookOpen, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const categories = [
  { name: "Programming", icon: Code, count: "120+ Students" },
  { name: "Languages", icon: Languages, count: "85+ Students" },
  { name: "Design", icon: Palette, count: "64+ Students" },
  { name: "Writing", icon: PenTool, count: "40+ Students" },
  { name: "Music", icon: Music, count: "20+ Students" },
  { name: "Academics", icon: BookOpen, count: "150+ Students" },
];

const howItWorks = [
  { step: "01", title: "Create Profile", description: "Sign up and list the skills you can teach and the ones you want to learn." },
  { step: "02", title: "Find a Match", description: "Our smart algorithm suggests students whose needs perfectly match yours." },
  { step: "03", title: "Connect & Learn", description: "Send a request, start chatting, and begin your mutual learning journey!" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 dark:opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> The #1 Skill Exchange for BD Students
            </span>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground leading-[1.1]">
              Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Together.</span>
              <br /> Grow <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Together.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              No money required. Exchange your skills with university students across Bangladesh. 
              <br className="hidden md:block" />
              <span className="italic">"I will teach React, you teach me English."</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto rounded-full gap-2">
                  Start Exchanging <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="glass" size="lg" className="w-full sm:w-auto rounded-full">
                  Explore Skills
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Top Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you want to learn from thousands of passionate students.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="glass-panel p-6 flex flex-col items-center text-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <category.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{category.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SkillSwap Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start your collaborative learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-primary/20 via-primary to-primary/20 -z-10" />

            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-24 h-24 rounded-full glass flex items-center justify-center text-2xl font-bold text-primary mb-6 bg-white dark:bg-slate-900 shadow-xl border-4 border-background z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials / Success Stories */}
      <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              See how students are helping each other achieve their goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="flex gap-1 text-yellow-400 mb-6">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-lg mb-6 line-clamp-4">
                  "I was struggling with Data Structures, and my partner wanted to learn UI/UX design. We matched here, and within a month, both of us leveled up massively. Best platform for BD students!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20" />
                  <div>
                    <h4 className="font-semibold">Rahim Uddin</h4>
                    <p className="text-sm text-primary-foreground/70">Dhaka University</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="glass-panel max-w-4xl mx-auto p-12 md:p-20 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to share your knowledge?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of students in the biggest skill exchange network in Bangladesh.
            </p>
            <Link href="/register">
              <Button size="lg" className="rounded-full h-14 px-10 text-lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

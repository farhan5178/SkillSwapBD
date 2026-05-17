"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-panel w-full max-w-xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create your Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join the biggest student skill exchange network in Bangladesh</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First Name</label>
              <input 
                type="text" 
                placeholder="Farhan" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <input 
                type="text" 
                placeholder="Ahmed" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">University</label>
            <select className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none">
              <option value="">Select your university</option>
              <option value="du">Dhaka University</option>
              <option value="buet">BUET</option>
              <option value="nsu">North South University</option>
              <option value="brac">BRAC University</option>
              <option value="iut">IUT</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email (University Email Preferred)</label>
            <input 
              type="email" 
              placeholder="you@university.edu.bd" 
              className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <Button type="button" className="w-full h-12 mt-4 text-lg">Create Account</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

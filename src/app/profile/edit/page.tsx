"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { X, Plus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [teachingSkillInput, setTeachingSkillInput] = useState("");
  const [learningSkillInput, setLearningSkillInput] = useState("");
  
  const [teachingSkills, setTeachingSkills] = useState<string[]>([]);
  const [learningSkills, setLearningSkills] = useState<string[]>([]);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    if (userProfile) {
      setBio(userProfile.bio || "");
      setTeachingSkills(userProfile.teachingSkills || []);
      setLearningSkills(userProfile.learningSkills || []);
    }
  }, [userProfile]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleAddTeachingSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (teachingSkillInput.trim() && !teachingSkills.includes(teachingSkillInput.trim())) {
      setTeachingSkills([...teachingSkills, teachingSkillInput.trim()]);
      setTeachingSkillInput("");
    }
  };

  const handleRemoveTeachingSkill = (skillToRemove: string) => {
    setTeachingSkills(teachingSkills.filter(skill => skill !== skillToRemove));
  };

  const handleAddLearningSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (learningSkillInput.trim() && !learningSkills.includes(learningSkillInput.trim())) {
      setLearningSkills([...learningSkills, learningSkillInput.trim()]);
      setLearningSkillInput("");
    }
  };

  const handleRemoveLearningSkill = (skillToRemove: string) => {
    setLearningSkills(learningSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        bio,
        teachingSkills,
        learningSkills
      });
      
      // Force reload to get updated context data
      window.location.href = "/profile";
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link href="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        
        <div className="glass-panel p-8 md:p-10">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground mb-8">Update your bio and skills to find better matches.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Bio Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground uppercase tracking-wider">About Me (Bio)</label>
              <textarea 
                placeholder="Tell others about yourself, your goals, and your teaching style..." 
                className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-y placeholder:text-muted-foreground/50"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Teaching Skills */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                🎓 What I Can Teach
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Next.js, Python, English" 
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                  value={teachingSkillInput}
                  onChange={(e) => setTeachingSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTeachingSkill(e);
                  }}
                />
                <Button onClick={handleAddTeachingSkill} variant="outline" className="px-4">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              
              {teachingSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  {teachingSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary font-medium rounded-lg text-sm">
                      {skill}
                      <button onClick={() => handleRemoveTeachingSkill(skill)} className="ml-1 hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Skills */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-accent-foreground uppercase tracking-wider flex items-center gap-2">
                🌱 What I Want To Learn
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. UI/UX Design, Public Speaking" 
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground/50"
                  value={learningSkillInput}
                  onChange={(e) => setLearningSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddLearningSkill(e);
                  }}
                />
                <Button onClick={handleAddLearningSkill} variant="outline" className="px-4 border-accent/20 hover:bg-accent/10 hover:text-accent-foreground text-accent-foreground">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              
              {learningSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-4 bg-accent/5 rounded-xl border border-accent/10">
                  {learningSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-accent/20 text-accent-foreground font-medium rounded-lg text-sm">
                      {skill}
                      <button onClick={() => handleRemoveLearningSkill(skill)} className="ml-1 hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-border">
              <Button onClick={handleSave} disabled={saving} size="lg" className="w-full gap-2 text-lg">
                <Save className="w-5 h-5" />
                {saving ? "Saving Changes..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

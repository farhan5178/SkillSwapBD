"use client";

import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface StudentCardProps {
  id: string;
  name: string;
  university: string;
  teachSkills: string[];
  learnSkills: string[];
  rating: number;
  onChat?: (id: string, name: string) => void;
  onProfile?: (id: string) => void;
}

export function StudentCard({ id, name, university, teachSkills, learnSkills, rating, onChat, onProfile }: StudentCardProps) {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleInteraction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!currentUser) {
      router.push("/login");
    } else {
      action();
    }
  };

  const handleCardClick = () => {
    if (!currentUser) {
      router.push("/login");
    }
  };

  return (
    <div 
      className="glass-panel p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight">{name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {university}
            </p>
          </div>
        </div>
        <div className="flex items-center text-yellow-500 text-sm font-medium">
          <Star className="w-4 h-4 fill-current mr-1" />
          {rating.toFixed(1)}
        </div>
      </div>
      
      <div className="flex-1 space-y-4 my-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Can Teach</p>
          <div className="flex flex-wrap gap-2">
            {teachSkills.map(skill => (
              <span key={skill} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Wants to Learn</p>
          <div className="flex flex-wrap gap-2">
            {learnSkills.map(skill => (
              <span key={skill} className="px-2.5 py-1 rounded-md bg-accent/10 text-accent-foreground text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-auto">
        <Button 
          className="flex-1" 
          variant="outline"
          onClick={(e) => handleInteraction(e, () => onProfile ? onProfile(id) : alert("Public profiles coming soon!"))}
        >
          Profile
        </Button>
        <Button 
          className="flex-1 bg-primary text-white" 
          onClick={(e) => handleInteraction(e, () => onChat && onChat(id, name))}
        >
          Chat
        </Button>
      </div>
    </div>
  );
}

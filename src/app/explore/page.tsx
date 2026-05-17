"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { StudentCard } from "@/components/StudentCard";
import { Button } from "@/components/ui/Button";

const mockStudents = [
  { name: "Ayesha Siddiqua", university: "Dhaka University", teachSkills: ["React", "JavaScript"], learnSkills: ["English", "UI Design"], rating: 4.8 },
  { name: "Tanvir Hasan", university: "BUET", teachSkills: ["Python", "Machine Learning"], learnSkills: ["Public Speaking"], rating: 4.9 },
  { name: "Nusrat Jahan", university: "BRAC University", teachSkills: ["Graphic Design", "Figma"], learnSkills: ["Next.js", "Tailwind CSS"], rating: 4.7 },
  { name: "Rakib Ahmed", university: "North South University", teachSkills: ["Digital Marketing"], learnSkills: ["Video Editing", "Photography"], rating: 4.5 },
  { name: "Mehzabin", university: "Jahangirnagar University", teachSkills: ["English", "IELTS Prep"], learnSkills: ["Python", "Data Science"], rating: 4.9 },
  { name: "Fahim Faysal", university: "IUT", teachSkills: ["C++", "Data Structures"], learnSkills: ["Arabic", "History"], rating: 4.6 },
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = mockStudents.filter(s => 
    s.teachSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    s.learnSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
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

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, idx) => (
            <StudentCard key={idx} {...student} />
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

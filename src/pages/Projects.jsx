
import { useState, useEffect } from "react";
import { Project } from "@/entities/Project";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search,
  FolderOpen,
  Code,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ProjectForm from "../components/projects/ProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import PermissionGuard from "../components/PermissionGuard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("הכל");
  const [difficultyFilter, setDifficultyFilter] = useState("הכל");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const fetchedProjects = await Project.list("-created_date");
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
    setIsLoading(false);
  };

  const handleProjectSubmit = async (projectData) => {
    try {
      await Project.create(projectData);
      setShowForm(false);
      loadProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "הכל" || project.status === statusFilter;
    const matchesDifficulty = difficultyFilter === "הכל" || project.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">פרויקטים פתוחים</h1>
            <p className="text-lg text-slate-600">גלה פרויקטים מעניינים ותרום לקהילה</p>
          </div>
          <PermissionGuard fallbackMessage="רק חברי קהילה מאושרים יכולים להעלות פרויקטים">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              הוסף פרויקט חדש
            </Button>
          </PermissionGuard>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">סה״כ פרויקטים</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <FolderOpen className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">פרויקטים פתוחים</p>
                  <p className="text-3xl font-bold">
                    {projects.filter(p => p.status === "פתוח").length}
                  </p>
                </div>
                <Code className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">תורמים פעילים</p>
                  <p className="text-3xl font-bold">
                    {new Set(projects.map(p => p.contact_person).filter(Boolean)).size}
                  </p>
                </div>
                <Users className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="חפש פרויקטים..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="הכל">כל הסטטוסים</SelectItem>
                  <SelectItem value="פתוח">פתוח</SelectItem>
                  <SelectItem value="בעבודה">בעבודה</SelectItem>
                  <SelectItem value="מושלם">מושלם</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="רמת קושי" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="הכל">כל הרמות</SelectItem>
                  <SelectItem value="מתחיל">מתחיל</SelectItem>
                  <SelectItem value="בינוני">בינוני</SelectItem>
                  <SelectItem value="מתקדם">מתקדם</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Project Form */}
        <AnimatePresence>
          {showForm && (
            <PermissionGuard fallbackMessage="רק חברי קהילה מאושרים יכולים להעלות פרויקטים">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <ProjectForm
                  onSubmit={handleProjectSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </motion.div>
            </PermissionGuard>
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-20 bg-slate-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="text-center py-12 bg-white/70 backdrop-blur-sm">
            <CardContent>
              <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                לא נמצאו פרויקטים
              </h3>
              <p className="text-slate-600">
                {searchTerm || statusFilter !== "הכל" || difficultyFilter !== "הכל" 
                  ? "נסה לשנות את הפילטרים או החיפוש"
                  : "עדיין אין פרויקטים. הוסף את הפרויקט הראשון!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, User, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  "פתוח": "bg-green-100 text-green-800 border-green-200",
  "בעבודה": "bg-blue-100 text-blue-800 border-blue-200",
  "מושלם": "bg-purple-100 text-purple-800 border-purple-200"
};

const difficultyColors = {
  "מתחיל": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "בינוני": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "מתקדם": "bg-red-100 text-red-800 border-red-200"
};

export default function ProjectCard({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-white/20 group">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-3">
            <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
              {project.name}
            </CardTitle>
            <Badge className={`${statusColors[project.status]} border font-medium`}>
              {project.status}
            </Badge>
          </div>
          {project.difficulty && (
            <Badge variant="outline" className={`${difficultyColors[project.difficulty]} border w-fit`}>
              {project.difficulty}
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="flex flex-col h-full">
          <p className="text-slate-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
            {project.description}
          </p>
          
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.slice(0, 3).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-slate-50">
                    {tech}
                  </Badge>
                ))}
                {project.tech_stack.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-slate-50">
                    +{project.tech_stack.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {project.contact_person && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span className="truncate">{project.contact_person}</span>
              </div>
            )}
            
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
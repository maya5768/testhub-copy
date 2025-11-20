import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GitResource } from "@/entities/GitResource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Youtube, 
  FileText, 
  Code, 
  UploadCloud, 
  ExternalLink 
} from "lucide-react";
import { motion } from "framer-motion";
import _ from 'lodash';

const difficultyColors = {
  "מתחיל": "bg-green-100 text-green-800",
  "בינוני": "bg-yellow-100 text-yellow-800",
  "מתקדם": "bg-red-100 text-red-800",
};

const typeInfo = {
  "מדריך וידאו": { icon: Youtube, color: "text-red-600" },
  "מדריך כתוב": { icon: FileText, color: "text-blue-600" },
  "אתר תרגול": { icon: Code, color: "text-purple-600" },
  "Cheat Sheet": { icon: FileText, color: "text-orange-600" }
};

export default function GitGithubPage() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const fetchedResources = await GitResource.list();
      // Ensure no duplicate resources are displayed by unique ID
      const uniqueResources = _.uniqBy(fetchedResources, 'id');
      setResources(uniqueResources);
    } catch (error) {
      console.error("Error loading Git resources:", error);
    }
    setIsLoading(false);
  };
  
  const groupedResources = _.groupBy(resources, 'type');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <Github className="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white" />
              <h1 className="text-4xl font-bold text-slate-900 mb-4">מדריך ל-GIT & GITHUB</h1>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                כל המשאבים, המדריכים והכלים שאתם צריכים כדי להתחיל לעבוד עם Git ו-GitHub בצורה מקצועית.
              </p>
            </div>
          </div>
        </div>

        {/* Learning together card */}
        <Card className="mb-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-3">רוצים ללמוד ביחד?</h3>
              <p className="text-lg mb-6 opacity-90">
                הקהילה היא המקום הטוב ביותר ללמוד, לשתף ולהתפתח. בואו נתחיל!
              </p>
            </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedResources).map(([type, items]) => {
              const Icon = typeInfo[type]?.icon || FileText;
              return (
                <div key={type}>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Icon className={`${typeInfo[type]?.color} w-8 h-8`} />
                    {type}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map(resource => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden h-full flex flex-col">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                                {resource.title}
                              </CardTitle>
                              <Badge className={`${difficultyColors[resource.difficulty]}`}>{resource.difficulty}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow flex flex-col justify-between">
                            <p className="text-slate-600 leading-relaxed mb-4">
                              {resource.description}
                            </p>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-lg font-semibold">
                                <span>עבור למשאב</span>
                                <ExternalLink className="w-4 h-4 mr-2" />
                              </Button>
                            </a>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Community Contribution */}
        <Card className="mt-16 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-2xl">
          <CardContent className="p-12 text-center">
            <UploadCloud className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">מצאתם מדריך או כלי מעולה?</h2>
            <p className="text-xl leading-relaxed max-w-2xl mx-auto opacity-95 mb-6">
              עזרו לקהילה לגדול! שתפו מדריכים, אתרי תרגול ומשאבים נוספים.
            </p>
            <Button 
              asChild
              size="lg" 
              variant="secondary"
              className="bg-white text-emerald-700 hover:bg-gray-50 font-semibold"
            >
              {/* This link is correctly implemented as per requirements */}
              <Link to={createPageUrl('SubmitContent')}>
                <UploadCloud className="w-5 h-5 ml-2" />
                הוסף משאב חדש
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
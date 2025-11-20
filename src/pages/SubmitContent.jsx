
import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { CommunityContent } from "@/entities/CommunityContent";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Video, 
  Clock,
  X,
  Plus,
  Paperclip,
  Loader2,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FileUploadInput = ({ label, onUpload, uploadedUrl, isUploading, fileType }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <label className="flex-1 cursor-pointer">
        <div className="flex items-center justify-center w-full px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
          <Paperclip className="w-4 h-4 ml-2" />
          {uploadedUrl ? "קובץ הועלה בהצלחה" : "בחר קובץ"}
        </div>
        <input 
          type="file" 
          className="hidden"
          onChange={(e) => onUpload(e.target.files[0], fileType)}
          disabled={isUploading}
        />
      </label>
      {isUploading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
      {uploadedUrl && !isUploading && <CheckCircle className="w-5 h-5 text-green-600" />}
    </div>
    {uploadedUrl && (
      <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
        צפה בקובץ שהועלה
      </a>
    )}
  </div>
);

export default function SubmitContentPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadState, setUploadState] = useState({
    exam: { uploading: false, url: "" },
    solution: { uploading: false, url: "" }
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content_type: "מבחן כניסה",
    category: "",
    content_body: "",
    exam_file_url: "",
    solution_file_url: "",
    solution_video_url: "",
    difficulty_level: "בינוני",
    tags: []
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    checkUserPermissions();
  }, []);

  const checkUserPermissions = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser.community_status !== "חבר מאושר" && currentUser.community_status !== "מנהל") {
        alert("רק חברי קהילה מאושרים יכולים להעלות תוכן. אנא הצטרף לקהילה תחילה.");
        window.location.href = "/Join";
        return;
      }
      setUser(currentUser);
    } catch (error) {
      alert("נדרשת התחברות כדי להעלות תוכן");
      window.location.href = "/Join";
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (file, fileType) => {
    if (!file) return;
    setUploadState(prev => ({ ...prev, [fileType]: { ...prev[fileType], uploading: true } }));
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, [`${fileType}_file_url`]: file_url }));
      setUploadState(prev => ({ ...prev, [fileType]: { uploading: false, url: file_url } }));
    } catch (error) {
      console.error(`Error uploading ${fileType} file:`, error);
      alert(`שגיאה בהעלאת קובץ ${fileType}. אנא נסה שוב.`);
      setUploadState(prev => ({ ...prev, [fileType]: { ...prev[fileType], uploading: false } }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ בדיקה מפורשת של שדות חובה
    if (!formData.title || !formData.title.trim()) {
      alert("אנא הזן כותרת לתוכן");
      return;
    }
    
    if (!formData.description || !formData.description.trim()) {
      alert("אנא הזן תיאור לתוכן");
      return;
    }
    
    if (!formData.category) {
      alert("אנא בחר קטגוריה");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await CommunityContent.create({
        ...formData,
        author_name: user.full_name,
        author_email: user.email,
        status: "ממתין לאישור"
      });
      
      alert("התוכן נשלח בהצלחה! הוא יעבור לבדיקת מנהל ויפורסם לאחר האישור.");
      
      // Reset form
      setFormData({
        title: "", description: "", content_type: "מבחן כניסה", category: "", content_body: "",
        exam_file_url: "", solution_file_url: "", solution_video_url: "",
        difficulty_level: "בינוני", tags: []
      });
      setUploadState({
        exam: { uploading: false, url: "" },
        solution: { uploading: false, url: "" }
      });
      setNewTag("");

    } catch (error) {
      console.error("Error submitting content:", error);
      alert("שגיאה בשליחת התוכן: " + (error.message || "אנא נסה שוב"));
    }
    
    setIsSubmitting(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <Upload className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white" />
              <h1 className="text-4xl font-bold text-slate-900 mb-4">העלאת תוכן קהילתי</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                שתף את הידע והניסיון שלך עם הקהילה. העלה מבחנים, פתרונות וסרטונים. התוכן יעבור לבדיקת מנהל לפני הפרסום.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">פרטי התוכן</CardTitle>
            <p className="text-sm text-slate-500">מלא את הפרטים והעלה קבצים או קישורים</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">כותרת התוכן *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="כותרת מעניינת ותמציתית"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">סוג התוכן *</label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="מבחן כניסה">מבחן כניסה לעבודה</SelectItem>
                      <SelectItem value="ביקורת כלי">ביקורת כלי בדיקה</SelectItem>
                      <SelectItem value="מאמר">מאמר</SelectItem>
                      <SelectItem value="סרטון">סרטון</SelectItem>
                      <SelectItem value="משאב">משאב/קישור</SelectItem>
                      <SelectItem value="אחר">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">קטגוריה *</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger><SelectValue placeholder="בחר קטגוריה" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="בדיקות ידניות">בדיקות ידניות</SelectItem>
                      <SelectItem value="אוטומציה">אוטומציה</SelectItem>
                      <SelectItem value="Git & Github">Git & Github</SelectItem>
                      <SelectItem value="כלי בדיקה">כלי בדיקה</SelectItem>
                      <SelectItem value="קריירה">קריירה</SelectItem>
                      <SelectItem value="טכנולוגיות">טכנולוגיות</SelectItem>
                      <SelectItem value="אחר">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">רמת קושי</label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="מתחיל">מתחיל</SelectItem>
                      <SelectItem value="בינוני">בינוני</SelectItem>
                      <SelectItem value="מתקדם">מתקדם</SelectItem>
                      <SelectItem value="מומחה">מומחה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">תיאור קצר *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="תיאור קצר של התוכן - מה הקוראים ילמדו או יקבלו"
                  required
                  className="h-24"
                />
              </div>

              {/* File Uploads & Links */}
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    קבצים וקישורים
                  </CardTitle>
                  <p className="text-sm text-slate-600">העלה מבחנים, פתרונות או הוסף קישורים לסרטונים</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUploadInput 
                      label="קובץ מבחן (PDF, DOCX, וכו')"
                      onUpload={handleFileUpload}
                      uploadedUrl={uploadState.exam.url}
                      isUploading={uploadState.exam.uploading}
                      fileType="exam"
                    />
                    <FileUploadInput 
                      label="קובץ פתרון (אופציונלי)"
                      onUpload={handleFileUpload}
                      uploadedUrl={uploadState.solution.url}
                      isUploading={uploadState.solution.uploading}
                      fileType="solution"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      קישור לסרטון פתרון (YouTube, Vimeo, וכו')
                    </label>
                    <Input
                      type="url"
                      value={formData.solution_video_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, solution_video_url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Optional Text Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  תוכן טקסטואלי נוסף (אופציונלי)
                </label>
                <Textarea
                  value={formData.content_body}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_body: e.target.value }))}
                  placeholder="הוסף הסברים נוספים, הערות או תוכן כתוב"
                  className="h-32"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">תגיות לחיפוש</label>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="הוסף תגית ולחץ Enter"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline"><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {formData.tags.map((tag) => (
                      <motion.div key={tag} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                        <Badge className="bg-green-100 text-green-800 px-3 py-1">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="mr-2 hover:text-red-600 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">תהליך האישור</h3>
                </div>
                <p className="text-green-800 text-sm mb-4">
                  לאחר שליחת התוכן, הוא יעבור לבדיקת מנהל הקהילה. תקבל עדכון כשהתוכן יאושר ויפורסם באתר.
                </p>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.title || !formData.description || !formData.category || (uploadState.exam.uploading || uploadState.solution.uploading)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg px-8 py-3"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Upload className="w-4 h-4 mr-2" />}
                    {isSubmitting ? "שולח..." : "שלח לאישור"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

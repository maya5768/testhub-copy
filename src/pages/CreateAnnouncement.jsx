import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Announcement } from "@/entities/Announcement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: "yellow"
  });

  useEffect(() => {
    checkUserPermissions();
  }, []);

  const checkUserPermissions = async () => {
    try {
      const currentUser = await User.me();
      if (
        currentUser.community_status !== "חבר מאושר" && 
        currentUser.community_status !== "מנהל"
      ) {
        alert("רק חברי קהילה מאושרים יכולים לפרסם מודעות");
        navigate(createPageUrl("NoticeBoard"));
        return;
      }
      setUser(currentUser);
    } catch (error) {
      alert("נדרשת התחברות כדי לפרסם מודעה");
      navigate(createPageUrl("Join"));
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("אנא הזן כותרת למודעה");
      return;
    }
    
    if (!formData.content.trim()) {
      alert("אנא הזן תוכן למודעה");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await Announcement.create({
        ...formData,
        author_name: user.full_name,
        author_email: user.email,
        is_pinned: false
      });
      
      alert("המודעה פורסמה בהצלחה!");
      navigate(createPageUrl("NoticeBoard"));
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("שגיאה בפרסום המודעה. אנא נסה שוב.");
    }
    
    setIsSubmitting(false);
  };

  const colorOptions = [
    { value: "yellow", label: "צהוב", class: "bg-yellow-200" },
    { value: "blue", label: "כחול", class: "bg-blue-200" },
    { value: "pink", label: "ורוד", class: "bg-pink-200" },
    { value: "green", label: "ירוק", class: "bg-green-200" },
    { value: "orange", label: "כתום", class: "bg-orange-200" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(createPageUrl("NoticeBoard"))}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">פרסום מודעה חדשה</h1>
            <p className="text-lg text-slate-600">שתף עדכונים וחדשות עם הקהילה</p>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Pin className="w-6 h-6 text-blue-600" />
                פרטי המודעה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    כותרת המודעה *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="לדוגמה: מפגש קהילתי הקרוב"
                    required
                    maxLength={100}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    תוכן המודעה *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="כתוב את תוכן המודעה כאן..."
                    required
                    className="h-40"
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.content.length}/500 תווים
                  </p>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    בחר צבע לפתק
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        className={`${color.class} h-16 rounded-lg border-2 ${
                          formData.color === color.value 
                            ? 'border-blue-600 ring-2 ring-blue-300' 
                            : 'border-slate-300'
                        } hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold text-slate-800`}
                      >
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    תצוגה מקדימה
                  </label>
                  <Card 
                    className={`${colorOptions.find(c => c.value === formData.color)?.class} border-2 shadow-lg relative`}
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-6 bg-slate-400 rounded-full shadow-md"></div>
                    </div>
                    <CardContent className="p-6 pt-8">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">
                        {formData.title || "כותרת המודעה"}
                      </h3>
                      <p className="text-slate-700 text-sm whitespace-pre-wrap">
                        {formData.content || "תוכן המודעה יופיע כאן..."}
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-300/50">
                        <p className="text-xs text-slate-600">
                          {user?.full_name || "שמך"} • היום
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(createPageUrl("NoticeBoard"))}
                  >
                    ביטול
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {isSubmitting ? "מפרסם..." : "פרסם מודעה"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips Card */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 טיפים לכתיבת מודעה טובה:</h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• כתוב כותרת ברורה ומושכת</li>
              <li>• השתמש בשפה פשוטה וקצרה</li>
              <li>• ציין פרטים חשובים כמו תאריך, שעה ומקום (אם רלוונטי)</li>
              <li>• בדוק איות ודקדוק לפני הפרסום</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
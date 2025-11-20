import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Award, X, Plus, Phone, User as UserIcon, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function JoinPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    linkedin_profile: "",
    phone_number: "",
    motivation: "",
    testing_tools: []
  });
  const [newTool, setNewTool] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const currentUser = await User.me();
      
      // אם למשתמש אין סטטוס קהילה, נגדיר אותו כ"לא חבר"
      if (!currentUser.community_status) {
        await User.updateMyUserData({ community_status: "לא חבר" });
        currentUser.community_status = "לא חבר";
      }
      
      setUser(currentUser);
      
      setFormData(prev => ({
          ...prev,
          full_name: currentUser.full_name || '',
          phone_number: currentUser.phone_number || '',
          linkedin_profile: currentUser.linkedin_profile || ''
      }));

    } catch (error) {
      // User not logged in - redirect to login
      await User.login();
    }
    setIsLoading(false);
  };

  const commonTools = [
    "Cypress", "Playwright", "Selenium", "Jest", "Postman", "Appium", 
    "Robot Framework", "TestRail", "JMeter", "WebDriver", "Cucumber"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await User.updateMyUserData({
        ...formData,
        community_status: "ממתין לאישור"
      });
      
      // Navigate directly to assessment
      navigate(createPageUrl("Assessment"));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
    
    setIsSubmitting(false);
  };

  const addTool = (tool) => {
    if (!formData.testing_tools.includes(tool)) {
      setFormData(prev => ({
        ...prev,
        testing_tools: [...prev.testing_tools, tool]
      }));
    }
  };

  const addCustomTool = () => {
    if (newTool.trim() && !formData.testing_tools.includes(newTool.trim())) {
      addTool(newTool.trim());
      setNewTool("");
    }
  };

  const removeTool = (toolToRemove) => {
    setFormData(prev => ({
      ...prev,
      testing_tools: prev.testing_tools.filter(tool => tool !== toolToRemove)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>טוען...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show status if user already applied or is approved
  if (user && user.community_status !== "לא חבר") {
    const statusConfig = {
      "ממתין לאישור": {
        title: "הבקשה שלך נשלחה!",
        description: "תודה על הבקשה להצטרפות. אנחנו נבדוק את הפרטים שלך ונחזור אליך בהקדם.",
        color: "from-yellow-500 to-orange-500",
        icon: "⏳"
      },
      "חבר מאושר": {
        title: "ברוך הבא לקהילה!",
        description: "אתה חבר מאושר בקהילה. כעת תוכל להעלות פרויקטים ולהשתתף פעילות בקהילה.",
        color: "from-green-500 to-emerald-500",
        icon: "✅"
      },
      "מנהל": {
        title: "ברוך הבא, מנהל הקהילה!",
        description: "אתה מנהל הקהילה ויש לך הרשאות מלאות לניהול התכנים והחברים.",
        color: "from-purple-500 to-blue-500",
        icon: "👑"
      }
    };

    const config = statusConfig[user.community_status];

    if (!config) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>מאמת סטטוס משתמש...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-6">{config.icon}</div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent mb-4`}>
                {config.title}
              </h1>
              <p className="text-lg text-slate-600 mb-8">{config.description}</p>
              
              {user.community_status === "חבר מאושר" || user.community_status === "מנהל" ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => navigate(createPageUrl("Projects"))}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    עבור לפרויקטים
                  </Button>
                  {user.community_status === "מנהל" && (
                    <Button 
                      onClick={() => navigate(createPageUrl("Admin"))}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      פאנל ניהול
                    </Button>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={() => navigate(createPageUrl("Home"))}
                  variant="outline"
                >
                  חזור לדף הבית
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <Users className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white" />
              <h1 className="text-4xl font-bold text-slate-900 mb-4">הצטרף לקהילת הבדיקות</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                חבר אלינו וקח חלק בקהילה המקצועית המובילה של בודקי תוכנה בישראל
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="font-bold text-lg mb-2">רשת מקצועית</h3>
              <p className="text-blue-100 text-sm">התחבר לבודקים מובילים ומנוסים מכל הארץ</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="font-bold text-lg mb-2">פיתוח מקצועי</h3>
              <p className="text-purple-100 text-sm">שתף ידע, למד טכנולוגיות חדשות והתפתח מקצועית</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="font-bold text-lg mb-2">פרויקטים מרתקים</h3>
              <p className="text-green-100 text-sm">השתתף בפרויקטי קוד פתוח ובני נסיון מעשי</p>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">בקשת הצטרפות לקהילה</CardTitle>
            <p className="text-sm text-slate-500">לאחר מילוי הטופס, תועבר לשאלון הערכת ידע קצר.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    שם מלא *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="שם פרטי ושם משפחה"
                      required
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    מספר טלפון (כדי להצטרף לקבוצת הWHATSAPP) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      value={formData.phone_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                      placeholder="050-1234567"
                      required
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    פרופיל לינקדאין
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      type="url"
                      value={formData.linkedin_profile}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin_profile: e.target.value }))}
                      placeholder="https://www.linkedin.com/in/your-profile"
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

              {/* Testing Tools */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  כלי בדיקה שאתה מכיר
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {commonTools.map((tool) => (
                    <Button
                      key={tool}
                      type="button"
                      variant={formData.testing_tools.includes(tool) ? "default" : "outline"}
                      size="sm"
                      onClick={() => addTool(tool)}
                      className={`justify-start ${
                        formData.testing_tools.includes(tool) 
                          ? "bg-purple-600 hover:bg-purple-700" 
                          : "hover:bg-purple-50"
                      }`}
                    >
                      {tool}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2 mb-4">
                  <Input
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder="כלי נוסף..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTool())}
                  />
                  <Button type="button" onClick={addCustomTool} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {formData.testing_tools.map((tool) => (
                      <motion.div
                        key={tool}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                          {tool}
                          <button
                            type="button"
                            onClick={() => removeTool(tool)}
                            className="mr-2 hover:text-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  למה אתה רוצה להצטרף לקהילה? *
                </label>
                <Textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                  placeholder="ספר לנו על המוטיבציה שלך, מה אתה מקווה לתרום ולקבל מהקהילה..."
                  required
                  className="h-32 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg px-8 py-3"
                >
                  {isSubmitting ? "שולח..." : "המשך לשאלון הערכה"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
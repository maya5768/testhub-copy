import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, CheckCircle } from "lucide-react";

export default function SetupPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      await User.login();
    }
    setIsLoading(false);
  };

  const makeUserAdmin = async () => {
    setIsUpdating(true);
    try {
      await User.updateMyUserData({
        community_status: "מנהל",
        assessment_completed: true,
        assessment_passed: true,
        assessment_score: 100
      });
      
      // Refresh user data
      const updatedUser = await User.me();
      setUser(updatedUser);
      
      alert("הפכת למנהלת הקהילה! כעת תוכלי לגשת לפאנל הניהול.");
    } catch (error) {
      console.error("Error making user admin:", error);
      alert("שגיאה בהגדרת מנהל");
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (user && user.community_status === "מנהל") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                את כבר מנהלת הקהילה! 👑
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                כעת תוכלי לגשת לפאנל הניהול ולנהל את הקהילה
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/Admin'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  עבור לפאנל ניהול
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  חזור לדף הבית
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-purple-600" />
              <CardTitle className="text-2xl font-bold text-slate-900">
                הגדרת מנהלת הקהילה
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-semibold text-purple-900 mb-2">שלום!</h3>
              <p className="text-purple-800 mb-4">
                כדי להפוך למנהלת הקהילה, לחצי על הכפתור למטה. 
                זה יעניק לך הרשאות מלאות לניהול הקהילה כולל:
              </p>
              <ul className="text-purple-800 space-y-1 text-sm">
                <li>• אישור וביטול חברות של משתמשים</li>
                <li>• גישה לפאנל ניהול מתקדם</li>
                <li>• הרשאות העלאת תכנים</li>
                <li>• ניהול הרשאות מנהלים נוספים</li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                onClick={makeUserAdmin}
                disabled={isUpdating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {isUpdating ? "מגדיר..." : "הפוך אותי למנהלת הקהילה"}
                <Crown className="w-4 h-4 mr-2" />
              </Button>
            </div>

            <div className="text-xs text-slate-500 text-center">
              <p>רק בעלת האתר צריכה להשתמש בדף זה</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
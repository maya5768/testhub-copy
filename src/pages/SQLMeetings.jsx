import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { SQLMeetingRegistration } from "@/entities/SQLMeetingRegistration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Users, 
  Calendar,
  CheckCircle,
  UserCheck,
  UserX,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function SQLMeetingsPage() {
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    loadRegistrations();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      checkIfUserRegistered(currentUser.email);
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const loadRegistrations = async () => {
    try {
      const allRegistrations = await SQLMeetingRegistration.list("-created_date", 100);
      setRegistrations(allRegistrations);
    } catch (error) {
      console.error("Error loading registrations:", error);
    }
  };

  const checkIfUserRegistered = async (email) => {
    try {
      const allRegistrations = await SQLMeetingRegistration.list("-created_date", 100);
      const userRegistration = allRegistrations.find(reg => reg.user_email === email);
      setIsRegistered(!!userRegistration);
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      alert("יש להתחבר כדי להירשם למפגשים");
      await User.login();
      return;
    }

    setIsSubmitting(true);
    try {
      await SQLMeetingRegistration.create({
        user_email: user.email,
        user_name: user.full_name || user.email,
        is_community_member: user.community_status === "חבר מאושר" || user.community_status === "מנהל",
        notes: notes
      });
      
      setIsRegistered(true);
      setNotes("");
      loadRegistrations();
      alert("נרשמת בהצלחה למפגשי SQL! נעדכן אותך בהמשך עם פרטים נוספים.");
    } catch (error) {
      console.error("Error registering:", error);
      alert("שגיאה ברישום. אנא נסה שוב.");
    }
    setIsSubmitting(false);
  };

  const communityMembers = registrations.filter(r => r.is_community_member);
  const nonMembers = registrations.filter(r => !r.is_community_member);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with "Coming Soon" Banner */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          
          {/* Coming Soon Banner */}
          <div className="absolute -top-4 -right-4 z-20">
            <div className="relative">
              <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-2 px-8 transform rotate-12 shadow-2xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-lg">בקרוב!</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
            <Database className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white p-3" />
            <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">
              סדרת מפגשים ללימוד SQL
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto text-center leading-relaxed">
              הקהילה מתכננת סדרת מפגשים ללימוד משותף של SQL ובדיקות מסדי נתונים.
              <br />
              <span className="font-semibold text-blue-600">רוצה להשתתף? הירשם עכשיו!</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{registrations.length}</div>
              <div className="text-blue-100 text-sm">נרשמים סה"כ</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">{communityMembers.length}</div>
              <div className="text-green-100 text-sm">חברי קהילה רשומים</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <div className="text-3xl font-bold">בקרוב</div>
              <div className="text-purple-100 text-sm">תאריך יפורסם</div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        {!isRegistered ? (
          <Card className="mb-12 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900">הרשמה למפגשים</CardTitle>
              <p className="text-slate-600">מלא את הפרטים כדי להירשם לסדרת המפגשים</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">מה נלמד?</h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>• יסודות SQL - שאילתות בסיסיות ומתקדמות</li>
                  <li>• בדיקות מסדי נתונים - איך לוודא שהנתונים תקינים</li>
                  <li>• כלי עבודה וטיפים מעשיים</li>
                  <li>• תרגול מעשי על מקרי בדיקה אמיתיים</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  הערות / שאלות נוספות (אופציונלי)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="יש לך שאלות? רוצה לשתף נושא ספציפי שמעניין אותך?"
                  className="h-24"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleRegister}
                  disabled={isSubmitting || !user}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-lg px-8 py-3"
                >
                  {isSubmitting ? "נרשם..." : "הירשם למפגשים"}
                  <CheckCircle className="w-5 h-5 mr-2" />
                </Button>
              </div>

              {!user && (
                <p className="text-sm text-amber-600 text-center">
                  יש להתחבר כדי להירשם למפגשים
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">נרשמת בהצלחה! 🎉</h3>
              <p className="text-lg opacity-90">
                נעדכן אותך בהמשך עם פרטים נוספים על המפגשים
              </p>
            </CardContent>
          </Card>
        )}

        {/* Registered Users List */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Community Members */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <UserCheck className="w-6 h-6" />
                חברי קהילה רשומים ({communityMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {communityMembers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">עדיין אין חברי קהילה רשומים</p>
                ) : (
                  communityMembers.map((registration) => (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {registration.user_name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{registration.user_name}</p>
                        <Badge className="bg-green-100 text-green-800 mt-1">חבר קהילה</Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Non-Members */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-700">
                <UserX className="w-6 h-6" />
                נרשמים נוספים ({nonMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {nonMembers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">עדיין אין נרשמים נוספים</p>
                ) : (
                  nonMembers.map((registration) => (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold">
                        {registration.user_name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{registration.user_name}</p>
                        <Badge variant="outline" className="mt-1">לא חבר קהילה</Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {!user?.community_status || (user.community_status !== "חבר מאושר" && user.community_status !== "מנהל") ? (
          <Card className="mt-12 bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-3">רוצה להיות חלק מהקהילה?</h3>
              <p className="text-lg mb-6 opacity-90">
                הצטרף לקהילת הבדיקות וקבל גישה מלאה לכל התכנים והמפגשים
              </p>
              <Button 
                onClick={() => window.location.href = "/Join"}
                variant="secondary" 
                className="bg-white text-purple-600 hover:bg-gray-50 font-semibold"
              >
                הצטרף עכשיו
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCheck, Code, UploadCloud } from "lucide-react";

export default function EntranceExamsPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch (e) {
                setUser(null);
            }
        };
        checkUserStatus();
    }, []);


  const examTypes = [
    {
      title: "מבחני כניסה לבודק ידני",
      description: "שאלות תאורטיות ומעשיות, מקרי מבחן, מתודולוגיות בדיקה ועוד.",
      icon: UserCheck,
      page: "ManualTesterExams",
      color: "from-blue-500 to-sky-600",
    },
    {
      title: "מבחני כניסה לבודק אוטומציה",
      description: "שפות תכנות (Python, Java), כלי אוטומציה (Selenium), בדיקות API ועוד.",
      icon: Code,
      page: "AutomationTesterExams",
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            מאגר מבחני כניסה לעבודה
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            התכוננו לראיון העבודה הבא שלכם עם מבחנים אמיתיים מחברות מובילות
            בתעשייה.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {examTypes.map((exam) => (
            <Link to={createPageUrl(exam.page)} key={exam.title}>
              <Card
                className={`bg-gradient-to-r ${exam.color} text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
              >
                <CardContent className="p-8">
                  <exam.icon className="w-12 h-12 mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">{exam.title}</h3>
                  <p className="opacity-90 mb-6">{exam.description}</p>
                  <div className="flex items-center font-semibold">
                    <span>צפה במבחנים</span>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(user?.community_status === "חבר מאושר" || user?.community_status === "מנהל") && (
          <Card className="mt-12 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">רוצים לתרום שאלונים?</h3>
              <p className="text-lg mb-6 opacity-90">
                עזרו לקהילה לגדול! שתפו מבחנים, שאלונים ומשאבים נוספים.
              </p>
              <Button asChild variant="secondary" className="bg-white text-emerald-700 hover:bg-gray-50 font-semibold">
                <Link to={createPageUrl('SubmitContent')}>
                  <UploadCloud className="w-4 h-4 ml-2" />
                  הוסף תוכן חדש
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
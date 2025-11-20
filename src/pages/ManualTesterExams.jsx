
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from "@/entities/User";
import { CommunityContent } from '@/entities/CommunityContent';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, ArrowRight, FilePenLine, CheckSquare, Lightbulb, UploadCloud, FileText, Download, Video, X } from 'lucide-react';

export default function ManualTesterExamsPage() {
  const [manualExams, setManualExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    loadManualExams();
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const loadManualExams = async () => {
    setIsLoading(true);
    try {
      const allContent = await CommunityContent.list("-created_date", 50);
      let manualContent = allContent.filter(content => 
        content.status === "מאושר" && 
        content.category === "בדיקות ידניות" &&
        content.content_type === "מבחן כניסה"
      );

      // Add a sample exam if none exist from the server
      if (manualContent.length === 0) {
        manualContent.push({
          id: "sample-manual-exam", // Added unique ID for sample
          // ✅ תיקון: שם המבחן עודכן להיות תקין וברור יותר
          title: "מבחן כניסה לבודק תוכנה ידני - מושגי יסוד",
          description: "מבחן לדוגמה הכולל שאלות תיאורטיות ומעשיות בבדיקות ידניות, כתיבת מקרי בדיקה וזיהוי באגים.",
          content_type: "מבחן כניסה",
          category: "בדיקות ידניות",
          difficulty_level: "בינוני",
          status: "מאושר",
          author_name: "צוות האתר",
          tags: ["בדיקות ידניות", "מקרי בדיקה", "באגים", "QA"],
          exam_file_url: "", // Removed broken link
          content_body: `מבחן כניסה לבודק תוכנה ידני

חלק א' - שאלות אמריקאיות (40 נקודות)

1. מהו Test Case?
א) כלי לניהול פרויקטים
ב) מסמך המגדיר איך לבדוק תכונה ספציפית  
ג) סוג של באג בתוכנה
ד) שיטה לכתיבת קוד

2. מה ההבדל בין Verification ל-Validation?
א) אין הבדל, זה אותו דבר
ב) Verification בודק 'האם בנינו נכון', Validation בודק 'האם בנינו את הנכון'
ג) Verification הוא בדיקות אוטומטיות, Validation הוא בדיקות ידניות
ד) Verification לפני השחרור, Validation אחרי השחרור

3. מהי מטרת בדיקות Smoke Testing?
א) בדיקת ביצועים תחת עומס
ב) בדיקה בסיסית שהמערכת עובדת ולא 'עולה בעשן'
ג) בדיקת אבטחה מתקדמת
ד) בדיקה שהמערכת עובדת בסביבות שונות

חלק ב' - שאלות פתוחות (35 נקודות)

4. תאר את התהליך של כתיבת Test Case טוב. מה חייב לכלול?

5. מהם הסוגים השונים של בדיקות שאתה מכיר? תן דוגמה לכל סוג.

6. איך תתמודד עם מצב שבו מצאת באג חמור יום לפני השחרור המתוכנן?

חלק ג' - מקרה מעשי (25 נקודות)

7. נתון אתר אי-קומרס פשוט עם העמודים הבאים:
- דף בית
- דף מוצר  
- עגלת קניות
- תשלום

כתוב 5 מקרי בדיקה חשובים לתכונת הוספת מוצר לעגלה.
עבור כל מקרה בדיקה כלול:
- תנאי התחלה
- צעדי הבדיקה
- תוצאה צפויה

זמן המבחן: 90 דקות
בהצלחה!`
        });
      }
      
      setManualExams(manualContent);
    } catch (error) {
      console.error("Error loading manual exams:", error);
    }
    setIsLoading(false);
  };
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "מתחיל": return "bg-green-100 text-green-800";
      case "בינוני": return "bg-yellow-100 text-yellow-800"; 
      case "מתקדם": return "bg-red-100 text-red-800";
      case "מומחה": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to={createPageUrl("EntranceExams")}>
            <Button variant="outline" size="icon" className="ml-4">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
             <UserCheck className="w-10 h-10 text-sky-600" />
            <h1 className="text-3xl font-bold text-slate-900">מבחנים לבודק ידני</h1>
          </div>
        </div>
        <p className="text-lg text-slate-600 mb-10">
          כאן תמצאו דוגמאות למבחנים ושאלונים שיעזרו לכם להתכונן לתפקידי בדיקות ידניות.
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Exams List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {manualExams.map((exam) => (
                <Card key={exam.id} className="bg-white/80 backdrop-blur-sm shadow-lg flex flex-col">
                  <CardHeader>
                    <Badge className={`${getDifficultyColor(exam.difficulty_level)} self-start mb-2`}>{exam.difficulty_level}</Badge>
                    <CardTitle className="text-xl font-bold text-slate-900">{exam.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-slate-600 text-sm mb-4">{exam.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {exam.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 p-4">
                    <div className="w-full space-y-2">
                      {/* כפתורי המבחן הראשיים */}
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedExam(exam)}
                          className="flex-1"
                        >
                          <FileText className="w-4 h-4 ml-2" />
                          צפיה במבחן
                        </Button>
                        {exam.exam_file_url && (
                          <Button asChild variant="outline" size="sm" className="flex-1">
                            <a href={exam.exam_file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 ml-2" />
                              הורדה
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      {/* כפתור העלאת פתרון */}
                      <div className="w-full">
                        <Button asChild variant="outline" size="sm" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                          <Link to={createPageUrl("SubmitContent")}>
                            <UploadCloud className="w-4 h-4 ml-2" />
                            העלה פתרון משלך
                          </Link>
                        </Button>
                      </div>
                      
                      {/* כפתורי פתרונות קיימים */}
                      {(exam.solution_file_url || exam.solution_video_url) && (
                        <div className="flex gap-2 w-full pt-2 border-t border-slate-200">
                          {exam.solution_file_url && (
                            <Button asChild variant="outline" size="sm" className="flex-1">
                              <a href={exam.solution_file_url} target="_blank" rel="noopener noreferrer">
                                <FileText className="w-4 h-4 ml-2" />
                                פתרון
                              </a>
                            </Button>
                          )}
                          {exam.solution_video_url && (
                            <Button asChild variant="outline" size="sm" className="flex-1">
                              <a href={exam.solution_video_url} target="_blank" rel="noopener noreferrer">
                                <Video className="w-4 h-4 ml-2" />
                                וידאו פתרון
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {manualExams.length === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    עדיין אין מבחנים בקטגוריה זו
                  </h3>
                  <p className="text-slate-600 mb-6">
                    היה הראשון לתרום תוכן לקהילה!
                  </p>
                  <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600">
                    <Link to={createPageUrl("SubmitContent")}>
                      <UploadCloud className="w-4 h-4 ml-2" />
                      העלה תוכן
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Community Contribution */}
            <Card className="mt-12 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">רוצים לתרום מבחנים?</h3>
                <p className="text-lg mb-6 opacity-90">
                  עזרו לקהילה לגדול! שתפו מבחנים, פתרונות ומשאבים נוספים.
                </p>
                <Button asChild variant="secondary" className="bg-white text-emerald-700 hover:bg-gray-50 font-semibold">
                  <Link to={createPageUrl('SubmitContent')}>
                    <UploadCloud className="w-4 h-4 ml-2" />
                    הוסף מבחן חדש
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Full Exam View Modal */}
        {selectedExam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <Card className="max-w-4xl max-h-[90vh] overflow-hidden bg-white">
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="2xl">{selectedExam.title}</CardTitle>
                    <p className="text-slate-600 mt-2">{selectedExam.description}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setSelectedExam(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-[calc(90vh-120px)]">
                {selectedExam.exam_file_url && selectedExam.exam_file_url.includes('google.com') ? (
                  <iframe 
                    src={selectedExam.exam_file_url.replace('/edit', '/preview')}
                    className="w-full h-[800px] border-0"
                    title={`מבחן: ${selectedExam.title}`}
                  />
                ) : selectedExam.exam_file_url ? (
                   <iframe 
                    src={selectedExam.exam_file_url}
                    className="w-full h-[800px] border-0"
                    title={`מבחן: ${selectedExam.title}`}
                  />
                ) : null}
                {selectedExam.content_body && (
                  <div className="p-6">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap">{selectedExam.content_body}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips section */}
        <Card className="mt-12 bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-200">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-sky-700">
                <Lightbulb className="w-6 h-6"/>
                טיפים להכנה
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
             <p className="flex items-start"><FilePenLine className="w-5 h-5 ml-2 mt-1 text-sky-600"/>תרגלו כתיבת מקרי בדיקה ברורים ומפורטים עבור תרחישים שונים.</p>
             <p className="flex items-start"><CheckSquare className="w-5 h-5 ml-2 mt-1 text-sky-600"/>הבינו את ההבדלים בין סוגי בדיקות שונים (פונקציונליות, שימושיות, ביצועים וכו').</p>
             <p className="flex items-start"><UserCheck className="w-5 h-5 ml-2 mt-1 text-sky-600"/>חשבו כמו משתמש קצה - מהן הדרכים בהן משתמש עלול "לשבור" את המערכת?</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

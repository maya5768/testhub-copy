
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from "@/entities/User";
import { CommunityContent } from '@/entities/CommunityContent';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, ArrowRight, Zap, Brain, UploadCloud, Lightbulb, FileText, Download, Video, X } from 'lucide-react';

export default function AutomationTesterExamsPage() {
  const [automationExams, setAutomationExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    loadAutomationExams();
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

  const loadAutomationExams = async () => {
    setIsLoading(true);
    try {
      const allContent = await CommunityContent.list("-created_date", 50);
      const automationContent = allContent.filter(content => 
        content.status === "מאושר" && 
        content.category === "אוטומציה" &&
        content.content_type === "מבחן כניסה"
      );
      setAutomationExams(automationContent);
    } catch (error) {
      console.error("Error loading automation exams:", error);
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
            <Code className="w-10 h-10 text-violet-600" />
            <h1 className="text-3xl font-bold text-slate-900">מבחני כניסה לבודק אוטומציה</h1>
          </div>
        </div>
        <p className="text-lg text-slate-600 mb-10">
          מבחנים אמיתיים מחברות הייטק לתפקידי אוטומציה - התכוננו לראיון העבודה הבא שלכם!
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <h3 className="font-bold text-lg mb-2">{automationExams.length} מבחנים</h3>
                  <p className="text-violet-100 text-sm">מחברות מובילות</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <h3 className="font-bold text-lg mb-2">מגוון טכנולוגיות</h3>
                  <p className="text-blue-100 text-sm">Python, Java, JavaScript</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <h3 className="font-bold text-lg mb-2">מעשיים ומעודכנים</h3>
                  <p className="text-green-100 text-sm">מבחנים אמיתיים מהתעשייה</p>
                </CardContent>
              </Card>
            </div>

            {/* Exams List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {automationExams.map((exam) => (
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

            {automationExams.length === 0 && (
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
                    <CardTitle className="text-2xl">{selectedExam.title}</CardTitle>
                    <p className="text-slate-600 mt-2">{selectedExam.description}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedExam(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-[calc(90vh-120px)]">
                {selectedExam.exam_file_url && (
                  <iframe 
                    src={selectedExam.exam_file_url}
                    className="w-full h-[800px] border-0"
                    title={`מבחן: ${selectedExam.title}`}
                  />
                )}
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
        <Card className="mt-12 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-violet-700">
                <Lightbulb className="w-6 h-6"/>
                טיפים להתכוננות
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
             <p className="flex items-start"><Zap className="w-5 h-5 ml-2 mt-1 text-violet-600"/>תרגלו כתיבת קוד נקי ויעיל בשפות הפופולריות (Python, Java, JavaScript).</p>
             <p className="flex items-start"><Code className="w-5 h-5 ml-2 mt-1 text-violet-600"/>הכירו לעמקים את הכלים הבסיסיים: Selenium, Playwright, REST API testing.</p>
             <p className="flex items-start"><Brain className="w-5 h-5 ml-2 mt-1 text-violet-600"/>חשבו על אסטרטגיות בדיקה, לא רק על הקוד - מתי להשתמש בכל כלי?</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

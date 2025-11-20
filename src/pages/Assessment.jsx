import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft, Award, XCircle, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.assessment_completed) {
        // User already completed assessment - show results
        setIsCompleted(true);
        setScore(currentUser.assessment_score || 0);
        setAssessmentResult(currentUser.assessment_passed ? 'approved' : 'rejected');
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate(createPageUrl("Join"));
    }
  };

  const questions = [
    {
      id: 1,
      question: "מה זה Test Case?",
      options: [
        "מסמך המגדיר איך לבדוק תכונה ספציפית",
        "כלי לניהול פרויקטים",
        "סוג של באג בתוכנה",
        "שיטה לכתיבת קוד"
      ],
      correct: 0,
      explanation: "Test Case הוא מסמך המפרט בדיוק איך לבדוק תכונה או פונקציונליות ספציפית, כולל הצעדים, הנתונים הנדרשים והתוצאה הצפויה."
    },
    {
      id: 2,
      question: "מה ההבדל בין Verification ל-Validation?",
      options: [
        "אין הבדל, זה אותו דבר",
        "Verification בודק 'האם בנינו את המוצר נכון', Validation בודק 'האם בנינו את המוצר הנכון'",
        "Verification הוא בדיקות אוטומטיות, Validation הוא בדיקות ידניות",
        "Verification לפני השחרור, Validation אחרי השחרור"
      ],
      correct: 1,
      explanation: "Verification בודק האם המוצר נבנה לפי הדרישות (בנינו נכון?), בעוד Validation בודק האם המוצר עונה על צרכי המשתמש (בנינו מה שהמשתמש רוצה?)."
    },
    {
      id: 3,
      question: "מתי כדאי להתחיל לכתוב בדיקות אוטומטיות?",
      options: [
        "רק אחרי שהמוצר מושלם",
        "במקביל לפיתוח או אפילו לפניו",
        "רק כשיש הרבה באגים",
        "רק בפרויקטים גדולים"
      ],
      correct: 1,
      explanation: "הגישה הטובה ביותר היא לכתוב בדיקות במקביל לפיתוח או אפילו לפניו (TDD). זה מבטיח כיסוי טוב יותר ומזהה בעיות מוקדם יותר."
    },
    {
      id: 4,
      question: "מה זה Regression Testing?",
      options: [
        "בדיקת ביצועים של המערכת",
        "בדיקה שפונקציונליות קיימת עדיין עובדת אחרי שינויים",
        "בדיקת אבטחה של המערכת",
        "בדיקה שהמערכת עובדת על דפדפנים שונים"
      ],
      correct: 1,
      explanation: "Regression Testing מוודא שפונקציונליות שכבר עבדה בעבר עדיין עובדת אחרי שינויים או הוספות חדשות למערכת."
    },
    {
      id: 5,
      question: "איזה מהכלים הבאים הוא הטוב ביותר לבדיקות API?",
      options: [
        "Selenium",
        "Postman",
        "JMeter",
        "Cypress"
      ],
      correct: 1,
      explanation: "Postman הוא הכלי המוביל לבדיקת APIs. הוא מאפשר יצירת בקשות HTTP, ארגון בדיקות בקולקציות, וביצוע בדיקות אוטומטיות."
    },
    {
      id: 6,
      question: "מה זה Smoke Testing?",
      options: [
        "בדיקת ביצועים תחת עומס",
        "בדיקה בסיסית שהמערכת עובדת ולא 'עולה בעשן'",
        "בדיקת אבטחה מתקדמת",
        "בדיקה שהמערכת עובדת בסביבות שונות"
      ],
      correct: 1,
      explanation: "Smoke Testing הוא בדיקה בסיסית וקצרה שמוודאת שהפונקציונליות הבסיסית של המערכת עובדת. השם מגיע מהביטוי 'אם עולה עשן, יש בעיה'."
    },
    {
      id: 7,
      question: "מה ההבדל בין Unit Testing ל-Integration Testing?",
      options: [
        "Unit Testing בודק רכיבים בודדים, Integration Testing בודק איך רכיבים עובדים יחד",
        "Unit Testing הוא ידני, Integration Testing הוא אוטומטי",
        "Unit Testing לפני הפיתוח, Integration Testing אחרי הפיתוח",
        "אין הבדל מהותי"
      ],
      correct: 0,
      explanation: "Unit Testing בודק רכיבי קוד בודדים במנותק, בעוד Integration Testing בודק איך מספר רכיבים עובדים יחד כמערכת."
    },
    {
      id: 8,
      question: "מתי משתמשים ב-Boundary Value Analysis?",
      options: [
        "כשרוצים לבדוק ביצועים",
        "כשרוצים לבדוק ערכי קצה של טווחי קלט",
        "כשרוצים לבדוק אבטחה",
        "כשרוצים לבדוק תאימות דפדפנים"
      ],
      correct: 1,
      explanation: "Boundary Value Analysis הוא טכניקת בדיקה שמתמקדת בבדיקת ערכי הקצה של טווחי קלט, כי שם נמצאים לרוב הבאגים."
    }
  ];

  const handleAnswer = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = async () => {
    setIsUpdating(true);
    const numCorrect = questions.filter((q, index) => 
      answers[index] === q.correct
    ).length;
    
    setCorrectAnswersCount(numCorrect);
    const finalScorePercentage = Math.round((numCorrect / questions.length) * 100);
    setScore(finalScorePercentage);

    const isApproved = numCorrect >= 3; // Pass with 3 or more correct answers
    setAssessmentResult(isApproved ? 'approved' : 'rejected');

    try {
      await User.updateMyUserData({ 
        assessment_completed: true,
        assessment_score: finalScorePercentage,
        assessment_passed: isApproved,
        community_status: isApproved ? "חבר מאושר" : "לא חבר"
      });
    } catch (error) {
      console.error("Error updating user assessment:", error);
    }
    
    setIsCompleted(true);
    setIsUpdating(false);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-white/20">
            <CardContent className="p-12 text-center">
              {assessmentResult === 'approved' ? (
                <>
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">כל הכבוד, התקבלת לקהילה!</h2>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">שאלון הערכה הושלם</h2>
                </>
              )}
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {score}%
                </div>
                <p className="text-lg text-slate-600">
                  ענית נכון על {correctAnswersCount} מתוך {questions.length} שאלות
                </p>
              </div>

              {assessmentResult === 'approved' ? (
                <div>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    הידע שלך מרשים ואנחנו שמחים לצרף אותך לקהילת הבדיקות שלנו. 
                    עכשיו תוכל להעלות פרויקטים ולהתחיל לתרום לקהילה!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to={createPageUrl("Projects")}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all duration-300 shadow-lg">
                        צפה בפרויקטים
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Button>
                    </Link>
                    <Link to={createPageUrl("Home")}>
                      <Button variant="outline">
                        חזור לדף הבית
                        <Home className="w-4 h-4 mr-2"/>
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    לצערנו, בשלב זה נראה שרמת הידע שלך אינה מספיקה לקריטריונים של הקהילה. 
                    אנו ממליצים לך להמשיך ללמוד ולהתפתח בתחום ולנסות שוב בעתיד.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to={createPageUrl("Tools")}>
                      <Button variant="outline">
                        למד עוד על כלי בדיקה
                      </Button>
                    </Link>
                     <Link to={createPageUrl("Home")}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                        חזור לדף הבית
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!user || user.assessment_completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">שאלון הערכת ידע</h1>
          <p className="text-lg text-slate-600">
            עני על השאלון כדי להשלים את תהליך ההצטרפות לקהילה. בהצלחה!
          </p>
          <p className="text-sm text-slate-500 mt-2">
            נדרשות לפחות 3 תשובות נכונות מתוך 8 כדי לעבור
          </p>
        </div>

        {/* Progress */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-600">
                שאלה {currentQuestion + 1} מתוך {questions.length}
              </span>
              <span className="text-sm font-medium text-slate-600">
                {Math.round(progress)}% הושלם
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {currentQ.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-300 ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {answers[currentQuestion] === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}

                {/* Show explanation if answered */}
                {answers[currentQuestion] !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <h4 className="font-semibold text-blue-900 mb-2">הסבר:</h4>
                    <p className="text-blue-800">{currentQ.explanation}</p>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                    שאלה קודמת
                  </Button>
                  
                  <Button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion] === undefined || isUpdating}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    {isUpdating ? "מעדכן..." : (currentQuestion === questions.length - 1 ? 'סיים והגש' : 'שאלה הבאה')}
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
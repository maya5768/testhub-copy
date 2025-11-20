import { useState } from "react";
import { GitResource } from "@/entities/GitResource";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Upload } from "lucide-react";
import PDFUploader from "../components/PDFUploader";

export default function GitGithubSetupPage() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handlePDFUpload = (url) => {
    setPdfUrl(url);
  };

  const completeSetup = async () => {
    if (!pdfUrl) {
      alert("אנא העלה את קובץ ה-PDF קודם");
      return;
    }

    try {
      // Update the Git Resource with the correct PDF URL
      await GitResource.create({
        title: "Git Cheat Sheet (PDF)",
        description: "מסמך PDF שימושי עם כל הפקודות החשובות של Git במקום אחד, מושלם לשמירה על שולחן העבודה.",
        url: pdfUrl,
        type: "Cheat Sheet",
        difficulty: "מתחיל"
      });
      
      setIsSetupComplete(true);
    } catch (error) {
      console.error("Error creating Git resource:", error);
      alert("שגיאה ביצירת המשאב");
    }
  };

  if (isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                הגדרה הושלמה בהצלחה!
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                דף Git & GitHub מוכן לשימוש עם כל המשאבים
              </p>
              <Button 
                onClick={() => window.location.href = '/GitGithub'}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                עבור לדף Git & GitHub
              </Button>
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
            <CardTitle className="text-2xl font-bold text-slate-900">
              הגדרת דף Git & GitHub
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-600">
              כדי להשלים את הגדרת דף Git & GitHub, אנא העלה את קובץ ה-PDF של Git Cheat Sheet:
            </p>
            
            <PDFUploader onUploadComplete={handlePDFUpload} />
            
            <div className="text-center">
              <Button 
                onClick={completeSetup}
                disabled={!pdfUrl}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                השלם הגדרה
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from "react";
import { UploadFile } from "@/integrations/Core";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";

export default function PDFUploader({ onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setUploadedUrl(file_url);
      onUploadComplete(file_url);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("שגיאה בהעלאת הקובץ");
    }
    setIsUploading(false);
  };

  return (
    <Card className="bg-orange-50 border-orange-200">
      <CardContent className="p-6 text-center">
        <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
        <h3 className="font-bold text-orange-900 mb-2">העלאת Git Cheat Sheet</h3>
        <p className="text-orange-800 mb-4 text-sm">
          אנא העלה את קובץ ה-PDF של Git Cheat Sheet
        </p>
        
        <div className="flex items-center justify-center">
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : uploadedUrl ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>
                {isUploading ? "מעלה..." : uploadedUrl ? "הועלה בהצלחה!" : "בחר קובץ PDF"}
              </span>
            </div>
            <input 
              type="file" 
              className="hidden"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              disabled={isUploading}
            />
          </label>
        </div>
        
        {uploadedUrl && (
          <div className="mt-4">
            <a 
              href={uploadedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline text-sm"
            >
              צפה בקובץ שהועלה
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { CommunityContent } from "@/entities/CommunityContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Eye,
  Edit,
  Trash2,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

export default function ManageContentPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("כל הסטטוסים");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await User.me();
      if (user.community_status !== "מנהל") {
        window.location.href = "/";
        return;
      }
      setCurrentUser(user);
      loadContent();
    } catch (error) {
      window.location.href = "/";
    }
  };

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const content = await CommunityContent.list("-created_date", 100);
      setAllContent(content);
    } catch (error) {
      console.error("Error loading content:", error);
    }
    setIsLoading(false);
  };

  const updateContentStatus = async (contentId, newStatus, notes = "") => {
    try {
      const updateData = { 
        status: newStatus,
        admin_notes: notes
      };
      
      if (newStatus === "מאושר") {
        updateData.approved_date = new Date().toISOString();
      }
      
      await CommunityContent.update(contentId, updateData);
      loadContent();
      setSelectedContent(null);
      setAdminNotes("");
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const deleteContent = async (contentId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את התוכן הזה?")) {
      try {
        await CommunityContent.delete(contentId);
        loadContent();
      } catch (error) {
        console.error("Error deleting content:", error);
      }
    }
  };

  const filteredContent = allContent.filter(content => {
    const matchesSearch = content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.author_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "כל הסטטוסים" || content.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: allContent.length,
    pending: allContent.filter(c => c.status === "ממתין לאישור").length,
    approved: allContent.filter(c => c.status === "מאושר").length,
    rejected: allContent.filter(c => c.status === "נדחה").length
  };

  const statusColors = {
    "ממתין לאישור": "bg-yellow-100 text-yellow-800",
    "מאושר": "bg-green-100 text-green-800",
    "נדחה": "bg-red-100 text-red-800",
    "טיוטה": "bg-gray-100 text-gray-800"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Edit className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold text-slate-900">ניהול תוכן קהילתי</h1>
            <p className="text-lg text-slate-600">אישור ועריכת תוכן שהועלה על ידי חברי הקהילה</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Edit className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-blue-100 text-sm">סה״כ תכנים</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-yellow-100 text-sm">ממתינים לאישור</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-2xl font-bold">{stats.approved}</div>
              <div className="text-green-100 text-sm">מאושרים</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
            <CardContent className="p-6 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <div className="text-red-100 text-sm">נדחו</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="חפש תכנים..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="כל הסטטוסים">כל הסטטוסים</option>
                <option value="ממתין לאישור">ממתין לאישור</option>
                <option value="מאושר">מאושר</option>
                <option value="נדחה">נדחה</option>
                <option value="טיוטה">טיוטה</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Content List */}
        <div className="space-y-6">
          {filteredContent.map((content) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{content.title}</h3>
                        <Badge className={statusColors[content.status]}>
                          {content.status}
                        </Badge>
                        <Badge variant="outline">{content.content_type}</Badge>
                      </div>
                      
                      <p className="text-slate-600 mb-3">{content.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>מחבר: {content.author_name}</span>
                        <span>קטגוריה: {content.category}</span>
                        <span>רמה: {content.difficulty_level}</span>
                        {content.created_date && (
                          <span>נוצר: {new Date(content.created_date).toLocaleDateString('he-IL')}</span>
                        )}
                      </div>
                      
                      {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {content.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedContent(content)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {content.status === "ממתין לאישור" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateContentStatus(content.id, "מאושר")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedContent(content);
                              setAdminNotes("");
                            }}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteContent(content.id)}
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {content.admin_notes && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">הערות מנהל:</span>
                      </div>
                      <p className="text-blue-800 text-sm">{content.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Preview Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <Card className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedContent.title}</CardTitle>
                    <p className="text-slate-600 mt-2">{selectedContent.description}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedContent(null)}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{selectedContent.content_body}</div>
                </div>
                
                {selectedContent.external_url && (
                  <div>
                    <h4 className="font-semibold mb-2">קישור חיצוני:</h4>
                    <a 
                      href={selectedContent.external_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedContent.external_url}
                    </a>
                  </div>
                )}
                
                {selectedContent.status === "ממתין לאישור" && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">פעולות מנהל:</h4>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="הערות למחבר (אופציונלי)"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="h-24"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={() => updateContentStatus(selectedContent.id, "מאושר", adminNotes)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          אשר ופרסם
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => updateContentStatus(selectedContent.id, "נדחה", adminNotes)}
                          className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          דחה
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
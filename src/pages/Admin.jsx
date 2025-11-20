
import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Crown, 
  Search,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  Download // Added Download icon
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = await User.me();
        if (user.community_status !== "מנהל") {
          window.location.href = "/"; // Redirect non-admins to home
          return;
        }
        setCurrentUser(user);
        loadData();
      } catch (error) {
        window.location.href = "/"; // Redirect logged-out users
      }
    };

    checkAdminAccess();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch up to 200 users to ensure all are loaded
      const users = await User.list("-created_date", 200);
      setAllUsers(users);
    } catch (error) {
      console.error("Error loading users:", error);
    }
    setIsLoading(false);
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await User.update(userId, { community_status: newStatus });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const removeUser = async (userId) => {
    if (window.confirm("האם אתה בטוח שברצונך להסיר את המשתמש הזה?")) {
      try {
        await User.update(userId, { 
          community_status: "לא חבר",
          assessment_passed: false 
        });
        loadData();
      } catch (error) {
        console.error("Error removing user:", error);
      }
    }
  };

  const filteredUsers = allUsers.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: allUsers.length,
    approvedMembers: allUsers.filter(u => u.community_status === "חבר מאושר").length,
    pendingApproval: allUsers.filter(u => u.community_status === "ממתין לאישור").length,
    admins: allUsers.filter(u => u.community_status === "מנהל").length
  };

  const statusColors = {
    "לא חבר": "bg-gray-100 text-gray-800",
    "ממתין לאישור": "bg-yellow-100 text-yellow-800",
    "חבר מאושר": "bg-green-100 text-green-800",
    "מנהל": "bg-purple-100 text-purple-800"
  };

  const exportToCSV = () => {
    // Create CSV headers
    const headers = [
      "שם מלא",
      "אימייל", 
      "סטטוס קהילה",
      "מספר טלפון",
      "LinkedIn",
      "השלים הערכה",
      "עבר הערכה", 
      "ציון הערכה (%)",
      "כלי בדיקה מוכרים",
      "מוטיבציה",
      "תאריך הצטרפות"
    ];

    // Convert users data to CSV format
    const csvData = allUsers.map(user => [
      user.full_name || "",
      user.email || "",
      user.community_status || "לא חבר",
      user.phone_number || "",
      user.linkedin_profile || "",
      user.assessment_completed ? "כן" : "לא",
      user.assessment_passed ? "כן" : "לא",
      user.assessment_score || "0",
      (user.testing_tools || []).join("; "),
      user.motivation || "",
      user.created_date ? new Date(user.created_date).toLocaleDateString('he-IL') : ""
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")) // Escape double quotes and ensure string conversion
      .join("\n");

    // Add BOM for proper Hebrew display in Excel
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvContent;

    // Create and download file
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `רשימת_חברי_קהילה_${new Date().toLocaleDateString('he-IL').replace(/\//g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Crown className="w-10 h-10 text-purple-600" />
            <div>
              <h1 className="text-4xl font-bold text-slate-900">פאנל ניהול הקהילה</h1>
              <p className="text-lg text-slate-600">ניהול חברים והרשאות</p>
            </div>
          </div>
          
          <Button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            ייצא לאקסל
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-blue-100 text-sm">סה״כ משתמשים</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-2xl font-bold">{stats.approvedMembers}</div>
              <div className="text-green-100 text-sm">חברים מאושרים</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6 text-center">
              <UserX className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-2xl font-bold">{stats.pendingApproval}</div>
              <div className="text-yellow-100 text-sm">ממתינים לאישור</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-2xl font-bold">{stats.admins}</div>
              <div className="text-purple-100 text-sm">מנהלים</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="חפש משתמשים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle>רשימת משתמשים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{user.full_name || "ללא שם"}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.phone_number && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4" />
                            {user.phone_number}
                          </div>
                        )}
                        {user.assessment_completed && (
                          <div className="flex items-center gap-2 text-sm">
                            {user.assessment_passed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span>ציון: {user.assessment_score || 0}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[user.community_status] || statusColors["לא חבר"]}>
                        {user.community_status || "לא חבר"}
                      </Badge>
                      
                      {currentUser && user.id !== currentUser.id && user.community_status !== "מנהל" && (
                        <div className="flex gap-2">
                          {user.community_status !== "חבר מאושר" && (
                            <Button
                              size="sm"
                              onClick={() => updateUserStatus(user.id, "חבר מאושר")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              אשר
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, "מנהל")}
                            className="border-purple-500 text-purple-600 hover:bg-purple-50"
                          >
                            הפוך למנהל
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeUser(user.id)}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

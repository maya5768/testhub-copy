
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  FolderOpen,
  Wrench,
  Users,
  TestTube2,
  Menu,
  X,
  BookOpen,
  Database,
  FileText,
  Github,
  Crown,
  UserCheck,
  Edit, // Added Edit icon for content management
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";

const entranceExamSubPages = [
  createPageUrl("ManualTesterExams"),
  createPageUrl("AutomationTesterExams"),
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
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

  const baseNavigation = [
    {
      title: "הצטרפות לקהילה",
      url: createPageUrl("Join"),
      icon: Users,
      isExternal: false,
    },
    {
      title: "דף הבית",
      url: createPageUrl("Home"),
      icon: Home,
      isExternal: false,
    },
    {
      title: "פרויקטים פתוחים",
      url: createPageUrl("Projects"),
      icon: FolderOpen,
      isExternal: false,
    },
    {
      title: "לוח מודעות",
      url: createPageUrl("NoticeBoard"),
      icon: FileText,
      isExternal: false,
    },
    {
      title: "כלי בדיקה",
      url: createPageUrl("Tools"),
      icon: Wrench,
      isExternal: false,
    },
    {
      title: "בדיקות ידניות (ITCB)",
      url: "https://www.itcb.org.il/",
      icon: BookOpen,
      isExternal: true,
    },
    {
      title: "SQL ובדיקות מסדי נתונים",
      url: createPageUrl("SQLMeetings"),
      icon: Database,
      isExternal: false,
    },
    {
      title: "מבחני כניסה לעבודה",
      url: createPageUrl("EntranceExams"),
      icon: FileText,
      isExternal: false,
    },
    {
      title: "מדריך לGIT & GITHUB",
      url: createPageUrl("GitGithub"),
      icon: Github,
      isExternal: false,
    },
  ];

  // Dynamically create navigation
  let finalNavigation = [...baseNavigation];
  if (user && user.community_status === "מנהל") {
    // Admin user: add Admin Panel and Content Management links
    finalNavigation.splice(2, 0,
      {
        title: "פאנל ניהול",
        url: createPageUrl("Admin"),
        icon: Crown,
        isExternal: false,
      },
      {
        title: "ניהול תוכן",
        url: createPageUrl("ManageContent"),
        icon: Edit,
        isExternal: false,
      },
       {
        title: "העלאת תוכן",
        url: createPageUrl("SubmitContent"),
        icon: UserCheck,
        isExternal: false,
      }
    );
  } else if (user && user.community_status === "חבר מאושר") {
    // Approved member: add content submission link
    finalNavigation.splice(2, 0, {
      title: "העלאת תוכן",
      url: createPageUrl("SubmitContent"),
      icon: UserCheck,
      isExternal: false,
    });
  } else {
    // Non-admin or logged-out user: add Setup link
    finalNavigation.splice(1, 0, {
      title: "הגדרת מנהלת",
      url: createPageUrl("Setup"),
      icon: Crown,
      isExternal: false,
    });
  }

  const isEntranceExamRelatedPage = location.pathname === createPageUrl("EntranceExams") || entranceExamSubPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white rounded-full shadow-md p-2"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 z-40 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } md:translate-x-0 md:w-72`}>
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <TestTube2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">קהילת הבדיקות</h2>
              <p className="text-xs text-slate-500">מרכז הידע והפרויקטים</p>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-2">
              ניווט ראשי
            </h3>
            <nav className="space-y-1">
              {finalNavigation.map((item) => {
                const isActive = item.title === "מבחני כניסה לעבודה" ? isEntranceExamRelatedPage : location.pathname === item.url;
                return item.isExternal ? (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group text-slate-600 hover:bg-blue-50 hover:text-blue-700`}
                  >
                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">{item.title}</span>
                  </a>
                ) : (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* User Status */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-2">
              סטטוס משתמש
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl shadow-inner">
              {user ? (
                <div>
                  <p className="font-semibold text-slate-800">{user.email}</p>
                  <p className="text-sm text-slate-600">סטטוס: {user.community_status}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-600">לא מחובר</p>
              )}
            </div>
          </div>
          {/* Quick Stats */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-2">
              סטטיסטיקות מהירות
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg shadow-sm text-blue-700">
                <p className="font-bold text-lg">15+</p>
                <p className="text-xs">פרויקטים פעילים</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-lg shadow-sm text-emerald-700">
                <p className="font-bold text-lg">200+</p>
                <p className="text-xs">חברים רשומים</p>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-200 bg-white">
          <p className="text-xs text-slate-400 text-center">
            &copy; {new Date().getFullYear()} קהילת הבדיקות. כל הזכויות שמורות.
          </p>
        </div>
      </div>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div className="md:mr-72">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FolderOpen, 
  Wrench, 
  Users, 
  ArrowLeft,
  TestTube2,
  Code,
  GitBranch,
  Award
} from "lucide-react";

export default function HomePage() {
  const quickActions = [
    {
      title: "פרויקטים פתוחים",
      description: "גלה פרויקטים חדשים ותרום לקהילה",
      icon: FolderOpen,
      url: createPageUrl("Projects"),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "כלי בדיקה",
      description: "גישה מהירה לכלים החשובים ביותר",
      icon: Wrench,
      url: createPageUrl("Tools"),
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "הצטרפות לקהילה",
      description: "הגש מועמדות להיות שותף פעיל  בקהילה",
      icon: Users,
      url: createPageUrl("Join"),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  const stats = [
    { label: "פרויקטים פעילים", value: "12+", icon: GitBranch },
    { label: "חברי קהילה", value: "150+", icon: Users },
    { label: "כלי בדיקה", value: "8", icon: Code },
    { label: "הישגים", value: "25+", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <TestTube2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ברוכים הבאים לקהילת הבדיקות
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              מרכז הידע והפרויקטים לקהילת הבדיקות הישראלית. כאן תמצאו פרויקטים פתוחים מעניינים, 
              כלי בדיקה חשובים, ותוכלו להצטרף לקהילה המקצועית שלנו.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {quickActions.map((action, index) => (
            <Card key={index} className="group bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 ${action.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`w-8 h-8 ${action.textColor}`} />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {action.description}
                </p>
                <Link to={action.url}>
                  <Button className={`w-full bg-gradient-to-r ${action.color} hover:scale-105 transition-all duration-300 shadow-lg font-semibold`}>
                    <span>התחל עכשיו</span>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">המשימה שלנו</h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-95">
              לקדם את תחום הבדיקות בישראל, לחבר בין אנשי מקצוע, ולספק פלטפורמה לשיתוף ידע ופרויקטים. 
              אנחנו מאמינים בכוח הקהילה ובחשיבות הבדיקות איכותיות בפיתוח תוכנה מודרני.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
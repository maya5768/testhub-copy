import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Code, Globe, Download } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    {
      name: "Cypress",
      description: "פלטפורמת בדיקות E2E מתקדמת עם ממשק משתמש נוח וכלי דיבאג מצוינים",
      url: "https://www.cypress.io/",
      category: "E2E Testing",
      logo: "🌿",
      features: ["Time-travel debugging", "Real-time reloads", "Automatic waiting"],
      pricing: "Free + Paid plans",
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "Playwright", 
      description: "כלי בדיקות חדשני של Microsoft לבדיקות דפדפנים מרובים",
      url: "https://playwright.dev/",
      category: "E2E Testing",
      logo: "🎭",
      features: ["Multi-browser support", "Mobile testing", "Network mocking"],
      pricing: "Free & Open Source",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Selenium",
      description: "הסטנדרט הזהב לאוטומציה של דפדפנים ובדיקות אינטגרציה",
      url: "https://www.selenium.dev/",
      category: "Browser Automation",
      logo: "🔧",
      features: ["Multi-language support", "Grid testing", "Mature ecosystem"],
      pricing: "Free & Open Source",
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Jest",
      description: "פריימוורק בדיקות יחידה מהיר ואמין עם מערכת mocking מובנית",
      url: "https://jestjs.io/",
      category: "Unit Testing",
      logo: "🃏",
      features: ["Zero config", "Snapshot testing", "Built-in mocking"],
      pricing: "Free & Open Source", 
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Appium",
      description: "פלטפורמה לבדיקות אוטומטיות של אפליקציות מובייל חוצות פלטפורמות",
      url: "http://appium.io/",
      category: "Mobile Testing",
      logo: "📱",
      features: ["Cross-platform", "Native & Hybrid apps", "WebDriver protocol"],
      pricing: "Free & Open Source",
      color: "from-indigo-500 to-purple-600"
    },
    {
      name: "Postman",
      description: "הכלי המוביל לבדיקת API ופיתוח אינטגרציות",
      url: "https://www.postman.com/",
      category: "API Testing",
      logo: "📮",
      features: ["Collection runner", "Mock servers", "Environment variables"],
      pricing: "Free + Paid plans",
      color: "from-pink-500 to-rose-600"
    },
    {
      name: "Robot Framework",
      description: "פריימוורק אוטומציה גנרי עם syntax קריא לבדיקות קבלה",
      url: "https://robotframework.org/",
      category: "Acceptance Testing",
      logo: "🤖",
      features: ["Keyword-driven", "Rich ecosystem", "Reporting"],
      pricing: "Free & Open Source",
      color: "from-teal-500 to-cyan-600"
    },
    {
      name: "TestRail",
      description: "פלטפורמת ניהול בדיקות מקצועית לארגונים גדולים",
      url: "https://www.testrail.com/",
      category: "Test Management",
      logo: "🚂",
      features: ["Test case management", "Reporting", "Integrations"],
      pricing: "Paid plans only",
      color: "from-blue-600 to-indigo-600"
    }
  ];

  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">כלי בדיקה חיוניים</h1>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                אוסף הכלים החשובים ביותר לבודקי תוכנה מקצועיים - מבדיקות יחידה ועד בדיקות E2E
              </p>
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category, index) => (
            <Card key={category} className="bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">
                  {category.includes('E2E') ? '🔗' : 
                   category.includes('Unit') ? '🧩' :
                   category.includes('Mobile') ? '📱' :
                   category.includes('API') ? '🔌' :
                   category.includes('Management') ? '📊' :
                   category.includes('Browser') ? '🌐' : '⚡'}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{category}</h3>
                <p className="text-xs text-slate-600 mt-1">
                  {tools.filter(t => t.category === category).length} כלים
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Card key={tool.name} className="group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${tool.color}`}></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{tool.logo}</div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {tool.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  {tool.description}
                </p>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    תכונות מרכזיות
                  </h4>
                  <div className="space-y-1">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-sm">
                    <span className="text-slate-500">מחיר: </span>
                    <span className="font-semibold text-slate-900">{tool.pricing}</span>
                  </div>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      size="sm" 
                      className={`bg-gradient-to-r ${tool.color} hover:scale-105 transition-all duration-300 shadow-lg`}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      בקר באתר
                      <ExternalLink className="w-3 h-3 mr-2" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
          <CardContent className="p-12 text-center">
            <Code className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">מחפש כלי נוסף?</h2>
            <p className="text-xl leading-relaxed max-w-2xl mx-auto opacity-95 mb-6">
              יש לך המלצה על כלי בדיקה שחסר כאן? שתף אותנו בקהילה!
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              הצע כלי חדש
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
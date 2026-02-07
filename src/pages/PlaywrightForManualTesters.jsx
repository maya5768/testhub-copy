import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  BookOpen,
  Code,
  CheckCircle,
  Zap,
  Globe,
  FileCode,
  Youtube,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlaywrightForManualTestersPage() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const features = [
    {
      icon: Globe,
      title: "תמיכה בדפדפנים מרובים",
      description: "Chromium, Firefox ו-WebKit - כולל אמולציה למובייל"
    },
    {
      icon: Zap,
      title: "מהיר ויציב",
      description: "ריצה במקביל, המתנה אוטומטית לרכיבים, וחוסן מובנה"
    },
    {
      icon: FileCode,
      title: "Codegen - יצירת קוד אוטומטית",
      description: "תקליט את הפעולות שלך והכלי ייצור את הקוד בשבילך"
    },
    {
      icon: Code,
      title: "שפות תכנות מגוונות",
      description: "תמיכה ב-JavaScript, TypeScript, Python, Java, C#"
    }
  ];

  const gettingStartedSteps = [
    {
      title: "שלב 1: התקנה",
      description: "התקן את Playwright בפרויקט שלך",
      code: "npm init playwright@latest",
      details: [
        "בחר TypeScript או JavaScript",
        "הגדר תיקיית בדיקות (tests או e2e)",
        "בחר האם להוסיף GitHub Actions",
        "התקן דפדפנים אוטומטית"
      ]
    },
    {
      title: "שלב 2: בדיקה ראשונה",
      description: "צור בדיקה פשוטה",
      code: `import { test, expect } from '@playwright/test';

test('בדיקה ראשונה שלי', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});`,
      details: [
        "הבדיקה עוברת לאתר",
        "בודקת שהכותרת מכילה 'Example'",
        "פשוט וברור!"
      ]
    },
    {
      title: "שלב 3: הרצת בדיקות",
      description: "הרץ את הבדיקות שלך",
      code: "npx playwright test",
      details: [
        "רץ במקביל על כל הדפדפנים",
        "מצב headless כברירת מחדל",
        "דוח HTML מפורט אחרי הריצה"
      ]
    }
  ];

  const keyFeatures = [
    {
      title: "Locators חכמים",
      description: "מצא אלמנטים בקלות עם המתנה אוטומטית",
      example: `// לפי טקסט
await page.getByText('שלח').click();

// לפי תפקיד (role)
await page.getByRole('button', { name: 'שלח' }).click();

// לפי placeholder
await page.getByPlaceholder('הכנס שם').fill('דני');`
    },
    {
      title: "Assertions מתקדמות",
      description: "בדיקות אוטומטיות עם המתנה מובנית",
      example: `// בדיקה שהאלמנט נראה
await expect(page.getByText('הצלחה')).toBeVisible();

// בדיקה שהערך מכיל טקסט
await expect(page.locator('#result')).toContainText('תוצאה');

// בדיקה שהשדה מכיל ערך
await expect(page.getByRole('textbox')).toHaveValue('test');`
    },
    {
      title: "Codegen - יצירת בדיקות אוטומטית",
      description: "תקליט פעולות ויצור קוד בדיקה",
      example: `# הפעל את Codegen
npx playwright codegen https://example.com

# תקליט פעולות:
# 1. לחץ על כפתורים
# 2. מלא טפסים
# 3. נווט בין דפים
# 4. Playwright יצור את הקוד בשבילך!`
    },
    {
      title: "UI Mode - מצב אינטראקטיבי",
      description: "הרץ בדיקות במצב watch עם ממשק גרפי",
      example: `npx playwright test --ui

# מאפשר:
# - צפייה בבדיקות בזמן אמת
# - ניפוי שגיאות צעד אחרי צעד
# - Time travel debugging
# - צפייה בתוצאות ישירות`
    },
    {
      title: "Trace Viewer",
      description: "צפה בהקלטה מלאה של הבדיקה",
      example: `# הרץ עם trace
npx playwright test --trace on

# פתח את ה-trace viewer
npx playwright show-trace trace.zip

# תראה:
# - כל שלב בבדיקה
# - Screenshots
# - Network requests
# - Console logs`
    },
    {
      title: "Mobile Emulation",
      description: "בדוק אתרים במצב מובייל",
      example: `import { devices } from '@playwright/test';

test.use({
  ...devices['iPhone 13']
});

test('בדיקה במובייל', async ({ page }) => {
  await page.goto('https://example.com');
  // הדף יראה כמו ב-iPhone 13!
});`
    }
  ];

  const videoResources = [
    {
      title: "סדרת וידאו מלאה ב-YouTube",
      description: "למידה מקיפה של Playwright בעברית",
      url: "https://www.youtube.com/playlist?list=PL1ZSrkGSJEGMhgw6gZphuA_oJoCShj0n0",
      topics: [
        "התקנה והגדרה ראשונית",
        "כתיבת בדיקות בסיסיות",
        "Locators ו-Selectors",
        "Assertions מתקדמות",
        "Page Objects Pattern",
        "דוחות ו-CI/CD",
        "דוגמאות מעשיות"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Playwright לבודק הידני
              </h1>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                למד איך לעבור מבדיקות ידניות לאוטומציה עם Playwright - אחד הכלים המתקדמים והפופולריים ביותר לאוטומציה של דפדפנים
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
                  מתאים למתחילים
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2">
                  קוד פתוח
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 text-sm px-4 py-2">
                  Microsoft
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* מה זה Playwright? */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" />
              מה זה Playwright?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-slate-700">
              <strong>Playwright</strong> הוא פריימוורק לאוטומציה של דפדפנים שפותח על ידי Microsoft. הוא מאפשר לבדוק אפליקציות Web בצורה מהירה, יציבה ואמינה.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-900 font-semibold mb-2">למה Playwright מתאים לבודק ידני?</p>
              <ul className="space-y-2 text-blue-800">
                <li>✅ <strong>קל ללמידה</strong> - תחביר פשוט וברור</li>
                <li>✅ <strong>Codegen</strong> - יוצר קוד אוטומטית בזמן שאתה מבצע פעולות</li>
                <li>✅ <strong>דוקומנטציה מעולה</strong> - מלא דוגמאות וסרטוני הדרכה</li>
                <li>✅ <strong>Visual Testing</strong> - השוואת screenshots אוטומטית</li>
                <li>✅ <strong>קהילה פעילה</strong> - תמיכה ומשאבים רבים</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* תכונות עיקריות */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">תכונות עיקריות</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-white to-slate-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* מדריך להתחלה */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Laptop className="w-7 h-7 text-green-600" />
              מדריך להתחלה מהירה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {gettingStartedSteps.map((step, index) => (
                <div key={index} className="border-r-4 border-green-500 pr-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 mb-3">{step.description}</p>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-3 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{step.code}</pre>
                  </div>
                  <ul className="space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* תכונות מתקדמות */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">תכונות מתקדמות וחשובות</h2>
          <div className="space-y-4">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-600" />
                      {feature.title}
                    </CardTitle>
                    {expandedSection === index ? (
                      <ChevronUp className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                </CardHeader>
                <AnimatePresence>
                  {expandedSection === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <CardContent>
                        <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                          <pre className="whitespace-pre-wrap">{feature.example}</pre>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </div>

        {/* משאבי וידאו */}
        <Card className="mb-8 bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Youtube className="w-7 h-7" />
              סדרת וידאו מומלצת ללמידה
            </CardTitle>
          </CardHeader>
          <CardContent>
            {videoResources.map((resource, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                <p className="text-red-100 mb-4">{resource.description}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">נושאים בסדרה:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {resource.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => window.open(resource.url, "_blank")}
                  className="bg-white text-red-600 hover:bg-red-50"
                >
                  <Youtube className="w-5 h-5 mr-2" />
                  צפה בסדרה ב-YouTube
                  <ExternalLink className="w-4 h-4 mr-2" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* קישורים נוספים */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ExternalLink className="w-7 h-7 text-blue-600" />
              משאבים נוספים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => window.open("https://playwright.dev/docs/intro", "_blank")}
                variant="outline"
                className="h-auto flex flex-col items-start p-4 hover:bg-blue-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-bold">תיעוד רשמי</span>
                </div>
                <span className="text-sm text-slate-600 text-right">
                  המדריך הרשמי והמלא של Playwright
                </span>
              </Button>

              <Button
                onClick={() => window.open("https://playwright.dev/docs/codegen", "_blank")}
                variant="outline"
                className="h-auto flex flex-col items-start p-4 hover:bg-green-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Codegen - יצירת קוד אוטומטית</span>
                </div>
                <span className="text-sm text-slate-600 text-right">
                  למד איך ליצור בדיקות ללא קוד
                </span>
              </Button>

              <Button
                onClick={() => window.open("https://playwright.dev/docs/best-practices", "_blank")}
                variant="outline"
                className="h-auto flex flex-col items-start p-4 hover:bg-purple-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span className="font-bold">Best Practices</span>
                </div>
                <span className="text-sm text-slate-600 text-right">
                  המלצות ושיטות עבודה מומלצות
                </span>
              </Button>

              <Button
                onClick={() => window.open("https://playwright.dev/docs/test-ui-mode", "_blank")}
                variant="outline"
                className="h-auto flex flex-col items-start p-4 hover:bg-orange-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-5 h-5 text-orange-600" />
                  <span className="font-bold">UI Mode</span>
                </div>
                <span className="text-sm text-slate-600 text-right">
                  הרץ בדיקות בממשק גרפי אינטראקטיבי
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">מוכן להתחיל?</h3>
            <p className="text-lg mb-6 opacity-90">
              הצעד הראשון הוא תמיד הקשה ביותר - אבל Playwright עושה אותו קל במיוחד!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open("https://playwright.dev/docs/intro", "_blank")}
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                קרא את התיעוד
              </Button>
              <Button
                onClick={() => window.open("https://www.youtube.com/playlist?list=PL1ZSrkGSJEGMhgw6gZphuA_oJoCShj0n0", "_blank")}
                variant="secondary"
                className="bg-white text-red-600 hover:bg-gray-50 font-semibold"
              >
                <Youtube className="w-5 h-5 mr-2" />
                צפה בסרטונים
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
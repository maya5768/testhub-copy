import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PermissionGuard({ 
  children, 
  requiredStatus = "חבר מאושר", 
  fallbackMessage = "תכונה זו זמינה רק לחברי קהילה מאושרים",
  showJoinButton = true 
}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const hasPermission = user && 
    (user.community_status === requiredStatus || 
     user.community_status === "מנהל" ||
     (requiredStatus === "חבר מאושר" && user.community_status === "מנהל"));

  if (!hasPermission) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-orange-200">
        <CardContent className="p-8 text-center">
          <Lock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">גישה מוגבלת</h3>
          <p className="text-slate-600 mb-6">{fallbackMessage}</p>
          {showJoinButton && (
            <Link to={createPageUrl("Join")}>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Users className="w-4 h-4 mr-2" />
                הצטרף לקהילה
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return children;
}
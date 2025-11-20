
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Announcement } from "@/entities/Announcement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardHeader, CardTitle
import {
  Plus,
  Pin,
  Calendar,
  User as UserIcon,
  Trash2,
  PinOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function NoticeBoardPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null); // New state variable

  useEffect(() => {
    checkUser();
    loadAnnouncements();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await Announcement.list("-created_date", 100);

      // Sort: pinned first, then by date
      const sorted = data.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.created_date) - new Date(a.created_date);
      });

      setAnnouncements(sorted);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
    setIsLoading(false);
  };

  const togglePin = async (announcement) => {
    try {
      await Announcement.update(announcement.id, {
        is_pinned: !announcement.is_pinned
      });
      loadAnnouncements();
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המודעה?")) {
      try {
        await Announcement.delete(announcementId);
        loadAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  // New function for handling announcement edits
  const handleEditAnnouncement = async (announcementId, updatedData) => {
    try {
      await Announcement.update(announcementId, updatedData);
      setEditingAnnouncement(null); // Close the modal
      loadAnnouncements(); // Refresh the announcements list
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  const canModify = (announcement) => {
    return user && (
      user.community_status === "מנהל" ||
      user.email === announcement.author_email
    );
  };

  const colorClasses = {
    yellow: "bg-yellow-200 border-yellow-300 shadow-yellow-200/50",
    blue: "bg-blue-200 border-blue-300 shadow-blue-200/50",
    pink: "bg-pink-200 border-pink-300 shadow-pink-200/50",
    green: "bg-green-200 border-green-300 shadow-green-200/50",
    orange: "bg-orange-200 border-orange-300 shadow-orange-200/50"
  };

  const canCreateAnnouncement = user && (
    user.community_status === "חבר מאושר" ||
    user.community_status === "מנהל"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">לוח מודעות</h1>
            <p className="text-lg text-slate-600">עדכונים, הודעות וחדשות מהקהילה</p>
          </div>

          {canCreateAnnouncement && (
            <Link to={createPageUrl("CreateAnnouncement")}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                הוסף מודעה
              </Button>
            </Link>
          )}
        </div>

        {/* Notice Board */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : announcements.length === 0 ? (
          <Card className="text-center py-12 bg-white/70 backdrop-blur-sm">
            <CardContent>
              <Pin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                עדיין אין מודעות
              </h3>
              <p className="text-slate-600 mb-6">
                {canCreateAnnouncement
                  ? "היה הראשון לפרסם מודעה!"
                  : "הצטרף לקהילה כדי לפרסם מודעות"}
              </p>
              {canCreateAnnouncement && (
                <Link to={createPageUrl("CreateAnnouncement")}>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Plus className="w-5 h-5 mr-2" />
                    הוסף מודעה ראשונה
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {announcements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: Math.random() * 6 - 3 // Random rotation between -3 and 3 degrees
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card
                    className={`${colorClasses[announcement.color]} border-2 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-visible`}
                    style={{
                      transform: `rotate(${Math.random() * 6 - 3}deg)`
                    }}
                  >
                    {/* Pin at top */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      {announcement.is_pinned ? (
                        <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg flex items-center justify-center">
                          <Pin className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-slate-400 rounded-full shadow-md"></div>
                      )}
                    </div>

                    <CardContent className="p-6 pt-8">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 mb-3 break-words"> {/* Added break-words */}
                        {announcement.title}
                      </h3>

                      {/* Content */}
                      <p className="text-slate-700 text-sm mb-4 whitespace-pre-wrap break-words"> {/* Removed line-clamp-4 and added break-words */}
                        {announcement.content}
                      </p>

                      {/* Footer */}
                      <div className="space-y-2 pt-4 border-t border-slate-300/50">
                        {/* Date & Author */}
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {announcement.created_date
                              ? format(new Date(announcement.created_date), "d בMMMM yyyy", { locale: he })
                              : "לא זמין"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <UserIcon className="w-3 h-3" />
                          <span>{announcement.author_name || "אנונימי"}</span>
                        </div>

                        {/* Actions */}
                        {canModify(announcement) && (
                          <div className="flex flex-col gap-2 pt-2">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => togglePin(announcement)}
                                className="flex-1 text-xs h-7"
                              >
                                {announcement.is_pinned ? (
                                  <>
                                    <PinOff className="w-3 h-3 mr-1" />
                                    בטל נעיצה
                                  </>
                                ) : (
                                  <>
                                    <Pin className="w-3 h-3 mr-1" />
                                    נעץ
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteAnnouncement(announcement.id)}
                                className="text-xs h-7 border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingAnnouncement(announcement)} // Set announcement for editing
                              className="w-full text-xs h-7 border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              ערוך מודעה
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Info Card */}
        {!canCreateAnnouncement && (
          <Card className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <Pin className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-3">רוצה לפרסם מודעה?</h3>
              <p className="text-lg mb-6 opacity-90">
                הצטרף לקהילה ועבור את מבחן ההערכה כדי לפרסם מודעות
              </p>
              <Link to={createPageUrl("Join")}>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 font-semibold">
                  הצטרף לקהילה
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal - New modal for editing announcements */}
        {editingAnnouncement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  ערוך מודעה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleEditAnnouncement(editingAnnouncement.id, {
                    title: formData.get('title'),
                    content: formData.get('content'),
                    color: formData.get('color')
                  });
                }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      כותרת המודעה *
                    </label>
                    <input
                      name="title"
                      defaultValue={editingAnnouncement.title}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      תוכן המודעה *
                    </label>
                    <textarea
                      name="content"
                      defaultValue={editingAnnouncement.content}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-40"
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      בחר צבע לפתק
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { value: "yellow", label: "צהוב", class: "bg-yellow-200" },
                        { value: "blue", label: "כחול", class: "bg-blue-200" },
                        { value: "pink", label: "ורוד", class: "bg-pink-200" },
                        { value: "green", label: "ירוק", class: "bg-green-200" },
                        { value: "orange", label: "כתום", class: "bg-orange-200" }
                      ].map((color) => (
                        <label key={color.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="color"
                            value={color.value}
                            defaultChecked={editingAnnouncement.color === color.value}
                            className="hidden peer"
                          />
                          <div className={`${color.class} h-16 rounded-lg border-2 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-300 hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold text-slate-800`}>
                            {color.label}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingAnnouncement(null)} // Close modal without saving
                    >
                      ביטול
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      שמור שינויים
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

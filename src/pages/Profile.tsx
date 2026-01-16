import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import PersonalInfoTab from "@/components/profile/PersonalInfoTab";
import StatsTab from "@/components/profile/StatsTab";
import SettingsTab from "@/components/profile/SettingsTab";
import PasswordTab from "@/components/profile/PasswordTab";
import CoursesTab from "@/components/profile/CoursesTab";
import AnalyticsTab from "@/components/profile/AnalyticsTab";
import AvatarUploadModal from "@/components/profile/AvatarUploadModal";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  display_name: string;
  avatar: string;
  school?: string;
  grade?: string;
  email?: string;
  phone?: string;
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
  birth_date?: string;
  class_name?: string;
}

interface GameProgress {
  total_xp: number;
  total_points: number;
  level: number;
  current_node: number;
  completed_nodes: (string | number)[];
  earned_badges: string[];
  global_level?: number;
  coins?: number;
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_learning_days: number;
  last_activity_date: string | null;
}

interface Achievement {
  id: string;
  achievement_id: string;
  achievement_name: string;
  achievement_icon: string;
  achievement_description: string;
  earned_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
  const [userRole, setUserRole] = useState<string>("student");
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      await Promise.all([
        loadProfile(session.user.id),
        loadGameProgress(session.user.id),
        loadUserRole(session.user.id),
        loadStreak(session.user.id),
        loadAchievements(session.user.id),
      ]);

      // Update streak on login
      await updateStreak(session.user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin người dùng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      return;
    }

    setProfile(data as Profile);
  };

  const loadGameProgress = async (userId: string) => {
    // Load global progress from game_globals (PRIMARY SOURCE for XP)
    const { data: globalData, error: globalError } = await supabase
      .from("game_globals")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Load all course progress to calculate total completed nodes
    const { data: coursesData } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", userId);

    // Load from game_progress (legacy, for compatibility)
    const { data: progressData } = await supabase
      .from("game_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (globalError && !globalData) {
      console.error("Error loading global progress:", globalError);
    }

    // Calculate total completed nodes from ALL courses
    const allCompletedNodes: (string | number)[] = [];
    let totalPoints = 0;
    
    if (coursesData && coursesData.length > 0) {
      coursesData.forEach((course: any) => {
        // completed_nodes can be array of numbers [0,1,2] or strings ["n1","n2"]
        const nodes = Array.isArray(course.completed_nodes) ? course.completed_nodes : [];
        allCompletedNodes.push(...nodes);
        totalPoints += (course.total_stars || 0);
      });
    }

    // Use global_xp from game_globals as PRIMARY source
    const totalXP = (globalData?.total_xp as number) || (progressData?.total_xp as number) || 0;
    const globalLevel = (globalData?.global_level as number) || (progressData?.level as number) || 1;

    // Combine data from all sources
    const combinedProgress: GameProgress = {
      total_xp: totalXP,
      total_points: totalPoints || (progressData?.total_points as number) || 0,
      level: globalLevel,
      current_node: (progressData?.current_node as number) || 0,
      completed_nodes: allCompletedNodes.length > 0 
        ? allCompletedNodes 
        : ((progressData?.completed_nodes as string[]) || []),
      earned_badges: ((globalData?.unlocked_badges as string[]) || (progressData?.earned_badges as string[]) || []),
      global_level: globalLevel,
      coins: (globalData?.coins as number) || 0,
    };

    setGameProgress(combinedProgress);
  };

  const loadUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error loading user role:", error);
      return;
    }

    setUserRole(data.role);
  };

  const loadStreak = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      // If no streak record, create one
      if (error.code === "PGRST116") {
        const { data: newStreak } = await supabase
          .from("user_streaks")
          .insert({ user_id: userId })
          .select()
          .single();
        if (newStreak) setStreak(newStreak as StreakData);
      }
      return;
    }

    setStreak(data as StreakData);
  };

  const loadAchievements = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading achievements:", error);
      return;
    }

    setAchievements((data as Achievement[]) || []);
  };

  const updateStreak = async (userId: string) => {
    try {
      await supabase.rpc("update_user_streak", { p_user_id: userId });
      await loadStreak(userId);
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  const handleUpdateProfile = async (data: Partial<Profile>) => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin cá nhân",
    });

    await loadProfile(profile.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAvatarSave = async (avatar: string) => {
    if (!profile) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({ avatar })
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật avatar",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: "Đã cập nhật avatar",
    });

    await loadProfile(profile.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  const isAdmin = userRole === "teacher" || userRole === "admin";

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <PersonalInfoTab
            profile={profile}
            isAdmin={isAdmin}
            onUpdate={handleUpdateProfile}
          />
        );
      case "stats":
        return (
          <StatsTab
            gameProgress={gameProgress}
            streak={streak}
            achievements={achievements}
          />
        );
      case "analytics":
        return (
          <AnalyticsTab
            gameProgress={gameProgress}
            streak={streak}
          />
        );
      case "settings":
        return <SettingsTab />;
      case "password":
        return <PasswordTab />;
      case "courses":
        return <CoursesTab gameProgress={gameProgress} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            {/* Sidebar */}
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              profile={profile}
              streak={streak?.current_streak || 0}
              onLogout={handleLogout}
              onAvatarUpdate={() => setAvatarModalOpen(true)}
            />

            {/* Main Content */}
            <div className="min-w-0">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Avatar Modal */}
      <AvatarUploadModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentAvatar={profile?.avatar || "👤"}
        onSave={handleAvatarSave}
      />
    </div>
  );
};

export default Profile;

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { PlayCircle, BookOpen, CheckCircle, Search, FileText, Loader2, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { VideoPlayer } from "@/components/lesson/VideoPlayer";
import { LessonProgressBadge } from "@/components/lesson/LessonProgressBadge";
import { NotesTab } from "@/components/lesson/NotesTab";
import { CommentsTab } from "@/components/lesson/CommentsTab";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

/* ==================================================================================
   KHU VỰC ĐỊNH NGHĨA KIỂU DỮ LIỆU
   ================================================================================== */
interface Lesson {
  id: string;
  title: string;
  topicCount: number;
  quizCount: number;
  completed?: boolean;
}

interface Topic {
  id: string;
  lessonId: string;
  semester: 1 | 2;
  title: string;
  videoUrl: string;
  description: string;
  completed?: boolean;
}

/* ==================================================================================
   LOGIC GIAO DIỆN
   ================================================================================== */
const Lessons = () => {
  const { t } = useLanguage();
  // Hook lấy dữ liệu từ Supabase
  const {
    lessons: dbLessons,
    topics: dbTopics,
    lessonProgress,
    isLoading,
    markTopicCompleted,
    getLessonProgressById,
    isTopicCompleted,
  } = useLessonProgress();

  // Map DB data to component format
  const activeLessons = dbLessons.map(l => ({
    id: l.id,
    title: l.title,
  }));

  const activeTopics = dbTopics.map(t => ({
    id: t.id,
    lesson_id: t.lesson_id,
    semester: t.semester,
    title: t.title,
    video_url: t.video_url,
    description: t.description || "",
    order_index: t.order_index,
    duration_minutes: t.duration_minutes || 15,
  }));

  // Read URL search params for deep linking
  const [searchParams] = useSearchParams();
  const urlGrade = searchParams.get("grade");
  const urlTopic = searchParams.get("topic");
  const urlTab = searchParams.get("tab");

  // State chọn Lớp
  const [selectedLessonId, setSelectedLessonId] = useState<string>(() => {
    // Initialize from URL if available
    if (urlGrade && activeLessons.find(l => l.id === urlGrade)) {
      return urlGrade;
    }
    return "L5";
  });

  // State chọn Học kì (Mặc định là 1)
  const [selectedSemester, setSelectedSemester] = useState<number>(() => {
    // If we have a topic from URL, find its semester
    if (urlTopic) {
      const topic = activeTopics.find(t => t.id === urlTopic);
      if (topic) return topic.semester;
    }
    return 1;
  });

  // State tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // State chọn Bài giảng (Video)
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    // Initialize from URL if available
    if (urlTopic && activeTopics.find(t => t.id === urlTopic)) {
      return urlTopic;
    }
    return "";
  });

  // State cho active tab (notes/qa)
  const [activeToolTab, setActiveToolTab] = useState<string>(() => {
    return urlTab === "notes" ? "notes" : "qa";
  });

  // State cho mobile sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // LỌC DỮ LIỆU: Lớp + Học kì + Tìm kiếm
  const filteredTopics = useMemo(() => {
    return activeTopics.filter(
      (t) =>
        t.lesson_id === selectedLessonId &&
        t.semester === selectedSemester &&
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [activeTopics, selectedLessonId, selectedSemester, searchQuery]);

  // Apply URL deep-link params once data has loaded
  const [deepLinkApplied, setDeepLinkApplied] = useState(false);
  const toolTabsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (deepLinkApplied || activeTopics.length === 0) return;
    
    if (urlGrade && activeLessons.find(l => l.id === urlGrade)) {
      setSelectedLessonId(urlGrade);
    }
    if (urlTopic) {
      const topic = activeTopics.find(t => t.id === urlTopic);
      if (topic) {
        setSelectedLessonId(topic.lesson_id);
        setSelectedSemester(topic.semester);
        setSelectedTopicId(urlTopic);
        if (urlTab === "notes") {
          setActiveToolTab("notes");
        } else if (urlTab === "qa") {
          setActiveToolTab("qa");
        }
        setDeepLinkApplied(true);
        // Scroll to the notes/qa section after a short delay
        if (urlTab === "notes" || urlTab === "qa") {
          setTimeout(() => {
            toolTabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 500);
        }
        return;
      }
    }
    setDeepLinkApplied(true);
  }, [activeTopics, activeLessons, urlGrade, urlTopic, urlTab, deepLinkApplied]);

  // Tự động chọn bài đầu tiên (chỉ khi không có URL topic hoặc deep link đã xử lý)
  useEffect(() => {
    if (!deepLinkApplied) return;
    
    if (filteredTopics.length > 0) {
      if (!selectedTopicId || !filteredTopics.find((t) => t.id === selectedTopicId)) {
        setSelectedTopicId(filteredTopics[0].id);
      }
    } else {
      setSelectedTopicId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTopics, deepLinkApplied]);

  const selectedLesson = activeLessons.find((l) => l.id === selectedLessonId);
  const selectedTopic = activeTopics.find((t) => t.id === selectedTopicId);

  // Xử lý khi video kết thúc
  const handleVideoComplete = async () => {
    if (selectedTopicId) {
      await markTopicCompleted(selectedTopicId);
    }
  };

  // Lấy tiến độ của lesson hiện tại
  const currentLessonProgress = getLessonProgressById(selectedLessonId);

  // Handler chọn topic trên mobile
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Component nội dung sidebar (dùng chung cho cả desktop và mobile)
  const SidebarContent = () => (
    <>
      {/* Phần điều khiển trên cùng */}
      <div className="p-4 space-y-4 flex-shrink-0">
        {/* 1. Chọn Lớp */}
        <div>
          <label className="text-sm font-black text-foreground uppercase mb-1.5 block tracking-wider">
            {t.lessonsPage.classLabel}
          </label>
          <Select
            value={selectedLessonId}
            onValueChange={(val) => {
              setSelectedLessonId(val);
              setSearchQuery("");
              setSelectedSemester(1);
            }}
          >
            <SelectTrigger className="w-full font-bold h-11 bg-background border-2 hover:border-primary/50 transition-colors">
              <SelectValue placeholder={t.lessonsPage.selectClass} />
            </SelectTrigger>
            <SelectContent>
              {activeLessons.map((lesson) => {
                const progress = getLessonProgressById(lesson.id);
                return (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>{t.lessonsPage.classNames[lesson.id] || lesson.title}</span>
                      {progress && progress.completion_percentage > 0 && (
                        <span className="text-xs text-primary font-bold">
                          {Math.round(progress.completion_percentage)}%
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          {/* Progress bar cho lesson hiện tại */}
          {currentLessonProgress && currentLessonProgress.total_topics > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">{t.lessonsPage.progress}</span>
                <span className="text-primary font-bold">
                  {currentLessonProgress.completed_topics}/{currentLessonProgress.total_topics} {t.lessonsPage.lessons}
                </span>
              </div>
              <Progress 
                value={currentLessonProgress.completion_percentage} 
                className="h-2"
              />
            </div>
          )}
        </div>

        {/* 2. Chọn Học Kì (Tabs) */}
        <div className="bg-muted/50 p-1 rounded-lg">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setSelectedSemester(1)}
              className={`text-sm font-black py-2 rounded-md transition-all ${
                selectedSemester === 1
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:bg-white/70 font-bold"
              }`}
            >
              {t.lessonsPage.semester1}
            </button>
            <button
              onClick={() => setSelectedSemester(2)}
              className={`text-sm font-black py-2 rounded-md transition-all ${
                selectedSemester === 2
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:bg-white/70 font-bold"
              }`}
            >
              {t.lessonsPage.semester2}
            </button>
          </div>
        </div>

        {/* 3. Tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.lessonsPage.searchPlaceholder}
            className="pl-9 bg-background border-2 font-semibold h-11 focus:border-primary/50 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Separator className="flex-shrink-0" />

      {/* Danh sách chủ điểm (Topics) */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-muted/20 to-muted/5 min-h-0 overflow-hidden">
        {/* Header danh sách */}
        <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 text-sm font-black text-foreground uppercase tracking-wider border-b-2 border-primary/30 flex justify-between items-center flex-shrink-0">
          <span className="text-base">{t.lessonsPage.lessonList}</span>
          <Badge
            variant="outline"
            className="text-xs h-6 px-2.5 bg-background/90 font-black border-primary/40 text-primary"
          >
            {filteredTopics.length} {t.lessonsPage.lessonCount}
          </Badge>
        </div>

        {/* Container scroll với chiều cao cố định */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden lesson-list-scroll min-h-0 pb-4">
          <div className="p-3 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTopics.length > 0 ? (
              filteredTopics.map((topic, index) => {
                const completed = isTopicCompleted(topic.id);
                return (
                  <motion.button
                    key={topic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: isMobile && isMobileSidebarOpen ? index * 0.05 : 0,
                      duration: 0.2 
                    }}
                    onClick={() => handleTopicSelect(topic.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border-2 flex gap-3.5 group items-start ${
                      selectedTopicId === topic.id
                        ? "bg-gradient-to-r from-primary/20 to-primary/15 border-primary shadow-lg ring-2 ring-primary/30"
                        : "bg-white hover:bg-muted/50 border-border/60 hover:border-primary/50 shadow-sm hover:shadow-lg"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Icon số thứ tự */}
                    <div className="flex-shrink-0 pt-0.5">
                      {selectedTopicId === topic.id ? (
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                          <PlayCircle className="h-5 w-5" />
                        </div>
                      ) : completed ? (
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-black text-foreground/70 group-hover:bg-primary/20 group-hover:text-primary transition-all border-2 border-border">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Nội dung bài học */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base font-bold leading-snug mb-2 line-clamp-2 ${
                          selectedTopicId === topic.id
                            ? "text-primary"
                            : "text-foreground group-hover:text-primary/90"
                        }`}
                      >
                        {topic.title}
                      </h3>

                      {/* Badge trạng thái */}
                      <div className="flex items-center gap-2">
                        {completed ? (
                          <span className="text-xs px-2.5 py-1 bg-primary/15 text-primary rounded-lg font-bold inline-flex items-center gap-1.5">
                            <CheckCircle className="h-3 w-3" /> {t.lessonsPage.completed}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/60 rounded-lg font-bold">
                            <PlayCircle className="h-3 w-3" /> {topic.duration_minutes || 15}p
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })
            ) : (
              <div className="text-center py-12 px-4 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-xs">{t.lessonsPage.noLessonsFound} {selectedSemester}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Viền xanh lá ở đuôi sidebar */}
      <div className="h-3 bg-primary rounded-b-2xl flex-shrink-0" />
    </>
  );

  return (
    <PageTransition className="flex-1 flex flex-col bg-background">
      {/* KHU VỰC NỘI DUNG */}
      <div className="flex flex-1 min-h-0 relative">
        
        {/* Mobile: Floating button với animation */}
        <AnimatePresence>
          {!isMobileSidebarOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="lg:hidden fixed bottom-20 left-4 z-50"
            >
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="shadow-xl rounded-full h-14 w-14 p-0 hover:scale-110 transition-transform"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: Sheet sidebar với animation mượt */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent 
            side="left" 
            className="w-[320px] sm:w-[360px] p-0 flex flex-col border-r-2 border-primary/20"
          >
            <SheetTitle className="sr-only">Danh sách bài học</SheetTitle>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <SidebarContent />
            </motion.div>
          </SheetContent>
        </Sheet>

        {/* Desktop: Sidebar cố định */}
        <div className="hidden lg:flex w-[320px] xl:w-[360px] border-r flex-col bg-card shadow-sm z-10 flex-shrink-0 h-[780px] overflow-hidden rounded-br-2xl">
          <SidebarContent />
        </div>

        {/* --- KHUNG CHÍNH (MAIN CONTENT) --- */}
        <div className="flex-1 flex flex-col bg-background h-full overflow-hidden relative">
          {/* Mobile header bar */}
          <div className="lg:hidden flex items-center gap-3 p-3 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <Menu className="h-4 w-4" />
              <span className="font-bold">{t.lessonsPage.lessonButton}</span>
            </Button>
            {selectedTopic && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {selectedTopic.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedLesson ? (t.lessonsPage.classNames[selectedLesson.id] || selectedLesson.title) : ''} • {t.lessonsPage.semester} {selectedSemester}
                </p>
              </div>
            )}
          </div>

          {!selectedTopic ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/5">
              <BookOpen className="h-16 w-16 mb-4 opacity-20" />
              <h2 className="text-xl font-semibold mb-2">{t.lessonsPage.noTopicSelected}</h2>
              <p className="hidden lg:block">{t.lessonsPage.selectFromLeft}</p>
              <p className="lg:hidden">{t.lessonsPage.tapToSelect}</p>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              {/* SỬA LỖI VIDEO BÉ: Tăng max-w từ 5xl lên 7xl hoặc full */}
              <div className="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
                {/* Header Bài Học - Ẩn trên mobile vì đã có header bar */}
                <div className="hidden lg:flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider shadow-md">
                      {selectedLesson ? (t.lessonsPage.classNames[selectedLesson.id] || selectedLesson.title) : ''}
                    </span>
                    <span className="text-muted-foreground font-semibold">/</span>
                    <span className="bg-muted px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold">
                      {t.lessonsPage.semester} {selectedSemester}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
                    {selectedTopic.title}
                  </h1>
                </div>

                {/* Video Player với nút hoàn thành */}
                <VideoPlayer
                  key={selectedTopic.id}
                  videoUrl={selectedTopic.video_url}
                  title={selectedTopic.title}
                  topicId={selectedTopic.id}
                  onComplete={handleVideoComplete}
                  isCompleted={isTopicCompleted(selectedTopic.id)}
                />

                {/* Phần nội dung bài học + XP - Layout 2 cột */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Cột trái: Nội dung bài học - Thiết kế mới theo mẫu */}
                  <div className="lg:col-span-2 bg-card dark:bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Header */}
                    <div className="px-5 pt-5 pb-3">
                      <h3 className="font-bold text-xl flex items-center gap-3 text-foreground">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {t.lessonsPage.lessonContent}
                      </h3>
                    </div>
                    
                    {/* Nội dung */}
                    <div className="px-5 pb-5">
                      <h4 className="font-bold text-lg text-primary mb-3">
                        {selectedTopic.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {t.lessonsPage.lessonContentDesc}
                      </p>
                    </div>
                  </div>

                  {/* Cột phải: XP Info */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 md:p-6 border border-primary/20 flex flex-col items-center justify-center text-center gap-3">
                    <div className="text-4xl">🎯</div>
                    <div className="text-lg md:text-xl font-bold text-primary">
                      {t.lessonsPage.completeLesson}
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-primary">
                      +20 XP
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.lessonsPage.watchToEarn}
                    </p>
                  </div>
                </div>

                {/* Phần Ghi chú & Hỏi đáp - Nằm dưới, full width */}
                <div ref={toolTabsRef} className="bg-card rounded-xl md:rounded-2xl border shadow-lg overflow-hidden">
                  <Tabs value={activeToolTab} onValueChange={setActiveToolTab} className="w-full">
                    {/* Header với gradient xanh lá - responsive */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 px-3 sm:px-4 md:px-6 py-3 md:py-5 flex justify-center">
                      <TabsList className="bg-primary-foreground/20 backdrop-blur-sm border-none h-10 sm:h-12 md:h-14 p-1 md:p-1.5 rounded-full w-full max-w-md">
                        <TabsTrigger 
                          value="notes" 
                          className="flex-1 text-xs sm:text-sm md:text-lg font-bold px-2 sm:px-4 md:px-8 py-2 md:py-3 rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=inactive]:text-primary-foreground/90 transition-all"
                        >
                          <span className="hidden sm:inline">📝 </span>{t.lessonsPage.notes}
                        </TabsTrigger>
                        <TabsTrigger 
                          value="qa" 
                          className="flex-1 text-xs sm:text-sm md:text-lg font-bold px-2 sm:px-4 md:px-8 py-2 md:py-3 rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=inactive]:text-primary-foreground/90 transition-all"
                        >
                          <span className="hidden sm:inline">💬 </span>{t.lessonsPage.qa}
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-card">
                      <TabsContent value="notes" className="mt-0">
                        <NotesTab 
                          topicId={selectedTopic.id} 
                          topicTitle={selectedTopic.title} 
                        />
                      </TabsContent>
                      
                      <TabsContent value="qa" className="mt-0">
                        <CommentsTab 
                          topicId={selectedTopic.id} 
                          topicTitle={selectedTopic.title} 
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default Lessons;

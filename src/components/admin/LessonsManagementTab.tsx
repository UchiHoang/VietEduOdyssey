import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Pencil, Trash2, Search, Video, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface TopicRow {
  id: string;
  lesson_id: string;
  title: string;
  video_url: string;
  semester: number;
  order_index: number;
  description: string | null;
  duration_minutes: number | null;
}

const GRADE_KEYS = ["L0", "L1", "L2", "L3", "L4", "L5"];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function getThumbnailUrl(videoUrl: string): string | null {
  const id = extractYouTubeId(videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

const emptyForm = { title: "", lesson_id: "L0", semester: "1", video_url: "", description: "", duration_minutes: "15" };

const LessonsManagementTab = () => {
  const { t } = useLanguage();
  const al = t.adminLessons;

  const gradeLabels: Record<string, string> = {
    L0: al.gradePreschool,
    L1: al.grade1,
    L2: al.grade2,
    L3: al.grade3,
    L4: al.grade4,
    L5: al.grade5,
  };

  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<TopicRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTopics = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("topics").select("*").order("lesson_id").order("semester").order("order_index");
    if (error) {
      toast({ title: al.error, description: error.message, variant: "destructive" });
    } else {
      setTopics(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTopics(); }, []);

  const filtered = useMemo(() => {
    return topics.filter(t => {
      if (gradeFilter !== "all" && t.lesson_id !== gradeFilter) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [topics, gradeFilter, search]);

  const openAdd = () => {
    setEditingTopic(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (topic: TopicRow) => {
    setEditingTopic(topic);
    setForm({
      title: topic.title,
      lesson_id: topic.lesson_id,
      semester: String(topic.semester),
      video_url: topic.video_url,
      description: topic.description || "",
      duration_minutes: String(topic.duration_minutes || 15),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.video_url.trim()) {
      toast({ title: al.missingInfo, description: al.missingInfoDesc, variant: "destructive" });
      return;
    }
    setSaving(true);

    if (editingTopic) {
      const { error } = await supabase.from("topics").update({
        title: form.title.trim(),
        lesson_id: form.lesson_id,
        semester: Number(form.semester),
        video_url: form.video_url.trim(),
        description: form.description.trim() || null,
        duration_minutes: Number(form.duration_minutes) || 15,
      }).eq("id", editingTopic.id);

      if (error) {
        toast({ title: al.errorUpdate, description: error.message, variant: "destructive" });
      } else {
        toast({ title: al.updated, description: `"${form.title}" ${al.updatedDesc}` });
        setModalOpen(false);
        fetchTopics();
      }
    } else {
      const allInGrade = topics.filter(t => t.lesson_id === form.lesson_id);
      const nextIndex = allInGrade.length > 0 ? Math.max(...allInGrade.map(t => t.order_index)) + 1 : 1;
      const newId = `${form.lesson_id}-${nextIndex}`;

      const { error } = await supabase.from("topics").insert({
        id: newId,
        title: form.title.trim(),
        lesson_id: form.lesson_id,
        semester: Number(form.semester),
        video_url: form.video_url.trim(),
        description: form.description.trim() || null,
        order_index: nextIndex,
        duration_minutes: Number(form.duration_minutes) || 15,
      });

      if (error) {
        toast({ title: al.errorAdd, description: error.message, variant: "destructive" });
      } else {
        toast({ title: al.added, description: `"${form.title}" ${al.addedDesc}` });
        setModalOpen(false);
        fetchTopics();
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("topics").delete().eq("id", deleteTarget.id);
    if (error) {
      toast({ title: al.errorDelete, description: error.message, variant: "destructive" });
    } else {
      toast({ title: al.deleted, description: `"${deleteTarget.title}" ${al.deletedDesc}` });
      fetchTopics();
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const thumbnailPreview = getThumbnailUrl(form.video_url);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            {al.title}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{al.subtitle}</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {al.addNew}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{al.allGrades}</SelectItem>
            {GRADE_KEYS.map(k => (
              <SelectItem key={k} value={k}>{gradeLabels[k]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={al.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{al.total}: <strong className="text-foreground">{filtered.length}</strong> {al.lessonsCount}</span>
        {gradeFilter !== "all" && (
          <Badge variant="secondary">{gradeLabels[gradeFilter]}</Badge>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{al.noResults}</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="max-h-[520px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[100px]">{al.thumbnail}</TableHead>
                  <TableHead>{al.lessonName}</TableHead>
                  <TableHead className="w-[120px] text-center">{al.grade}</TableHead>
                  <TableHead className="w-[80px]">{al.semester}</TableHead>
                  <TableHead className="hidden md:table-cell">{al.videoLink}</TableHead>
                  <TableHead className="w-[100px] text-right">{al.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(topic => {
                  const thumb = getThumbnailUrl(topic.video_url);
                  return (
                    <TableRow key={topic.id}>
                      <TableCell>
                        {thumb ? (
                          <img src={thumb} alt={topic.title} className="w-20 h-auto rounded-md object-cover" />
                        ) : (
                          <div className="w-20 h-12 rounded-md bg-muted flex items-center justify-center">
                            <Video className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{topic.title}</p>
                        {topic.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{topic.description}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="whitespace-nowrap">{gradeLabels[topic.lesson_id] || topic.lesson_id}</Badge>
                      </TableCell>
                      <TableCell>{al.semester}{topic.semester}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <a href={topic.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 max-w-[200px] truncate">
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span className="truncate">{topic.video_url}</span>
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(topic)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(topic)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTopic ? al.editTitle : al.addTitle}</DialogTitle>
            <DialogDescription>{editingTopic ? al.editDesc : al.addDesc}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{al.lessonNameLabel}</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={al.lessonNamePlaceholder} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{al.gradeLabel}</Label>
                <Select value={form.lesson_id} onValueChange={v => setForm(f => ({ ...f, lesson_id: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GRADE_KEYS.map(k => (
                      <SelectItem key={k} value={k}>{gradeLabels[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{al.semesterLabel}</Label>
                <Select value={form.semester} onValueChange={v => setForm(f => ({ ...f, semester: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{al.semester1}</SelectItem>
                    <SelectItem value="2">{al.semester2}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>{al.youtubeLink}</Label>
              <Input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder={al.youtubePlaceholder} />
              {thumbnailPreview && (
                <div className="mt-2 rounded-md overflow-hidden border w-32">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-auto" />
                </div>
              )}
            </div>

            <div>
              <Label>{al.durationLabel}</Label>
              <Input type="number" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} min={1} />
            </div>

            <div>
              <Label>{al.descriptionLabel}</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder={al.descriptionPlaceholder} rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{al.cancel}</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingTopic ? al.update : al.addButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{al.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {al.deleteDesc} "<strong>{deleteTarget?.title}</strong>"{al.deleteWarning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{al.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {al.deleteButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LessonsManagementTab;

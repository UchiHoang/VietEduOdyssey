import { Bell, Volume2, Moon, Globe, Clock, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useStudyTimeLimit } from "@/hooks/useStudyTimeLimit";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSound } from "@/contexts/SoundContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SettingsTab = () => {
  const { t, language, setLanguage } = useLanguage();
  const { soundEnabled, setSoundEnabled, playSound } = useSound();
  const { settings, todayTimeSpent, dailyLimit, updateSettings, loading } = useStudyTimeLimit();
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [limitMinutes, setLimitMinutes] = useState<number>(60);

  useEffect(() => {
    if (settings) {
      setLimitEnabled(settings.limit_enabled);
      setLimitMinutes(settings.daily_limit_minutes ?? 60);
    }
  }, [settings]);

  const handleToggleLimit = async (checked: boolean) => {
    setLimitEnabled(checked);
    await updateSettings(checked, limitMinutes);
  };

  const handleLimitChange = async (value: string) => {
    const mins = parseInt(value);
    setLimitMinutes(mins);
    await updateSettings(limitEnabled, mins);
  };

  const progressPercent = dailyLimit ? Math.min(100, (todayTimeSpent / dailyLimit) * 100) : 0;

  const timeOptions = [
    { mins: 30, emoji: "⏱️", label: t.settingsTab.time30m },
    { mins: 60, emoji: "🕐", label: t.settingsTab.time1h },
    { mins: 90, emoji: "🕜", label: t.settingsTab.time1h30 },
    { mins: 120, emoji: "🕑", label: t.settingsTab.time2h },
  ];

  return (
    <div className="space-y-6">
      {/* Time Control Card */}
      <Card className="p-6 border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl">{t.settingsTab.healthClock}</h3>
            <p className="text-sm text-muted-foreground">{t.settingsTab.healthClockDesc}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">{t.settingsTab.enableTimeLimit}</Label>
              <p className="text-sm text-muted-foreground">{t.settingsTab.enableTimeLimitDesc}</p>
            </div>
            <Switch checked={limitEnabled} onCheckedChange={handleToggleLimit} disabled={loading} />
          </div>

          {limitEnabled && (
            <>
              <div className="bg-muted/50 rounded-xl p-4">
                <Label className="font-medium text-sm mb-3 block">{t.settingsTab.maxTimePerDay}</Label>
                <div className="flex gap-2">
                  {timeOptions.map(({ mins, emoji, label }) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleLimitChange(String(mins))}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all cursor-pointer ${
                        limitMinutes === mins
                          ? "border-primary bg-primary/10 shadow-sm scale-105"
                          : "border-transparent bg-background hover:border-primary/20 hover:bg-primary/5"
                      }`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className={`text-sm font-semibold ${limitMinutes === mins ? "text-primary" : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.settingsTab.todayLearned}</span>
                  <span className="font-semibold">
                    {todayTimeSpent}/{dailyLimit ?? limitMinutes} {t.settingsTab.minutes}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
                {progressPercent >= 80 && progressPercent < 100 && (
                  <p className="text-xs text-amber-600">{t.settingsTab.almostDone}</p>
                )}
                {progressPercent >= 100 && (
                  <p className="text-xs text-red-500">{t.settingsTab.limitReached}</p>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Original settings */}
      <Card className="p-6">
        <h3 className="font-bold text-xl mb-6">{t.settingsTab.appSettings}</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="font-medium">{t.settingsTab.notifications}</Label>
                <p className="text-sm text-muted-foreground">{t.settingsTab.notificationsDesc}</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Volume2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <Label className="font-medium">{t.settingsTab.sound}</Label>
                <p className="text-sm text-muted-foreground">{t.settingsTab.soundDesc}</p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={(checked) => {
                setSoundEnabled(checked);
                if (checked) playSound("click");
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Moon className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <Label className="font-medium">{t.settingsTab.darkMode}</Label>
                <p className="text-sm text-muted-foreground">{t.settingsTab.darkModeDesc}</p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <Label className="font-medium">{t.settingsTab.language}</Label>
                <p className="text-sm text-muted-foreground">{t.settingsTab.languageDesc}</p>
              </div>
            </div>
            <Select value={language} onValueChange={(v) => setLanguage(v as "vi" | "en")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t.settingsTab.selectLanguage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Password & Security Section */}
      <PasswordSecuritySection />

      <Card className="p-6">
        <h3 className="font-bold text-xl mb-4">{t.settingsTab.aboutApp}</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>{t.settingsTab.version}</p>
          <p>{t.settingsTab.copyright}</p>
          <div className="flex gap-4">
            <a href="#" className="text-primary hover:underline">{t.settingsTab.termsOfService}</a>
            <a href="#" className="text-primary hover:underline">{t.settingsTab.privacyPolicy}</a>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PasswordField = ({ id, value, onChange, show, onToggle, placeholder, extraClass }: {
  id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean; onToggle: () => void; placeholder: string; extraClass?: string;
}) => (
  <div className="relative">
    <Input id={id} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} className={`pr-10 ${extraClass || ""}`} />
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
);

const PasswordSecuritySection = () => {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { label: t.passwordTab.minChars, met: newPassword.length >= 8 },
    { label: t.passwordTab.hasUppercase, met: /[A-Z]/.test(newPassword) },
    { label: t.passwordTab.hasLowercase, met: /[a-z]/.test(newPassword) },
    { label: t.passwordTab.hasNumber, met: /[0-9]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleChangePassword = async () => {
    if (!allRequirementsMet) {
      toast({ title: t.passwordTab.error, description: t.passwordTab.requirementNotMet, variant: "destructive" });
      return;
    }
    if (!passwordsMatch) {
      toast({ title: t.passwordTab.error, description: t.passwordTab.mismatchError, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: t.passwordTab.success, description: t.passwordTab.successMsg });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({ title: t.passwordTab.error, description: error.message || t.passwordTab.cannotChange, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl">{t.passwordTab.title}</h3>
            <p className="text-sm text-muted-foreground">{t.passwordTab.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">{t.passwordTab.currentPassword}</Label>
            <PasswordField id="current" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} placeholder={t.passwordTab.currentPasswordPlaceholder} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new">{t.passwordTab.newPassword}</Label>
            <PasswordField id="new" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} show={showNew} onToggle={() => setShowNew(!showNew)} placeholder={t.passwordTab.newPasswordPlaceholder} />
          </div>

          {newPassword.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-1.5">
              <p className="text-xs font-medium mb-1">{t.passwordTab.requirements}</p>
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {req.met ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span className={req.met ? "text-green-600" : "text-muted-foreground"}>{req.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirm">{t.passwordTab.confirmPassword}</Label>
            <PasswordField
              id="confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              placeholder={t.passwordTab.confirmPasswordPlaceholder}
              extraClass={confirmPassword.length > 0 ? (passwordsMatch ? "border-green-500 focus-visible:ring-green-500" : "border-destructive focus-visible:ring-destructive") : ""}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-destructive">{t.passwordTab.passwordMismatch}</p>
            )}
          </div>

          <Button onClick={handleChangePassword} disabled={loading || !allRequirementsMet || !passwordsMatch} className="w-full mt-2">
            {loading ? t.passwordTab.processing : t.passwordTab.changePassword}
          </Button>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 h-fit">
        <h3 className="font-bold text-base text-blue-700 dark:text-blue-300 mb-3">{t.passwordTab.securityTips}</h3>
        <ul className="space-y-2 text-sm text-blue-600/80 dark:text-blue-400/80">
          <li>• {t.passwordTab.tip1}</li>
          <li>• {t.passwordTab.tip2}</li>
          <li>• {t.passwordTab.tip3}</li>
          <li>• {t.passwordTab.tip4}</li>
        </ul>
      </Card>
    </div>
  );
};

export default SettingsTab;

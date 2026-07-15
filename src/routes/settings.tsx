import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Save, Upload, Sun, Moon, Bell } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/lib/hooks";
import { DEFAULT_SETTINGS } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Bright Minds Tuition" },
      { name: "description", content: "Configure institute details, theme, notifications and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettingsState] = useSettings();
  const [draft, setDraft] = useState(settings);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    setSettingsState(draft);
    toast.success("Settings saved");
  };

  const reset = () => {
    setDraft(DEFAULT_SETTINGS);
    setSettingsState(DEFAULT_SETTINGS);
    toast.info("Reset to defaults");
  };

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setDraft({ ...draft, logo: r.result as string });
    r.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Institute details, appearance, and preferences."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={reset}>Reset</Button>
            <Button className="rounded-xl gradient-brand shadow-glow" onClick={save}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Institute Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Fld label="Institute Name">
              <Input value={draft.instituteName} onChange={(e) => setDraft({ ...draft, instituteName: e.target.value })} />
            </Fld>
            <Fld label="Teacher / Owner Name">
              <Input value={draft.teacherName} onChange={(e) => setDraft({ ...draft, teacherName: e.target.value })} />
            </Fld>
            <Fld label="Contact Number">
              <Input value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} />
            </Fld>
            <Fld label="Language">
              <Select value={draft.language} onValueChange={(v) => setDraft({ ...draft, language: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </Fld>
            <div className="md:col-span-2">
              <Fld label="Address">
                <Textarea rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
              </Fld>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold">WhatsApp Automation Settings</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Fld label="WhatsApp Provider">
              <Select
                value={draft.whatsappProvider || "manual"}
                onValueChange={(v) => setDraft({ ...draft, whatsappProvider: v as any })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">WhatsApp Redirect wa.me Link (Free, Manual)</SelectItem>
                  <SelectItem value="ultramsg">UltraMsg Gateway API (Automated)</SelectItem>
                  <SelectItem value="twilio">Twilio WhatsApp Business API (Automated)</SelectItem>
                </SelectContent>
              </Select>
            </Fld>

            {draft.whatsappProvider === "ultramsg" && (
              <>
                <Fld label="UltraMsg Instance ID">
                  <Input
                    placeholder="e.g. instance12345"
                    value={draft.whatsappInstanceId || ""}
                    onChange={(e) => setDraft({ ...draft, whatsappInstanceId: e.target.value })}
                  />
                </Fld>
                <Fld label="UltraMsg API Token">
                  <Input
                    placeholder="Enter your UltraMsg Token"
                    value={draft.whatsappApiKey || ""}
                    onChange={(e) => setDraft({ ...draft, whatsappApiKey: e.target.value })}
                  />
                </Fld>
              </>
            )}

            {draft.whatsappProvider === "twilio" && (
              <>
                <Fld label="Twilio Account SID">
                  <Input
                    placeholder="Enter Twilio Account SID"
                    value={draft.whatsappInstanceId || ""}
                    onChange={(e) => setDraft({ ...draft, whatsappInstanceId: e.target.value })}
                  />
                </Fld>
                <Fld label="Twilio Auth Token">
                  <Input
                    placeholder="Enter Twilio Auth Token"
                    value={draft.whatsappApiKey || ""}
                    onChange={(e) => setDraft({ ...draft, whatsappApiKey: e.target.value })}
                  />
                </Fld>
                <Fld label="Twilio Sender Number (WhatsApp)">
                  <Input
                    placeholder="e.g. +14155238886"
                    value={draft.whatsappSenderNumber || ""}
                    onChange={(e) => setDraft({ ...draft, whatsappSenderNumber: e.target.value })}
                  />
                </Fld>
              </>
            )}

            <div className="md:col-span-2">
              <Fld label="Present Alert Template">
                <Textarea
                  rows={2}
                  value={draft.whatsappTemplatePresent || ""}
                  onChange={(e) => setDraft({ ...draft, whatsappTemplatePresent: e.target.value })}
                  placeholder="Use [student_name] as placeholder"
                />
              </Fld>
            </div>

            <div className="md:col-span-2">
              <Fld label="Absent Alert Template">
                <Textarea
                  rows={2}
                  value={draft.whatsappTemplateAbsent || ""}
                  onChange={(e) => setDraft({ ...draft, whatsappTemplateAbsent: e.target.value })}
                  placeholder="Use [student_name] as placeholder"
                />
              </Fld>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 font-semibold">Logo</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-2xl gradient-brand text-3xl font-black text-white shadow-glow">
              {draft.logo ? <img src={draft.logo} alt="logo" className="h-full w-full object-cover" /> : draft.instituteName.slice(0, 2).toUpperCase()}
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => fileRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Upload Logo
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
            {draft.logo && (
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDraft({ ...draft, logo: undefined })}>
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-3">
          <h3 className="mb-4 font-semibold">Appearance & Preferences</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl border border-border/60 p-4">
              <button
                onClick={() => setDraft({ ...draft, theme: "light" })}
                className={cn(
                  "flex-1 rounded-lg border p-3 text-sm transition",
                  draft.theme === "light" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent",
                )}
              >
                <Sun className="mx-auto mb-1 h-5 w-5" />
                Light
              </button>
              <button
                onClick={() => setDraft({ ...draft, theme: "dark" })}
                className={cn(
                  "flex-1 rounded-lg border p-3 text-sm transition",
                  draft.theme === "dark" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent",
                )}
              >
                <Moon className="mx-auto mb-1 h-5 w-5" />
                Dark
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg gradient-brand text-white">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-xs text-muted-foreground">Toast messages for actions</div>
                </div>
              </div>
              <Switch
                checked={draft.notifications}
                onCheckedChange={(v) => setDraft({ ...draft, notifications: v })}
              />
            </div>

            <div className="rounded-xl border border-border/60 p-4">
              <div className="font-medium">Data</div>
              <p className="mt-1 text-xs text-muted-foreground">All data is stored locally in your browser. Clearing site data removes it.</p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-3 rounded-lg"
                onClick={() => {
                  if (confirm("Clear ALL local data (students, attendance, fees, materials)?")) {
                    localStorage.clear();
                    toast.success("All data cleared. Reloading…");
                    setTimeout(() => window.location.reload(), 700);
                  }
                }}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

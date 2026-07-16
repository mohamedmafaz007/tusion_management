import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Save, Upload, Sun, Moon, Bell, CheckCircle, Loader2 } from "lucide-react";
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
import { getBaileysStatus, connectBaileys, disconnectBaileys } from "@/lib/db";

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

  const [baileysStatus, setBaileysStatus] = useState<"disconnected" | "connecting" | "qrcode" | "connected">("disconnected");
  const [baileysQr, setBaileysQr] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Sync draft when settings load
  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  // Poll Baileys status when provider is set to "baileys"
  useEffect(() => {
    if (draft.whatsappProvider !== "baileys") return;

    const checkStatus = async () => {
      try {
        const res = await getBaileysStatus();
        setBaileysStatus(res.status as any);
        setBaileysQr(res.qr || "");
      } catch (err) {
        console.error("Failed to check Baileys status:", err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2500);
    return () => clearInterval(interval);
  }, [draft.whatsappProvider]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectBaileys();
      toast.info("Initializing WhatsApp connection...");
      const res = await getBaileysStatus();
      setBaileysStatus(res.status as any);
      setBaileysQr(res.qr || "");
    } catch (err: any) {
      toast.error(`Connection failed: ${err.message || err}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectBaileys();
      setBaileysStatus("disconnected");
      setBaileysQr("");
      toast.success("Disconnected from WhatsApp and logged out.");
    } catch (err: any) {
      toast.error(`Disconnect failed: ${err.message || err}`);
    } finally {
      setIsDisconnecting(false);
    }
  };

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
                  <SelectItem value="baileys">Direct WhatsApp (Baileys QR Web - Free, Automated)</SelectItem>
                  <SelectItem value="ultramsg">UltraMsg Gateway API (Automated)</SelectItem>
                  <SelectItem value="twilio">Twilio WhatsApp Business API (Automated)</SelectItem>
                </SelectContent>
              </Select>
            </Fld>

            {draft.whatsappProvider === "baileys" && (
              <div className="md:col-span-2 border border-border/60 rounded-2xl p-5 bg-secondary/15 space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div>
                    <h4 className="font-semibold text-sm">Direct WhatsApp pairing</h4>
                    <p className="text-xs text-muted-foreground">Link your own WhatsApp account directly to automate receipts and messages for free.</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-semibold capitalize",
                    baileysStatus === "connected" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" :
                    baileysStatus === "qrcode" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse" :
                    baileysStatus === "connecting" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 animate-pulse" :
                    "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                  )}>
                    {baileysStatus}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
                  <div className="flex flex-col items-center justify-center p-3 border border-dashed border-border/80 rounded-2xl bg-background/50 w-[200px] h-[200px] shrink-0 relative shadow-inner">
                    {baileysStatus === "qrcode" && baileysQr ? (
                      <img src={baileysQr} alt="Scan QR Code" className="w-[170px] h-[170px]" />
                    ) : baileysStatus === "connected" ? (
                      <div className="text-center space-y-2">
                        <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                        <span className="text-emerald-500 font-bold text-xs block">Pairing Successful</span>
                        <span className="text-[10px] text-muted-foreground block leading-tight">Your account is connected</span>
                      </div>
                    ) : baileysStatus === "connecting" ? (
                      <div className="text-center space-y-2">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                        <span className="text-muted-foreground text-[11px] block">Waiting for handshake...</span>
                      </div>
                    ) : (
                      <div className="text-center p-2 space-y-3">
                        <span className="text-muted-foreground text-xs block">No active connection</span>
                        <Button size="sm" className="rounded-lg h-8" onClick={handleConnect} disabled={isConnecting}>
                          {isConnecting ? (
                            <>
                              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                              Starting...
                            </>
                          ) : "Start Connection"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <h5 className="text-xs font-semibold text-muted-foreground">Instructions</h5>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside pl-1 leading-normal">
                        <li>Select this option and save settings.</li>
                        <li>Click <strong>Start Connection</strong> to retrieve the pairing code.</li>
                        <li>Open WhatsApp on your mobile phone.</li>
                        <li>Go to <strong>Settings</strong> &gt; <strong>Linked Devices</strong> &gt; <strong>Link a Device</strong>.</li>
                        <li>Scan the QR code displayed on this screen.</li>
                      </ol>
                    </div>

                    <div className="flex gap-2">
                      {baileysStatus !== "disconnected" && (
                        <Button size="sm" variant="destructive" className="rounded-lg" onClick={handleDisconnect} disabled={isDisconnecting}>
                          {isDisconnecting ? (
                            <>
                              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                              Logging out...
                            </>
                          ) : "Disconnect / Logout"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            <div className="md:col-span-2">
              <Fld label="Welcome Alert Template">
                <Textarea
                  rows={2}
                  value={draft.whatsappTemplateWelcome || ""}
                  onChange={(e) => setDraft({ ...draft, whatsappTemplateWelcome: e.target.value })}
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

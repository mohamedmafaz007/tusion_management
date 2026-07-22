import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Lock, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { loginAdmin, sendPasswordResetOtp, verifyOtpAndResetPassword } from "@/lib/db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Vishwa Tuition Center" },
      { name: "description", content: "Authenticate to access the tuition management dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [forgotOpen, setForgotOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1);
  const [otpCode, setOtpCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const handleOpenForgot = () => {
    setOtpStep(1);
    setOtpCode("");
    setNewPass("");
    setConfirmPass("");
    setForgotOpen(true);
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await sendPasswordResetOtp();
      if (res.success) {
        if (res.loggedToConsole) {
          toast.success("OTP generated! (Check server console terminal logs for the code).");
        } else {
          toast.success("OTP code sent to vishwatutioncenter@gmail.com!");
        }
        setOtpStep(2);
      } else {
        toast.error(res.error || "Failed to generate OTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP code");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }
    if (!newPass.trim()) {
      toast.error("Password cannot be empty");
      return;
    }
    if (newPass.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    setOtpVerifying(true);
    try {
      const res = await verifyOtpAndResetPassword({ data: { otp: otpCode, newPassword: newPass.trim() } });
      if (res.success) {
        localStorage.setItem("tms.admin_password", newPass.trim());
        localStorage.setItem("tms.auth_token", res.token || "vishwa_admin_session_token_123");
        toast.success("Password updated successfully! Welcome to dashboard.");
        setForgotOpen(false);
        window.location.href = "/";
      } else {
        toast.error(res.error || "Verification failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputPassword = password.trim();
    if (!inputPassword) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);
    try {
      // Check local password first (client-side)
      const localPassword = localStorage.getItem("tms.admin_password") || "vishwa@123";
      if (inputPassword === localPassword) {
        localStorage.setItem("tms.auth_token", "vishwa_admin_session_token_123");
        toast.success("Successfully logged in!");
        window.location.href = "/";
        return;
      }

      // Check server password (if configured differently)
      const res = await loginAdmin({ data: inputPassword });
      if (res.success) {
        localStorage.setItem("tms.auth_token", res.token);
        toast.success("Successfully logged in!");
        window.location.href = "/";
      } else {
        toast.error(res.error || "Incorrect password");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-glow border border-border/60">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white shadow-glow mb-4">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight gradient-text">Vishwa Tuition Center</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Admin Portal Authentication</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl pl-10 border-border/60 bg-secondary/30 focus-visible:bg-card focus-visible:ring-1"
                disabled={loading}
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={handleOpenForgot}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl gradient-brand text-white font-semibold shadow-glow mt-6"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center justify-center">
                <span>Login</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          Default password is <strong>vishwa@123</strong> (unless updated in settings).
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-md rounded-2xl animate-in zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <KeyRound className="h-5.5 w-5.5 text-primary" />
              Reset Admin Password
            </DialogTitle>
            <DialogDescription>
              We will send a 6-digit OTP code to the administrator email address.
            </DialogDescription>
          </DialogHeader>

          {otpStep === 1 ? (
            <div className="space-y-4 py-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary leading-normal">
                An OTP (One-Time Password) will be sent to the registered email:
                <div className="font-bold mt-1 text-base text-foreground font-mono">vishwatutioncenter@gmail.com</div>
              </div>
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full h-11 rounded-xl gradient-brand text-white font-semibold shadow-glow"
              >
                {otpLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Send OTP Code"
                )}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleVerifyAndReset} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                <Input
                  id="otp"
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="rounded-xl border-border/60 font-mono tracking-[0.3em] text-center text-lg h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPass">New Password</Label>
                <Input
                  id="newPass"
                  type="password"
                  placeholder="••••••••"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="rounded-xl border-border/60 h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPass">Confirm Password</Label>
                <Input
                  id="confirmPass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="rounded-xl border-border/60 h-11"
                  required
                />
              </div>

              <DialogFooter className="pt-4 gap-2 flex flex-col-reverse sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOtpStep(1)}
                  className="rounded-xl h-11"
                  disabled={otpVerifying}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={otpVerifying}
                  className="rounded-xl gradient-brand h-11 flex-1 text-white font-semibold"
                >
                  {otpVerifying ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Reset & Login"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
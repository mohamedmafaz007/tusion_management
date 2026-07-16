import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CalendarCheck,
  BarChart3,
  Wallet,
  BookOpen,
  Settings,
  Bell,
  Search,
  Menu,
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/lib/hooks";
import { toast } from "sonner";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/students/new", label: "Registration", icon: UserPlus },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/fees", label: "Fees", icon: Wallet },
  { to: "/materials", label: "Materials", icon: BookOpen },
  { to: "/messages", label: "Message Logs", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [settings] = useSettings();

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <Link to="/" className="mb-4 flex items-center gap-3 px-2" onClick={onNavigate}>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-brand shadow-glow">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold leading-tight">{settings.instituteName}</div>
          <div className="text-[11px] text-muted-foreground">Admin Dashboard</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "gradient-brand text-white shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-0.5",
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="glass rounded-2xl p-4 text-xs">
        <div className="font-semibold gradient-text">Need help?</div>
        <p className="mt-1 text-muted-foreground">Check the docs for tips on managing your institute.</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useSettings();
  const [open, setOpen] = useState(false);

  // Theme sync
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [settings.theme]);

  const toggleTheme = () => {
    setSettingsState({ ...settings, theme: settings.theme === "dark" ? "light" : "dark" });
    toast.success(`Switched to ${settings.theme === "dark" ? "light" : "dark"} mode`);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar/60 backdrop-blur-xl lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SidebarNav onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students, materials, fees…"
                className="h-10 rounded-xl border-border/60 bg-secondary/60 pl-9 transition-all focus-visible:bg-card"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = (e.target as HTMLInputElement).value;
                    if (q) window.location.href = `/students?q=${encodeURIComponent(q)}`;
                  }
                }}
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {settings.theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="flex-col items-start gap-1 cursor-pointer">
                    <Link to="/students">
                      <div className="font-medium">New registration</div>
                      <div className="text-xs text-muted-foreground">A new student joined today.</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex-col items-start gap-1 cursor-pointer">
                    <Link to="/fees">
                      <div className="font-medium">Fee reminder</div>
                      <div className="text-xs text-muted-foreground">3 students have pending fees.</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex-col items-start gap-1 cursor-pointer">
                    <Link to="/reports">
                      <div className="font-medium">Attendance below 75%</div>
                      <div className="text-xs text-muted-foreground">2 students need attention.</div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 transition-colors hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gradient-brand text-xs font-bold text-white">
                        {settings.teacherName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline">{settings.teacherName.split(" ")[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-medium">{settings.teacherName}</div>
                    <div className="text-xs font-normal text-muted-foreground">{settings.contact}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Signed out (demo)")}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">{children}</main>

        <footer className="border-t border-border/60 px-6 py-4 text-center text-xs text-muted-foreground">
          <Badge variant="secondary" className="mr-2">v1.0</Badge>
          © {new Date().getFullYear()} {settings.instituteName} — Premium Tuition Suite
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl">
          <span className="gradient-text">{title}</span>
        </h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

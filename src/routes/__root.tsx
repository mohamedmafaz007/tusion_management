import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function NotFoundComponent() {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass max-w-md rounded-3xl p-10 text-center">
          <h1 className="gradient-text text-7xl font-black">404</h1>
          <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-90"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl gradient-brand px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vishwa Tuition Center — Tuition Management Dashboard" },
      {
        name: "description",
        content:
          "Premium tuition management dashboard for tracking students, attendance, fees, and study materials with a modern glassmorphism UI.",
      },
      { name: "author", content: "Vishwa Tuition Center" },
      { property: "og:title", content: "Vishwa Tuition Center — Tuition Management Dashboard" },
      {
        property: "og:description",
        content: "Manage students, attendance, fees and study materials in one premium admin dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/tution-logo.png", type: "image/png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading && (
        <>
          {/* Glowing Top Progress Bar */}
          <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-secondary/30 overflow-hidden">
            <div 
              className="h-full bg-primary gradient-brand shadow-[0_0_8px_rgba(99,102,241,0.8)]"
              style={{
                width: "100%",
                animation: "loading-bar 2s infinite ease-in-out",
              }}
            />
            <style>{`
              @keyframes loading-bar {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(-30%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>

          {/* Centered Glassmorphic Loading Indicator */}
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/10 backdrop-blur-[1px] animate-in fade-in duration-200">
            <div className="glass flex items-center gap-3 rounded-2xl border border-border/60 px-5 py-3 shadow-glow animate-pulse">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <span className="text-xs font-semibold text-foreground">Fetching database records...</span>
            </div>
          </div>
        </>
      )}

      <div className={cn("transition-all duration-300", isLoading && "opacity-60 pointer-events-none")}>
        <AppShell>
          <Outlet />
        </AppShell>
      </div>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

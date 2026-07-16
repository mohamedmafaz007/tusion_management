import { createFileRoute } from "@tanstack/react-router";
import { checkAndSendBirthdayWishes, sendMonthlyFeeReminders } from "@/lib/db";

export const Route = createFileRoute("/api/cron")({
  server: {
    handlers: {
      GET: async () => {
        console.log("[Cron] Starting automated daily message checks...");
        try {
          // 1. Deliver today's birthday wishes
          const birthdayRes = await checkAndSendBirthdayWishes();

          // 2. On the 1st day of the month, dispatch fee reminders automatically
          let feeRes: any = { sent: 0, failed: 0, total: 0 };
          const today = new Date();
          if (today.getDate() === 1) {
            const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
            feeRes = await sendMonthlyFeeReminders({ data: { month: currentMonth } });
          }

          return new Response(
            JSON.stringify({
              success: true,
              timestamp: new Date().toISOString(),
              birthdays: {
                found: birthdayRes.birthdaysFound || 0,
                sent: birthdayRes.sent || 0,
                failed: birthdayRes.failed || 0,
              },
              feeReminders: {
                sent: feeRes.sent || 0,
                failed: feeRes.failed || 0,
                totalScan: feeRes.total || 0,
              },
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: any) {
          console.error("[Cron] Auto-campaign failed:", err);
          return new Response(
            JSON.stringify({
              success: false,
              error: err.message || String(err),
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});

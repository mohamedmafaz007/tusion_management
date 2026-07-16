import { execSync } from "child_process";

const isVercel = process.env.VERCEL === "1" || process.env.NOW_BUILDER === "1";
const preset = process.env.NITRO_PRESET || (isVercel ? "vercel" : "node-server");

console.log(`\n[Build Script] Platform detection: Vercel = ${isVercel}`);
console.log(`[Build Script] Compiling with NITRO_PRESET = ${preset}\n`);

try {
  execSync("vite build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NITRO_PRESET: preset,
    },
  });
} catch (err) {
  console.error("[Build Script] Compilation failed.");
  process.exit(1);
}

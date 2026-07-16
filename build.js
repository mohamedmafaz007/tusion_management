import { execSync } from "child_process";
import fs from "fs";
import path from "path";

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

console.log("[Build Script] Copying pdfkit font assets...");
const pdfkitDataSrc = path.join(process.cwd(), "node_modules", "pdfkit", "js", "data");
const pdfkitDataDest = path.join(process.cwd(), ".output", "server", "data");

try {
  if (fs.existsSync(pdfkitDataSrc)) {
    fs.cpSync(pdfkitDataSrc, pdfkitDataDest, { recursive: true });
    console.log("[Build Script] Font assets copied successfully to .output/server/data.");
  } else {
    console.warn(`[Build Script] Warning: pdfkit data directory not found at ${pdfkitDataSrc}`);
  }
} catch (copyErr) {
  console.error("[Build Script] Failed to copy pdfkit font assets:", copyErr);
}


// Start the Tauri CLI for Android with standard SDK/NDK/Java environment detection.
// Override ANDROID_HOME, NDK_HOME, or JAVA_HOME if installed in custom locations.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const home = process.env.ANDROID_HOME ?? join(homedir(), "Android", "Sdk");
const ndkMap = join(home, "ndk");
const ndk = process.env.NDK_HOME ?? (existsSync(ndkMap) ? join(ndkMap, readdirSync(ndkMap).sort().at(-1)) : undefined);
let java = process.env.JAVA_HOME;
if (!java && existsSync("/usr/bin/java")) java = dirname(dirname(realpathSync("/usr/bin/java")));

const env = { ...process.env, ANDROID_HOME: home, ANDROID_SDK_ROOT: home, ...(ndk ? { NDK_HOME: ndk } : {}), ...(java ? { JAVA_HOME: java } : {}) };
env.PATH = [join(home, "platform-tools"), join(home, "emulator"), env.PATH].join(":");

const [soort, ...rest] = process.argv.slice(2);
const args = {
  // Emulator or connected device with live reload of the web app.
  dev: ["android", "dev"],
  // Universal debug APK (all ABIs), signed with the default Android debug key.
  build: ["android", "build", "--debug", "--apk"],
  // Smaller arm64 release APK for testing on a physical phone (debug-signed).
  telefoon: ["android", "build", "--apk", "--target", "aarch64"],
  // Release AAB (arm64, armv7, x86_64). Set LEAPSTONE_UPLOAD_KEYSTORE and
  // LEAPSTONE_UPLOAD_KEYSTORE_PASSWORD (plus optional LEAPSTONE_UPLOAD_KEY_ALIAS) to sign.
  winkel: ["android", "build", "--aab", "--target", "aarch64", "armv7", "x86_64"],
  tauri: [],
}[soort];
if (!args) {
  console.error("Usage: node scripts/android.mjs dev|build|telefoon|winkel|tauri [options]");
  process.exit(2);
}

if (soort === "telefoon") env.LEAPSTONE_TESTBUILD = "1";
if (soort === "winkel") {
  if (!env.LEAPSTONE_UPLOAD_KEYSTORE || !env.LEAPSTONE_UPLOAD_KEYSTORE_PASSWORD) {
    console.error("Missing LEAPSTONE_UPLOAD_KEYSTORE or LEAPSTONE_UPLOAD_KEYSTORE_PASSWORD for signed release AAB.");
    process.exit(1);
  }
  env.LEAPSTONE_UPLOAD_KEY_ALIAS ??= "upload";
}

const status = spawnSync("npx", ["tauri", ...args, ...rest], { cwd: root, env, stdio: "inherit" }).status ?? 1;
process.exit(status);

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const rootDir = process.cwd();
    const frontendDir = path.join(rootDir, "frontend");

    // 1. Create the frontend directory
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }

    // 2. Define list of items to move
    const itemsToMove = [
      "src",
      "public",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "next.config.ts",
      "eslint.config.mjs",
      "postcss.config.mjs",
      "README.md",
      "next-env.d.ts"
    ];

    const moved: string[] = [];
    const failed: string[] = [];

    for (const item of itemsToMove) {
      const srcPath = path.join(rootDir, item);
      const destPath = path.join(frontendDir, item);

      if (fs.existsSync(srcPath)) {
        try {
          fs.renameSync(srcPath, destPath);
          moved.push(item);
        } catch (e: any) {
          failed.push(`${item} (${e.message})`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Decoupled folders migration completed successfully.",
      moved,
      failed,
      instructions: "Now stop your dev server, manually move 'node_modules' and '.next' into the 'frontend/' folder, and restart the dev server inside the 'frontend/' directory."
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

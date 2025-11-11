// CMS Config API Route – Sokol Skuhrov
// Serves the CMS config.yml file at /api/admin/config
// This route is used because Next.js App Router doesn't support dots in route segments
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const configPath = join(process.cwd(), "public", "admin", "config.yml");
    const config = await readFile(configPath, "utf8");
    return new NextResponse(config, {
      headers: {
        "Content-Type": "text/yaml; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(
      `Error loading config: ${message}`,
      { status: 500 }
    );
  }
}


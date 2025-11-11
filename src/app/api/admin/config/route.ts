// CMS Config API Route – Sokol Skuhrov
// Serves the CMS config.yml file at /api/admin/config with dynamic base_url
// This route is used because Next.js App Router doesn't support dots in route segments
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const configPath = join(process.cwd(), "public", "admin", "config.yml");
    let config = await readFile(configPath, "utf8");
    
    // Dynamically set base_url based on the request URL
    const baseUrl = process.env.NODE_ENV === "production" 
      ? request.nextUrl.origin
      : "http://localhost:3000";
    
    // Replace the base_url in the config
    config = config.replace(
      /base_url:\s*.+/,
      `base_url: ${baseUrl}`
    );
    
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


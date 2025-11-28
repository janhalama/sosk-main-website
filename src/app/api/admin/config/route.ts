// CMS Config API Route – Sokol Skuhrov
// Serves the CMS config.yml file at /api/admin/config with dynamic base_url
// This route is used because Next.js App Router doesn't support dots in route segments
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const configPath = join(process.cwd(), "public", "admin", "config.yml");
    let config = await readFile(configPath, "utf8");
    
    const baseUrl = getSiteUrl();
    
    // Replace the base_url in the config
    // Match: base_url: <any value> (handles comments on previous line and preserves indentation)
    config = config.replace(
      /^(\s*)base_url:\s*.+$/m,
      (match, indent) => `${indent}base_url: ${baseUrl}`
    );
    
    // Verify replacement worked (fallback if regex didn't match)
    if (!config.includes(`base_url: ${baseUrl}`)) {
      // Fallback: replace any base_url line
      config = config.replace(
        /base_url:\s*.+/,
        `base_url: ${baseUrl}`
      );
    }
    
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


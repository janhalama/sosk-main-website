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
    
    // Extract default production URL from config file as fallback
    const defaultUrlMatch = config.match(/base_url:\s*(.+)/);
    const defaultProductionUrl = defaultUrlMatch?.[1]?.trim() || "https://sosk-main-website.vercel.app";
    
    // Dynamically set base_url based on environment
    // Priority: NEXT_PUBLIC_SITE_URL > VERCEL_PROJECT_PRODUCTION_URL > VERCEL_URL > request origin > default production > localhost
    const requestOrigin = request.nextUrl.origin;
    let baseUrl: string;
    
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      // Explicit production URL (highest priority)
      baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    } else if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      // Vercel production URL (for production deployments)
      baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    } else if (process.env.VERCEL_URL) {
      // Vercel deployment URL (preview or production)
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (requestOrigin && !requestOrigin.includes("localhost")) {
      // Use request origin if it's not localhost (production or preview)
      baseUrl = requestOrigin;
    } else if (requestOrigin.includes("localhost")) {
      // Development: use localhost
      baseUrl = "http://localhost:3000";
    } else {
      // Fallback to production URL from config
      baseUrl = defaultProductionUrl;
    }
    
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


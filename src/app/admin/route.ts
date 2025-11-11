// CMS Admin Route Handler – Sokol Skuhrov
// Serves the CMS admin HTML at /admin
// Reads the HTML file from public/admin/index.html and returns it
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const htmlPath = join(process.cwd(), "public", "admin", "index.html");
    const html = await readFile(htmlPath, "utf8");
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(
      `Error loading admin page: ${message}`,
      { status: 500 }
    );
  }
}


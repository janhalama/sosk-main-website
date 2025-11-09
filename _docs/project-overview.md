# Project Overview – Sokol Skuhrov Website Migration

## Purpose

The goal of this project is to migrate the existing website [sokolskuhrov.cz](https://www.sokolskuhrov.cz) from WordPress to a **static, low-maintenance site hosted on Vercel**.  
The main motivation is **cost optimization**, **speed**, and **simplicity of content management**.

The new site must:
- Keep the same general structure, navigation, and visual identity.
- Allow both technical and non-technical maintainers to update content easily.
- Require minimal ongoing costs and maintenance.

---

## Core Idea

The new website will be a **static site** generated from Markdown content stored in a **GitHub repository**.

- Every page and news post lives as a Markdown file inside the repo.
- The website is rebuilt automatically whenever content changes (via Vercel).
- A lightweight web admin (Decap CMS) provides a simple editing interface for non-technical users.

This approach replaces the WordPress database and plugins with **a git-based content workflow**:
- Technical users can edit Markdown files directly and commit.
- Non-technical users can edit via the `/admin` web interface without touching Git or code.

---

## User Experience (Visitors)

- Visitors see a **fast, static website**.
- The structure mirrors the current site:
  - Domů
  - Aktuality (News)
  - Činnost
  - Fotogalerie
  - Sponzoři
  - Kontakty
- News posts appear in reverse chronological order.
- Gallery entries may link to external albums (e.g., Rajče).
- Each page is static and loads instantly from CDN.

There are **no login areas or interactive features** for the public.

---

## Admin Experience (Editors)

### For technical editors
- Can edit content directly in Markdown within the GitHub repository.
- Can use pull requests for review and approval.

### For non-technical editors (BFU)
- Access `/admin` on the website.
- Log in using a GitHub account.
- Edit content through a simple form-based UI:
  - Title, date, image, and body text.
- Click “Publish” to save.
- Decap CMS commits changes to GitHub automatically.
- The site rebuilds on Vercel within minutes and updates automatically.

No manual deployment or database access is required.

---

## Behavior Summary

| Actor | Action | System Behavior |
|-------|---------|-----------------|
| **Visitor** | Opens any page | Static HTML served instantly |
| **Visitor** | Views News list | Pre-rendered list of Markdown posts |
| **Visitor** | Opens Gallery | Static page or links to external albums |
| **Admin (BFU)** | Logs into `/admin` | Auth via GitHub OAuth |
| **Admin (BFU)** | Creates/edits post | Decap updates Markdown file in repo |
| **Admin (BFU)** | Clicks “Publish” | Commit to main branch → site rebuilds |
| **Admin (Tech)** | Edits content manually | Commits Markdown directly |
| **System** | Detects repo change | Vercel rebuilds static site automatically |

---

## Design Philosophy

- **Simplicity first:** avoid databases, servers, or dynamic dependencies.
- **Transparency:** all content lives in the repository; history is tracked by Git.
- **Accessibility:** allow both developers and casual editors to contribute.
- **Sustainability:** minimal maintenance cost; easy handover to future maintainers.

---

**In short:**  
> A fast, low-cost, git-powered website where visitors get static pages and admins edit content through a simple browser interface — no servers, no database, no WordPress.

// Scrapes posts from the WordPress site at sokolskuhrov.cz,
// downloads media files, converts HTML to Markdown, and saves them to content.
//
// Supports both "akce" (events) and "fotogalerie" (photo gallery) categories.
//
// Usage:
//   npm run scrape akce        - Scrape events posts
//   npm run scrape fotogalerie - Scrape photo gallery posts
//
// Features:
// - Paginates through all archive pages
// - Extracts title, date, author, content, and images
// - Downloads images to public/images/{category}/
// - Converts HTML content to Markdown
// - Generates proper frontmatter with all metadata
import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { URL } from "node:url";
import TurndownService from "turndown";

const BASE_URL = "http://www.sokolskuhrov.cz";

type Category = "akce" | "fotogalerie";

const category = (process.argv[2] || "akce") as Category;
if (category !== "akce" && category !== "fotogalerie") {
  console.error(`Invalid category: ${category}. Must be "akce" or "fotogalerie"`);
  process.exit(1);
}

const CATEGORY_URL = `${BASE_URL}/category/${category}/`;
const POSTS_DIR = path.join(process.cwd(), "content", category === "akce" ? "posts" : "fotogalerie");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", category);

type PostData = {
  title: string;
  date: string;
  author: string;
  slug: string;
  content: string;
  image?: string;
  summary?: string;
};

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCzechDate(dateStr: string): string {
  const months: Record<string, string> = {
    ledna: "01",
    února: "02",
    března: "03",
    dubna: "04",
    května: "05",
    června: "06",
    července: "07",
    srpna: "08",
    září: "09",
    října: "10",
    listopadu: "11",
    prosince: "12",
  };

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, "0");
    const month = months[parts[1]] || "01";
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  const date = new Date(dateStr);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
}

async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SokolSkuhrov-Migration/1.0)",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}

async function downloadImage(imageUrl: string, filename: string): Promise<string> {
  const response = await fetch(imageUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SokolSkuhrov-Migration/1.0)",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to download image ${imageUrl}: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const filePath = path.join(IMAGES_DIR, filename);
  await fs.writeFile(filePath, Buffer.from(buffer));

  return `/images/${category}/${filename}`;
}

function getImageFilename(url: string, slug: string, index: number): string {
  const urlObj = new URL(url);
  const ext = path.extname(urlObj.pathname) || ".jpg";
  const baseName = path.basename(urlObj.pathname, ext);
  const safeBaseName = slugify(baseName) || `image-${index}`;
  return `${slug}-${safeBaseName}${ext}`;
}

async function extractPostLinks(html: string): Promise<string[]> {
  const $ = cheerio.load(html);
  const links: string[] = [];
  const seenUrls = new Set<string>();

  // Primary strategy: Look for entry-title links (most reliable for WordPress)
  $("h1.entry-title a, h2.entry-title a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const fullUrl = href.startsWith("http") ? href : new URL(href, BASE_URL).href;
      // Post URLs typically have date pattern like /2025/09/11/ or are direct post slugs
      if (!fullUrl.includes("/category/") && !seenUrls.has(fullUrl)) {
        links.push(fullUrl);
        seenUrls.add(fullUrl);
      }
    }
  });

  // Fallback: Look for article containers with entry-title
  $("article.post, article.hentry").each((_, container) => {
    const link = $(container).find("h1.entry-title a, h2.entry-title a").first();
    if (link.length > 0) {
      const href = link.attr("href");
      if (href) {
        const fullUrl = href.startsWith("http") ? href : new URL(href, BASE_URL).href;
        if (!fullUrl.includes("/category/") && !seenUrls.has(fullUrl)) {
          links.push(fullUrl);
          seenUrls.add(fullUrl);
        }
      }
    }
  });

  // Additional fallback: Look for any heading links in articles
  $("article h1 a, article h2 a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const fullUrl = href.startsWith("http") ? href : new URL(href, BASE_URL).href;
      // Exclude category pages, pagination, and archive pages
      if (
        !fullUrl.includes("/category/") &&
        !fullUrl.includes("/page/") &&
        !fullUrl.includes("/author/") &&
        !fullUrl.includes("/tag/") &&
        !fullUrl.match(/\/akce\/$/i) &&
        !fullUrl.match(/\/fotogalerie\/$/i) &&
        !seenUrls.has(fullUrl)
      ) {
        links.push(fullUrl);
        seenUrls.add(fullUrl);
      }
    }
  });

  return links;
}

function findNextPageLink(html: string): string | null {
  const $ = cheerio.load(html);
  
  // Look for "Starší příspěvky" (Older posts) link - this is the next page in Czech WordPress
  let nextLink = $('a').filter((_, el) => {
    const text = $(el).text().trim();
    return text.includes("Starší příspěvky") || text.includes("Older posts");
  }).first();
  
  // Try standard pagination selectors
  if (nextLink.length === 0) {
    nextLink = $('a[rel="next"]').first();
  }
  if (nextLink.length === 0) {
    nextLink = $('.nav-next a').first();
  }
  if (nextLink.length === 0) {
    nextLink = $('.pagination .next a').first();
  }
  
  // Look for pagination links with Czech text or arrows
  if (nextLink.length === 0) {
    $('.pagination a, .nav-links a, .navigation a, #nav-below a').each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr("href");
      if (href && (text === "→" || text === "»" || text.includes("Starší") || text.includes("Older") || text.includes("Next"))) {
        nextLink = $(el);
        return false; // break
      }
    });
  }
  
  if (nextLink.length === 0) {
    return null;
  }
  
  const href = nextLink.attr("href");
  if (href) {
    // Check if it's a pagination link (contains /page/ or is a relative next link)
    if (href.includes("/page/") || href.includes("?paged=") || nextLink.attr("rel") === "next") {
      return href.startsWith("http") ? href : new URL(href, BASE_URL).href;
    }
  }
  return null;
}

async function scrapePost(postUrl: string): Promise<PostData> {
  console.log(`Scraping post: ${postUrl}`);
  const html = await fetchHTML(postUrl);
  const $ = cheerio.load(html);

  const title = $("h1.entry-title, h1.post-title, article h1, .entry-header h1").first().text().trim();
  if (!title) {
    throw new Error(`Could not find title in ${postUrl}`);
  }

  const slug = slugify(title);

  let date = "";
  // First try to get date from datetime attribute (most reliable)
  const dateAttr = $("time.entry-date, time[datetime]").first().attr("datetime");
  if (dateAttr) {
    const dateObj = new Date(dateAttr);
    if (!Number.isNaN(dateObj.getTime())) {
      date = dateObj.toISOString().split("T")[0];
    }
  }
  
  // Fallback to parsing text
  if (!date) {
    const dateText = $(".entry-date, .post-date, time, .published").first().text().trim();
    if (dateText) {
      date = parseCzechDate(dateText);
    } else {
      date = new Date().toISOString().split("T")[0];
    }
  }

  let author = "";
  // Look for author link in entry-meta (most common WordPress pattern)
  const authorLink = $(".entry-meta .author a, .author.vcard a, .author a.url").first();
  if (authorLink.length > 0) {
    author = authorLink.text().trim();
  } else {
    // Fallback to other author selectors
    const authorText = $(".author, .by-author, .entry-author, .post-author").first().text().trim();
    if (authorText) {
      author = authorText.replace(/^[Bb]y\s+/i, "").trim();
    } else {
      const authorLinkText = $(".author a, .by-author a").first().text().trim();
      if (authorLinkText) {
        author = authorLinkText;
      }
    }
  }

  let contentEl = $(".entry-content, .post-content, article .content, .post-body").first();
  if (contentEl.length === 0) {
    contentEl = $("article").first();
    contentEl.find("header, .entry-header, .post-header").remove();
    contentEl.find("footer, .entry-footer, .post-footer").remove();
  }

  let featuredImage: string | undefined;
  const featuredImg = $(".post-thumbnail img, .featured-image img, .wp-post-image").first();
  if (featuredImg.length > 0) {
    const imgSrc = featuredImg.attr("src") || featuredImg.attr("data-src");
    if (imgSrc) {
      const fullImgUrl = imgSrc.startsWith("http") ? imgSrc : new URL(imgSrc, postUrl).href;
      const filename = getImageFilename(fullImgUrl, slug, 0);
      featuredImage = await downloadImage(fullImgUrl, filename);
    }
  }

  const images: Array<{ originalSrc: string; url: string; filename: string; localPath: string }> = [];
  contentEl.find("img").each((index, img) => {
    const originalSrc = $(img).attr("src") || $(img).attr("data-src");
    if (originalSrc && !originalSrc.includes("data:image")) {
      const fullImgUrl = originalSrc.startsWith("http") ? originalSrc : new URL(originalSrc, postUrl).href;
      const filename = getImageFilename(fullImgUrl, slug, index + 1);
      images.push({ originalSrc, url: fullImgUrl, filename, localPath: "" });
    }
  });

  for (const imgData of images) {
    try {
      const localPath = await downloadImage(imgData.url, imgData.filename);
      imgData.localPath = localPath;
      contentEl.find("img").each((_, img) => {
        const imgSrc = $(img).attr("src") || $(img).attr("data-src");
        if (imgSrc && (imgSrc === imgData.originalSrc || imgSrc === imgData.url || imgSrc.includes(path.basename(imgData.url)))) {
          $(img).attr("src", localPath);
          $(img).removeAttr("data-src");
        }
      });
    } catch (error) {
      console.warn(`Failed to download image ${imgData.url}:`, error);
    }
  }

  contentEl.find("a").each((_, link) => {
    const href = $(link).attr("href");
    if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("/")) {
      $(link).attr("href", new URL(href, postUrl).href);
    }
  });

  const htmlContent = contentEl.html() || "";
  const markdown = turndownService.turndown(htmlContent);

  const summaryEl = $(".entry-summary, .post-excerpt, .excerpt").first();
  let summary: string | undefined;
  if (summaryEl.length > 0) {
    summary = summaryEl.text().trim().substring(0, 200);
  } else if (markdown.length > 200) {
    summary = markdown.substring(0, 200).replace(/\n/g, " ").trim();
  }

  return {
    title,
    date,
    author,
    slug,
    content: markdown.trim(),
    image: featuredImage,
    summary,
  };
}

function generateFrontmatter(post: PostData): string {
  const fields: string[] = [];
  fields.push(`title: "${post.title.replace(/"/g, '\\"')}"`);
  fields.push(`date: "${post.date}"`);
  if (post.author) {
    fields.push(`author: "${post.author.replace(/"/g, '\\"')}"`);
  }
  if (post.image) {
    fields.push(`image: "${post.image}"`);
  }
  if (post.summary) {
    fields.push(`summary: "${post.summary.replace(/"/g, '\\"')}"`);
  }
  fields.push(`slug: "${post.slug}"`);

  return `---\n${fields.join("\n")}\n---\n\n`;
}

async function savePost(post: PostData): Promise<void> {
  const filePath = path.join(POSTS_DIR, `${post.slug}.md`);
  const frontmatter = generateFrontmatter(post);
  const content = frontmatter + post.content;
  await fs.writeFile(filePath, content, "utf8");
  console.log(`Saved: ${filePath}`);
}

async function ensureDirectories(): Promise<void> {
  await fs.mkdir(POSTS_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

async function main() {
  console.log(`Starting migration of ${category} posts...`);
  await ensureDirectories();

  const allPostUrls = new Set<string>();
  let currentPageUrl: string | null = CATEGORY_URL;

  let pageNumber = 1;
  let lastPostCount = 0;
  let noNewPostsCount = 0;
  
  while (currentPageUrl) {
    console.log(`Fetching archive page ${pageNumber}: ${currentPageUrl}`);
    const html = await fetchHTML(currentPageUrl);
    const postLinks = await extractPostLinks(html);

    for (const link of postLinks) {
      allPostUrls.add(link);
    }

    console.log(`Found ${postLinks.length} posts on this page (${allPostUrls.size} total unique)`);
    if (postLinks.length > 0) {
      console.log(`Sample links: ${postLinks.slice(0, 3).join(", ")}`);
    }
    
    // Check if we got new posts
    if (allPostUrls.size === lastPostCount) {
      noNewPostsCount++;
      if (noNewPostsCount >= 2) {
        console.log("No new posts found on last 2 pages, stopping");
        break;
      }
    } else {
      noNewPostsCount = 0;
    }
    lastPostCount = allPostUrls.size;
    
    const nextPage = findNextPageLink(html);
    if (nextPage && nextPage !== currentPageUrl) {
      currentPageUrl = nextPage;
      pageNumber++;
    } else {
      // Try manual pagination as fallback
      const manualNextPage = `${CATEGORY_URL}page/${pageNumber + 1}/`;
      console.log(`Trying manual pagination: ${manualNextPage}`);
      try {
        const testHtml = await fetchHTML(manualNextPage);
        const testLinks = await extractPostLinks(testHtml);
        if (testLinks.length > 0) {
          currentPageUrl = manualNextPage;
          pageNumber++;
          continue;
        }
      } catch {
        // Page doesn't exist, we're done
      }
      console.log("No more pages found or reached end of pagination");
      break;
    }
    
    // Safety limit to prevent infinite loops
    if (pageNumber > 100) {
      console.warn("Reached safety limit of 100 pages, stopping");
      break;
    }
  }

  console.log(`\nTotal unique posts found: ${allPostUrls.size}`);
  console.log("Starting to scrape individual posts...\n");

  const postUrlsArray = Array.from(allPostUrls);
  for (let i = 0; i < postUrlsArray.length; i++) {
    const postUrl = postUrlsArray[i];
    try {
      const post = await scrapePost(postUrl);
      await savePost(post);
      console.log(`Progress: ${i + 1}/${postUrlsArray.length}\n`);
    } catch (error) {
      console.error(`Error scraping ${postUrl}:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("Migration complete!");
}

main().catch(console.error);


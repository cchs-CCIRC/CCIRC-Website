import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "js", "resources-data.js");
const outputPath = path.join(root, "js", "resources-search-index.js");

const source = await fs.readFile(dataPath, "utf8");
const match = source.match(/window\.CCIRC_RESOURCES\s*=\s*([\s\S]*?)\s*;\s*$/);

if (!match) {
  throw new Error("Could not find window.CCIRC_RESOURCES in resources-data.js");
}

const resources = JSON.parse(match[1]);

function cleanMarkdown(markdown) {
  return String(markdown ?? "")
    .replace(/^\uFEFF/, "")
    // YAML front matter
    .replace(/^---[\s\S]*?---\s*/m, "")
    // HTML comments
    .replace(/<!--[\s\S]*?-->/g, " ")
    // Images: keep alt text, discard destination
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    // Links: keep visible text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Autolinks
    .replace(/<https?:\/\/[^>]+>/g, " ")
    // Markdown headings
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    // Fenced code markers
    .replace(/^\s*```[^\n]*$/gm, "")
    // Inline code
    .replace(/`([^`]+)`/g, "$1")
    // Bold / italic / strike markers
    .replace(/(\*\*|__|\*|_|~~)/g, "")
    // Blockquote markers
    .replace(/^\s*>\s?/gm, "")
    // List markers
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    // HTML tags
    .replace(/<[^>]+>/g, " ")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(markdown) {
  return String(markdown ?? "")
    .split(/\r?\n/)
    .map(line => line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/)?.[1])
    .filter(Boolean)
    .map(cleanMarkdown);
}

async function fetchMarkdown(url) {
  const mdUrl = `${String(url).replace(/\/+$/, "")}.md`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(mdUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "CCIRC-Website-resource-index/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

const entries = [];

for (let i = 0; i < resources.length; i++) {
  const resource = resources[i];
  let markdown = "";
  let error = null;

  try {
    markdown = await fetchMarkdown(resource.url);
    console.log(`[OK] ${resource.title}`);
  } catch (err) {
    error = String(err?.message || err);
    console.warn(`[WARN] ${resource.title}: ${error}`);
  }

  entries.push({
    resourceIndex: i,
    title: resource.title || "",
    category: resource.category || "",
    desc: resource.desc || "",
    headings: extractHeadings(markdown),
    content: cleanMarkdown(markdown),
    indexedAt: new Date().toISOString(),
    ...(error ? { fetchError: error } : {})
  });
}

const output = `/* Auto-generated. Do not edit manually. */
window.CCIRC_RESOURCE_SEARCH_INDEX = ${JSON.stringify(entries)};
`;

await fs.writeFile(outputPath, output, "utf8");

const indexed = entries.filter(item => item.content).length;
console.log(`Built ${entries.length} resources; ${indexed} contain searchable note content.`);

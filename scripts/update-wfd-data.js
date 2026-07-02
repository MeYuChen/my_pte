const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SOURCES_PATH = path.join(ROOT, "wfd-sources.json");
const OUTPUT_PATH = path.join(ROOT, "wfd-data.js");
const REQUEST_TIMEOUT_MS = 25000;
const CORE_ITEM_LIMIT = 189;

const BAD_LINE_PATTERNS = [
  /\bpte\b/i,
  /\bwfd\b/i,
  /\bwrite from dictation\b/i,
  /\bquestion\b/i,
  /\banswer\b/i,
  /\baudio\b/i,
  /\btranscript\b/i,
  /\bmock test\b/i,
  /\bpractice test\b/i,
  /\bsign up\b/i,
  /\blogin\b/i,
  /\bblog\b/i,
  /\bsubscribe\b/i,
  /\btable of contents\b/i,
  /\bread aloud\b/i,
  /\brepeat sentence\b/i,
  /\bPearson\b/i,
  /\bGurully\b/i,
  /\bLanguage Academy\b/i,
  /\bGoArno\b/i,
  /\bSumlingo\b/i,
  /\b79Score\b/i,
  /\bupdated\b/i,
  /\bdownload\b/i,
  /\bfree\b/i,
  /\bscore\b/i,
  /\bexam\b/i
];

async function main() {
  const sources = JSON.parse(fs.readFileSync(SOURCES_PATH, "utf8"));
  const records = new Map();
  const sourceReports = [];

  for (const source of sources) {
    try {
      const html = await fetchText(source.url);
      const lines = htmlToLines(html);
      const mp3s = [...new Set(html.match(/https?:\/\/[^\s"'<>]+?\.mp3(?:\?[^\s"'<>]*)?/gi) || [])];
      const sentences = extractSentences(lines, source);
      sentences.forEach((sentence, index) => {
        const key = sentenceKey(sentence);
        const current = records.get(key) || {
          sentence,
          sources: [],
          audio: "",
          priorityScore: 0
        };
        if (!current.sources.includes(source.name)) current.sources.push(source.name);
        current.priorityScore += Number(source.weight || 1);
        if (!current.audio && mp3s[index]) current.audio = mp3s[index];
        records.set(key, current);
      });
      sourceReports.push({ source: source.name, ok: true, count: sentences.length });
    } catch (error) {
      sourceReports.push({ source: source.name, ok: false, error: error.message });
    }
  }

  const candidates = [...records.values()]
    .map((item) => ({
      sentence: item.sentence,
      sources: item.sources.sort(),
      sourceCount: item.sources.length,
      priorityScore: item.priorityScore + item.sources.length * 10,
      audio: item.audio || ""
    }))
    .sort((a, b) => (
      b.priorityScore - a.priorityScore ||
      b.sourceCount - a.sourceCount ||
      a.sentence.localeCompare(b.sentence)
    ));
  const items = candidates.slice(0, CORE_ITEM_LIMIT);

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceCount: sources.length,
    candidateCount: candidates.length,
    coreItemLimit: CORE_ITEM_LIMIT,
    itemCount: items.length,
    sources: sourceReports,
    items
  };

  const body = `window.WFD_DATA = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_PATH, body, "utf8");
  console.log(`WFD candidates: ${candidates.length}`);
  console.log(`WFD core items: ${items.length}`);
  sourceReports.forEach((report) => {
    if (report.ok) console.log(`- ${report.source}: ${report.count}`);
    else console.log(`- ${report.source}: failed (${report.error})`);
  });
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; my-pte-wfd-updater/1.0)",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function htmlToLines(html) {
  return decodeHtml(String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style[\s\S]*?<\/style>/gi, "\n")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "\n")
    .replace(/<(br|p|div|li|tr|td|h[1-6]|section|article|blockquote)\b[^>]*>/gi, "\n")
    .replace(/<\/(p|div|li|tr|td|h[1-6]|section|article|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " "))
    .split(/\n+/)
    .map(cleanLine)
    .filter(Boolean);
}

function extractSentences(lines, source) {
  const modes = new Set(source.extract || []);
  const sentences = [];

  if (modes.has("transcript") || modes.has("answer")) {
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const inline = line.match(/^(?:transcript|transript|answer|correct sentence)\s*:?\s*(.+)$/i);
      if (inline?.[1]) addCandidate(sentences, inline[1]);
      if (/^(?:transcript|transript|answer|correct sentence):?$/i.test(line)) {
        const next = nextUsefulLine(lines, index + 1);
        if (next) addCandidate(sentences, next);
      }
    }
  }

  if (modes.has("numbered")) {
    lines.forEach((line) => {
      const numbered = line.match(/^(?:Q(?:uestion)?\s*)?\d{1,3}[\.)、:-]\s*(.+)$/i);
      if (numbered?.[1]) addCandidate(sentences, numbered[1]);
    });
  }

  if (modes.has("sentence-lines")) {
    lines.forEach((line) => {
      if (/^[A-Z][A-Za-z0-9',;:\-\s]+[.!?]?$/.test(line)) addCandidate(sentences, line);
    });
  }

  return uniqueSentences(sentences);
}

function nextUsefulLine(lines, start) {
  for (let index = start; index < Math.min(lines.length, start + 4); index += 1) {
    const line = lines[index];
    if (/^(audio|play|download|transcript|answer|question)\b/i.test(line)) continue;
    if (isLikelyWfdSentence(line)) return line;
  }
  return "";
}

function addCandidate(list, value) {
  const sentence = cleanSentence(value);
  if (isLikelyWfdSentence(sentence)) list.push(sentence);
}

function uniqueSentences(sentences) {
  const seen = new Set();
  const unique = [];
  sentences.forEach((sentence) => {
    const key = sentenceKey(sentence);
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(sentence);
  });
  return unique;
}

function isLikelyWfdSentence(sentence) {
  const words = sentence.match(/[A-Za-z0-9']+/g) || [];
  if (words.length < 4 || words.length > 28) return false;
  if (!/[A-Za-z]/.test(sentence)) return false;
  if (BAD_LINE_PATTERNS.some((pattern) => pattern.test(sentence))) return false;
  const letterRatio = (sentence.match(/[A-Za-z]/g) || []).length / Math.max(1, sentence.length);
  if (letterRatio < 0.55) return false;
  return true;
}

function cleanLine(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSentence(value) {
  let sentence = cleanLine(value)
    .replace(/^\d{1,3}[\.)、:-]\s*/, "")
    .replace(/^(?:transcript|transript|answer|correct sentence)\s*:?\s*/i, "")
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
  sentence = sentence.replace(/[。！？]+$/g, ".");
  if (sentence && !/[.!?]$/.test(sentence)) sentence += ".";
  return sentence;
}

function sentenceKey(sentence) {
  return String(sentence || "").toLowerCase().match(/[a-z0-9']+/g)?.join(" ") || "";
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#039;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

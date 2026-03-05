import fs from "fs";
import path from "path";

export interface SearchResult {
  filename: string;
  content: string;
  score: number;
}

const DATA_DIR = path.join(process.cwd(), "data", "sasaki");

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[、。！？「」『』（）\n\r\t]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function calculateScore(tokens: string[], docTokens: string[]): number {
  const docText = docTokens.join(" ");
  let score = 0;
  for (const token of tokens) {
    if (docText.includes(token)) {
      score += 1;
    }
  }
  // Bonus for exact phrase matches in original text
  const docJoined = docTokens.join(" ");
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = tokens[i] + " " + tokens[i + 1];
    if (docJoined.includes(bigram)) {
      score += 2;
    }
  }
  return score;
}

export function loadAllDocuments(): { filename: string; content: string }[] {
  if (!fs.existsSync(DATA_DIR)) {
    return [];
  }
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".txt"));
  return files.map((filename) => ({
    filename,
    content: fs.readFileSync(path.join(DATA_DIR, filename), "utf-8"),
  }));
}

export function searchDocuments(
  query: string,
  topK: number = 5
): SearchResult[] {
  const docs = loadAllDocuments();
  if (docs.length === 0) return [];

  const queryTokens = tokenize(query);

  const scored = docs.map((doc) => ({
    filename: doc.filename,
    content: doc.content,
    score: calculateScore(queryTokens, tokenize(doc.content)),
  }));

  return scored
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

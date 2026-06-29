import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { VALID } from "./categories";

export type Collection = "projects" | "posts";
export type Doc = {
  slug: string; title: string; date: string; category: string;
  summary?: string; tags?: string[]; tools?: string[];
  links?: Record<string, string>; thumbnail?: string; html: string;
};

const ROOT = path.join(process.cwd(), "content");
const SLUG_RE = /^[a-z0-9-]+$/;

export function validateFrontmatter(
  file: string, collection: Collection, data: Record<string, unknown>
) {
  if (!data.title) throw new Error(`${file}: title이 없어요. 맨 위에 "title: 제목" 을 추가하세요.`);
  if (!data.date) throw new Error(`${file}: date가 없어요. 맨 위에 "date: 2026-06-29" 형식으로 추가하세요.`);
  if (!data.category) throw new Error(`${file}: category가 없어요. 허용값: ${VALID[collection].join(", ")}`);
  if (!VALID[collection].includes(String(data.category)))
    throw new Error(`${file}: category "${data.category}"는 잘못됐어요. 허용값: ${VALID[collection].join(", ")}`);
}

export function getContent(collection: Collection): Doc[] {
  const dir = path.join(ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      if (!SLUG_RE.test(slug))
        throw new Error(`content/${collection}/${f}: 파일명은 영문 소문자-하이픈만 쓰세요(현재: ${slug}).`);
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      validateFrontmatter(`content/${collection}/${f}`, collection, data);
      const rawDate = data.date;
      const date = rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : String(rawDate);
      return {
        slug,
        title: String(data.title),
        date,
        category: String(data.category),
        summary: data.summary as string | undefined,
        tags: data.tags as string[] | undefined,
        tools: data.tools as string[] | undefined,
        links: data.links as Record<string, string> | undefined,
        thumbnail: data.thumbnail as string | undefined,
        html: marked.parse(content) as string,
        _draft: data.draft === true,
      } as Doc & { _draft: boolean };
    })
    .filter((d) => !(d as Doc & { _draft: boolean })._draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getOne(collection: Collection, slug: string): Doc {
  const found = getContent(collection).find((d) => d.slug === slug);
  if (!found) throw new Error(`${collection}/${slug} 를 찾을 수 없어요.`);
  return found;
}

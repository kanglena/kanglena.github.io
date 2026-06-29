import Link from "next/link";
import type { Metadata } from "next";
import { getContent, getOne } from "@/lib/content";
import { categoryMeta } from "@/lib/categories";

export function generateStaticParams() {
  return getContent("posts").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const doc = getOne("posts", slug);
  return { title: doc.title, description: doc.summary,
           openGraph: { images: [doc.thumbnail ?? "/og.png"] } };
}

export default async function PostDetail(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const doc = getOne("posts", slug);
  const cat = categoryMeta(doc.category);
  return (
    <article>
      <Link href="/blog" className="text-[12px] underline">← 목록으로</Link>
      <div className="mt-3 flex items-center gap-2">
        <span className="nb-border rounded px-2 py-[1px] text-[11px]"
              style={{ background: cat.color, borderWidth: 1.5 }}>{cat.label}</span>
        <span className="nb-display text-[11px]" style={{ color: "var(--muted)" }}>{doc.date}</span>
      </div>
      <h1 className="nb-display mt-2 text-[24px]">{doc.title}</h1>
      <div className="prose mt-5 max-w-none" style={{ lineHeight: 1.75 }}
           dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}

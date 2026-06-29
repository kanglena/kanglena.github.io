import Link from "next/link";
import { categoryMeta } from "@/lib/categories";
import type { Doc } from "@/lib/content";

export default function ContentCard({ doc, basePath }: { doc: Doc; basePath: string; }) {
  const cat = categoryMeta(doc.category);
  return (
    <Link href={`${basePath}/${doc.slug}`} className="nb-card block overflow-hidden p-0">
      <div className="flex h-[74px] items-center justify-center"
           style={{ background: cat.color, borderBottom: "2.5px solid var(--ink)" }} aria-hidden>
        <span className="nb-display text-[20px]">{cat.label}</span>
      </div>
      <div className="p-3">
        <span className="nb-border inline-block rounded px-2 py-[1px] text-[11px]"
              style={{ background: cat.color, color: "var(--ink)", borderWidth: 1.5 }}>{cat.label}</span>
        <div className="mt-2 text-[15px] font-medium">{doc.title}</div>
        {doc.summary && <div className="mt-1 text-[12px]" style={{ color: "var(--muted)" }}>{doc.summary}</div>}
        <div className="mt-2 text-[11px] nb-display" style={{ color: "var(--muted)" }}>{doc.date}</div>
      </div>
    </Link>
  );
}

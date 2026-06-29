"use client";
import { useState } from "react";
import ContentCard from "./ContentCard";
import { categoryMeta } from "@/lib/categories";
import type { Doc } from "@/lib/content";

export default function ContentFilter({
  items, basePath, categories,
}: { items: Doc[]; basePath: string; categories: string[]; }) {
  const [active, setActive] = useState<string>("all");
  const shown = active === "all" ? items : items.filter((d) => d.category === active);
  const chip = (key: string, label: string) => {
    const on = active === key;
    return (
      <button key={key} onClick={() => setActive(key)}
        aria-pressed={on}
        className="nb-border rounded-full px-3 py-[6px] text-[12.5px]"
        style={{ background: "var(--paper)", boxShadow: on ? "3px 3px 0 var(--ink)" : "none",
                 borderWidth: on ? 3 : 2 }}>
        {on ? "✓ " : ""}{label}
      </button>
    );
  };
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {chip("all", "전체")}
        {categories.map((c) => chip(c, categoryMeta(c).label))}
      </div>
      {shown.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>해당하는 게 아직 없어요. '전체'를 눌러 보세요.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {shown.map((d) => <ContentCard key={d.slug} doc={d} basePath={basePath} />)}
        </div>
      )}
    </div>
  );
}

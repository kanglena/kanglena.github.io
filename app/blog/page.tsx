import { getContent } from "@/lib/content";
import { VALID } from "@/lib/categories";
import ContentFilter from "@/components/ContentFilter";
import EmptyState from "@/components/EmptyState";

export default function BlogPage() {
  const items = getContent("posts");
  return (
    <div>
      <h1 className="nb-display mb-4 text-[22px]">블로그</h1>
      {items.length === 0
        ? <EmptyState message="첫 글 준비 중이에요, 곧 올라와요." />
        : <ContentFilter items={items} basePath="/blog" categories={VALID.posts} />}
    </div>
  );
}

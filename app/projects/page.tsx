import { getContent } from "@/lib/content";
import { VALID } from "@/lib/categories";
import ContentFilter from "@/components/ContentFilter";
import EmptyState from "@/components/EmptyState";

export default function ProjectsPage() {
  const items = getContent("projects");
  return (
    <div>
      <h1 className="nb-display mb-4 text-[22px]">프로젝트</h1>
      {items.length === 0
        ? <EmptyState message="첫 작품 준비 중이에요, 곧 올라와요." />
        : <ContentFilter items={items} basePath="/projects" categories={VALID.projects} />}
    </div>
  );
}

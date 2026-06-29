import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="nb-display text-[22px]">페이지를 찾을 수 없어요</h1>
      <p className="text-[14px]" style={{ color: "var(--muted)" }}>
        주소가 틀렸거나, 제가 아직 안 만든 페이지예요.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/" className="nb-border nb-shadow-sm rounded-lg px-4 py-[9px] text-[13px]" style={{ background: "var(--mustard)" }}>홈으로</Link>
        <Link href="/projects" className="nb-border rounded-lg px-4 py-[9px] text-[13px]" style={{ background: "var(--paper)" }}>프로젝트</Link>
        <Link href="/blog" className="nb-border rounded-lg px-4 py-[9px] text-[13px]" style={{ background: "var(--paper)" }}>블로그</Link>
      </div>
    </div>
  );
}

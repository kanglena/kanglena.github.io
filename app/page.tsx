import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-[15px]" style={{ lineHeight: 1.6 }}>
        강인아의 작업과 글을 모아둔 공간이에요.
        <br />
        <span style={{ color: "var(--muted)", fontSize: 13.5 }}>왼쪽 메뉴를 눌러 둘러보세요.</span>
      </p>

      <div className="nb-card flex max-w-md items-center gap-4 p-4">
        <div className="nb-border flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full nb-display"
             style={{ background: "var(--mint)", fontSize: 26, fontWeight: 700 }}>강</div>
        <div>
          <div className="text-[12px]" style={{ color: "var(--muted)" }}>여기는</div>
          <div className="nb-display text-[24px] font-bold leading-none">강인아</div>
          <span className="mt-2 inline-block rounded px-2 py-[2px] text-[11px]"
                style={{ background: "var(--ink)", color: "var(--cream)" }}>만들기 좋아하는 중2</span>
          <div className="mt-2">
            <Link href="/about" className="text-[12px] underline">소개 더보기 →</Link>
          </div>
        </div>
      </div>

      {/* 최근 작업·글: Task 5 이후 연결. 0개면 섹션 숨김 */}
    </div>
  );
}

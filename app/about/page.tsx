export default function AboutPage() {
  const interests = ["코딩", "게임 개발", "영상 편집", "그림", "글쓰기"];
  const tools = ["Python", "JavaScript", "Premiere Pro"];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="nb-border nb-display flex h-[66px] w-[66px] items-center justify-center rounded-[18px]"
             style={{ background: "var(--mint)", fontSize: 26, fontWeight: 700 }}>강</div>
        <div>
          <h1 className="nb-display text-[24px]">강인아</h1>
          <div className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>대치중학교 2학년 · 학생회 가온</div>
        </div>
      </div>
      <p className="text-[14px]" style={{ lineHeight: 1.75 }}>
        게임이든 영상이든 일단 만들어 보는 게 제일 재밌어요. 새로 배운 건 블로그에 기록하며 차근차근 쌓아가는 중이에요.
      </p>
      <section>
        <div className="nb-display mb-2 text-[12px]" style={{ color: "var(--muted)" }}>요즘 빠진 것</div>
        <div className="flex flex-wrap gap-2">
          {interests.map((t) => <span key={t} className="nb-border rounded-lg px-3 py-[5px] text-[12px]"
            style={{ background: "var(--paper)" }}>{t}</span>)}
        </div>
      </section>
      <section>
        <div className="nb-display mb-2 text-[12px]" style={{ color: "var(--muted)" }}>요즘 쓰는 도구</div>
        <div className="flex flex-wrap gap-2">
          {tools.map((t) => <span key={t} className="nb-border nb-display rounded-lg px-3 py-[5px] text-[12px]"
            style={{ background: "var(--paper)" }}>{t}</span>)}
        </div>
      </section>
      <section>
        <div className="nb-display mb-2 text-[12px]" style={{ color: "var(--muted)" }}>연락</div>
        <div className="flex flex-wrap gap-2">
          <a href="mailto:" aria-label="이메일 보내기" className="nb-border nb-shadow-sm rounded-lg px-4 py-[9px] text-[13px]" style={{ background: "var(--paper)" }}>✉ 이메일</a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="nb-border nb-shadow-sm rounded-lg px-4 py-[9px] text-[13px]" style={{ background: "var(--paper)" }}>⌥ GitHub</a>
        </div>
      </section>
    </div>
  );
}

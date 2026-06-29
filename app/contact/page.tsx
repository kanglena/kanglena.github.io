export default function ContactPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="nb-display text-[22px]">연락처</h1>
      <p className="text-[14px]" style={{ lineHeight: 1.7 }}>
        궁금한 거나 같이 만들고 싶은 게 있으면 편하게 연락 주세요. 어떤 걸 봤는지 한 줄 적어주면 더 좋아요!
      </p>
      <div className="flex flex-wrap gap-2">
        <a href="mailto:" aria-label="이메일 보내기" className="nb-border nb-shadow-sm rounded-lg px-4 py-[9px] text-[13px]" style={{ background: "var(--paper)" }}>✉ 이메일</a>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="nb-border nb-shadow-sm rounded-lg px-4 py-[9px] text-[13px]" style={{ background: "var(--paper)" }}>⌥ GitHub</a>
      </div>
    </div>
  );
}

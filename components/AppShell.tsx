import SideNav from "./SideNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full" style={{ padding: "clamp(0px, 3vw, 32px)" }}>
      <div className="nb-border mx-auto max-w-5xl overflow-hidden rounded-[14px]"
           style={{ background: "var(--paper)", boxShadow: "5px 5px 0 var(--ink)" }}>
        {/* 타이틀바 */}
        <div className="nb-display flex items-center justify-between px-3 py-2"
             style={{ background: "var(--mustard)", borderBottom: "2.5px solid var(--ink)" }}>
          <span className="text-[12px] font-bold">C:\강인아 — portfolio</span>
          <span className="flex items-center gap-3">
            <a href="https://github.com/" aria-label="GitHub" target="_blank" rel="noopener noreferrer">⌥</a>
            <a href="mailto:" aria-label="이메일 보내기">✉</a>
            <span aria-hidden style={{ opacity: 0.4, fontSize: 11 }}>_ □ ✕</span>
          </span>
        </div>
        {/* 본문: 데스크톱 사이드바 + main / 모바일 하단탭바는 Task 10 */}
        <div className="flex">
          <aside className="hidden sm:block w-[160px] shrink-0"
                 style={{ borderRight: "2.5px solid var(--ink)" }}>
            <SideNav />
          </aside>
          <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

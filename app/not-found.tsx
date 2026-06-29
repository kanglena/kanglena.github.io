import Link from "next/link";

const MONO = "var(--font-mono), 'JetBrains Mono', monospace";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: 28,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--accent)" }}>404 — not found</div>
      <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>
        페이지를 찾을 수 없어요
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 16, margin: 0, maxWidth: "40ch", lineHeight: 1.6 }}>
        주소가 틀렸거나, 제가 아직 안 만든 페이지예요.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: MONO,
          fontSize: 14,
          textDecoration: "none",
          color: "#fff",
          background: "var(--accent)",
          padding: "11px 20px",
          borderRadius: 10,
        }}
      >
        ← 홈으로 돌아가기
      </Link>
    </div>
  );
}

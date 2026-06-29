# 강인아 포트폴리오 사이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 중학생 강인아의 포트폴리오+블로그 사이트를 "단일 레트로 프로그램 창 + 사이드바" 셸로 만들고, 마크다운으로 콘텐츠를 관리하며 GitHub Pages에 정적 배포한다.

**Architecture:** Next.js 16 App Router를 정적 export(`output: 'export'`)로 사용. `app/layout.tsx`가 `AppShell`(타이틀바 + 사이드바/하단탭바 + 메인 패널 슬롯)로 모든 라우트를 감싼다. 콘텐츠는 `content/**/*.md`를 빌드 타임에 `gray-matter`+`marked`로 읽어 정적 페이지 생성. 클라이언트 상호작용(필터·터미널)만 `'use client'`.

**Tech Stack:** Next.js 16.2.9, React 19, Tailwind CSS v4, TypeScript, gray-matter, marked, vitest(검증용). 배포: GitHub Actions → GitHub Pages.

## Global Constraints

- **정적 export 전용:** 서버 동적 함수(`headers()`/`cookies()`/`searchParams` 의존 서버 코드) 금지. 모든 동적 라우트는 `generateStaticParams`로 전 경로 생성, `dynamicParams` 금지.
- **Next 16 비동기 API:** page/layout/generateMetadata의 `params`는 `Promise`. 항상 `const { slug } = await params`. 코드 작성 전 `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`와 관련 문서로 API 확인(이 Next는 학습 데이터와 다를 수 있음).
- **디자인 토큰(고정값):** 크림 `#f3eee1` · 종이 `#fffdf6` · 잉크 `#1a1a1a` · 보조 `#6b6655` · 민트(UI) `#8fe0bd` · 머스터드 `#f5cf52` · 코랄 `#f0937a` · 스카이 `#7cc0e8`. 테두리 `2.5px solid #1a1a1a`(모바일 2px). 그림자 하드 오프셋 `4px 4px 0 #1a1a1a`(작은 요소 2px, 강조 5px, blur 항상 0). 다크모드 없음(`color-scheme: light only`).
- **카테고리 색+라벨(상수):** `dev`→"코딩"/스카이, `creative`→"창작"/코랄, `dev-log`→"코딩 일기"/스카이, `making`→"창작 일기"/코랄, `thoughts`→"그냥 생각"/머스터드. 칩은 **색+텍스트 라벨 항상 병기**. 활성 표시는 색 아닌 깊이(테두리/그림자).
- **접근성:** 네비·버튼은 의미적 `<a>`/`<button>`, `focus-visible` 링. 장식(`C:\…` 경로, `_ □ ✕`)은 `aria-hidden`. 이미지 `alt` 필수. 컬러 배경 위 글자는 항상 잉크(`#1a1a1a`), 흰 글자 금지.
- **목소리(§3.4):** 사람이 읽는 글 = 한국어 입말("여기는 강인아", "만들기 좋아하는 중2"). 장식 레이어만 영어/기호.
- **커밋 메시지:** AI 작성 표기 금지(Co-Authored-By / Generated with 등 절대 추가 안 함). 평범한 메시지만.
- **slug 규약:** `.md` 파일명 = 영문 소문자+하이픈만.

---

## File Structure

```
next.config.ts                      # 정적 export 설정
app/
  layout.tsx                        # AppShell로 전체 감쌈, lang=ko, 메타데이터
  globals.css                       # 디자인 토큰 + 재사용 클래스 (다크 제거)
  page.tsx                          # 홈(/)
  about/page.tsx
  projects/page.tsx                 # 목록 + 필터
  projects/[slug]/page.tsx          # 상세
  blog/page.tsx
  blog/[slug]/page.tsx
  contact/page.tsx
  terminal/page.tsx                 # 보너스
  not-found.tsx
  sitemap.ts  robots.ts  icon.svg
components/
  AppShell.tsx                      # 타이틀바 + 사이드바/탭바 + main 슬롯
  SideNav.tsx                       # 'use client' (usePathname 활성표시)
  NavItem.tsx
  ContentCard.tsx                   # 프로젝트·블로그 공용 카드
  ContentFilter.tsx                 # 'use client' 공용 필터
  EmptyState.tsx
  Terminal.tsx                      # 'use client' 보너스
lib/
  content.ts                        # 마크다운 읽기/파싱/검증 (server-only)
  content.test.ts                   # vitest
  categories.ts                     # 카테고리 색+라벨 상수 (client에서도 import 가능)
content/
  README.md                         # 작성 가이드(한국어)
  projects/_template.md  projects/*.md
  posts/_template.md     posts/*.md
public/images/  public/og.png
.github/workflows/deploy.yml
```

---

## Task 1: 빌드 설정 + 디자인 토큰 + 레이아웃 기반

**Files:**
- Modify: `next.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: CSS 변수 토큰(`--cream/--paper/--ink/--muted/--mint/--mustard/--coral/--sky/--grid/--font-display/--font-body`), 재사용 클래스(`.nb-card`, `.nb-shadow`, `.nb-border`), `app/layout.tsx`의 `metadata` 기본값. (다음 태스크의 `AppShell`은 `layout.tsx`가 `children`을 그대로 렌더하는 상태에서 시작.)

- [ ] **Step 1: Next 16 정적 export 문서 확인**

Run: `sed -n '1,60p' node_modules/next/dist/docs/01-app/02-guides/static-exports.md`
Expected: `output: 'export'`, `trailingSlash` 옵션 확인. (API가 아래 코드와 다르면 문서 기준으로 맞춤.)

- [ ] **Step 2: `next.config.ts` 작성**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

- [ ] **Step 3: `app/globals.css` 전체 교체 (다크 블록 제거 + 토큰)**

```css
@import "tailwindcss";

:root {
  --cream: #f3eee1;
  --paper: #fffdf6;
  --ink: #1a1a1a;
  --muted: #6b6655;
  --mint: #8fe0bd;
  --mustard: #f5cf52;
  --coral: #f0937a;
  --sky: #7cc0e8;
  --grid: #e3dcc8;
  --font-display: "Galmuri11", ui-monospace, "Space Mono", monospace;
  --font-body: system-ui, -apple-system, "Pretendard", "Apple SD Gothic Neo", sans-serif;
}

html { color-scheme: light only; }

body {
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-body);
}

.nb-border { border: 2.5px solid var(--ink); }
.nb-card {
  background: var(--paper);
  border: 2.5px solid var(--ink);
  border-radius: 12px;
  box-shadow: 4px 4px 0 var(--ink);
}
.nb-shadow { box-shadow: 4px 4px 0 var(--ink); }
.nb-shadow-sm { box-shadow: 2px 2px 0 var(--ink); }
.nb-display { font-family: var(--font-display); }

@media (max-width: 639px) {
  .nb-card { border-width: 2px; box-shadow: 3px 3px 0 var(--ink); }
}
```

- [ ] **Step 4: `app/layout.tsx` 교체 (lang=ko, 메타데이터, Geist 제거)**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kanglena.github.io"),
  title: { default: "강인아", template: "%s | 강인아" },
  description: "만들기 좋아하는 중2 강인아의 작업과 글을 모아둔 공간이에요.",
  openGraph: {
    title: "강인아",
    description: "만들기 좋아하는 중2 강인아의 작업과 글.",
    url: "https://kanglena.github.io",
    images: ["/og.png"],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: 빌드 검증**

Run: `npm run build`
Expected: 빌드 성공, `out/` 폴더 생성. (오류 시 Next 16 문서로 API 대조.)

- [ ] **Step 6: 정적 결과 미리보기 확인**

Run: `npx serve out` 후 브라우저 `http://localhost:3000` 열기
Expected: 흰 배경 대신 **크림색** 배경, 기본 페이지 렌더(아직 내용 없음). 콘솔 에러 없음.

- [ ] **Step 7: 커밋**

```bash
git add next.config.ts app/globals.css app/layout.tsx
git commit -m "chore: configure static export and base design tokens"
```

---

## Task 2: AppShell + 사이드바/탭바 네비 + 자리표시 라우트

**Files:**
- Create: `components/AppShell.tsx`, `components/SideNav.tsx`, `components/NavItem.tsx`
- Modify: `app/layout.tsx` (children을 AppShell로 감쌈)
- Create: `app/about/page.tsx`, `app/projects/page.tsx`, `app/blog/page.tsx`, `app/contact/page.tsx` (자리표시)

**Interfaces:**
- Consumes: Task 1의 토큰/클래스.
- Produces: `<AppShell>{children}</AppShell>`. 네비 항목 데이터 `NAV_ITEMS`(아래). 메인 패널은 `<main>` 래퍼.

- [ ] **Step 1: 네비 항목 + NavItem 작성**

`components/NavItem.tsx`:
```tsx
import Link from "next/link";

export type NavData = { href: string; label: string; icon: string; desc: string };

export default function NavItem({
  item, active,
}: { item: NavData; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="nb-border flex items-center gap-2 rounded-[9px] px-3 py-2 text-[13px]"
      style={{
        background: active ? "var(--mint)" : "var(--paper)",
        boxShadow: active ? "3px 3px 0 var(--ink)" : "none",
        color: "var(--ink)",
      }}
    >
      <span aria-hidden style={{ width: 18, textAlign: "center" }}>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}
```

- [ ] **Step 2: SideNav (현재 경로 활성표시) 작성**

`components/SideNav.tsx`:
```tsx
"use client";
import { usePathname } from "next/navigation";
import NavItem, { NavData } from "./NavItem";

export const NAV_ITEMS: NavData[] = [
  { href: "/", label: "홈", icon: "⌂", desc: "처음으로" },
  { href: "/about", label: "소개", icon: "👤", desc: "나는 누구?" },
  { href: "/projects", label: "프로젝트", icon: "🗂", desc: "내가 만든 것들" },
  { href: "/blog", label: "블로그", icon: "✎", desc: "요즘 끄적이는 글" },
  { href: "/contact", label: "연락처", icon: "✉", desc: "말 걸어 주세요" },
];

export default function SideNav() {
  const path = usePathname();
  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);
  return (
    <nav aria-label="메뉴" className="flex flex-col gap-2 p-3 sm:p-4">
      {NAV_ITEMS.map((it) => (
        <NavItem key={it.href} item={it} active={isActive(it.href)} />
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: AppShell (타이틀바 + 사이드바 + main) 작성**

`components/AppShell.tsx`:
```tsx
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
```

- [ ] **Step 4: layout.tsx에서 AppShell 적용**

`app/layout.tsx`의 body를 수정:
```tsx
import AppShell from "@/components/AppShell";
// ...
      <body className="min-h-full"><AppShell>{children}</AppShell></body>
```
(`@/` 경로 별칭은 `tsconfig.json`의 `paths`에 이미 `@/*` 존재함을 확인. 없으면 상대경로 사용.)

- [ ] **Step 5: 자리표시 라우트 4개 생성**

각각 `app/about/page.tsx`, `app/projects/page.tsx`, `app/blog/page.tsx`, `app/contact/page.tsx`:
```tsx
export default function Page() {
  return <h1 className="nb-display text-[22px]">소개</h1>; // 파일마다 제목만 다르게
}
```
(about="소개", projects="프로젝트", blog="블로그", contact="연락처")

- [ ] **Step 6: 빌드 + 시각 검증**

Run: `npm run build && npx serve out`
Expected: 큰 프로그램 창 + 좌측 사이드바(홈/소개/프로젝트/블로그/연락처) 보임. 사이드바 클릭 시 메인 패널 제목만 바뀌고, 현재 항목이 민트로 활성표시됨. 콘솔 에러 없음.

- [ ] **Step 7: 커밋**

```bash
git add components app/layout.tsx app/about app/projects app/blog app/contact
git commit -m "feat: add program-window shell with sidebar navigation"
```

---

## Task 3: 홈(`/`) 메인 패널

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: 토큰/클래스. (최근 콘텐츠는 Task 5 이후 연결 — 지금은 정적 안내.)
- Produces: 홈 대시보드. 최근 섹션은 콘텐츠 라이브러리 완성 후 Task 5 Step에서 연결.

- [ ] **Step 1: 홈 페이지 작성 (정의 한 줄 + 프로필 요약)**

`app/page.tsx`:
```tsx
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
```

- [ ] **Step 2: 빌드 + 시각 검증**

Run: `npm run build && npx serve out`
Expected: 홈에 정의 문장 + 프로필 카드(강 / "여기는 강인아" / "만들기 좋아하는 중2" / 소개 더보기). 사이드바에서 홈이 활성.

- [ ] **Step 3: 커밋**

```bash
git add app/page.tsx
git commit -m "feat: add home dashboard panel"
```

---

## Task 4: 콘텐츠 라이브러리 `lib/content.ts` (TDD)

**Files:**
- Create: `lib/categories.ts`, `lib/content.ts`, `lib/content.test.ts`
- Create: `content/projects/typing-game.md`, `content/projects/this-site.md`, `content/posts/first-game.md`, `content/posts/editing-tips.md` (검증용 픽스처 겸 더미)
- Modify: `package.json` (vitest 스크립트), Create: `vitest.config.ts`

**Interfaces:**
- Produces:
  - `lib/categories.ts`: `CATEGORY_META: Record<string,{label:string;color:string}>`, `categoryMeta(key:string)`.
  - `lib/content.ts`: `type Doc = { slug:string; title:string; date:string; category:string; summary?:string; tags?:string[]; tools?:string[]; links?:Record<string,string>; thumbnail?:string; html:string }`. 함수 `getContent(collection:'projects'|'posts'): Doc[]`(날짜 내림차순, draft 제외), `getOne(collection, slug): Doc`.

- [ ] **Step 1: 의존성 설치**

Run: `npm install gray-matter marked && npm install -D vitest`
Expected: 설치 성공.

- [ ] **Step 2: vitest 설정 + 스크립트**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node" } });
```
`package.json`의 `scripts`에 추가: `"test": "vitest run"`.

- [ ] **Step 3: 카테고리 상수 작성**

`lib/categories.ts`:
```ts
export const CATEGORY_META: Record<string, { label: string; color: string }> = {
  dev: { label: "코딩", color: "var(--sky)" },
  creative: { label: "창작", color: "var(--coral)" },
  "dev-log": { label: "코딩 일기", color: "var(--sky)" },
  making: { label: "창작 일기", color: "var(--coral)" },
  thoughts: { label: "그냥 생각", color: "var(--mustard)" },
};
export function categoryMeta(key: string) {
  return CATEGORY_META[key] ?? { label: key, color: "var(--mint)" };
}
export const VALID: Record<string, string[]> = {
  projects: ["dev", "creative"],
  posts: ["dev-log", "making", "thoughts"],
};
```

- [ ] **Step 4: 픽스처 더미 콘텐츠 4개 작성**

`content/projects/typing-game.md`:
```markdown
---
title: 미니 타자 게임
summary: 파이썬으로 만든 첫 게임
category: dev
tags: [Python, Pygame]
date: 2026-06-20
tools: [Python, Pygame]
draft: false
---

떨어지는 단어를 타이핑하는 간단한 게임을 파이썬으로 만들어봤어요.
```
`content/projects/this-site.md` (category: dev, date: 2026-06-25, title: 이 포트폴리오 사이트).
`content/posts/first-game.md`:
```markdown
---
title: 처음으로 게임을 만들어봤다
date: 2026-06-20
category: dev-log
tags: [회고]
summary: 만들면서 부딪힌 것들
draft: false
---

처음 게임을 만들면서 배운 것들을 적어봤어요.
```
`content/posts/editing-tips.md` (category: making, date: 2026-06-12, title: 영상 편집하며 배운 것들).

- [ ] **Step 5: 실패하는 테스트 작성**

`lib/content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getContent, getOne, validateFrontmatter } from "./content";

describe("getContent", () => {
  it("날짜 내림차순으로 프로젝트를 반환한다", () => {
    const items = getContent("projects");
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0].date >= items[1].date).toBe(true);
  });
  it("본문을 html로 변환한다", () => {
    const items = getContent("posts");
    expect(items[0].html).toContain("<p>");
  });
});

describe("getOne", () => {
  it("slug로 하나를 찾는다", () => {
    const doc = getOne("projects", "typing-game");
    expect(doc.title).toBe("미니 타자 게임");
  });
});

describe("validateFrontmatter", () => {
  it("date 누락 시 한국어 에러를 던진다", () => {
    expect(() =>
      validateFrontmatter("content/posts/x.md", "posts", { title: "t", category: "dev-log" })
    ).toThrow(/date/);
  });
  it("잘못된 category는 에러를 던진다", () => {
    expect(() =>
      validateFrontmatter("content/posts/x.md", "posts", { title: "t", date: "2026-01-01", category: "wrong" })
    ).toThrow(/category/);
  });
});
```

- [ ] **Step 6: 테스트 실패 확인**

Run: `npm test`
Expected: FAIL — `lib/content.ts` 미작성으로 import 에러.

- [ ] **Step 7: `lib/content.ts` 구현**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { VALID } from "./categories";

export type Collection = "projects" | "posts";
export type Doc = {
  slug: string; title: string; date: string; category: string;
  summary?: string; tags?: string[]; tools?: string[];
  links?: Record<string, string>; thumbnail?: string; html: string;
};

const ROOT = path.join(process.cwd(), "content");
const SLUG_RE = /^[a-z0-9-]+$/;

export function validateFrontmatter(
  file: string, collection: Collection, data: Record<string, unknown>
) {
  if (!data.title) throw new Error(`${file}: title이 없어요. 맨 위에 "title: 제목" 을 추가하세요.`);
  if (!data.date) throw new Error(`${file}: date가 없어요. 맨 위에 "date: 2026-06-29" 형식으로 추가하세요.`);
  if (!data.category) throw new Error(`${file}: category가 없어요. 허용값: ${VALID[collection].join(", ")}`);
  if (!VALID[collection].includes(String(data.category)))
    throw new Error(`${file}: category "${data.category}"는 잘못됐어요. 허용값: ${VALID[collection].join(", ")}`);
}

export function getContent(collection: Collection): Doc[] {
  const dir = path.join(ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      if (!SLUG_RE.test(slug))
        throw new Error(`content/${collection}/${f}: 파일명은 영문 소문자-하이픈만 쓰세요(현재: ${slug}).`);
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      validateFrontmatter(`content/${collection}/${f}`, collection, data);
      return {
        slug,
        title: String(data.title),
        date: String(data.date),
        category: String(data.category),
        summary: data.summary as string | undefined,
        tags: data.tags as string[] | undefined,
        tools: data.tools as string[] | undefined,
        links: data.links as Record<string, string> | undefined,
        thumbnail: data.thumbnail as string | undefined,
        html: marked.parse(content) as string,
        _draft: data.draft === true,
      } as Doc & { _draft: boolean };
    })
    .filter((d) => !(d as Doc & { _draft: boolean })._draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getOne(collection: Collection, slug: string): Doc {
  const found = getContent(collection).find((d) => d.slug === slug);
  if (!found) throw new Error(`${collection}/${slug} 를 찾을 수 없어요.`);
  return found;
}
```

- [ ] **Step 8: 테스트 통과 확인**

Run: `npm test`
Expected: PASS (모든 테스트 통과).

- [ ] **Step 9: 커밋**

```bash
git add lib content/projects content/posts package.json package-lock.json vitest.config.ts
git commit -m "feat: add markdown content library with frontmatter validation"
```

---

## Task 5: 프로젝트 목록 + 카드 + 필터

**Files:**
- Create: `components/ContentCard.tsx`, `components/ContentFilter.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/page.tsx` (홈 최근 작업 연결)

**Interfaces:**
- Consumes: `getContent`, `categoryMeta`, `Doc`.
- Produces: `ContentCard({doc, basePath})`, `ContentFilter({items, basePath, categories})` (클라이언트, URL `?cat=` 토글).

- [ ] **Step 1: ContentCard 작성**

`components/ContentCard.tsx`:
```tsx
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
```

- [ ] **Step 2: ContentFilter (클라이언트, URL 보존, 깊이 활성) 작성**

`components/ContentFilter.tsx`:
```tsx
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
        <p style={{ color: "var(--muted)" }}>해당하는 게 아직 없어요. ‘전체’를 눌러 보세요.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {shown.map((d) => <ContentCard key={d.slug} doc={d} basePath={basePath} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 프로젝트 목록 페이지 작성**

`app/projects/page.tsx`:
```tsx
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
```

- [ ] **Step 4: EmptyState 작성**

`components/EmptyState.tsx`:
```tsx
export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="nb-card p-6 text-center" style={{ color: "var(--muted)" }}>{message}</div>
  );
}
```

- [ ] **Step 5: 홈 최근 작업 연결**

`app/page.tsx`의 최근 섹션 자리에 추가(파일 상단 import + 프로필 카드 아래):
```tsx
import { getContent } from "@/lib/content";
import ContentCard from "@/components/ContentCard";
// ... 컴포넌트 내부, 최상위:
  const recentProjects = getContent("projects").slice(0, 2);
// ... 프로필 카드 div 다음에:
  {recentProjects.length > 0 && (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[14px] font-medium">최근 작업</span>
        <a href="/projects" className="text-[12px] underline">전체 보기 →</a>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {recentProjects.map((d) => <ContentCard key={d.slug} doc={d} basePath="/projects" />)}
      </div>
    </section>
  )}
```

- [ ] **Step 6: 빌드 + 검증**

Run: `npm run build && npx serve out`
Expected: `/projects`에 카드 2개 + 필터 칩(전체·코딩·창작). 칩 클릭 시 필터링되고 활성칩이 두꺼운 테두리/그림자로 표시. 홈에 최근 작업 2개 노출.

- [ ] **Step 7: 커밋**

```bash
git add components app/projects/page.tsx app/page.tsx
git commit -m "feat: add projects list, content card, and filter"
```

---

## Task 6: 프로젝트 상세 `/projects/[slug]`

**Files:**
- Create: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getContent`, `getOne`, `categoryMeta`.
- Produces: 정적 생성 상세 페이지 + `generateMetadata`.

- [ ] **Step 1: Next 16 동적 라우트 문서 확인**

Run: `sed -n '1,40p' node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`
Expected: `params: Promise<{ slug: string }>` + `await params` 패턴 확인.

- [ ] **Step 2: 상세 페이지 작성 (generateStaticParams + async params)**

`app/projects/[slug]/page.tsx`:
```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getContent, getOne } from "@/lib/content";
import { categoryMeta } from "@/lib/categories";

export function generateStaticParams() {
  return getContent("projects").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const doc = getOne("projects", slug);
  return {
    title: doc.title,
    description: doc.summary,
    openGraph: { images: [doc.thumbnail ?? "/og.png"] },
  };
}

export default async function ProjectDetail(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const doc = getOne("projects", slug);
  const cat = categoryMeta(doc.category);
  return (
    <article>
      <Link href="/projects" className="text-[12px] underline">← 목록으로</Link>
      <div className="mt-3 flex items-center gap-2">
        <span className="nb-border rounded px-2 py-[1px] text-[11px]"
              style={{ background: cat.color, borderWidth: 1.5 }}>{cat.label}</span>
        <span className="nb-display text-[11px]" style={{ color: "var(--muted)" }}>{doc.date}</span>
      </div>
      <h1 className="nb-display mt-2 text-[24px]">{doc.title}</h1>
      {doc.tools && (
        <div className="mt-2 flex flex-wrap gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
          {doc.tools.map((t) => <span key={t} className="nb-display">{t}</span>)}
        </div>
      )}
      <div className="prose mt-5 max-w-none" style={{ lineHeight: 1.75 }}
           dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
```

- [ ] **Step 3: 빌드 + 정적 경로 검증**

Run: `npm run build`
Expected: 빌드 로그에 `/projects/typing-game`, `/projects/this-site` 정적 생성. `out/projects/typing-game/index.html` 존재 확인: `ls out/projects/typing-game/`.

- [ ] **Step 4: 시각 검증**

Run: `npx serve out` → `/projects` 카드 클릭
Expected: 상세에 제목·카테고리·날짜·본문 렌더. "← 목록으로" 동작.

- [ ] **Step 5: 커밋**

```bash
git add app/projects/[slug]/page.tsx
git commit -m "feat: add project detail page with static params"
```

---

## Task 7: 블로그 목록 + 상세

**Files:**
- Modify: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Modify: `app/page.tsx` (홈 최근 글 연결)

**Interfaces:**
- Consumes: Task 4·5의 `getContent`/`getOne`/`ContentFilter`/`ContentCard`. (재사용 — 동일 컴포넌트.)

- [ ] **Step 1: 블로그 목록 페이지**

`app/blog/page.tsx`:
```tsx
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
```

- [ ] **Step 2: 블로그 상세 페이지**

`app/blog/[slug]/page.tsx`:
```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getContent, getOne } from "@/lib/content";
import { categoryMeta } from "@/lib/categories";

export function generateStaticParams() {
  return getContent("posts").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const doc = getOne("posts", slug);
  return { title: doc.title, description: doc.summary,
           openGraph: { images: [doc.thumbnail ?? "/og.png"] } };
}

export default async function PostDetail(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const doc = getOne("posts", slug);
  const cat = categoryMeta(doc.category);
  return (
    <article>
      <Link href="/blog" className="text-[12px] underline">← 목록으로</Link>
      <div className="mt-3 flex items-center gap-2">
        <span className="nb-border rounded px-2 py-[1px] text-[11px]"
              style={{ background: cat.color, borderWidth: 1.5 }}>{cat.label}</span>
        <span className="nb-display text-[11px]" style={{ color: "var(--muted)" }}>{doc.date}</span>
      </div>
      <h1 className="nb-display mt-2 text-[24px]">{doc.title}</h1>
      <div className="prose mt-5 max-w-none" style={{ lineHeight: 1.75 }}
           dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
```

- [ ] **Step 3: 홈 최근 글 연결**

`app/page.tsx`의 최근 작업 섹션 아래에 추가:
```tsx
  const recentPosts = getContent("posts").slice(0, 2);
// ...JSX:
  {recentPosts.length > 0 && (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[14px] font-medium">최근 글</span>
        <a href="/blog" className="text-[12px] underline">전체 보기 →</a>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {recentPosts.map((d) => <ContentCard key={d.slug} doc={d} basePath="/blog" />)}
      </div>
    </section>
  )}
```

- [ ] **Step 4: 빌드 + 검증**

Run: `npm run build && npx serve out`
Expected: `/blog` 목록 + 필터(전체·코딩 일기·창작 일기·그냥 생각), 상세 동작, 홈에 최근 글 2개. `ls out/blog/first-game/` 존재.

- [ ] **Step 5: 커밋**

```bash
git add app/blog app/page.tsx
git commit -m "feat: add blog list and detail pages"
```

---

## Task 8: 소개 · 연락처 · 404

**Files:**
- Modify: `app/about/page.tsx`, `app/contact/page.tsx`
- Create: `app/not-found.tsx`

**Interfaces:**
- Consumes: 토큰. (정적 콘텐츠 — 실제 문구는 §3.4 잠정값.)

- [ ] **Step 1: 소개 페이지**

`app/about/page.tsx`:
```tsx
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
```

- [ ] **Step 2: 연락처 페이지**

`app/contact/page.tsx`:
```tsx
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
```

- [ ] **Step 3: 404 페이지 (순수 정적, 분기점)**

`app/not-found.tsx`:
```tsx
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
```

- [ ] **Step 4: 빌드 + 검증**

Run: `npm run build && npx serve out`
Expected: `/about`·`/contact` 렌더. `ls out/404.html` 존재. 없는 주소(`/zzz`) 접속 시 404 페이지 + 홈/프로젝트/블로그 버튼.

- [ ] **Step 5: 커밋**

```bash
git add app/about/page.tsx app/contact/page.tsx app/not-found.tsx
git commit -m "feat: add about, contact, and 404 pages"
```

---

## Task 9: SEO 마무리 — sitemap · robots · favicon · OG

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg`, `public/og.png`

**Interfaces:**
- Consumes: `getContent`. (정적 export에서 sitemap/robots가 파일로 생성되는지 검증.)

- [ ] **Step 1: 메타데이터/sitemap 문서 확인**

Run: `sed -n '1,40p' node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`
Expected: `MetadataRoute.Sitemap` 반환 형태 확인.

- [ ] **Step 2: sitemap.ts**

```ts
import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

const BASE = "https://kanglena.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls = ["", "/about", "/projects", "/blog", "/contact"].map((p) => ({ url: `${BASE}${p}` }));
  const projects = getContent("projects").map((d) => ({ url: `${BASE}/projects/${d.slug}` }));
  const posts = getContent("posts").map((d) => ({ url: `${BASE}/blog/${d.slug}` }));
  return [...staticUrls, ...projects, ...posts];
}
```

- [ ] **Step 3: robots.ts**

```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://kanglena.github.io/sitemap.xml" };
}
```

- [ ] **Step 4: favicon (app/icon.svg) — 폴더 모티프**

`app/icon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect x="2" y="2" width="28" height="28" rx="6" fill="#f5cf52" stroke="#1a1a1a" stroke-width="2.5"/>
  <text x="16" y="22" font-size="16" font-family="monospace" font-weight="700" text-anchor="middle" fill="#1a1a1a">강</text>
</svg>
```

- [ ] **Step 5: OG 이미지 자리 채우기**

`public/og.png` (1200×630)를 둔다. 임시로 단색+이름 들어간 PNG 생성:
Run: `node -e "const f=require('fs'); f.mkdirSync('public',{recursive:true});" ` (public 보장) — 그리고 디자인 OG를 못 만들면 임시로 1×1이 아닌 실제 1200×630 단색 PNG를 둔다(강인아 사이트 색 #f3eee1 배경 + 텍스트). *디자인 자산이 없으면 이 스텝은 "placeholder OG 1장 배치"로 충분; 추후 교체.*

- [ ] **Step 6: 빌드 + 산출물 검증**

Run: `npm run build`
Expected: `ls out/sitemap.xml out/robots.txt out/og.png` 모두 존재. `out/index.html`에 `<html lang="ko">` 및 og 메타태그 포함(`grep -o 'lang="ko"' out/index.html`).

- [ ] **Step 7: 커밋**

```bash
git add app/sitemap.ts app/robots.ts app/icon.svg public/og.png
git commit -m "feat: add sitemap, robots, favicon, and OG image"
```

---

## Task 10: 반응형 — 모바일 하단 탭바 + 앱바

**Files:**
- Modify: `components/AppShell.tsx`, `components/SideNav.tsx`
- Create: `components/MobileTabBar.tsx`

**Interfaces:**
- Consumes: `NAV_ITEMS`. (데스크톱 사이드바와 동일 데이터, 다른 배치.)

- [ ] **Step 1: MobileTabBar 작성 (하단 고정, safe-area)**

`components/MobileTabBar.tsx`:
```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./SideNav";

export default function MobileTabBar() {
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <nav aria-label="메뉴" className="sm:hidden fixed inset-x-0 bottom-0 z-50 grid grid-cols-5"
         style={{ background: "var(--paper)", borderTop: "2.5px solid var(--ink)",
                  paddingBottom: "env(safe-area-inset-bottom)" }}>
      {NAV_ITEMS.map((it) => {
        const on = isActive(it.href);
        return (
          <Link key={it.href} href={it.href} aria-current={on ? "page" : undefined}
            className="flex flex-col items-center justify-center py-2 text-[11px]"
            style={{ background: on ? "var(--mint)" : "transparent",
                     minHeight: 56, borderRight: "1px solid var(--ink)" }}>
            <span aria-hidden style={{ fontSize: 18 }}>{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: AppShell에 모바일 탭바 + 하단 여백 추가**

`components/AppShell.tsx`의 `<main>`에 모바일 하단 여백(탭바 가림 방지)과 탭바 삽입:
```tsx
// main에 클래스 추가: pb-20 sm:pb-6
<main className="min-w-0 flex-1 p-4 sm:p-6 pb-20 sm:pb-6">{children}</main>
// 최상위 div 안 끝부분에 추가:
import MobileTabBar from "./MobileTabBar";
// ...JSX 맨 끝(닫는 div 직전):
<MobileTabBar />
```
모바일 타이틀바는 그대로 두되 `C:\…` 경로는 좁은 폭에서 `truncate`. (장식이라 숨겨도 됨: 타이틀바 경로 span에 `className="hidden xs:inline"` 대신 `truncate max-w-[55%]`.)

- [ ] **Step 3: 모바일 검증 (375px)**

Run: `npm run build && npx serve out`, 브라우저를 375px 폭으로(또는 모바일 에뮬레이션)
Expected: 좌측 사이드바 숨김 + **하단 5탭 바** 노출, 활성 탭 민트. 본문이 탭바에 가리지 않음. 카드 그리드가 좁은 폭에서 깨지지 않음. 데스크톱(≥640px)은 사이드바 그대로.

- [ ] **Step 4: 커밋**

```bash
git add components/MobileTabBar.tsx components/AppShell.tsx components/SideNav.tsx
git commit -m "feat: add mobile bottom tab bar navigation"
```

---

## Task 11: GitHub Pages 자동 배포 + 콘텐츠 작성 가이드

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `content/README.md`, `content/projects/_template.md`, `content/posts/_template.md`

**Interfaces:**
- Consumes: `npm run build`. (산출물 `out/` → Pages 아티팩트.)

- [ ] **Step 1: 배포 워크플로 작성**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - run: touch out/.nojekyll
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: out }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 콘텐츠 템플릿 작성**

`content/projects/_template.md`:
```markdown
---
title: 여기에 제목
summary: 한 줄 설명
category: dev   # dev=코딩, creative=창작
tags: [태그1, 태그2]
date: 2026-06-29   # 반드시 YYYY-MM-DD
tools: [사용한 도구]
draft: true   # 다 쓰면 false 로 바꾸세요
---

여기에 내용을 써요. 사진은 ![설명](/images/이름.png) 으로 넣어요.
```
`content/posts/_template.md` (category 주석을 `dev-log/making/thoughts`로).

- [ ] **Step 3: 작성 가이드 README**

`content/README.md`:
```markdown
# 글·작품 추가하는 법

## 미리보기 (제일 중요)
- 글 쓸 때: `npm run dev` → 저장하면 바로 새로고침
- 올리기 전 최종 확인: `npm run build && npx serve out`  (결과는 `out/` 폴더)

## 새 글 추가 3단계
1. `_template.md` 를 복사해서 새 파일을 만든다 (파일명 = 영문 소문자-하이픈, 예: `my-game.md`)
2. 맨 위 정보(제목·날짜·분류)와 내용을 고친다
3. `draft: false` 로 바꾸고 저장 → `git add . && git commit && git push` 하면 자동 배포

## 자주 틀리는 것
| 되는 것 | 안 되는 것 |
|---|---|
| `date: 2026-06-29` | `date: 2026-6-9` (자리수 맞추기) |
| `title: "제목: 부제"` (콜론 있으면 따옴표) | `title: 제목: 부제` |
| `tags: [회고, Python]` | `tags: 회고, Python` (대괄호 빼먹기) |
| 파일명 `my-game.md` | 파일명 `내 게임.md` (한글·공백 금지) |

## 사진
- `public/images/` 에 넣고 `/images/이름.png` 로 부른다 (맨 앞 슬래시 포함)
- 올리기 전 가로 1200px 이하 + 1MB 넘으면 squoosh.app 에서 압축
```

- [ ] **Step 4: 빌드 확인 + 커밋**

Run: `npm run build && touch out/.nojekyll && ls out/.nojekyll`
Expected: 빌드 성공, `.nojekyll` 생성 확인.

```bash
git add .github content/README.md content/projects/_template.md content/posts/_template.md
git commit -m "ci: add GitHub Pages deploy workflow and content guide"
```

- [ ] **Step 5: 최초 1회 수동 설정 (사람이 함 — 문서로 안내)**

GitHub 저장소 → Settings → Pages → Source = **"GitHub Actions"**.
push 후 Actions 탭에서 배포 성공 확인 → `https://kanglena.github.io/` 접속.
**흰 화면이면:** 개발자도구 콘솔에서 `_next` 404 확인 → `.nojekyll` 단계 점검.

---

## Task 12 (보너스): 터미널

**Files:**
- Create: `components/Terminal.tsx`, `app/terminal/page.tsx`
- Modify: `components/SideNav.tsx` (터미널 항목 추가, 선택)

**Interfaces:**
- Consumes: `useRouter`. (1~11 완료·배포 후 착수. v1에서 빠져도 사이트는 완전.)

- [ ] **Step 1: Terminal 컴포넌트 (한국어 입말, 명령어 칩)**

`components/Terminal.tsx`:
```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ROUTES: Record<string, string> = {
  about: "/about", projects: "/projects", blog: "/blog", contact: "/contact",
};

export default function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<string[]>(["안녕하세요! 명령어를 입력하거나 아래 칩을 눌러보세요. (help)"]);
  const [val, setVal] = useState("");

  const run = (cmd: string) => {
    const c = cmd.trim().toLowerCase();
    if (ROUTES[c]) { router.push(ROUTES[c]); return; }
    if (c === "help") setLines((l) => [...l, "$ help", "about · projects · blog · contact · whoami · clear"]);
    else if (c === "whoami") setLines((l) => [...l, "$ whoami", "강인아 · 중2 · 만드는 사람"]);
    else if (c === "clear") setLines([]);
    else setLines((l) => [...l, `$ ${c}`, `음, ${c}는 모르는 명령이에요. help를 쳐 보세요.`]);
  };

  return (
    <div>
      <div className="nb-card nb-display p-3 text-[13px]" style={{ minHeight: 160 }}>
        {lines.map((ln, i) => <div key={i}>{ln}</div>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["help", "whoami", "about", "projects", "blog"].map((c) => (
          <button key={c} onClick={() => run(c)} className="nb-border nb-display rounded px-3 py-[5px] text-[12px]"
            style={{ background: "var(--paper)" }}>{c}</button>
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); run(val); setVal(""); }}>
        <input aria-label="명령어 입력" value={val} onChange={(e) => setVal(e.target.value)}
          className="nb-border nb-display flex-1 rounded px-3 py-2 text-[13px]" style={{ background: "var(--paper)" }} />
        <button className="nb-border nb-shadow-sm rounded px-4 text-[13px]" style={{ background: "var(--mint)" }}>실행</button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: 터미널 페이지**

`app/terminal/page.tsx`:
```tsx
import Terminal from "@/components/Terminal";
export default function TerminalPage() {
  return (
    <div>
      <h1 className="nb-display mb-4 text-[22px]">터미널</h1>
      <Terminal />
    </div>
  );
}
```

- [ ] **Step 3: 빌드 + 검증**

Run: `npm run build && npx serve out` → `/terminal`
Expected: 명령어 칩 클릭/입력 동작. `projects` 입력 시 프로젝트로 이동. `clear`로 비움. 모르는 명령에 한국어 안내.

- [ ] **Step 4: 커밋**

```bash
git add components/Terminal.tsx app/terminal/page.tsx components/SideNav.tsx
git commit -m "feat: add bonus terminal page"
```

---

## Self-Review 결과 (작성자 점검)

- **Spec 커버리지:** §4.1 정적export→T1·T9·T11 / §4.2 콘텐츠파이프라인→T4 / §4.4 async params→T6·T7 / §3.3 토큰·카테고리→T1·T4·T5 / §3.4 목소리→전 페이지 카피 / §5 셸·홈→T2·T3 / §6 인터랙션·필터·터미널→T5·T6·T12 / §7 SEO→T1·T9 / §9 반응형→T10 / §10 빈상태·404→T5·T8 / §11 테스트→T4(+각 빌드 게이트) / §13 순서→Task 순서 / §14 작성가이드→T11. 누락 없음.
- **Placeholder 점검:** OG 이미지(T9 S5)는 자산 부재 시 "placeholder 1장 배치"로 명시 — 코드 placeholder 아님. 그 외 모든 코드 스텝은 실제 코드 포함.
- **타입 일관성:** `Doc`·`getContent`·`getOne`·`categoryMeta`·`NAV_ITEMS`·`ContentCard({doc,basePath})`·`ContentFilter({items,basePath,categories})`가 정의 태스크(T4·T5)와 사용 태스크(T5·T6·T7) 간 시그니처 일치 확인.

## 열린 결정 (구현 무관 — 강인아가 나중에 카피만 교체)
spec §16 참조: 사이드바 4개(기본) / 잠정 말투 그대로 / 프로필 이니셜 "강". 모두 코드 변경 거의 없이 교체 가능.

# 강인아 (Lena) — 포트폴리오

대치중학교 2학년 학생 개발자 **강인아(Lena)** 의 개인 포트폴리오 사이트입니다.
한 페이지 스크롤형으로, 애니메이션 터미널 히어로 · 소개 · 대표 프로젝트(가온케어) · 연락처로 구성됩니다. 한국어/영어 전환을 지원합니다.

**라이브:** https://kanglena.github.io/

## 기술 스택

- **Next.js 16** (App Router) · React 19 · TypeScript
- **정적 export** (`output: 'export'`) → `out/` 폴더 → **GitHub Pages** 무료 배포
- 폰트: **Space Grotesk** + **JetBrains Mono** (`next/font`로 self-host)
- 디자인: Claude Design에서 만든 시안을 React로 재현 — `components/LenaPortfolio.tsx`

## 내용 수정하는 법 (코딩 몰라도 OK)

거의 모든 **텍스트·링크**는 `components/LenaPortfolio.tsx` 맨 위의 `I18N`(한/영) · `heroData` 객체에 모여 있어요. 그 값만 바꾸면 됩니다.

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 이메일 / GitHub / 인스타 | `I18N.ko.contact` · `I18N.en.contact` 의 `email`, `github`, `githubUrl`, `insta`, `instaUrl` |
| 프로젝트(가온케어) 설명 | `I18N.*.proj` |
| 자기소개 문구 | `I18N.*.about` |
| 히어로 터미널/코드 내용 | `heroData.*` |
| 스킬 칩 | 파일 안 `SKILLS` 배열 |
| 대표 프로젝트 이미지 | `public/projects/gaon-care-hero.png` 교체 |

> 현재 이메일·GitHub·인스타는 임시값(`lena@example.com`, `github.com/lena`, `@lena`)입니다. 실제 값으로 바꿔 주세요.

## 로컬에서 보기

```bash
# 작업하면서 미리보기 (저장하면 바로 새로고침)
npm run dev          # → http://localhost:3000

# 올리기 전 최종 확인 (실제 배포 결과물 그대로)
npm run build && npx serve out   # 결과물은 .next 가 아니라 out/
```

## 배포 (GitHub Pages)

1. GitHub 저장소 → **Settings → Pages → Source = "GitHub Actions"** (최초 1회만)
2. `main` 브랜치에 push → `.github/workflows/deploy.yml` 이 자동으로 빌드·배포 → https://kanglena.github.io/
3. 흰 화면이 뜨면: 브라우저 콘솔에서 `_next` 404 확인 → 배포 워크플로의 `.nojekyll` 단계 점검

## 참고

초기에 함께 탐색했던 다른 방향(레트로 데스크톱 OS 컨셉)은 `feat/portfolio-site` 브랜치와 `docs/superpowers/` 에 설계 문서까지 그대로 보존돼 있습니다.

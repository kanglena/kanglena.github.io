# 강인아 (Lena) — 포트폴리오

대치중학교 2학년 학생 개발자 **강인아(Lena)** 의 개인 포트폴리오 사이트입니다.
한 페이지 스크롤형으로, **직접 입력해볼 수 있는 터미널 히어로** · 소개 · 대표 프로젝트(가온케어) · 연락처로 구성됩니다. 한국어/영어 전환을 지원합니다.

**라이브:** https://kanglena.github.io/

## 주요 기능

- **인터랙티브 터미널 히어로** — 방문자가 실제로 명령어를 칠 수 있어요. `help` · `whoami` · `cat profile.txt` · `about` · `work` · `contact` · `home` · `clear`. 정보 명령은 결과를 출력하고, 섹션 명령은 해당 섹션으로 부드럽게 스크롤됩니다. 치는 도중 `Tab`으로 자동완성돼요.
- **어디서든 이어지는 터미널** — 히어로를 지나 스크롤하면 화면 하단에 미니 터미널이 떠서, 클릭 없이 계속 명령어로 섹션을 옮겨 다닐 수 있어요. 명령으로 이동하면 입력 포커스도 함께 따라가고, `home`으로 맨 위로 돌아갑니다.
- **히어로 화면 3종**(터미널 / 에디토리얼 / 코드) — 터미널 창 제목줄의 `term · edit · code` 탭으로 전환
- **한국어 ↔ 영어** 토글 (선택은 브라우저에 저장돼 다음에 다시 와도 유지)
- **접근성** — 키보드 포커스 표시, 색 대비(WCAG AA), "모션 줄이기(prefers-reduced-motion)" 설정 존중

## 기술 스택

- **Next.js 16** (App Router) · React 19 · TypeScript
- **정적 export** (`output: 'export'`) → `out/` 폴더 → **GitHub Pages** 무료 배포
- 폰트: **Space Grotesk** + **JetBrains Mono** (`next/font`로 self-host)
- 디자인: Claude Design 시안을 React로 재현 — UI 전체가 `components/LenaPortfolio.tsx` 한 파일에 있어요

## 내용 수정하는 법 (코딩 몰라도 OK)

거의 모든 **텍스트·링크**는 `components/LenaPortfolio.tsx` 맨 위쪽에 모여 있어요. 그 값만 바꾸면 됩니다.

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 이메일 / GitHub 표시 글자 | `I18N.ko.contact` · `I18N.en.contact` 의 `email`, `github` |
| GitHub 링크 주소 | 파일 상단 `GITHUB_URL` 상수 |
| 프로젝트(가온케어) 설명 | `I18N.*.proj` |
| 자기소개 문구 | `I18N.*.about` |
| 히어로 터미널/코드 애니메이션 내용 | `heroData.*` |
| 터미널 명령어 안내문 / 자동완성 목록 | `TERM` (한/영 안내 문구) · `COMMANDS` (자동완성 후보) |
| 터미널 닉네임 (`lena@portfolio`) | 파일 상단 `PROMPT` 상수 |
| 스킬 칩 | `SKILLS` 배열 |
| 대표 프로젝트 이미지 | `public/projects/gaon-care-hero.png` 교체 |

> 현재 연락처는 **실제 값**이 들어가 있어요 — 이메일 `lenakang0002@gmail.com`, GitHub `github.com/kanglena`. 바꾸려면 위 표의 위치에서 수정하세요.

## 로컬에서 보기

```bash
# 작업하면서 미리보기 (저장하면 바로 새로고침)
npm run dev          # → http://localhost:3000

# 올리기 전 최종 확인 (실제 배포 결과물 그대로)
npm run build && npx serve out   # 결과물은 .next 가 아니라 out/
```

## 배포 (GitHub Pages)

`main` 브랜치에 push하면 **자동으로 빌드·배포**됩니다 — `.github/workflows/deploy.yml` (push → `npm run build` → `out/` → GitHub Pages).

1. (최초 1회) GitHub 저장소 → **Settings → Pages → Source = "GitHub Actions"**
2. `main` 에 push (또는 PR 머지) → 워크플로가 빌드 후 https://kanglena.github.io/ 에 반영
3. 진행 상황은 저장소 **Actions** 탭에서 확인. 흰 화면이 뜨면 브라우저 콘솔에서 `_next` 404를 확인하고 워크플로의 `.nojekyll` 단계를 점검하세요.

## 작업 방식

각 단계는 `main`에서 새 브랜치를 따서 작업한 뒤 **PR로 `main`에 머지**합니다. PR이 머지되면 위 워크플로로 자동 배포돼요.

## 참고

초기에 함께 탐색했던 다른 방향(레트로 데스크톱 OS 컨셉)의 설계 문서는 `docs/superpowers/` 에 보존돼 있습니다.

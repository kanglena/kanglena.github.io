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

# Handoff: 친구 생일 페이지 — 메인 화면 (디자인)

## 📌 Overview

친구 생일 페이지의 **메인 화면 (잠금 해제 후 친구들이 보는 페이지)** 디자인 명세입니다. 한 화면에 모든 콘텐츠가 길게 스크롤되는 구조 — 상단부터 친구 사진, 축하 문구, 카운트다운, CTA, 친구들의 축하글 3개 미리보기, 사진 갤러리 미리보기, 호스트 노트 순서.

순수 프론트엔드 디자인 명세입니다. 데이터(축하글·사진·친구 정보)는 호스트 프로젝트의 기존 fetch 패턴을 따르세요.

---

## 🎯 About the Design Files

이 번들에 포함된 `.jsx` 파일들은 **디자인 레퍼런스 (HTML 프로토타입)** 입니다 — 인라인 스타일과 React 18 (UMD)로 만들어진 시각적 명세이고, 그대로 프로덕션에 옮기는 코드가 아닙니다.

**해야 할 일:**
- Next.js 14 (App Router) + TypeScript + Tailwind CSS로 **새로 구현**
- 인라인 스타일은 **Tailwind 유틸리티 클래스로 변환**
- 카운트다운/N번째 생일 계산 로직만 그대로 포팅

---

## ✨ Fidelity

**High-fidelity (hifi)** — 픽셀 단위로 컬러·타이포·스페이싱·인터랙션이 정의되어 있습니다.

---

## 🛠 Target Stack

| 영역 | 기술 |
|---|---|
| 프레임워크 | **Next.js 14 (App Router)** |
| 언어 | **TypeScript** |
| 스타일링 | **Tailwind CSS** |

---

## 🗂 Screen: 메인 (`/[code]` 라우트 가정)

### 전체 구조 (위 → 아래, 한 페이지 세로 스크롤)

```
┌─────────────────────────────┐
│  [BGM 토글]      [공유 ⋯]   │ ← 상단 바
│                             │
│   HAPPY 25TH BIRTHDAY · OO  │ ← 키커 (액센트 색)
│                             │
│        ┌─────────┐          │
│        │  사진    │          │ ← 240×240 원형 + 회전 점선
│        │ (원형)   │          │
│        └─────────┘          │
│                             │
│   "OO의 25번째 생일을         │ ← 축하 문구 (Display 26px)
│    다 같이 축하해요"          │
│                             │
│  D-DAY까지 남은 시간          │ ← kicker
│  ┌──┬──┬──┬──┐              │
│  │05│12│30│45│              │ ← 카운트다운 (digital)
│  │D │H │M │S │              │
│  └──┴──┴──┴──┘              │
│                             │
│  ┌─────────────────────┐    │
│  │ ✎ 축하 메시지 남기기 │    │ ← 액센트 CTA
│  └─────────────────────┘    │
│                             │
│  친구들의 축하글  전체 보기 → │ ← 섹션 헤더
│  ┌─────────────────────┐    │
│  │ 메시지 카드 1        │    │
│  ├─────────────────────┤    │
│  │ 메시지 카드 2        │    │ ← 3개까지 1열 스택
│  ├─────────────────────┤    │
│  │ 메시지 카드 3        │    │
│  └─────────────────────┘    │
│  [   축하글 더보기   ]      │ ← ghost 버튼
│                             │
│  사진 갤러리      전체 보기 → │
│  ┌──┬──┬──┐                 │
│  │  │  │  │                 │ ← 3열 그리드 (6장 미리보기)
│  ├──┼──┼──┤                 │
│  │  │  │  │                 │
│  └──┴──┴──┘                 │
│                             │
│  MADE BY 호스트              │
│  "호스트가 OO을 위해 만든..."  │ ← 호스트 노트 카드
└─────────────────────────────┘
```

### 1. 상단 바
- padding: `54px 18px 6px` (위 패딩 = status bar 회피)
- 좌우 배치:
  - **BGM 토글 버튼** (pill, 흰색 surface, height 36, padding `0 12px`, `border: 1px solid ${ink}10`, boxShadow 미세)
    - ON: 🎵 아이콘 + "BGM ON"
    - OFF: 🎵🚫 아이콘 + "BGM OFF"
    - 폰트 12px / 600
  - **공유 버튼** (pill, 같은 스타일, 아이콘만 — Share 아이콘)

### 2. 호스트 라벨 (kicker)
- 가운데 정렬, marginTop 12px
- 11px / 600 / `letter-spacing: 0.18em` / uppercase
- 색: 액센트 (사용자 선택 색)
- 텍스트: `HAPPY {nth}TH BIRTHDAY · {FRIEND_NAME_UPPER}` (N번째가 없으면 `HAPPY BIRTHDAY · ...`)

### 3. 친구 사진 (원형)
- 240×240, 가운데 정렬, marginTop 18px
- `border-radius: 9999px` (필름 vibe만 4px, 메인은 minimal 고정이므로 9999)
- 사진 위치 inset, position relative
- **회전 점선 외곽**:
  - position absolute, `inset: -10px`
  - `border: 2px dashed ${accent}77`
  - `border-radius: 9999px`
  - `animation: spin 30s linear infinite`
- 사진 없을 때 placeholder: 45도 줄무늬 패턴 + 점선 보더 + 라벨

### 4. 축하 문구
- margin `24px 24px 0`, 가운데 정렬
- font: Bricolage Grotesque, 26px / 700 / `line-height: 1.25` / `letter-spacing: -0.02em`
- `white-space: pre-line` (줄바꿈 허용)
- 생일 당일이면 `오늘은 {친구이름}의\n생일이에요 🎂`로 자동 전환

### 5. 카운트다운 (digital)
- margin `24px 18px 0`
- kicker: `D-DAY까지 남은 시간` (11px / 600 / 0.18em / 가운데, 색 = ink+88, uppercase)
- 4셀 그리드 (DAYS / HRS / MIN / SEC):
  - background surface, border `1px solid ${ink}10`
  - borderRadius 12 (minimal cardRadius)
  - padding `14px 4px 10px`
  - **숫자**: DM Mono 36px / 500 / `letter-spacing: -0.04em` / `font-variant-numeric: tabular-nums`
  - **라벨**: 9px / 600 / 0.16em, 액센트 색, marginTop 6px
- 생일 당일이면 카운트다운 자리에 `D-DAY` 56px / 800 디스플레이 폰트

### 6. 축하 메시지 남기기 CTA
- margin `28px 18px 0`
- height 64, padding `0 18px`, borderRadius 7.2 (cardRadius * 0.6 — 약 8px)
- background 액센트 색, color 흰색
- boxShadow `0 10px 24px -10px ${accent}`
- 좌측 32×32 흰 반투명 원에 ✎ 아이콘, 우측 라벨/서브:
  - 라벨 "축하 메시지 남기기" (14 / 600)
  - 서브 "{친구이름}에게 한 마디" (11 / opacity 0.7)

### 7. 친구들의 축하글 — 1열 스택 (3개 미리보기)
- 섹션 margin `36px 0 0`
- 헤더:
  - padding `0 24px`, marginBottom 12
  - 좌: "친구들의 축하글" (Display 18 / 700 / -0.01em)
  - 우: "전체 보기 →" (12px / sub 색 / 투명 배경 / 클릭 시 messages 페이지로)
- 카드 리스트: padding `0 18px`, gap 10, flex column
  - 각 카드:
    - background: 메시지마다 다른 파스텔 색 (mock 데이터에 `cardColor` 필드)
    - borderRadius 16, padding `14px 16px`
    - boxShadow `0 4px 12px -8px rgba(0,0,0,0.12)`
    - **본문**: 13 / lineHeight 1.55 / `word-break: keep-all` / `-webkit-line-clamp: 3` (3줄 클램프)
    - 하단 row: 좌측 작성자 이름 (11 / 700 / `ink+cc`), 우측 시간 (10 / `ink+77`)
- **"축하글 더보기" 버튼**:
  - margin `12px 18px 0`
  - width 100%, height 48, borderRadius 999
  - background surface(흰), border `1.5px solid ${ink}15`
  - 13 / 600
  - 클릭 시 `/messages` 라우트로

### 8. 사진 갤러리 — 3열 그리드
- 섹션 margin `36px 0 0`
- 헤더: 축하글과 동일 구조 ("사진 갤러리" + "전체 보기 →")
- 그리드: padding `0 18px`, `grid-template-columns: 1fr 1fr 1fr`, gap 6
  - 6장 미리보기
  - 각 셀: `aspect-ratio: 1`, borderRadius 12, 클릭 시 `/gallery`로

### 9. 호스트 노트 카드
- margin `28px 24px 0`, padding `14px 16px`
- background surface, borderRadius 8.4 (cardRadius * 0.7)
- border `1px solid ${ink}10`
- 상단 kicker: `MADE BY {호스트이름.toUpperCase()}` (10 / 600 / 0.16em / 액센트 색)
- 본문: 13 / lineHeight 1.5 / "{호스트}가 {친구}을 위해 만든 페이지예요. 친구들이 한 마디씩 남길 수 있어요!"

### 페이지 하단
- `paddingBottom: 32px`

### 생일 당일 효과
- 페이지 전체에 `<Confetti count={50} />` 오버레이 (CSS 컨페티 떨어지는 애니메이션)

---

## 🔁 Interactions & Behavior

### BGM 토글
- 클릭 시 음원 재생/일시정지 (실제 구현은 호스트 프로젝트 패턴)
- ON/OFF 아이콘 + 텍스트 즉시 전환

### 공유 버튼
- 클릭 시 공유 시트 띄우기 (Web Share API or 모달)

### 카운트다운
- 1초마다 업데이트 (setInterval)
- 카운트다운 타깃: 친구 출생연도 + 이번/내년 생일 날짜
- 0이 되면 자동으로 "D-DAY" 표시 + Confetti 등장
- 자세한 로직: `frontend/src/lib/getTimeLeft.ts` 참고

### N번째 생일 계산
- 친구 생년월일에서 자동 산출. `frontend/src/lib/calcNthBirthday.ts` 참고

### 축하글 더보기
- 클릭 → `/messages` 라우트로 이동
- 전체 보기 → 도 동일

### 사진 갤러리
- 썸네일 클릭 → `/gallery` 라우트로 이동

---

## 🎨 Design Tokens (Modern Minimal vibe)

| Token | Value | Usage |
|---|---|---|
| `BG` | `#FAFAF7` | 페이지 배경 |
| `SURFACE` | `#FFFFFF` | 카드 배경 |
| `INK` | `#0F0F0F` | 본문 텍스트 |
| `ACCENT` | 사용자 선택 hex | 키커/포인트/CTA |
| `CARD_RADIUS_BASE` | `12px` | 기준 라운드 (minimal) |
| `CARD_SHADOW` | `0 1px 0 rgba(0,0,0,0.04)` | 미세 그림자 |

**파스텔 카드 색상** (축하글 카드 배경 — mock에선 메시지마다 지정):
```
#FFD6E5  #CFE3FF  #FFE7C2  #DCD2FF  #C2F1E2  #FFD0D6
```

### Typography
| Use | Font | Size / Weight |
|---|---|---|
| Display (축하문구, 섹션 헤더) | `'Bricolage Grotesque', 'Pretendard', sans-serif` | 18~26 / 700 / -0.01~-0.02em |
| Body | Pretendard | 13~14 / 400~600 |
| Mono (카운트다운 숫자) | `'DM Mono', monospace` | 36 / 500 / -0.04em / tabular-nums |
| Kicker (HAPPY..., MADE BY...) | (Body) | 10~11 / 600 / 0.16~0.18em / uppercase |

### Spacing
- 페이지 좌우: 18px (콘텐츠), 24px (헤더/큰 마진)
- 섹션 사이 marginTop: **36px**
- 카드 사이 gap: **10px**
- 카드 padding: `14px 16px`

---

## 📁 Files in this Bundle

```
design_handoff_main_page/
├── README.md                    ← 이 문서
├── design_reference/             ← 원본 디자인 (참고용)
│   ├── main-screen.jsx          ← 메인 화면 전체
│   ├── countdown.jsx            ← 카운트다운 컴포넌트 (digital만 사용)
│   └── shared.jsx               ← getTimeLeft, getNthBirthday, Confetti 등
└── frontend/
    ├── README.md                ← Next.js 구현 가이드
    └── src/lib/                 ← 즉시 사용 가능한 .ts
        ├── getTimeLeft.ts       ← 다음 생일까지 카운트
        └── calcNthBirthday.ts   ← N번째 생일 자동 계산
```

---

## 🚀 Implementation Order (추천)

1. `lib/` 두 함수 옮기기 + Tailwind config + 폰트 설정
2. **MainPage 컨테이너** (`/[code]/page.tsx`) — 친구 정보를 props로 받는 구조
3. 위→아래 섹션 하나씩:
   - Header (BGM/공유)
   - HeroPhoto + GreetingText
   - Countdown (1초 인터벌, useEffect)
   - WriteCTA
   - MessagesPreview (1열 스택, 3개 클램프 + 더보기)
   - GalleryPreview (3열 그리드, 6장)
   - HostNote
4. 데이터: 호스트 프로젝트의 fetch 패턴으로 친구·축하글·사진 받아오기
5. Confetti는 생일 당일에만 마운트

---

## ❓ FAQ

- **친구 데이터 구조**: `{ name, birthday (YYYY-MM-DD), greeting, hostName, photoUrl?, accentColor }`
- **메시지 구조**: `{ id, name, text, cardColor, time, hasPhoto? }`
- **갤러리 사진 구조**: `{ id, url, label? }`
- **카운트다운 정밀도**: 초 단위. 페이지 떠 있는 동안 매 초 setState
- **반응형**: 모바일 우선 (375~430). 데스크탑은 가운데 정렬 + max-width 480
- **다국어**: 이번 범위 X

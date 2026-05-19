# Frontend (Next.js 14 + TS + Tailwind) — 메인 화면 구현 가이드

## Setup

```bash
npx create-next-app@14 frontend --typescript --tailwind --app --src-dir --import-alias '@/*'
```

## tailwind.config.ts (메인 화면용 토큰)

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF7',
        surface: '#FFFFFF',
        ink: '#0F0F0F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Pretendard', 'sans-serif'],
        body: ['Pretendard', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        spin: { to: { transform: 'rotate(360deg)' } },
        confetti: {
          '0%':   { transform: 'translateY(-10vh) rotate(0deg)',   opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0.9' },
        },
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        confetti: 'confetti linear forwards',
      },
    },
  },
} satisfies Config;
```

## File Structure

```
src/
├── app/
│   ├── layout.tsx                          (폰트 로드)
│   └── [code]/page.tsx                     (메인 페이지 라우트)
├── components/main/
│   ├── MainScreen.tsx                      (전체 컨테이너)
│   ├── HeaderBar.tsx                       (BGM/공유)
│   ├── HeroPhoto.tsx                       (240×240 + 회전 점선)
│   ├── GreetingText.tsx
│   ├── Countdown.tsx                       (digital 스타일)
│   ├── MessagesPreview.tsx                 (3개 클램프 + 더보기)
│   ├── GalleryPreview.tsx                  (3×2 그리드)
│   ├── HostNote.tsx
│   └── Confetti.tsx                        (생일 당일)
└── lib/
    ├── getTimeLeft.ts                      (포함됨)
    └── calcNthBirthday.ts                  (포함됨)
```

## MainScreen.tsx 골격

```tsx
'use client';
import { useState, useEffect } from 'react';
import { getTimeLeft } from '@/lib/getTimeLeft';
import { calcNthBirthday } from '@/lib/calcNthBirthday';

interface Friend {
  name: string;
  birthday: string;       // YYYY-MM-DD (출생연도)
  greeting: string;
  hostName: string;
  accentColor: string;    // hex
  photoUrl?: string;
}
interface Message {
  id: string;
  name: string;
  text: string;
  cardColor: string;
  time: string;
}
interface Photo {
  id: string;
  url: string;
  label?: string;
}

export default function MainScreen({
  friend,
  messages,
  photos,
}: {
  friend: Friend;
  messages: Message[];
  photos: Photo[];
}) {
  const [time, setTime] = useState(() => getTimeLeft(friend.birthday));
  const [bgmOn, setBgmOn] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(friend.birthday)), 1000);
    return () => clearInterval(t);
  }, [friend.birthday]);

  const nth = calcNthBirthday(friend.birthday);
  const accent = friend.accentColor;

  return (
    <div className="relative min-h-screen bg-bg pb-8 font-body" style={{ '--accent': accent } as any}>
      {time.isPast && <Confetti count={50} />}
      <HeaderBar bgmOn={bgmOn} onToggleBgm={() => setBgmOn(v => !v)} />

      <div
        className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        HAPPY {nth ? `${nth}TH ` : ''}BIRTHDAY · {friend.name.toUpperCase()}
      </div>

      <HeroPhoto photoUrl={friend.photoUrl} accent={accent} friendName={friend.name} />

      <h1 className="mx-6 mt-6 whitespace-pre-line text-center font-display text-[26px] font-bold leading-[1.25] tracking-[-0.02em] text-ink">
        {time.isPast ? `오늘은 ${friend.name}의\n생일이에요 🎂` : friend.greeting}
      </h1>

      <Countdown time={time} accent={accent} />

      <div className="mx-[18px] mt-7">
        <WriteCTA friendName={friend.name} accent={accent} />
      </div>

      <MessagesPreview messages={messages} />

      <GalleryPreview photos={photos} />

      <HostNote hostName={friend.hostName} friendName={friend.name} accent={accent} />
    </div>
  );
}
```

## 인라인 스타일 → Tailwind 매핑

| 디자인 파일 | Tailwind |
|---|---|
| `padding: '54px 18px 6px'` | `pt-[54px] px-[18px] pb-1.5` |
| `borderRadius: 9999` | `rounded-full` |
| `borderRadius: 12` | `rounded-xl` (12) or `rounded-[12px]` |
| `borderRadius: 16` | `rounded-2xl` |
| `letterSpacing: '0.18em'` | `tracking-[0.18em]` |
| `letterSpacing: '-0.02em'` | `tracking-[-0.02em]` |
| `boxShadow: '0 4px 12px -8px rgba(0,0,0,0.12)'` | `shadow-[0_4px_12px_-8px_rgba(0,0,0,0.12)]` |
| `wordBreak: 'keep-all'` | `[word-break:keep-all]` |
| `WebkitLineClamp: 3` | `line-clamp-3` (`@tailwindcss/line-clamp` 또는 v3.3+ 기본) |
| `fontVariantNumeric: 'tabular-nums'` | `tabular-nums` |
| `animation: 'spin 30s linear infinite'` | `animate-spin-slow` (config에 정의) |

## 동적 액센트 색 처리

사용자가 페이지마다 다른 색을 골랐기 때문에 액센트 색은 **inline style이나 CSS 변수**로 처리하세요:

```tsx
// 카드 컴포넌트 최상위에 CSS var 주입
<div style={{ '--accent': friend.accentColor } as React.CSSProperties}>
  {/* 자식에서 사용 */}
  <span style={{ color: 'var(--accent)' }}>키커</span>
  <button style={{ backgroundColor: 'var(--accent)' }}>CTA</button>
</div>
```

또는 Tailwind arbitrary value:
```tsx
<div className={`text-[${accent}]`}>...</div>
// ⚠ Tailwind는 빌드 타임 정적 분석이라 동적 hex는 inline style 추천
```

## Confetti (CSS-only)

```tsx
function Confetti({ count = 50 }: { count?: number }) {
  const colors = ['#FF6B9D', '#FFB84D', '#5AA9FF', '#7C5CFF', '#3DD9B0', '#FF4760'];
  const pieces = Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2.5,
    color: colors[i % colors.length],
    rot: Math.random() * 360,
    size: 6 + Math.random() * 8,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span key={i}
          className="absolute top-0 animate-confetti rounded-[2px]"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size, height: p.size * 1.4,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rot}deg)`,
          }} />
      ))}
    </div>
  );
}
```

## 데이터 페칭

```tsx
// app/[code]/page.tsx (Server Component)
export default async function Page({ params }: { params: { code: string } }) {
  const [friend, messages, photos] = await Promise.all([
    yourApi.getFriend(params.code),
    yourApi.getMessages(params.code),
    yourApi.getPhotos(params.code),
  ]);
  return <MainScreen friend={friend} messages={messages} photos={photos} />;
}
```

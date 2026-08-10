'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StoredUser {
  id: number;
  nickname: string;
  token: string;
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14m-6-6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function HomeCta() {
  // undefined = 아직 localStorage 확인 전(SSR/첫 페인트), null = 비로그인, 값 = 로그인
  const [user, setUser] = useState<StoredUser | null | undefined>(undefined);

  useEffect(() => {
    const raw = localStorage.getItem('birthday-user');
    if (!raw) {
      setUser(null);
      return;
    }
    try {
      setUser(JSON.parse(raw) as StoredUser);
    } catch {
      setUser(null);
    }
  }, []);

  // 로그인된 사용자 → "내 페이지 보기"를 기본 CTA로
  if (user) {
    return (
      <div className="mt-auto flex flex-col gap-3 pt-12">
        <p className="text-center text-[13px] text-sub">
          다시 오셨네요, <span className="font-semibold text-ink">{user.nickname}</span>님
        </p>
        <Link
          href="/my-pages"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-cta bg-ink text-[15px] font-semibold tracking-[-0.01em] text-white transition-opacity duration-150 hover:opacity-90"
        >
          내 페이지 보기
          <ArrowIcon />
        </Link>
        <Link
          href="/start"
          className="text-center text-[13px] text-sub underline-offset-4 hover:underline"
        >
          다른 계정으로 로그인
        </Link>
      </div>
    );
  }

  // 비로그인(또는 확인 전) → 기존 화면 유지
  return (
    <div className="mt-auto flex flex-col gap-3 pt-12">
      <Link
        href="/start"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-cta bg-ink text-[15px] font-semibold tracking-[-0.01em] text-white transition-opacity duration-150 hover:opacity-90"
      >
        내 생일 페이지 만들기
        <ArrowIcon />
      </Link>
      <Link
        href="/start"
        className="text-center text-[13px] text-sub underline-offset-4 hover:underline"
      >
        이미 만들어 봤어요 · 로그인
      </Link>
    </div>
  );
}

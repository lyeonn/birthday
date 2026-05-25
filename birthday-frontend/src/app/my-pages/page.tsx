'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calcNthBirthday } from '@/lib/calcNthBirthday';
import { getTimeLeft } from '@/lib/getTimeLeft';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

interface PageItem {
  id: number;
  code: string;
  friendName: string;
  birthday: string; // ISO 날짜
  greeting: string;
  color: string;
  photoUrl?: string | null;
  createdAt: string;
}

interface StoredUser {
  id: number;
  nickname: string;
  token: string;
}

export default function MyPagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [pages, setPages] = useState<PageItem[] | null>(null); // null = 로딩중
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 로컬스토리지에서 user 정보 읽기
    const raw = localStorage.getItem('birthday-user');
    if (!raw) {
      router.replace('/start');
      return;
    }
    let parsed: StoredUser;
    try {
      parsed = JSON.parse(raw);
    } catch {
      router.replace('/start');
      return;
    }
    setUser(parsed);

    // 백엔드에서 페이지 목록 가져오기
    fetch(`${API_BASE}/pages?hostId=${parsed.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('failed');
        return r.json();
      })
      .then((data: PageItem[]) => setPages(data))
      .catch(() => setError('페이지 목록을 가져오지 못했어요. 백엔드 서버가 켜져있나요?'));
  }, [router]);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-bg pb-32 font-body text-ink">
      {/* sticky 헤더 */}
      <div className="sticky top-0 z-10 bg-bg px-4 pb-4 pt-[52px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink"
          aria-label="뒤로"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 타이틀 블록 */}
      <div className="px-6 pb-7 pt-1">
        <div className="mb-3 font-mono text-[11px] font-bold tracking-[0.18em] text-sub">
          MY PAGES
        </div>
        <h1 className="font-display text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-ink">
          내가 만든 페이지
        </h1>
        <p className="mt-2.5 text-[14px] leading-[1.5] text-sub">
          {user ? `${user.nickname}님이 만든 생일 페이지 목록이에요` : ' '}
        </p>
      </div>

      {/* 내용 */}
      <div className="px-5">
        {error && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12px] leading-[1.5] text-[#991B1B]">
            {error}
          </div>
        )}

        {!error && pages === null && (
          // 로딩 상태 — 스켈레톤 3장
          <div className="flex flex-col gap-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[88px] animate-pulse rounded-field border border-line bg-surface"
              />
            ))}
          </div>
        )}

        {!error && pages && pages.length === 0 && (
          // 빈 상태 — 하단 CTA가 있으니 안내 텍스트만
          <div className="rounded-field border border-line bg-surface px-5 py-10 text-center">
            <div className="mb-2 font-display text-[18px] font-bold text-ink">
              아직 만든 페이지가 없어요
            </div>
            <p className="text-[13px] leading-[1.5] text-sub">
              아래 버튼으로 첫 페이지를 만들어보세요
            </p>
          </div>
        )}

        {!error && pages && pages.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {pages.map((p) => (
              <PageCard key={p.id} page={p} />
            ))}
          </div>
        )}
      </div>

      {/* 하단 새 페이지 만들기 CTA — 항상 보임 */}
      <div className="fixed inset-x-0 bottom-0 z-[5] bg-gradient-to-b from-transparent to-bg to-[40%] px-5 pb-6 pt-4">
        <div className="mx-auto max-w-[480px]">
          <Link
            href="/create"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-cta bg-ink text-[15px] font-semibold tracking-[-0.01em] text-white"
          >
            페이지 만들기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 페이지 카드 한 장
function PageCard({ page }: { page: PageItem }) {
  const nth = calcNthBirthday(page.birthday);
  const time = getTimeLeft(page.birthday);

  // D-day 표시 — 오늘이면 D-DAY, 아니면 D-N
  const dDay = time.isPast ? 'D-DAY' : `D-${time.days}`;

  const href = `/${page.code}/${encodeURIComponent(page.friendName)}/happybirthday`;

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-field border border-line bg-surface px-3.5 py-3 transition-colors hover:bg-muted"
    >
      {/* 컬러 썸네일 (사진 있으면 사진, 없으면 색상 원) */}
      <div
        className="h-14 w-14 shrink-0 rounded-xl"
        style={{
          background: page.photoUrl
            ? `url(${page.photoUrl}) center/cover`
            : `repeating-linear-gradient(45deg, ${page.color}33, ${page.color}33 6px, ${page.color}11 6px, ${page.color}11 12px)`,
          border: `1px solid ${page.color}33`,
        }}
      />
      {/* 텍스트 영역 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="truncate text-[15px] font-bold text-ink">
            {page.friendName}
          </span>
          {nth && (
            <span className="text-[11px] text-sub">{nth}번째 생일</span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span
            className="font-mono text-[10px] font-semibold tracking-[0.1em]"
            style={{ color: page.color }}
          >
            {dDay}
          </span>
          <span className="font-mono text-[10px] text-sub">{page.code}</span>
        </div>
      </div>
      {/* 화살표 */}
      <span className="text-sub">→</span>
    </Link>
  );
}

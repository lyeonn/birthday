'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { calcNthBirthday } from '@/lib/calcNthBirthday';
import CountdownSection from '@/components/main/CountdownSection';
import MessagesSection, {
  type MessagePreview,
} from '@/components/main/MessagesSection';
import GallerySection, {
  type GalleryPhoto,
} from '@/components/main/GallerySection';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

// 백엔드 응답 모양 (GET /pages/:code)
interface PageData {
  id: number;
  code: string;
  friendName: string;
  birthday: string; // ISO datetime
  greeting: string;
  color: string;
  photoUrl: string | null;
  hostNickname: string;
}

// 메시지 카드 색 자동 배정용 (서버에서 cardColor 안 주면 순환 배정)
const FALLBACK_CARD_COLORS = ['#FFD6E5', '#CFE3FF', '#FFE7C2', '#C2F1E2', '#DCD2FF', '#FFD0D6'];

// 백엔드 응답 모양
interface MessageRaw {
  id: number;
  content: string;
  photoUrl: string | null;
  cardColor: string | null;
  createdAt: string;
  authorNickname: string;
}

interface PhotoRaw {
  id: number;
  url: string;
  createdAt: string;
  uploaderNickname: string;
}

// 작성 시간 → "방금", "5분 전", "어제" 같은 상대 시간
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return '방금';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  return new Date(iso).toLocaleDateString('ko-KR');
}

export default function HappyBirthdayPage() {
  const router = useRouter();
  const params = useParams<{ code: string; nickname: string }>();
  const code = params?.code;
  const nickname = params?.nickname;

  // 라우팅 헬퍼
  const goWrite = () => router.push(`/${code}/${nickname}/write`);
  const goMessages = () => router.push(`/${code}/${nickname}/messages`);
  const goGallery = () => router.push(`/${code}/${nickname}/gallery`);

  const [page, setPage] = useState<PageData | null>(null);
  const [messages, setMessages] = useState<MessageRaw[]>([]);
  const [photos, setPhotos] = useState<PhotoRaw[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bgmOn, setBgmOn] = useState(false);

  // 마운트 시 백엔드에서 페이지/메시지/사진 동시에 가져오기
  useEffect(() => {
    if (!code) return;

    // 페이지 본체
    fetch(`${API_BASE}/pages/${code}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('페이지를 찾을 수 없어요');
          throw new Error('페이지를 불러오지 못했어요');
        }
        return res.json();
      })
      .then((data: PageData) => setPage(data))
      .catch((e: Error) => setError(e.message));

    // 축하글 최신 3개
    fetch(`${API_BASE}/pages/${code}/messages`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: MessageRaw[]) => setMessages(data))
      .catch(() => setMessages([]));

    // 갤러리 사진 최신 4개
    fetch(`${API_BASE}/pages/${code}/photos`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: PhotoRaw[]) => setPhotos(data))
      .catch(() => setPhotos([]));
  }, [code]);

  // MessagesSection에 넘길 모양으로 변환
  const messageItems: MessagePreview[] = messages.map((m, i) => ({
    id: m.id,
    name: m.authorNickname,
    text: m.content,
    cardColor: m.cardColor ?? FALLBACK_CARD_COLORS[i % FALLBACK_CARD_COLORS.length],
    time: relativeTime(m.createdAt),
  }));

  // GallerySection에 넘길 모양으로 변환
  const galleryItems: GalleryPhoto[] = photos.map((p) => ({
    id: p.id,
    url: p.url,
    label: p.uploaderNickname,
  }));

  // 에러 상태
  if (error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center bg-bg px-6 text-center font-body text-ink">
        <div className="mb-2 font-display text-[20px] font-bold">{error}</div>
        <p className="text-[13px] text-sub">코드를 다시 확인해주세요.</p>
      </main>
    );
  }

  // 로딩 상태
  if (!page) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center bg-bg font-body text-ink">
        <div className="font-mono text-[12px] text-sub">불러오는 중…</div>
      </main>
    );
  }

  // birthday는 ISO datetime이라 YYYY-MM-DD로 자르기
  const birthdayISO = page.birthday.slice(0, 10);
  const nth = calcNthBirthday(birthdayISO);
  const accent = page.color;
  const hasPhoto = !!page.photoUrl;

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[480px] bg-bg pb-8 font-body text-ink">
      {/* 상단 바: BGM 토글 + 공유 */}
      <div className="flex items-center justify-between px-[18px] pb-1.5 pt-[54px]">
        <button
          type="button"
          onClick={() => setBgmOn((v) => !v)}
          className="flex h-9 items-center gap-1.5 rounded-chip border border-ink/10 bg-surface px-3 text-[12px] font-semibold text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)]"
        >
          <span aria-hidden>{bgmOn ? '🎵' : '🔇'}</span>
          {bgmOn ? 'BGM ON' : 'BGM OFF'}
        </button>
        <button
          type="button"
          className="flex h-9 items-center justify-center rounded-chip border border-ink/10 bg-surface px-3 text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          aria-label="공유"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 11l8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </div>

      {/* HAPPY ... BIRTHDAY 키커 */}
      <div
        className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        HAPPY {nth ? `${nth}TH ` : ''}BIRTHDAY · {page.friendName.toUpperCase()}
      </div>

      {/* 친구 원형 사진 (회전 점선 외곽) */}
      <div className="relative mx-auto mt-[18px] h-60 w-60">
        <div
          className="flex h-full w-full items-center justify-center rounded-full font-mono text-[11px] uppercase tracking-[0.05em] text-ink/60"
          style={{
            background: hasPhoto
              ? `url(${page.photoUrl}) center/cover`
              : `repeating-linear-gradient(45deg, ${accent}22, ${accent}22 8px, ${accent}11 8px, ${accent}11 16px)`,
            border: hasPhoto ? undefined : `1px dashed ${accent}66`,
          }}
        >
          {!hasPhoto && `${page.friendName} 사진`}
        </div>
        {/* 회전 점선 외곽 */}
        <div
          className="pointer-events-none absolute -inset-2.5 animate-spin-slow rounded-full"
          style={{ border: `2px dashed ${accent}77` }}
        />
      </div>

      {/* 축하 문구 */}
      <p className="mx-6 mt-6 whitespace-pre-line text-center font-display text-[26px] font-bold leading-[1.25] tracking-[-0.02em] text-ink">
        {page.greeting}
      </p>

      {/* 카운트다운 */}
      <CountdownSection birthdayISO={birthdayISO} accentColor={accent} />

      {/* 축하 메시지 남기기 CTA */}
      <div className="mx-[18px] mt-7">
        <button
          type="button"
          onClick={goWrite}
          className="flex h-16 w-full items-center gap-3 rounded-[10px] px-[18px] text-left text-white"
          style={{ background: accent, boxShadow: `0 10px 24px -10px ${accent}` }}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 4l6 6L8 22H2v-6L14 4z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold tracking-[-0.01em]">
              축하 메시지 남기기
            </span>
            <span className="mt-0.5 block text-[11px] opacity-70">
              {page.friendName}에게 한 마디
            </span>
          </span>
          <span className="opacity-40">→</span>
        </button>
      </div>

      {/* 친구들의 축하글 (백엔드에서 최신 3개) */}
      <MessagesSection messages={messageItems} onSeeAll={goMessages} />

      {/* 사진 갤러리 (백엔드에서 최신 4개) */}
      <GallerySection photos={galleryItems} onSeeAll={goGallery} />

      {/* MADE BY 호스트 노트 카드 */}
      <div className="mx-6 mt-7 rounded-[10px] border border-ink/10 bg-surface px-4 py-3.5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div
          className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          MADE BY {page.hostNickname.toUpperCase()}
        </div>
        <p className="text-[13px] leading-[1.5] text-ink">
          {page.hostNickname}이 {page.friendName}을 위해 만든 페이지예요. 친구들이 한 마디씩 남길 수 있어요!
        </p>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { calcNthBirthday } from '@/lib/calcNthBirthday';
import CountdownSection from '@/components/main/CountdownSection';
import MessagesSection, {
  type MessagePreview,
} from '@/components/main/MessagesSection';
import GallerySection, {
  type GalleryPhoto,
} from '@/components/main/GallerySection';

// 백엔드 연결 전 mock. URL의 nickname을 friend.name으로 덮어써서 라우트 동작 확인.
const MOCK_FRIEND = {
  birthday: '2001-05-08',
  greeting: '{name}의 25번째 생일을\n다 같이 축하해요',
  hostName: '민지',
  photoUrl: undefined as string | undefined,
  color: '#FF6B9D',
};

const MOCK_MESSAGES: MessagePreview[] = [
  { id: 1, name: '민지', cardColor: '#FFD6E5', text: '지수야 생일 진짜 진짜 축하해!! 우리 만난지 벌써 7년째라니… 매년 너랑 케이크 자르는 게 너무 행복해. 올해도 좋은 일만 가득하길 ☺️', time: '2시간 전' },
  { id: 2, name: '준호', cardColor: '#CFE3FF', text: '생일 축하한다 친구야. 항상 응원해!', time: '5시간 전' },
  { id: 3, name: '서연', cardColor: '#FFE7C2', text: '지수야 생일축하해!!!!! 너 만나서 진짜 행운이야. 이번 주말에 케이크 사줄게 🎂', time: '어제' },
];

const MOCK_PHOTOS: GalleryPhoto[] = [
  { id: 0, label: '졸업식',   tint: '#FFD6E5' },
  { id: 1, label: '카페',     tint: '#CFE3FF' },
  { id: 2, label: '생일파티', tint: '#FFE7C2' },
  { id: 3, label: '바다',     tint: '#C2F1E2' },
  { id: 4, label: '셀카',     tint: '#DCD2FF' },
  { id: 5, label: '데일리',   tint: '#FFD0D6' },
];

export default function HappyBirthdayPage() {
  // URL에서 code와 nickname 추출 (한글 자동 디코드)
  const params = useParams<{ code: string; nickname: string }>();
  const code = params?.code ?? 'TEST';
  const nickname = params?.nickname ?? '친구';

  // TODO: 백엔드 붙으면 code로 GET /pages/:code 호출 (nickname은 표시용)
  const friend = {
    ...MOCK_FRIEND,
    name: nickname,
    greeting: MOCK_FRIEND.greeting.replace('{name}', nickname),
  };
  const messages = MOCK_MESSAGES;
  const photos = MOCK_PHOTOS;

  const nth = calcNthBirthday(friend.birthday);
  const accent = friend.color;
  const [bgmOn, setBgmOn] = useState(false);

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
        HAPPY {nth ? `${nth}TH ` : ''}BIRTHDAY · {friend.name.toUpperCase()}
      </div>

      {/* 친구 원형 사진 (회전 점선 외곽) */}
      <div className="relative mx-auto mt-[18px] h-60 w-60">
        <div
          className="flex h-full w-full items-center justify-center rounded-full font-mono text-[11px] uppercase tracking-[0.05em] text-ink/60"
          style={{
            background: friend.photoUrl
              ? `url(${friend.photoUrl}) center/cover`
              : `repeating-linear-gradient(45deg, ${accent}22, ${accent}22 8px, ${accent}11 8px, ${accent}11 16px)`,
            border: friend.photoUrl ? undefined : `1px dashed ${accent}66`,
          }}
        >
          {!friend.photoUrl && `${friend.name} 사진`}
        </div>
        {/* 회전 점선 외곽 */}
        <div
          className="pointer-events-none absolute -inset-2.5 animate-spin-slow rounded-full"
          style={{ border: `2px dashed ${accent}77` }}
        />
      </div>

      {/* 축하 문구 */}
      <p className="mx-6 mt-6 whitespace-pre-line text-center font-display text-[26px] font-bold leading-[1.25] tracking-[-0.02em] text-ink">
        {friend.greeting}
      </p>

      {/* 카운트다운 */}
      <CountdownSection birthdayISO={friend.birthday} accentColor={accent} />

      {/* 축하 메시지 남기기 CTA */}
      <div className="mx-[18px] mt-7">
        <button
          type="button"
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
              {friend.name}에게 한 마디
            </span>
          </span>
          <span className="opacity-40">→</span>
        </button>
      </div>

      {/* 친구들의 축하글 */}
      <MessagesSection messages={messages} />

      {/* 사진 갤러리 */}
      <GallerySection photos={photos} />

      {/* MADE BY 호스트 노트 카드 */}
      <div className="mx-6 mt-7 rounded-[10px] border border-ink/10 bg-surface px-4 py-3.5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div
          className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          MADE BY {friend.hostName.toUpperCase()}
        </div>
        <p className="text-[13px] leading-[1.5] text-ink">
          {friend.hostName}이 {friend.name}을 위해 만든 페이지예요. 친구들이 한 마디씩 남길 수 있어요!
        </p>
      </div>

      {/* 디버그용 — 백엔드 연결 후 제거 */}
      <div className="mt-6 text-center font-mono text-[10px] text-ink/40">
        code: {code}
      </div>
    </main>
  );
}

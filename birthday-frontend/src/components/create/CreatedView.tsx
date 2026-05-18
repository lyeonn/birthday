'use client';

import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { derivePalette } from '@/lib/derivePalette';
import type { CreatePageInput } from '@/lib/schema';

interface Props {
  code: string;
  onPreview?: () => void;
  onAdmin?: () => void;
}

type CopyKind = 'code' | 'link' | null;

export default function CreatedView({ code, onPreview, onAdmin }: Props) {
  const { watch } = useFormContext<CreatePageInput>();
  const color = watch('color') || '#FF6B9D';
  const palette = useMemo(() => derivePalette(color), [color]);
  const [copied, setCopied] = useState<CopyKind>(null);
  const url = `bday.cake/${code}`;

  const copy = (kind: Exclude<CopyKind, null>, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div
      className="relative mx-auto min-h-screen w-full max-w-[480px] bg-bg px-5 pb-8 pt-[80px] text-ink font-body"
      style={{ background: palette.softBg }}
    >
      <Confetti count={40} colors={[color, '#FFB84D', '#5AA9FF', '#1B1B1F']} />

      <div className="relative z-[1] text-center">
        <div className="mb-[18px] inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l5 5L20 7"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="font-display text-[26px] font-bold leading-[1.3] tracking-[-0.02em]">
          페이지가 만들어졌어요
        </div>
        <div className="mt-2 text-[14px] text-sub">
          아래 링크와 입장 코드를
          <br />
          친구들에게 공유해주세요
        </div>
      </div>

      {/* 입장 코드 카드 */}
      <div className="mt-6 rounded-[18px] bg-ink px-[18px] pb-4 pt-[18px] text-white">
        <div className="mb-1.5 flex justify-between font-mono text-[10px] font-bold tracking-[0.2em] text-white/60">
          <span>입장 코드 · 자동 발급</span>
          <span>UNIQUE</span>
        </div>
        <div className="flex items-center justify-between gap-2.5">
          <div className="font-mono text-[30px] font-bold tracking-[0.18em]">{code}</div>
          <button
            type="button"
            onClick={() => copy('code', code)}
            className="flex h-[38px] items-center gap-1.5 rounded-chip bg-white px-3.5 text-[12px] font-bold text-ink"
          >
            {copied === 'code' ? (
              '✓ 복사됨'
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path
                    d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
                코드 복사
              </>
            )}
          </button>
        </div>
        <div className="mt-2.5 text-[11px] leading-[1.5] text-white/60">
          이 코드는 다른 페이지와 겹치지 않는 고유 코드예요. 잊어버려도 관리자에서 확인할 수 있어요.
        </div>
      </div>

      {/* 공유 링크 */}
      <div className="mt-3 rounded-[18px] border border-line bg-surface p-[18px]">
        <div className="mb-2 font-mono text-[10px] font-bold tracking-[0.18em] text-sub">
          SHARE LINK
        </div>
        <div className="break-all font-mono text-[13px] text-ink">{url}</div>
        <button
          type="button"
          onClick={() => copy('link', url)}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-line bg-surface text-[13px] font-semibold text-ink"
        >
          {copied === 'link' ? '✓ 링크 복사됨!' : '🔗 링크 복사'}
        </button>
      </div>

      <button
        type="button"
        onClick={onPreview}
        className="mt-3 h-[52px] w-full rounded-chip bg-kakao text-[14px] font-bold text-kakao-ink"
      >
        💬 카카오톡으로 공유하기
      </button>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onPreview} className={ghostBtnClass}>
          미리보기
        </button>
        <button type="button" onClick={onAdmin} className={ghostBtnClass}>
          관리자 페이지
        </button>
      </div>
    </div>
  );
}

const ghostBtnClass =
  'h-12 flex-1 rounded-chip border-[1.5px] border-line bg-transparent text-[13px] font-semibold text-ink';

function Confetti({ count, colors }: { count: number; colors: string[] }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 2.5,
        color: colors[i % colors.length],
        rot: Math.random() * 360,
        size: 6 + Math.random() * 8,
      })),
    [count, colors],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size * 1.4,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

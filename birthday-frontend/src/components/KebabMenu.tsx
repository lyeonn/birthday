'use client';

import { useEffect, useRef, useState } from 'react';

export interface KebabItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface Props {
  items: KebabItem[];
  className?: string;
  /** 점 색상 (배경에 따라 다르게). 기본 검정. */
  dotColor?: string;
}

// 카드 우측 상단에 두는 ... 메뉴. 클릭 시 드롭다운, 바깥 클릭/ESC로 닫힘.
export default function KebabMenu({ items, className = '', dotColor }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label="더보기"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5"
        style={dotColor ? { color: dotColor } : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-30 min-w-[120px] overflow-hidden rounded-xl border border-line bg-surface shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)]">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                item.onClick();
              }}
              className={`block w-full px-4 py-2.5 text-left text-[13px] hover:bg-muted ${
                item.danger ? 'text-[#D11A2A]' : 'text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
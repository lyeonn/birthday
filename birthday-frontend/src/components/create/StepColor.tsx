'use client';

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { derivePalette } from '@/lib/derivePalette';
import { COLOR_OPTIONS, type CreatePageInput } from '@/lib/schema';

export default function StepColor() {
  const { register, watch, setValue } = useFormContext<CreatePageInput>();
  const color = watch('color');
  const palette = useMemo(() => derivePalette(color || '#FF6B9D'), [color]);

  return (
    <div className="flex flex-col gap-[18px]">
      <div
        className="rounded-[18px] border p-[18px]"
        style={{ background: palette.softBg, borderColor: palette.border }}
      >
        <div
          className="mb-2.5 font-mono text-[10px] font-bold tracking-[0.18em]"
          style={{ color }}
        >
          자동 생성 팔레트
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          <PaletteSwatch color={palette.softBg} label="배경" />
          <PaletteSwatch color={palette.surface} label="카드" />
          <PaletteSwatch color={palette.soft} label="소프트" />
          <PaletteSwatch color={color} label="액센트" big />
          <PaletteSwatch color={palette.accentDark} label="진한톤" />
        </div>
        <div className="mt-3 text-[11px] leading-[1.5] text-sub">
          색 하나만 고르면 배경 · 카드 · 액센트 등 페이지 전체 톤이 자동으로 만들어져요
        </div>
      </div>

      <div>
        <div className="mb-2.5 text-[12px] font-semibold text-sub">프리셋 컬러</div>
        <div className="grid grid-cols-4 gap-2.5">
          {COLOR_OPTIONS.map((opt) => {
            const selected = color === opt.hex;
            return (
              <button
                key={opt.hex}
                type="button"
                onClick={() => setValue('color', opt.hex, { shouldValidate: true })}
                className={`relative aspect-square rounded-cta transition-transform duration-[120ms] ${
                  selected ? 'border-[2.5px] border-ink' : 'border border-line'
                }`}
                style={{ background: opt.hex }}
                aria-label={opt.name}
              >
                {selected && (
                  <div className="absolute inset-1.5 flex items-end justify-end rounded-[11px] border-2 border-white p-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l5 5L20 7"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-2.5 text-[12px] font-semibold text-sub">직접 입력</div>
        <div className="flex gap-2.5">
          <div className="relative h-14 w-14 shrink-0">
            <input
              type="color"
              value={color}
              onChange={(e) => setValue('color', e.target.value, { shouldValidate: true })}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div
              className="pointer-events-none h-full w-full rounded-field border border-line"
              style={{ background: color }}
            />
          </div>
          <input
            type="text"
            placeholder="#FF6B9D"
            {...register('color')}
            className="h-[52px] w-full rounded-field border-[1.5px] border-line bg-surface px-4 font-mono text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
          />
        </div>
      </div>
    </div>
  );
}

function PaletteSwatch({ color, label, big }: { color: string; label: string; big?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="aspect-square w-full rounded-xl border border-line"
        style={{
          background: color,
          boxShadow: big ? `0 6px 14px -8px ${color}` : undefined,
        }}
      />
      <div className="text-[10px] font-medium text-sub">{label}</div>
    </div>
  );
}

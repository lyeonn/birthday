'use client';

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { derivePalette } from '@/lib/derivePalette';
import { COLOR_OPTIONS, type CreatePageInput } from '@/lib/schema';
import { THEME_OPTIONS, type ThemeDef } from '@/lib/themes';

export default function StepColor() {
  const { register, watch, setValue } = useFormContext<CreatePageInput>();
  const color = watch('color');
  const theme = watch('theme') || 'minimal';
  const palette = useMemo(() => derivePalette(color || '#FF6B9D'), [color]);

  const selectTheme = (t: ThemeDef) => {
    setValue('theme', t.id, { shouldValidate: true });
    // 프리셋 테마는 대표색을 테마 액센트로 고정(다운스트림 렌더/검증 호환).
    if (!t.custom) setValue('color', t.dot, { shouldValidate: true });
    else if (color === '#000000' || !color) setValue('color', t.dot, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-[18px]">
      {/* 테마 갤러리 */}
      <div>
        <div className="mb-2.5 text-[12px] font-semibold text-sub">디자인 테마</div>
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_OPTIONS.map((t) => {
            const selected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTheme(t)}
                className={`relative overflow-hidden rounded-[16px] p-[3px] text-left transition-transform duration-[120ms] active:scale-[0.98] ${
                  selected ? 'ring-[2.5px] ring-ink' : 'ring-[1.5px] ring-line'
                }`}
                aria-label={t.name}
                aria-pressed={selected}
              >
                {/* 미니 프리뷰 */}
                <div
                  className="relative flex h-[92px] items-center justify-center rounded-[13px]"
                  style={{ background: t.cardBg }}
                >
                  <span className="absolute left-2 top-2 text-[15px]">{t.emoji}</span>
                  {selected && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12l5 5L20 7"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                  {/* 액센트 아바타 + 버튼 목업 */}
                  <span className="flex flex-col items-center gap-1.5">
                    <span
                      className="h-8 w-8 rounded-full"
                      style={{ background: t.dot, boxShadow: `0 4px 10px -3px ${t.dot}` }}
                    />
                    <span
                      className="h-2 w-12 rounded-full"
                      style={{ background: t.dot, opacity: 0.85 }}
                    />
                  </span>
                </div>
                {/* 라벨 */}
                <div className="px-1.5 pb-1.5 pt-2">
                  <div className="text-[13px] font-semibold text-ink">{t.name}</div>
                  <div className="mt-0.5 text-[11px] leading-[1.3] text-sub">{t.tag}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 미니멀 선택 시에만 대표색 직접 고르기 */}
      {theme === 'minimal' && (
        <div className="flex flex-col gap-[18px] border-t border-line pt-[18px]">
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
      )}
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

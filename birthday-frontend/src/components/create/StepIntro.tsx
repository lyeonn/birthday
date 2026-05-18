'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { calcNthBirthday } from '@/lib/calcNthBirthday';
import type { CreatePageInput } from '@/lib/schema';

export default function StepIntro() {
  const { register, watch } = useFormContext<CreatePageInput>();
  const birthday = watch('birthday');
  const nth = calcNthBirthday(birthday);
  const [hasPhoto, setHasPhoto] = useState(false);

  return (
    <div className="flex flex-col gap-[18px]">
      <div>
        <div className="mb-2 flex items-center gap-1 text-[12px] font-semibold text-sub">
          친구 이름
          <span className="text-[#E11D48]">*</span>
        </div>
        <input
          type="text"
          placeholder="예: 지수"
          {...register('friendName')}
          className="h-[52px] w-full rounded-field border-[1.5px] border-line bg-surface px-4 text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
        />
        <div className="mt-1.5 text-[11px] leading-[1.4] text-sub">
          본명, 별명 모두 OK · 페이지 곳곳에 표시돼요
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1 text-[12px] font-semibold text-sub">
          친구의 생년월일
          <span className="text-[#E11D48]">*</span>
        </div>
        <input
          type="date"
          {...register('birthday')}
          className="h-[52px] w-full rounded-field border-[1.5px] border-line bg-surface px-4 text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
        />
        <div className="mt-1.5 text-[11px] leading-[1.4] text-sub">
          {nth ? (
            <>
              이번 생일은 <b className="text-ink">{nth}번째 생일</b>이에요 · 카운트다운도 자동 계산
            </>
          ) : (
            '연·월·일을 모두 입력해주세요. 나이는 자동으로 계산돼요'
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[12px] font-semibold text-sub">대표 사진</div>
        <button
          type="button"
          onClick={() => setHasPhoto((p) => !p)}
          className={`flex min-h-[120px] w-full flex-col items-center justify-center gap-1.5 rounded-field p-4 text-ink transition-colors ${
            hasPhoto
              ? 'border-[1.5px] border-solid border-ink bg-muted'
              : 'border-[1.5px] border-dashed border-line bg-surface'
          }`}
        >
          {hasPhoto ? (
            <>
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full font-mono text-[9px] text-sub"
                style={{
                  background:
                    'repeating-linear-gradient(45deg, #1B1B1F22, #1B1B1F22 8px, #1B1B1F11 8px, #1B1B1F11 16px)',
                }}
              >
                PHOTO
              </div>
              <div className="text-[13px] font-semibold">대표 사진 1장 첨부됨</div>
              <div className="text-[11px] text-sub">탭하면 변경할 수 있어요</div>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3 17l5-5 5 5 3-3 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-[13px] font-semibold">친구의 대표 사진 추가</div>
              <div className="text-[11px] text-sub">나중에 갤러리에서 더 추가할 수 있어요</div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

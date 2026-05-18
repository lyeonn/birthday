'use client';

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { calcNthBirthday } from '@/lib/calcNthBirthday';
import { derivePalette } from '@/lib/derivePalette';
import type { CreatePageInput } from '@/lib/schema';

export default function StepReview() {
  const { watch } = useFormContext<CreatePageInput>();
  const data = watch();
  const palette = useMemo(() => derivePalette(data.color || '#FF6B9D'), [data.color]);
  const nth = calcNthBirthday(data.birthday);

  return (
    <div className="flex flex-col gap-3.5">
      <div
        className="rounded-[18px] border px-[18px] py-6 text-center"
        style={{ background: palette.softBg, borderColor: palette.border }}
      >
        <div
          className="mb-3 font-mono text-[10px] font-bold tracking-[0.16em]"
          style={{ color: data.color }}
        >
          HAPPY {nth ? `${nth}TH ` : ''}BIRTHDAY · {(data.friendName || 'FRIEND').toUpperCase()}
        </div>
        <div className="relative mx-auto h-24 w-24">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full font-mono text-[9px] text-ink"
            style={{
              background: `repeating-linear-gradient(45deg, ${data.color}22, ${data.color}22 8px, ${data.color}11 8px, ${data.color}11 16px)`,
              border: `1px dashed ${data.color}66`,
            }}
          >
            PHOTO
          </div>
          <div
            className="absolute -inset-[7px] animate-spin-slow rounded-full"
            style={{ border: `2px dashed ${data.color}88` }}
          />
        </div>
        <div className="mt-[18px] whitespace-pre-line font-display text-[17px] font-bold leading-[1.3] tracking-[-0.02em] text-ink">
          {data.greeting || '축하 문구를 입력해주세요'}
        </div>
      </div>

      <div className="overflow-hidden rounded-cta border border-line bg-surface">
        <ReviewRow label="친구" value={data.friendName + (nth ? ` (${nth}번째 생일)` : '')} />
        <ReviewRow label="생년월일" value={data.birthday} />
        <ReviewRow label="대표색" value={(data.color || '').toUpperCase()} swatch={data.color} last />
      </div>

      <div className="flex gap-2.5 rounded-xl border border-success-border bg-success-bg px-4 py-3.5 text-[12px] leading-[1.5] text-success-ink">
        <div className="text-[16px] leading-none">✓</div>
        <div>
          <b>입장 코드는 자동으로 발급</b>돼요. 페이지 생성이 끝나면 공유 링크와 함께 코드를 알려드려요.
        </div>
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  swatch,
  last,
}: {
  label: string;
  value: string;
  swatch?: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center px-4 py-3.5 ${last ? '' : 'border-b border-line'}`}>
      <div className="w-20 text-[12px] font-semibold text-sub">{label}</div>
      <div className="flex flex-1 items-center gap-2.5 text-[14px] font-medium text-ink">
        {swatch && (
          <span
            className="h-[18px] w-[18px] rounded-md border border-line"
            style={{ background: swatch }}
          />
        )}
        {value || '—'}
      </div>
    </div>
  );
}

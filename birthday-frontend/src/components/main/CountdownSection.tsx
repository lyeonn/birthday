'use client';

import { useEffect, useState } from 'react';
import { getTimeLeft } from '@/lib/getTimeLeft';

interface Props {
  birthdayISO: string;
  accentColor: string;
}

// 카운트다운 큰 블록. 1초마다 갱신. 생일 당일이면 D-DAY 큰 텍스트로 전환.
export default function CountdownSection({ birthdayISO, accentColor }: Props) {
  // 1초마다 리렌더링하려고 tick 카운터
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const time = getTimeLeft(birthdayISO);

  // 생일 당일이면 카운트다운 자리에 "D-DAY" 큰 텍스트
  if (time.isPast) {
    return (
      <div className="mt-6 px-[18px]">
        <div
          className="text-center font-display text-[56px] font-extrabold tracking-[-0.03em]"
          style={{ color: accentColor }}
        >
          D-DAY
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 px-[18px]">
      <div className="mb-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
        D-DAY까지 남은 시간
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Cell value={time.days} label="DAYS" accentColor={accentColor} />
        <Cell value={time.hours} label="HRS" accentColor={accentColor} />
        <Cell value={time.minutes} label="MIN" accentColor={accentColor} />
        <Cell value={time.seconds} label="SEC" accentColor={accentColor} />
      </div>
    </div>
  );
}

// 카운트다운 셀 한 칸 (DAYS/HRS/MIN/SEC 공용)
function Cell({
  value,
  label,
  accentColor,
}: {
  value: number;
  label: string;
  accentColor: string;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-surface px-1 pb-2.5 pt-3.5 text-center shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="font-mono text-[36px] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
        {value.toString().padStart(2, '0')}
      </div>
      <div
        className="mt-1.5 text-[9px] font-semibold tracking-[0.16em]"
        style={{ color: accentColor }}
      >
        {label}
      </div>
    </div>
  );
}

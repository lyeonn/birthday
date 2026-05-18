'use client';

import { useFormContext } from 'react-hook-form';
import { calcNthBirthday } from '@/lib/calcNthBirthday';
import type { CreatePageInput } from '@/lib/schema';

export default function StepGreeting() {
  const { register, watch, setValue } = useFormContext<CreatePageInput>();
  const greeting = watch('greeting');
  const friendName = watch('friendName');
  const birthday = watch('birthday');
  const nth = calcNthBirthday(birthday);
  const name = friendName || '친구';

  const examples = [
    `${name}의 ${nth ?? 'XX'}번째\n생일을 다 같이 축하해요`,
    `우리들의 영원한 베프\n${name}, 생일 축하해`,
    `${name}야\n태어나줘서 고마워`,
    `소중한 ${name}의\n특별한 하루`,
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      <div>
        <div className="mb-2 flex items-center gap-1 text-[12px] font-semibold text-sub">
          축하 문구
          <span className="text-[#E11D48]">*</span>
        </div>
        <textarea
          placeholder="여기에 축하 문구를 적어주세요"
          maxLength={60}
          {...register('greeting')}
          className="min-h-[110px] w-full resize-none rounded-field border-[1.5px] border-line bg-surface px-4 py-3.5 text-[16px] leading-[1.5] text-ink outline-none transition-colors duration-150 focus:border-ink"
        />
        <div className="mt-1.5 flex justify-between">
          <div className="text-[11px] leading-[1.4] text-sub">2~60자 · 줄바꿈 가능</div>
          <div className="font-mono text-[11px] text-sub">{greeting?.length ?? 0}/60</div>
        </div>
      </div>

      <div>
        <div className="mb-2.5 text-[12px] font-semibold text-sub">
          예시 문구 — 탭하면 그대로 들어가요
        </div>
        <div className="flex flex-col gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setValue('greeting', ex, { shouldValidate: true })}
              className="whitespace-pre-line rounded-xl border border-line bg-surface px-3.5 py-3 text-left text-[13px] leading-[1.5] text-ink"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

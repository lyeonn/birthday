'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createPageSchema, STEP_FIELDS, type CreatePageInput } from '@/lib/schema';
import StepIntro from './StepIntro';
import StepGreeting from './StepGreeting';
import StepColor from './StepColor';
import StepReview from './StepReview';
import CreatedView from './CreatedView';

const STEPS = [
  {
    kicker: 'STEP 01',
    title: '누구를 위한\n생일 페이지인가요?',
    sub: '친구의 기본 정보부터 알려주세요',
  },
  {
    kicker: 'STEP 02',
    title: '한 마디 적어볼까요?',
    sub: '메인 화면에 크게 보일 축하 문구예요',
  },
  {
    kicker: 'STEP 03',
    title: '대표 색을 골라주세요',
    sub: '색 하나로 페이지 전체 톤이 만들어져요',
  },
  {
    kicker: 'STEP 04',
    title: '마지막으로 확인할게요',
    sub: '이대로 만들면 입장 코드가 자동으로 발급돼요',
  },
];

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateMockCode(): string {
  let s = '';
  let n = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  for (let i = 0; i < 6; i++) {
    s += CODE_CHARS[n % CODE_CHARS.length];
    n = Math.floor(n / CODE_CHARS.length) + (i + 1) * 17;
  }
  return s;
}

async function mockIssueCode(): Promise<{ code: string }> {
  await new Promise((r) => setTimeout(r, 500));
  return { code: generateMockCode() };
}

export default function CreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const methods = useForm<CreatePageInput>({
    resolver: zodResolver(createPageSchema),
    mode: 'onChange',
    defaultValues: {
      friendName: '',
      birthday: '',
      greeting: '',
      color: '#FF6B9D',
    },
  });

  const total = STEPS.length;
  const isLast = step === total - 1;
  const values = methods.watch();

  const isStepValid = (() => {
    switch (step) {
      case 0:
        return values.friendName.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(values.birthday);
      case 1:
        return values.greeting.trim().length >= 2;
      case 2:
        return /^#[0-9A-Fa-f]{6}$/.test(values.color);
      default:
        return true;
    }
  })();

  const handleNext = async () => {
    const fields = STEP_FIELDS[step];
    const ok =
      fields.length === 0
        ? true
        : await methods.trigger([...fields] as Array<keyof CreatePageInput>);
    if (!ok) return;

    if (!isLast) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      const { code } = await mockIssueCode();
      setCreatedCode(code);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setStep(step - 1);
  };

  if (createdCode) {
    return (
      <FormProvider {...methods}>
        <CreatedView code={createdCode} />
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-bg pb-32 font-body text-ink">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-bg px-4 pb-4 pt-[52px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink"
              aria-label="뒤로"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="font-mono text-[12px] font-medium tracking-[0.04em] text-sub">
              {String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
            <div className="flex-1" />
            <div className="flex gap-1">
              {Array.from({ length: total }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-[3px] transition-all duration-[250ms] ${
                    i === step ? 'w-[18px]' : 'w-1.5'
                  } ${i <= step ? 'bg-ink' : 'bg-line'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Title block */}
        <div className="px-6 pb-7 pt-1">
          <div className="mb-3 font-mono text-[11px] font-bold tracking-[0.18em] text-sub">
            {STEPS[step].kicker}
          </div>
          <h1 className="whitespace-pre-line font-display text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-ink">
            {STEPS[step].title}
          </h1>
          <p className="mt-2.5 text-[14px] leading-[1.5] text-sub">{STEPS[step].sub}</p>
        </div>

        {/* Step content */}
        <div key={step} className="animate-fade-up px-5">
          {step === 0 && <StepIntro />}
          {step === 1 && <StepGreeting />}
          {step === 2 && <StepColor />}
          {step === 3 && <StepReview />}
        </div>

        {/* Bottom CTA */}
        <div className="fixed inset-x-0 bottom-0 z-[5] bg-gradient-to-b from-transparent to-bg to-[40%] px-5 pb-6 pt-4">
          <div className="mx-auto max-w-[480px]">
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid || submitting}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-cta bg-ink text-[15px] font-semibold tracking-[-0.01em] text-white transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-25"
            >
              {isLast ? (submitting ? '만드는 중…' : '페이지 만들기') : '다음 단계로'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m-6-6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

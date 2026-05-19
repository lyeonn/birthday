'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// TODO: 환경변수로 빼기 (NEXT_PUBLIC_API_URL)
const API_BASE = 'http://localhost:3001';

type Mode = 'register' | 'login';

export default function StartPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [mode, setMode] = useState<Mode>('register');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 닉네임 1자 이상 + PIN 정확히 4자리 숫자
  const canSubmit =
    nickname.trim().length >= 1 && /^\d{4}$/.test(pin) && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg(null);

    // 모드에 따라 다른 엔드포인트 호출
    const endpoint = mode === 'register' ? '/users/register' : '/users/login';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), pin }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          setErrorMsg(
            '이미 사용 중인 조합이에요. PIN을 바꾸거나 "이미 사용해본 적 있어요"를 선택해주세요.',
          );
        } else if (res.status === 404) {
          setErrorMsg(
            '그런 계정 없어요. "새로 가입"을 선택해주세요.',
          );
        } else {
          setErrorMsg('오류가 발생했어요. 잠시 후 다시 시도해주세요.');
        }
        return;
      }

      const user = await res.json();
      // 토큰 + user 정보를 localStorage에 저장 → my-pages/CreateWizard에서 사용
      localStorage.setItem('birthday-user', JSON.stringify(user));
      router.push('/my-pages');
    } catch {
      setErrorMsg('네트워크 오류. 백엔드 서버(3001)가 켜져있는지 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[480px] bg-bg pb-32 font-body text-ink">
      {/* sticky 헤더 */}
      <div className="sticky top-0 z-10 bg-bg px-4 pb-4 pt-[52px]">
        <button
          type="button"
          onClick={() => router.back()}
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
      </div>

      {/* 타이틀 블록 */}
      <div className="px-6 pb-7 pt-1">
        <div className="mb-3 font-mono text-[11px] font-bold tracking-[0.18em] text-sub">
          START
        </div>
        <h1 className="whitespace-pre-line font-display text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-ink">
          {'시작 전에\n내 정보부터 알려주세요'}
        </h1>
        <p className="mt-2.5 text-[14px] leading-[1.5] text-sub">
          닉네임 + PIN 4자리로 내 페이지를 관리해요
        </p>
      </div>

      {/* 폼 */}
      <div className="flex flex-col gap-[18px] px-5">
        {/* 닉네임 */}
        <div>
          <div className="mb-2 flex items-center gap-1 text-[12px] font-semibold text-sub">
            내 닉네임
            <span className="text-[#E11D48]">*</span>
          </div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="예: 민지"
            maxLength={20}
            className="h-[52px] w-full rounded-field border-[1.5px] border-line bg-surface px-4 text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
          />
        </div>

        {/* PIN */}
        <div>
          <div className="mb-2 flex items-center gap-1 text-[12px] font-semibold text-sub">
            PIN 4자리
            <span className="text-[#E11D48]">*</span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="0000"
            className="h-[52px] w-full rounded-field border-[1.5px] border-line bg-surface px-4 font-mono text-[16px] tracking-[0.2em] text-ink outline-none transition-colors duration-150 focus:border-ink"
          />
          <div className="mt-1.5 text-[11px] leading-[1.4] text-sub">
            나중에 페이지 찾을 때 이 조합으로 들어와요. 기억해두세요.
          </div>
        </div>

        {/* 모드 선택 (라디오 스타일) */}
        <div>
          <div className="mb-2 text-[12px] font-semibold text-sub">처음이신가요?</div>
          <div className="flex flex-col gap-2">
            <ModeOption
              checked={mode === 'register'}
              onClick={() => setMode('register')}
              label="새로 가입"
              desc="처음 페이지를 만들어요"
            />
            <ModeOption
              checked={mode === 'login'}
              onClick={() => setMode('login')}
              label="이미 사용해본 적 있어요!"
              desc="기존 닉네임+PIN으로 들어가기"
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {errorMsg && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12px] leading-[1.5] text-[#991B1B]">
            {errorMsg}
          </div>
        )}
      </div>

      {/* 하단 고정 CTA */}
      <div className="fixed inset-x-0 bottom-0 z-[5] bg-gradient-to-b from-transparent to-bg to-[40%] px-5 pb-6 pt-4">
        <div className="mx-auto max-w-[480px]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-cta bg-ink text-[15px] font-semibold tracking-[-0.01em] text-white transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-25"
          >
            {submitting
              ? '잠시만요…'
              : mode === 'register'
                ? '가입하고 계속'
                : '로그인하고 계속'}
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
  );
}

// 모드 선택 카드 한 장 (체크박스/라디오 역할)
function ModeOption({
  checked,
  onClick,
  label,
  desc,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-field border-[1.5px] px-4 py-3 text-left transition-colors ${
        checked ? 'border-ink bg-muted' : 'border-line bg-surface'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
          checked ? 'border-ink' : 'border-line'
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block text-[11px] text-sub">{desc}</span>
      </span>
    </button>
  );
}

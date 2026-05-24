'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// TODO: 환경변수로 빼기
const API_BASE = 'http://localhost:3001';
const MAX_CONTENT = 500;

interface StoredUser {
  id: number;
  nickname: string;
  token: string;
}

export default function WriteMessagePage() {
  const router = useRouter();
  const params = useParams<{ code: string; nickname: string }>();
  const code = params?.code;
  const friendNickname = params?.nickname;

  const [user, setUser] = useState<StoredUser | null>(null);
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 마운트 시 user 체크 — 없으면 /start로 (작성 화면으로 다시 돌아오게 redirect 파라미터 박음)
  useEffect(() => {
    if (!code || !friendNickname) return;
    const raw = localStorage.getItem('birthday-user');
    if (!raw) {
      const back = `/${code}/${friendNickname}/write`;
      router.replace(`/start?redirect=${encodeURIComponent(back)}`);
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch {
      router.replace('/start');
    }
  }, [code, friendNickname, router]);

  // 사진 업로드 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? '사진 업로드 실패');
        return;
      }
      const { url } = await res.json();
      setPhotoUrl(url);
    } catch {
      setError('네트워크 오류. 백엔드 서버 켜져있나요?');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 메시지 작성 제출
  const handleSubmit = async () => {
    if (!user || !code || submitting) return;
    const trimmed = content.trim();
    if (trimmed.length === 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/pages/${code}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: user.id,
          content: trimmed,
          photoUrl: photoUrl ?? undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? '작성에 실패했어요. 다시 시도해주세요.');
        return;
      }
      // 작성 완료 → 메인 페이지로
      router.push(`/${code}/${friendNickname}/happybirthday`);
    } catch {
      setError('네트워크 오류. 백엔드 서버 켜져있나요?');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !!user && content.trim().length > 0 && !submitting && !uploading;

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

      {/* 타이틀 */}
      <div className="px-6 pb-7 pt-1">
        <div className="mb-3 font-mono text-[11px] font-bold tracking-[0.18em] text-sub">
          MESSAGE
        </div>
        <h1 className="whitespace-pre-line font-display text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-ink">
          {friendNickname
            ? `${decodeURIComponent(friendNickname)}에게\n축하 한마디 남겨주세요`
            : '축하 한마디 남겨주세요'}
        </h1>
        {user && (
          <p className="mt-2.5 text-[14px] leading-[1.5] text-sub">
            <b className="text-ink">{user.nickname}</b> 으로 작성됩니다
          </p>
        )}
      </div>

      {/* 폼 */}
      <div className="flex flex-col gap-[18px] px-5">
        {/* 본문 */}
        <div>
          <div className="mb-2 flex items-center gap-1 text-[12px] font-semibold text-sub">
            축하 메시지
            <span className="text-[#E11D48]">*</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT))}
            placeholder="여기에 축하 한마디를 적어주세요"
            className="min-h-[140px] w-full resize-none rounded-field border-[1.5px] border-line bg-surface px-4 py-3.5 text-[16px] leading-[1.5] text-ink outline-none transition-colors duration-150 focus:border-ink"
          />
          <div className="mt-1.5 flex justify-between text-[11px] text-sub">
            <span>줄바꿈 가능</span>
            <span className="font-mono">
              {content.length}/{MAX_CONTENT}
            </span>
          </div>
        </div>

        {/* 사진 (선택) */}
        <div>
          <div className="mb-2 text-[12px] font-semibold text-sub">사진 (선택)</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex min-h-[100px] w-full flex-col items-center justify-center gap-1 rounded-field p-4 text-ink transition-colors ${
              photoUrl
                ? 'border-[1.5px] border-solid border-ink bg-muted'
                : 'border-[1.5px] border-dashed border-line bg-surface'
            } ${uploading ? 'opacity-60' : ''}`}
          >
            {uploading ? (
              <div className="text-[13px] text-sub">업로드 중…</div>
            ) : photoUrl ? (
              <>
                <div
                  className="h-16 w-16 rounded-xl border border-line bg-cover bg-center"
                  style={{ backgroundImage: `url(${photoUrl})` }}
                />
                <div className="mt-1 text-[12px] font-semibold">사진 첨부됨</div>
                <div className="text-[11px] text-sub">탭하면 변경</div>
              </>
            ) : (
              <>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M3 17l5-5 5 5 3-3 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-[12px] font-semibold">사진 추가 (선택)</div>
                <div className="text-[11px] text-sub">최대 5MB</div>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12px] leading-[1.5] text-[#991B1B]">
            {error}
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
            {submitting ? '보내는 중…' : '축하글 남기기'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { calcNthBirthday } from '@/lib/calcNthBirthday';
import type { CreatePageInput } from '@/lib/schema';

// TODO: 환경변수로 빼기
const API_BASE = 'http://localhost:3001';

export default function StepIntro() {
  const { register, watch, setValue } = useFormContext<CreatePageInput>();
  const birthday = watch('birthday');
  const photoUrl = watch('photoUrl');
  const nth = calcNthBirthday(birthday);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 파일 선택 → 즉시 백엔드로 업로드 → 받은 URL을 폼에 저장
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        setUploadError(errBody.message ?? '업로드 실패');
        return;
      }
      const { url } = await res.json();
      setValue('photoUrl', url, { shouldValidate: true });
    } catch {
      setUploadError('네트워크 오류. 백엔드 서버가 켜져있는지 확인해주세요.');
    } finally {
      setUploading(false);
      // 같은 파일 다시 고를 수 있게 input 초기화
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const hasPhoto = !!photoUrl;

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
        {/* 숨겨진 실제 file input */}
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
          className={`flex min-h-[120px] w-full flex-col items-center justify-center gap-1.5 rounded-field p-4 text-ink transition-colors ${
            hasPhoto
              ? 'border-[1.5px] border-solid border-ink bg-muted'
              : 'border-[1.5px] border-dashed border-line bg-surface'
          } ${uploading ? 'opacity-60' : ''}`}
        >
          {uploading ? (
            <div className="text-[13px] text-sub">업로드 중…</div>
          ) : hasPhoto ? (
            <>
              {/* 업로드된 사진 미리보기 */}
              <div
                className="h-16 w-16 rounded-full border border-line bg-cover bg-center"
                style={{ backgroundImage: `url(${photoUrl})` }}
              />
              <div className="text-[13px] font-semibold">대표 사진 첨부됨</div>
              <div className="text-[11px] text-sub">탭하면 다른 사진으로 변경할 수 있어요</div>
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
              <div className="text-[11px] text-sub">탭해서 사진 골라주세요 (최대 5MB)</div>
            </>
          )}
        </button>
        {uploadError && (
          <div className="mt-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[11px] leading-[1.4] text-[#991B1B]">
            {uploadError}
          </div>
        )}
      </div>
    </div>
  );
}

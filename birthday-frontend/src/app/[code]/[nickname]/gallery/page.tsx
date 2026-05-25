'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import KebabMenu, { type KebabItem } from '@/components/KebabMenu';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

interface PhotoRaw {
  id: number;
  uploaderId: number;
  url: string;
  createdAt: string;
  uploaderNickname: string;
}

interface PageMeta {
  hostId: number;
}

interface StoredUser {
  id: number;
  nickname: string;
  token: string;
}

export default function GalleryPage() {
  const router = useRouter();
  const params = useParams<{ code: string; nickname: string }>();
  const code = params?.code;
  const friendNickname = params?.nickname;

  const [photos, setPhotos] = useState<PhotoRaw[] | null>(null);
  const [pageMeta, setPageMeta] = useState<PageMeta | null>(null);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 로그인된 유저 불러오기 (... 메뉴 권한 판단용)
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('birthday-user') : null;
    if (!raw) return;
    try {
      setCurrentUser(JSON.parse(raw) as StoredUser);
    } catch {}
  }, []);

  // 페이지 메타(hostId) 불러오기
  useEffect(() => {
    if (!code) return;
    fetch(`${API_BASE}/pages/${code}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PageMeta | null) => data && setPageMeta(data))
      .catch(() => {});
  }, [code]);

  // 사진 삭제
  const handleDelete = async (id: number) => {
    if (!code) return;
    if (!confirm('이 사진을 삭제할까요?')) return;
    try {
      await api.delete(`/pages/${code}/photos/${id}`);
      setPhotos((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제 실패');
    }
  };

  // 전체 사진 fetch
  const loadPhotos = () => {
    if (!code) return;
    fetch(`${API_BASE}/pages/${code}/photos?all=true`)
      .then(async (res) => {
        if (!res.ok) throw new Error('사진을 불러오지 못했어요');
        return res.json();
      })
      .then((data: PhotoRaw[]) => setPhotos(data))
      .catch((e: Error) => setError(e.message));
  };

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // 사진 추가 핸들러 (업로드 → POST /photos → 목록 새로고침)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !code) return;

    // user 체크 — 없으면 /start로 (다시 돌아오게 redirect 박음)
    const raw = localStorage.getItem('birthday-user');
    if (!raw) {
      const back = `/${code}/${friendNickname}/gallery`;
      router.push(`/start?redirect=${encodeURIComponent(back)}`);
      return;
    }
    const user: StoredUser = JSON.parse(raw);

    setUploading(true);
    setUploadError(null);
    try {
      // 1) 파일 업로드 → URL 받기
      const form = new FormData();
      form.append('file', file);
      const upRes = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
      if (!upRes.ok) {
        const body = await upRes.json().catch(() => ({}));
        setUploadError(body.message ?? '사진 업로드 실패');
        return;
      }
      const { url } = await upRes.json();

      // 2) 갤러리에 등록
      const regRes = await fetch(`${API_BASE}/pages/${code}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploaderId: user.id, url }),
      });
      if (!regRes.ok) {
        const body = await regRes.json().catch(() => ({}));
        setUploadError(body.message ?? '갤러리 등록 실패');
        return;
      }

      // 3) 목록 새로고침
      loadPhotos();
    } catch {
      setUploadError('네트워크 오류. 백엔드 서버 켜져있나요?');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const friendName = friendNickname ? decodeURIComponent(friendNickname) : '친구';

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
          GALLERY
        </div>
        <h1 className="font-display text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-ink">
          {friendName}의 사진 갤러리
        </h1>
        {photos && photos.length > 0 && (
          <p className="mt-2.5 text-[14px] leading-[1.5] text-sub">
            총 <b className="text-ink">{photos.length}</b>장
          </p>
        )}
      </div>

      {/* 본문 */}
      <div className="px-5">
        {error && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12px] leading-[1.5] text-[#991B1B]">
            {error}
          </div>
        )}

        {!error && photos === null && (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] w-full animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>
        )}

        {!error && photos && photos.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface px-5 py-10 text-center">
            <div className="mb-2 text-[24px]">📸</div>
            <p className="text-[13px] leading-[1.55] text-sub">
              아직 사진이 없어요
              <br />
              아래 버튼으로 첫 사진을 올려보세요
            </p>
          </div>
        )}

        {!error && photos && photos.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {photos.map((p) => {
              const canDelete =
                !!currentUser &&
                (currentUser.id === p.uploaderId || currentUser.id === pageMeta?.hostId);
              const items: KebabItem[] = [];
              if (canDelete) {
                items.push({
                  label: '삭제',
                  danger: true,
                  onClick: () => handleDelete(p.id),
                });
              }
              return (
                <div key={p.id} className="rounded-xl border border-line bg-surface">
                  <div className="overflow-hidden rounded-t-xl">
                    <button
                      type="button"
                      onClick={() => router.push(`/${code}/${friendNickname}/gallery/${p.id}`)}
                      className="block aspect-[4/3] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${p.url})` }}
                      aria-label="사진 상세 보기"
                    />
                  </div>
                  <div className="relative flex items-center justify-between px-3 py-2">
                    <span className="text-[11px] font-bold text-ink/80">
                      {p.uploaderNickname}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-ink/55">
                        {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                      {items.length > 0 && <KebabMenu items={items} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {uploadError && (
          <div className="mt-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12px] leading-[1.5] text-[#991B1B]">
            {uploadError}
          </div>
        )}
      </div>

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 하단 고정 — 사진 추가 CTA */}
      <div className="fixed inset-x-0 bottom-0 z-[5] bg-gradient-to-b from-transparent to-bg to-[40%] px-5 pb-6 pt-4">
        <div className="mx-auto max-w-[480px]">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-cta bg-ink text-[15px] font-semibold tracking-[-0.01em] text-white transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? '업로드 중…' : '사진 추가하기'}
            {!uploading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

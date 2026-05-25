'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import KebabMenu, { type KebabItem } from '@/components/KebabMenu';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

interface PhotoDetail {
  id: number;
  uploaderId: number;
  url: string;
  createdAt: string;
  uploaderNickname: string;
}

interface PageMeta {
  hostId: number;
}

interface CommentRaw {
  id: number;
  authorId: number;
  content: string;
  createdAt: string;
  authorNickname: string;
}

interface StoredUser {
  id: number;
  nickname: string;
  token: string;
}

const MAX_COMMENT_LEN = 300;

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return '방금';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  return new Date(iso).toLocaleDateString('ko-KR');
}

export default function PhotoDetailPage() {
  const router = useRouter();
  const params = useParams<{ code: string; nickname: string; photoId: string }>();
  const code = params?.code;
  const friendNickname = params?.nickname;
  const photoId = params?.photoId ? Number(params.photoId) : NaN;

  const [photo, setPhoto] = useState<PhotoDetail | null>(null);
  const [pageMeta, setPageMeta] = useState<PageMeta | null>(null);
  const [comments, setComments] = useState<CommentRaw[] | null>(null);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  // 로그인 유저 로드
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('birthday-user') : null;
    if (!raw) return;
    try {
      setCurrentUser(JSON.parse(raw) as StoredUser);
    } catch {}
  }, []);

  // 사진 + 페이지 메타 + 댓글 동시 로드
  useEffect(() => {
    if (!code || Number.isNaN(photoId)) return;

    fetch(`${API_BASE}/pages/${code}/photos/${photoId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('사진을 찾을 수 없어요');
        return res.json();
      })
      .then((data: PhotoDetail) => setPhoto(data))
      .catch((e: Error) => setError(e.message));

    fetch(`${API_BASE}/pages/${code}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PageMeta | null) => data && setPageMeta(data))
      .catch(() => {});

    fetch(`${API_BASE}/pages/${code}/photos/${photoId}/comments`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: CommentRaw[]) => setComments(data))
      .catch(() => setComments([]));
  }, [code, photoId]);

  // 댓글 작성
  const handlePost = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !code || Number.isNaN(photoId)) return;

    if (!currentUser) {
      const back = `/${code}/${friendNickname}/gallery/${photoId}`;
      router.push(`/start?redirect=${encodeURIComponent(back)}`);
      return;
    }

    setPosting(true);
    try {
      const created = await api.post<CommentRaw>(
        `/pages/${code}/photos/${photoId}/comments`,
        { content: trimmed },
        { auth: true },
      );
      setComments((prev) => (prev ? [...prev, created] : [created]));
      setNewComment('');
    } catch (e) {
      alert(e instanceof Error ? e.message : '댓글 작성 실패');
    } finally {
      setPosting(false);
    }
  };

  // 댓글 수정
  const handleCommentEdit = async (id: number, newContent: string) => {
    if (!code || Number.isNaN(photoId)) return;
    try {
      const updated = await api.patch<CommentRaw>(
        `/pages/${code}/photos/${photoId}/comments/${id}`,
        { content: newContent },
      );
      setComments((prev) =>
        prev ? prev.map((c) => (c.id === id ? updated : c)) : prev,
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : '수정 실패');
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (id: number) => {
    if (!code || Number.isNaN(photoId)) return;
    try {
      await api.delete(`/pages/${code}/photos/${photoId}/comments/${id}`);
      setComments((prev) => (prev ? prev.filter((c) => c.id !== id) : prev));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제 실패');
    }
  };

  // 사진 삭제
  const handlePhotoDelete = async () => {
    if (!code || Number.isNaN(photoId)) return;
    if (!confirm('이 사진을 삭제할까요?')) return;
    try {
      await api.delete(`/pages/${code}/photos/${photoId}`);
      router.replace(`/${code}/${friendNickname}/gallery`);
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제 실패');
    }
  };

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center bg-bg px-6 text-center font-body text-ink">
        <div className="mb-2 font-display text-[20px] font-bold">{error}</div>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-3 text-[13px] text-sub underline"
        >
          돌아가기
        </button>
      </main>
    );
  }

  if (!photo) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center bg-bg font-body text-ink">
        <div className="font-mono text-[12px] text-sub">불러오는 중…</div>
      </main>
    );
  }

  const canDeletePhoto =
    !!currentUser &&
    (currentUser.id === photo.uploaderId || currentUser.id === pageMeta?.hostId);

  const photoMenuItems: KebabItem[] = [];
  if (canDeletePhoto) {
    photoMenuItems.push({
      label: '사진 삭제',
      danger: true,
      onClick: handlePhotoDelete,
    });
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[480px] bg-bg pb-32 font-body text-ink">
      {/* sticky 헤더 */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-bg px-4 pb-4 pt-[52px]">
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
        {photoMenuItems.length > 0 && <KebabMenu items={photoMenuItems} />}
      </div>

      {/* 사진 */}
      <div className="px-4">
        <div
          className="aspect-square w-full rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${photo.url})` }}
        />
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="text-[13px] font-bold text-ink">{photo.uploaderNickname}</span>
          <span className="text-[11px] text-sub">{relativeTime(photo.createdAt)}</span>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <section className="mt-7 px-4">
        <h2 className="mb-3 font-display text-[16px] font-bold tracking-[-0.01em] text-ink">
          댓글 {comments?.length ?? 0}
        </h2>

        {comments === null ? (
          <div className="text-[12px] text-sub">불러오는 중…</div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-line bg-surface px-4 py-6 text-center text-[13px] text-sub">
            첫 댓글을 남겨보세요
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {comments.map((c) => (
              <CommentCard
                key={c.id}
                comment={c}
                currentUserId={currentUser?.id ?? null}
                hostId={pageMeta?.hostId ?? null}
                onEdit={handleCommentEdit}
                onDelete={handleCommentDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* 하단 고정 — 댓글 입력 */}
      <div className="fixed inset-x-0 bottom-0 z-[5] bg-bg px-4 pb-5 pt-3">
        <div className="mx-auto flex max-w-[480px] items-end gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value.slice(0, MAX_COMMENT_LEN))}
            placeholder={currentUser ? '댓글 남기기…' : '로그인하고 댓글 남기기'}
            rows={1}
            className="flex-1 resize-none rounded-[18px] border-[1.5px] border-line bg-surface px-4 py-2.5 text-[14px] leading-[1.4] text-ink outline-none focus:border-ink"
          />
          <button
            type="button"
            onClick={handlePost}
            disabled={posting || newComment.trim().length === 0}
            className="h-10 rounded-chip bg-ink px-4 text-[13px] font-semibold text-white disabled:opacity-30"
          >
            {posting ? '…' : '등록'}
          </button>
        </div>
      </div>
    </main>
  );
}

function CommentCard({
  comment,
  currentUserId,
  hostId,
  onEdit,
  onDelete,
}: {
  comment: CommentRaw;
  currentUserId: number | null;
  hostId: number | null;
  onEdit: (id: number, newContent: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [busy, setBusy] = useState(false);

  const canEdit = !!currentUserId && currentUserId === comment.authorId;
  const canDelete =
    !!currentUserId &&
    (currentUserId === comment.authorId || currentUserId === hostId);

  const items: KebabItem[] = [];
  if (canEdit) {
    items.push({
      label: '수정',
      onClick: () => {
        setDraft(comment.content);
        setEditing(true);
      },
    });
  }
  if (canDelete) {
    items.push({
      label: '삭제',
      danger: true,
      onClick: async () => {
        if (!confirm('이 댓글을 삭제할까요?')) return;
        await onDelete(comment.id);
      },
    });
  }

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0 || trimmed === comment.content) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      await onEdit(comment.id, trimmed);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-line bg-surface px-3.5 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-ink">{comment.authorNickname}</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-sub">{relativeTime(comment.createdAt)}</span>
          {items.length > 0 && <KebabMenu items={items} />}
        </div>
      </div>
      {editing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_COMMENT_LEN))}
            className="mt-2 min-h-[60px] w-full resize-none rounded-lg border border-line bg-bg px-3 py-2 text-[14px] leading-[1.45] text-ink outline-none focus:border-ink/40"
            autoFocus
          />
          <div className="mt-1.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-chip bg-muted px-3 py-1 text-[12px] font-semibold text-ink"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="rounded-chip bg-ink px-3 py-1 text-[12px] font-semibold text-white disabled:opacity-40"
            >
              {busy ? '저장 중…' : '저장'}
            </button>
          </div>
        </>
      ) : (
        <p className="mt-1 whitespace-pre-line break-keep text-[14px] leading-[1.5] text-ink">
          {comment.content}
        </p>
      )}
    </div>
  );
}
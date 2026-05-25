'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import KebabMenu, { type KebabItem } from '@/components/KebabMenu';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

const FALLBACK_CARD_COLORS = ['#FFD6E5', '#CFE3FF', '#FFE7C2', '#C2F1E2', '#DCD2FF', '#FFD0D6'];

interface MessageRaw {
  id: number;
  authorId: number;
  content: string;
  photoUrl: string | null;
  cardColor: string | null;
  createdAt: string;
  authorNickname: string;
}

interface PageMeta {
  hostId: number;
}

interface StoredUser {
  id: number;
  nickname: string;
  token: string;
}

// "방금", "5분 전" 같은 상대 시간
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

export default function MessagesPage() {
  const router = useRouter();
  const params = useParams<{ code: string; nickname: string }>();
  const code = params?.code;
  const friendNickname = params?.nickname;

  const [messages, setMessages] = useState<MessageRaw[] | null>(null);
  const [pageMeta, setPageMeta] = useState<PageMeta | null>(null);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('birthday-user') : null;
    if (!raw) return;
    try {
      setCurrentUser(JSON.parse(raw) as StoredUser);
    } catch {}
  }, []);

  useEffect(() => {
    if (!code) return;
    fetch(`${API_BASE}/pages/${code}/messages?all=true`)
      .then(async (res) => {
        if (!res.ok) throw new Error('축하글을 불러오지 못했어요');
        return res.json();
      })
      .then((data: MessageRaw[]) => setMessages(data))
      .catch((e: Error) => setError(e.message));
    fetch(`${API_BASE}/pages/${code}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PageMeta | null) => data && setPageMeta(data))
      .catch(() => {});
  }, [code]);

  const handleEdit = async (id: number, newContent: string) => {
    if (!code) return;
    try {
      const updated = await api.patch<MessageRaw>(
        `/pages/${code}/messages/${id}`,
        { content: newContent },
      );
      setMessages((prev) =>
        prev ? prev.map((m) => (m.id === id ? { ...m, content: updated.content } : m)) : prev,
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : '수정 실패');
    }
  };

  const handleDelete = async (id: number) => {
    if (!code) return;
    try {
      await api.delete(`/pages/${code}/messages/${id}`);
      setMessages((prev) => (prev ? prev.filter((m) => m.id !== id) : prev));
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제 실패');
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
          ALL MESSAGES
        </div>
        <h1 className="font-display text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-ink">
          {friendName}에게 온 축하글
        </h1>
        {messages && messages.length > 0 && (
          <p className="mt-2.5 text-[14px] leading-[1.5] text-sub">
            총 <b className="text-ink">{messages.length}</b>개
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

        {!error && messages === null && (
          <div className="flex flex-col gap-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[100px] animate-pulse rounded-2xl border border-line bg-surface"
              />
            ))}
          </div>
        )}

        {!error && messages && messages.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface px-5 py-10 text-center">
            <div className="mb-2 text-[24px]">💌</div>
            <p className="text-[13px] leading-[1.55] text-sub">
              아직 축하글이 없어요
              <br />
              첫 번째 축하의 주인공이 되어보세요
            </p>
          </div>
        )}

        {!error && messages && messages.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {messages.map((m, i) => (
              <MessageCard
                key={m.id}
                message={m}
                fallbackIndex={i}
                currentUserId={currentUser?.id ?? null}
                hostId={pageMeta?.hostId ?? null}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 고정 — 축하글 남기기 CTA */}
      <div className="fixed inset-x-0 bottom-0 z-[5] bg-gradient-to-b from-transparent to-bg to-[40%] px-5 pb-6 pt-4">
        <div className="mx-auto max-w-[480px]">
          <button
            type="button"
            onClick={() => router.push(`/${code}/${friendNickname}/write`)}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-cta bg-ink text-[15px] font-semibold tracking-[-0.01em] text-white"
          >
            나도 축하글 남기기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// 메시지 카드 한 장 — 전체 목록용. 권한 있을 땐 ... 메뉴/인라인 수정.
function MessageCard({
  message,
  fallbackIndex,
  currentUserId,
  hostId,
  onEdit,
  onDelete,
}: {
  message: MessageRaw;
  fallbackIndex: number;
  currentUserId: number | null;
  hostId: number | null;
  onEdit: (id: number, newContent: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const bg =
    message.cardColor ?? FALLBACK_CARD_COLORS[fallbackIndex % FALLBACK_CARD_COLORS.length];

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [busy, setBusy] = useState(false);

  const canEdit = !!currentUserId && currentUserId === message.authorId;
  const canDelete =
    !!currentUserId &&
    (currentUserId === message.authorId || currentUserId === hostId);

  const items: KebabItem[] = [];
  if (canEdit) {
    items.push({
      label: '수정',
      onClick: () => {
        setDraft(message.content);
        setEditing(true);
      },
    });
  }
  if (canDelete) {
    items.push({
      label: '삭제',
      danger: true,
      onClick: async () => {
        if (!confirm('이 축하글을 삭제할까요?')) return;
        await onDelete(message.id);
      },
    });
  }

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0 || trimmed === message.content) {
      setEditing(false);
      return;
    }
    setBusy(true);
    try {
      await onEdit(message.id, trimmed);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="rounded-2xl px-4 py-3.5 shadow-[0_4px_12px_-8px_rgba(0,0,0,0.12)]"
      style={{ background: bg }}
    >
      {/* 첨부 사진 (있으면) */}
      {message.photoUrl && (
        <div
          className="mb-2.5 h-40 w-full rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${message.photoUrl})` }}
        />
      )}
      {editing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 500))}
            className="min-h-[100px] w-full resize-none rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-[15px] leading-[1.55] text-ink outline-none focus:border-ink/40"
            autoFocus
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-chip bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-ink"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="rounded-chip bg-ink px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
            >
              {busy ? '저장 중…' : '저장'}
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-start justify-between gap-2">
          <p className="flex-1 whitespace-pre-line break-keep text-[15px] leading-[1.55] text-ink">
            {message.content}
          </p>
          {items.length > 0 && <KebabMenu items={items} className="-mr-1" />}
        </div>
      )}
      <div className="mt-2.5 flex items-center justify-between">
        <div className="text-[11px] font-bold text-ink/80">
          {message.authorNickname}
        </div>
        <div className="text-[10px] text-ink/55">{relativeTime(message.createdAt)}</div>
      </div>
    </div>
  );
}
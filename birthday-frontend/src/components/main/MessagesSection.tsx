'use client';

import { useState } from 'react';
import KebabMenu, { type KebabItem } from '@/components/KebabMenu';

export interface MessagePreview {
  id: number;
  authorId: number;
  name: string;
  text: string;
  cardColor: string; // 파스텔 hex
  time: string;
}

interface Props {
  messages: MessagePreview[]; // 3개까지만 미리보기
  onSeeAll?: () => void;
  onWrite?: () => void;
  /** 현재 로그인된 유저 id. null이면 메뉴 안 보임. */
  currentUserId?: number | null;
  /** 페이지 호스트 id (메시지 삭제 권한 판단용) */
  hostId?: number | null;
  onEdit?: (id: number, newContent: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

// 친구들의 축하글 큰 블록. 섹션 헤더 + 카드 3개 (3줄 클램프) + 더보기 버튼.
export default function MessagesSection({
  messages,
  onSeeAll,
  onWrite,
  currentUserId,
  hostId,
  onEdit,
  onDelete,
}: Props) {
  const previews = messages.slice(0, 3);

  return (
    <section className="mt-9">
      {/* 섹션 헤더 */}
      <div className="mb-3 flex items-baseline justify-between px-6">
        <h2 className="font-display text-[18px] font-bold tracking-[-0.01em] text-ink">
          친구들의 축하글
        </h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="bg-transparent text-[12px] text-ink/55"
        >
          전체 보기 →
        </button>
      </div>

      {/* 카드 리스트 or 빈 상태 */}
      <div className="px-[18px]">
        {previews.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface px-5 py-8 text-center">
            <div className="mb-1.5 text-[22px]">💌</div>
            <p className="text-[13px] leading-[1.55] text-sub">
              아직 축하글이 없어요
              <br />
              첫 번째 축하의 주인공이 되어보세요
            </p>
            {onWrite && (
              <button
                type="button"
                onClick={onWrite}
                className="mt-4 h-11 w-full rounded-chip bg-ink text-[13px] font-semibold text-white"
              >
                축하글 쓰러 가기
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {previews.map((m) => (
              <MessageCard
                key={m.id}
                message={m}
                currentUserId={currentUserId}
                hostId={hostId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* 더보기 버튼 — 메시지 있을 때만 */}
      {previews.length > 0 && (
        <div className="px-[18px] pt-3">
          <button
            type="button"
            onClick={onSeeAll}
            className="h-12 w-full rounded-chip border-[1.5px] border-ink/15 bg-surface text-[13px] font-semibold text-ink"
          >
            축하글 더보기
          </button>
        </div>
      )}
    </section>
  );
}

// 메시지 카드 한 장. 본문 3줄까지만 노출. 권한 있을 땐 ... 메뉴/인라인 수정.
function MessageCard({
  message,
  currentUserId,
  hostId,
  onEdit,
  onDelete,
}: {
  message: MessagePreview;
  currentUserId?: number | null;
  hostId?: number | null;
  onEdit?: (id: number, newContent: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.text);
  const [busy, setBusy] = useState(false);

  const canEdit = !!currentUserId && currentUserId === message.authorId;
  const canDelete =
    !!currentUserId &&
    (currentUserId === message.authorId || currentUserId === hostId);

  const items: KebabItem[] = [];
  if (canEdit && onEdit) {
    items.push({
      label: '수정',
      onClick: () => {
        setDraft(message.text);
        setEditing(true);
      },
    });
  }
  if (canDelete && onDelete) {
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
    if (!onEdit) return;
    const trimmed = draft.trim();
    if (trimmed.length === 0 || trimmed === message.text) {
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
      style={{ background: message.cardColor }}
    >
      {editing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 500))}
            className="min-h-[80px] w-full resize-none rounded-xl border border-ink/10 bg-white/80 px-3 py-2 text-[15px] leading-[1.55] text-ink outline-none focus:border-ink/40"
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
        <>
          <div className="flex items-start justify-between gap-2">
            {/* 본문 — 3줄 클램프 */}
            <p
              className="flex-1 break-keep text-[15px] leading-[1.55] text-ink"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {message.text}
            </p>
            {items.length > 0 && <KebabMenu items={items} className="-mr-1" />}
          </div>
          {/* 하단: 작성자 + 시간 */}
          <div className="mt-2.5 flex items-center justify-between">
            <div className="text-[11px] font-bold text-ink/80">{message.name}</div>
            <div className="text-[10px] text-ink/55">{message.time}</div>
          </div>
        </>
      )}
    </div>
  );
}
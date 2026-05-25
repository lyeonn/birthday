'use client';

export interface MessagePreview {
  id: number | string;
  name: string;
  text: string;
  cardColor: string; // 파스텔 hex
  time: string;
}

interface Props {
  messages: MessagePreview[]; // 3개까지만 미리보기
  onSeeAll?: () => void;
  onWrite?: () => void;
}

// 친구들의 축하글 큰 블록. 섹션 헤더 + 카드 3개 (3줄 클램프) + 더보기 버튼.
export default function MessagesSection({ messages, onSeeAll, onWrite }: Props) {
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
              <MessageCard key={m.id} message={m} />
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

// 메시지 카드 한 장. 본문 3줄까지만 노출.
function MessageCard({ message }: { message: MessagePreview }) {
  return (
    <div
      className="rounded-2xl px-4 py-3.5 shadow-[0_4px_12px_-8px_rgba(0,0,0,0.12)]"
      style={{ background: message.cardColor }}
    >
      {/* 본문 — 3줄 클램프 */}
      <p
        className="break-keep text-[15px] leading-[1.55] text-ink"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {message.text}
      </p>
      {/* 하단: 작성자 + 시간 */}
      <div className="mt-2.5 flex items-center justify-between">
        <div className="text-[11px] font-bold text-ink/80">{message.name}</div>
        <div className="text-[10px] text-ink/55">{message.time}</div>
      </div>
    </div>
  );
}

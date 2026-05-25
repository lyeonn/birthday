'use client';

export interface GalleryPhoto {
  id: number | string;
  label?: string;
  url?: string;
  tint?: string;
}

interface Props {
  photos: GalleryPhoto[]; // 미리보기 4장
  onSeeAll?: () => void;
}

// 사진 갤러리. 섹션 헤더 + 2×2 그리드 (4장) + "사진 더보기" 버튼.
export default function GallerySection({ photos, onSeeAll }: Props) {
  const previews = photos.slice(0, 4);

  return (
    <section className="mt-9">
      {/* 섹션 헤더 */}
      <div className="mb-3 flex items-baseline justify-between px-6">
        <h2 className="font-display text-[18px] font-bold tracking-[-0.01em] text-ink">
          사진 갤러리
        </h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="bg-transparent text-[12px] text-ink/55"
        >
          전체 보기 →
        </button>
      </div>

      {/* 2×2 그리드 or 빈 상태 */}
      <div className="px-[18px]">
        {previews.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface px-5 py-8 text-center">
            <div className="mb-1.5 text-[22px]">📸</div>
            <p className="mb-4 text-[13px] leading-[1.55] text-sub">
              아직 갤러리에 사진이 없어요
              <br />
              첫 사진을 추가해보세요
            </p>
            <button
              type="button"
              onClick={onSeeAll}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-chip border-[1.5px] border-ink/15 bg-surface px-5 text-[13px] font-semibold text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              사진 추가하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {previews.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={onSeeAll}
                className="aspect-square overflow-hidden rounded-xl border border-line"
                style={{
                  background: p.url
                    ? undefined
                    : `repeating-linear-gradient(45deg, ${p.tint ?? '#FFD6E5'}22, ${p.tint ?? '#FFD6E5'}22 8px, ${p.tint ?? '#FFD6E5'}11 8px, ${p.tint ?? '#FFD6E5'}11 16px)`,
                  backgroundImage: p.url ? `url(${p.url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!p.url && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-ink/55">
                    {p.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 사진 더보기 버튼 — 사진 있을 때만 */}
      {previews.length > 0 && (
        <div className="px-[18px] pt-3">
          <button
            type="button"
            onClick={onSeeAll}
            className="h-12 w-full rounded-chip border-[1.5px] border-ink/15 bg-surface text-[13px] font-semibold text-ink"
          >
            사진 더보기
          </button>
        </div>
      )}
    </section>
  );
}

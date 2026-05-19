'use client';

export interface GalleryPhoto {
  id: number | string;
  label?: string;
  url?: string; // 실제 사진 URL (없으면 placeholder 패턴)
  tint?: string; // placeholder 색
}

interface Props {
  photos: GalleryPhoto[]; // 6장까지 미리보기
  onSeeAll?: () => void;
}

// 사진 갤러리 큰 블록. 섹션 헤더 + 3×2 그리드 (6장).
export default function GallerySection({ photos, onSeeAll }: Props) {
  const previews = photos.slice(0, 6);

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

      {/* 3열 그리드 */}
      <div className="grid grid-cols-3 gap-1.5 px-[18px]">
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
    </section>
  );
}

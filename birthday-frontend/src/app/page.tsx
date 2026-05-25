import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-bg px-6 pb-10 pt-[72px] font-body text-ink">
      <div className="font-mono text-[11px] font-bold tracking-[0.18em] text-sub">
        BIRTHDAY · FOR A FRIEND
      </div>

      <h1 className="mt-3 whitespace-pre-line font-display text-[34px] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
        {'친구 생일,\n페이지로 선물해요'}
      </h1>
      <p className="mt-3 text-[14px] leading-[1.55] text-sub">
        카운트다운, 축하 메시지, 사진까지 한 장에. 링크 하나로 친구에게 보내요.
      </p>

      <ul className="mt-10 flex flex-col gap-3">
        <FeatureRow
          k="01"
          title="D-DAY 카운트다운"
          desc="생일까지 남은 시간을 큼직하게"
        />
        <FeatureRow
          k="02"
          title="축하 메시지 모음"
          desc="친구들이 한마디씩 남길 수 있어요"
        />
        <FeatureRow
          k="03"
          title="사진 갤러리"
          desc="추억 사진을 함께 담아요"
        />
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-12">
        <Link
          href="/start"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-cta bg-ink text-[15px] font-semibold tracking-[-0.01em] text-white transition-opacity duration-150 hover:opacity-90"
        >
          내 생일 페이지 만들기
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14m-6-6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <Link
          href="/start"
          className="text-center text-[13px] text-sub underline-offset-4 hover:underline"
        >
          이미 만들어 봤어요 · 로그인
        </Link>
      </div>
    </main>
  );
}

function FeatureRow({
  k,
  title,
  desc,
}: {
  k: string;
  title: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-4 rounded-field border-[1.5px] border-line bg-surface px-4 py-4">
      <span className="mt-0.5 font-mono text-[11px] font-bold tracking-[0.18em] text-sub">
        {k}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        <span className="mt-1 block text-[12px] leading-[1.5] text-sub">{desc}</span>
      </span>
    </li>
  );
}

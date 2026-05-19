// countdown.jsx — 3가지 카운트다운 스타일
// digital: 큰 디지털 숫자 / flip: 플립카드 / morph: 부드러운 변환

function useCountdown(targetISO) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick(x => x+1), 1000);
    return () => clearInterval(t);
  }, []);
  return getTimeLeft(targetISO);
}

// ── 1. 디지털 시계 스타일
function CountdownDigital({ time, vibe }) {
  const v = VIBES[vibe];
  const cells = [
    { v: time.days, label: 'DAYS' },
    { v: time.hours, label: 'HRS' },
    { v: time.minutes, label: 'MIN' },
    { v: time.seconds, label: 'SEC' },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
      width: '100%',
    }}>
      {cells.map((c,i)=>(
        <div key={i} style={{
          background: v.surface,
          borderRadius: v.cardRadius,
          padding: '14px 4px 10px',
          textAlign: 'center',
          border: v.border || `1px solid ${v.ink}10`,
          boxShadow: v.cardShadow,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 36, fontWeight: 500,
            lineHeight: 1, letterSpacing: '-0.04em',
            color: v.ink,
            fontVariantNumeric: 'tabular-nums',
          }}>{pad2(c.v)}</div>
          <div style={{
            fontSize: 9, fontWeight: 600,
            letterSpacing: '0.16em',
            color: v.accent,
            marginTop: 6,
          }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── 2. 플립 카드
function FlipCell({ value, label, vibe }) {
  const v = VIBES[vibe];
  const [prev, setPrev] = React.useState(value);
  const [flipping, setFlipping] = React.useState(false);
  React.useEffect(() => {
    if (value !== prev) {
      setFlipping(true);
      const t = setTimeout(() => { setPrev(value); setFlipping(false); }, 500);
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <div style={{ textAlign:'center', flex: 1 }}>
      <div style={{
        position: 'relative',
        background: v.ink,
        color: '#fff',
        borderRadius: 10,
        height: 64,
        overflow: 'hidden',
        boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.3)',
      }}>
        {/* 가운데 분할선 */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
          background: 'rgba(255,255,255,0.1)', zIndex: 2,
        }}/>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 38, fontWeight: 500,
          lineHeight: '64px',
          letterSpacing: '-0.04em',
          fontVariantNumeric: 'tabular-nums',
          transform: flipping ? 'rotateX(-90deg)' : 'none',
          transformOrigin: 'center',
          transition: 'transform 0.5s cubic-bezier(.4,0,.2,1)',
        }}>{pad2(flipping ? prev : value)}</div>
      </div>
      <div style={{
        fontSize: 10, fontWeight: 600,
        letterSpacing: '0.16em',
        color: v.ink + 'aa',
        marginTop: 8,
      }}>{label}</div>
    </div>
  );
}
function CountdownFlip({ time, vibe }) {
  return (
    <div style={{ display:'flex', gap: 6, width:'100%' }}>
      <FlipCell value={time.days} label="DAYS" vibe={vibe}/>
      <FlipCell value={time.hours} label="HRS" vibe={vibe}/>
      <FlipCell value={time.minutes} label="MIN" vibe={vibe}/>
      <FlipCell value={time.seconds} label="SEC" vibe={vibe}/>
    </div>
  );
}

// ── 3. Morph (부드럽게 슬라이드 업)
function MorphCell({ value, label, vibe }) {
  const v = VIBES[vibe];
  const [prev, setPrev] = React.useState(value);
  const [animating, setAnimating] = React.useState(false);
  React.useEffect(() => {
    if (value !== prev) {
      setAnimating(true);
      const t = setTimeout(() => { setPrev(value); setAnimating(false); }, 380);
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <div style={{ textAlign:'center', flex: 1 }}>
      <div style={{
        position:'relative',
        height: 56, overflow:'hidden',
      }}>
        <div style={{
          fontFamily: v.fontDisplay,
          fontSize: 48, fontWeight: 700,
          lineHeight: 1, letterSpacing: '-0.04em',
          color: v.accent,
          fontVariantNumeric: 'tabular-nums',
          transform: animating ? 'translateY(-100%)' : 'translateY(0)',
          opacity: animating ? 0 : 1,
          transition: 'transform .38s cubic-bezier(.5,.0,.2,1), opacity .38s',
        }}>{pad2(prev)}</div>
        {animating && (
          <div style={{
            position:'absolute', top:0, left:0, right:0,
            fontFamily: v.fontDisplay,
            fontSize: 48, fontWeight: 700,
            lineHeight: 1, letterSpacing: '-0.04em',
            color: v.accent,
            fontVariantNumeric: 'tabular-nums',
            animation: 'morphIn .38s cubic-bezier(.5,.0,.2,1) both',
          }}>{pad2(value)}</div>
        )}
      </div>
      <div style={{
        fontSize: 10, fontWeight: 600,
        letterSpacing: '0.16em',
        color: v.ink + '88',
        marginTop: 6,
      }}>{label}</div>
    </div>
  );
}
function CountdownMorph({ time, vibe }) {
  return (
    <div style={{ display:'flex', gap: 4, width:'100%', alignItems:'flex-start' }}>
      <MorphCell value={time.days} label="DAYS" vibe={vibe}/>
      <Sep/>
      <MorphCell value={time.hours} label="HOURS" vibe={vibe}/>
      <Sep/>
      <MorphCell value={time.minutes} label="MIN" vibe={vibe}/>
      <Sep/>
      <MorphCell value={time.seconds} label="SEC" vibe={vibe}/>
    </div>
  );
}
function Sep(){
  return <div style={{ paddingTop: 6, fontSize: 36, color: 'rgba(0,0,0,0.15)', fontWeight: 300 }}>·</div>;
}

// ── 통합 카운트다운
function Countdown({ targetISO, style = 'digital', vibe = 'sweet' }) {
  const time = useCountdown(targetISO);
  if (style === 'flip') return <CountdownFlip time={time} vibe={vibe}/>;
  if (style === 'morph') return <CountdownMorph time={time} vibe={vibe}/>;
  return <CountdownDigital time={time} vibe={vibe}/>;
}

// 추가 키프레임
if (typeof document !== 'undefined' && !document.getElementById('cd-keyframes')) {
  const s = document.createElement('style');
  s.id = 'cd-keyframes';
  s.textContent = `
    @keyframes morphIn { from { transform: translateY(100%); opacity: 0;} to { transform: translateY(0); opacity: 1;} }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { Countdown, useCountdown });

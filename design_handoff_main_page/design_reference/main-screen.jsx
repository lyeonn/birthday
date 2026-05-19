// main-screen.jsx — 잠금 해제 후 메인
// 헤더(BGM/공유) + 카운트다운 + 친구 사진 + 축하문구 + 빠른액션(쓰기/보기/갤러리)

function MainScreen({ vibe, primary, friend, countdownStyle, bgmOn, setBgmOn, onNav, msgCount, isPast }) {
  const v = VIBES[vibe];
  const c = primary || v.accent;
  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: v.bg,
      paddingBottom: 32,
      fontFamily: 'var(--font-kr)',
      position: 'relative',
    }}>
      {isPast && <Confetti count={50}/>}

      {/* 상단 바 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '54px 18px 6px',
      }}>
        <button onClick={()=>setBgmOn(!bgmOn)} style={pillBtn(v)}>
          {bgmOn ? <Icons.Music/> : <Icons.MusicOff/>}
          <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 6 }}>
            {bgmOn ? 'BGM ON' : 'BGM OFF'}
          </span>
        </button>
        <button onClick={()=>onNav('share')} style={{...pillBtn(v), padding:'0 12px'}}>
          <Icons.Share/>
        </button>
      </div>

      {/* 호스트 라벨 — 생일 날짜에서 N번째 자동 계산 */}
      <div style={{
        textAlign: 'center', marginTop: 12,
        fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
        color: c, textTransform: 'uppercase',
      }}>HAPPY {getNthBirthday(friend.birthday) ? `${getNthBirthday(friend.birthday)}TH ` : ''}BIRTHDAY · {friend.name.toUpperCase()}</div>

      {/* 친구 사진 (큰 원형) */}
      <div style={{
        margin: '18px auto 0', width: 240, height: 240,
        position: 'relative',
      }}>
        <PhotoPlaceholder
          label={`${friend.name} 사진`}
          radius={vibe === 'film' ? 4 : 9999}
          vibe={vibe} tint={c}
        />
        {/* 액자 액센트 (vibe별) — 점선 회전은 sweet/minimal 둘 다 적용 */}
        {(vibe === 'sweet' || vibe === 'minimal') && (
          <div style={{
            position: 'absolute', inset: -10,
            border: `2px dashed ${c}77`, borderRadius: 9999,
            animation: 'spin 30s linear infinite',
          }}/>
        )}
        {vibe === 'y2k' && (
          <div style={{
            position: 'absolute', inset: -6,
            border: '3px solid #1B0A47', borderRadius: 9999,
            boxShadow: `6px 6px 0 ${c}`,
          }}/>
        )}
      </div>

      {/* 축하 문구 */}
      <div style={{
        margin: '24px 24px 0',
        fontFamily: v.fontDisplay,
        fontSize: vibe === 'film' ? 30 : 26,
        fontWeight: vibe === 'film' ? 700 : 700,
        lineHeight: 1.25,
        textAlign: 'center',
        color: v.ink,
        letterSpacing: '-0.02em',
        whiteSpace: 'pre-line',
      }}>{isPast ? `오늘은 ${friend.name}의\n생일이에요 🎂` : friend.greeting}</div>

      {/* 카운트다운 */}
      <div style={{ margin: '24px 18px 0' }}>
        {!isPast && (
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
            color: v.ink + '88', textAlign: 'center',
            marginBottom: 10, textTransform: 'uppercase',
          }}>D-DAY까지 남은 시간</div>
        )}
        {!isPast && <Countdown targetISO={friend.birthday} style={countdownStyle} vibe={vibe}/>}
        {isPast && (
          <div style={{
            fontFamily: v.fontDisplay,
            fontSize: 56, fontWeight: 800, textAlign:'center',
            color: c, letterSpacing: '-0.03em',
          }}>D-DAY</div>
        )}
      </div>

      {/* 축하 메시지 남기기 CTA */}
      <div style={{ margin: '28px 18px 0' }}>
        <ActionButton vibe={vibe} primary={c} icon={<Icons.Pen/>} label="축하 메시지 남기기"
          sub={`${friend.name}에게 한 마디`} onClick={()=>onNav('write')} kind="accent"/>
      </div>

      {/* 친구들의 축하글 — 3개 미리보기 + 더보기 */}
      <MessagesPreview vibe={vibe} primary={c} friend={friend} onNav={onNav}/>

      {/* 사진 갤러리 — 그리드 미리보기 */}
      <GalleryPreview vibe={vibe} primary={c} friend={friend} onNav={onNav}/>

      {/* 하단 호스트 노트 */}
      <div style={{
        margin: '28px 24px 0',
        padding: '14px 16px',
        background: v.surface,
        borderRadius: v.cardRadius * 0.7,
        border: v.border || `1px solid ${v.ink}10`,
        boxShadow: v.cardShadow,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: c, marginBottom: 6 }}>
          MADE BY {friend.hostName.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, color: v.ink, lineHeight: 1.5 }}>
          {friend.hostName}이 {friend.name}을 위해 만든 페이지예요.
          친구들이 한 마디씩 남길 수 있어요!
        </div>
      </div>
    </div>
  );
}

// ── 친구들의 축하글 (메인 임베드, 1열 스택, 3개 미리보기)
function MessagesPreview({ vibe, primary, friend, onNav }) {
  const v = VIBES[vibe];
  const messages = (typeof SAMPLE_MESSAGES !== 'undefined' ? SAMPLE_MESSAGES : []).slice(0, 3);
  return (
    <div style={{ margin: '36px 0 0' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'0 24px', marginBottom: 12 }}>
        <div style={{ fontFamily: v.fontDisplay, fontSize: 18, fontWeight: 700, color: v.ink, letterSpacing:'-0.01em' }}>
          친구들의 축하글
        </div>
        <button onClick={()=>onNav('messages')} style={{
          background:'transparent', border:'none', padding: 0,
          fontSize: 12, color: v.ink + '88', cursor:'pointer',
        }}>전체 보기 →</button>
      </div>

      <div style={{ padding:'0 18px', display:'flex', flexDirection:'column', gap: 10 }}>
        {messages.map((m) => (
          <div key={m.id} style={{
            background: m.cardColor,
            borderRadius: 16,
            padding: '14px 16px',
            boxShadow: '0 4px 12px -8px rgba(0,0,0,0.12)',
          }}>
            <div style={{
              fontSize: 13, lineHeight: 1.55, color: v.ink, wordBreak:'keep-all',
              display:'-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient:'vertical', overflow:'hidden',
            }}>{m.text}</div>
            <div style={{ marginTop: 10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: v.ink + 'cc' }}>{m.name}</div>
              <div style={{ fontSize: 10, color: v.ink + '77' }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'12px 18px 0' }}>
        <button onClick={()=>onNav('messages')} style={{
          width:'100%', height: 48, borderRadius: 999,
          background: v.surface,
          border: `1.5px solid ${v.ink}15`,
          color: v.ink, fontSize: 13, fontWeight: 600,
          cursor:'pointer',
        }}>축하글 더보기</button>
      </div>
    </div>
  );
}

// ── 사진 갤러리 (메인 임베드, 3열 그리드 미리보기)
function GalleryPreview({ vibe, primary, friend, onNav }) {
  const v = VIBES[vibe];
  const photos = [
    { id: 0, label:'졸업식', tint:'#FFD6E5' },
    { id: 1, label:'카페',   tint:'#CFE3FF' },
    { id: 2, label:'생일파티', tint:'#FFE7C2' },
    { id: 3, label:'바다',   tint:'#C2F1E2' },
    { id: 4, label:'셀카',   tint:'#DCD2FF' },
    { id: 5, label:'데일리', tint:'#FFD0D6' },
  ];
  return (
    <div style={{ margin: '36px 0 0' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'0 24px', marginBottom: 12 }}>
        <div style={{ fontFamily: v.fontDisplay, fontSize: 18, fontWeight: 700, color: v.ink, letterSpacing:'-0.01em' }}>
          사진 갤러리
        </div>
        <button onClick={()=>onNav('gallery')} style={{
          background:'transparent', border:'none', padding: 0,
          fontSize: 12, color: v.ink + '88', cursor:'pointer',
        }}>전체 보기 →</button>
      </div>

      <div style={{
        padding:'0 18px',
        display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 6,
      }}>
        {photos.map(p => (
          <button key={p.id} onClick={()=>onNav('gallery')} style={{
            aspectRatio:'1', padding: 0, border:'none',
            borderRadius: vibe === 'film' ? 4 : 12,
            cursor:'pointer', overflow:'hidden',
          }}>
            <PhotoPlaceholder label={p.label} radius={vibe === 'film' ? 4 : 12} vibe={vibe} tint={p.tint}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function pillBtn(v){
  return {
    height: 36, padding: '0 12px',
    display: 'flex', alignItems: 'center',
    background: v.surface,
    color: v.ink,
    border: v.border || `1px solid ${v.ink}10`,
    borderRadius: 999,
    boxShadow: v.cardShadow,
    cursor: 'pointer',
  };
}

function ActionButton({ vibe, primary, icon, label, sub, onClick, kind, flex }) {
  const v = VIBES[vibe];
  const isAccent = kind === 'accent';
  return (
    <button onClick={onClick} style={{
      flex: flex ? 1 : 'unset',
      display: 'flex', alignItems: 'center', gap: 12,
      height: isAccent ? 64 : 56,
      padding: '0 18px',
      borderRadius: v.cardRadius * 0.6,
      background: isAccent ? primary : v.surface,
      color: isAccent ? '#fff' : v.ink,
      border: isAccent ? 'none' : (v.border || `1px solid ${v.ink}10`),
      boxShadow: isAccent ? `0 10px 24px -10px ${primary}` : v.cardShadow,
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'transform .12s',
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 999,
        background: isAccent ? 'rgba(255,255,255,0.2)' : primary + '22',
        color: isAccent ? '#fff' : primary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{sub}</div>}
      </span>
      {!flex && <span style={{ opacity: 0.4 }}>→</span>}
    </button>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('main-keyframes')) {
  const s = document.createElement('style');
  s.id = 'main-keyframes';
  s.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { MainScreen });
